from typing import Optional
from datetime import datetime

import strawberry  # noqa



@strawberry.type
class DepartmentType:
    uid: str
    name: str | None
    description: str | None
    code: str | None
    #
    created_by_uid: str | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_at: datetime | None