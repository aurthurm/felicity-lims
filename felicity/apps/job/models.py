from datetime import datetime, timedelta

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB

from felicity.database.base_class import DBModel
from . import conf, schemas


class Job(DBModel):
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

    async def backoff(self, minutes=5, max_retries=5):
        bck = minutes * self.retries
        self.next_try = datetime.now() + timedelta(minutes=bck)

        if self.retries >= max_retries + 1:
            self.status = conf.states.FAILED
            self.reason = f"max retries have been exceeded: {max_retries}"

        self.retries += 1
        await self.save_async()

    @property
    def is_ready_for_execution(self):
        current_time = datetime.now()
        return self.next_try <= current_time if self.next_try else True

    @classmethod
    async def fetch_sorted(cls):
        _jobs = Job.smart_query(
            filters={
                "status__notin": [
                    conf.states.FINISHED,
                    conf.states.FAILED,
                    conf.states.RUNNING,
                ]
            },
            sort_attrs=["-priority"],
        )
        jobs = await Job.from_smart_query(_jobs)
        return list(filter(lambda job: job.is_ready_for_execution, jobs))

    async def change_status(self, new_status, change_reason=""):
        self.status = new_status
        self.reason = change_reason
        await self.save_async()

    async def increase_priority(self):
        if self.priority < conf.priorities.HIGH:
            self.priority += 1
            await self.save_async()

    async def decrease_priority(self):
        if self.priority > conf.priorities.NORMAL:
            self.priority -= 1
            await self.save_async()

    @classmethod
    async def create(cls, obj_in: dict | schemas.JobCreate) -> schemas.Job:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | schemas.JobUpdate) -> schemas.Job:
        data = self._import(obj_in)
        return await super().update(**data)
