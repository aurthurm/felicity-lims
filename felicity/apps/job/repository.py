from felicity.apps.job.conf import States
from felicity.apps.job.entities import Job
from felicity.database.repository import BaseRepository


class JobRepository(BaseRepository[Job]):
    def __init__(self) -> None:
        super().__init__(Job)

    async def fetch_sorted(self):
        stmt = self._qb.smart_query(
            filters={
                "status__notin": [
                    States.FINISHED,
                    States.FAILED,
                    States.RUNNING,
                ]
            },
            sort_attrs=["-priority"],
        )
        async with self.async_session() as session:
            results = await session.execute(stmt)
            jobs = results.scalars().all()
        return list(filter(lambda job: job.is_ready_for_execution, jobs))
