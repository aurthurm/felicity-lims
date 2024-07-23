from felicity.apps.worksheet.entities import WorkSheet
from felicity.apps.worksheet.enum import WorkSheetState
from felicity.apps.analysis.enum import ResultState
from felicity.apps.worksheet.services import WorkSheetService


class WorksheetWorkFlowException(Exception):
    ...


class WorkSheetWorkFlowService:
    """WorksheetWorkFlow
    Defines a set of guards that allow or prevent actions taken on Worksheet
    """

    def __init__(self):
        self.worksheet_service = WorkSheetService()

    async def submit(self, uid, submitter):
        worksheet = await self.worksheet_service.get(uid=uid)
        await self._guard_submit(worksheet)
        return self.worksheet_service.submit(submitter)

    async def _guard_submit(self, worksheet: WorkSheet) -> bool:
        if worksheet.state not in [
            WorkSheetState.PENDING,
            WorkSheetState.SUBMITTING
        ]:
            raise WorksheetWorkFlowException(f"Cannot submit a {worksheet.state} WorkSheet")

        result_states = [ResultState.PENDING]

        results, qc_results = await self.worksheet_service.get_analysis_results(worksheet.uid)
        if len(list(filter(lambda ar: ar.status in result_states, results + qc_results))) > 0:
            raise WorksheetWorkFlowException(f"Cannot submit a Worksheet with pending results")
        return True

    async def approve(self, uid, approved_by):
        worksheet = await WorkSheet.get(uid=uid)
        await self._guard_approve(worksheet)
        await self.worksheet_service.verify(worksheet.uid, approved_by)

    async def _guard_approve(self, worksheet: WorkSheet) -> bool:
        if worksheet.state not in [
            WorkSheetState.AWAITING,
            WorkSheetState.APPROVING
        ]:
            raise WorksheetWorkFlowException(f"Cannot approve a {worksheet.state} WorkSheet")

        result_states = [
            ResultState.APPROVED,
            ResultState.RETRACTED,
            ResultState.CANCELLED
        ]

        results, qc_results = await self.worksheet_service.get_analysis_results(worksheet.uid)
        if not all([ar.status in result_states for ar in results + qc_results]):
            raise WorksheetWorkFlowException(f"Cannot approve this Worksheet")

        return True
