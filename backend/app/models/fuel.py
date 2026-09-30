from datetime import date, datetime
from typing import List, Optional
from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDMixin


class FuelType(Base, TimestampMixin):
    __tablename__ = "fuel_types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False) # RON91, RON95, RON97, DIESEL, KEROSENE
    display_name: Mapped[str] = mapped_column(String(100), nullable=False) # "Gasoline Unleaded (RON 91)"
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    prices: Mapped[List["FuelPrice"]] = relationship("FuelPrice", back_populates="fuel_type")
    movements: Mapped[List["FuelPriceMovement"]] = relationship("FuelPriceMovement", back_populates="fuel_type")


class FuelPriceRegion(Base, TimestampMixin):
    __tablename__ = "fuel_price_regions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False) # NCR, REGION_3, REGION_4A
    name: Mapped[str] = mapped_column(String(100), nullable=False) # "Metro Manila (NCR)"
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    prices: Mapped[List["FuelPrice"]] = relationship("FuelPrice", back_populates="region")


class FuelPrice(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "fuel_prices"

    fuel_type_id: Mapped[int] = mapped_column(Integer, ForeignKey("fuel_types.id", ondelete="CASCADE"), nullable=False, index=True)
    region_id: Mapped[int] = mapped_column(Integer, ForeignKey("fuel_price_regions.id", ondelete="CASCADE"), nullable=False, index=True)
    
    price_low: Mapped[Optional[float]] = mapped_column(Numeric(6, 2), nullable=True)
    price_high: Mapped[Optional[float]] = mapped_column(Numeric(6, 2), nullable=True)
    price_avg: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    
    date_effective: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    date_retrieved: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    source: Mapped[str] = mapped_column(String(150), default="Department of Energy (DOE) Philippines", nullable=False)
    verification_status: Mapped[str] = mapped_column(String(50), default="OFFICIAL", nullable=False) # OFFICIAL, ESTIMATED

    fuel_type: Mapped["FuelType"] = relationship("FuelType", back_populates="prices")
    region: Mapped["FuelPriceRegion"] = relationship("FuelPriceRegion", back_populates="prices")


class FuelPriceMovement(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "fuel_price_movements"

    fuel_type_id: Mapped[int] = mapped_column(Integer, ForeignKey("fuel_types.id", ondelete="CASCADE"), nullable=False, index=True)
    delta_amount: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False) # e.g. +1.20 or -0.70
    movement_type: Mapped[str] = mapped_column(String(20), nullable=False) # HIKE, ROLLBACK, NO_CHANGE
    effective_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    announcement_date: Mapped[date] = mapped_column(Date, nullable=False)
    source: Mapped[str] = mapped_column(String(150), nullable=False) # "DOE Advisory / Oil Industry Announcement"

    fuel_type: Mapped["FuelType"] = relationship("FuelType", back_populates="movements")
