from felicity.apps.abstract.service import BaseService
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.patient.entities import (Identification, Patient,
                                            PatientIdentification)
from felicity.apps.patient.repository import (IdentificationRepository,
                                              PatientIdentificationRepository,
                                              PatientRepository)
from felicity.apps.patient.schemas import (IdentificationCreate,
                                           IdentificationUpdate, PatientCreate,
                                           PatientIdentificationCreate,
                                           PatientIdentificationUpdate,
                                           PatientUpdate)


class IdentificationService(
    BaseService[Identification, IdentificationCreate, IdentificationUpdate]
):
    def __init__(self):
        super().__init__(IdentificationRepository)


class PatientIdentificationService(
    BaseService[
        PatientIdentification, PatientIdentificationCreate, PatientIdentificationUpdate
    ]
):
    def __init__(self):
        super().__init__(PatientIdentificationRepository)


class PatientService(BaseService[Patient, PatientCreate, PatientUpdate]):

    def __init__(self):
        self.id_sequence_service = IdSequenceService()
        super().__init__(PatientRepository)

    async def search(self, query_string: str) -> list[Patient]:
        filters = {
            "first_name": query_string,
            "middle_name": query_string,
            "last_name": query_string,
            "patient_id": query_string,
            "client_patient_id": query_string,
            "phone_mobile": query_string,
            "phone_home": query_string,
        }
        return await super().search(**filters)

    async def create(self, obj_in: dict | PatientCreate, related: list[str] = None) -> Patient:
        data = self._import(obj_in)
        data["patient_id"] = (
            await self.id_sequence_service.get_next_number(prefix="P", generic=True)
        )[1]
        return await super().create(data, related)
