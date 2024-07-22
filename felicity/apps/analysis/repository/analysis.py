from sqlalchemy import or_

from felicity.apps.analysis.entities.analysis import (
    CodingStandard,
    SampleType,
    SampleTypeCoding,
    AnalysisCategory,
    Profile,
    AnalysisTemplate,
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
from felicity.apps.abstract import BaseRepository


class CodingStandardRepository(
    BaseRepository[CodingStandard]
):
    def __init__(self) -> None:
        super().__init__(CodingStandard)


class SampleTypeRepository(BaseRepository[SampleType]):
    def __init__(self) -> None:
        super().__init__(SampleType)


class SampleTypeCodingRepository(
    BaseRepository[SampleTypeCoding]
):
    def __init__(self) -> None:
        super().__init__(SampleTypeCoding)


class ProfileRepository(BaseRepository[Profile]):
    def __init__(self) -> None:
        super().__init__(Profile)


class AnalysisTemplateRepository(BaseRepository[AnalysisTemplate]):
    def __init__(self) -> None:
        super().__init__(AnalysisTemplate)


class AnalysisCategoryRepository(
    BaseRepository[AnalysisCategory]
):
    def __init__(self) -> None:
        super().__init__(AnalysisCategory)


class ProfileCodingRepository(BaseRepository[ProfileCoding]):
    def __init__(self) -> None:
        super().__init__(ProfileCoding)


class AnalysisRepository(BaseRepository[Analysis]):
    def __init__(self) -> None:
        super().__init__(Analysis)


class AnalysisCodingRepository(
    BaseRepository[AnalysisCoding]
):
    def __init__(self) -> None:
        super().__init__(AnalysisCoding)


class AnalysisInterimRepository(
    BaseRepository[AnalysisInterim]
):
    def __init__(self) -> None:
        super().__init__(AnalysisInterim)


class AnalysisCorrectionFactorRepository(
    BaseRepository[AnalysisCorrectionFactor]
):
    def __init__(self) -> None:
        super().__init__(AnalysisCorrectionFactor)


class AnalysisDetectionLimitRepository(
    BaseRepository[AnalysisDetectionLimit]
):
    def __init__(self) -> None:
        super().__init__(AnalysisDetectionLimit)


class AnalysisUncertaintyRepository(
    BaseRepository[AnalysisUncertainty]
):
    def __init__(self) -> None:
        super().__init__(AnalysisUncertainty)


class AnalysisSpecificationRepository(
    BaseRepository[AnalysisSpecification]
):
    def __init__(self) -> None:
        super().__init__(AnalysisSpecification)


class ResultOptionRepository(BaseRepository[ResultOption]):
    def __init__(self) -> None:
        super().__init__(ResultOption)


class AnalysisRequestRepository(
    BaseRepository[AnalysisRequest]
):
    def __init__(self) -> None:
        super().__init__(AnalysisRequest)


class RejectionReasonRepository(
    BaseRepository[RejectionReason]
):
    def __init__(self) -> None:
        super().__init__(RejectionReason)


class SampleRepository(BaseRepository[Sample]):
    def __init__(self) -> None:
        super().__init__(Sample)

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
