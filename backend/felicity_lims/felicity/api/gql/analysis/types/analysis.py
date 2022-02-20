from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from felicity.api.gql import PageInfo
from felicity.api.gql.client.types import ClientType
from felicity.api.gql.patient.types import PatientType
from felicity.api.gql.setup.types import DepartmentType, UnitType
from felicity.api.gql.user.types import UserType


@strawberry.type
class SampleTypeTyp:
    uid: int
    name: str
    description: Optional[str]
    active: bool
    internal_use: bool
    abbr: str
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class QCLevelType:
    uid: int
    level: str
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class QCSetType:
    uid: int
    name: str
    note: str
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class RejectionReasonType:
    uid: int
    reason: str
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisRequestType:
    uid: int
    patient_uid: int
    patient: PatientType
    client_uid: int
    client: ClientType
    request_id: str
    client_request_id: str
    internal_use: bool
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisCategoryType:
    uid: int
    name: str
    description: Optional[str]
    active: bool
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class ResultOptionType:
    uid: int
    option_key: int
    value: str
    analysis_uid: int
    # analysis: Optional['AnalysisType']
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisType:
    uid: int
    name: str
    description: Optional[str]
    keyword: Optional[str]
    unit: Optional[str]
    sample_types: Optional[List[SampleTypeTyp]]
    category_uid: Optional[int]
    category: Optional[AnalysisCategoryType]
    result_options: Optional[List[ResultOptionType]]
    tat_length_minutes: int
    sort_key: int
    internal_use: bool
    active: bool
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class ProfileType:
    uid: int
    name: str
    description: Optional[str]
    keyword: Optional[str]
    tat_length_minutes: Optional[int]
    analyses: Optional[List[AnalysisType]]
    active: bool
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisWithProfiles(AnalysisType):
    profiles: Optional[List[ProfileType]]


@strawberry.type
class AnalysisEdge:
    cursor: str
    node: AnalysisWithProfiles


@strawberry.type
class AnalysisCursorPage:
    page_info: PageInfo
    edges: Optional[List[AnalysisEdge]]
    items: Optional[List[AnalysisWithProfiles]]
    total_count: int


@strawberry.type
class SampleType:  # for Sample
    uid: int
    analysis_request_uid: int
    analysis_request: Optional[AnalysisRequestType]
    sample_type_uid: int
    sample_type: Optional[SampleTypeTyp]
    sample_id: str
    profiles: Optional[List[ProfileType]]
    analyses: Optional[List[AnalysisType]]
    priority: int
    status: str
    assigned: bool
    submitted_by_uid: Optional[int]
    submitted_by: Optional[UserType]
    date_submitted: Optional[datetime]
    verified_by_uid: Optional[int]
    verified_by: Optional[UserType]
    date_verified: Optional[datetime]
    invalidated_by_uid: Optional[int]
    invalidated_by: Optional[UserType]
    date_invalidated: Optional[datetime]
    received_by_uid: Optional[int]
    received_by: Optional[UserType]
    date_received: Optional[datetime]
    published_by_uid: Optional[int]
    published_by: Optional[UserType]
    date_published: Optional[datetime]
    cancelled_by_uid: Optional[int]
    cancelled_by: Optional[UserType]
    date_cancelled: Optional[datetime]
    due_date: Optional[datetime]
    rejection_reasons: Optional[List[RejectionReasonType]]
    internal_use: bool
    parent_id: Optional[int]
    parent: Optional["SampleType"]
    # QC Samples
    qc_set_uid: Optional[int]
    qc_set: Optional[QCSetType]
    qc_level_uid: Optional[int]
    qc_level: Optional[QCLevelType]
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisRequestWithSamples(AnalysisRequestType):
    samples: Optional[List[SampleType]]


@strawberry.type
class AnalysisRequestEdge:
    cursor: str
    node: AnalysisRequestWithSamples


@strawberry.type
class AnalysisRequestCursorPage:
    page_info: PageInfo
    edges: Optional[List[AnalysisRequestEdge]]
    items: Optional[List[AnalysisRequestWithSamples]]
    total_count: int


@strawberry.type
class QCTemplateType:
    uid: int
    name: str
    description: Optional[str]
    departments: List[DepartmentType]
    qc_levels: List[QCLevelType]
    #
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisInterimType:
    uid: int
    key: int
    value: str
    analysis_uid: int
    instrument_uid: int


@strawberry.type
class AnalysisCorrectionFactorType:
    uid: int
    factor: str
    analysis_uid: int
    instrument_uid: int
    method_uid: int


@strawberry.type
class AnalysisDetectionLimitType:
    uid: int
    lower_limit: str
    upper_limit: str
    analysis_uid: int
    instrument_uid: int
    method_uid: int


@strawberry.type
class AnalysisUncertaintyType:
    uid: int
    min: float
    max: float
    value: float
    analysis_uid: int
    instrument_uid: int
    method_uid: int


@strawberry.type
class AnalysisSpecificationType:
    uid: int
    analysis_uid: int
    unit_uid: int
    unit: Optional[UnitType]
    min: float
    max: float
    min_warn: float
    max_warn: float
    min_report: str
    max_report: str
    warn_values: str
    warn_report: str
    gender: str
    age_min: int
    age_max: int
    method_uid: int
