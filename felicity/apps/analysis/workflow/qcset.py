from felicity.apps.analysis.entities.analysis import QCSet, Sample


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

    def __init__(self): ...

    @classmethod
    async def cancel(cls, uid):
        qc_set = await QCSet.get(uid=uid)
        await cls._guard(qc_set, "cancel")
        await qc_set.change_status(SampleState.CANCELLED)

    @classmethod
    async def submit(cls, uid):
        qc_set = await QCSet.get(uid=uid)
        await cls._guard(qc_set, "submit")
        await qc_set.change_status(SampleState.AWAITING)

    @classmethod
    async def approve(cls, uid):
        qc_set = await QCSet.get(uid=uid)
        await cls._guard(qc_set, "approve")
        await qc_set.change_status(SampleState.APPROVED)

    @staticmethod
    async def _guard(qc_set: QCSet, action) -> bool:
        allow = False
        samples = await Sample.get_all(qc_set_uid=qc_set.uid)

        if action == "submit":
            allow = all(list(map(lambda s: s.status == SampleState.AWAITING, samples)))
        elif action == "approve":
            allow = all(list(map(lambda s: s.status == SampleState.APPROVED, samples)))
        elif action == "cancel":
            allow = all(list(map(lambda s: s.status == SampleState.CANCELLED, samples)))
        else:
            ...

        if not allow:
            raise CQSetWorkFlowException(f"Cannot {action} this QC Set")
        return True
