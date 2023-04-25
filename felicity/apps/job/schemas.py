from typing import Any, Optional

from core.uid_gen import FelicityIDType
from pydantic import BaseModel

from .conf import categories, priorities, states


#
# Job Schemas
#
class JobBase(BaseModel):
    action: str | None = None
    category: str | None = categories.WORKSHEET
    priority: int | None = priorities.NORMAL
    data: Optional[Any] = None
    job_id: FelicityIDType| None = None
    status: str | None = states.PENDING
    reason: str | None = None
    creator_uid: FelicityIDType| None = None


class Job(JobBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class JobCreate(JobBase):
    pass


class JobUpdate(JobBase):
    pass
