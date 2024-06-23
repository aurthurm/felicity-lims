import logging
from typing import Optional

from felicity.apps.instrument import models
from felicity.apps.instrument import schemas
from felicity.core.config import get_settings

from .data import get_seeds

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_instrument_categories() -> None:
    logger.info("Setting up instrument categories .....")
    data = get_seeds("instrument")

    for inst_type in data.get("categories"):
        instrument_type = await models.InstrumentType.get(name=inst_type)
        if not instrument_type:
            inst_type_in = schemas.InstrumentTypeCreate(name=inst_type, description=inst_type)
            await models.InstrumentType.create(inst_type_in)

    for _meth in data.get("methods"):
        if not (await models.Method.get(name=_meth)):
            method_in = schemas.MethodCreate(name=_meth, description="", keyword="")
            await models.Method.create(method_in)

