from datetime import datetime

from pydantic import BaseModel


class BaseAuditModel(BaseModel):
    created_at: datetime | None = None
    created_by_uid: str | None = None
    updated_at: datetime | None = None
    updated_by_uid: str | None = None
