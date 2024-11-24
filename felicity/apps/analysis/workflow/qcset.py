from felicity.apps.analysis.entities.analysis import QCSet
from felicity.apps.analysis.enum import SampleState
from felicity.apps.analysis.services.quality_control import QCSetService
from felicity.apps.analysis.workflow.sample import SampleWorkFlow


class CQSetWorkFlowException(Exception): ...


class CQSetWorkFlow:
    """CQSetWorkFlow
    Defines a set of guards that allow or prevent actions taken on Quality Control Sets

        methods:
            cancel: cancels a quality control set iff all quality control samples are cancelled
                params:
                    uid: quality control set uid

            submit: submits a quality control set iff all quality control samples are submits
                params:
                    uid: quality control set uid

            approve: approves a quality control set iff all quality control samples are approve
                params:
                    uid: quality control set uid

        raises:
            CQSetWorkFlowException if action is not allowed
    """

    def __init__(self):
        self.qc_set_service = QCSetService()
        self.sample_workflow = SampleWorkFlow()

    async def revert(self, uid: str, by_uid: str):
        raise NotImplementedError()

    async def cancel(self, uid, by) -> QCSet:
        qc_set = await self.qc_set_service.get(uid=uid, related=["samples"])
        await self._guard_cancel(qc_set.samples)  # noqa
        return await self.qc_set_service.cancel(uid, by)

    async def _guard_cancel(self, samples):
        for sample in samples:
            await self.sample_workflow._guard_cancel(sample)  # noqa

    async def re_instate(self, uid, by):
        qc_set = await self.qc_set_service.get(uid=uid)
        await self._guard_re_instate(qc_set)
        return await self.qc_set_service.re_instate(uid, by)

    @staticmethod
    async def _guard_re_instate(qc_set: QCSet) -> bool:
        allow = qc_set.status == SampleState.CANCELLED
        if not allow:
            raise CQSetWorkFlowException("Cannot re-instate this QcSet")
        return True

    async def submit(self, uid, by) -> QCSet:
        qc_set = await self.qc_set_service.get(uid=uid, related=["samples"])
        await self._guard_submit(qc_set.samples)  # noqa
        return await self.qc_set_service.submit(uid, by)

    @staticmethod
    async def _guard_submit(samples):
        all_are_awaiting = [s.status == SampleState.AWAITING for s in samples]
        if not all(all_are_awaiting):
            raise CQSetWorkFlowException(f"Cannot submit this qs set. All samples by the submitted")

    async def approve(self, uid, by) -> QCSet:
        qc_set = await self.qc_set_service.get(uid=uid, related=["samples"])
        await self._guard_approve(qc_set.samples)
        return await self.qc_set_service.approve(uid, by)

    @staticmethod
    async def _guard_approve(self, samples):
        all_are_approved = [s.status == SampleState.APPROVED for s in samples]
        if not all(all_are_approved):
            raise CQSetWorkFlowException(f"Cannot submit this qs set. All samples by the approved")
