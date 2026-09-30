from typing import List, TYPE_CHECKING
from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDMixin

if TYPE_CHECKING:
    from app.models.vehicle import UserVehicle
    from app.models.log import FuelLog


class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    role: Mapped[str] = mapped_column(String(20), default="USER", nullable=False) # USER, ADMIN

    # Relationships
    vehicles: Mapped[List["UserVehicle"]] = relationship("UserVehicle", back_populates="user", cascade="all, delete-orphan")
    fuel_logs: Mapped[List["FuelLog"]] = relationship("FuelLog", back_populates="user", cascade="all, delete-orphan")
