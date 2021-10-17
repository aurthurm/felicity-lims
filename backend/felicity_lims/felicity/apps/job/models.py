from sqlalchemy import Column, String, Integer

from felicity.database.base_class import DBModel
from . import schemas, conf


class Job(DBModel):
    action = Column(String)
    category = Column(String)
    priority = Column(Integer)
    job_id = Column(Integer)
    creator_uid = Column(Integer)
    status = Column(String)
    reason = Column(String)

    async def change_status(self, new_status, change_reason=""):
        self.status = new_status
        self.reason = change_reason
        await self.save()

    async def increase_priority(self):
        if self.priority < conf.priorities.HIGH:
            self.priority += 1
            await self.save()

    async def decrease_priority(self):
        if self.priority > conf.priorities.NORMAL:
            self.priority -= 1
            await self.save()

    @classmethod
    async def fetch_sorted(cls):
        exclude = [conf.states.FINISHED, conf.states.FAILED]
        jobs = await Job.where(status__notin=exclude).sort('-priority').all()
        _jobs = Job.smart_query(
            filters={
                'status__notin': [conf.states.FINISHED, conf.states.FAILED],
            },
            sort_attrs=['-priority']
        )
        return jobs

    @classmethod
    async def create(cls, obj_in: schemas.JobCreate) -> schemas.Job:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.JobUpdate) -> schemas.Job:
        data = self._import(obj_in)
        return await super().update(**data)
