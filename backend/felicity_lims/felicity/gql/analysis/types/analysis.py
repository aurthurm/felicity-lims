from typing import Optional, List
from datetime import datetime

import strawberry  # noqa

from felicity.gql import PageInfo
from felicity.gql.client.types import ClientType
from felicity.gql.patient.types import PatientType
from felicity.gql.setup.types import DepartmentType
from felicity.gql.user.types import UserType


@strawberry.type
class SampleTypeTyp:
    uid: int
    name: str
    description: Optional[str]
    active: bool
    internal_use: bool
    abbr: str


@strawberry.type
class QCLevelType:
    uid: int
    level: str


@strawberry.type
class QCSetType:
    uid: int
    name: str
    note: str


@strawberry.type
class RejectionReasonType:
    uid: int
    reason: str


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


@strawberry.type
class ResultOptionType:
    uid: int
    option_key: int
    value: str
    analysis_uid: int
    # analysis: AnalysisType


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
    parent: Optional['SampleType']
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
