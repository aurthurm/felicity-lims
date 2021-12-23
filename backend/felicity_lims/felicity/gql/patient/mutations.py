import inspect
import logging
from datetime import datetime
from typing import Dict, Optional

import strawberry

from felicity.apps.patient import models, schemas
from felicity.apps.client import models as client_models
from felicity.gql.patient.types import (
    PatientType,
)
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class PatientMutations:
    @strawberry.mutation
    async def create_patient(self, info, client_patient_id: str, first_name: str, last_name: str, client_uid: int,
                             middle_name: Optional[str] = None, gender: Optional[int] = None, age: Optional[int] = None,
                             date_of_birth: Optional[datetime] = None, age_dob_estimated: Optional[bool] = False,
                             phone_mobile: Optional[str] = None, phone_home: Optional[str] = None, consent_sms: Optional[bool] = False,
                             internal_use: Optional[bool] = False) -> PatientType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not client_patient_id or not first_name or not last_name or not client_uid:
            raise Exception("Client Patient Id, First Name and Last Name , gender etc are required")

        exists = await models.Patient.get(client_patient_id=client_patient_id)
        if exists:
            raise Exception(f"Client Patient Id already in use")

        client = await client_models.Client.get(uid=client_uid)
        if not client:
            raise Exception(f"Client with uid {client_uid} does not exist")

        incoming: Dict = dict()
        for k, v in passed_args.items():
            incoming[k] = v

        # Dirty patient_id Getter
        # Im skeptical of the way i am creating the patient_id especially if there are many queries
        # almost at the same time that might have the same patient id
        # give_up = 20
        # i = 0
        # while True:
        #     patient_id = models.Patient.create_patient_id()
        #     incoming["patient_id"] = patient_id
        #     obj_in = schemas.PatientCreate(**incoming)
        #     error = ""
        #     try:
        #         patient = models.Patient.create(obj_in)
        #         break
        #     except Exception as e:
        #         error = e

        #     if i == give_up: # give up
        #         raise GraphQLError(f"Exception:  {error}")

        #     # retry again
        #     i+=1

        obj_in = schemas.PatientCreate(**incoming)
        patient: models.Patient = await models.Patient.create(obj_in)
        return patient

    @strawberry.mutation
    async def update_patient(self, info, uid: int, client_patient_id: str, first_name: str, last_name: str, client_uid: int,
                             middle_name: Optional[str] = None, gender: Optional[int] = None, age: Optional[int] = None,
                             date_of_birth: Optional[datetime] = None, age_dob_estimated: Optional[bool] = False,
                             phone_mobile: Optional[str] = None, phone_home: Optional[str] = None, consent_sms: Optional[bool] = False,
                             internal_use: Optional[bool] = False) -> PatientType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to idenity update obj")

        patient: models.Patient = await models.Patient.get(uid=uid)
        if not patient:
            raise Exception(f"patient with uid {uid} not found. Cannot update obj ...")

        obj_data = patient.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(patient, field, passed_args[field])
                except Exception as e:
                    pass
        obj_in = schemas.PatientUpdate(**patient.to_dict())
        patient = await patient.update(obj_in)
        return patient
