from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.patient.entities import (
    Identification,
    Patient,
    PatientIdentification,
)


class PatientRepository(BaseRepository[Patient]):
    def __init__(self) -> None:
        super().__init__(Patient)


class IdentificationRepository(BaseRepository[Identification]):
    def __init__(self) -> None:
        super().__init__(Identification)


class PatientIdentificationRepository(BaseRepository[PatientIdentification]):
    def __init__(self) -> None:
        super().__init__(PatientIdentification)
