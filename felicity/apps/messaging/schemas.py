from typing import List, Optional

from apps.common.schemas import BaseAuditModel
from apps.user.schemas import User
from core.uid_gen import FelicityIDType


#
# Message Schemas
#
class MessageBase(BaseAuditModel):
    thread_uid: FelicityIDType
    thread: Optional["MessageThread"] = None
    body: str | None = ""
    viewers: Optional[List[User]] = []
    deleted_by: Optional[List[User]] = []
    parent_id: FelicityIDType| None = None


class Message(MessageBase):
    uid: FelicityIDType| None = None

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
    broadcast: bool| None = False
    recipients: Optional[List[User]] = []
    messages: Optional[List[Message]] = []
    recipients: Optional[List[User]] = []


class MessageThread(MessageThreadBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class MessageThreadCreate(MessageThreadBase):
    pass


class MessageThreadUpdate(MessageThreadBase):
    pass
