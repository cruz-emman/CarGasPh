from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.models.vehicle import VehicleMake, VehicleModel, VehicleVariant
from app.schemas.vehicle_schema import (
    VehicleCatalogItem,
    VehicleMakeOut,
    VehicleModelOut,
    VehicleVariantOut,
)

router = APIRouter(prefix="/vehicles")


@router.get("/makes", response_model=List[VehicleMakeOut], summary="List Vehicle Makes")
async def list_makes(
    category: Optional[str] = Query(None, description="Filter by category: motorcycle, car, suv, etc."),
    db: AsyncSession = Depends(get_db),
):
    """Returns all vehicle manufacturers, optionally filtered by category."""
    query = select(VehicleMake)
    if category:
        query = query.where(VehicleMake.category == category.lower())
    query = query.order_by(VehicleMake.name.asc())

    result = await db.execute(query)
    makes = result.scalars().all()
    return makes


@router.get("/models", response_model=List[VehicleModelOut], summary="List Models by Make")
async def list_models(
    make_id: int = Query(..., description="ID of the vehicle manufacturer"),
    db: AsyncSession = Depends(get_db),
):
    """Returns all models for a given manufacturer with preloaded variants."""
    query = (
        select(VehicleModel)
        .where(VehicleModel.make_id == make_id)
        .options(selectinload(VehicleModel.variants))
        .order_by(VehicleModel.name.asc())
    )

    result = await db.execute(query)
    models = result.scalars().all()
    return models


@router.get("/variants", response_model=List[VehicleVariantOut], summary="List Variants by Model")
async def list_variants(
    model_id: int = Query(..., description="ID of the vehicle model"),
    db: AsyncSession = Depends(get_db),
):
    """Returns all trims/variants and their fuel economy specifications."""
    query = (
        select(VehicleVariant)
        .where(VehicleVariant.model_id == model_id)
        .order_by(VehicleVariant.year.desc(), VehicleVariant.name.asc())
    )

    result = await db.execute(query)
    variants = result.scalars().all()
    return variants


@router.get("/search", response_model=List[VehicleCatalogItem], summary="Search Philippine Vehicle Catalog")
async def search_catalog(
    q: str = Query(..., min_length=2, description="Search query, e.g. 'Aerox' or 'Vios'"),
    category: Optional[str] = Query(None, description="Optional category filter"),
    db: AsyncSession = Depends(get_db),
):
    """Performs full-text search across makes, models, and variants in the Philippine database."""
    search_term = f"%{q.strip()}%"

    query = (
        select(VehicleVariant, VehicleModel, VehicleMake)
        .join(VehicleModel, VehicleVariant.model_id == VehicleModel.id)
        .join(VehicleMake, VehicleModel.make_id == VehicleMake.id)
        .where(
            or_(
                VehicleMake.name.ilike(search_term),
                VehicleModel.name.ilike(search_term),
                VehicleVariant.name.ilike(search_term),
            )
        )
    )

    if category:
        query = query.where(VehicleMake.category == category.lower())

    query = query.limit(30)
    result = await db.execute(query)
    rows = result.all()

    items = []
    for var, mod, make in rows:
        items.append(
            VehicleCatalogItem(
                variant_id=var.id,
                make=make.name,
                model=mod.name,
                variant=var.name,
                year=var.year,
                category=make.category,
                fuel_type=var.fuel_type,
                tank_capacity_liters=var.tank_capacity_liters,
                official_fuel_economy_kml=var.official_fuel_economy_kml,
                engine_displacement=var.engine_displacement,
                transmission=var.transmission,
            )
        )

    return items
