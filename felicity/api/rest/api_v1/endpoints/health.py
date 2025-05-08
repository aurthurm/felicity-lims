import logging

import psutil
from fastapi import APIRouter

health = APIRouter(tags=["health"], prefix="/health")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@health.get("/system/health")
def system_health():
    health_data = {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage('/').percent
    }

    # Flag issues automatically
    warnings = []
    if health_data["cpu_percent"] > 90:
        warnings.append("CPU usage critically high")
    if health_data["memory_percent"] > 85:
        warnings.append("Memory usage critically high")
    if health_data["disk_percent"] > 80:
        warnings.append("Disk usage high")

    health_data["warnings"] = warnings
    health_data["status"] = "warning" if warnings else "healthy"

    return health_data
