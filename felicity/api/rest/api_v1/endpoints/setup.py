import logging
from typing import Annotated, Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from felicity.api.deps import get_current_user
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.setup import schemas
from felicity.apps.setup.services import LaboratoryService, OrganizationService
from felicity.apps.user.schemas import User
from felicity.lims.seeds import default_setup, requisite_setup

setup = APIRouter(tags=["setup"], prefix="/setup")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class InstallResponse(BaseModel):
    laboratories: list[schemas.Laboratory] | None = None
    installed: bool
    message: str | None = None


class InstallationDetails(BaseModel):
    organisation_name: str
    laboratory_name: str


class SetupResponse(BaseModel):
    success: bool
    message: str | None = None


@setup.get("/installation")
async def instance_lookup(
        org_service: OrganizationService = Depends(OrganizationService),
        lab_service: LaboratoryService = Depends(LaboratoryService),
) -> Any:
    """
    Retrieve the installed instance
    """
    organisation = await org_service.get_by_setup_name("felicity")
    laboratories = []
    if organisation:
        laboratories = await lab_service.get_all(organization_uid=organisation.uid)
    return {
        "laboratories": [
            (
                marshaller(laboratory, exclude=["lab_manager"])
            ) for laboratory in laboratories
        ] if laboratories else None,
        "installed": True if organisation else False,
        "message": "" if organisation else "Instance installation required",
    }


@setup.post("/installation")
async def register_instance(
        details: InstallationDetails,
        org_service: OrganizationService = Depends(OrganizationService),
        lab_service: LaboratoryService = Depends(LaboratoryService)
) -> Any:
    """
    Install a laboratory and initialise departments example post: curl -X POST
    http://localhost:8000/api/v1/setup/installation -d '{"name":"Felicity Lims"}' -H "Content-Type: application/json"
    """
    try:
        await requisite_setup(details.organisation_name, details.laboratory_name)
    except Exception as e:
        return {
            "laboratories": [],
            "installed": False,
            "message": f"Failed to load requisite setup: {e}",
        }

    organisation = await org_service.get_by_setup_name("felicity")
    laboratories = []
    if organisation:
        laboratories = await lab_service.get_all(organization_uid=organisation.uid)
    return {
        "laboratories": [
            (
                marshaller(laboratory, exclude=["lab_manager"])
            ) for laboratory in laboratories
        ] if laboratories else None,
        "installed": True if organisation else False,
        "message": "" if organisation else "Instance installation required",
    }


@setup.post("/load-default-setup")
async def load_setup_data(
        current_user: Annotated[User, Depends(get_current_user)],
) -> Any:
    """
    Run initial setup to load setup data
    """
    try:
        await default_setup()
    except Exception as e:
        return {"success": False, "message": f"Failed to load setup data: {e}"}

    return {"success": True, "message": "Setup data was successfully loaded"}
