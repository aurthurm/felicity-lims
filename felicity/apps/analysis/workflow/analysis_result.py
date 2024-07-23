import logging
from typing import TYPE_CHECKING

from felicity.apps.analysis.enum import States
from felicity.apps.analysis.entities.results import AnalysisResult
from felicity.apps.setup.entities.setup import Laboratory, LaboratorySetting

if TYPE_CHECKING:
    pass

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AnalysisResultWorkFlowException(Exception):
    ...


class AnalysisResultWorkFlow:
    """AnalysisResultWorkFlow
    Defines a set of guards that allow or prevent actions taken on AnalysisResult
    """

    def __init__(self):
        ...

    @classmethod
    async def retest(cls, uid, retested_by, action="verify"):
        analysis_result = await AnalysisResult.get(uid=uid)
        await cls._guard_retest(analysis_result)
        await analysis_result.retest_result(retested_by, action)

    @staticmethod
    async def _guard_retest(analysis_result: AnalysisResult) -> bool:
        allow = False
        if analysis_result.status == States.Result.RESULTED:
            allow = True

        if not allow:
            raise AnalysisResultWorkFlowException(f"Cannot retest this Result")
        return True

    @classmethod
    async def assign(cls, uid, ws_uid, position, laboratory_instrument_uid):
        analysis_result = await AnalysisResult.get(uid=uid)
        await cls._guard_assign(analysis_result)
        await analysis_result.assign(ws_uid, position, laboratory_instrument_uid)

    @staticmethod
    async def _guard_assign(analysis_result: AnalysisResult) -> bool:
        allow = False
        if analysis_result.status == States.Result.PENDING and analysis_result.assigned is False:
            allow = True

        if not allow:
            raise AnalysisResultWorkFlowException(f"Cannot assign this Result")
        return True

    @classmethod
    async def un_assign(cls, uid):
        analysis_result = await AnalysisResult.get(uid=uid)
        await cls._guard_un_assign(analysis_result)
        await analysis_result.un_assign()

    @staticmethod
    async def _guard_un_assign(analysis_result: AnalysisResult) -> bool:
        allow = False
        if analysis_result.status == States.Result.PENDING and analysis_result.assigned is True:
            allow = True

        if not allow:
            raise AnalysisResultWorkFlowException(f"Cannot un-assign this Result")
        return True

    @classmethod
    async def retract(cls, uid, retracted_by):
        analysis_result = await AnalysisResult.get(uid=uid)
        await cls._guard_retract(analysis_result)
        await analysis_result.retract(retracted_by)

    @staticmethod
    async def _guard_retract(analysis_result: AnalysisResult) -> bool:
        allow = analysis_result.status == States.Result.RESULTED
        if not allow:
            raise AnalysisResultWorkFlowException(f"Cannot retract this Result")
        return True

    @classmethod
    async def cancel(cls, uid, cancelled_by):
        analysis_result = await AnalysisResult.get(uid=uid)
        await cls._guard_cancel(analysis_result)
        await analysis_result.cancel(cancelled_by)

    @staticmethod
    async def _guard_cancel(analysis_result: AnalysisResult) -> bool:
        allow = analysis_result.status == States.Result.PENDING
        if not allow:
            raise AnalysisResultWorkFlowException(f"Cannot cancel this Result")
        return True

    @classmethod
    async def re_instate(cls, uid, re_instated_by):
        analysis_result = await AnalysisResult.get(uid=uid)
        await cls._guard_re_instate(analysis_result)
        await analysis_result.re_instate(re_instated_by)

    @staticmethod
    async def _guard_re_instate(analysis_result: AnalysisResult) -> bool:
        allow = analysis_result.status == States.Result.CANCELLED
        if not allow:
            raise AnalysisResultWorkFlowException(f"Cannot re-instate this Result")
        return True

    @classmethod
    async def approve(cls, result_uids: list[str], approved_by):
        analysis_results = await AnalysisResult.get_all(uid__in=result_uids)
        await cls._guard_approve(analysis_results, approved_by.uid)
        for result in analysis_results:
            await result.verify(approved_by)

    @staticmethod
    async def _guard_approve(analysis_results: list[AnalysisResult], approved_by_uid) -> bool:
        laboratory = await Laboratory.get_by_setup_name("felicity")
        settings: LaboratorySetting = await LaboratorySetting.get(
            laboratory_uid=laboratory.uid
        )
        states = [States.Result.RESULTED, States.Result.APPROVING]

        for result in analysis_results:
            # Self Verification check
            if settings.allow_self_verification is False and result.analysis.self_verification is False:
                # First time verifier must not be the submitter
                if len(result.verified_by) == 0 and result.submitted_by_uid == approved_by_uid:
                    raise AnalysisResultWorkFlowException("Cannot approve a result your own work")
                # Cannot self co-approve
                if approved_by_uid in [usr.uid for usr in result.verified_by]:
                    raise AnalysisResultWorkFlowException("Cannot co-approve a result")

            # Status check
            if result.status not in states:
                raise AnalysisResultWorkFlowException(f"Cannot approve a {result.status} Result")

            # Number of required verifications check
            required, current = await result.verifications()
            if not (current < required and current + 1 == required):
                raise AnalysisResultWorkFlowException(f"Required approvals have already been met")

        return True
