from beak.modules.core.abstract.service import BaseService
from beak.modules.core.analytics.entities import ReportMeta
from beak.modules.core.analytics.enum import ReportState
from beak.modules.core.analytics.repository import ReportMetaRepository
from beak.modules.core.analytics.schemas import (
    ReportMetaCreate,
    ReportMetaUpdate,
)


class ReportMetaService(BaseService[ReportMeta, ReportMetaCreate, ReportMetaUpdate]):
    def __init__(self):
        super().__init__(ReportMetaRepository())

    async def set_final(self, uid: str, status: str, location: str | None = None):
        report = await self.get(uid=uid)
        if report.status != ReportState.READY:
            report.location = location
            report.status = status
            report.temp = None
            await super().save(report)
