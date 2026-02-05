import logging
from typing import Any

from fastapi import APIRouter, Response

from felicity.core.dtz import timenow_dt
from felicity.version import felicity_version
from felicity.version.version import _cache_duration

version = APIRouter(tags=["version"], prefix="/version")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@version.get("")
async def get_version() -> Any:
    """
    Retrieve the version of Felicity LIMS
    """
    return {"version": felicity_version.version}


@version.get("/updates")
async def updates(response: Response) -> Any:
    """
    Check is there are new updates to this version
    """
    response.headers["Cache-Control"] = (
        f"max-age={int(_cache_duration.total_seconds())}"
    )
    try:
        return await felicity_version.check_github_version()
    except Exception as e:
        logger.warning(f"Version check failed: {str(e)}")
        return {
            "current_version": felicity_version.version,
            "latest_version": felicity_version.version,
            "update_available": False,
            "message": "Version check unavailable",
            "error": str(e) if logger.level == logging.DEBUG else None,
            "release_notes": "",
            "release_url": "",
            "version_released": None,
            "last_checked": timenow_dt().isoformat(),
        }
