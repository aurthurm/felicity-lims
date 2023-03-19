from typing import Any, Optional

from pydantic import BaseModel

from felicity.core.uid_gen import FelicityIDType
from .conf import categories, priorities, states


#
# Job Schemas
#
class JobBase(BaseModel):
    action: Optional[str] = None
    category: Optional[str] = categories.WORKSHEET
    priority: Optional[int] = priorities.NORMAL
    data: Optional[Any] = None
    job_id: Optional[int] = None
    status: Optional[str] = states.PENDING
    reason: Optional[str] = None
    creator_uid: Optional[FelicityIDType] = None


class Job(JobBase):
    uid: Optional[FelicityIDType] = None

    class Config:
        orm_mode = True


class JobCreate(JobBase):
    pass


class JobUpdate(JobBase):
    pass
