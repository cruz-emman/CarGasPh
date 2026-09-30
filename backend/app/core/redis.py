from typing import Optional
import redis.asyncio as redis
from app.core.config import settings

redis_client: Optional[redis.Redis] = None


async def get_redis() -> redis.Redis:
    """Returns the singleton Redis client connection pool."""
    global redis_client
    if redis_client is None:
        redis_client = redis.from_url(
            str(settings.REDIS_URL),
            encoding="utf-8",
            decode_responses=True,
        )
    return redis_client


async def close_redis() -> None:
    """Closes the Redis connection pool on shutdown."""
    global redis_client
    if redis_client is not None:
        await redis_client.close()
        redis_client = None
