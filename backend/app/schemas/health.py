from typing import Optional
from pydantic import BaseModel


class HealthStatus(BaseModel):
    status: str = "ok"
    environment: str
    database: str = "unknown"
    redis: str = "unknown"
    version: str = "0.1.0"
    timestamp: str
