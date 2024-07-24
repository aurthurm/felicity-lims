from datetime import datetime, timedelta
from typing import Any, List, Union
from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis.repository.analysis import (
    AnalysisCategoryRepository,
    AnalysisCodingRepository,
    AnalysisTemplateRepository,
    CodingStandardRepository,
    RejectionReasonRepository,
    SampleRepository,
    SampleTypeRepository,
    SampleTypeCodingRepository,
    ProfileRepository,
    ProfileCodingRepository,
    AnalysisRepository,
    AnalysisInterimRepository,
    AnalysisCorrectionFactorRepository,
    AnalysisDetectionLimitRepository,
    AnalysisUncertaintyRepository,
    AnalysisSpecificationRepository,
    ResultOptionRepository,
    AnalysisRequestRepository,
)
from felicity.apps.analysis.schemas import (
    AnalysisRequestUpdate,
    AnalysisTemplate,
    AnalysisTemplateCreate,
    AnalysisTemplateUpdate,
    CodingStandard,
    SampleType,
    SampleTypeCoding,
    AnalysisCategory,
    Profile,
    ProfileCoding,
    Analysis,
    AnalysisCoding,
    AnalysisInterim,
    AnalysisCorrectionFactor,
    AnalysisDetectionLimit,
    AnalysisUncertainty,
    AnalysisSpecification,
    ResultOption,
    AnalysisRequest,
    RejectionReason,
    Sample,
    CodingStandardCreate,
    SampleTypeCreate,
    SampleTypeUpdate,
    SampleTypeCodingCreate,
    SampleTypeCodingUpdate,
    AnalysisCategoryCreate,
    AnalysisCategoryUpdate,
    ProfileCreate,
    ProfileUpdate,
    ProfileCodingCreate,
    ProfileCodingUpdate,
    AnalysisCreate,
    AnalysisUpdate,
    AnalysisCodingCreate,
    AnalysisCodingUpdate,
    CodingStandardUpdate,
    AnalysisInterimCreate,
    AnalysisInterimUpdate,
    AnalysisCorrectionFactorCreate,
    AnalysisCorrectionFactorUpdate,
    AnalysisDetectionLimitCreate,
    AnalysisDetectionLimitUpdate,
    AnalysisUncertaintyCreate,
    AnalysisUncertaintyUpdate,
    AnalysisSpecificationCreate,
    AnalysisSpecificationUpdate,
    ResultOptionCreate,
    ResultOptionUpdate,
    RejectionReasonCreate,
    RejectionReasonUpdate,
    AnalysisRequestCreate,
    SampleCreate,
    SampleUpdate,
)
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.idsequencer.utils import sequencer
from felicity.apps.analysis.enum import ResultState, SampleState
from felicity.apps.notification.services import ActivityStreamService
from felicity.apps.analysis.entities.analysis import analysis_profile


class CodingStandardService(BaseService[CodingStandard, CodingStandardCreate, CodingStandardUpdate]):
    def __init__(self):
        super().__init__(CodingStandardRepository)


class SampleTypeService(BaseService[SampleType, SampleTypeCreate, SampleTypeUpdate]):
    def __init__(self):
        super().__init__(SampleTypeRepository)

class SampleTypeCodingService(BaseService[SampleTypeCoding, SampleTypeCodingCreate, SampleTypeCodingUpdate]):
    def __init__(self):
        super().__init__(SampleTypeCodingRepository)


class AnalysisCategoryService(BaseService[AnalysisCategory, AnalysisCategoryCreate, AnalysisCategoryUpdate]):
    def __init__(self):
        super().__init__(AnalysisCategoryRepository)


class ProfileService(BaseService[Profile, ProfileCreate, ProfileUpdate]):
    def __init__(self):
        super().__init__(ProfileRepository)

    async def update_tat(self, profile: Profile) -> Profile:
        tats = []
        tat = None
        for anal in profile.analyses:
            tats.append(anal.tat_length_minutes)

        if len(tats) > 0:
            tat = sorted(tats, reverse=False)[0]

        if tat:
            profile.tat_length_minutes = tat
            return await self.update(profile, **marshaller(profile))
        return profile
    
    async def get_analyses(self, uid):
        # items, cols = await self.repository.query_table(
        #     analysis_profile,
        #     **{"profile_uid": uid},
        # )
        return (await self.repository.get_related(related=["analyses"], uid=uid)).analyses


