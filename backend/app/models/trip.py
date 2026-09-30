import uuid
from typing import Optional
from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin, UUIDMixin


class SavedPlace(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "saved_places"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "Home", "Work", "Parents House"
    place_type: Mapped[str] = mapped_column(String(50), default="CUSTOM", nullable=False) # HOME, WORK, FAVORITE, CUSTOM
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)


class SavedRoute(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "saved_routes"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "QC to Tagaytay Weekend Route"
    origin_name: Mapped[str] = mapped_column(String(150), nullable=False)
    destination_name: Mapped[str] = mapped_column(String(150), nullable=False)
    origin_latitude: Mapped[float] = mapped_column(Float, nullable=False)
    origin_longitude: Mapped[float] = mapped_column(Float, nullable=False)
    destination_latitude: Mapped[float] = mapped_column(Float, nullable=False)
    destination_longitude: Mapped[float] = mapped_column(Float, nullable=False)
    distance_km: Mapped[float] = mapped_column(Float, nullable=False)
    travel_mode: Mapped[str] = mapped_column(String(50), default="DRIVE", nullable=False)


class TripHistory(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "trip_history"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    user_vehicle_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("user_vehicles.id", ondelete="SET NULL"), nullable=True)
    origin_name: Mapped[str] = mapped_column(String(150), nullable=False)
    destination_name: Mapped[str] = mapped_column(String(150), nullable=False)
    distance_km: Mapped[float] = mapped_column(Float, nullable=False)
    duration_seconds: Mapped[int] = mapped_column(Integer, nullable=False)
    estimated_fuel_liters: Mapped[float] = mapped_column(Float, nullable=False)
    estimated_fuel_cost_php: Mapped[float] = mapped_column(Float, nullable=False)
    fuel_price_used_php: Mapped[float] = mapped_column(Float, nullable=False)
    is_round_trip: Mapped[bool] = mapped_column(default=False, nullable=False)
