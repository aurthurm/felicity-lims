from datetime import datetime, timedelta
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict

from .enum import JobCategory, JobPriority, JobState
from ...core.dtz import timenow_dt


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
    next_try: datetime = timenow_dt() + timedelta(minutes=1)


class Job(JobBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class JobCreate(JobBase):
    pass


class JobUpdate(JobBase):
    pass
