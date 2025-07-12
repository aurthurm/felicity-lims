import logging
from datetime import timedelta
from typing import Any, List, Union

from sqlalchemy.ext.asyncio import AsyncSession

from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis.entities.analysis import (
    Analysis,
    AnalysisCategory,
    AnalysisCoding,
    AnalysisCorrectionFactor,
    AnalysisDetectionLimit,
    AnalysisInterim,
    AnalysisRequest,
    AnalysisSpecification,
    AnalysisTemplate,
    AnalysisUncertainty,
    CodingStandard,
    Profile,
    ProfileCoding,
    RejectionReason,
    ResultOption,
    Sample,
    SampleType,
    SampleTypeCoding, sample_profile, sample_analysis, ClinicalData, ClinicalDataCoding,
)
from felicity.apps.analysis.enum import ResultState, SampleState
from felicity.apps.analysis.repository.analysis import (
    AnalysisCategoryRepository,
    AnalysisCodingRepository,
    AnalysisCorrectionFactorRepository,
    AnalysisDetectionLimitRepository,
    AnalysisInterimRepository,
    AnalysisRepository,
    AnalysisRequestRepository,
    AnalysisSpecificationRepository,
    AnalysisTemplateRepository,
    AnalysisUncertaintyRepository,
    CodingStandardRepository,
    ProfileCodingRepository,
    ProfileRepository,
    RejectionReasonRepository,
    ResultOptionRepository,
    SampleRepository,
    SampleTypeCodingRepository,
    SampleTypeRepository, ClinicalDataRepository, ClinicalDataCodingRepository,
)
from felicity.apps.analysis.schemas import (
    AnalysisCategoryCreate,
    AnalysisCategoryUpdate,
    AnalysisCodingCreate,
    AnalysisCodingUpdate,
    AnalysisCorrectionFactorCreate,
    AnalysisCorrectionFactorUpdate,
    AnalysisCreate,
    AnalysisDetectionLimitCreate,
    AnalysisDetectionLimitUpdate,
    AnalysisInterimCreate,
    AnalysisInterimUpdate,
    AnalysisRequestCreate,
    AnalysisRequestUpdate,
    AnalysisSpecificationCreate,
    AnalysisSpecificationUpdate,
    AnalysisTemplateCreate,
    AnalysisTemplateUpdate,
    AnalysisUncertaintyCreate,
    AnalysisUncertaintyUpdate,
    AnalysisUpdate,
    CodingStandardCreate,
    CodingStandardUpdate,
    ProfileCodingCreate,
    ProfileCodingUpdate,
    ProfileCreate,
    ProfileUpdate,
    RejectionReasonCreate,
    RejectionReasonUpdate,
    ResultOptionCreate,
    ResultOptionUpdate,
    SampleCreate,
    SampleTypeCodingCreate,
    SampleTypeCodingUpdate,
    SampleTypeCreate,
    SampleTypeUpdate,
    SampleUpdate, ClinicalDataCreate, ClinicalDataUpdate, ClinicalDataCodingCreate, ClinicalDataCodingUpdate,
)
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.client.services import ClientService, ClientContactService
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.idsequencer.utils import sequencer
from felicity.apps.notification.enum import NotificationObject
from felicity.apps.notification.services import ActivityStreamService
from felicity.core.dtz import timenow_dt
from felicity.core.events import post_event

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CodingStandardService(
    BaseService[CodingStandard, CodingStandardCreate, CodingStandardUpdate]
):
    def __init__(self):
        self.repository: CodingStandardRepository = CodingStandardRepository()
        super().__init__(self.repository)


class SampleTypeService(BaseService[SampleType, SampleTypeCreate, SampleTypeUpdate]):
    def __init__(self):
        super().__init__(SampleTypeRepository())


class SampleTypeCodingService(
    BaseService[SampleTypeCoding, SampleTypeCodingCreate, SampleTypeCodingUpdate]
):
    def __init__(self):
        super().__init__(SampleTypeCodingRepository())


