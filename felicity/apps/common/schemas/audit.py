from datetime import datetime
from typing import Optional


from pydantic import BaseModel


class BaseAuditModel(BaseModel):
    created_at: datetime | None = None
    created_by_uid: str| None = None
    created_by: Optional["User"] = None  # noqa
    updated_at: datetime | None = None
    updated_by_uid: str| None = None
    updated_by: Optional["User"] = None  # noqa
