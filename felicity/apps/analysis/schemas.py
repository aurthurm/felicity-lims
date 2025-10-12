from dataclasses import field
from datetime import datetime
from typing import List, Optional

from pydantic import ConfigDict

from felicity.apps.common.schemas import BaseAuditModel, BaseModel
from felicity.apps.setup.schemas import Department, Unit


#
# Coding standard Schemas
#


# Shared properties
class CodingStandardBase(BaseAuditModel):
    name: str | None
    description: str | None


class CodingStandardBaseInDB(CodingStandardBase):
    uid: str | None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class CodingStandardCreate(CodingStandardBase):
    pass


# Properties to receive via API on update
class CodingStandardUpdate(CodingStandardBase):
    pass


# Properties to return via API
class CodingStandard(CodingStandardBaseInDB):
    pass


# Properties stored in DB
class CodingStandardInDB(CodingStandardBaseInDB):
    pass


#
# SampleType Schemas
#

# Shared properties


class SampleTypeBase(BaseAuditModel):
    name: str | None = None
    description: str | None = None
    abbr: str | None = None
    internal_use: bool | None = False
    active: bool | None = True


class SampleTypeBaseInDB(SampleTypeBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class SampleTypeCreate(SampleTypeBase):
    pass


# Properties to receive via API on update
class SampleTypeUpdate(SampleTypeBase):
    pass


# Properties to return via API
class SampleType(SampleTypeBaseInDB):
    pass


# Properties stored in DB
class SampleTypeInDB(SampleTypeBaseInDB):
    pass


#
# SampleTypeCoding Schemas
#


class SampleTypeCodingBase(BaseAuditModel):
    sample_type_uid: str | None
    sample_type: SampleType | None
    coding_standard_uid: str
    coding_standard: CodingStandard | None
    code: str | None
    name: str | None
    description: str | None


class SampleTypeCodingBaseInDB(SampleTypeCodingBase):
    uid: str | None
    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class SampleTypeCodingCreate(SampleTypeCodingBase):
    pass


# Properties to receive via API on update
class SampleTypeCodingUpdate(SampleTypeCodingBase):
    pass


# Properties to return via API
class SampleTypeCoding(SampleTypeCodingBaseInDB):
    pass


# Properties stored in DB
class SampleTypeCodingInDB(SampleTypeCodingBaseInDB):
    pass


#
# Profile Schemas
#


# Shared properties
class ProfileBase(BaseAuditModel):
    name: str | None
    analyses: list["Analysis"] | None = None
    sample_types: list[SampleType] | None = None
    description: str | None = None
    department_uid: str | None = None
    keyword: str | None = None
    tat_length_minutes: int | None = None
    active: bool | None = True


class ProfileBaseInDB(ProfileBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ProfileCreate(ProfileBase):
    pass


# Properties to receive via API on update
class ProfileUpdate(ProfileBase):
    pass


# Properties to return via API
class Profile(ProfileBaseInDB):
    pass


# Properties stored in DB
class ProfileInDB(ProfileBaseInDB):
    pass


#
# AnalysisTemplate Schemas
#


# Shared properties
class AnalysisTemplateBase(BaseAuditModel):
    name: str | None
    analyses: list["Analysis"] | None = None
    description: str | None = None
    department_uid: str | None = None


class AnalysisTemplateBaseInDB(AnalysisTemplateBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisTemplateCreate(AnalysisTemplateBase):
    pass


# Properties to receive via API on update
class AnalysisTemplateUpdate(AnalysisTemplateBase):
    pass


# Properties to return via API
class AnalysisTemplate(AnalysisTemplateBaseInDB):
    pass


# Properties stored in DB
class AnalysisTemplateInDB(AnalysisTemplateBaseInDB):
    pass


#
# ProfileCoding Schemas
#


class ProfileCodingBase(BaseAuditModel):
    """SampleTypeMapping"""

    profile_uid: str | None
    profile: Profile | None = None
    coding_standard_uid: str | None = None
    coding_standard: CodingStandard | None = None
    code: str | None
    name: str | None
    description: str | None


class ProfileCodingBaseInDB(ProfileCodingBase):
    uid: str | None
    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ProfileCodingCreate(ProfileCodingBase):
    profile_uid: str
    coding_standard_uid: str


# Properties to receive via API on update
class ProfileCodingUpdate(ProfileCodingBase):
    pass


# Properties to return via API
class ProfileCoding(ProfileCodingBaseInDB):
    pass


# Properties stored in DB
class ProfileCodingInDB(ProfileCodingBaseInDB):
    pass


# AnalysisCategory Schemas
#


# Shared properties
class AnalysisCategoryBase(BaseAuditModel):
    name: str | None = None
    description: str | None = None
    department_uid: str | None = None
    active: bool | None = True


class AnalysisCategoryBaseInDB(AnalysisCategoryBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisCategoryCreate(AnalysisCategoryBase):
    pass


# Properties to receive via API on update
class AnalysisCategoryUpdate(AnalysisCategoryBase):
    pass


# Properties to return via API
class AnalysisCategory(AnalysisCategoryBaseInDB):
    pass


# Properties stored in DB
class AnalysisCategoryInDB(AnalysisCategoryBaseInDB):
    pass


#
# Analysis Schemas
#


class AnalysisBasicBase(BaseModel):
    name: str | None = None
    keyword: str | None = None


# Shared properties
class AnalysisBase(BaseAuditModel):
    name: str | None = None
    description: str | None = None
    keyword: str | None = None
    profiles: list[Profile] | None = None
    sample_types: list[SampleType] | None = None
    tat_length_minutes: int | None = None
    unit_uid: str | None = None
    category_uid: str | None = None
    sort_key: int | None = 0
    internal_use: bool | None = False
    precision: int | None = None
    required_verifications: int = 1
    self_verification: bool | None = False
    active: bool | None = True


class AnalysisBasic(AnalysisBasicBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AnalysisBaseInDB(AnalysisBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisCreate(AnalysisBase):
    pass


# Properties to receive via API on update
class AnalysisUpdate(AnalysisBase):
    pass


# Properties to return via API
class Analysis(AnalysisBaseInDB):
    pass


# Properties stored in DB
class AnalysisInDB(AnalysisBaseInDB):
    pass


class AnalysisCodingBase(BaseAuditModel):
    """SampleTypeMapping"""

    analysis_uid: str | None = None
    analysis: Analysis | None = None
    coding_standard_uid: str | None = None
    coding_standard: CodingStandard | None = None
    code: str | None
    name: str | None
    description: str | None


class AnalysisCodingBaseInDB(AnalysisCodingBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisCodingCreate(AnalysisCodingBase):
    analysis_uid: str
    coding_standard_uid: str


# Properties to receive via API on update
class AnalysisCodingUpdate(AnalysisCodingBase):
    pass


# Properties to return via API
class AnalysisCoding(AnalysisCodingBaseInDB):
    pass


# Properties stored in DB
class AnalysisCodingInDB(AnalysisCodingBaseInDB):
    pass


#
# AnalysisInterim Schemas
#


# Shared properties
class AnalysisInterimBase(BaseAuditModel):
    key: int
    value: str
    analysis_uid: str
    instrument_uid: str


class AnalysisInterimInDB(AnalysisInterimBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisInterimCreate(AnalysisInterimBase):
    pass


# Properties to receive via API on update
class AnalysisInterimUpdate(AnalysisInterimBase):
    pass


# Properties to return via API
class AnalysisInterim(AnalysisInterimInDB):
    pass


# Properties stored in DB
class AnalysisInterimInDB(AnalysisInterimInDB):
    pass


#
# AnalysisCorrectionFactor Schemas
#


# Shared properties
class AnalysisCorrectionFactorBase(BaseAuditModel):
    factor: float
    analysis_uid: str
    instrument_uid: str
    method_uid: str


class AnalysisCorrectionFactorBaseInDB(AnalysisCorrectionFactorBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisCorrectionFactorCreate(AnalysisCorrectionFactorBase):
    pass


# Properties to receive via API on update
class AnalysisCorrectionFactorUpdate(AnalysisCorrectionFactorBase):
    pass


# Properties to return via API
class AnalysisCorrectionFactor(AnalysisCorrectionFactorBaseInDB):
    pass


# Properties stored in DB
class AnalysisCorrectionFactorInDB(AnalysisCorrectionFactorBaseInDB):
    pass


#
# AnalysisDetectionLimit Schemas
#


# Shared properties
class AnalysisDetectionLimitBase(BaseAuditModel):
    lower_limit: int
    upper_limit: int
    analysis_uid: str
    instrument_uid: str
    method_uid: str


class AnalysisDetectionLimitBaseInDB(AnalysisDetectionLimitBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisDetectionLimitCreate(AnalysisDetectionLimitBase):
    pass


# Properties to receive via API on update
class AnalysisDetectionLimitUpdate(AnalysisDetectionLimitBase):
    pass


# Properties to return via API
class AnalysisDetectionLimit(AnalysisDetectionLimitBaseInDB):
    pass


# Properties stored in DB
class AnalysisDetectionLimitInDB(AnalysisDetectionLimitBaseInDB):
    pass


#
# AnalysisUncertainty Schemas
#


# Shared properties
class AnalysisUncertaintyBase(BaseAuditModel):
    min: float
    max: float
    value: float
    analysis_uid: str
    instrument_uid: str
    method_uid: str


class AnalysisUncertaintyBaseInDB(AnalysisUncertaintyBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisUncertaintyCreate(AnalysisUncertaintyBase):
    pass


# Properties to receive via API on update
class AnalysisUncertaintyUpdate(AnalysisUncertaintyBase):
    pass


# Properties to return via API
class AnalysisUncertainty(AnalysisUncertaintyBaseInDB):
    pass


# Properties stored in DB
class AnalysisUncertaintyInDB(AnalysisUncertaintyBaseInDB):
    pass


#
# AnalysisSpecification Schemas
#


# Shared properties
class AnalysisSpecificationBase(BaseAuditModel):
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
    unit: Unit | None = None


class AnalysisSpecificationBaseInDB(AnalysisSpecificationBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisSpecificationCreate(AnalysisSpecificationBase):
    pass


# Properties to receive via API on update
class AnalysisSpecificationUpdate(AnalysisSpecificationBase):
    pass


# Properties to return via API
class AnalysisSpecification(AnalysisSpecificationBaseInDB):
    pass


# Properties stored in DB
class AnalysisSpecificationInDB(AnalysisSpecificationBaseInDB):
    pass


#
# Result Option Schemas
#


# Shared properties
class ResultOptionBase(BaseAuditModel):
    option_key: int | None = None
    value: str | None = None
    analysis_uid: str | None = None


class ResultOptionBaseInDB(ResultOptionBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ResultOptionCreate(ResultOptionBase):
    pass


# Properties to receive via API on update
class ResultOptionUpdate(ResultOptionBase):
    pass


# Properties to return via API
class ResultOption(ResultOptionBaseInDB):
    pass


# Properties stored in DB
class ResultOptionInDB(ResultOptionBaseInDB):
    pass


#
# AnalysisRequest Schemas
#


# Shared properties
class AnalysisRequestBase(BaseAuditModel):
    patient_uid: str | None = None
    client_uid: str | None = None
    request_id: str | None = None
    client_request_id: str | None = None
    internal_use: bool | None = False
    is_billed: bool | None = False
    is_locked: bool | None = False


class AnalysisRequestBaseInDB(AnalysisRequestBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisRequestCreate(AnalysisRequestBase):
    pass


# Properties to receive via API on update
class AnalysisRequestUpdate(AnalysisRequestBase):
    pass


# Properties to return via API
class AnalysisRequest(AnalysisRequestBaseInDB):
    pass


# Properties stored in DB
class AnalysisRequestInDB(AnalysisRequestBaseInDB):
    pass


#
# ClinicalData Schemas
#

# Shared properties
class ClinicalDataBase(BaseAuditModel):
    analysis_request_uid: str | None = None
    symptoms: list[str] | None
    symptoms_raw: str | None
    clinical_indication: str | None
    pregnancy_status: bool | None = False
    breast_feeding: bool | None = False
    vitals: dict | None
    treatment_notes: str | None
    other_context: dict | None


class ClinicalDataBaseInDB(ClinicalDataBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ClinicalDataCreate(ClinicalDataBase):
    pass


# Properties to receive via API on update
class ClinicalDataUpdate(ClinicalDataBase):
    pass


# Properties to return via API
class ClinicalData(ClinicalDataBaseInDB):
    pass


# Properties stored in DB
class ClinicalDataInDB(ClinicalDataBaseInDB):
    pass


#
# ClinicalDataCoding Schemas
#

# Shared properties
class ClinicalDataCodingBase(BaseAuditModel):
    clinical_data_uid: str | None
    coding_standard_uid: str | None
    code: str | None
    name: str | None
    description: str | None


class ClinicalDataCodingBaseInDB(ClinicalDataCodingBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ClinicalDataCodingCreate(ClinicalDataCodingBase):
    pass


# Properties to receive via API on update
class ClinicalDataCodingUpdate(ClinicalDataCodingBase):
    pass


# Properties to return via API
class ClinicalDataCoding(ClinicalDataCodingBaseInDB):
    pass


# Properties stored in DB
class ClinicalDataCodingInDB(ClinicalDataCodingBaseInDB):
    pass


#
# Sample Schemas
#


# Shared properties
class SampleBase(BaseAuditModel):
    analysis_request_uid: str | None = None
    sample_type_uid: str | None = None
    profiles: Optional[List[Profile]] = field(default_factory=list)
    analyses: Optional[List[Analysis]] = field(default_factory=list)
    sample_id: str | None = None
    priority: int | None = 0
    invalidated_by_uid: str | None = None
    date_invalidated: datetime | None = None
    internal_use: bool | None = False
    due_date: datetime | None = None
    date_collected: datetime | None = None
    status: str | None = None


class SampleBaseInDB(SampleBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class SampleCreate(SampleBase):
    metadata_snapshot: dict


# Properties to receive via API on update
class SampleUpdate(SampleBase):
    pass


# Properties to return via API
class Sample(SampleBaseInDB):
    pass


# Properties stored in DB
class SampleInDB(SampleBaseInDB):
    pass


#
# Rejection Reason Schemas
#


# Shared properties
class RejectionReasonBase(BaseAuditModel):
    reason: str | None = None


class RejectionReasonBaseInDB(RejectionReasonBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class RejectionReasonCreate(RejectionReasonBase):
    pass


# Properties to receive via API on update
class RejectionReasonUpdate(RejectionReasonBase):
    pass


# Properties to return via API
class RejectionReason(RejectionReasonBaseInDB):
    pass


# Properties stored in DB
class RejectionReasonInDB(RejectionReasonBaseInDB):
    pass


#
# AnalysisResultBase Schemas
#


# Shared properties
class AnalysisResultBase(BaseAuditModel):
    analysis_uid: str | None = None
    parent_id: str | None = None
    sample_uid: str | None = None
    instrument_uid: str | None = None
    method_uid: str | None = None
    result: str | None = None
    analyst_uid: str | None = None
    submitted_by_uid: str | None = None
    date_submitted: datetime | None = None
    date_verified: datetime | None = None
    invalidated_by_uid: str | None = None
    date_invalidated: datetime | None = None
    status: str | None = None
    worksheet_uid: str | None = None
    worksheet_position: int | None = None
    assigned: bool | None = False
    retest: bool | None = False
    reportable: bool | None = True
    reflex_level: int | None = None


class AnalysisResultBaseInDB(AnalysisResultBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisResultCreate(AnalysisResultBase):
    metadata_snapshot: dict


# Properties to receive via API on update
class AnalysisResultUpdate(AnalysisResultBase):
    pass


# Properties to return via API
class AnalysisResult(AnalysisResultBaseInDB):
    pass


# Properties stored in DB
class AnalysisResultInDB(AnalysisResultBaseInDB):
    pass


#
# QCSet Schemas
#


# Shared properties
class QCSetBase(BaseAuditModel):
    name: str | None = None
    note: str | None = None


class QCSetBaseInDB(QCSetBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class QCSetCreate(QCSetBase):
    pass


# Properties to receive via API on update
class QCSetUpdate(QCSetBase):
    pass


# Properties to return via API
class QCSet(QCSetBaseInDB):
    pass


# Properties stored in DB
class QCSetInDB(QCSetBaseInDB):
    pass


#
# QCLevel Schemas
#


# Shared properties
class QCLevelBase(BaseAuditModel):
    level: str | None = None


class QCLevelBaseInDB(QCLevelBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class QCLevelCreate(QCLevelBase):
    pass


# Properties to receive via API on update
class QCLevelUpdate(QCLevelBase):
    pass


# Properties to return via API
class QCLevel(QCLevelBaseInDB):
    pass


# Properties stored in DB
class QCLevelInDB(QCLevelBaseInDB):
    pass


#
# QCTemplate Schemas
#


# Shared properties
class QCTemplateBase(BaseAuditModel):
    name: str | None = None
    description: str | None = None
    departments: Optional[List[Department]] = field(default_factory=list)
    qc_levels: Optional[List[QCLevel]] = field(default_factory=list)


class QCTemplateBaseInDB(QCTemplateBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class QCTemplateCreate(QCTemplateBase):
    pass


# Properties to receive via API on update
class QCTemplateUpdate(QCTemplateBase):
    pass


# Properties to return via API
class QCTemplate(QCTemplateBaseInDB):
    pass


# Properties stored in DB
class QCTemplateInDB(QCTemplateBaseInDB):
    pass
