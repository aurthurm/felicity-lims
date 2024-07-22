import logging
from typing import List

from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis.entities.results import AnalysisResult
from felicity.apps.analysis.repository.quality_control import QCTemplateRepository
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.notification.services import ActivityStreamService
from felicity.apps.worksheet.conf import WSStates
from felicity.apps.worksheet.repository import WorkSheetRepository
from felicity.apps.worksheet.schemas import WSTemplate, WSTemplateCreate, WSTemplateUpdate, WorkSheet, WorkSheetCreate, WorkSheetUpdate


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WorkSheetTemplateService(BaseService[WSTemplate, WSTemplateCreate, WSTemplateUpdate]):
    def __init__(self):
        super().__init__(QCTemplateRepository)


class WorkSheetService(BaseService[WorkSheet, WorkSheetCreate, WorkSheetUpdate]):
    id_sequence_service = IdSequenceService()

    def __init__(self):
        self.activity_streamer = ActivityStreamService()
        super().__init__(WorkSheetRepository)


    async def get_analysis_results(self):
        results: List[AnalysisResult] = []
        qc_results: List[AnalysisResult] = []

        all_results = await AnalysisResult.get_all(worksheet_uid=self.uid)
        for result in all_results:
            if result.sample.sample_type.name == "QC Sample":
                qc_results.append(result)
            else:
                results.append(result)

        return results, qc_results

    async def reset_assigned_count(self):
        # TODO: DO NOT COUNT QC SAMPLES
        analysis_results, _ = await self.get_analysis_results()
        count = len(analysis_results)
        self.assigned_count = count
        if count == 0:
            self.state = WSStates.EMPTY

        if count > 0 and self.state == WSStates.EMPTY:
            self.state = WSStates.PENDING

        await self.save_async()

    async def change_state(self, state, updated_by_uid):
        self.state = state
        self.updated_by_uid = updated_by_uid  # noqa
        await self.save_async()

    async def has_processed_samples(self):
        states = [
            analysis_states.result.RESULTED,
            analysis_states.result.APPROVED,
        ]

        results, qc_results = await self.get_analysis_results()
        analysis_results = results + qc_results
        processed = any([res.status in states for res in analysis_results])
        return processed

    async def submit(self, submitter):
        if self.state != WSStates.AWAITING:
            states = [
                analysis_states.result.RESULTED,
                analysis_states.result.APPROVED,
            ]

            results, qc_results = await self.get_analysis_results()
            analysis_results = results + qc_results
            if all([res.status in states for res in analysis_results]):
                self.state = WSStates.AWAITING
                self.updated_by_uid = submitter.uid  # noqa
                self.submitted_by_uid = submitter.uid
                saved = await self.save_async()
                await self.activity_streamer.stream(saved, submitter, "submitted", "worksheet")
                return saved
        return self

    async def verify(self, verified_by):
        if self.state != WSStates.APPROVED:
            states = [
                analysis_states.result.APPROVED,
                analysis_states.result.RETRACTED,
            ]

            results, qc_results = await self.get_analysis_results()
            analysis_results = results + qc_results
            if all([res.status in states for res in analysis_results]):
                self.state = WSStates.APPROVED
                self.updated_by_uid = verified_by.uid  # noqa
                self.verified_by_uid = verified_by.uid
                saved = await self.save_async()
                await self.activity_streamer.stream(saved, verified_by, "verified", "worksheet")
                return saved
        return self

    @classmethod
    async def create(cls, obj_in: dict | WorkSheetCreate) -> WorkSheet:
        data = cls._import(obj_in)
        data["worksheet_id"] = (await cls.id_sequence_service.get_next_number("WS"))[1]
        return await super().create(**data)



