from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class BaseAuditModel(BaseModel):
    created_at: Optional[datetime] = None
    created_by_uid: Optional[int] = None
    created_by: Optional['User'] = None  # noqa
    updated_at: Optional[datetime] = None
    updated_by_uid: Optional[int] = None
    updated_by: Optional['User'] = None  # noqa
