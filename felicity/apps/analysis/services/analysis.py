import asyncio
from datetime import datetime, timedelta

from domain.analysis.conf import SampleStates, ResultStates
from domain.analysis.ports import ARSampleIn, SampleRejectIn, SamplePublishIn
from domain.analysis.ports.repository.analysis import (
    ICodingStandardRepository,
    ISampleTypeRepository,
    ISampleTypeCodingRepository,
    IProfileRepository,
    IProfileCodingRepository,
    IAnalysisRepository,
    IAnalysisInterimRepository,
    IAnalysisCorrectionFactorRepository,
    IAnalysisDetectionLimitRepository,
    IAnalysisUncertaintyRepository,
    IAnalysisSpecificationRepository,
    IResultOptionRepository,
    IAnalysisRequestRepository,
)
from domain.analysis.ports.service.analysis import (
    ICodingStandardService,
    ISampleTypeService,
    ISampleTypeCodingService,
    IAnalysisCategoryService,
    IProfileService,
    IProfileCodingService,
    IAnalysisService,
    IAnalysisCodingService,
    IAnalysisInterimService,
    IAnalysisCorrectionFactorService,
    IAnalysisDetectionLimitService,
    IAnalysisUncertaintyService,
    IAnalysisSpecificationService,
    IResultOptionService,
    IAnalysisRequestService,
    IRejectionReasonService,
    ISampleService,
)
from domain.analysis.ports.service.result import IAnalysisResultService
from domain.analysis.schemas import (
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
    AnalysisResultCreate,
)
from domain.client.ports.service import IClientService
from domain.exceptions import *
from domain.idsequence.ports.service import IIdSequenceService
from domain.idsequence.utils import sequencer
from domain.instrument.ports.service import IMethodService
from domain.job.conf import JobActions, JobPriorities, JobStates, JobCategories
from domain.job.ports.service import IJobService
from domain.job.schemas import JobCreate
from domain.notification.ports.service import IActivityStreamService
from domain.patient.ports.service import IPatientService
from domain.reflex.ports.service import IReflexEngineService
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.user.schemas import User
from infrastructure.database.analysis.entities.analysis import (
    profile_sample_type,
    analysis_profile,
    analysis_sample_type,
    analysis_method,
    sample_profile,
    sample_analysis,
    sample_rejection_reason,
)


class CodingStandardService(BaseService[CodingStandard], ICodingStandardService):
    def __init__(self, repository: ICodingStandardRepository):
        self.repository = repository

    async def create(
        self, name: str, description: str | None, user: User
    ) -> CodingStandard:
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"Coding Standard: {name} already exists")

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = CodingStandardCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self, uid: str, name: str, description: str | None = ""
    ) -> CodingStandard:
        payload = locals()

        coding_standard = self.get(uid=uid)

        st_data = marshal(coding_standard)
        for field in st_data:
            if field in payload.__dict__:
                try:
                    setattr(coding_standard, field, payload.__dict__[field])
                except Exception as e:
                    pass

        coding_standard_in = CodingStandardUpdate(**marshal(coding_standard))
        return await super().update(coding_standard, **marshal(coding_standard_in))


class SampleTypeService(BaseService[SampleType], ISampleTypeService):
    def __init__(self, repository: ISampleTypeRepository):
        self.repository = repository

    async def create(
        self,
        name: str,
        abbr: str,
        description: str | None,
        internal_use: bool | None,
        active: bool | None,
        user: User,
    ) -> SampleType:
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"Sample Type: {name} already exists")

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = SampleTypeCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        name: str,
        abbr: str,
        description: str | None,
        internal_use: bool | None,
        active: bool | None,
    ) -> SampleType:
        payload = locals()

        sample_type = self.get(uid=uid)
        st_data = marshal(sample_type)
        for field in st_data:
            if field in payload.__dict__:
                try:
                    setattr(sample_type, field, payload.__dict__[field])
                except Exception as e:
                    pass

        sample_type_in = SampleTypeUpdate(**marshal(sample_type))
        return await super().update(sample_type, **marshal(sample_type_in))


class SampleTypeCodingService(BaseService[SampleTypeCoding], ISampleTypeCodingService):
    def __init__(self, repository: ISampleTypeCodingRepository):
        self.repository = repository

    async def create(
        self,
        sample_type_uid: str,
        coding_standard_uid: str,
        name: str,
        code: str,
        description: str | None,
        user: User,
    ) -> SampleTypeCoding:
        payload = locals()

        exists = await self.get(code=code)
        if exists:
            raise AlreadyExistsError(f"Mapping: {code} already exists")

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = SampleTypeCodingCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update_mapping(
        self,
        uid: str,
        sample_type_uid: str,
        coding_standard_uid: str,
        name: str,
        code: str,
        description: str | None,
    ) -> SampleTypeCoding:
        payload = locals()

        sample_type_mapping = await self.get(uid=uid)

        st_data = marshal(sample_type_mapping)
        for field in st_data:
            if field in payload.__dict__:
                try:
                    setattr(sample_type_mapping, field, payload.__dict__[field])
                except Exception as e:
                    pass

        sample_type_mapping_in = SampleTypeCodingUpdate(**marshal(sample_type_mapping))
        return await super().update(
            sample_type_mapping, **marshal(sample_type_mapping_in)
        )