class AnalysisTemplateService(BaseService[AnalysisTemplate, AnalysisTemplateCreate, AnalysisTemplateUpdate]):
    def __init__(self) -> None:
        super().__init__(AnalysisTemplateRepository)



class ProfileCodingService(BaseService[ProfileCoding, ProfileCodingCreate, ProfileCodingUpdate]):
    def __int__(self):
        super().__init__(ProfileCodingRepository)


class AnalysisService(BaseService[Analysis, AnalysisCreate, AnalysisUpdate]):
    def __init__(self):
        super().__init__(AnalysisRepository)


class AnalysisCodingService(BaseService[AnalysisCoding, AnalysisCodingCreate, AnalysisCodingUpdate]):
    def __init__(self):
        super().__init__(AnalysisCodingRepository)

class AnalysisInterimService(BaseService[AnalysisInterim, AnalysisInterimCreate, AnalysisInterimUpdate]):
    def __init__(self):
        super().__init__(AnalysisInterimRepository)

class AnalysisCorrectionFactorService(
    BaseService[AnalysisCorrectionFactor, AnalysisCorrectionFactorCreate, AnalysisCorrectionFactorUpdate]
):
    def __init__(self):
        super().__init__(AnalysisCorrectionFactorRepository)

 

class AnalysisDetectionLimitService(
    BaseService[AnalysisDetectionLimit, AnalysisDetectionLimitCreate, AnalysisDetectionLimitUpdate]
):
    def __init__(self):
        super().__init__(AnalysisDetectionLimitRepository)



class AnalysisUncertaintyService(
    BaseService[AnalysisUncertainty, AnalysisUncertaintyCreate, AnalysisUncertaintyUpdate]
):
    def __init__(self):
        super().__init__(AnalysisUncertaintyRepository)



class AnalysisSpecificationService(
    BaseService[AnalysisSpecification, AnalysisSpecificationCreate, AnalysisSpecificationUpdate]
):
    def __init__(self):
        super().__init__(AnalysisSpecificationRepository)



class ResultOptionService(BaseService[ResultOption, ResultOptionCreate, ResultOptionUpdate]):
    def __init__(self):
        super().__init__(ResultOptionRepository)


class AnalysisRequestService(BaseService[AnalysisRequest, AnalysisRequestCreate, AnalysisRequestUpdate]):
    id_sequence_service = IdSequenceService()

    def __init__(self):
        super().__init__(AnalysisRequestRepository)

    @classmethod
    async def create(
            cls, obj_in: dict | AnalysisRequestCreate
    ):
        data = cls._import(obj_in)
        data["request_id"] = (await cls.id_sequence_service.get_next_number("AR"))[1]
        return await super().create(data)


class RejectionReasonService(BaseService[RejectionReason, RejectionReasonCreate, RejectionReasonUpdate]):
    def __init__(self):
        super().__init__(RejectionReasonRepository)



