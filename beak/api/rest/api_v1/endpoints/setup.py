import logging
import os
from typing import Annotated, Any

from fastapi import APIRouter, Depends, UploadFile, File
from pydantic import BaseModel

from beak.api.deps import get_current_user
from beak.modules.core.common.utils.serializer import marshaller
from beak.modules.core.setup import schemas
from beak.modules.core.setup.services import LaboratoryService, OrganizationService
from beak.modules.core.identity.schemas import User
from beak.core.config import settings
from beak.lims.seeds import default_setup, requisite_setup

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


class LogoUploadResponse(BaseModel):
    success: bool
    message: str
    logo_path: str | None = None


@setup.get("/installation")
async def instance_lookup(
        org_service: OrganizationService = Depends(OrganizationService),
        lab_service: LaboratoryService = Depends(LaboratoryService),
) -> Any:
    """
    Retrieve the installed instance
    """
    organisation = await org_service.get_by_setup_name("beak")
    laboratories = []
    if organisation:
        laboratories = await lab_service.get_all(organization_uid=organisation.uid)
    return {
        "laboratories": [
            (marshaller(laboratory, exclude=["lab_manager"]))
            for laboratory in laboratories
        ]
        if laboratories
        else None,
        "installed": True if organisation else False,
        "message": "" if organisation else "Instance installation required",
    }


@setup.post("/installation")
async def register_instance(
        details: InstallationDetails,
        org_service: OrganizationService = Depends(OrganizationService),
        lab_service: LaboratoryService = Depends(LaboratoryService),
) -> Any:
    """
    Install a laboratory and initialise departments example post: curl -X POST
    http://localhost:8000/api/v1/setup/installation -d '{"name":"Beak Lims"}' -H "Content-Type: application/json"
    """
    try:
        await requisite_setup(details.organisation_name, details.laboratory_name)
    except Exception as e:
        return {
            "laboratories": [],
            "installed": False,
            "message": f"Failed to load requisite setup: {e}",
        }

    organisation = await org_service.get_by_setup_name("beak")
    laboratories = []
    if organisation:
        laboratories = await lab_service.get_all(organization_uid=organisation.uid)
    return {
        "laboratories": [
            (marshaller(laboratory, exclude=["lab_manager"]))
            for laboratory in laboratories
        ]
        if laboratories
        else None,
        "installed": True if organisation else False,
        "message": "Installation success" if organisation else "Instance installation required",
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


@setup.post("/logo")
async def upload_logo(
        file: UploadFile = File(...),
        current_user: Annotated[User, Depends(get_current_user)] = None,
) -> LogoUploadResponse:
    """
    Upload and update logo.png in assets.
    Only accepts PNG files.

    Args:
        file: PNG image file to upload as logo
        current_user: Current authenticated user (required for authorization)

    Returns:
        LogoUploadResponse with success status and logo path
    """
    try:
        # Validate file exists
        if not file:
            return LogoUploadResponse(success=False, message="No file provided")

        # Validate file is PNG
        if file.content_type not in ["image/png"]:
            return LogoUploadResponse(
                success=False,
                message="Only PNG files are allowed. Received: "
                        + (file.content_type or "unknown"),
            )

        # Validate filename ends with .png
        if not file.filename.lower().endswith(".png"):
            return LogoUploadResponse(
                success=False, message="File must have .png extension"
            )

        # Read file bytes
        file_bytes = await file.read()

        # Validate PNG magic bytes (PNG files start with: 89 50 4E 47)
        if not file_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
            return LogoUploadResponse(
                success=False,
                message="Invalid PNG file: file does not have valid PNG header",
            )

        # Validate file size (max 5MB)
        max_size = 5 * 1024 * 1024  # 5MB
        if len(file_bytes) > max_size:
            return LogoUploadResponse(
                success=False,
                message=f"File size exceeds maximum allowed size of 5MB. Received: {len(file_bytes) / 1024 / 1024:.2f}MB",
            )

        assets_dir = os.path.join(settings.BASE_DIR, "assets", "custom")
        os.makedirs(assets_dir, exist_ok=True)
        logo_path = os.path.join(assets_dir, "logo.png")

        # Write file to disk
        with open(logo_path, "wb") as dest_file:
            dest_file.write(file_bytes)

        logger.info(f"Logo saved to: {logo_path}")

        return LogoUploadResponse(
            success=True, message="Logo uploaded successfully", logo_path=logo_path
        )

    except Exception as e:
        logger.error(f"Error uploading logo: {str(e)}")
        return LogoUploadResponse(
            success=False, message=f"Failed to upload logo: {str(e)}"
        )
