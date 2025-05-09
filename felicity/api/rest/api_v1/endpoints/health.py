import logging
import time
from datetime import datetime

import psutil
from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from felicity.database.session import get_db
from felicity.core.config import settings

health = APIRouter(tags=["health"], prefix="/health")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Store start time for uptime calculation
START_TIME = datetime.now()


@health.get("/status")
async def get_health(request: Request) -> dict[str, bool]:
    return {"up": True}

@health.get("/system")
async def system_health(db: AsyncSession = Depends(get_db)):
    # Basic system metrics
    system_data = {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage('/').percent,
        "uptime_seconds": (datetime.now() - START_TIME).total_seconds(),
        "process_count": len(psutil.pids()),
        "network_connections": len(psutil.net_connections()),
    }

    # Database health check
    try:
        start_time = time.time()
        await db.execute("SELECT 1")
        db_latency = time.time() - start_time
        system_data["database"] = {
            "status": "healthy",
            "latency_ms": round(db_latency * 1000, 2)
        }
    except Exception as e:
        system_data["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }

    # API performance metrics
    system_data["api"] = {
        "version": settings.API_V1_STR,
        "environment": settings.ENVIRONMENT
    }

    # Flag issues automatically
    warnings = []
    if system_data["cpu_percent"] > 90:
        warnings.append("CPU usage critically high")
    if system_data["memory_percent"] > 85:
        warnings.append("Memory usage critically high")
    if system_data["disk_percent"] > 80:
        warnings.append("Disk usage high")
    if system_data.get("database", {}).get("status") == "unhealthy":
        warnings.append("Database connection issues")
    if system_data["process_count"] > 1000:  # Adjust threshold based on your system
        warnings.append("High number of processes running")

    system_data["warnings"] = warnings
    system_data["status"] = "warning" if warnings else "healthy"

    return system_data
