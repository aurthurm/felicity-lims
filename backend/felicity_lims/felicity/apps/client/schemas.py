from typing import Optional

from pydantic import BaseModel


#
# Client Schemas
# 

# Shared properties
class ClientBase(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    district_uid: Optional[int] = None
    email: Optional[str] = None
    email_cc: Optional[str] = None
    consent_email: Optional[bool] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    consent_sms: Optional[bool] = None
    internal_use: Optional[bool] = False
    active: Optional[bool] = True


class ClientBaseInDB(ClientBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ClientCreate(ClientBase):
    district_uid: Optional[int]


# Properties to receive via API on update
class ClientUpdate(ClientBase):
    pass


# Properties to return via API
class Client(ClientBaseInDB):
    pass


# Properties stored in DB
class ClientInDB(ClientBaseInDB):
    pass

#
# Client Contact Schemas
#


# Shared properties
class ClientContactBase(BaseModel):
    client_uid: Optional[int] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    email_cc: Optional[str] = None
    mobile_phone: Optional[str] = None
    consent_sms: Optional[bool] = False
    business_phone: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False


class ClientContactBaseInDB(ClientContactBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ClientContactCreate(ClientContactBase):
    client_uid: int


# Properties to receive via API on update
class ClientContactUpdate(ClientContactBase):
    pass


# Properties to return via API
class ClientContact(ClientContactBaseInDB):
    pass


# Properties stored in DB
class ClientContactInDB(ClientContactBaseInDB):
    pass
