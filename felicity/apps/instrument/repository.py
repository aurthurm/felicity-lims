from felicity.apps.abstract import BaseRepository
from felicity.apps.instrument.entities import (
    CalibrationCertificate,
    Instrument,
    InstrumentCalibration,
    InstrumentCompetence,
    InstrumentType,
    LaboratoryInstrument,
    Method,
)


class MethodRepository(BaseRepository[Method]):
    def __init__(self) -> None:
        super().__init__(Method)


class InstrumentRepository(BaseRepository[Instrument]):
    def __init__(self) -> None:
        super().__init__(Instrument)


class LaboratoryInstrumentRepository(
    BaseRepository[LaboratoryInstrument],
):
    def __init__(
        self,
    ):
        super().__init__(LaboratoryInstrument)


class InstrumentTypeRepository(BaseRepository[InstrumentType]):
    def __init__(self) -> None:
        super().__init__(InstrumentType)


class InstrumentCalibrationRepository(BaseRepository[InstrumentCalibration]):
    def __init__(self) -> None:
        super().__init__(InstrumentCalibration)


class CalibrationCertificateRepository(BaseRepository[CalibrationCertificate]):
    def __init__(self) -> None:
        super().__init__(CalibrationCertificate)


class InstrumentCompetenceRepository(
    BaseRepository[InstrumentCompetence],
):
    def __init__(
        self,
    ):
        super().__init__(InstrumentCompetence)