class AnalysisCategoryService(BaseService[AnalysisCategory], IAnalysisCategoryService):
    async def create(
        self,
        name: str,
        department_uid: str | None,
        description: str | None,
        active: bool | None,
        user: User,
    ) -> AnalysisCategory:
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(
                f"AnalysisCategory named {name} already exists. Change the name for the category to something else",
            )

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = AnalysisCategoryCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        name: str,
        department_uid: str | None,
        description: str | None,
        active: bool | None,
    ) -> AnalysisCategory:  # noqa
        payload = locals()
        analysis_category = await self.get(uid=uid)

        ac_data = marshal(analysis_category)
        for field in ac_data:
            if field in payload.__dict__:
                try:
                    setattr(analysis_category, field, payload.__dict__[field])
                except AttributeError as e:
                    pass

        profile_in = AnalysisCategoryUpdate(**analysis_category.to_dict())
        return await super().update(analysis_category, **marshal(profile_in))


class ProfileService(BaseService[Profile], IProfileService):
    def __init__(
        self,
        repository: IProfileRepository,
        analysis_service: IAnalysisService,
        sample_type_service: ISampleTypeService,
    ):
        self.repository = repository
        self.analysis_service = analysis_service
        self.sample_type_service = sample_type_service

    async def create(
        self,
        name: str,
        description: str,
        department_uid: str | None,
        sample_types: list[str] | None,
        services: list[str] | None,
        keyword: str | None,
        active: bool | None,
        user: User,
    ) -> Profile:
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(
                f"A Profile named {name} already exists. Change profile title to something else",
            )

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            if k not in ["sample_types", "services"]:
                incoming[k] = v

        obj_in = ProfileCreate(**incoming)
        profile = await super().create(**marshal(obj_in))

        if sample_types:
            for _st_uid in sample_types:
                await self.repository.table_insert(
                    table=profile_sample_type,
                    mappings={"sample_type_uid": _st_uid, "profile_uid": profile.uid},
                )

        if services:
            for service_uid in services:
                await self.repository.table_insert(
                    table=analysis_profile,
                    mappings={"analysis_uid": service_uid, "profile_uid": profile.uid},
                )

        return await self.get(uid=profile.uid)

    async def update(
        self,
        uid: str,
        name: str,
        description: str,
        department_uid: str | None,
        sample_types: list[str] | None,
        services: list[str] | None,
        keyword: str | None,
        active: bool | None,
    ) -> Profile:
        payload = locals()

        profile = await self.get(uid=uid)

        profile_data = marshal(profile)
        for field in profile_data:
            if field in payload.__dict__:
                try:
                    setattr(profile, field, payload.__dict__[field])
                except AttributeError as e:
                    pass

        profile_in = ProfileUpdate(**marshal(profile))
        profile = await super().update(profile, **marshal(profile_in))

        # Analyses management
        if services:
            profile.analyses.clear()
            profile = await super().update(profile, **marshal(profile))
            for _uid in services:
                anal = await self.analysis_service.get(uid=_uid)
                await self.repository.table_insert(
                    table=analysis_profile,
                    mappings={"analysis_uid": anal.uid, "profile_uid": profile.uid},
                )

        # Sample Type management
        if sample_types:
            profile.sample_types.clear()
            profile = await super().update(profile, **marshal(profile))
            for _uid in sample_types:
                st = await self.sample_type_service.get(uid=_uid)
                profile.sample_types.append(st)
                await self.repository.table_insert(
                    table=profile_sample_type,
                    mappings={"sample_type_uid": st.uid, "profile_uid": profile.uid},
                )

        return await self.get(uid=profile.uid)

    async def update_tat(self, profile: Profile) -> Profile:
        tats = []
        tat = None
        for anal in profile.analyses:
            tats.append(anal.tat_length_minutes)

        if len(tats) > 0:
            tat = sorted(tats, reverse=False)[0]

        if tat:
            profile.tat_length_minutes = tat
            return await super().update(profile, **marshal(profile))
        return profile


class ProfileCodingService(BaseService[ProfileCoding], IProfileCodingService):
    def __int__(self, repository: IProfileCodingRepository):
        self.repository = repository

    async def create(
        self,
        profile_uid: str,
        coding_standard_uid: str,
        name: str,
        code: str,
        description: str | None,
        user: User,
    ) -> ProfileCoding:
        payload = locals()

        exists = await self.get(code=code)
        if exists:
            raise AlreadyExistsError(f"Mapping: {code} already exists")

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = ProfileCodingCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        profile_uid: str,
        coding_standard_uid: str,
        name: str,
        code: str,
        description: str | None,
    ) -> ProfileCoding:
        payload = locals()

        profile_mapping = await self.get(uid=uid)
        st_data = profile_mapping.to_dict()
        for field in st_data:
            if field in payload.__dict__:
                try:
                    setattr(profile_mapping, field, payload.__dict__[field])
                except Exception as e:
                    pass

        profile_mapping_in = ProfileCodingUpdate(**marshal(profile_mapping))
        return await super().update(profile_mapping, **marshal(profile_mapping_in))


