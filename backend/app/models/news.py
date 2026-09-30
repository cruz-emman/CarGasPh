import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin, UUIDMixin


class NewsArticle(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "news_articles"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(String(500), nullable=False)
    publisher: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "Department of Energy", "AutoIndustriya"
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    source_url: Mapped[str] = mapped_column(String(500), unique=True, nullable=False)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    category: Mapped[str] = mapped_column(String(50), default="PRICE_ADVISORY", nullable=False) # PRICE_ADVISORY, GLOBAL_OIL, REGULATION


class NotificationRecord(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "notifications"

    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    notification_type: Mapped[str] = mapped_column(String(50), nullable=False) # PRICE_HIKE, ROLLBACK, SYSTEM
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB, default=dict, nullable=True)


class ApiSyncLog(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "api_sync_logs"

    sync_target: Mapped[str] = mapped_column(String(50), nullable=False) # DOE_PRICES, NEWS_RSS, GOOGLE_PLACES
    status: Mapped[str] = mapped_column(String(20), nullable=False) # SUCCESS, FAILED
    items_synced: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


class UserReport(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "user_reports"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    report_type: Mapped[str] = mapped_column(String(50), nullable=False) # CROWDSOURCED_PRICE, INCORRECT_STATION, APP_FEEDBACK
    target_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True) # station id, etc.
    report_data: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="PENDING", nullable=False) # PENDING, APPROVED, REJECTED
