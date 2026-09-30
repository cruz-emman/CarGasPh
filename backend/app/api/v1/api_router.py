from fastapi import APIRouter
from app.api.v1.endpoints import auth, garage, health, users, vehicles

api_router = APIRouter()

# Include sub-routers
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, tags=["Authentication"])
api_router.include_router(users.router, tags=["Users"])
api_router.include_router(vehicles.router, tags=["Vehicle Catalog"])
api_router.include_router(garage.router, tags=["User Garage"])
