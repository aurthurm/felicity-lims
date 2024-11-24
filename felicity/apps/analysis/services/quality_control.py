from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis.entities.qc import QCLevel, QCSet, QCTemplate
from felicity.apps.analysis.enum import SampleState
from felicity.apps.analysis.repository.quality_control import (
    QCLevelRepository,
    QCSetRepository,
    QCTemplateRepository,
)
from felicity.apps.analysis.schemas import (
    QCLevelCreate,
    QCLevelUpdate,
    QCSetCreate,
    QCSetUpdate,
    QCTemplateCreate,
    QCTemplateUpdate,
)
from felicity.apps.analysis.services.analysis import SampleService


class QCSetService(BaseService[QCSet, QCSetCreate, QCSetUpdate]):
    def __init__(self):
        super().__init__(QCSetRepository())
        self.sample_service = SampleService()

    async def change_status(self, uid, status, updated_by_uid=None) -> QCSet:
        data = {"status": status}
        if updated_by_uid:
            data["updated_by_uid"] = updated_by_uid
        return await super().update(uid, data)

    async def cancel(self, uid: str, cancelled_by):
        await self.change_status(uid, SampleState.CANCELLED, cancelled_by.uid)
        qc_set = await self.get(uid=uid, related=["samples"])
        # Cancel samples sequentially
        for sample in qc_set.samples:
            await self.sample_service.cancel(sample.uid, cancelled_by=cancelled_by)
        return qc_set

    async def re_instate(self, uid: str, re_instated_by):
        await self.change_status(uid, SampleState.RECEIVED, re_instated_by.uid)
        qc_set = await self.get(uid=uid, related=["samples"])
        # Cancel samples sequentially
        for sample in qc_set.samples:
            await self.sample_service.re_instate(sample.uid, re_instated_by=re_instated_by)
        return qc_set

    async def submit(self, uid: str, submitted_by) -> QCSet:
        return await self.change_status(uid, SampleState.AWAITING)

    async def approve(self, uid: str, verified_by) -> QCSet:
        return await self.change_status(uid, SampleState.APPROVED)


class QCLevelService(BaseService[QCLevel, QCLevelCreate, QCLevelUpdate]):
    def __init__(self):
        super().__init__(QCLevelRepository())


class QCTemplateService(BaseService[QCTemplate, QCTemplateCreate, QCTemplateUpdate]):
    def __init__(self):
        super().__init__(QCTemplateRepository())
