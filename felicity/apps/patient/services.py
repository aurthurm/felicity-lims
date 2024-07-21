from datetime import datetime

from domain.client.ports.service import IClientService
from domain.exceptions import *
from domain.idsequence.ports.service import IIdSequenceService
from domain.patient.ports import IdentificationIn
from domain.patient.ports.repository import (
    IPatientRepository,
    IIdentificationRepository,
    IPatientIdentificationRepository,
)
from domain.patient.ports.service import (
    IIdentificationService,
    IPatientIdentificationService,
    IPatientService,
)
from domain.patient.schemas import (
    Identification,
    PatientIdentification,
    Patient,
    IdentificationCreate,
    IdentificationUpdate,
    PatientCreate,
    PatientIdentificationCreate,
    PatientUpdate,
    PatientIdentificationUpdate,
)
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.user.schemas import User


class IdentificationService(BaseService[Identification], IIdentificationService):
    def __init__(self, repository: IIdentificationRepository):
        self.repository = repository

    async def create(self, name: str, user: User) -> Identification:

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(
                f"The Identification name -> {name} <- already exists"
            )

        incoming = {
            "name": name,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        obj_in = IdentificationCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(self, uid: str, name: str) -> Identification:
        identification = await self.get(uid=uid)
        try:
            setattr(identification, "name", name)
        except AttributeError as e:
            ...

        id_in = IdentificationUpdate(**marshal(identification))
        return await super().update(**marshal(id_in))


class PatientIdentificationService(
    BaseService[PatientIdentification], IPatientIdentificationService
):
    def __init__(self, repository: IPatientIdentificationRepository):
        self.repository = repository

    async def create(
            self, patient: Patient, identifications: list[IdentificationIn]
    ) -> None:
        for p_id in identifications:
            pid_in = PatientIdentificationCreate(
                patient_uid=patient.uid,
                identification_uid=p_id.get("identification_uid"),
                value=p_id.get("value"),
            )
            await super().create(**marshal(pid_in))

    async def update(
            self, patient: Patient, identifications: list[IdentificationIn]
    ) -> None:
        update_identification_uids = [
            ident.get("identification_uid") for ident in identifications
        ]
        identifications = await self.get_all(patient_uid=patient.uid)
        identifications_uids = [ident.uid for ident in identifications]

        for identification in identifications:
            # deleted
            if identification.uid not in update_identification_uids:
                await self.delete(identification)
            else:  # update
                update_identification = list(
                    filter(
                        lambda x: x.identification_uid == identification.uid,
                        identifications,
                    )
                )[0]
                id_update_in = PatientIdentificationUpdate(
                    patient_uid=patient.uid, **marshal(update_identification)
                )
                await self.super().update(
                    update_identification, **marshal(id_update_in)
                )

        # new
        for _pid in identifications:
            if _pid.identification_uid not in identifications_uids:
                pid_in = PatientIdentificationCreate(
                    patient_uid=patient.uid,
                    identification_uid=_pid.get("identification_uid"),
                    value=_pid.get("value"),
                )
                await super().create(**marshal(pid_in))


class PatientService(BaseService[Patient], IPatientService):
    def __init__(
            self,
            repository: IPatientRepository,
            id_sequence_service: IIdSequenceService,
            client_service: IClientService,
            patient_identification_service: IPatientIdentificationService,
    ):
        self.repository = repository
        self.id_sequence_service = id_sequence_service
        self.client_service = client_service
        self.patient_identification_service = patient_identification_service

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

    async def create(
            self,
            client_patient_id: str,
            first_name: str,
            last_name: str,
            client_uid: str,
            gender: str,
            middle_name: str | None,
            age: int | None,
            date_of_birth: datetime | None,
            age_dob_estimated: bool | None,
            phone_mobile: str | None,
            phone_home: str | None,
            consent_sms: bool | None,
            internal_use: bool | None,
            country_uid: str | None,
            province_uid: str | None,
            district_uid: str | None,
            identifications: list[IdentificationIn] | None,
            user: User,
    ) -> Patient:
        payload = locals()

        exists = await self.get(client_patient_id=client_patient_id)
        if exists:
            raise AlreadyExistsError(f"Client Patient Id already in use")

        incoming: dict = {
            "patient_id": (
                await self.id_sequence_service.get_next_number(prefix="P", generic=True)
            )[1],
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = PatientCreate(**incoming)
        patient = await super().create(**marshal(obj_in))

        await self.patient_identification_service.create(
            patient, payload.identifications  # noqa
        )
        return patient

    async def update(
            self,
            uid: str,
            client_patient_id: str,
            first_name: str,
            last_name: str,
            client_uid: str,
            gender: str,
            middle_name: str | None,
            age: int | None,
            date_of_birth: datetime | None,
            age_dob_estimated: bool | None,
            phone_mobile: str | None,
            phone_home: str | None,
            consent_sms: bool | None,
            internal_use: bool | None,
            country_uid: str | None,
            province_uid: str | None,
            district_uid: str | None,
            identifications: list[IdentificationIn] | None,
            user: User,
    ) -> Patient:
        payload = locals()

        patient = await self.get(uid=uid)
        obj_data = marshal(patient)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(patient, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(patient, "updated_by_uid", user.uid)

        obj_in = PatientUpdate(**marshal(patient))
        patient = await super().update(obj_in, **marshal(patient))

        await self.patient_identification_service.update(
            patient, payload.identifications  # noqa
        )
        return await self.get(uid=patient.uid)
