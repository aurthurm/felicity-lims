from typing import Optional, List

from felicity.apps import BaseAuditModel
from felicity.apps.user.schemas import User


#
# Message Schemas
#
class MessageBase(BaseAuditModel):
    thread_uid: int
    thread: Optional["MessageThread"] = None
    body: Optional[str] = ""
    viewers: Optional[List[User]] = []
    deleted_by: Optional[List[User]] = []
    parent_id: Optional[int] = None


class Message(MessageBase):
    uid: Optional[int] = None

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
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class MessageThreadCreate(MessageThreadBase):
    pass


class MessageThreadUpdate(MessageThreadBase):
    pass
