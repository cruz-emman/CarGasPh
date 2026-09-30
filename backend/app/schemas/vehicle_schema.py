import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


# --- CATALOG SCHEMAS ---

class VehicleVariantOut(BaseModel):
    id: int
    model_id: int
    name: str
    year: int
    engine_displacement: Optional[str] = None
    transmission: Optional[str] = None
    fuel_type: str
    tank_capacity_liters: float
    official_fuel_economy_kml: float
    fuel_economy_source: str

    model_config = {"from_attributes": True}


class VehicleModelOut(BaseModel):
    id: int
    make_id: int
    name: str
    year_start: Optional[int] = None
    year_end: Optional[int] = None
    variants: List[VehicleVariantOut] = []

    model_config = {"from_attributes": True}


class VehicleMakeOut(BaseModel):
    id: int
    name: str
    category: str

    model_config = {"from_attributes": True}


class VehicleCatalogItem(BaseModel):
    variant_id: int
    make: str
    model: str
    variant: str
    year: int
    category: str
    fuel_type: str
    tank_capacity_liters: float
    official_fuel_economy_kml: float
    engine_displacement: Optional[str] = None
    transmission: Optional[str] = None


# --- USER GARAGE SCHEMAS ---

class UserVehicleCreate(BaseModel):
    variant_id: Optional[int] = Field(None, description="ID from vehicle catalog if selected from preloaded DB")
    custom_make: Optional[str] = Field(None, max_length=100)
    custom_model: Optional[str] = Field(None, max_length=100)
    year: int = Field(..., ge=1970, le=2030)
    nickname: Optional[str] = Field(None, max_length=100)
    vehicle_type: str = Field(..., description="motorcycle, car, suv, mpv, pickup, van")
    fuel_type: str = Field(..., description="Gasoline RON 91, Gasoline RON 95, Gasoline RON 97+, Diesel")
    tank_capacity_liters: float = Field(..., gt=0, description="Tank capacity in liters, must be greater than zero")
    custom_fuel_economy_kml: float = Field(..., gt=0, description="Fuel economy in km/L, must be greater than zero")
    current_odometer_km: Optional[float] = Field(None, ge=0)
    is_default: bool = False

    @field_validator("tank_capacity_liters")
    @classmethod
    def validate_tank(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Tank capacity must be greater than 0 liters.")
        return round(v, 2)

    @field_validator("custom_fuel_economy_kml")
    @classmethod
    def validate_economy(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Fuel economy must be greater than 0 km/L.")
        return round(v, 2)


class UserVehicleUpdate(BaseModel):
    nickname: Optional[str] = Field(None, max_length=100)
    tank_capacity_liters: Optional[float] = Field(None, gt=0)
    custom_fuel_economy_kml: Optional[float] = Field(None, gt=0)
    current_odometer_km: Optional[float] = Field(None, ge=0)
    is_default: Optional[bool] = None


class UserVehicleOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    variant_id: Optional[int] = None
    make: str
    model: str
    year: int
    nickname: Optional[str] = None
    vehicle_type: str
    fuel_type: str
    tank_capacity_liters: float
    fuel_economy_kml: float
    personal_average_kml: Optional[float] = None
    current_odometer_km: Optional[float] = None
    is_default: bool
    estimated_full_range_km: float
    created_at: datetime

    model_config = {"from_attributes": True}
