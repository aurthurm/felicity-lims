import logging

from felicity.apps.patient import schemas
from felicity.apps.patient.services import IdentificationService
from felicity.core.config import get_settings

from .data import get_seeds

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_person() -> None:
    logger.info("Setting up person .....")
    data = get_seeds("person")
    if not data:
        logger.error("Failed to load person seed data")
        return

    identification_service = IdentificationService()

    for id_type in data.get("identifiers", []):
        if not (await identification_service.get(name=id_type)):
            inst_type_in = schemas.IdentificationCreate(name=id_type)
            await identification_service.create(inst_type_in)
