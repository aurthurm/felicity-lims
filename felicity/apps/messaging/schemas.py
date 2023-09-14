from typing import List, Optional

from pydantic import ConfigDict

from apps.common.schemas import BaseAuditModel
from apps.user.schemas import User


#
# Message Schemas
#
class MessageBase(BaseAuditModel):
    thread_uid: str
    thread: Optional["MessageThread"] = None
    body: str | None = ""
    viewers: Optional[List[User]] = []
    deleted_by: Optional[List[User]] = []
    parent_id: str | None = None


class Message(MessageBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class MessageCreate(MessageBase):
    pass


class MessageUpdate(MessageBase):
    pass


#
# MessageThread Schemas
#
class MessageThreadBase(BaseAuditModel):
    broadcast: bool | None = False
    recipients: Optional[List[User]] = []
    messages: Optional[List[Message]] = []
    recipients: Optional[List[User]] = []


class MessageThread(MessageThreadBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class MessageThreadCreate(MessageThreadBase):
    pass


class MessageThreadUpdate(MessageThreadBase):
    pass
