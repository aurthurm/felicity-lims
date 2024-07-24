import logging
from typing import List

from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis.entities.results import AnalysisResult
from felicity.apps.analysis.repository.quality_control import QCTemplateRepository
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.notification.services import ActivityStreamService
from felicity.apps.worksheet.repository import WorkSheetRepository
from felicity.apps.worksheet.schemas import WSTemplate, WSTemplateCreate, WSTemplateUpdate, WorkSheet, WorkSheetCreate, WorkSheetUpdate
from felicity.apps.worksheet.enum import WorkSheetState
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.analysis.enum import ResultState


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WorkSheetTemplateService(BaseService[WSTemplate, WSTemplateCreate, WSTemplateUpdate]):
    def __init__(self):
        super().__init__(QCTemplateRepository)


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
        worksheet = await self.get(uid)
        analysis_results, _ = await self.get_analysis_results(uid)
        count = len(analysis_results)
        worksheet.assigned_count = count
        if count == 0:
            worksheet.state = WorkSheetState.EMPTY

        if count > 0 and worksheet.state == WorkSheetState.EMPTY:
            worksheet.state = WorkSheetState.PENDING

        await super().update(uid, marshaller(worksheet))

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
        worksheet = await self.get(uid)
        if worksheet.state != WorkSheetState.AWAITING:
            states = [
                ResultState.RESULTED,
                ResultState.APPROVED,
            ]

            results, qc_results = await self.get_analysis_results(uid)
            analysis_results = results + qc_results
            if all([res.status in states for res in analysis_results]):
                worksheet.state = WorkSheetState.AWAITING
                worksheet.updated_by_uid = submitter.uid  # noqa
                worksheet.submitted_by_uid = submitter.uid
                saved = await super().update(uid, marshaller(worksheet))
                await self.activity_streamer.stream(saved, submitter, "submitted", "worksheet")
                return saved
        return worksheet

    async def verify(self, uid: str, verified_by):
        worksheet = await self.get(uid)
        if worksheet.state != WorkSheetState.APPROVED:
            states = [
                ResultState.APPROVED,
                ResultState.RETRACTED,
            ]

            results, qc_results = await self.get_analysis_results(uid)
            analysis_results = results + qc_results
            if all([res.status in states for res in analysis_results]):
                worksheet.state = WorkSheetState.APPROVED
                worksheet.updated_by_uid = verified_by.uid  # noqa
                worksheet.verified_by_uid = verified_by.uid
                saved = await super().update(uid, marshaller(worksheet))
                await self.activity_streamer.stream(saved, verified_by, "verified", "worksheet")
                return saved
        return self

    async def create(self, obj_in: dict | WorkSheetCreate) -> WorkSheet:
        data = self._import(obj_in)
        data["worksheet_id"] = (await self.id_sequence_service.get_next_number("WS"))[1]
        return await super().create(data)



