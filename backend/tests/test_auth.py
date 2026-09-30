import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.api.deps import get_db
from app.core.security import get_password_hash
from app.main import app
from app.models.user import User


@pytest.mark.asyncio
async def test_register_success(async_client):
    mock_session = AsyncMock()
    
    # Mock no existing user
    mock_execute_result = MagicMock()
    mock_execute_result.scalar_one_or_none.return_value = None
    mock_session.execute.return_value = mock_execute_result
    
    # Mock commit and refresh
    async def mock_refresh(user_obj):
        pass
    mock_session.refresh = mock_refresh

    async def override_get_db():
        yield mock_session

    app.dependency_overrides[get_db] = override_get_db

    payload = {
        "email": "rider@cargas.ph",
        "password": "Password123!",
        "display_name": "Juan Dela Cruz",
    }
    response = await async_client.post("/api/v1/auth/register", json=payload)
    app.dependency_overrides.clear()

    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "rider@cargas.ph"
    assert data["user"]["display_name"] == "Juan Dela Cruz"


@pytest.mark.asyncio
async def test_register_duplicate_email(async_client):
    mock_session = AsyncMock()
    
    # Mock existing user found
    existing_user = User(
        id=uuid.uuid4(),
        email="rider@cargas.ph",
        password_hash=get_password_hash("Password123!"),
        display_name="Juan Dela Cruz",
        role="USER",
        is_active=True,
    )
    mock_execute_result = MagicMock()
    mock_execute_result.scalar_one_or_none.return_value = existing_user
    mock_session.execute.return_value = mock_execute_result

    async def override_get_db():
        yield mock_session

    app.dependency_overrides[get_db] = override_get_db

    payload = {
        "email": "rider@cargas.ph",
        "password": "Password123!",
        "display_name": "Juan Dela Cruz",
    }
    response = await async_client.post("/api/v1/auth/register", json=payload)
    app.dependency_overrides.clear()

    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


@pytest.mark.asyncio
async def test_login_success(async_client):
    mock_session = AsyncMock()
    
    test_user = User(
        id=uuid.uuid4(),
        email="commuter@cargas.ph",
        password_hash=get_password_hash("StrongSecret99!"),
        display_name="Maria Santos",
        role="USER",
        is_active=True,
    )
    mock_execute_result = MagicMock()
    mock_execute_result.scalar_one_or_none.return_value = test_user
    mock_session.execute.return_value = mock_execute_result

    async def override_get_db():
        yield mock_session

    app.dependency_overrides[get_db] = override_get_db

    payload = {
        "email": "commuter@cargas.ph",
        "password": "StrongSecret99!",
    }
    response = await async_client.post("/api/v1/auth/login", json=payload)
    app.dependency_overrides.clear()

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["email"] == "commuter@cargas.ph"


@pytest.mark.asyncio
async def test_login_invalid_password(async_client):
    mock_session = AsyncMock()
    
    test_user = User(
        id=uuid.uuid4(),
        email="commuter@cargas.ph",
        password_hash=get_password_hash("CorrectPassword!"),
        display_name="Maria Santos",
        role="USER",
        is_active=True,
    )
    mock_execute_result = MagicMock()
    mock_execute_result.scalar_one_or_none.return_value = test_user
    mock_session.execute.return_value = mock_execute_result

    async def override_get_db():
        yield mock_session

    app.dependency_overrides[get_db] = override_get_db

    payload = {
        "email": "commuter@cargas.ph",
        "password": "WrongPassword!",
    }
    response = await async_client.post("/api/v1/auth/login", json=payload)
    app.dependency_overrides.clear()

    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_me_unauthorized(async_client):
    response = await async_client.get("/api/v1/auth/me")
    assert response.status_code == 401
