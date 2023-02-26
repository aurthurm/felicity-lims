from typing import Dict, List, Optional, Union, Any

from pydantic import BaseModel

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
    creator_uid: Optional[int] = None


class Job(JobBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class JobCreate(JobBase):
    pass


class JobUpdate(JobBase):
    pass
