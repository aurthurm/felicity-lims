from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.client.types import ClientType, ClientContactType
from felicity.api.gql.instrument.types import InstrumentType, MethodType
from felicity.api.gql.patient.types import PatientType
from felicity.api.gql.setup.types import UnitType, DistrictType, ProvinceType, LaboratoryType
from felicity.api.gql.setup.types.department import DepartmentType
from felicity.api.gql.storage.types import StorageContainerType
from felicity.api.gql.types.generic import PageInfo, JSONScalar, StrawberryMapper
from felicity.api.gql.user.types import UserType
from felicity.apps.analysis.services.analysis import SampleService


@strawberry.type
class CodingStandardType:
    uid: str
    name: str
    description: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    status: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class ClinicalDataCodingType:
    uid: str
    clinical_data_uid: str | None
    coding_standard_uid: str | None
    code: str | None
    name: str | None
    description: str | None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class ClinicalDataType:
    uid: str
    analysis_request_uid: str | None = None
    symptoms: list[str] | None
    symptoms_raw: str | None
    clinical_indication: str | None
    pregnancy_status: bool | None = False
    breast_feeding: bool | None = False
    vitals: JSONScalar | None
    treatment_notes: str | None
    other_context: JSONScalar | None
    codings: list[ClinicalDataCodingType] | None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    request_id: str
    client_request_id: str
    client_contact_uid: str | None = None
    client_contact: ClientContactType | None = None
    clinical_data: list[ClinicalDataType] | None
    internal_use: bool
    metadata_snapshot: JSONScalar | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None

    @strawberry.field
    async def samples(self, info) -> List["SampleType"]:
        return await SampleService().get_all(analysis_request_uid=self.uid)

    @strawberry.field
    async def client(self, info) -> ClientType | None:
        _client = self.metadata_snapshot.get("client")
        if not _client: return None
        _district = _client.get("district", None)
        _province = _client.get("province", None)
        _client["district"] = StrawberryMapper[DistrictType]().map(**_district) if _district else None
        _client["province"] = StrawberryMapper[ProvinceType]().map(**_province) if _province else None
        _contacts = _client.get("contacts", [])
        mapping = StrawberryMapper[ClientType]().map(exclude=["contacts"], **_client)
        mapping.contacts = [
            StrawberryMapper[ClientContactType]().map(**c) for c in _contacts
        ]
        return mapping


@strawberry.type
class AnalysisCategoryType:
    uid: str
    name: str
    department_uid: str | None = None
    department: Optional[DepartmentType] = None
    description: str | None = None
    active: bool
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    unit: Optional[UnitType] = None
    sample_types: Optional[List[SampleTypeTyp]] = None
    category_uid: str | None = None
    category: Optional[AnalysisCategoryType] = None
    interims: Optional[List["AnalysisInterimType"]] = None
    correction_factors: Optional[List["AnalysisCorrectionFactorType"]] = None
    specifications: Optional[List["AnalysisSpecificationType"]] = None
    detection_limits: Optional[List["AnalysisDetectionLimitType"]] = None
    uncertainties: Optional[List["AnalysisUncertaintyType"]] = None
    result_options: Optional[List[ResultOptionType]] = None
    instruments: Optional[List[InstrumentType]] = None
    methods: Optional[List[MethodType]] = None
    profiles: Optional[List["ProfileType"]] = None
    result_type: str | None = None
    tat_length_minutes: int | None = None
    sort_key: int | None = None
    precision: int | None = None
    required_verifications: int | None = None
    self_verification: bool | None = None
    hidden: bool | None = None
    internal_use: bool | None = None
    active: bool | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    sample_id: str
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
    metadata_snapshot: JSONScalar | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None

    @strawberry.field
    async def sample_type(self, info) -> Optional[SampleTypeTyp]:
        _sample_type = self.metadata_snapshot.get("sample_type")
        if not _sample_type: return None
        return StrawberryMapper[SampleTypeTyp]().map(**_sample_type)

    @strawberry.field
    async def profiles(self, info) -> List[ProfileType]:
        _profiles = self.metadata_snapshot.get("profiles")
        if not _profiles or len(_profiles) < 1: return []
        return [StrawberryMapper[ProfileType]().map(**profile) for profile in _profiles]

    @strawberry.field
    async def analyses(self, info) -> Optional[List[AnalysisType]]:
        _analyses = self.metadata_snapshot.get("analyses")
        if not _analyses or len(_analyses) < 1: return []
        return [StrawberryMapper[AnalysisType]().map(**analysis) for analysis in _analyses]


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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None
