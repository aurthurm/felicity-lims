from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.job.entities import Job


class JobRepository(BaseRepository[Job]):
    def __init__(self) -> None:
        super().__init__(Job)

    async def fetch_sorted(self, filters: dict, sort: str):
        stmt = self.queryset.smart_query(
            filters=filters,
            sort_attrs=sort,
        )
        async with self.async_session() as session:
            results = await session.execute(stmt)
            jobs = results.scalars().all()
        return list(filter(lambda job: job.is_ready_for_execution, jobs))
