from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.core.uid_gen import FelicityID
from felicity.api.gql.user.types import UserType


@strawberry.type
class MessageThreadType:
    uid: FelicityID
    recipients: List[UserType]
    messages: Optional[List["MessageType"]]
    broadcast: bool
    deleted_by: Optional[List[UserType]]
    created_by_uid: Optional[FelicityID]
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]


@strawberry.type
class MessageType:
    uid: FelicityID
    thread_uid: FelicityID
    thread: Optional["MessageThreadType"]
    body: str
    viewers: Optional[List[UserType]]
    deleted_by: Optional[List[UserType]]
    parent_id: int
    parent: Optional["MessageType"]
    left: int
    right: int
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
