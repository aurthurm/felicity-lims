from felicity.apps.abstract.service import BaseService
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.instrument.entities import (
    CalibrationCertificate,
    Instrument,
    InstrumentCalibration,
    InstrumentCompetence,
    InstrumentType,
    LaboratoryInstrument,
    Method, InstrumentRawData, InstrumentResultExclusions, InstrumentResultTranslation,
)
from felicity.apps.instrument.repository import (
    CalibrationCertificateRepository,
    InstrumentCalibrationRepository,
    InstrumentCompetenceRepository,
    InstrumentRepository,
    InstrumentTypeRepository,
    LaboratoryInstrumentRepository,
    MethodRepository, InstrumentRawDataRepository, InstrumentResultExclusionsRepository,
    InstrumentResultTranslationRepository,
)
from felicity.apps.instrument.schemas import (
    CalibrationCertificateCreate,
    CalibrationCertificateUpdate,
    InstrumentCalibrationCreate,
    InstrumentCalibrationUpdate,
    InstrumentCompetenceCreate,
    InstrumentCompetenceUpdate,
    InstrumentCreate,
    InstrumentTypeCreate,
    InstrumentTypeUpdate,
    InstrumentUpdate,
    LaboratoryInstrumentCreate,
    LaboratoryInstrumentUpdate,
    MethodCreate,
    MethodUpdate, InstrumentRawDataCreate, InstrumentRawDataUpdate, InstrumentResultExclusionsCreate,
    InstrumentResultExclusionsUpdate, InstrumentResultTranslationCreate, InstrumentResultTranslationUpdate,
)


class MethodService(
    BaseService[Method, MethodCreate, MethodUpdate],
):
    def __init__(
            self,
    ):
        super().__init__(MethodRepository())


class InstrumentTypeService(
    BaseService[InstrumentType, InstrumentTypeCreate, InstrumentTypeUpdate],
):
    def __init__(
            self,
    ):
        super().__init__(InstrumentTypeRepository())


class InstrumentService(
    BaseService[Instrument, InstrumentCreate, InstrumentUpdate],
):
    def __init__(
            self,
    ):
        super().__init__(InstrumentRepository())


class LaboratoryInstrumentService(
    BaseService[
        LaboratoryInstrument, LaboratoryInstrumentCreate, LaboratoryInstrumentUpdate
    ],
):
    def __init__(
            self,
    ):
        super().__init__(LaboratoryInstrumentRepository())


class InstrumentCalibrationService(
    BaseService[
        InstrumentCalibration, InstrumentCalibrationCreate, InstrumentCalibrationUpdate
    ],
):
    def __init__(
            self,
    ):
        self.id_service = IdSequenceService()
        super().__init__(InstrumentCalibrationRepository())

    async def create(
            self, obj_in: dict | InstrumentCalibrationCreate
    ) -> InstrumentCalibration:
        data = self._import(obj_in)
        data["calibration_id"] = (await self.id_service.get_next_number("ICAL"))[1]
        return await super().create(data)


class CalibrationCertificateService(
    BaseService[
        CalibrationCertificate,
        CalibrationCertificateCreate,
        CalibrationCertificateUpdate,
    ],
):
    def __init__(
            self,
    ):
        super().__init__(CalibrationCertificateRepository())


class InstrumentCompetenceService(
    BaseService[
        InstrumentCompetence, InstrumentCompetenceCreate, InstrumentCompetenceUpdate
    ],
):
    def __init__(
            self,
    ):
        super().__init__(InstrumentCompetenceRepository())


class InstrumentRawDataService(
    BaseService[
        InstrumentRawData, InstrumentRawDataCreate, InstrumentRawDataUpdate
    ],
):
    def __init__(
            self,
    ):
        super().__init__(InstrumentRawDataRepository())


class InstrumentResultExclusionsService(
    BaseService[
        InstrumentResultExclusions, InstrumentResultExclusionsCreate, InstrumentResultExclusionsUpdate
    ],
):
    def __init__(
            self,
    ):
        super().__init__(InstrumentResultExclusionsRepository())


class InstrumentResultTranslationService(
    BaseService[
        InstrumentResultTranslation, InstrumentResultTranslationCreate, InstrumentResultTranslationUpdate
    ],
):
    def __init__(
            self,
    ):
        super().__init__(InstrumentResultTranslationRepository())
