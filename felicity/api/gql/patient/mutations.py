import logging
from dataclasses import field
from datetime import datetime
from typing import Dict, List, Optional

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info, verify_user_auth
from felicity.api.gql.patient.types import IdentificationType, PatientType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.client import entities as client_entities
from felicity.apps.patient import entities, schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PatientResponse = strawberry.union(
    "PatientResponse", (PatientType, OperationError), description=""  # noqa
)


@strawberry.input
class PatientidentificationInput:
    value: str
    identification_uid: str


@strawberry.input
class PatientInputType:
    client_patient_id: str
    first_name: str
    last_name: str
    client_uid: str
    gender: str
    middle_name: str | None = None
    age: int | None = None
    date_of_birth: datetime | None = None
    age_dob_estimated: bool | None = False
    phone_mobile: str | None = None
    phone_home: str | None = None
    consent_sms: bool | None = False
    internal_use: bool | None = False
    country_uid: str | None = None
    province_uid: str | None = None
    district_uid: str | None = None
    identifications: Optional[List[PatientidentificationInput]] = field(
        default_factory=list
    )


IdentificationResponse = strawberry.union(
    "IdentificationResponse",
    (IdentificationType, OperationError),  # noqa
    description="",
)


@strawberry.type
class PatientMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_identification(info, name: str) -> IdentificationResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create person identification",
        )

        if not name:
            return OperationError(error="name is mandatory")

        exists = await entities.Identification.get(name=name)
        if exists:
            return OperationError(
                error=f"The Identfication name -> {name} <- already exists"
            )

        incoming = {
            "name": name,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        obj_in = schemas.IdentificationCreate(**incoming)
        identification: entities.Identification = await entities.Identification.create(
            obj_in
        )
        return IdentificationType(**identification.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_identification(
        info, uid: str, name: str
    ) -> IdentificationResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update person identifications",
        )

        identification = await entities.Identification.get(uid=uid)
        if not identification:
            return OperationError(error=f"identification with uid {uid} does not exist")

        try:
            setattr(identification, "name", name)
        except AttributeError as e:
            logger.warning(e)

        id_in = schemas.IdentificationUpdate(**identification.to_dict())
        identification = await identification.update(id_in)
        return IdentificationType(**identification.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_patient(self, info, payload: PatientInputType) -> PatientResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        auth_success, auth_error = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create patients",
        )
        if not auth_success:
            return auth_error

        if (
            not payload.client_patient_id
            or not payload.first_name
            or not payload.last_name
            or not payload.client_uid
        ):
            return OperationError(
                error="Client Patient Id, First Name and Last Name , gender etc are required"
            )

        exists = await entities.Patient.get(client_patient_id=payload.client_patient_id)
        if exists:
            return OperationError(error=f"Client Patient Id already in use")

        client = await client_entities.Client.get(uid=payload.client_uid)
        if not client:
            return OperationError(
                error=f"Client with uid {payload.client_uid} does not exist"
            )

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.PatientCreate(**incoming)
        patient: entities.Patient = await entities.Patient.create(obj_in)

        # create identifications
        for p_id in payload.identifications:
            pid_in = schemas.PatientIdentificationCreate(
                patient_uid=patient.uid,
                identification_uid=p_id.identification_uid,
                value=p_id.value,
            )
            await entities.PatientIdentification.create(pid_in)

        return PatientType(**patient.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_patient(
        self, info, uid: str, payload: PatientInputType
    ) -> PatientResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update patients",
        )

        if not uid:
            return OperationError(error="No uid provided to idenity update obj")

        patient: entities.Patient = await entities.Patient.get(uid=uid)
        if not patient:
            return OperationError(
                error=f"patient with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = patient.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(patient, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(patient, "updated_by_uid", felicity_user.uid)

        obj_in = schemas.PatientUpdate(**patient.to_dict())
        patient = await patient.update(obj_in)

        # update identifications
        update_identification_uids = [
            id.identification_uid for id in payload.identifications
        ]
        identifications = await entities.PatientIdentification.get_all(
            patient_uid=patient.uid
        )
        identifications_uids = [id.uid for id in identifications]

        for identification in identifications:
            # deleted
            if not identification.uid in update_identification_uids:
                await identification.delete()
            else:  # update
                update_identification = list(
                    filter(
                        lambda x: x.identification_uid == identification.uid,
                        payload.identifications,
                    )
                )[0]
                id_update_in = schemas.PatientIdentificationUpdate(
                    patient_uid=patient.uid, **id_update_in.to_dict()
                )
                identification = await identification.update(id_update_in)

        # new
        for _pid in payload.identifications:
            if not _pid.identification_uid in identifications_uids:
                pid_in = schemas.PatientIdentificationCreate(
                    patient_uid=patient.uid,
                    identification_uid=_pid.identification_uid,
                    value=_pid.value,
                )
                await entities.PatientIdentification.create(pid_in)

        patient = await entities.Patient.get(uid=patient.uid)
        return PatientType(**patient.marshal_simple())