class AnalysisService(BaseService[Analysis], IAnalysisService):
    def __init__(
        self,
        repository: IAnalysisRepository,
        sample_type_service: ISampleTypeService,
        method_service: IMethodService,
    ):
        self.repository = repository
        self.sample_type_service = sample_type_service
        self.method_service = method_service

    async def create(
        self,
        name: str,
        keyword: str,
        sort_key: int,
        description: str,
        department_uid: str | None,
        sample_types: list[str] | None,
        methods: list[str] | None,
        category_uid: str | None,
        unit_uid: str | None,
        internal_use: bool | None,
        tat_length_minutes: int,
        precision: int,
        required_verifications: int,
        self_verification: bool | None,
        active: bool | None,
        user: User,
    ) -> Analysis:
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"A analysis named {name} already exists")

        exists = await self.get(keyword=keyword)
        if exists:
            raise AlreadyExistsError(f"Analysis Keyword {keyword} is not unique")

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            if k not in ["sample_types"]:
                incoming[k] = v

        obj_in = AnalysisCreate(**incoming)
        analysis = await super().create(**marshal(obj_in))

        if sample_types:
            for st_uid in sample_types:
                await self.repository.table_insert(
                    table=analysis_sample_type,
                    mappings={"sample_type_uid": st_uid, "analysis_uid": analysis.uid},
                )

        if methods:
            for m_uid in methods:
                await self.repository.table_insert(
                    table=analysis_method,
                    mappings={"method_uid": m_uid, "analysis_uid": analysis.uid},
                )

        analysis = await self.get(uid=analysis.uid)

        return analysis

    async def update(
        self,
        uid: str,
        name: str,
        keyword: str,
        sort_key: int,
        description: str,
        department_uid: str | None,
        sample_types: list[str] | None,
        methods: list[str] | None,
        category_uid: str | None,
        unit_uid: str | None,
        internal_use: bool | None,
        tat_length_minutes: int,
        precision: int,
        required_verifications: int,
        self_verification: bool | None,
        active: bool | None,
    ) -> Analysis:
        payload = locals()
        analysis = await self.get(uid=uid)

        analysis_data = marshal(analysis)
        for field in analysis_data:
            if field in payload.__dict__:
                try:
                    setattr(analysis, field, payload.__dict__[field])
                except AttributeError as e:
                    pass

        analysis_in = AnalysisUpdate(**marshal(analysis))
        analysis = await super().update(analysis, **marshal(analysis_in))

        if sample_types:
            analysis.sample_types.clear()
            analysis = await super().update(analysis, **marshal(analysis))
            for _uid in sample_types:
                stype = await self.sample_type_service.get(uid=_uid)
                analysis.sample_types.append(stype)
            analysis = await super().update(analysis, **marshal(analysis))

        if methods:
            analysis.methods.clear()
            analysis = await super().update(analysis, **marshal(analysis))
            for _uid in methods:
                meth = await self.method_service.get(uid=_uid)
                await self.repository.table_insert(
                    table=analysis_method,
                    mappings={"method_uid": meth.uid, "analysis_uid": analysis.uid},
                )
            analysis = await analysis.get(uid=analysis.uid)

        return analysis


class AnalysisCodingService(BaseService[AnalysisCoding], IAnalysisCodingService):
    async def create(
        self,
        analysis_uid: str,
        coding_standard_uid: str,
        name: str,
        code: str,
        description: str | None,
        user: User,
    ) -> AnalysisCoding:
        payload = locals()

        exists = await self.get(code=code)
        if exists:
            raise AlreadyExistsError(f"Mapping: {code} already exists")

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = AnalysisCodingCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        analysis_uid: str,
        coding_standard_uid: str,
        name: str,
        code: str,
        description: str | None,
    ) -> AnalysisCoding:
        payload = locals()
        analysis_mapping = await self.get(uid=uid)
        st_data = marshal(analysis_mapping)
        for field in st_data:
            if field in payload.__dict__:
                try:
                    setattr(analysis_mapping, field, payload.__dict__[field])
                except Exception as e:
                    pass

        analysis_mapping_in = AnalysisCodingUpdate(**marshal(analysis_mapping))
        return await super().update(analysis_mapping, **marshal(analysis_mapping_in))


class AnalysisInterimService(BaseService[AnalysisInterim], IAnalysisInterimService):
    def __init__(self, repository: IAnalysisInterimRepository):
        self.repository = repository

    async def create(
        self, key: int, value: str, analysis_uid: str, instrument_uid: str, user: User
    ) -> AnalysisInterim:
        payload = locals()

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = AnalysisInterimCreate(**incoming)

        return await super().create(**marshal(obj_in))

    async def update(
        self, uid: str, key: int, value: str, analysis_uid: str, instrument_uid: str
    ) -> AnalysisInterim:
        payload = locals()

        interim = await self.get(uid=uid)

        interim_data = marshal(interim)
        for field in interim_data:
            if field in payload.__dict__:
                try:
                    setattr(interim, field, payload.__dict__[field])
                except AttributeError as e:
                    pass

        analysis_in = AnalysisInterimUpdate(**marshal(interim))
        return await super().update(interim, **marshal(analysis_in))


class AnalysisCorrectionFactorService(
    BaseService[AnalysisCorrectionFactor], IAnalysisCorrectionFactorService
):
    def __init__(self, repository: IAnalysisCorrectionFactorRepository):
        self.repository = repository

    async def create(
        self,
        factor: float,
        analysis_uid: str,
        instrument_uid: str,
        method_uid: str,
        user: User,
    ) -> AnalysisCorrectionFactor:
        payload = locals()

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = AnalysisCorrectionFactorCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update_analysis_correction_factor(
        self,
        uid: str,
        factor: float,
        analysis_uid: str,
        instrument_uid: str,
        method_uid: str,
    ) -> AnalysisCorrectionFactor:
        payload = locals()

        correction_factor = await self.get(uid=uid)

        correction_factor_data = marshal(correction_factor)
        for field in correction_factor_data:
            if field in payload.__dict__:
                try:
                    setattr(correction_factor, field, payload.__dict__[field])
                except AttributeError as e:
                    pass

        analysis_in = AnalysisCorrectionFactorUpdate(**marshal(correction_factor))
        return await super().update(correction_factor, **marshal(analysis_in))


