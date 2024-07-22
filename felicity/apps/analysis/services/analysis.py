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
from felicity.apps.analysis.entities.analysis import (
    profile_sample_type,
    analysis_profile,
    analysis_sample_type,
    analysis_method,
    sample_profile,
    sample_analysis,
    sample_rejection_reason,
)
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.idsequencer.service import IdSequenceService


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
        return await super().create(**data)


class RejectionReasonService(BaseService[RejectionReason, RejectionReasonCreate, RejectionReasonUpdate]):
    def __init__(self):
        super().__init__(RejectionReasonRepository)



class SampleService(BaseService[Sample, SampleCreate, SampleUpdate]):
    def __init__(self):
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

    async def update_due_date(self, reset: bool = False) -> Sample:
        tats: List[Union[int, Any]] = []
        length: int = 0
        for anal in self.analyses:
            tats.append(anal.tat_length_minutes)

        for prof in self.profiles:
            tats.append(prof.tat_length_minutes)

        if len(tats) > 0:
            length = sorted(tats, reverse=False)[0]

        if reset:
            start = datetime.now()
        else:
            start = self.created_at
            if not start:
                start = datetime.now()

        if length:
            self.due_date = start + timedelta(minutes=length)
            return await self.save_async()
        return self

    async def change_status(self, status, updated_by_uid=None) -> Sample:
        self.status = status
        if updated_by_uid:
            self.updated_by_uid = updated_by_uid  # noqa
        return await self.save_async()

    async def extend_due_date(self, ext_minutes: int) -> Sample:
        self.due_date += timedelta(minutes=ext_minutes)
        return await self.save_async()

    def copy_sample_id_unique(self) -> str:
        split = self.sample_id.split("_R")
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

    async def get_analysis_results(self):
        from felicity.apps.analysis.models.results import AnalysisResult
        return await AnalysisResult.get_all(sample_uid=self.uid)

    async def get_incomplete_analysis_results(self):
        pending_states = [
            states.Result.SUBMITTING,
            states.Result.PENDING,
            states.Result.APPROVING,
            states.Result.REFERRED,
        ]
        analysis = await self.get_analysis_results()
        return analysis, list(filter(lambda a: a.status in pending_states, analysis))

    async def get_referred_analyses(self):
        analysis = await self.get_analysis_results()
        return analysis, list(
            filter(lambda a: a.status == states.Result.REFERRED, analysis)
        )

    async def has_fully_referred_analyses(self):
        analysis, referred = await self.get_referred_analyses()
        return len(analysis) == len(referred)

    async def has_no_referred_analyses(self) -> bool:
        analysis, referred = await self.get_referred_analyses()
        return len(referred) == 0

    async def has_partly_referred_analyses(self) -> bool:
        analysis, referred = await self.get_referred_analyses()
        return len(analysis) != len(referred) and len(referred) > 0

    async def receive(self, received_by) -> Self | None:
        if self.status in [states.sample.EXPECTED]:
            self.status = states.sample.RECEIVED
            self.received_by_uid = received_by.uid
            self.date_received = datetime.now()
            self.updated_by_uid = received_by.uid  # noqa
            return await self.save_async()
        return None

    async def cancel(self, cancelled_by) -> Self | None:
        analysis_results = await self.get_analysis_results()
        if self.status in [states.sample.RECEIVED, states.sample.EXPECTED]:
            for result in analysis_results:
                await result.cancel(cancelled_by=cancelled_by)
            self.status = states.sample.CANCELLED
            self.cancelled_by_uid = cancelled_by.uid
            self.date_cancelled = datetime.now()
            self.updated_by_uid = cancelled_by.uid  # noqa
            return await self.save_async()
        return None

    async def re_instate(self, re_instated_by) -> Self:
        analysis_results = await self.get_analysis_results()
        if self.status in [states.sample.CANCELLED]:
            # A better way is to go to audit log and retrieve previous state
            # rather than transitioning all to RECEIVED
            self.status = states.sample.RECEIVED
            self.cancelled_by_uid = None
            self.date_cancelled = None
            self.updated_by_uid = re_instated_by.uid  # noqa
            sample = await self.save_async()
            for result in analysis_results:
                await result.re_instate(sample, re_instated_by=re_instated_by)
            return sample
        return self

    async def submit(self, submitted_by) -> Self:
        statuses = [
            states.result.RESULTED,
            states.result.RETRACTED,
            states.result.APPROVED,
            states.result.CANCELLED,
        ]
        analysis_results = await self.get_analysis_results()
        match = all([(sibling.status in statuses) for sibling in analysis_results])
        if match and self.status in [states.sample.RECEIVED]:
            self.status = states.sample.AWAITING
            self.submitted_by_uid = submitted_by.uid
            self.date_submitted = datetime.now()
            self.updated_by_uid = submitted_by.uid  # noqa
            saved = await self.save_async()
            await streamer.stream(saved, submitted_by, "submitted", "sample")
            return saved
        return self

    async def un_submit(self) -> Self:
        if self.status == states.sample.AWAITING:
            self.status = states.sample.RECEIVED
            self.submitted_by_uid = None
            self.date_submitted = None
            self.updated_by_uid = None  # noqa
            return await self.save_async()
        return self

    async def assign(self) -> Self:
        self.assigned = True
        return await self.save_async()

    async def un_assign(self) -> Self:
        self.assigned = False
        return await self.save_async()

    async def is_verifiable(self) -> bool:
        statuses = [
            states.result.APPROVED,
            states.result.RETRACTED,
            states.result.CANCELLED,
        ]
        analysis_results = await self.get_analysis_results()
        match = all([(sibling.status in statuses) for sibling in analysis_results])
        if match and self.status in [states.sample.AWAITING, states.sample.PAIRED]:
            return True

        # if there are no results in referred state but some are in pending state. transition awaiting to pending state
        analysis, referred = await self.get_referred_analyses()
        if not referred and list(  # and has pending results then :)
                filter(lambda an: an.status in [states.result.PENDING], analysis)
        ):
            await self.change_status(states.sample.RECEIVED)

        return False

    async def verify(self, verified_by) -> tuple[bool, Self]:
        is_verifiable = await self.is_verifiable()
        if is_verifiable:
            self.status = states.sample.APPROVED
            self.verified_by_uid = verified_by.uid
            self.date_verified = datetime.now()
            self.updated_by_uid = verified_by.uid  # noqa
            saved = await self.save_async()
            await streamer.stream(saved, verified_by, "approved", "sample")
            return True, saved
        return False, self

    async def publish(self, published_by) -> Self:
        if self.status in [states.sample.APPROVED, states.sample.PUBLISHING]:
            self.status = states.sample.PUBLISHED
            self.published_by_uid = published_by.uid
            self.date_published = datetime.now()
            self.updated_by_uid = published_by.uid  # noqa
            return await self.save_async()
        return self

    async def print(self, printed_by) -> Self:
        if self.status == states.sample.PUBLISHED:
            self.printed = True
            self.printed_by_uid = printed_by.uid
            self.date_printed = datetime.now()
            self.updated_by_uid = printed_by.uid  # noqa
            return await self.save_async()
        return self

    async def invalidate(self, invalidated_by) -> tuple[Self, Self]:
        statuses = [states.sample.APPROVED, states.sample.PUBLISHED]
        copy = None
        if self.status in statuses:
            copy = await self.duplicate_unique(invalidated_by)
            self.status = states.sample.INVALIDATED
            self.invalidated_by_uid = invalidated_by.uid
            invalidated = await self.save_async()
            await streamer.stream(invalidated, invalidated_by, "invalidated", "sample")
            return copy, invalidated
        return copy, self

    async def reject(self, rejected_by) -> Self:
        statuses = [states.sample.RECEIVED, states.sample.EXPECTED]
        if self.status in statuses:
            self.status = states.sample.REJECTED
            self.received_by_uid = rejected_by.uid
            self.updated_by_uid = rejected_by.uid  # noqa
            rejected = await self.save_async()
            await streamer.stream(rejected, rejected_by, "rejected", "sample")
            return rejected
        return self

    async def store(self, stored_by) -> Self:
        statuses = [states.sample.RECEIVED]
        if self.status in statuses:
            self.status = states.sample.STORED
            self.stored_by = stored_by.uid
            self.updated_by_uid = stored_by.uid  # noqa
            stored = await self.save_async()
            await streamer.stream(stored, stored_by, "stored", "sample")
            return stored
        return self

    async def recover(self) -> Self:
        statuses = [states.sample.STORED]
        if self.status in statuses:
            self.status = states.sample.RECEIVED
            self.storage_container_uid = None
            self.storage_slot = None
            self.storage_slot_index = None
            self.date_retrieved_from_storage = datetime.now()
            recovered = await self.save_async()
            return recovered
        return self

    @classmethod
    async def create(cls, obj_in: dict | schemas.SampleCreate) -> Self:
        data = cls._import(obj_in)
        # sample_type = await SampleType.find(data["sample_type_uid"])
        # data["sample_id"] = (await IdSequence.get_next_number(sample_type.abbr))[1]
        data["sample_id"] = (
            await IdSequence.get_next_number(prefix="S", generic=True)
        )[1]
        return await super().create(**data)

    async def duplicate_unique(self, duplicator) -> Self:
        data = self.to_dict(nested=False)
        data["sample_id"] = self.copy_sample_id_unique()
        for key, _ in list(data.items()):
            if key not in self.copy_include_keys():
                del data[key]
        data["status"] = states.sample.RECEIVED
        data["profiles"] = self.profiles
        data["analyses"] = self.analyses
        data["parent_id"] = self.uid
        data["created_by_uid"] = duplicator.uid
        return await super().create(**data)

    async def clone_afresh(self, cloner) -> Self:
        data = self.to_dict(nested=False)
        for key, _ in list(data.items()):
            if key not in self.copy_include_keys():
                del data[key]
        data["status"] = states.sample.RECEIVED
        data["profiles"] = self.profiles
        data["analyses"] = self.analyses
        data["parent_id"] = self.uid
        data["created_by_uid"] = cloner.uid
        return await self.create(obj_in=data)