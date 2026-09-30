from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.redis import get_redis
from app.schemas.health import HealthStatus

router = APIRouter()


@router.get("/health", response_model=HealthStatus, summary="System Health & Readiness Check")
async def health_check(
    db: AsyncSession = Depends(get_db),
):
    """
    Checks health of backend application, database connectivity, and Redis cache.
    """
    db_status = "disconnected"
    redis_status = "disconnected"

    # Test Database
    try:
        result = await db.execute(text("SELECT 1"))
        if result.scalar() == 1:
            db_status = "connected"
    except Exception:
        db_status = "error"

    # Test Redis
    try:
        redis_client = await get_redis()
        pong = await redis_client.ping()
        if pong:
            redis_status = "connected"
    except Exception:
        redis_status = "error"

    overall_status = "ok" if (db_status == "connected" and redis_status == "connected") else "degraded"

    return HealthStatus(
        status=overall_status,
        environment=settings.ENVIRONMENT,
        database=db_status,
        redis=redis_status,
        version="0.1.0",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
