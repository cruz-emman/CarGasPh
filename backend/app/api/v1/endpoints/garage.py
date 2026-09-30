import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.vehicle import UserVehicle, VehicleMake, VehicleModel, VehicleVariant
from app.schemas.common import APIResponse
from app.schemas.vehicle_schema import UserVehicleCreate, UserVehicleOut, UserVehicleUpdate

router = APIRouter(prefix="/garage")


def format_user_vehicle(uv: UserVehicle) -> UserVehicleOut:
    """Helper to convert UserVehicle model to UserVehicleOut schema."""
    if uv.variant:
        make_name = uv.variant.model.make.name
        model_name = f"{uv.variant.model.name} {uv.variant.name}"
    else:
        make_name = uv.custom_make or "Custom"
        model_name = uv.custom_model or "Vehicle"

    economy = uv.custom_fuel_economy_kml
    range_km = round(uv.tank_capacity_liters * economy, 1)

    return UserVehicleOut(
        id=uv.id,
        user_id=uv.user_id,
        variant_id=uv.variant_id,
        make=make_name,
        model=model_name,
        year=uv.year,
        nickname=uv.nickname,
        vehicle_type=uv.vehicle_type,
        fuel_type=uv.fuel_type,
        tank_capacity_liters=uv.tank_capacity_liters,
        fuel_economy_kml=economy,
        personal_average_kml=uv.personal_average_kml,
        current_odometer_km=uv.current_odometer_km,
        is_default=uv.is_default,
        estimated_full_range_km=range_km,
        created_at=uv.created_at,
    )


