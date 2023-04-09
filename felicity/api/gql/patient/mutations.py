import logging
from datetime import datetime
from typing import Dict, Optional, List
from dataclasses import field
import strawberry  # noqa

from felicity.api.gql import OperationError, auth_from_info, verify_user_auth
from felicity.api.gql.patient.types import PatientType, PatientIdentificationType, IdentificationType
from felicity.apps.client import models as client_models
from felicity.apps.patient import models, schemas
from felicity.core.uid_gen import FelicityID

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
    client_uid: FelicityID
    gender: str
    middle_name: Optional[str] = None
    age: Optional[int] = None
    date_of_birth: Optional[datetime] = None
    age_dob_estimated: Optional[bool] = False
    phone_mobile: Optional[str] = None
    phone_home: Optional[str] = None
    consent_sms: Optional[bool] = False
    internal_use: Optional[bool] = False
    country_uid: Optional[FelicityID] = None
    province_uid: Optional[FelicityID] = None
    district_uid: Optional[FelicityID] = None
    identifications: Optional[List[PatientidentificationInput]] = field(
        default_factory=[]
    )


IdentificationResponse = strawberry.union(
    "IdentificationResponse",
    (IdentificationType, OperationError),  # noqa
    description="",
)


@ strawberry.type
class PatientMutations:
    @strawberry.mutation
    async def create_identification(info, name: str) -> IdentificationResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create person identification",
        )

        if not name:
            return OperationError(error="name is mandatory")

        exists = await models.Identification.get(name=name)
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
        identification: models.Identification = await models.Identification.create(obj_in)
        return IdentificationType(**identification.marshal_simple())

    @strawberry.mutation
    async def update_identification(
        info, uid: FelicityID, name: str
    ) -> IdentificationResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update person identifications",
        )

        identification = await models.Identification.get(uid=uid)
        if not identification:
            return OperationError(error=f"identification with uid {uid} does not exist")

        try:
            setattr(identification, "name", name)
        except AttributeError as e:
            logger.warning(e)

        id_in = schemas.IdentificationUpdate(*identification.to_dict())
        identification = await identification.update(id_in)
        return IdentificationType(**identification.marshal_simple())

    @strawberry.mutation
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

        exists = await models.Patient.get(client_patient_id=payload.client_patient_id)
        if exists:
            return OperationError(error=f"Client Patient Id already in use")

        client = await client_models.Client.get(uid=payload.client_uid)
        if not client:
            return OperationError(
                error=f"Client with uid {payload.client_uid} does not exist"
            )

        incoming: Dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.PatientCreate(**incoming)
        patient: models.Patient = await models.Patient.create(obj_in)

        # create identifications
        for p_id in payload.identifications:
            pid_in = schemas.PatientIdentificationCreate(
                patient_uid=patient.uid,
                identification_uid=p_id.identification_uid,
                value=p_id.value
            )
            await models.PatientIdentification.create(pid_in)

        return PatientType(**patient.marshal_simple())

    @strawberry.mutation
    async def update_patient(
        self, info, uid: FelicityID, payload: PatientInputType
    ) -> PatientResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update patients",
        )

        if not uid:
            return OperationError(error="No uid provided to idenity update obj")

        patient: models.Patient = await models.Patient.get(uid=uid)
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
        return PatientType(**patient.marshal_simple())
