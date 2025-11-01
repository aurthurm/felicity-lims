from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.user.types import UserType


@strawberry.type
class MessageThreadType:
    uid: str
    recipients: List[UserType] = None
    messages: Optional[List["MessageType"]] = None
    broadcast: bool
    deleted_by: list[UserType] | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_by_uid: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class MessageType:
    uid: str
    thread_uid: str
    thread: Optional["MessageThreadType"] = None
    body: str
    viewers: list[UserType] | None = None
    deleted_by: list[UserType] | None = None
    parent_id: str
    parent: Optional["MessageType"] = None
    left: int
    right: int
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
