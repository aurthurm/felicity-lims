from typing import Optional, List
from datetime import datetime

import strawberry  # noqa

from felicity.gql.user.types import UserType


@strawberry.type
class MessageThreadType:
    uid: int
    recipients: List[UserType]
    messages: Optional[List["MessageType"]]
    broadcast: bool
    deleted_by: Optional[List[UserType]]
    created_by_uid: Optional[int]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]


@strawberry.type
class MessageType:
    uid: int
    thread_uid: int
    thread: Optional["MessageThreadType"]
    body: str
    viewers: Optional[List[UserType]]
    deleted_by: Optional[List[UserType]]
    parent_id: int
    parent: Optional['MessageType']
    left: int
    right: int
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
