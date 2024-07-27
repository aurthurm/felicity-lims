from felicity.apps.analysis.entities.analysis import Sample
from felicity.apps.analysis.enum import States


class SampleWorkFlowException(Exception): ...


class SampleWorkFlow:
    """SampleWorkFlow
    Defines a set of guards that allow or prevent actions taken on Samples
    """

    def __init__(self): ...

    @classmethod
    async def receive(cls, uid):
        sample = await Sample.get(uid=uid)
        await cls._guard_receive(sample)
        await sample.change_status(SampleState.RECEIVED)

    @staticmethod
    async def _guard_receive(sample: Sample) -> bool:
        allow = False
        if sample.status == SampleState.EXPECTED:
            allow = True

        if not allow:
            raise SampleWorkFlowException(f"Cannot receive this Sample")
        return True

    @classmethod
    async def cancel(cls, uid, cancelled_by):
        sample = await Sample.get(uid=uid)
        await cls._guard_cancel(sample)
        await sample.cancel(cancelled_by)

    @staticmethod
    async def _guard_cancel(sample: Sample) -> bool:
        allow = sample.status in [SampleState.RECEIVED, SampleState.EXPECTED]
        if not allow:
            raise SampleWorkFlowException(f"Cannot cancel this Sample")
        return True

    @classmethod
    async def re_instate(cls, uid, re_instated_by):
        sample = await Sample.get(uid=uid)
        await cls._guard_re_instate(sample)
        await sample.re_instate(re_instated_by)

    @staticmethod
    async def _guard_re_instate(sample: Sample) -> bool:
        allow = sample.status == SampleState.CANCELLED
        if not allow:
            raise SampleWorkFlowException(f"Cannot re-instate this Sample")
        return True

    @classmethod
    async def submit(cls, uid, submitted_by):
        sample = await Sample.get(uid=uid)
        await cls._guard_submit(sample)
        await sample.submit(submitted_by)

    @staticmethod
    async def _guard_submit(sample: Sample) -> bool:
        allow = False
        analysis_results = await sample.get_analysis_results()
        statuses = [
            States.Result.RESULTED,
            States.Result.RETRACTED,
            States.Result.APPROVED,
            States.Result.CANCELLED,
        ]
        match = all([(result.status in statuses) for result in analysis_results])
        if match and sample.status == SampleState.RECEIVED:
            allow = True

        if not allow:
            raise SampleWorkFlowException(f"Cannot submit this Sample")
        return True

    @classmethod
    async def un_submit(cls, uid):
        sample = await Sample.get(uid=uid)
        await cls._guard_un_submit(sample)
        await sample.un_submit()

    @staticmethod
    async def _guard_un_submit(sample: Sample) -> bool:
        allow = sample.status == SampleState.AWAITING
        if not allow:
            raise SampleWorkFlowException(f"Cannot un-submit this Sample")
        return True

    @classmethod
    async def reject(cls, uid, rejected_by):
        sample = await Sample.get(uid=uid)
        await cls._guard_reject(sample)
        await sample.reject(rejected_by=rejected_by)

    @staticmethod
    async def _guard_reject(sample: Sample) -> bool:
        allow = sample.status in [SampleState.RECEIVED, SampleState.EXPECTED]
        if not allow:
            raise SampleWorkFlowException(f"Cannot reject this Sample")
        return True

    @classmethod
    async def store(cls, uid, stored_by):
        sample = await Sample.get(uid=uid)
        await cls._guard_store(sample)
        return await sample.store(stored_by)

    @staticmethod
    async def _guard_store(sample: Sample) -> bool:
        allow = False
        if sample.status == SampleState.RECEIVED:
            allow = True

        if not allow:
            raise SampleWorkFlowException(f"Cannot store this Sample")
        return True

    @classmethod
    async def recover(cls, uid):
        sample = await Sample.get(uid=uid)
        await cls._guard_recover(sample)
        await sample.recover()

    @staticmethod
    async def _guard_recover(sample: Sample) -> bool:
        allow = False
        if sample.status == SampleState.STORED:
            allow = True

        if not allow:
            raise SampleWorkFlowException(f"Cannot recover this Sample")
        return True

    @classmethod
    async def print(cls, uid, printed_by):
        sample = await Sample.get(uid=uid)
        await cls._guard_print(sample)
        await sample.print(printed_by=printed_by)

    @staticmethod
    async def _guard_print(sample: Sample) -> bool:
        allow = sample.status == SampleState.PUBLISHED
        if not allow:
            raise SampleWorkFlowException(f"Cannot print this Sample")
        return True

    @classmethod
    async def invalidate(cls, uid, invalidated_by):
        sample = await Sample.get(uid=uid)
        await cls._guard_invalidate(sample)
        await sample.invalidate(invalidated_by)

    @staticmethod
    async def _guard_invalidate(sample: Sample):
        allow = sample.status in [SampleState.APPROVED, SampleState.PUBLISHED]
        if not allow:
            raise SampleWorkFlowException(f"Cannot invalidate this Sample")
        return True

    @classmethod
    async def publish(cls, uid, published_by):
        sample = await Sample.get(uid=uid)
        await cls._guard_publish(sample)
        await sample.publish(published_by=published_by)

    @staticmethod
    async def _guard_publish(sample):
        allow = sample.status in [SampleState.APPROVED, SampleState.PUBLISHING]
        if not allow:
            raise SampleWorkFlowException(f"Cannot publish this Sample")
        return True

    @classmethod
    async def assign(cls, uid):
        sample = await Sample.get(uid=uid)
        await cls._guard_assign(sample)
        await sample.assign()

    @staticmethod
    async def _guard_assign(sample):
        allow = sample.status in [SampleState.RECEIVED, SampleState.PAIRED]
        if not allow:
            raise SampleWorkFlowException(f"Cannot assign this Sample")
        return True

    @classmethod
    async def un_assign(cls, uid):
        sample = await Sample.get(uid=uid)
        await cls._guard_un_assign(sample)
        await sample.un_assign()

    @staticmethod
    async def _guard_un_assign(sample):
        allow = sample.status == SampleState.RECEIVED
        if not allow:
            raise SampleWorkFlowException(f"Cannot publish this Sample")
        return True

    @classmethod
    async def approve(cls, sample_uids: list[list], approved_by):  # previously verify
        samples = await Sample.get_all(uid__in=sample_uids)
        for sample in samples:
            await cls._guard_approve(sample)
            await sample.verify(verified_by=approved_by)

    @staticmethod
    async def _guard_approve(sample: Sample) -> bool:
        allow = False
        analyses_results = await sample.get_analysis_results()
        statuses = [
            States.Result.APPROVED,
            States.Result.RETRACTED,
            States.Result.CANCELLED,
        ]
        match = all([(result.status in statuses) for result in analyses_results])

        #  ?? cannot approve referred unless u r system_daemon
        if match and sample.status == [SampleState.AWAITING, SampleState.PAIRED]:
            allow = True

        # Are there are results in referred state or some are in pending state
        analysis, referred = await sample.get_referred_analyses()
        if not referred and list(  # and has pending results then :)
            filter(lambda an: an.status in [States.Result.PENDING], analysis)
        ):
            allow = False

        if not allow:
            raise SampleWorkFlowException(f"Cannot approve this Sample")

        return True
