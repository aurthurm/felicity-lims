from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.setup.types.department import DepartmentType
from felicity.api.gql.user.types import GroupType, UserType


@strawberry.type
class NoticeType:
    uid: str
    departments: Optional[List[DepartmentType]] = None
    groups: Optional[List[GroupType]] = None
    title: str
    body: str
    viewers: list[UserType] | None = None
    expiry: str  # datetime
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
