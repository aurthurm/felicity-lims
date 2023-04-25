from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql import PageInfo
from api.gql.client.types import ClientType
from api.gql.patient.types import PatientType
from api.gql.setup.types import DepartmentType, InstrumentType, MethodType, UnitType
from api.gql.storage.types import StorageContainerType
from api.gql.user.types import UserType
from core.uid_gen import FelicityID


@strawberry.type
class SampleTypeTyp:
    uid: FelicityID
    name: str
    description: str | None
    active: bool
    internal_use: bool
    abbr: str
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class QCLevelType:
    uid: FelicityID
    level: str
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class QCSetType:
    uid: FelicityID
    name: str
    note: str
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class RejectionReasonType:
    uid: FelicityID
    reason: str
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


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
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisCategoryType:
    uid: FelicityID
    name: str
    department_uid: str | None
    department: Optional[DepartmentType]
    description: str | None
    active: bool
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class ResultOptionType:
    uid: FelicityID
    option_key: int
    value: str
    analysis_uid: FelicityID
    # analysis: Optional['AnalysisType']
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisType:
    uid: FelicityID
    name: str
    description: str | None
    keyword: str | None
    department_uid: str | None
    department: Optional[DepartmentType]
    unit_uid: FelicityID | None
    unit: Optional[UnitType]
    sample_types: Optional[List[SampleTypeTyp]]
    category_uid: FelicityID | None
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
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class ProfileType:
    uid: FelicityID
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
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
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
    date_collected: datetime | None
    submitted_by_uid: FelicityID | None
    submitted_by: UserType | None
    date_submitted: datetime | None
    verified_by_uid: FelicityID | None
    verified_by: UserType | None
    date_verified: datetime | None
    invalidated_by_uid: FelicityID | None
    invalidated_by: UserType | None
    date_invalidated: datetime | None
    received_by_uid: FelicityID | None
    received_by: UserType | None
    date_received: datetime | None
    published_by_uid: FelicityID | None
    published_by: UserType | None
    date_published: datetime | None
    cancelled_by_uid: FelicityID | None
    cancelled_by: UserType | None
    date_cancelled: datetime | None
    printed: bool| None
    date_printed: datetime | None
    printed_by_uid: FelicityID | None
    printed_by: UserType | None
    due_date: datetime | None
    rejection_reasons: Optional[List[RejectionReasonType]]
    internal_use: bool
    parent_id: FelicityID | None
    parent: Optional["SampleType"]
    # QC Samples
    qc_set_uid: FelicityID | None
    qc_set: Optional[QCSetType]
    qc_level_uid: FelicityID | None
    qc_level: Optional[QCLevelType]
    # Bio Banking
    storage_container_uid: FelicityID | None
    storage_container: Optional[StorageContainerType]
    storage_slot: str | None
    storage_slot_index: int | None
    stored_by_uid: FelicityID | None
    stored_by: UserType | None
    date_stored: datetime | None
    date_retrieved_from_storage: datetime | None
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
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
    uid: FelicityID
    name: str
    description: str | None
    departments: List[DepartmentType]
    qc_levels: List[QCLevelType]
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisInterimType:
    uid: FelicityID
    key: int
    value: str
    analysis_uid: FelicityID
    instrument_uid: FelicityID
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisCorrectionFactorType:
    uid: FelicityID
    factor: float
    analysis_uid: FelicityID
    instrument_uid: FelicityID
    method_uid: FelicityID
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisDetectionLimitType:
    uid: FelicityID
    lower_limit: float
    upper_limit: float
    analysis_uid: FelicityID
    instrument_uid: FelicityID
    method_uid: FelicityID
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


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
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class AnalysisSpecificationType:
    uid: FelicityID
    analysis_uid: FelicityID
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
    method_uid: FelicityID | None
    unit_uid: FelicityID | None
    unit: Optional[UnitType]
    #
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None
