from typing import Optional
from datetime import datetime

import strawberry  # noqa
from core.uid_gen import FelicityID


@strawberry.type
class DepartmentType:
    uid: FelicityID
    name: str | None
    description: str | None
    code: str | None
    #
    created_by_uid: FelicityID | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_at: datetime | None