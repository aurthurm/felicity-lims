from typing import Any, Optional

from pydantic import BaseModel, ConfigDict

from .enum import JobCategory, JobPriority, JobState


#
# Job Schemas
#
class JobBase(BaseModel):
    action: str | None = None
    category: str | None = JobCategory.WORKSHEET
    priority: int | None = JobPriority.NORMAL
    data: Optional[Any] = None
    job_id: str | None = None
    status: str | None = JobState.PENDING
    reason: str | None = None
    creator_uid: str | None = None


class Job(JobBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class JobCreate(JobBase):
    pass


class JobUpdate(JobBase):
    pass
