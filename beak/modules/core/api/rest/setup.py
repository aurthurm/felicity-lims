import logging
import os
from typing import Annotated, Any

from fastapi import APIRouter, Depends, File, UploadFile
from pydantic import BaseModel

from beak.api.deps import get_current_user
from beak.core.config import settings
from beak.lims.seeds import default_setup
from beak.modules.core.identity.schemas import User

setup = APIRouter(tags=["setup"], prefix="/setup")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SetupResponse(BaseModel):
    success: bool
    message: str | None = None


class LogoUploadResponse(BaseModel):
    success: bool
    message: str
    logo_path: str | None = None


@setup.post("/load-default-setup")
async def load_setup_data(
    current_user: Annotated[User, Depends(get_current_user)],
) -> Any:
    """Run initial setup to load setup data."""
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
    """Upload and update logo.png in assets."""
    try:
        if not file:
            return LogoUploadResponse(success=False, message="No file provided")

        if file.content_type not in ["image/png"]:
            return LogoUploadResponse(
                success=False,
                message="Only PNG files are allowed. Received: "
                + (file.content_type or "unknown"),
            )

        if not file.filename.lower().endswith(".png"):
            return LogoUploadResponse(
                success=False,
                message="File must have .png extension",
            )

        file_bytes = await file.read()

        if not file_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
            return LogoUploadResponse(
                success=False,
                message="Invalid PNG file: file does not have valid PNG header",
            )

        max_size = 5 * 1024 * 1024
        if len(file_bytes) > max_size:
            return LogoUploadResponse(
                success=False,
                message=(
                    "File size exceeds maximum allowed size of 5MB. Received: "
                    f"{len(file_bytes) / 1024 / 1024:.2f}MB"
                ),
            )

        assets_dir = os.path.join(settings.BASE_DIR, "assets", "custom")
        os.makedirs(assets_dir, exist_ok=True)
        logo_path = os.path.join(assets_dir, "logo.png")

        with open(logo_path, "wb") as dest_file:
            dest_file.write(file_bytes)

        logger.info("Logo saved to: %s", logo_path)

        return LogoUploadResponse(
            success=True,
            message="Logo uploaded successfully",
            logo_path=logo_path,
        )

    except Exception as e:
        logger.error("Error uploading logo: %s", str(e))
        return LogoUploadResponse(
            success=False,
            message=f"Failed to upload logo: {str(e)}",
        )
