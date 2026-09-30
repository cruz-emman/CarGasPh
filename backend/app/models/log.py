import uuid
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.vehicle import UserVehicle


class FuelLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "fuel_logs"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    user_vehicle_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user_vehicles.id", ondelete="CASCADE"), nullable=False, index=True)
    gas_station_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("gas_stations.id", ondelete="SET NULL"), nullable=True)
    
    log_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    odometer_km: Mapped[float] = mapped_column(Float, nullable=False)
    liters_filled: Mapped[float] = mapped_column(Float, nullable=False)
    price_per_liter: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    total_amount: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    fuel_type: Mapped[str] = mapped_column(String(50), nullable=False) # Gasoline RON 91, etc.
    is_full_tank: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    calculated_kml: Mapped[Optional[float]] = mapped_column(Float, nullable=True) # km/L achieved since last full tank
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="fuel_logs")
    user_vehicle: Mapped["UserVehicle"] = relationship("UserVehicle", back_populates="fuel_logs")


class OdometerLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "odometer_logs"

    user_vehicle_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("user_vehicles.id", ondelete="CASCADE"), nullable=False, index=True)
    odometer_km: Mapped[float] = mapped_column(Float, nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    source: Mapped[str] = mapped_column(String(50), default="MANUAL_ENTRY", nullable=False)
