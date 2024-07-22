from felicity.apps.abstract.service import BaseService
from felicity.apps.analytics.conf import ReportStates
from felicity.apps.analytics.repository import ReportMetaRepository
from felicity.apps.analytics.schemas import ReportMeta, ReportMetaCreate, ReportMetaUpdate


class ReportMetaService(BaseService[ReportMeta, ReportMetaCreate, ReportMetaUpdate]):
    def __init__(self):
        super().__init(ReportMetaRepository)

    async def set_final(self, status: str, location: str | None = None):
        if self.status != ReportStates.READY:
            self.location = location
            self.status = status
            self.temp = None
            await self.save_async()