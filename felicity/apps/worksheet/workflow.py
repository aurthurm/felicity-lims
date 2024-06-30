from felicity.apps.analysis import conf as analysis_conf
from felicity.apps.worksheet import conf
from felicity.apps.worksheet.models import WorkSheet


class WorksheetWorkFlowException(Exception):
    ...


class WorksheetWorkFlow:
    """WorksheetWorkFlow
    Defines a set of guards that allow or prevent actions taken on Worksheet
    """

    def __init__(self):
        ...

    @classmethod
    async def submit(cls, uid, submitter):
        worksheet = await WorkSheet.get(uid=uid)
        await cls._guard_submit(worksheet)
        await worksheet.submit(submitter)

    @staticmethod
    async def _guard_submit(worksheet: WorkSheet) -> bool:
        if worksheet.state not in [
            conf.worksheet_states.PENDING,
            conf.worksheet_states.SUBMITTING
        ]:
            raise WorksheetWorkFlowException(f"Cannot submit a {worksheet.state} WorkSheet")

        result_states = [analysis_conf.states.result.PENDING]

        results, qc_results = await worksheet.get_analysis_results()
        if len(list(filter(lambda ar: ar.status in result_states, results + qc_results))) > 0:
            raise WorksheetWorkFlowException(f"Cannot submit a Worksheet with pending results")

        return True

    @classmethod
    async def approve(cls, uid, approved_by):
        worksheet = await WorkSheet.get(uid=uid)
        await cls._guard_approve(worksheet)
        await worksheet.verify(approved_by)

    @staticmethod
    async def _guard_approve(worksheet: WorkSheet) -> bool:
        if worksheet.state not in [
            conf.worksheet_states.AWAITING,
            conf.worksheet_states.APPROVING
        ]:
            raise WorksheetWorkFlowException(f"Cannot approve a {worksheet.state} WorkSheet")

        result_states = [
            analysis_conf.states.result.APPROVED,
            analysis_conf.states.result.RETRACTED,
            analysis_conf.states.result.CANCELLED
        ]

        results, qc_results = await worksheet.get_analysis_results()
        if not all([ar.status in result_states for ar in results + qc_results]):
            raise WorksheetWorkFlowException(f"Cannot approve this Worksheet")

        return True