class AnalysisDetectionLimitService(
    BaseService[AnalysisDetectionLimit], IAnalysisDetectionLimitService
):
    def __init__(self, repository: IAnalysisDetectionLimitRepository):
        self.repository = repository

    async def create(
        self,
        lower_limit: float,
        upper_limit: float,
        analysis_uid: str,
        instrument_uid: str,
        method_uid: str,
        user: User,
    ) -> AnalysisDetectionLimit:
        payload = locals()
        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = AnalysisDetectionLimitCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        lower_limit: float,
        upper_limit: float,
        analysis_uid: str,
        instrument_uid: str,
        method_uid: str,
    ) -> AnalysisDetectionLimit:
        payload = locals()

        detection_limit = await self.get(uid=uid)
        detection_limit_data = marshal(detection_limit)
        for field in detection_limit_data:
            if field in payload.__dict__:
                try:
                    setattr(detection_limit, field, payload.__dict__[field])
                except AttributeError as e:
                    pass

        analysis_in = AnalysisDetectionLimitUpdate(**marshal(detection_limit))
        return await super().update(detection_limit, **marshal(analysis_in))


class AnalysisUncertaintyService(
    BaseService[AnalysisUncertainty], IAnalysisUncertaintyService
):
    def __init__(self, repository: IAnalysisUncertaintyRepository):
        self.repository = repository

    async def create(
        self,
        min: float,
        max: float,
        value: float,
        analysis_uid: str,
        instrument_uid: str,
        method_uid: str,
        user: User,
    ) -> AnalysisUncertainty:
        payload = locals()

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = AnalysisUncertaintyCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        min: float,
        max: float,
        value: float,
        analysis_uid: str,
        instrument_uid: str,
        method_uid: str,
    ) -> AnalysisUncertainty:
        payload = locals()

        uncertainty = await self.get(uid=uid)

        uncertainty_data = uncertainty.to_dict()
        for field in uncertainty_data:
            if field in payload.__dict__:
                try:
                    setattr(uncertainty, field, payload.__dict__[field])
                except AttributeError as e:
                    pass

        analysis_in = AnalysisUncertaintyUpdate(**marshal(uncertainty))
        return await super().update(uncertainty, **marshal(analysis_in))


class AnalysisSpecificationService(
    BaseService[AnalysisSpecification], IAnalysisSpecificationService
):
    def __init__(self, repository: IAnalysisSpecificationRepository):
        self.repository = repository

    async def create(
        self,
        analysis_uid: str,
        min: float | None,
        max: float | None,
        min_warn: float | None,
        max_warn: float | None,
        min_report: str | None,
        max_report: str | None,
        warn_values: str | None,
        warn_report: str | None,
        gender: str | None,
        age_min: int | None,
        age_max: int | None,
        method_uid: str | None,
        unit_uid: str | None,
        user: User,
    ) -> AnalysisSpecification:

        payload = locals()

        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = AnalysisSpecificationCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        analysis_uid: str,
        min: float | None,
        max: float | None,
        min_warn: float | None,
        max_warn: float | None,
        min_report: str | None,
        max_report: str | None,
        warn_values: str | None,
        warn_report: str | None,
        gender: str | None,
        age_min: int | None,
        age_max: int | None,
        method_uid: str | None,
        unit_uid: str | None,
    ) -> AnalysisSpecification:
        payload = locals()

        specification = await self.get(uid=uid)

        specification_data = marshal(specification)
        for field in specification_data:
            if field in payload.__dict__:
                try:
                    setattr(specification, field, payload.__dict__[field])
                except AttributeError as e:
                    pass

        analysis_in = AnalysisSpecificationUpdate(**marshal(specification))
        return await super().update(specification, **marshal(analysis_in))


class ResultOptionService(BaseService[ResultOption], IResultOptionService):
    def __init__(self, repository: IResultOptionRepository):
        self.repository = repository

    async def create(
        self, analysis_uid: str, option_key: int, value: str, user: User
    ) -> ResultOption:
        payload = locals()
        incoming = {
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = ResultOptionCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        analysis_uid: str,
        option_key: int,
        value: str,
    ) -> ResultOption:
        payload = locals()

        result_option = await self.get(uid=uid)

        ro_data = marshal(result_option)
        for field in ro_data:
            if field in payload.__dict__:
                try:
                    setattr(result_option, field, payload.__dict__[field])
                except Exception as e:
                    pass

        result_option_in = ResultOptionUpdate(**marshal(result_option))
        return await result_option.update(result_option, **marshal(result_option_in))


