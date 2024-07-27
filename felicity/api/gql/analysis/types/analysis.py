from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.client.types import ClientType
from felicity.api.gql.instrument.types import InstrumentType, MethodType
from felicity.api.gql.patient.types import PatientType
from felicity.api.gql.setup.types import UnitType
from felicity.api.gql.setup.types.department import DepartmentType
from felicity.api.gql.storage.types import StorageContainerType
from felicity.api.gql.types.generic import PageInfo
from felicity.api.gql.user.types import UserType


@strawberry.type
class CodingStandardType:
    uid: str
    name: str
    description: str | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class SampleTypeTyp:
    uid: str
    name: str
    description: str | None = None
    active: bool
    internal_use: bool
    abbr: str
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class SampleTypeMappingType:
    uid: str
    sample_type_uid: str
    sample_type: SampleTypeTyp | None = None
    coding_standard_uid: str
    coding_standard: CodingStandardType | None = None
    name: str | None = None
    description: str | None = None
    code: str
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class QCLevelType:
    uid: str
    level: str
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class QCSetType:
    uid: str
    name: str
    note: str
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class RejectionReasonType:
    uid: str
    reason: str
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


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
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class AnalysisCategoryType:
    uid: str
    name: str
    department_uid: str | None = None
    department: Optional[DepartmentType] = None
    description: str | None = None
    active: bool
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class ResultOptionType:
    uid: str
    option_key: int
    value: str
    analysis_uid: str
    # analysis: Optional['AnalysisType']
    sample_types: Optional[list[SampleTypeTyp]] = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class AnalysisType:
    uid: str
    name: str
    description: str | None = None
    keyword: str | None = None
    department_uid: str | None = None
    department: Optional[DepartmentType] = None
    unit_uid: str | None = None
    unit: Optional[UnitType]
    sample_types: Optional[List[SampleTypeTyp]] = None
    category_uid: str | None = None
    category: Optional[AnalysisCategoryType] = None
    interims: Optional[List["AnalysisInterimType"]] = None
    sample_types: Optional[List[SampleTypeTyp]] = None
    correction_factors: Optional[List["AnalysisCorrectionFactorType"]] = None
    specifications: Optional[List["AnalysisSpecificationType"]] = None
    detection_limits: Optional[List["AnalysisDetectionLimitType"]] = None
    uncertainties: Optional[List["AnalysisUncertaintyType"]] = None
    result_options: Optional[List[ResultOptionType]] = None
    instruments: Optional[List[InstrumentType]] = None
    methods: Optional[List[MethodType]] = None
    result_type: str | None = None
    tat_length_minutes: int | None = None
    sort_key: int | None = None
    precision: int | None = None
    required_verifications: int | None = None
    self_verification: bool | None = None
    hidden: bool | None = None
    internal_use: bool | None = None
    active: bool | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class AnalysisMappingType:
    uid: str
    analysis_uid: str
    analysis: AnalysisType | None = None
    coding_standard_uid: str
    coding_standard: CodingStandardType | None = None
    name: str | None = None
    description: str | None = None
    code: str
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class ProfileType:
    uid: str
    name: str
    description: str | None = None
    keyword: str | None = None
    department_uid: str | None = None
    department: Optional[DepartmentType] = None
    tat_length_minutes: int | None = None
    analyses: Optional[List[AnalysisType]] = None
    sample_types: Optional[List[SampleTypeTyp]] = None
    active: bool
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class ProfileMappingType:
    uid: str
    profile_uid: str
    profile: ProfileType | None = None
    coding_standard_uid: str
    coding_standard: CodingStandardType | None = None
    name: str | None = None
    description: str | None = None
    code: str
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class AnalysisWithProfiles(AnalysisType):
    profiles: Optional[List[ProfileType]] = None


@strawberry.type
class AnalysisEdge:
    cursor: str
    node: AnalysisWithProfiles


@strawberry.type
class AnalysisCursorPage:
    page_info: PageInfo
    edges: Optional[List[AnalysisEdge]] = None
    items: Optional[List[AnalysisWithProfiles]] = None
    total_count: int


@strawberry.type
class AnalysisTemplateType:
    uid: str
    name: str
    description: str | None = None
    department_uid: str | None = None
    department: Optional[DepartmentType] = None
    analyses: Optional[List[AnalysisType]] = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class SampleType:  # for Sample
    uid: str
    analysis_request_uid: str
    analysis_request: Optional[AnalysisRequestType]
    sample_type_uid: str
    sample_type: Optional[SampleTypeTyp]
    sample_id: str
    profiles: Optional[List[ProfileType]] = None
    analyses: Optional[List[AnalysisType]] = None
    priority: int
    status: str | None = None
    assigned: bool
    date_collected: datetime | None = None
    submitted_by_uid: str | None = None
    submitted_by: UserType | None = None
    date_submitted: datetime | None = None
    verified_by_uid: str | None = None
    verified_by: UserType | None = None
    date_verified: datetime | None = None
    invalidated_by_uid: str | None = None
    invalidated_by: UserType | None = None
    date_invalidated: datetime | None = None
    received_by_uid: str | None = None
    received_by: UserType | None = None
    date_received: datetime | None = None
    published_by_uid: str | None = None
    published_by: UserType | None = None
    date_published: datetime | None = None
    cancelled_by_uid: str | None = None
    cancelled_by: UserType | None = None
    date_cancelled: datetime | None = None
    printed: bool | None = None
    date_printed: datetime | None = None
    printed_by_uid: str | None = None
    printed_by: UserType | None = None
    due_date: str | None = None
    rejection_reasons: Optional[List[RejectionReasonType]] = None
    internal_use: bool
    parent_id: str | None = None
    parent: Optional["SampleType"] = None
    # QC Samples
    qc_set_uid: str | None = None
    qc_set: Optional[QCSetType] = None
    qc_level_uid: str | None = None
    qc_level: Optional[QCLevelType] = None
    # Bio Banking
    storage_container_uid: str | None = None
    storage_container: Optional[StorageContainerType] = None
    storage_slot: str | None = None
    storage_slot_index: int | None = None
    stored_by_uid: str | None = None
    stored_by: UserType | None = None
    date_stored: datetime | None = None
    date_retrieved_from_storage: datetime | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


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
    edges: Optional[List[AnalysisRequestEdge]] = None
    items: Optional[List[AnalysisRequestWithSamples]] = None
    total_count: int


@strawberry.type
class QCTemplateType:
    uid: str
    name: str
    description: str | None = None
    departments: List[DepartmentType] = None
    qc_levels: List[QCLevelType] = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class AnalysisInterimType:
    uid: str
    key: int
    value: str
    analysis_uid: str
    instrument_uid: str
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class AnalysisCorrectionFactorType:
    uid: str
    factor: float
    analysis_uid: str
    instrument_uid: str
    method_uid: str
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class AnalysisDetectionLimitType:
    uid: str
    lower_limit: float
    upper_limit: float
    analysis_uid: str
    instrument_uid: str
    method_uid: str
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


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
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class AnalysisSpecificationType:
    uid: str
    analysis_uid: str
    min: float | None = None
    max: float | None = None
    min_warn: float | None = None
    max_warn: float | None = None
    min_report: str | None = None
    max_report: str | None = None
    warn_values: str | None = None
    warn_report: str | None = None
    gender: str | None = None
    age_min: int | None = None
    age_max: int | None = None
    method_uid: str | None = None
    unit_uid: str | None = None
    unit: Optional[UnitType] = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None
