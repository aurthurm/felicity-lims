from pydantic import ConfigDict

from felicity.apps.common.schemas import BaseAuditModel


class APPActivityLogBase(BaseAuditModel):
    token_identifier: str
    user_uid: str | None

    # Request Info
    request_id: str | None
    path: str
    method: str
    query_params: str
    headers: str
    body: str

    # Response info
    response_code: int
    response_body: str

    # Meta information
    ip_address: str
    user_agent: str
    # length
    duration: float

    # Multitenancy
    laboratory_uid: str | None
    organization_uid: str | None


class APPActivityLogBaseInDB(APPActivityLogBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class APPActivityLogCreate(APPActivityLogBase):
    pass


# Properties to receive via API on update
class APPActivityLogUpdate(APPActivityLogBase):
    pass
