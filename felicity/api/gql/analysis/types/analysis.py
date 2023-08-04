from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql.types.generic import PageInfo
from api.gql.client.types import ClientType
from api.gql.patient.types import PatientType
from api.gql.instrument.types import InstrumentType, MethodType
from api.gql.setup.types import UnitType
from api.gql.setup.types.department import DepartmentType
from api.gql.storage.types import StorageContainerType
from api.gql.user.types import UserType


@strawberry.type
class CodingStandardType:
    uid: str
    name: str
    description: str | None
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class SampleTypeTyp:
    uid: str
    name: str
    description: str | None
    active: bool
    internal_use: bool
    abbr: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class SampleTypeMappingType:
    uid: str
    sample_type_uid: str
    sample_type: SampleTypeTyp | None
    coding_standard_uid: str
    coding_standard: CodingStandardType | None
    name: str | None
    description: str | None
    code: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None
    
    
@strawberry.type
class QCLevelType:
    uid: str
    level: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class QCSetType:
    uid: str
    name: str
    note: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class RejectionReasonType:
    uid: str
    reason: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisRequestType:
    uid: str
    patient_uid: str
    patient: PatientType
    client_uid: str
    client: ClientType
    request_id: str
    client_request_id: str
    internal_use: bool
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisCategoryType:
    uid: str
    name: str
    department_uid: str | None
    department: Optional[DepartmentType]
    description: str | None
    active: bool
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class ResultOptionType:
    uid: str
    option_key: int
    value: str
    analysis_uid: str
    # analysis: Optional['AnalysisType']
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisType:
    uid: str
    name: str
    description: str | None
    keyword: str | None
    department_uid: str | None
    department: Optional[DepartmentType]
    unit_uid: str | None
    unit: Optional[UnitType]
    sample_types: Optional[List[SampleTypeTyp]]
    category_uid: str | None
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
    tat_length_minutes: int | None
    sort_key: int | None
    precision: int | None
    required_verifications: int | None
    self_verification: bool| None
    hidden: bool| None
    internal_use: bool| None
    active: bool| None
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisMappingType:
    uid: str
    analysis_uid: str
    analysis: AnalysisType | None
    coding_standard_uid: str
    coding_standard: CodingStandardType | None
    name: str | None
    description: str | None
    code: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class ProfileType:
    uid: str
    name: str
    description: str | None
    keyword: str | None
    department_uid: str | None
    department: Optional[DepartmentType]
    tat_length_minutes: int | None
    analyses: Optional[List[AnalysisType]]
    sample_types: Optional[List[SampleTypeTyp]]
    active: bool
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class ProfileMappingType:
    uid: str
    profile_uid: str
    profile: ProfileType | None
    coding_standard_uid: str
    coding_standard: CodingStandardType | None
    name: str | None
    description: str | None
    code: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


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
    uid: str
    analysis_request_uid: str
    analysis_request: Optional[AnalysisRequestType]
    sample_type_uid: str
    sample_type: Optional[SampleTypeTyp]
    sample_id: str
    profiles: Optional[List[ProfileType]]
    analyses: Optional[List[AnalysisType]]
    priority: int
    status: str | None
    assigned: bool
    date_collected: datetime | None
    submitted_by_uid: str | None
    submitted_by: UserType | None
    date_submitted: datetime | None
    verified_by_uid: str | None
    verified_by: UserType | None
    date_verified: datetime | None
    invalidated_by_uid: str | None
    invalidated_by: UserType | None
    date_invalidated: datetime | None
    received_by_uid: str | None
    received_by: UserType | None
    date_received: datetime | None
    published_by_uid: str | None
    published_by: UserType | None
    date_published: datetime | None
    cancelled_by_uid: str | None
    cancelled_by: UserType | None
    date_cancelled: datetime | None
    printed: bool| None
    date_printed: datetime | None
    printed_by_uid: str | None
    printed_by: UserType | None
    due_date: datetime | None
    rejection_reasons: Optional[List[RejectionReasonType]]
    internal_use: bool
    parent_id: str | None
    parent: Optional["SampleType"]
    # QC Samples
    qc_set_uid: str | None
    qc_set: Optional[QCSetType]
    qc_level_uid: str | None
    qc_level: Optional[QCLevelType]
    # Bio Banking
    storage_container_uid: str | None
    storage_container: Optional[StorageContainerType]
    storage_slot: str | None
    storage_slot_index: int | None
    stored_by_uid: str | None
    stored_by: UserType | None
    date_stored: datetime | None
    date_retrieved_from_storage: datetime | None
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


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
    uid: str
    name: str
    description: str | None
    departments: List[DepartmentType]
    qc_levels: List[QCLevelType]
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisInterimType:
    uid: str
    key: int
    value: str
    analysis_uid: str
    instrument_uid: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisCorrectionFactorType:
    uid: str
    factor: float
    analysis_uid: str
    instrument_uid: str
    method_uid: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisDetectionLimitType:
    uid: str
    lower_limit: float
    upper_limit: float
    analysis_uid: str
    instrument_uid: str
    method_uid: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisUncertaintyType:
    uid: str
    min: float
    max: float
    value: float
    analysis_uid: str
    instrument_uid: str
    method_uid: str
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisSpecificationType:
    uid: str
    analysis_uid: str
    min: float| None
    max: float| None
    min_warn: float| None
    max_warn: float| None
    min_report: str | None
    max_report: str | None
    warn_values: str | None
    warn_report: str | None
    gender: str | None
    age_min: int | None
    age_max: int | None
    method_uid: str | None
    unit_uid: str | None
    unit: Optional[UnitType]
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None
