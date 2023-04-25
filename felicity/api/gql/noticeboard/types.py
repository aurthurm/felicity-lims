from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql.setup.types import DepartmentType
from api.gql.user.types import GroupType, UserType
from core.uid_gen import FelicityID


@strawberry.type
class NoticeType:
    uid: FelicityID
    departments: Optional[List[DepartmentType]]
    groups: Optional[List[GroupType]]
    title: str
    body: str
    viewers: list[UserType] | None
    expiry: datetime
    created_at: datetime | None
    created_by_uid: FelicityID | None
    created_by: UserType | None
    updated_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
