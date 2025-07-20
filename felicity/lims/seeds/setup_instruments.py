import logging

from felicity.apps.instrument import schemas
from felicity.apps.instrument.services import (
    InstrumentService,
    InstrumentTypeService,
    LaboratoryInstrumentService,
    MethodService,
)
from felicity.core.config import get_settings
from .data import get_seeds

settings = get_settings()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def seed_instrument_categories() -> None:
    logger.info("Setting up instrument categories .....")
    instrument_type_service = InstrumentTypeService()
    instrument_service = InstrumentService()
    method_service = MethodService()
    laboratory_instrument_service = LaboratoryInstrumentService()

    data = get_seeds("instrument")
    if not data:
        logger.error("Failed to load person seed data")
        return

    for inst_type in data.get("categories", []):
        instrument_type = await instrument_type_service.get(name=inst_type)
        if not instrument_type:
            inst_type_in = schemas.InstrumentTypeCreate(
                name=inst_type, description=inst_type
            )
            await instrument_type_service.create(inst_type_in)

    for _meth in data.get("methods", []):
        if not (await method_service.get(name=_meth)):
            method_in = schemas.MethodCreate(name=_meth, description="", keyword="")
            await method_service.create(method_in)

    for _inst in data.get("instruments", []):
        if not (await instrument_service.get(name=_inst)):
            inst_in = schemas.InstrumentCreate(name=_inst, description="", keyword="")
            await instrument_service.create(inst_in)


async def seed_lab_instrument() -> None:
    logger.info("Setting up instrument categories .....")
    instrument_service = InstrumentService()
    laboratory_instrument_service = LaboratoryInstrumentService()

    data = get_seeds("instrument")
    for _inst in data.get("instruments", []):
        instrument = await instrument_service.get(name=_inst)
        if instrument:
            if _inst == "Manual":
                if not (await laboratory_instrument_service.get(lab_name=_inst)):
                    lab_inst_in = schemas.LaboratoryInstrumentCreate(
                        instrument_uid=instrument.uid,
                        lab_name=_inst,
                        serial_number="Man-001",
                    )
                    await laboratory_instrument_service.create(lab_inst_in)

            if _inst == "Automated":
                if not (await laboratory_instrument_service.get(lab_name=_inst)):
                    lab_inst_in = schemas.LaboratoryInstrumentCreate(
                        instrument_uid=instrument.uid,
                        lab_name=_inst,
                        serial_number="Auto-001",
                    )
                    await laboratory_instrument_service.create(lab_inst_in)
