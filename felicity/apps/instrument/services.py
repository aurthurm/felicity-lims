from felicity.apps.abstract.service import BaseService
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.instrument.repository import CalibrationCertificateRepository, InstrumentCalibrationRepository, InstrumentCompetenceRepository, InstrumentRepository, InstrumentTypeRepository, LaboratoryInstrumentRepository, MethodRepository
from felicity.apps.instrument.schemas import CalibrationCertificateCreate, CalibrationCertificateUpdate, InstrumentCalibrationCreate, InstrumentCalibrationUpdate, InstrumentCompetenceCreate, InstrumentCompetenceUpdate, InstrumentCreate, InstrumentTypeCreate, InstrumentTypeUpdate, InstrumentUpdate, LaboratoryInstrumentCreate, LaboratoryInstrumentUpdate, MethodCreate, MethodUpdate
from felicity.apps.instrument.entities import (
    Instrument,
    InstrumentType,
    InstrumentCalibration,
    InstrumentCompetence,
    LaboratoryInstrument,
    CalibrationCertificate, Method
)


class MethodService(
    BaseService[Method, MethodCreate, MethodUpdate],
):
    def __init__(self,):
        super().__init__(MethodRepository)

class InstrumentTypeService(
    BaseService[InstrumentType, InstrumentTypeCreate, InstrumentTypeUpdate],
):
    def __init__(self,):
        super().__init__(InstrumentTypeRepository)

class InstrumentService(
    BaseService[Instrument, InstrumentCreate, InstrumentUpdate],
):
    def __init__(self,):
        super().__init__(InstrumentRepository)

class LaboratoryInstrumentService(
    BaseService[LaboratoryInstrument, LaboratoryInstrumentCreate, LaboratoryInstrumentUpdate],
):
    def __init__(self,):
        super().__init__(LaboratoryInstrumentRepository)


class InstrumentCalibrationService(
    BaseService[InstrumentCalibration, InstrumentCalibrationCreate, InstrumentCalibrationUpdate],
):
    id_service = IdSequenceService()

    def __init__(self,):
        super().__init__(InstrumentCalibrationRepository)

    @classmethod
    async def create(
        cls, obj_in: dict | InstrumentCalibrationCreate
    ) -> InstrumentCalibration:
        data = cls._import(obj_in)
        data["calibration_id"] = (await cls.id_service.get_next_number("ICAL"))[1]
        return await super().create(**data)


class CalibrationCertificateService(
    BaseService[CalibrationCertificate, CalibrationCertificateCreate, CalibrationCertificateUpdate],
):
    def __init__(self,):
        super().__init__(CalibrationCertificateRepository)


class InstrumentCompetenceService(
    BaseService[InstrumentCompetence, InstrumentCompetenceCreate, InstrumentCompetenceUpdate],
):
    def __init__(self,):
        super().__init__(InstrumentCompetenceRepository)

