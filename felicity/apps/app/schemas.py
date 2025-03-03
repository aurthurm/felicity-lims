from pydantic import ConfigDict

from felicity.apps.common.schemas import BaseAuditModel


class APPActivityLogBase(BaseAuditModel):
    token_identifier: str

    # Request Info
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


class APPActivityLogBaseInDB(APPActivityLogBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class APPActivityLogCreate(APPActivityLogBase):
    pass


# Properties to receive via API on update
class APPActivityLogUpdate(APPActivityLogBase):
    pass
