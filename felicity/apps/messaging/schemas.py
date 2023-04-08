from typing import List, Optional

from felicity.apps.common.schemas import BaseAuditModel
from felicity.apps.user.schemas import User
from felicity.core.uid_gen import FelicityIDType


#
# Message Schemas
#
class MessageBase(BaseAuditModel):
    thread_uid: FelicityIDType
    thread: Optional["MessageThread"] = None
    body: Optional[str] = ""
    viewers: Optional[List[User]] = []
    deleted_by: Optional[List[User]] = []
    parent_id: Optional[FelicityIDType] = None


class Message(MessageBase):
    uid: Optional[FelicityIDType] = None

    class Config:
        orm_mode = True


class MessageCreate(MessageBase):
    pass


class MessageUpdate(MessageBase):
    pass


#
# MessageThread Schemas
#
class MessageThreadBase(BaseAuditModel):
    broadcast: Optional[bool] = False
    recipients: Optional[List[User]] = []
    messages: Optional[List[Message]] = []
    recipients: Optional[List[User]] = []


class MessageThread(MessageThreadBase):
    uid: Optional[FelicityIDType] = None

    class Config:
        orm_mode = True


class MessageThreadCreate(MessageThreadBase):
    pass


class MessageThreadUpdate(MessageThreadBase):
    pass
