import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.api.deps import get_current_user, get_db
from app.main import app
from app.models.user import User
from app.models.vehicle import UserVehicle, VehicleMake, VehicleModel, VehicleVariant


@pytest.fixture
def mock_auth_user():
    return User(
        id=uuid.uuid4(),
        email="testrider@cargas.ph",
        display_name="Test Rider",
        role="USER",
        is_active=True,
    )


@pytest.mark.asyncio
async def test_search_catalog(async_client):
    mock_session = AsyncMock()
    mock_make = VehicleMake(id=1, name="Yamaha", category="motorcycle")
    mock_model = VehicleModel(id=1, make_id=1, name="Aerox 155")
    mock_variant = VehicleVariant(
        id=1,
        model_id=1,
        name="Standard 155",
        year=2024,
        fuel_type="Gasoline RON 91",
        tank_capacity_liters=5.5,
        official_fuel_economy_kml=40.0,
    )

    mock_execute_result = MagicMock()
    mock_execute_result.all.return_value = [(mock_variant, mock_model, mock_make)]
    mock_session.execute.return_value = mock_execute_result

    async def override_get_db():
        yield mock_session

    app.dependency_overrides[get_db] = override_get_db
    response = await async_client.get("/api/v1/vehicles/search?q=Aerox")
    app.dependency_overrides.clear()

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["make"] == "Yamaha"
    assert data[0]["model"] == "Aerox 155"
    assert data[0]["official_fuel_economy_kml"] == 40.0


@pytest.mark.asyncio
async def test_add_vehicle_validation_bounds(async_client, mock_auth_user):
    async def override_get_current_user():
        return mock_auth_user

    app.dependency_overrides[get_current_user] = override_get_current_user

    # Test negative tank capacity
    payload_bad_tank = {
        "custom_make": "Yamaha",
        "custom_model": "Aerox",
        "year": 2024,
        "vehicle_type": "motorcycle",
        "fuel_type": "Gasoline RON 91",
        "tank_capacity_liters": -5.5,
        "custom_fuel_economy_kml": 40.0,
    }
    res1 = await async_client.post("/api/v1/garage", json=payload_bad_tank)
    assert res1.status_code == 422

    # Test zero fuel economy
    payload_bad_economy = {
        "custom_make": "Yamaha",
        "custom_model": "Aerox",
        "year": 2024,
        "vehicle_type": "motorcycle",
        "fuel_type": "Gasoline RON 91",
        "tank_capacity_liters": 5.5,
        "custom_fuel_economy_kml": 0.0,
    }
    res2 = await async_client.post("/api/v1/garage", json=payload_bad_economy)
    assert res2.status_code == 422

    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_add_vehicle_success(async_client, mock_auth_user):
    mock_session = AsyncMock()

    # No existing vehicles -> should be default
    mock_count_res = MagicMock()
    mock_count_res.scalars.return_value.all.return_value = []

    created_vehicle = UserVehicle(
        id=uuid.uuid4(),
        user_id=mock_auth_user.id,
        custom_make="Yamaha",
        custom_model="Aerox 155",
        year=2024,
        vehicle_type="motorcycle",
        fuel_type="Gasoline RON 91",
        tank_capacity_liters=5.5,
        custom_fuel_economy_kml=40.0,
        is_default=True,
    )
    created_vehicle.variant = None

    mock_reload_res = MagicMock()
    mock_reload_res.scalar_one.return_value = created_vehicle

    mock_session.execute.side_effect = [mock_count_res, MagicMock(), mock_reload_res]

    async def override_get_db():
        yield mock_session

    async def override_get_current_user():
        return mock_auth_user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    payload = {
        "custom_make": "Yamaha",
        "custom_model": "Aerox 155",
        "year": 2024,
        "vehicle_type": "motorcycle",
        "fuel_type": "Gasoline RON 91",
        "tank_capacity_liters": 5.5,
        "custom_fuel_economy_kml": 40.0,
    }
    response = await async_client.post("/api/v1/garage", json=payload)
    app.dependency_overrides.clear()

    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Yamaha"
    assert data["model"] == "Aerox 155"
    assert data["is_default"] is True
    assert data["estimated_full_range_km"] == 220.0
