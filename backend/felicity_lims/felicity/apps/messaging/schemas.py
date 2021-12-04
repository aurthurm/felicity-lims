from typing import Optional, List

from felicity.apps import BaseAuditModel
from felicity.apps.user.schemas import User


#
# Message Schemas
#
class MessageBase(BaseAuditModel):
    recipients: Optional[List[User]] = []
    subject: Optional[str] = ""
    body: Optional[str] = ""
    viewers: Optional[List[User]] = []
    deleted_by: Optional[List[User]] = []
    broadcast: Optional[bool] = False


class Message(MessageBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class MessageCreate(MessageBase):
    pass


class MessageUpdate(MessageBase):
    pass
