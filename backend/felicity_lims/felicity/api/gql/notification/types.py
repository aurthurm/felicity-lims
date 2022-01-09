from datetime import datetime
from typing import Optional

import strawberry  # noqa
from felicity.api.gql.setup.types import DepartmentType
from felicity.api.gql.user.types import GroupType, UserType


@strawberry.type
class NotificationType:
    uid: int
    departments: Optional[DepartmentType]
    groups: Optional[GroupType]
    users: Optional[UserType]
    message: str
    viewers: Optional[UserType]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