class SampleService(BaseService[Sample, SampleCreate, SampleUpdate]):
    def __init__(self):
        self.analysis_result_service = AnalysisResultService()
        self.streamer_service = ActivityStreamService()
        self.id_sequencer_service = IdSequenceService()
        super().__init__(SampleRepository)

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

    async def update_due_date(self, uid,  reset: bool = False):
        sample = await self.get(uid)

        tats: List[Union[int, Any]] = []
        length: int = 0
        for anal in sample.analyses:
            tats.append(anal.tat_length_minutes)

        for prof in sample.profiles:
            tats.append(prof.tat_length_minutes)

        if len(tats) > 0:
            length = sorted(tats, reverse=False)[0]

        if reset:
            start = datetime.now()
        else:
            start = sample.created_at
            if not start:
                start = datetime.now()

        if length:
            return await super().update(uid, {"due_date": start + timedelta(minutes=length)})
        return sample

    async def change_status(self, uid, status, updated_by_uid=None):
        data = {"status": status}
        if updated_by_uid:
            data["updated_by_uid"] = updated_by_uid
        return await super().update(uid, data)

    async def extend_due_date(self, uid: str, ext_minutes: int):
        sample = await self.get(uid)
        return await super().update(uid, {"due_date": sample.due_date + timedelta(minutes=ext_minutes)})

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
            ResultState.SUBMITTING,
            ResultState.PENDING,
            ResultState.APPROVING,
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
        sample = await self.get(uid)
        if sample.status in [SampleState.EXPECTED]:
            sample.status = SampleState.RECEIVED
            sample.received_by_uid = received_by.uid
            sample.date_received = datetime.now()
            sample.updated_by_uid = received_by.uid  # noqa
            return await super().update(uid, **marshaller(sample))
        return None

    async def cancel(self, uid: str, cancelled_by):
        sample = await self.get(uid)
        analysis_results = await self.get_analysis_results(uid)
        if sample.status in [SampleState.RECEIVED, SampleState.EXPECTED]:
            for result in analysis_results:
                await self.analysis_result_service.cancel(result.uid, cancelled_by=cancelled_by)
            sample.status = SampleState.CANCELLED
            sample.cancelled_by_uid = cancelled_by.uid
            sample.date_cancelled = datetime.now()
            sample.updated_by_uid = cancelled_by.uid  # noqa
            return await super().update(uid, **marshaller(sample))
        return None

    async def re_instate(self, uid: str, re_instated_by):
        sample = await self.get(uid)
        analysis_results = await self.get_analysis_results(uid)
        if sample.status in [SampleState.CANCELLED]:
            # A better way is to go to audit log and retrieve previous state
            # rather than transitioning all to RECEIVED
            sample.status = SampleState.RECEIVED
            sample.cancelled_by_uid = None
            sample.date_cancelled = None
            sample.updated_by_uid = re_instated_by.uid  # noqa
            sample = await super().update(uid, **marshaller(sample))
            for result in analysis_results:
                await self.analysis_result_service.re_instate(sample, result, re_instated_by=re_instated_by)
            return sample
        return sample

    async def submit(self, uid:str, submitted_by):
        sample = await self.get(uid)
        statuses = [
            ResultState.RESULTED,
            ResultState.RETRACTED,
            ResultState.APPROVED,
            ResultState.CANCELLED,
        ]
        analysis_results = await self.get_analysis_results(uid)
        match = all([(sibling.status in statuses) for sibling in analysis_results])
        if match and sample.status in [SampleState.RECEIVED]:
            sample.status = SampleState.AWAITING
            sample.submitted_by_uid = submitted_by.uid
            sample.date_submitted = datetime.now()
            sample.updated_by_uid = submitted_by.uid  # noqa
            saved = await super().update(uid, **marshaller(sample))
            await self.streamer_service.stream(saved, submitted_by, "submitted", "sample")
            return saved
        return sample

    async def un_submit(self, uid: str):
        sample = await self.get(uid)
        if sample.status == SampleState.AWAITING:
            sample.status = SampleState.RECEIVED
            sample.submitted_by_uid = None
            sample.date_submitted = None
            sample.updated_by_uid = None  # noqa
            return await super().update(uid, **marshaller(sample))
        return sample

    async def assign(self, uid: str):
        sample = await self.get(uid)
        sample.assigned = True
        return await super().update(uid, **marshaller(sample))

    async def un_assign(self, uid: str):
        sample = await self.get(uid)
        sample.assigned = False
        return await super().update(uid, **marshaller(sample))

    async def is_verifiable(self, uid: str) -> bool:
        sample = await self.get(uid)
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

    async def verify(self, uid:str, verified_by) -> tuple[bool, Sample]:
        sample = await self.get(uid)
        is_verifiable = await self.is_verifiable(uid)
        if is_verifiable:
            sample.status = SampleState.APPROVED
            sample.verified_by_uid = verified_by.uid
            sample.date_verified = datetime.now()
            sample.updated_by_uid = verified_by.uid  # noqa
            saved = await super().update(uid, **marshaller(sample))
            await self.streamer_service.stream(saved, verified_by, "approved", "sample")
            return True, saved
        return False, sample

    async def publish(self, uid:str, published_by):
        sample = await self.get(uid)
        if sample.status in [SampleState.APPROVED, SampleState.PUBLISHING]:
            sample.status = SampleState.PUBLISHED
            sample.published_by_uid = published_by.uid
            sample.date_published = datetime.now()
            sample.updated_by_uid = published_by.uid  # noqa
            return await super().update(uid, **marshaller(sample))
        return sample

    async def print(self, uid:str , printed_by):
        sample = await self.get(uid)
        if sample.status == SampleState.PUBLISHED:
            sample.printed = True
            sample.printed_by_uid = printed_by.uid
            sample.date_printed = datetime.now()
            sample.updated_by_uid = printed_by.uid  # noqa
            return await super().update(uid, **marshaller(sample))
        return sample

    async def invalidate(self, uid: str, invalidated_by) -> tuple[Sample, Sample]:
        sample = await self.get(uid)
        statuses = [SampleState.APPROVED, SampleState.PUBLISHED]
        copy = None
        if sample.status in statuses:
            copy = await self.duplicate_unique(invalidated_by)
            sample.status = SampleState.INVALIDATED
            sample.invalidated_by_uid = invalidated_by.uid
            invalidated = await super().update(uid, **marshaller(sample))
            await self.streamer_service.stream(invalidated, invalidated_by, "invalidated", "sample")
            return copy, invalidated
        return copy, self

    async def reject(self, uid: str, rejected_by):
        sample = await self.get(uid)
        statuses = [SampleState.RECEIVED, SampleState.EXPECTED]
        if sample.status in statuses:
            sample.status = SampleState.REJECTED
            sample.received_by_uid = rejected_by.uid
            sample.updated_by_uid = rejected_by.uid  # noqa
            rejected = await super().update(uid, **marshaller(sample))
            await self.streamer_service.stream(rejected, rejected_by, "rejected", "sample")
            return rejected
        return sample

    async def store(self, uid: str, stored_by):
        sample = await self.get(uid)
        statuses = [SampleState.RECEIVED]
        if sample.status in statuses:
            sample.status = SampleState.STORED
            sample.stored_by = stored_by.uid
            sample.updated_by_uid = stored_by.uid  # noqa
            stored = await super().update(uid, **marshaller(sample))
            await self.streamer_service.stream(stored, stored_by, "stored", "sample")
            return stored
        return sample

    async def recover(self, uid: str):
        sample = await self.get(uid)
        statuses = [SampleState.STORED]
        if sample.status in statuses:
            sample.status = SampleState.RECEIVED
            sample.storage_container_uid = None
            sample.storage_slot = None
            sample.storage_slot_index = None
            sample.date_retrieved_from_storage = datetime.now()
            recovered = await super().update(uid, **marshaller(sample))
            return recovered
        return sample

    async def create(self, obj_in: dict | SampleCreate):
        data = self._import(obj_in)
        # sample_type = await SampleType.find(data["sample_type_uid"])
        # data["sample_id"] = (await self.id_sequencer_service.get_next_number(sample_type.abbr))[1]
        data["sample_id"] = (
            await self.id_sequencer_service.get_next_number(prefix="S", generic=True)
        )[1]
        return await super().create(data)

    async def duplicate_unique(self, uid: str, duplicator):
        sample = await self.get(uid)
        data = sample.to_dict(nested=False)
        data["sample_id"] = self.copy_sample_id_unique(sample)
        for key, _ in list(data.items()):
            if key not in self.copy_include_keys():
                del data[key]
        data["status"] = SampleState.RECEIVED
        data["profiles"] = self.profiles
        data["analyses"] = self.analyses
        data["parent_id"] = self.uid
        data["created_by_uid"] = duplicator.uid
        return await super().create(data)

    async def clone_afresh(self, uid: str, cloner):
        sample = await self.get(uid)
        data = sample.to_dict(nested=False)
        for key, _ in list(data.items()):
            if key not in self.copy_include_keys():
                del data[key]
        data["status"] = SampleState.RECEIVED
        data["profiles"] = self.profiles
        data["analyses"] = self.analyses
        data["parent_id"] = self.uid
        data["created_by_uid"] = cloner.uid
        return await self.create(obj_in=data)
