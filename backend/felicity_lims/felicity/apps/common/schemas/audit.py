from datetime import datetime
from typing import Optional

from pydantic import BaseModel
from felicity.core.uid_gen import FelicityIDType


class BaseAuditModel(BaseModel):
    created_at: Optional[datetime] = None
    created_by_uid: Optional[FelicityIDType] = None
    created_by: Optional["User"] = None  # noqa
    updated_at: Optional[datetime] = None
    updated_by_uid: Optional[FelicityIDType] = None
    updated_by: Optional["User"] = None  # noqa
