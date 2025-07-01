from felicity.apps.abstract.service import BaseService
from felicity.apps.analytics.entities import ReportMeta
from felicity.apps.analytics.enum import ReportState
from felicity.apps.analytics.repository import ReportMetaRepository
from felicity.apps.analytics.schemas import (
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
