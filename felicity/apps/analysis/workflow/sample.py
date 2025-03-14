from felicity.apps.analysis.entities.analysis import Sample
from felicity.apps.analysis.enum import ResultState, SampleState
from felicity.apps.analysis.services.analysis import SampleService


class SampleWorkFlowException(Exception): ...


class SampleWorkFlow:
    """SampleWorkFlow
    Defines a set of guard that allow or prevent actions taken on Samples
    """

    def __init__(self):
        self.sample_service = SampleService()

    async def revert(self, uid: str, by_uid: str) -> None:
        to_status = ResultState.PENDING
        results = await self.sample_service.get_analysis_results(uid)
        awaiting_satatuses = [
            ResultState.RESULTED,
            ResultState.RETRACTED,
            ResultState.CANCELLED,
        ]
        approved_satatuses = [
            ResultState.APPROVED,
            ResultState.RETRACTED,
            ResultState.CANCELLED,
        ]

        if any([result.status in ResultState.PENDING for result in results]):
            to_status = SampleState.RECEIVED
        elif all([result.status == ResultState.CANCELLED for result in results]):
            to_status = SampleState.CANCELLED
        elif all([result.status in awaiting_satatuses for result in results]):
            to_status = SampleState.AWAITING
        elif all([result.status in approved_satatuses for result in results]):
            to_status = SampleState.APPROVED
        await self.sample_service.change_status(uid, to_status, by_uid)

    async def receive(self, uid, received_by):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_receive(sample)
        return await self.sample_service.receive(sample.uid, received_by=received_by)

    @staticmethod
    async def _guard_receive(sample: Sample) -> bool:
        allow = False
        if sample.status == SampleState.EXPECTED:
            allow = True

        if not allow:
            raise SampleWorkFlowException("Cannot receive this Sample")
        return True

    async def cancel(self, uuids: str | list[str], cancelled_by):
        if isinstance(uuids, str):
            uuids = [uuids]
        samples = await self.sample_service.get_by_uids(uids=uuids)
        returns = []
        for sample in samples:
            await self._guard_cancel(sample)
            cancelled = await self.sample_service.cancel(sample.uid, cancelled_by)
            returns.append(cancelled)
        return returns

    async def _guard_cancel(self, sample: Sample) -> bool:
        allow = sample.status in [SampleState.RECEIVED, SampleState.EXPECTED]
        if not allow:
            raise SampleWorkFlowException("Cannot cancel this Sample")

        analysis_results = await self.sample_service.get_analysis_results(sample.uid)
        match = [result.assigned for result in analysis_results]
        if any(match):
            raise SampleWorkFlowException(f"Cannot cancel sample {sample.sample_id} with assigned analyses")

        processed_states = [ResultState.RESULTED, ResultState.APPROVED, ResultState.REFERRED]
        processed = list(filter(lambda x: x.status in processed_states, analysis_results))
        if len(processed) > 0:
            raise SampleWorkFlowException(f"Cannot cancel sample {sample.sample_id} with processed analyses")
        return True

    async def re_instate(self, uid, re_instated_by):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_re_instate(sample)
        return await self.sample_service.re_instate(sample.uid, re_instated_by)

    @staticmethod
    async def _guard_re_instate(sample: Sample) -> bool:
        allow = sample.status == SampleState.CANCELLED
        if not allow:
            raise SampleWorkFlowException("Cannot re-instate this Sample")
        return True

    async def submit(self, uid, submitted_by):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_submit(sample)
        return await self.sample_service.submit(sample.uid, submitted_by)

    async def _guard_submit(self, sample: Sample) -> bool:
        allow = False
        analysis_results = await self.sample_service.get_analysis_results(sample.uid)
        statuses = [
            ResultState.RESULTED,
            ResultState.RETRACTED,
            ResultState.APPROVED,
            ResultState.CANCELLED,
        ]
        match = all([(result.status in statuses) for result in analysis_results])
        if match and sample.status == SampleState.RECEIVED:
            allow = True

        if not allow:
            raise SampleWorkFlowException("Cannot submit this Sample")
        return True

    async def un_submit(self, uid):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_un_submit(sample)
        return await self.sample_service.un_submit(sample.uid)

    @staticmethod
    async def _guard_un_submit(sample: Sample) -> bool:
        allow = sample.status == SampleState.AWAITING
        if not allow:
            raise SampleWorkFlowException("Cannot un-submit this Sample")
        return True

    async def reject(self, uid, rejected_by):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_reject(sample)
        return await self.sample_service.reject(sample.uid, rejected_by=rejected_by)

    async def _guard_reject(self, sample: Sample) -> bool:
        allow = sample.status in [SampleState.RECEIVED, SampleState.EXPECTED]
        if not allow:
            raise SampleWorkFlowException("Cannot reject this Sample")

        analysis_results = await self.sample_service.get_analysis_results(sample.uid)
        match = [result.assigned for result in analysis_results]
        if any(match):
            raise SampleWorkFlowException(f"Cannot reject sample {sample.sample_id} with assigned analyses")

        processed_states = [ResultState.RESULTED, ResultState.APPROVED, ResultState.REFERRED]
        processed = list(filter(lambda x: x.status in processed_states, analysis_results))
        if len(processed) > 0:
            raise SampleWorkFlowException(f"Cannot reject sample {sample.sample_id} with processed analyses")
        return True

    async def store(self, uid, stored_by):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_store(sample)
        return await self.sample_service.store(sample.uid, stored_by)

    @staticmethod
    async def _guard_store(sample: Sample) -> bool:
        allow = False
        if sample.status == SampleState.RECEIVED:
            allow = True

        if not allow:
            raise SampleWorkFlowException("Cannot store this Sample")
        return True

    async def recover(self, uid):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_recover(sample)
        return await self.sample_service.recover(sample.uid)

    @staticmethod
    async def _guard_recover(sample: Sample) -> bool:
        allow = False
        if sample.status == SampleState.STORED:
            allow = True

        if not allow:
            raise SampleWorkFlowException("Cannot recover this Sample")
        return True

    async def print(self, uid, printed_by):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_print(sample)
        return await self.sample_service.print(sample.uid, printed_by=printed_by)

    @staticmethod
    async def _guard_print(sample: Sample) -> bool:
        allow = sample.status == SampleState.PUBLISHED
        if not allow:
            raise SampleWorkFlowException("Cannot print this Sample")
        return True

    async def invalidate(self, uid, invalidated_by):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_invalidate(sample)
        return await self.sample_service.invalidate(sample.uid, invalidated_by)

    @staticmethod
    async def _guard_invalidate(sample: Sample):
        allow = sample.status in [SampleState.APPROVED, SampleState.PUBLISHED]
        if not allow:
            raise SampleWorkFlowException("Cannot invalidate this Sample")
        return True

    async def publish(self, uid, published_by):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_publish(sample)
        return await self.sample_service.publish(sample.uid, published_by=published_by)

    @staticmethod
    async def _guard_publish(sample):
        allow = sample.status in [SampleState.APPROVED]
        if not allow:
            raise SampleWorkFlowException("Cannot publish this Sample")
        return True

    async def assign(self, uid):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_assign(sample)
        return await self.sample_service.assign(sample.uid)

    @staticmethod
    async def _guard_assign(sample):
        allow = sample.status in [SampleState.RECEIVED, SampleState.PAIRED]
        if not allow:
            raise SampleWorkFlowException("Cannot assign this Sample")
        return True

    async def un_assign(self, uid):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_un_assign(sample)
        return await self.sample_service.un_assign(sample.uid)

    @staticmethod
    async def _guard_un_assign(sample):
        allow = sample.status == SampleState.RECEIVED
        if not allow:
            raise SampleWorkFlowException("Cannot publish this Sample")
        return True

    async def approve(self, uid: str, approved_by):
        sample = await self.sample_service.get(uid=uid)
        await self._guard_approve(sample)
        return await self.sample_service.verify(sample.uid, verified_by=approved_by)

    async def approve_all(self, sample_uids: list[str], approved_by):
        samples = await self.sample_service.get_all(uid__in=sample_uids)
        for sample in samples:
            await self._guard_approve(sample)
        return [
            (await self.sample_service.verify(sample.uid, verified_by=approved_by))
            for sample in samples
        ]

    async def _guard_approve(self, sample: Sample) -> bool:
        allow = False
        analyses_results = await self.sample_service.get_analysis_results(sample.uid)
        statuses = [
            ResultState.APPROVED,
            ResultState.RETRACTED,
            ResultState.CANCELLED,
        ]
        match = all([(result.status in statuses) for result in analyses_results])

        #  ?? cannot approve referred unless u r system_daemon
        if match and sample.status in [SampleState.AWAITING, SampleState.PAIRED]:
            allow = True

        # Are there are results in referred state or some are in pending state
        analysis, referred = await self.sample_service.get_referred_analyses(sample.uid)
        if not referred and list(  # and has pending results then :)
                filter(lambda an: an.status in [ResultState.PENDING], analysis)
        ):
            allow = False

        print(f"matches = {match}, allow = {allow}, sample status = {sample.status}")
        if not allow:
            raise SampleWorkFlowException("Cannot approve this Sample")

        return True
