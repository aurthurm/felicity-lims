import logging
from typing import List

from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis.entities.results import AnalysisResult
from felicity.apps.analysis.enum import ResultState
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.notification.services import ActivityStreamService
from felicity.apps.worksheet.enum import WorkSheetState
from felicity.apps.worksheet.repository import WorkSheetRepository, WorkSheetTemplateRepository
from felicity.apps.worksheet.schemas import (WorkSheetCreate,
                                             WorkSheetUpdate,
                                             WSTemplateCreate,
                                             WSTemplateUpdate)
from felicity.apps.worksheet.entities import WorkSheet, WorkSheetTemplate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WorkSheetTemplateService(
    BaseService[WorkSheetTemplate, WSTemplateCreate, WSTemplateUpdate]
):
    def __init__(self):
        super().__init__(WorkSheetTemplateRepository)


class WorkSheetService(BaseService[WorkSheet, WorkSheetCreate, WorkSheetUpdate]):
    id_sequence_service = IdSequenceService()

    def __init__(self):
        self.analysis_result_service = AnalysisResultService()
        self.activity_streamer = ActivityStreamService()
        super().__init__(WorkSheetRepository)

    async def get_analysis_results(self, uid: str):
        results: List[AnalysisResult] = []
        qc_results: List[AnalysisResult] = []

        all_results = await self.analysis_result_service.get_all(worksheet_uid=uid)
        for result in all_results:
            if result.sample.sample_type.name == "QC Sample":
                qc_results.append(result)
            else:
                results.append(result)

        return results, qc_results

    async def reset_assigned_count(self, uid: str):
        # TODO: DO NOT COUNT QC SAMPLES
        worksheet = await self.get(uid=uid)
        analysis_results, _ = await self.get_analysis_results(uid)
        count = len(analysis_results)
        worksheet.assigned_count = count
        if count == 0:
            worksheet.state = WorkSheetState.EMPTY

        if count > 0 and worksheet.state == WorkSheetState.EMPTY:
            worksheet.state = WorkSheetState.PENDING

        await super().save(worksheet)

    async def change_state(self, uid, state, updated_by_uid):
        await super().update(uid, {"state": state, "updated_by_uid": updated_by_uid})

    async def has_processed_samples(self, uid: str):
        states = [
            ResultState.RESULTED,
            ResultState.APPROVED,
        ]

        results, qc_results = await self.get_analysis_results(uid)
        analysis_results = results + qc_results
        processed = any([res.status in states for res in analysis_results])
        return processed

    async def submit(self, uid: str, submitter):
        worksheet = await self.get(uid=uid)
        worksheet.state = WorkSheetState.AWAITING
        worksheet.updated_by_uid = submitter.uid  # noqa
        worksheet.submitted_by_uid = submitter.uid
        worksheet = await super().save(worksheet)
        await self.activity_streamer.stream(
            worksheet, submitter, "submitted", "worksheet"
        )
        return worksheet

    async def verify(self, uid: str, verified_by):
        worksheet = await self.get(uid=uid)
        worksheet.state = WorkSheetState.APPROVED
        worksheet.updated_by_uid = verified_by.uid  # noqa
        worksheet.verified_by_uid = verified_by.uid
        worksheet = await super().save(worksheet)
        await self.activity_streamer.stream(
            worksheet, verified_by, "verified", "worksheet"
        )
        return worksheet

    async def create(self, obj_in: dict | WorkSheetCreate, related: list[str] = None) -> WorkSheet:
        data = self._import(obj_in)
        data["worksheet_id"] = (await self.id_sequence_service.get_next_number("WS"))[1]
        return await super().create(data, related)
