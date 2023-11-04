from pydantic import BaseModel
from pydantic import ConfigDict


#
# Client Schemas
#

# Shared properties


class ClientBase(BaseModel):
    name: str | None = None
    code: str | None = None
    district_uid: str | None = None
    email: str | None = None
    email_cc: str | None = None
    consent_email: bool | None = None
    phone_mobile: str | None = None
    phone_business: str | None = None
    consent_sms: bool | None = None
    internal_use: bool | None = False
    active: bool | None = True


class ClientBaseInDB(ClientBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ClientCreate(ClientBase):
    district_uid: str | None = None


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
    client_uid: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    email_cc: str | None = None
    mobile_phone: str | None = None
    consent_sms: bool | None = False
    business_phone: str | None = None
    is_active: bool | None = True
    is_superuser: bool | None = False


class ClientContactBaseInDB(ClientContactBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ClientContactCreate(ClientContactBase):
    client_uid: str


# Properties to receive via API on update
class ClientContactUpdate(ClientContactBase):
    pass


# Properties to return via API
class ClientContact(ClientContactBaseInDB):
    pass


# Properties stored in DB
class ClientContactInDB(ClientContactBaseInDB):
    pass
