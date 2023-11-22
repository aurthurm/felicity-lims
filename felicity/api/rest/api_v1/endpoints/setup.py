import logging
from typing import Any, Optional, Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from api.deps import get_current_user
from apps.setup import models, schemas
from apps.user.schemas import User
from init import default_setup, requisite_setup

setup = APIRouter(tags=["setup"], prefix="/setup")

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


@setup.get("/installation")
async def laboratory_lookup() -> Any:
    """
    Retrieve instance of installed laboratory
    """
    laboratory = await models.Laboratory.get_by_setup_name("felicity")
    return {
        "laboratory": laboratory.marshal_simple(exclude=["lab_manager"]) if laboratory else None,
        "installed": True if laboratory else False,
        "message": "" if laboratory else "Laboratory installation required",
    }


@setup.post("/installation")
async def register_laboratory(name: str) -> Any:
    """
    Install a laboratory and initialise departments example post: curl -X POST
    http://localhost:8000/api/v1/setup/installation -d '{"name":"Felicity Lims"}' -H "Content-Type: application/json"
    """

    try:
        await requisite_setup(name)
    except Exception as e:
        return {
            "laboratory": None,
            "installed": False,
            "message": f"Failed to load requisite setup: {e}",
        }

    laboratory = await models.Laboratory.get_by_setup_name("felicity")
    return {
        "laboratory": laboratory.marshal_simple(exclude=["lab_manager"]),
        "installed": True,
        "message": "installation success",
    }


@setup.post("/load-default-setup")
async def load_setup_data(current_user: Annotated[User, Depends(get_current_user)]) -> Any:
    """
    Run initial setup to load setup data
    """
    try:
        await default_setup()
    except Exception as e:
        return {"success": False, "message": f"Failed to load setup data: {e}"}

    return {"success": True, "message": "Setup data was successfully loaded"}
