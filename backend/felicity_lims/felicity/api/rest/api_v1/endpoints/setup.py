import logging
from typing import Any, Optional

from fastapi import APIRouter
from felicity.apps.setup import models, schemas
from felicity.init import (create_laboratory, create_super_user, setup_default_permissions,
                           initialize_felicity, init_id_sequence)
from pydantic import BaseModel

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class InstallResponse(BaseModel):
    laboratory: Optional[schemas.Laboratory]
    installed: bool
    message: Optional[str]


class LabNameIn(BaseModel):
    name: str


class SetupResponse(BaseModel):
    success: bool
    message: Optional[str]


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
    Install a laboratory and initialise departments
    """
    try:
        await create_super_user()
    except Exception as e:
        return {
            "laboratory": None,
            "installed": False,
            "message": f"Failed to create a superuser: {e}",
        }

    try:
        await setup_default_permissions()
    except Exception as e:
        return {
            "laboratory": None,
            "installed": False,
            "message": f"Failed to create a default permissions: {e}",
        }

    try:
        await init_id_sequence()
    except Exception as e:
        return {
            "laboratory": None,
            "installed": False,
            "message": f"Failed to initialise id sequence: {e}",
        }

    laboratory = await models.Laboratory.get_by_setup_name("felicity")
    installed = False
    if not laboratory:
        await create_laboratory(form.name)
        laboratory = await models.Laboratory.get_by_setup_name("felicity")
        if laboratory:
            message = "Your Laboratory was successfully installed"
            installed = True
        else:
            message = "Installation Failed"
    else:
        installed = True
        message = "An installed Laboratory instance already exists"

    return {"laboratory": laboratory, "installed": installed, "message": message}


@router.post("/load-default-setup", response_model=SetupResponse)
async def load_setup_data() -> Any:
    """
    Run initial setup to load setup data
    """
    try:
        await initialize_felicity()
    except Exception as e:
        return {"success": False, "message": f"Failed to load setup data: {e}"}

    return {"success": True, "message": "Setup data was successfully loaded"}


# TODO: UPLOAD SETUP DATA VIA CSV
