from typing import Optional
from datetime import datetime
import strawberry

from felicity.gql.setup.types import DepartmentType
from felicity.gql.user.types import UserType, GroupType


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
