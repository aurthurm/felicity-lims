import logging
from typing import Any

from fastapi import APIRouter, Response

from beak.core.dtz import timenow_dt
from beak.version import beak_version
from beak.version.version import _cache_duration

version = APIRouter(tags=["version"], prefix="/version")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@version.get("")
async def get_version() -> Any:
    """
    Retrieve the version of Beak LIMS
    """
    return {"version": beak_version.version}


@version.get("/updates")
async def updates(response: Response) -> Any:
    """
    Check is there are new updates to this version
    """
    response.headers["Cache-Control"] = (
        f"max-age={int(_cache_duration.total_seconds())}"
    )
    try:
        return await beak_version.check_github_version()
    except Exception as e:
        logger.warning(f"Version check failed: {str(e)}")
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
