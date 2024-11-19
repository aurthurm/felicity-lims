from felicity.apps.abstract.service import BaseService
from felicity.apps.client.services import ClientService
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.patient.entities import (
    Identification,
    Patient,
    PatientIdentification,
)
from felicity.apps.patient.repository import (
    IdentificationRepository,
    PatientIdentificationRepository,
    PatientRepository,
)
from felicity.apps.patient.schemas import (
    IdentificationCreate,
    IdentificationUpdate,
    PatientCreate,
    PatientIdentificationCreate,
    PatientIdentificationUpdate,
    PatientUpdate,
)


class IdentificationService(
    BaseService[Identification, IdentificationCreate, IdentificationUpdate]
):
    def __init__(self):
        super().__init__(IdentificationRepository())


class PatientIdentificationService(
    BaseService[
        PatientIdentification, PatientIdentificationCreate, PatientIdentificationUpdate
    ]
):
    def __init__(self):
        super().__init__(PatientIdentificationRepository())


class PatientService(BaseService[Patient, PatientCreate, PatientUpdate]):
    def __init__(self):
        self.id_sequence_service = IdSequenceService()
        super().__init__(PatientRepository())

    async def search(self, query_string: str | None = None) -> list[Patient]:
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

    async def create(
            self, obj_in: dict | PatientCreate, related: list[str] | None = None
    ) -> Patient:
        data = self._import(obj_in)
        data["patient_id"] = (
            await self.id_sequence_service.get_next_number(prefix="P", generic=True)
        )[1]
        return await super().create(data, related)

    async def snapshot(self, pt: Patient, metadata: dict = {}):
        fields = ["client", "province", "district", "country"]
        patient = await self.get(related=["province", "district", "country"], uid=pt.uid)
        for _field in fields:
            if _field not in metadata:
                if _field == "client":
                    client = await ClientService().get(related=["province", "district"], uid=pt.client_uid)
                    metadata[_field] = client.snapshot()
                    metadata[_field]["province"] = client.province.snapshot() if client.province else None
                    metadata[_field]["district"] = client.district.snapshot() if client.district else None
                if _field == "province":
                    metadata[_field] = patient.province.snapshot() if patient.province else None
                if _field == "district":
                    metadata[_field] = patient.district.snapshot() if patient.district else None
                if _field == "country":
                    metadata[_field] = patient.country.snapshot() if patient.country else None
        return await self.update(pt.uid, {"metadata_snapshot": marshaller(metadata, depth=3)})
