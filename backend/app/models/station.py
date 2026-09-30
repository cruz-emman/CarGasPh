from datetime import datetime
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geography
from app.models.base import Base, TimestampMixin, UUIDMixin


class GasStationBrand(Base, TimestampMixin):
    __tablename__ = "gas_station_brands"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False) # Petron, Shell, Caltex, Cleanfuel, Seaoil, etc.
    logo_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    stations: Mapped[List["GasStation"]] = relationship("GasStation", back_populates="brand")


class GasStation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "gas_stations"

    brand_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("gas_station_brands.id", ondelete="SET NULL"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(150), index=True, nullable=False) # e.g. "Petron EDSA Philam"
    
    # PostGIS Spatial Geography Point (WGS84 lat/lng)
    location = mapped_column(Geography(geometry_type="POINT", srid=4326, spatial_index=True), nullable=False)
    
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    province: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    amenities: Mapped[Optional[dict]] = mapped_column(JSONB, default=dict, nullable=True) # {"atm": true, "restroom": true, "air_water": true}
    google_place_id: Mapped[Optional[str]] = mapped_column(String(150), unique=True, nullable=True)
    last_verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    brand: Mapped[Optional["GasStationBrand"]] = relationship("GasStationBrand", back_populates="stations")
