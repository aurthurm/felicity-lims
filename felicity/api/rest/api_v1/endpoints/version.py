import logging
from typing import Any

from fastapi import APIRouter, Response

from felicity.version import FelicityVersion

version = APIRouter(tags=["version"], prefix="/version")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@version.get("/")
async def get_version() -> Any:
    """
    Retrieve the version of Felicity LIMS
    """
    return {"version": FelicityVersion.version}


@version.post("/updates")
async def updates(response: Response) -> Any:
    """
    Check is there are new updates to this version
    """
    response.headers["Cache-Control"] = f"max-age={int(FelicityVersion._cache_duration.total_seconds())}"
    return await FelicityVersion.check_github_version()
