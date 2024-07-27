from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import JSONB

from felicity.apps.abstract import BaseEntity


class Job(BaseEntity):
    __tablename__ = "job"

    action = Column(String)
    category = Column(String)
    priority = Column(Integer)
    data = Column(JSONB)
    job_id = Column(String)
    creator_uid = Column(String)
    status = Column(String)
    reason = Column(String)
    next_try = Column(DateTime, nullable=True)
    retries = Column(Integer, default=1)

    @property
    def is_ready_for_execution(self):
        current_time = datetime.now()
        return self.next_try <= current_time if self.next_try else True
