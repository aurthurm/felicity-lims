from domain.job.conf import JobStates
from domain.job.ports.repository import IJobRepository
from felicity.apps.repository.base import BaseRepository

from felicity.apps.job.entities import Job


class JobRepository(BaseRepository[Job], IJobRepository):
    def __init__(self) -> None:
        self.model = Job
        super().__init__()

    async def fetch_sorted(self):
        stmt = self._qb.smart_query(
            filters={
                "status__notin": [
                    JobStates.FINISHED,
                    JobStates.FAILED,
                    JobStates.RUNNING,
                ]
            },
            sort_attrs=["-priority"],
        )
        async with self.async_session() as session:
            results = await session.execute(stmt)
            jobs = results.scalars().all()
        return list(filter(lambda job: job.is_ready_for_execution, jobs))
