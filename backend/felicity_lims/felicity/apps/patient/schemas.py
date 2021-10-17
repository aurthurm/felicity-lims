from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


#  
#  Patient Schema
# 

# Shared properties
class PatientBase(BaseModel):
    client_patient_id: Optional[str] = None
    client_uid: Optional[int] = None
    patient_id: Optional[str] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None  
    gender: Optional[int] = 2
    age: Optional[int] = None
    date_of_birth: Optional[datetime] = None
    age_dob_estimated: Optional[bool] = None
    phone_mobile: Optional[str] = None
    phone_home: Optional[str] = None
    consent_sms: Optional[bool] = None
    email: Optional[EmailStr] = None
    internal_use: Optional[bool] = False
    active: Optional[bool] = None  


# Properties to receive via API on creation
class PatientCreate(PatientBase):
    client_patient_id: str
    first_name: str
    last_name: str
    client_uid: int
    active: bool = True


# Properties to receive via API on update
class PatientUpdate(PatientBase):
    pass


class PatientInDBBase(PatientBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Patient(PatientInDBBase):
    pass


# Additional properties stored in DB
class PatientInDB(PatientInDBBase):
    pass