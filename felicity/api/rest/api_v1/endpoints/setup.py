import logging
from typing import Any, Optional

from pydantic import BaseModel
from sanic import Blueprint, json

from apps.setup import models, schemas
from apps.user import models as user_models
from init import default_setup, requisite_setup

setup = Blueprint("setup", url_prefix="/setup")

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


@setup.get("/installation")
async def laboratory_lookup(request) -> Any:
    """
    Retrieve instance of installed laboratory
    """
    laboratory = await models.Laboratory.get_by_setup_name("felicity")
    return json(
        {
            "laboratory": laboratory.marshal_simple() if laboratory else None,
            "installed": True if laboratory else False,
            "message": "" if laboratory else "Laboratory installation required",
        }
    )


@setup.post("/installation")
async def register_laboratory(request) -> Any:
    """
    Install a laboratory and initialise departments example post: curl -X POST
    http://localhost:8000/api/v1/setup/installation -d '{"name":"Felicity Lims"}' -H "Content-Type: application/json"
    """

    try:
        await requisite_setup(request.json.get("name"))
    except Exception as e:
        return {
            "laboratory": None,
            "installed": False,
            "message": f"Failed to load requisite setup: {e}",
        }

    laboratory = await models.Laboratory.get_by_setup_name("felicity")
    return json(
        {
            "laboratory": laboratory.marshal_simple(),
            "installed": True,
            "message": "installation success",
        }
    )


@setup.post("/load-default-setup")
async def load_setup_data(request, current_user: user_models.User) -> Any:
    """
    Run initial setup to load setup data
    """
    try:
        await default_setup()
    except Exception as e:
        return {"success": False, "message": f"Failed to load setup data: {e}"}

    return json({"success": True, "message": "Setup data was successfully loaded"})