class AnalysisCategoryService(
    BaseService[AnalysisCategory, AnalysisCategoryCreate, AnalysisCategoryUpdate]
):
    def __init__(self):
        super().__init__(AnalysisCategoryRepository())


class ProfileService(BaseService[Profile, ProfileCreate, ProfileUpdate]):
    def __init__(self):
        super().__init__(ProfileRepository())

    async def update_tat(self, profile: Profile) -> Profile:
        tats = []
        tat = None
        for anal in profile.analyses:
            tats.append(anal.tat_length_minutes)

        if len(tats) > 0:
            tat = sorted(tats, reverse=False)[0]

        if tat:
            profile.tat_length_minutes = tat
            return await self.save(profile)
        return profile

    async def get_analyses(self, uid):
        # items, cols = await self.repository.table_query(
        #     analysis_profile,
        #     **{"profile_uid": uid},
        # )
        return (await self.repository.get(related=["analyses"], uid=uid)).analyses


class AnalysisTemplateService(
    BaseService[AnalysisTemplate, AnalysisTemplateCreate, AnalysisTemplateUpdate]
):
    def __init__(self) -> None:
        super().__init__(AnalysisTemplateRepository())


class ProfileCodingService(
    BaseService[ProfileCoding, ProfileCodingCreate, ProfileCodingUpdate]
):
    def __init__(self):
        super().__init__(ProfileCodingRepository())


class AnalysisService(BaseService[Analysis, AnalysisCreate, AnalysisUpdate]):
    def __init__(self):
        super().__init__(AnalysisRepository())


class AnalysisCodingService(
    BaseService[AnalysisCoding, AnalysisCodingCreate, AnalysisCodingUpdate]
):
    def __init__(self):
        super().__init__(AnalysisCodingRepository())


class AnalysisInterimService(
    BaseService[AnalysisInterim, AnalysisInterimCreate, AnalysisInterimUpdate]
):
    def __init__(self):
        super().__init__(AnalysisInterimRepository())


class AnalysisCorrectionFactorService(
    BaseService[
        AnalysisCorrectionFactor,
        AnalysisCorrectionFactorCreate,
        AnalysisCorrectionFactorUpdate,
    ]
):
    def __init__(self):
        super().__init__(AnalysisCorrectionFactorRepository())


class AnalysisDetectionLimitService(
    BaseService[
        AnalysisDetectionLimit,
        AnalysisDetectionLimitCreate,
        AnalysisDetectionLimitUpdate,
    ]
):
    def __init__(self):
        super().__init__(AnalysisDetectionLimitRepository())


class AnalysisUncertaintyService(
    BaseService[
        AnalysisUncertainty, AnalysisUncertaintyCreate, AnalysisUncertaintyUpdate
    ]
):
    def __init__(self):
        super().__init__(AnalysisUncertaintyRepository())


class AnalysisSpecificationService(
    BaseService[
        AnalysisSpecification, AnalysisSpecificationCreate, AnalysisSpecificationUpdate
    ]
):
    def __init__(self):
        super().__init__(AnalysisSpecificationRepository())


class ResultOptionService(
    BaseService[ResultOption, ResultOptionCreate, ResultOptionUpdate]
):
    def __init__(self):
        super().__init__(ResultOptionRepository())


