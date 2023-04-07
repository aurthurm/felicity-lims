from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql import PageInfo
from felicity.api.gql.client.types import ClientType
from felicity.api.gql.patient.types import PatientType
from felicity.api.gql.setup.types import (
    DepartmentType,
    InstrumentType,
    MethodType,
    UnitType,
)
from felicity.api.gql.storage.types import StorageContainerType
from felicity.api.gql.user.types import UserType
from felicity.core.uid_gen import FelicityID


@strawberry.type
class SampleTypeTyp:
    uid: FelicityID
    name: str
    description: Optional[str]
    active: bool
    internal_use: bool
    abbr: str
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class QCLevelType:
    uid: FelicityID
    level: str
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class QCSetType:
    uid: FelicityID
    name: str
    note: str
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class RejectionReasonType:
    uid: FelicityID
    reason: str
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisRequestType:
    uid: FelicityID
    patient_uid: FelicityID
    patient: PatientType
    client_uid: FelicityID
    client: ClientType
    request_id: str
    client_request_id: str
    internal_use: bool
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisCategoryType:
    uid: FelicityID
    name: str
    department_uid: Optional[str]
    department: Optional[DepartmentType]
    description: Optional[str]
    active: bool
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class ResultOptionType:
    uid: FelicityID
    option_key: int
    value: str
    analysis_uid: FelicityID
    # analysis: Optional['AnalysisType']
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisType:
    uid: FelicityID
    name: str
    description: Optional[str]
    keyword: Optional[str]
    department_uid: Optional[str]
    department: Optional[DepartmentType]
    unit_uid: Optional[FelicityID]
    unit: Optional[UnitType]
    sample_types: Optional[List[SampleTypeTyp]]
    category_uid: Optional[FelicityID]
    category: Optional[AnalysisCategoryType]
    interims: Optional[List["AnalysisInterimType"]]
    sample_types: Optional[List[SampleTypeTyp]]
    correction_factors: Optional[List["AnalysisCorrectionFactorType"]]
    specifications: Optional[List["AnalysisSpecificationType"]]
    detection_limits: Optional[List["AnalysisDetectionLimitType"]]
    uncertainties: Optional[List["AnalysisUncertaintyType"]]
    result_options: Optional[List[ResultOptionType]]
    instruments: Optional[List[InstrumentType]]
    methods: Optional[List[MethodType]]
    tat_length_minutes: Optional[int]
    sort_key: Optional[int]
    precision: Optional[int]
    required_verifications: Optional[int]
    self_verification: Optional[bool]
    hidden: Optional[bool]
    internal_use: Optional[bool]
    active: Optional[bool]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class ProfileType:
    uid: FelicityID
    name: str
    description: Optional[str]
    keyword: Optional[str]
    department_uid: Optional[str]
    department: Optional[DepartmentType]
    tat_length_minutes: Optional[int]
    analyses: Optional[List[AnalysisType]]
    sample_types: Optional[List[SampleTypeTyp]]
    active: bool
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
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
    uid: FelicityID
    analysis_request_uid: FelicityID
    analysis_request: Optional[AnalysisRequestType]
    sample_type_uid: FelicityID
    sample_type: Optional[SampleTypeTyp]
    sample_id: str
    profiles: Optional[List[ProfileType]]
    analyses: Optional[List[AnalysisType]]
    priority: int
    status: str
    assigned: bool
    date_collected: Optional[datetime]
    submitted_by_uid: Optional[FelicityID]
    submitted_by: Optional[UserType]
    date_submitted: Optional[datetime]
    verified_by_uid: Optional[FelicityID]
    verified_by: Optional[UserType]
    date_verified: Optional[datetime]
    invalidated_by_uid: Optional[FelicityID]
    invalidated_by: Optional[UserType]
    date_invalidated: Optional[datetime]
    received_by_uid: Optional[FelicityID]
    received_by: Optional[UserType]
    date_received: Optional[datetime]
    published_by_uid: Optional[FelicityID]
    published_by: Optional[UserType]
    date_published: Optional[datetime]
    cancelled_by_uid: Optional[FelicityID]
    cancelled_by: Optional[UserType]
    date_cancelled: Optional[datetime]
    printed: Optional[bool]
    date_printed: Optional[datetime]
    printed_by_uid: Optional[FelicityID]
    printed_by: Optional[UserType]
    due_date: Optional[datetime]
    rejection_reasons: Optional[List[RejectionReasonType]]
    internal_use: bool
    parent_id: Optional[int]
    parent: Optional["SampleType"]
    # QC Samples
    qc_set_uid: Optional[FelicityID]
    qc_set: Optional[QCSetType]
    qc_level_uid: Optional[FelicityID]
    qc_level: Optional[QCLevelType]
    # Bio Banking
    storage_container_uid: Optional[FelicityID]
    storage_container: Optional[StorageContainerType]
    storage_slot: Optional[str]
    storage_slot_index: Optional[int]
    stored_by_uid: Optional[FelicityID]
    stored_by: Optional[UserType]
    date_stored: Optional[datetime]
    date_retrieved_from_storage: Optional[datetime]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
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
    uid: FelicityID
    name: str
    description: Optional[str]
    departments: List[DepartmentType]
    qc_levels: List[QCLevelType]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisInterimType:
    uid: FelicityID
    key: int
    value: str
    analysis_uid: FelicityID
    instrument_uid: FelicityID
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisCorrectionFactorType:
    uid: FelicityID
    factor: float
    analysis_uid: FelicityID
    instrument_uid: FelicityID
    method_uid: FelicityID
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisDetectionLimitType:
    uid: FelicityID
    lower_limit: float
    upper_limit: float
    analysis_uid: FelicityID
    instrument_uid: FelicityID
    method_uid: FelicityID
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisUncertaintyType:
    uid: FelicityID
    min: float
    max: float
    value: float
    analysis_uid: FelicityID
    instrument_uid: FelicityID
    method_uid: FelicityID
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class AnalysisSpecificationType:
    uid: FelicityID
    analysis_uid: FelicityID
    min: Optional[float]
    max: Optional[float]
    min_warn: Optional[float]
    max_warn: Optional[float]
    min_report: Optional[str]
    max_report: Optional[str]
    warn_values: Optional[str]
    warn_report: Optional[str]
    gender: Optional[str]
    age_min: Optional[int]
    age_max: Optional[int]
    method_uid: Optional[FelicityID]
    unit_uid: Optional[FelicityID]
    unit: Optional[UnitType]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]