@router.get("", response_model=List[UserVehicleOut], summary="List User Garage Vehicles")
async def list_garage(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieves all vehicles belonging to the authenticated user."""
    query = (
        select(UserVehicle)
        .where(UserVehicle.user_id == current_user.id)
        .options(
            selectinload(UserVehicle.variant)
            .selectinload(VehicleVariant.model)
            .selectinload(VehicleModel.make)
        )
        .order_by(UserVehicle.is_default.desc(), UserVehicle.created_at.desc())
    )

    result = await db.execute(query)
    vehicles = result.scalars().all()
    return [format_user_vehicle(v) for v in vehicles]


@router.post("", response_model=UserVehicleOut, status_code=status.HTTP_201_CREATED, summary="Add Vehicle to Garage")
async def add_vehicle(
    data: UserVehicleCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Adds a vehicle to the user's garage. If variant_id is provided, inherits specs from the Philippine catalog.
    """
    # Check existing count
    count_q = select(UserVehicle).where(UserVehicle.user_id == current_user.id)
    count_res = await db.execute(count_q)
    existing_vehicles = count_res.scalars().all()
    is_first_vehicle = len(existing_vehicles) == 0

    should_be_default = data.is_default or is_first_vehicle

    # If setting this as default, unset existing defaults
    if should_be_default and not is_first_vehicle:
        await db.execute(
            update(UserVehicle)
            .where(UserVehicle.user_id == current_user.id)
            .values(is_default=False)
        )

    # Validate variant if provided
    if data.variant_id:
        variant = await db.get(VehicleVariant, data.variant_id)
        if not variant:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Catalog variant not found.")

    new_vehicle = UserVehicle(
        id=uuid.uuid4(),
        user_id=current_user.id,
        variant_id=data.variant_id,
        custom_make=data.custom_make,
        custom_model=data.custom_model,
        year=data.year,
        nickname=data.nickname,
        vehicle_type=data.vehicle_type.lower(),
        fuel_type=data.fuel_type,
        tank_capacity_liters=data.tank_capacity_liters,
        custom_fuel_economy_kml=data.custom_fuel_economy_kml,
        current_odometer_km=data.current_odometer_km,
        is_default=should_be_default,
    )

    db.add(new_vehicle)
    await db.commit()

    # Re-fetch with relationships loaded
    q_reload = (
        select(UserVehicle)
        .where(UserVehicle.id == new_vehicle.id)
        .options(
            selectinload(UserVehicle.variant)
            .selectinload(VehicleVariant.model)
            .selectinload(VehicleModel.make)
        )
    )
    res_reload = await db.execute(q_reload)
    loaded_vehicle = res_reload.scalar_one()

    return format_user_vehicle(loaded_vehicle)


@router.get("/default", response_model=UserVehicleOut, summary="Get Active/Default Vehicle")
async def get_default_vehicle(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieves the user's primary/active default vehicle."""
    query = (
        select(UserVehicle)
        .where(UserVehicle.user_id == current_user.id, UserVehicle.is_default == True)
        .options(
            selectinload(UserVehicle.variant)
            .selectinload(VehicleVariant.model)
            .selectinload(VehicleModel.make)
        )
    )
    result = await db.execute(query)
    vehicle = result.scalar_one_or_none()

    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No default vehicle configured in garage.")

    return format_user_vehicle(vehicle)


@router.get("/{vehicle_id}", response_model=UserVehicleOut, summary="Get Specific Garage Vehicle")
async def get_vehicle(
    vehicle_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieves a single vehicle from the user's garage by ID."""
    query = (
        select(UserVehicle)
        .where(UserVehicle.id == vehicle_id, UserVehicle.user_id == current_user.id)
        .options(
            selectinload(UserVehicle.variant)
            .selectinload(VehicleVariant.model)
            .selectinload(VehicleModel.make)
        )
    )
    result = await db.execute(query)
    vehicle = result.scalar_one_or_none()

    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found in garage.")

    return format_user_vehicle(vehicle)


@router.put("/{vehicle_id}", response_model=UserVehicleOut, summary="Update Garage Vehicle")
async def update_vehicle(
    vehicle_id: uuid.UUID,
    data: UserVehicleUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Updates vehicle nickname, fuel economy, tank size, or odometer."""
    query = (
        select(UserVehicle)
        .where(UserVehicle.id == vehicle_id, UserVehicle.user_id == current_user.id)
        .options(
            selectinload(UserVehicle.variant)
            .selectinload(VehicleVariant.model)
            .selectinload(VehicleModel.make)
        )
    )
    result = await db.execute(query)
    vehicle = result.scalar_one_or_none()

    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found in garage.")

    if data.nickname is not None:
        vehicle.nickname = data.nickname
    if data.tank_capacity_liters is not None:
        vehicle.tank_capacity_liters = data.tank_capacity_liters
    if data.custom_fuel_economy_kml is not None:
        vehicle.custom_fuel_economy_kml = data.custom_fuel_economy_kml
    if data.current_odometer_km is not None:
        vehicle.current_odometer_km = data.current_odometer_km
    if data.is_default is True and not vehicle.is_default:
        await db.execute(
            update(UserVehicle)
            .where(UserVehicle.user_id == current_user.id)
            .values(is_default=False)
        )
        vehicle.is_default = True

    await db.commit()
    await db.refresh(vehicle)
    return format_user_vehicle(vehicle)


@router.patch("/{vehicle_id}/default", response_model=UserVehicleOut, summary="Set Vehicle as Default")
async def set_default_vehicle(
    vehicle_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Sets the designated vehicle as active default and unsets others."""
    query = (
        select(UserVehicle)
        .where(UserVehicle.id == vehicle_id, UserVehicle.user_id == current_user.id)
        .options(
            selectinload(UserVehicle.variant)
            .selectinload(VehicleVariant.model)
            .selectinload(VehicleModel.make)
        )
    )
    result = await db.execute(query)
    vehicle = result.scalar_one_or_none()

    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found in garage.")

    await db.execute(
        update(UserVehicle)
        .where(UserVehicle.user_id == current_user.id)
        .values(is_default=False)
    )

    vehicle.is_default = True
    await db.commit()
    await db.refresh(vehicle)

    return format_user_vehicle(vehicle)


@router.delete("/{vehicle_id}", response_model=APIResponse[dict], summary="Delete Garage Vehicle")
async def delete_vehicle(
    vehicle_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Deletes a vehicle from the garage. Automatically reassigns default if necessary."""
    query = select(UserVehicle).where(UserVehicle.id == vehicle_id, UserVehicle.user_id == current_user.id)
    result = await db.execute(query)
    vehicle = result.scalar_one_or_none()

    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found in garage.")

    was_default = vehicle.is_default
    await db.delete(vehicle)
    await db.commit()

    # If deleted vehicle was default, promote the next oldest vehicle to default
    if was_default:
        next_q = (
            select(UserVehicle)
            .where(UserVehicle.user_id == current_user.id)
            .order_by(UserVehicle.created_at.asc())
            .limit(1)
        )
        next_res = await db.execute(next_q)
        next_vehicle = next_res.scalar_one_or_none()
        if next_vehicle:
            next_vehicle.is_default = True
            await db.commit()

    return APIResponse(success=True, message="Vehicle successfully removed from your garage.")
