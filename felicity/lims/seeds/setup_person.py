import logging
from typing import Optional

from felicity.apps.patient import models
from felicity.apps.patient import schemas
from felicity.core.config import get_settings

from .data import get_seeds

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_person() -> None:
    logger.info("Setting up person .....")
    data = get_seeds("person")

    for id_type in data.get("identifiers"):
        if not (await models.Identification.get(name=id_type)):
            inst_type_in = schemas.IdentificationCreate(name=id_type)
            await models.Identification.create(inst_type_in)
