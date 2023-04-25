from datetime import datetime
from typing import Optional

from apps.common.schemas import BaseAuditModel
from core.uid_gen import FelicityIDType
from pydantic import EmailStr

#
#  Patient Schema
#

# Shared properties


class PatientBase(BaseAuditModel):
    client_patient_id: str | None = None
    client_uid: FelicityIDType| None = None
    patient_id: str | None = None
    first_name: str | None = None
    middle_name: str | None = None
    last_name: str | None = None
    gender: str | None = None
    age: int | None = None
    date_of_birth: datetime | None = None
    age_dob_estimated: bool| None = None
    phone_mobile: str | None = None
    phone_home: str | None = None
    consent_sms: bool| None = None
    email: Optional[EmailStr] = None
    internal_use: bool| None = False
    active: bool| None = None
    district_uid: FelicityIDType| None = None
    province_uid: FelicityIDType| None = None
    country_uid: FelicityIDType| None = None


# Properties to receive via API on creation
class PatientCreate(PatientBase):
    client_patient_id: str
    first_name: str
    last_name: str
    client_uid: FelicityIDType
    active: bool = True


# Properties to receive via API on update
class PatientUpdate(PatientBase):
    pass


class PatientInDBBase(PatientBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Patient(PatientInDBBase):
    pass


# Additional properties stored in DB
class PatientInDB(PatientInDBBase):
    pass


#
#  Identification Schema
#

# Shared properties


class IdentificationBase(BaseAuditModel):
    name: str


# Properties to receive via API on creation
class IdentificationCreate(IdentificationBase):
    pass


# Properties to receive via API on update
class IdentificationUpdate(IdentificationBase):
    pass


class IdentificationInDBBase(IdentificationBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Identification(IdentificationInDBBase):
    pass


# Additional properties stored in DB
class IdentificationInDB(IdentificationInDBBase):
    pass


#
#  PatientIdentification Schema
#

# Shared properties


class PatientIdentificationBase(BaseAuditModel):
    patient_uid: str
    identification_uid: str
    value: str


# Properties to receive via API on creation
class PatientIdentificationCreate(PatientIdentificationBase):
    pass


# Properties to receive via API on update
class PatientIdentificationUpdate(PatientIdentificationBase):
    pass


class PatientIdentificationInDBBase(PatientIdentificationBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class PatientIdentification(PatientIdentificationInDBBase):
    pass


# Additional properties stored in DB
class PatientIdentificationInDB(PatientIdentificationInDBBase):
    pass
