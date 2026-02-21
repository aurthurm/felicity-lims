import logging
import time
from datetime import datetime
from typing import Any

import psutil
from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from beak.core.config import settings
from beak.core.dtz import timenow_dt
from beak.database.session import get_db
from beak.version import beak_version
from beak.version.version import _cache_duration

health_router = APIRouter(tags=["health"], prefix="/health")
version_router = APIRouter(tags=["version"], prefix="/version")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_START_TIME = datetime.now()


@health_router.get("/status")
async def get_health(request: Request) -> dict[str, bool]:
    return {"up": True}


@health_router.get("/system")
async def system_health(db: AsyncSession = Depends(get_db)):
    system_data = {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage("/").percent,
        "uptime_seconds": (datetime.now() - _START_TIME).total_seconds(),
        "process_count": len(psutil.pids()),
        "network_connections": len(psutil.net_connections()),
    }

    try:
        start_time = time.time()
        await db.execute("SELECT 1")
        db_latency = time.time() - start_time
        system_data["database"] = {
            "status": "healthy",
            "latency_ms": round(db_latency * 1000, 2),
        }
    except Exception as e:
        system_data["database"] = {"status": "unhealthy", "error": str(e)}

    system_data["api"] = {
        "version": settings.API_V1_STR,
        "environment": settings.ENVIRONMENT,
    }

    warnings = []
    if system_data["cpu_percent"] > 90:
        warnings.append("CPU usage critically high")
    if system_data["memory_percent"] > 85:
        warnings.append("Memory usage critically high")
    if system_data["disk_percent"] > 80:
        warnings.append("Disk usage high")
    if system_data.get("database", {}).get("status") == "unhealthy":
        warnings.append("Database connection issues")
    if system_data["process_count"] > 1000:
        warnings.append("High number of processes running")

    system_data["warnings"] = warnings
    system_data["status"] = "warning" if warnings else "healthy"

    return system_data


@version_router.get("")
async def get_version() -> Any:
    """Retrieve the version of Beak LIMS."""
    return {"version": beak_version.version}


@version_router.get("/updates")
async def updates(response: Response) -> Any:
    """Check whether there are new updates to this version."""
    response.headers["Cache-Control"] = f"max-age={int(_cache_duration.total_seconds())}"
    try:
        return await beak_version.check_github_version()
    except Exception as e:
        logger.warning("Version check failed: %s", str(e))
        return {
            "current_version": beak_version.version,
            "latest_version": beak_version.version,
            "update_available": False,
            "message": "Version check unavailable",
            "error": str(e) if logger.level == logging.DEBUG else None,
            "release_notes": "",
            "release_url": "",
            "last_checked": timenow_dt().isoformat(),
        }