class AnalysisRequestService(
    BaseService[AnalysisRequest, AnalysisRequestCreate, AnalysisRequestUpdate]
):
    def __init__(self):
        self.id_sequence_service = IdSequenceService()
        super().__init__(AnalysisRequestRepository())

    async def create(
            self, obj_in: dict | AnalysisRequestCreate, related: list[str] | None = None,
            commit: bool = True, session: AsyncSession | None = None
    ):
        data = self._import(obj_in)
        data["request_id"] = (
            await self.id_sequence_service.get_next_number(prefix="AR", commit=commit, session=session)
        )[1]
        return await super().create(c=data, related=related, commit=commit, session=session)

    async def snapshot(self, ar: AnalysisRequest, metadata: dict = None):
        fields = ["client"]

        if metadata is None:
            metadata = {}

        for _field in fields:
            if _field not in metadata:
                if _field == "client":
                    client = await ClientService().get(related=["province", "district"], uid=ar.client_uid)
                    contacts = await ClientContactService().get_all(client_uid=ar.client_uid)
                    metadata[_field] = client.snapshot()
                    metadata[_field]["province"] = client.province.snapshot() if client.province else None
                    metadata[_field]["district"] = client.district.snapshot() if client.district else None
                    metadata[_field]["contacts"] = [cc.snapshot() for cc in contacts]
                # TODO: also handle snapshot of _field == "clinical_data"
        return await self.update(ar.uid, {"metadata_snapshot": marshaller(metadata, depth=3)})


class ClinicalDataService(
    BaseService[ClinicalData, ClinicalDataCreate, ClinicalDataUpdate]
):
    def __init__(self):
        super().__init__(ClinicalDataRepository())


class ClinicalDataCodingService(
    BaseService[ClinicalDataCoding, ClinicalDataCodingCreate, ClinicalDataCodingUpdate]
):
    def __init__(self):
        super().__init__(ClinicalDataCodingRepository())


class RejectionReasonService(
    BaseService[RejectionReason, RejectionReasonCreate, RejectionReasonUpdate]
):
    def __init__(self):
        super().__init__(RejectionReasonRepository())