class AnalysisRequestService(BaseService[AnalysisRequest], IAnalysisRequestService):
    def __init__(
        self,
        repository: IAnalysisRequestRepository,
        patient_service: IPatientService,
        profile_service: IProfileService,
        analysis_service: IAnalysisService,
        client_service: IClientService,
        sample_type_service: ISampleTypeService,
        sample_service: ISampleService,
        analysis_result_service: IAnalysisResultService,
        reflex_engine_service: IReflexEngineService,
    ):
        self.repository = repository
        self.patient_service = patient_service
        self.profile_service = profile_service
        self.analysis_service = analysis_service
        self.client_service = client_service
        self.sample_type_service = sample_type_service
        self.sample_service = sample_service
        self.analysis_result_service = analysis_result_service
        self.reflex_engine_service = reflex_engine_service

    async def create(
        self,
        patient_uid: str,
        client_uid: str,
        client_contact_uid: str,
        clinical_data: str | None,
        samples: list[ARSampleIn],
        client_request_id: str | None,
        internal_use: bool | None,
        priority: int,
        user: User,
    ) -> AnalysisRequest:
        payload = locals()

        # are samples valid
        for _s in samples:
            _valid = [len(_s.get("profiles", [])) > 0, len(_s.get("analyses", [])) > 0]
            if not any(_valid):
                raise ValidationError(
                    f"Samples must have either analysis or profiles or both"
                )

        patient = await self.patient_service.get(uid=patient_uid)
        client = await self.client_service.get(uid=client_uid)

        if len(samples) == 0:
            raise GenericError(f"Samples are required")

        # create the ar
        incoming = {
            "patient_uid": patient.uid,
            "client_uid": client.uid,
            "request_id": None,
            "client_request_id": client_request_id,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        obj_in = AnalysisRequestCreate(**incoming)
        analysis_request = await super().create(**marshal(obj_in))

        # 1. create samples
        for s in samples:
            _st_uid = s.get("sample_type")
            stype = await self.sample_type_service.get(uid=_st_uid)

            sample_in = {
                "created_by_uid": user.uid,
                "updated_by_uid": user.uid,
                "analysis_request_uid": analysis_request.uid,
                "sample_type_uid": stype.uid,
                "sample_id": None,
                "priority": priority,
                "status": SampleStates.EXPECTED,
            }

            profiles = []
            analyses = []
            _profiles_analyses = set()

            for p_uid in s.get("profiles"):
                profile = await self.profile_service.get_related(
                    related=["analyses"], uid=p_uid
                )
                profiles.append(profile)
                analyses_ = profile.analyses
                for _an in analyses_:
                    _profiles_analyses.add(_an)

            # make sure the selected analyses are not part of the selected profiles
            for a_uid in s.get("analyses"):
                analysis = await self.analysis_service.get(uid=a_uid)
                if analysis not in _profiles_analyses:
                    analyses.append(analysis)
                    _profiles_analyses.add(analysis)

            # determine sample due date
            tat_lengths = []
            for anal in _profiles_analyses:
                if anal.tat_length_minutes:
                    tat_lengths.append(anal.tat_length_minutes)
            if tat_lengths:
                minutes = max(tat_lengths)
                sample_in["due_date"] = datetime.now() + timedelta(minutes=minutes)

            #
            sample_schema = SampleCreate(**sample_in)
            sample = await self.sample_service.create(**marshal(sample_schema))

            # auto receive samples
            # ?? sample_workflow based check needed
            await self.sample_service._receive(sample, received_by=user)

            # link sample to provided profiles
            for _prof in profiles:
                await self.repository.table_insert(
                    table=sample_profile,
                    mappings={"sample_uid": sample.uid, "profile_uid": _prof.uid},
                )

            # link sample to provided services
            for _anal in analyses:
                await self.repository.table_insert(
                    table=sample_analysis,
                    mappings={"sample_uid": sample.uid, "analysis_uid": _anal.uid},
                )

            # create and attach result objects for each Analyses

            a_result_schema = AnalysisResultCreate(
                sample_uid=sample.uid,
                status=ResultStates.PENDING,
                analysis_uid=None,
                due_date=None,
                created_by_uid=user.uid,
                updated_by_uid=user.uid,
            )
            result_schemas = []
            for _service in _profiles_analyses:
                result_schemas.append(
                    a_result_schema.model_copy(
                        update={
                            "analysis_uid": _service.uid,
                            "due_date": datetime.now()
                            + timedelta(minutes=_service.tat_length_minutes)
                            if _service.tat_length_minutes
                            else None,
                        }
                    )
                )
            created = await self.analysis_result_service.bulk_create(
                [marshal(rs) for rs in result_schemas]
            )

            # initialise reflex action if exist
            await self.reflex_engine_service.set_reflex_actions(created)

        # ! paramount !
        await asyncio.sleep(1)

        return await self.get_related(uid=analysis_request.uid, related=["samples"])


class RejectionReasonService(BaseService[RejectionReason], IRejectionReasonService):
    def __init__(self, repository: IResultOptionRepository):
        self.repository = repository

    async def create(self, reason: str, user: User) -> RejectionReason:
        exists = await self.get(reason=reason)
        if exists:
            raise AlreadyExistsError(
                f"The Rejection reason -> {reason} <- already exists"
            )

        incoming = {
            "reason": reason,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        obj_in = RejectionReasonCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(self, uid: str, reason: str) -> RejectionReason:
        rejection_reason = await self.get(uid=uid)

        try:
            setattr(rejection_reason, "reason", reason)
        except AttributeError as e:
            pass

        rr_in = RejectionReasonUpdate(**marshal(rejection_reason))
        return await super().update(rejection_reason, **marshal(rr_in))


class SampleService(BaseService[Sample], ISampleService):
    def __init__(
        self,
        repository: IResultOptionRepository,
        analysis_result_service: IAnalysisResultService,
        activity_stream_service: IActivityStreamService,
        id_sequence_service: IIdSequenceService,
        reflex_engine_service: IReflexEngineService,
        rejection_reason_service: IRejectionReasonService,
        job_service: IJobService,
        sample_type_service: ISampleTypeService,
    ):
        self.repository = repository
        self.analysis_result_service = analysis_result_service
        self.activity_stream_service = activity_stream_service
        self.id_sequence_service = id_sequence_service
        self.reflex_engine_service = reflex_engine_service
        self.rejection_reason_service = rejection_reason_service
        self.job_service = job_service

    @staticmethod
    def copy_include_keys():
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

    async def get_qc_sample_type(self):
        st = await self.sample_type_service.get(name="QC Sample")
        if not st:
            st_in = SampleTypeCreate(
                name="QC Sample", description="QC Sample", abbr="QCS"
            )
            st = await self.sample_type_service.create(**marshal(st_in))
        return st

    async def update_due_date(self, sample: Sample, reset: bool = False):
        tats: list[int] = []
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
            sample.due_date = start + timedelta(minutes=length)
            return await super().update(sample, **marshal(sample))
        return sample

    async def change_status(self, sample: Sample, status, updated_by_uid=None):
        sample.status = status
        if updated_by_uid:
            sample.updated_by_uid = updated_by_uid  # noqa
        await super().update(sample, **marshal(sample))

    async def extend_due_date(self, sample: Sample, ext_minutes: int):
        sample.due_date += timedelta(minutes=ext_minutes)
        return await super().update(sample, **marshal(sample))

    @staticmethod
    def copy_sample_id_unique(sample: Sample):
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

    async def get_referred_analyses(self, sample: Sample):
        analysis = await self.analysis_result_service.get_all(sample_uid=sample.uid)
        return analysis, list(
            filter(lambda a: a.status == ResultStates.REFERRED, analysis)
        )

    async def has_fully_referred_analyses(self, sample: Sample):
        analysis, referred = await self.get_referred_analyses(sample)
        return len(analysis) == len(referred)

    async def has_no_referred_analyses(self, sample: Sample):
        analysis, referred = await self.get_referred_analyses(sample)
        return len(referred) == 0

    async def has_partly_referred_analyses(self, sample: Sample):
        analysis, referred = await self.get_referred_analyses(sample)
        return len(analysis) != len(referred) and len(referred) > 0

    async def submit(self, sample: Sample, submitted_by):
        statuses = [
            ResultStates.RESULTED,
            ResultStates.RETRACTED,
            ResultStates.APPROVED,
            ResultStates.CANCELLED,
        ]
        analysis_results = await self.analysis_result_service.get_all(
            sample_uid=sample.uid
        )
        match = all([(sibling.status in statuses) for sibling in analysis_results])
        if match and sample.status in [SampleStates.RECEIVED]:
            sample.status = SampleStates.AWAITING
            sample.submitted_by_uid = submitted_by.uid
            sample.date_submitted = datetime.now()
            sample.updated_by_uid = submitted_by.uid  # noqa
            saved = await super().update(sample, **marshal(sample))
            await self.activity_stream_service.stream(
                saved, submitted_by, "submitted", "sample"
            )
            return saved
        return self

    async def un_submit(self, sample: Sample):
        if sample.status == SampleStates.AWAITING:
            sample.status = SampleStates.RECEIVED
            sample.submitted_by_uid = None
            sample.date_submitted = None
            sample.updated_by_uid = None  # noqa
            return await super().update(sample, **marshal(sample))
        return sample

    async def assign(self, sample: Sample):
        sample.assigned = True
        return await super().update(sample, **marshal(sample))

    async def un_assign(self, sample: Sample):
        sample.assigned = False
        return await super().update(sample, **marshal(sample))

    async def is_verifiable(self, sample: Sample):
        statuses = [
            ResultStates.APPROVED,
            ResultStates.RETRACTED,
            ResultStates.CANCELLED,
        ]
        analysis_results = await self.analysis_result_service.get_all(
            sample_uid=sample.uid
        )
        match = all([(sibling.status in statuses) for sibling in analysis_results])
        if match and self.status in [SampleStates.AWAITING, SampleStates.PAIRED]:
            return True

        # if there are no results in referred state but some are in pending state. transition awaiting to pending state
        analysis, referred = await self.get_referred_analyses(sample)
        if not referred and not list(
            filter(lambda an: an.status in [ResultStates.PENDING], analysis)
        ):
            await self.change_status(sample, SampleStates.RECEIVED)

        return False

    async def store(self, sample: Sample, stored_by):
        statuses = [SampleStates.RECEIVED]
        if sample.status in statuses:
            sample.status = SampleStates.STORED
            sample.stored_by = stored_by.uid
            sample.updated_by_uid = stored_by.uid  # noqa
            stored = await super().update(sample, **marshal(sample))
            await self.activity_stream_service.stream(
                stored, stored_by, "stored", "sample"
            )
            return stored
        return sample

    async def recover(self, sample: Sample):
        statuses = [SampleStates.STORED]
        if sample.status in statuses:
            sample.status = SampleStates.RECEIVED
            sample.storage_container_uid = None
            sample.storage_slot = None
            sample.storage_slot_index = None
            sample.date_retrieved_from_storage = datetime.now()
            recovered = await super().update(sample, **marshal(sample))
            return recovered
        return sample

    async def create(self, **kwargs) -> Sample:
        # sample_type = await SampleType.find(kwargs["sample_type_uid"])
        # data["sample_id"] = (await IdSequence.get_next_number(sample_type.abbr))[1]
        kwargs["sample_id"] = (
            await self.id_sequence_service.get_next_number(prefix="S", generic=True)
        )[1]
        return await super().create(**kwargs)

    async def duplicate_unique(self, sample: Sample, duplicator) -> Sample:
        data = marshal(sample)
        data["sample_id"] = self.copy_sample_id_unique(sample)
        for key, _ in list(data.items()):
            if key not in self.copy_include_keys():
                del data[key]
        data["status"] = SampleStates.RECEIVED
        data["profiles"] = sample.profiles
        data["analyses"] = sample.analyses
        data["parent_id"] = sample.uid
        data["created_by_uid"] = duplicator.uid
        return await super().create(**data)

    async def clone_afresh(self, sample: Sample, cloner) -> Sample:
        data = marshal(sample)
        for key, _ in list(data.items()):
            if key not in self.copy_include_keys():
                del data[key]
        data["status"] = SampleStates.RECEIVED
        data["profiles"] = sample.profiles
        data["analyses"] = sample.analyses
        data["parent_id"] = sample.uid
        data["created_by_uid"] = cloner.uid
        return await self.create(**data)

    async def clone(self, samples: list[str], user: User) -> list[Sample]:
        clones = []
        to_clone = await self.sample_service.get_by_uids(uids=samples)
        for _, _sample in enumerate(to_clone):
            clone = await self.clone_afresh(_sample, user)

            if clone:
                clones.append(clone)

                # create associated analysis
                _profiles_analyses = set()

                for _prof in clone.profiles:
                    analyses_ = _prof.analyses
                    for _an in analyses_:
                        _profiles_analyses.add(_an)

                for _anal in clone.analyses:
                    if _anal not in _profiles_analyses:
                        _profiles_analyses.add(_anal)

                for _service in _profiles_analyses:
                    a_result_in = {
                        "sample_uid": clone.uid,
                        "analysis_uid": _service.uid,
                        "status": ResultStates.PENDING,
                    }
                    a_result_schema = AnalysisResultCreate(**a_result_in)
                    created = await self.analysis_result_service.create(
                        **marshal(a_result_schema)
                    )
                    await self.reflex_engine_service.set_reflex_actions([created])

        return clones

    async def _cancel(self, sample: Sample, cancelled_by):
        analysis_results = await self.analysis_result_service.get_all(
            sample_uid=sample.uid
        )
        if sample.status in [SampleStates.RECEIVED, SampleStates.EXPECTED]:
            for result in analysis_results:
                await self.analysis_result_serviceresult.cancel(
                    result, cancelled_by=cancelled_by
                )
            sample.status = SampleStates.CANCELLED
            sample.cancelled_by_uid = cancelled_by.uid
            sample.date_cancelled = datetime.now()
            sample.updated_by_uid = cancelled_by.uid  # noqa
            return await super().update(sample, **marshal(sample))
        return None

    async def cancel(self, samples: list[str], user: User) -> list[Sample]:
        return_samples = []

        for _sa_uid in samples:
            sample = await self.get(uid=_sa_uid)

            # only samples with unassigned analyses can be cancelled
            analysis_results = await self.analysis_result_service.get_all(
                sample_uid=sample.uid
            )
            match = [result.assigned for result in analysis_results]
            if any(match):
                return_samples.append(sample)
                continue

            sample = await self._cancel(sample, cancelled_by=user)
            if sample:
                return_samples.append(sample)

        return return_samples

    async def _re_instate(self, sample: Sample, re_instated_by):
        analysis_results = await self.analysis_result_service.get_all(
            sample_uid=sample.uid
        )
        if sample.status in [SampleStates.CANCELLED]:
            # A better way is to go to audit log and retrieve previous state
            # rather than transitioning all to RECEIVED
            sample.status = SampleStates.RECEIVED
            sample.cancelled_by_uid = None
            sample.date_cancelled = None
            sample.updated_by_uid = re_instated_by.uid  # noqa
            sample = await super().update(sample, **marshal(sample))
            for result in analysis_results:
                await result.re_instate(sample, re_instated_by=re_instated_by)
        return sample

    async def re_instate(self, samples: list[str], user: User) -> list[Sample]:
        return_samples = []

        for _sa_uid in samples:
            sample = await self.get(uid=_sa_uid)

            sample = await self._re_instate(sample, re_instated_by=user)
            if sample:
                return_samples.append(sample)

        return return_samples

    async def _receive(self, sample: Sample, received_by):
        if sample.status in [SampleStates.EXPECTED]:
            sample.status = SampleStates.RECEIVED
            sample.received_by_uid = received_by.uid
            sample.date_received = datetime.now()
            sample.updated_by_uid = received_by.uid  # noqa
            return await super().update(sample, **marshal(sample))
        return None

    async def receive(self, samples: list[str], user: User) -> list[Sample]:

        return_samples = []

        for _sa_uid in samples:
            sample = await self.get(uid=_sa_uid)

            sample = await sample.receive(received_by=user)
            if sample:
                return_samples.append(sample)

        return return_samples

    async def check_verification(
        self, samples: list[str | Sample], verifer: User
    ) -> tuple[list[Sample] | None, list[Sample] | None, str, str]:
        """
        splits samples into allowed and restricted samples.
        allowed samples are those that the user is allowed to verify.
        if restricted samples are found, the user will be provided with extra messages and suggestions
        """
        message: str = ""
        suggestion: str = ""

        if isinstance(samples[0], int):
            samples = await self.get_all(uid__in=samples)

        restricted = list(filter(lambda s: s.submitted_by_uid == verifer.uid, samples))
        allowed = list(filter(lambda s: s.submitted_by_uid != verifer.uid, samples))

        _sample_ids = [r.sample_id for r in restricted] if restricted else []
        if _sample_ids:
            message = f"Self verification is not allowed for sample(s): {', '.join(_sample_ids)}."
            suggestion = "The person verifying samples must be different from the one who submitted them."

        return allowed, restricted, message, suggestion

    async def _verify(self, sample: Sample, verified_by):
        is_verifiable = await self.is_verifiable(sample)
        if is_verifiable:
            sample.status = SampleStates.APPROVED
            sample.verified_by_uid = verified_by.uid
            sample.date_verified = datetime.now()
            sample.updated_by_uid = verified_by.uid  # noqa
            saved = await super().update(sample, **marshal(sample))
            await self.activity_stream_service.stream(
                saved, verified_by, "approved", "sample"
            )
            return True, saved
        return False, sample

    async def verify(self, samples: list[str], user: User) -> list[Sample]:
        return_samples = []

        for _sa_uid in samples:
            sample = await self.get(uid=_sa_uid)

            success, sample = await self._verify(sample, verified_by=user)
            if sample:
                return_samples.append(sample)

        return return_samples

    async def _reject(self, sample: Sample, rejected_by):
        statuses = [SampleStates.RECEIVED, SampleStates.EXPECTED]
        if sample.status in statuses:
            sample.status = SampleStates.REJECTED
            sample.received_by_uid = rejected_by.uid
            sample.updated_by_uid = rejected_by.uid  # noqa
            rejected = await super().update(sample, **marshal(sample))
            await self.activity_stream_service.stream(
                rejected, rejected_by, "rejected", "sample"
            )
            return rejected
        return sample

    async def reject(self, samples: list[SampleRejectIn], user: User) -> list[Sample]:

        return_samples = []

        for _sam in samples:
            sample = await self.get(uid=_sam.get("uid"))

            for re_uid in _sam.get("reasons"):
                reason = await self.rejection_reason_service.get(uid=re_uid)

                sample = await self._reject(sample, rejected_by=user)
                await self.repository.table_insert(
                    sample_rejection_reason,
                    {"sample_uid": sample.uid, "rejection_reason_uid": reason.uid},
                )

                if sample:
                    return_samples.append(sample)

                    if sample.status == SampleStates.REJECTED:
                        for analyte in sample.analysis_results:
                            await self.analysis_result_service.cancel(
                                analyte, cancelled_by=user
                            )

        return return_samples

    async def _publish(self, sample: Sample, published_by):
        if sample.status in [SampleStates.APPROVED, SampleStates.PUBLISHING]:
            sample.status = SampleStates.PUBLISHED
            sample.published_by_uid = published_by.uid
            sample.date_published = datetime.now()
            sample.updated_by_uid = published_by.uid  # noqa
            return await super().update(sample, **marshal(sample))
        return sample

    async def publish(self, samples: list[SamplePublishIn], user: User) -> str:

        # set status of these samples to PUBLISHING for those whose action is "publish" !important
        final_publish = list(filter(lambda p: p.action == "publish", samples))
        not_final = list(filter(lambda p: p.action != "publish", samples))
        await self.bulk_update_with_mappings(
            [
                {"uid": sample.uid, "status": SampleStates.PUBLISHING}
                for sample in final_publish
            ]
        )

        data = [{"uid": s.get("uid"), "action": s.get("action")} for s in samples]
        job_schema = JobCreate(
            action=JobActions.IMPRESS_REPORT,
            category=JobCategories.IMPRESS,
            priority=JobPriorities.NORMAL,
            job_id="0",
            status=JobStates.PENDING,
            creator_uid=user.uid,
            data=data,
        )

        await self.job_service.create(**marshal(job_schema))

        # !important for frontend
        # unfreeze frontend and return sample to original state since it is a non final publish
        ns_samples = await self.get_by_uids([nf.uid for nf in not_final])
        for sample in ns_samples:
            await self.activity_stream_service.stream(
                sample, user, sample.status, "sample"
            )

        return "Your results are being published in the background."

    async def _print(self, sample: Sample, printed_by):
        if sample.status == SampleStates.PUBLISHED:
            sample.printed = True
            sample.printed_by_uid = printed_by.uid
            sample.date_printed = datetime.now()
            sample.updated_by_uid = printed_by.uid  # noqa
            return await super().update(sample, **marshal(sample))
        return sample

    async def print(self, samples: list[str], user: User) -> list[Sample]:
        return_samples = []

        for _sa_uid in samples:
            sample = await self.get(uid=_sa_uid)
            sample = await self._print(sample, printed_by=user)
            if sample:
                return_samples.append(sample)

        return return_samples

    async def _invalidate(
        self, sample: Sample, invalidated_by
    ) -> tuple[Sample | None, Sample]:
        statuses = [SampleStates.APPROVED, SampleStates.PUBLISHED]
        copy = None
        if sample.status in statuses:
            copy = await self.duplicate_unique(sample, invalidated_by)
            sample.status = SampleStates.INVALIDATED
            sample.invalidated_by_uid = invalidated_by.uid
            invalidated = await super().update(sample, **marshal(sample))
            await self.activity_stream_service.stream(
                invalidated, invalidated_by, "invalidated", "sample"
            )
            return copy, invalidated
        return copy, sample

    async def invalidate(self, samples: list[str], user: User) -> list[Sample]:
        return_samples = []

        for _sa_uid in samples:
            sample = await self.get(uid=_sa_uid)
            copy, invalidated = await self._invalidate(sample, invalidated_by=user)

            # add invalidated
            if invalidated:
                return_samples.append(invalidated)

            # add copy and create analytes
            if copy:
                return_samples.append(copy)

                # create associated analysis
                _profiles_analyses = set()

                for _prof in copy.profiles:
                    analyses_ = _prof.analyses
                    for _an in analyses_:
                        _profiles_analyses.add(_an)

                for _anal in copy.analyses:
                    if _anal not in _profiles_analyses:
                        _profiles_analyses.add(_anal)

                for _service in _profiles_analyses:
                    a_result_in = {
                        "sample_uid": copy.uid,
                        "analysis_uid": _service.uid,
                        "status": ResultStates.PENDING,
                    }
                    a_result_schema = AnalysisResultCreate(**a_result_in)
                    await self.analysis_result_service.create(
                        **marshal(a_result_schema)
                    )

        return return_samples
