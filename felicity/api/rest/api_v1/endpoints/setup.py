import logging
from typing import Any, Optional

from apps.setup import models, schemas
from fastapi import APIRouter
from init import default_setup, requisite_setup
from pydantic import BaseModel

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class InstallResponse(BaseModel):
    laboratory: Optional[schemas.Laboratory]
    installed: bool
    message: str | None


class LabNameIn(BaseModel):
    name: str


class SetupResponse(BaseModel):
    success: bool
    message: str | None


@router.get("/installation", response_model=Optional[InstallResponse])
async def laboratory_lookup() -> Any:
    """
    Retrieve instance of installed laboratory
    """
    laboratory = await models.Laboratory.get_by_setup_name("felicity")
    return {
        "laboratory": laboratory,
        "installed": True if laboratory else False,
        "message": "" if laboratory else "Laboratory installation required",
    }


@router.post("/installation", response_model=InstallResponse)
async def register_laboratory(*, form: LabNameIn) -> Any:
    """
    Install a laboratory and initialise departments example post: curl -X POST
    http://localhost:8000/api/v1/setup/installation -d '{"name":"Felicity Lims"}' -H "Content-Type: application/json"
    """

    try:
        await requisite_setup(form.name)
    except Exception as e:
        return {
            "laboratory": None,
            "installed": False,
            "message": f"Failed to load requisite setup: {e}",
        }

    laboratory = await models.Laboratory.get_by_setup_name("felicity")
    return {
        "laboratory": laboratory,
        "installed": True,
        "message": "installation success",
    }


@router.post("/load-default-setup", response_model=SetupResponse)
async def load_setup_data() -> Any:
    """
    Run initial setup to load setup data
    """
    try:
        await default_setup()
    except Exception as e:
        return {"success": False, "message": f"Failed to load setup data: {e}"}

    return {"success": True, "message": "Setup data was successfully loaded"}


# TODO: UPLOAD SETUP DATA VIA CSV
