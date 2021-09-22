from typing import Optional

from pydantic import BaseModel

from .conf import states, categories, priorities


# 
# Job Schemas
# 
class JobBase(BaseModel):
    action: Optional[str] = None
    category: Optional[str] = categories.WORKSHEET
    priority: Optional[int] = priorities.NORMAL
    job_id: Optional[str] = None
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
