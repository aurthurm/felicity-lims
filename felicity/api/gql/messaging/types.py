from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.user.types import UserType


@strawberry.type
class MessageThreadType:
    uid: str
    recipients: List[UserType]
    messages: Optional[List["MessageType"]]
    broadcast: bool
    deleted_by: list[UserType] | None
    created_by_uid: str | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class MessageType:
    uid: str
    thread_uid: str
    thread: Optional["MessageThreadType"]
    body: str
    viewers: list[UserType] | None
    deleted_by: list[UserType] | None
    parent_id: str
    parent: Optional["MessageType"]
    left: int
    right: int
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None
