import logging
from typing import Any, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from felicity.apps.setup import schemas
from felicity.version import FelicityVersion

version = APIRouter(tags=["version"], prefix="/version")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class InstallResponse(BaseModel):
    laboratory: Optional[schemas.Laboratory] = None
    installed: bool
    message: str | None = None


class LabNameIn(BaseModel):
    name: str


class SetupResponse(BaseModel):
    success: bool
    message: str | None = None


@version.get("/")
async def get_version() -> Any:
    """
    Retrieve the version of Felicity LIMS
    """
    return {"version": FelicityVersion.version}


@version.post("/updates")
async def updates() -> Any:
    """
    Check is there are new updates to this version
    """

    # TODO check for updated from git repo

    return {
        "version": FelicityVersion.version,
        "updates": [{"tag": "v0.1.0", "changes": "blah\ncommit"}],
    }


@version.post("/upgrade")
async def upgrade() -> Any:
    """
    Upgrade Felicity to next/latest version
    """
    # TODO check for updated from git repo
    # stop server
    # backup current source code
    # backup db
    # Pull source code
    # and migrate database
    # build frontend
    # start server

    return {
        "version": FelicityVersion.version,
        "updates": [{"tag": "v0.1.0", "changes": "change 1\nchange 2"}],
        "message": "This functionality is not available yet"
    }
