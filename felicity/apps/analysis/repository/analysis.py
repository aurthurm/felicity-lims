from sqlalchemy import or_

from domain.analysis.ports.repository.analysis import (
    ICodingStandardRepository,
    ISampleTypeRepository,
    ISampleTypeCodingRepository,
    IAnalysisCategoryRepository,
    IProfileRepository,
    IProfileCodingRepository,
    IAnalysisRepository,
    IAnalysisCodingRepository,
    IAnalysisInterimRepository,
    IAnalysisCorrectionFactorRepository,
    IAnalysisDetectionLimitRepository,
    IAnalysisUncertaintyRepository,
    IAnalysisSpecificationRepository,
    IResultOptionRepository,
    IAnalysisRequestRepository,
    IRejectionReasonRepository,
    ISampleRepository,
)
from felicity.apps.analysis.entities.analysis import (
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
)
from felicity.apps.repository.base import BaseRepository


class CodingStandardRepository(
    BaseRepository[CodingStandard], ICodingStandardRepository
):
    def __init__(self) -> None:
        self.model = CodingStandard
        super().__init__()


class SampleTypeRepository(BaseRepository[SampleType], ISampleTypeRepository):
    def __init__(self) -> None:
        self.model = SampleType
        super().__init__()


class SampleTypeCodingRepository(
    BaseRepository[SampleTypeCoding], ISampleTypeCodingRepository
):
    def __init__(self) -> None:
        self.model = SampleTypeCoding
        super().__init__()


class ProfileRepository(BaseRepository[Profile], IProfileRepository):
    def __init__(self) -> None:
        self.model = Profile
        super().__init__()


class AnalysisCategoryRepository(
    BaseRepository[AnalysisCategory], IAnalysisCategoryRepository
):
    def __init__(self) -> None:
        self.model = AnalysisCategory
        super().__init__()


class ProfileCodingRepository(BaseRepository[ProfileCoding], IProfileCodingRepository):
    def __init__(self) -> None:
        self.model = ProfileCoding
        super().__init__()


class AnalysisRepository(BaseRepository[Analysis], IAnalysisRepository):
    def __init__(self) -> None:
        self.model = Analysis
        super().__init__()


class AnalysisCodingRepository(
    BaseRepository[AnalysisCoding], IAnalysisCodingRepository
):
    def __init__(self) -> None:
        self.model = AnalysisCoding
        super().__init__()


class AnalysisInterimRepository(
    BaseRepository[AnalysisInterim], IAnalysisInterimRepository
):
    def __init__(self) -> None:
        self.model = AnalysisInterim
        super().__init__()


class AnalysisCorrectionFactorRepository(
    BaseRepository[AnalysisCorrectionFactor], IAnalysisCorrectionFactorRepository
):
    def __init__(self) -> None:
        self.model = AnalysisCorrectionFactor
        super().__init__()


class AnalysisDetectionLimitRepository(
    BaseRepository[AnalysisDetectionLimit], IAnalysisDetectionLimitRepository
):
    def __init__(self) -> None:
        self.model = AnalysisDetectionLimit
        super().__init__()


class AnalysisUncertaintyRepository(
    BaseRepository[AnalysisUncertainty], IAnalysisUncertaintyRepository
):
    def __init__(self) -> None:
        self.model = AnalysisUncertainty
        super().__init__()


class AnalysisSpecificationRepository(
    BaseRepository[AnalysisSpecification], IAnalysisSpecificationRepository
):
    def __init__(self) -> None:
        self.model = AnalysisSpecification
        super().__init__()


class ResultOptionRepository(BaseRepository[ResultOption], IResultOptionRepository):
    def __init__(self) -> None:
        self.model = ResultOption
        super().__init__()


class AnalysisRequestRepository(
    BaseRepository[AnalysisRequest], IAnalysisRequestRepository
):
    def __init__(self) -> None:
        self.model = AnalysisRequest
        super().__init__()


class RejectionReasonRepository(
    BaseRepository[RejectionReason], IRejectionReasonRepository
):
    def __init__(self) -> None:
        self.model = RejectionReason
        super().__init__()


class SampleRepository(BaseRepository[Sample], ISampleRepository):
    def __init__(self) -> None:
        self.model = Sample
        super().__init__()

    async def search(self, status: str, text: str, client_uid: str) -> list[Sample]:
        """No pagination"""
        filters = []
        _or_text_ = {}
        if text:
            arg_list = [
                "sample_id__ilike",
                "analysis_request___patient___first_name__ilike",
                "analysis_request___patient___last_name__ilike",
                "analysis_request___patient___client_patient_id__ilike",
                "analysis_request___client_request_id__ilike",
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {or_: _or_text_}
            filters.append(text_filters)

        if client_uid:
            filters.append({"analysis_request___client_uid__exact": client_uid})

        if status:
            filters.append({"status__exact": status})

        filters.append({"internal_use__ne": True})

        stmt = self._db.smart_query(filters=filters, sort_attrs=["uid"])
        return (await self.async_session().execute(stmt)).scalars().all()