class SampleService(BaseService[Sample, SampleCreate, SampleUpdate]):
    def __init__(self):
        self.analysis_result_service = AnalysisResultService()
        self.streamer_service = ActivityStreamService()
        self.id_sequencer_service = IdSequenceService()
        super().__init__(SampleRepository())

    @staticmethod
    def copy_include_keys() -> list[str]:
        """Keys to include when duplicating Sample"""
        return [
            "analysis_request_uid",
            "sample_type_uid",
            "status",
            "sample_id",
            "profiles",
            "analyses",
            "priority",
            "received_by_uid",
            "date_received",
            "internal_use",
        ]

    async def update_due_date(self, uid, reset: bool = False):
        sample = await self.get(uid=uid)

        tats: List[Union[int, Any]] = []
        length: int = 0
        for anal in sample.analyses:
            tats.append(anal.tat_length_minutes)

        for prof in sample.profiles:
            tats.append(prof.tat_length_minutes)

        if len(tats) > 0:
            length = sorted(tats, reverse=False)[0]

        if reset:
            start = timenow_dt()
        else:
            start = sample.created_at
            if not start:
                start = timenow_dt()

        if length:
            return await super().update(
                uid, {"due_date": start + timedelta(minutes=length)}
            )
        return sample

    async def change_status(self, uid, status, updated_by_uid=None):
        data = {"status": status}
        if updated_by_uid:
            data["updated_by_uid"] = updated_by_uid
        return await super().update(uid, data)

    async def extend_due_date(self, uid: str, ext_minutes: int):
        sample = await self.get(uid=uid)
        return await super().update(
            uid, {"due_date": sample.due_date + timedelta(minutes=ext_minutes)}
        )

    async def copy_sample_id_unique(self, sample: Sample) -> str:
        split = sample.sample_id.split("_R")
        prefix = split[0]
        stub = None
        try:
            stub = split[1]
        except IndexError:
            stub = None
        finally:
            if not stub:
                return prefix + "_R01"
            else:
                count = int(stub)
                return f"{prefix}_R{sequencer(count + 1, 2)}"

    async def get_analysis_results(self, uid: str):
        return await self.analysis_result_service.get_all(sample_uid=uid)

    async def get_incomplete_analysis_results(self, uid: str):
        pending_states = [
            ResultState.PENDING,
            ResultState.REFERRED,
        ]
        analysis = await self.get_analysis_results(uid)
        return analysis, list(filter(lambda a: a.status in pending_states, analysis))

    async def get_referred_analyses(self, uid: str):
        analysis = await self.get_analysis_results(uid)
        return analysis, list(
            filter(lambda a: a.status == ResultState.REFERRED, analysis)
        )

    async def has_fully_referred_analyses(self, uid: str):
        analysis, referred = await self.get_referred_analyses(uid)
        return len(analysis) == len(referred)

    async def has_no_referred_analyses(self, uid: str) -> bool:
        _, referred = await self.get_referred_analyses(uid)
        return len(referred) == 0

    async def has_partly_referred_analyses(self, uid: str) -> bool:
        analysis, referred = await self.get_referred_analyses(uid)
        return len(analysis) != len(referred) and len(referred) > 0

    async def receive(self, uid: str, received_by):
        sample = await self.get(uid=uid)
        sample.status = SampleState.RECEIVED
        sample.received_by_uid = received_by.uid
        sample.updated_by_uid = received_by.uid
        if not sample.date_received:
            sample.date_received = timenow_dt()

        saved_sample = await super().save(sample)
        await self.streamer_service.stream(
            saved_sample, received_by, "received", NotificationObject.SAMPLE
        )
        return saved_sample

    async def cancel(self, uid: str, cancelled_by):
        sample = await self.get(uid=uid)
        analysis_results = await self.get_analysis_results(uid)

        # Update sample attributes
        sample.status = SampleState.CANCELLED
        sample.cancelled_by_uid = cancelled_by.uid
        sample.date_cancelled = timenow_dt()
        sample.updated_by_uid = cancelled_by.uid

        # Save sample first
        sample = await super().save(sample)

        # Cancel analysis results sequentially
        for result in analysis_results:
            await self.analysis_result_service.cancel(
                result.uid, cancelled_by=cancelled_by
            )

        # Log the cancellation action
        await self.streamer_service.stream(sample, cancelled_by, "cancelled", NotificationObject.SAMPLE)

        return sample

    async def re_instate(self, uid: str, re_instated_by):
        sample = await self.get(uid=uid)

        # Update sample attributes
        sample.status = SampleState.RECEIVED
        sample.cancelled_by_uid = None
        sample.date_cancelled = None
        sample.updated_by_uid = re_instated_by.uid
        sample.date_reinstated = timenow_dt()

        # Save sample first
        sample = await super().save(sample)

        # Re-instate analysis results sequentially
        analysis_results = await self.get_analysis_results(uid)
        for result in analysis_results:
            await self.analysis_result_service.re_instate(
                result.uid, re_instated_by=re_instated_by
            )

        # Log the re-instatement action
        await self.streamer_service.stream(
            sample, re_instated_by, "reinstated", NotificationObject.SAMPLE
        )

        return sample

    async def submit(self, uid: str, submitted_by):
        sample = await self.get(uid=uid)

        # Update sample attributes
        sample.status = SampleState.AWAITING
        sample.submitted_by_uid = submitted_by.uid
        sample.date_submitted = timenow_dt()
        sample.updated_by_uid = submitted_by.uid

        # Save sample
        saved = await super().save(sample)

        # Log the submission action
        await self.streamer_service.stream(saved, submitted_by, "submitted", NotificationObject.SAMPLE)

        return saved

    async def un_submit(self, uid: str):
        sample = await self.get(uid=uid)
        sample.status = SampleState.RECEIVED
        sample.submitted_by_uid = None
        sample.date_submitted = None
        sample.updated_by_uid = None  # noqa
        return await super().save(sample)

    async def assign(self, uid: str):
        sample = await self.get(uid=uid)
        sample.assigned = True
        return await super().save(sample)

    async def un_assign(self, uid: str):
        sample = await self.get(uid=uid)
        sample.assigned = False
        return await super().save(sample)

    async def is_verifiable(self, uid: str) -> bool:
        sample = await self.get(uid=uid)
        statuses = [
            ResultState.APPROVED,
            ResultState.RETRACTED,
            ResultState.CANCELLED,
        ]
        analysis_results = await self.get_analysis_results(uid)
        match = all([(sibling.status in statuses) for sibling in analysis_results])
        if match and sample.status in [SampleState.AWAITING, SampleState.PAIRED]:
            return True

        # if there are no results in referred state but some are in pending state. transition awaiting to pending state
        analysis, referred = await self.get_referred_analyses(uid)
        if not referred and list(  # and has pending results then :)
                filter(lambda an: an.status in [ResultState.PENDING], analysis)
        ):
            await self.change_status(uid, SampleState.RECEIVED)
        return False

    async def verify(self, uid: str, verified_by) -> tuple[bool, Sample]:
        sample = await self.get(uid=uid)
        is_verifiable = await self.is_verifiable(uid)

        if is_verifiable:
            # Update sample attributes
            sample.status = SampleState.APPROVED
            sample.verified_by_uid = verified_by.uid
            sample.date_verified = timenow_dt()
            sample.updated_by_uid = verified_by.uid

            # Save sample
            saved = await super().save(sample)

            # Log the verification action
            await self.streamer_service.stream(saved, verified_by, "approved", NotificationObject.SAMPLE)

            return True, saved

        return False, sample

    async def publish(self, uid: str, published_by):
        sample = await self.get(uid=uid)
        sample.status = SampleState.PUBLISHED
        sample.published_by_uid = published_by.uid
        sample.date_published = timenow_dt()
        sample.updated_by_uid = published_by.uid  # noqa
        published = await super().save(sample)
        await self.streamer_service.stream(
            published, published_by, "published", NotificationObject.SAMPLE
        )
        # fire a published event
        if not published.internal_use:
            post_event('sample-published', uid=uid)
        return published

    async def print(self, uid: str, printed_by):
        sample = await self.get(uid=uid)
        sample.printed = True
        sample.printed_by_uid = printed_by.uid
        sample.date_printed = timenow_dt()
        sample.updated_by_uid = printed_by.uid  # noqa
        printed = await super().save(sample)
        await self.streamer_service.stream(printed, printed_by, "printed", NotificationObject.SAMPLE)
        return printed

    async def invalidate(self, uid: str, invalidated_by, commit: bool = True, session: AsyncSession | None = None) -> \
            tuple[Sample, Sample]:
        sample = await self.get(uid=uid, session=session)
        copy = await self.duplicate_unique(uid, invalidated_by, commit=commit, session=session)
        sample.status = SampleState.INVALIDATED
        sample.invalidated_by_uid = invalidated_by.uid
        invalidated = await super().save(sample, commit=commit, session=session)
        await self.streamer_service.stream(
            invalidated, invalidated_by, "invalidated", NotificationObject.SAMPLE
        )
        return copy, invalidated

    async def reject(self, uid: str, rejected_by):
        sample = await self.get(uid=uid)
        sample.status = SampleState.REJECTED
        sample.received_by_uid = rejected_by.uid
        sample.updated_by_uid = rejected_by.uid  # noqa
        rejected = await super().save(sample)
        await self.streamer_service.stream(rejected, rejected_by, "rejected", NotificationObject.SAMPLE)
        return rejected

    async def store(self, uid: str, stored_by):
        sample = await self.get(uid=uid)
        sample.status = SampleState.STORED
        sample.stored_by = stored_by.uid
        sample.updated_by_uid = stored_by.uid  # noqa
        stored = await super().save(sample)
        await self.streamer_service.stream(stored, stored_by, "stored", NotificationObject.SAMPLE)
        return stored

    async def recover(self, uid: str):
        sample = await self.get(uid=uid)
        sample.status = SampleState.RECEIVED
        sample.storage_container_uid = None
        sample.storage_slot = None
        sample.storage_slot_index = None
        sample.date_retrieved_from_storage = timenow_dt()
        recovered = await super().save(sample)
        return recovered

    async def create(
            self, obj_in: dict | SampleCreate, related: list[str] | None = None,
            commit: bool = True, session: AsyncSession | None = None
    ):
        data = self._import(obj_in)
        # sample_type = await SampleType.get(data["sample_type_uid"])
        # data["sample_id"] = (await self.id_sequencer_service.get_next_number(sample_type.abbr))[1]
        data["sample_id"] = (
            await self.id_sequencer_service.get_next_number(prefix="S", generic=True, commit=commit, session=session)
        )[1]
        return await super().create(c=data, related=related, commit=commit, session=session)

    async def duplicate_unique(self, uid: str, duplicator, commit: bool = True, session: AsyncSession | None = None):
        sample = await self.get(related=["profiles", "analyses"], uid=uid)
        data = sample.to_dict(nested=False)
        data["sample_id"] = self.copy_sample_id_unique(sample)
        for key, _ in list(data.items()):
            if key not in self.copy_include_keys():
                del data[key]
        data["status"] = SampleState.RECEIVED
        data["profiles"] = sample.profiles
        data["analyses"] = sample.analyses
        data["parent_id"] = sample.uid
        data["created_by_uid"] = duplicator.uid
        return await super().create(data, commit=commit, session=session)

    async def clone_afresh(self, uid: str, cloner, commit: bool = True, session: AsyncSession | None = None):
        sample = await self.get(related=["profiles", "analyses"], uid=uid, session=session)
        data = sample.to_dict(nested=False)
        for key, _ in list(data.items()):
            if key not in self.copy_include_keys():
                del data[key]
        data["status"] = SampleState.RECEIVED
        data["profiles"] = sample.profiles
        data["analyses"] = sample.analyses
        data["parent_id"] = sample.uid
        data["created_by_uid"] = cloner.uid
        return await self.create(obj_in=data, commit=commit, session=session)

    async def get_by_analyses(self, analyses: list[str]) -> list[Sample]:
        return await self.get_all(analysis_results___analysis_uid__in=analyses)

    async def snapshot(self, sample: Sample, metadata: dict = None):
        if metadata is None:
            metadata = {}

        logger.info(f"Processing snapshot for sample: {sample.sample_id}")

        sample_type_service = SampleTypeService()
        profile_service = ProfileService()
        analysis_service = AnalysisService()

        fields = ["sample_type", "profiles", "analyses"]

        for _field in fields:
            if _field in metadata:
                continue

            if _field == "sample_type":
                st = await sample_type_service.get(uid=sample.sample_type_uid)
                assert sample.sample_type_uid == st.uid
                metadata[_field] = st.snapshot()
                logger.info(f"SampleType => {st.name} :: {st.uid}")

            elif _field == "profiles":
                profile_uids = await profile_service.repository.table_query(
                    table=sample_profile,
                    columns=["profile_uid"],
                    sample_uid=sample.uid
                )
                if profile_uids:
                    # Assuming profile_uids is a list of dicts or tuples
                    profiles = await profile_service.get_by_uids(uids=profile_uids)
                    metadata[_field] = [p.snapshot() for p in profiles]
                    logger.info(f"Profiles => {profiles}")

            elif _field == "analyses":
                anal_uids = await analysis_service.repository.table_query(
                    table=sample_analysis,
                    columns=["analysis_uid"],
                    sample_uid=sample.uid
                )
                if anal_uids:
                    analyses = await analysis_service.get_by_uids(uids=anal_uids)
                    metadata[_field] = [a.snapshot() for a in analyses]
                    logger.info(f"Analyses => {analyses}")

        snapshot_data = marshaller(metadata, depth=3)
        return await self.update(sample.uid, {"metadata_snapshot": snapshot_data})
