import uuid
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import Boolean, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.log import FuelLog


class VehicleMake(Base, TimestampMixin):
    __tablename__ = "vehicle_makes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False) # motorcycle, car, suv, mpv, pickup, van

    models: Mapped[List["VehicleModel"]] = relationship("VehicleModel", back_populates="make", cascade="all, delete-orphan")


class VehicleModel(Base, TimestampMixin):
    __tablename__ = "vehicle_models"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    make_id: Mapped[int] = mapped_column(Integer, ForeignKey("vehicle_makes.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    year_start: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    year_end: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    make: Mapped["VehicleMake"] = relationship("VehicleMake", back_populates="models")
    variants: Mapped[List["VehicleVariant"]] = relationship("VehicleVariant", back_populates="model", cascade="all, delete-orphan")


class VehicleVariant(Base, TimestampMixin):
    __tablename__ = "vehicle_variants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    model_id: Mapped[int] = mapped_column(Integer, ForeignKey("vehicle_models.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "1.3 E CVT", "155 ABS"
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    engine_displacement: Mapped[Optional[str]] = mapped_column(String(50), nullable=True) # "1329 cc", "155 cc"
    transmission: Mapped[Optional[str]] = mapped_column(String(50), nullable=True) # "CVT", "Manual", "Automatic"
    fuel_type: Mapped[str] = mapped_column(String(50), default="Gasoline RON 91", nullable=False)
    tank_capacity_liters: Mapped[float] = mapped_column(Float, nullable=False)
    official_fuel_economy_kml: Mapped[float] = mapped_column(Float, nullable=False)
    fuel_economy_source: Mapped[str] = mapped_column(String(50), default="MANUFACTURER", nullable=False)

    model: Mapped["VehicleModel"] = relationship("VehicleModel", back_populates="variants")


class UserVehicle(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "user_vehicles"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    variant_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("vehicle_variants.id", ondelete="SET NULL"), nullable=True)
    
    # Custom/Override fields
    custom_make: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    custom_model: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    nickname: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    vehicle_type: Mapped[str] = mapped_column(String(50), default="car", nullable=False) # motorcycle, car, etc.
    fuel_type: Mapped[str] = mapped_column(String(50), nullable=False) # Gasoline RON 91, Gasoline RON 95, Diesel
    tank_capacity_liters: Mapped[float] = mapped_column(Float, nullable=False)
    custom_fuel_economy_kml: Mapped[float] = mapped_column(Float, nullable=False)
    personal_average_kml: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    current_odometer_km: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="vehicles")
    variant: Mapped[Optional["VehicleVariant"]] = relationship("VehicleVariant")
    fuel_logs: Mapped[List["FuelLog"]] = relationship("FuelLog", back_populates="user_vehicle", cascade="all, delete-orphan")
