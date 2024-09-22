from felicity.apps.abstract.service import BaseService
from felicity.apps.analytics.enum import ReportState
from felicity.apps.analytics.repository import ReportMetaRepository
from felicity.apps.analytics.schemas import (
    ReportMeta,
    ReportMetaCreate,
    ReportMetaUpdate,
)
from felicity.apps.common.utils.serializer import marshaller


class ReportMetaService(BaseService[ReportMeta, ReportMetaCreate, ReportMetaUpdate]):
    def __init__(self):
        super().__init__(ReportMetaRepository)

    async def set_final(self, uid: str, status: str, location: str | None = None):
        report = await self.get(uid=uid)
        if report.status != ReportState.READY:
            report.location = location
            report.status = status
            report.temp = None
            await super().update(report, marshaller(report))
