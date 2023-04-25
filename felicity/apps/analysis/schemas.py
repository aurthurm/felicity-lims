from datetime import datetime
from typing import List, Optional

from apps.common.schemas import BaseAuditModel, BaseModel
from apps.setup.schemas import Department, Unit
from core.uid_gen import FelicityIDType

#
# SampleType Schemas
#

# Shared properties


class SampleTypeBase(BaseAuditModel):
    name: str | None = None
    description: str | None = None
    abbr: str | None = None
    internal_use: bool| None = False
    active: bool| None = True


class SampleTypeBaseInDB(SampleTypeBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
# Profile Schemas
#

# Shared properties
class ProfileBase(BaseAuditModel):
    name: str | None
    analyses: Optional[List["Analysis"]]
    sample_types: Optional[List[SampleType]]
    description: str | None = None
    department_uid: FelicityIDType| None = None
    keyword: str | None = None
    tat_length_minutes: int | None = None
    active: bool| None = True


class ProfileBaseInDB(ProfileBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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


# AnalysisCategory Schemas
#

# Shared properties
class AnalysisCategoryBase(BaseAuditModel):
    name: str | None = None
    description: str | None = None
    department_uid: FelicityIDType| None = None
    active: bool| None = True


class AnalysisCategoryBaseInDB(AnalysisCategoryBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
    profiles: Optional[List[Profile]] = []
    sample_types: Optional[List[SampleType]] = []
    tat_length_minutes: int | None = None
    unit: str | None = None
    category_uid: FelicityIDType| None
    sort_key: int | None = 0
    internal_use: bool| None = False
    tat_length_minutes: int | None = None
    precision: int | None = None
    required_verifications: int = 1
    self_verification: bool| None = False
    active: bool| None = True


class AnalysisBasic(AnalysisBasicBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class AnalysisBaseInDB(AnalysisBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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


#
# AnalysisInterim Schemas
#

# Shared properties
class AnalysisInterimBase(BaseAuditModel):
    key: int
    value: str
    analysis_uid: FelicityIDType
    instrument_uid: FelicityIDType


class AnalysisInterimInDB(AnalysisInterimBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
    analysis_uid: FelicityIDType
    instrument_uid: FelicityIDType
    method_uid: FelicityIDType


class AnalysisCorrectionFactorBaseInDB(AnalysisCorrectionFactorBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
    lower_limit: str
    upper_limit: str
    analysis_uid: FelicityIDType
    instrument_uid: FelicityIDType
    method_uid: FelicityIDType


class AnalysisDetectionLimitBaseInDB(AnalysisDetectionLimitBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
    analysis_uid: FelicityIDType
    instrument_uid: FelicityIDType
    method_uid: FelicityIDType


class AnalysisUncertaintyBaseInDB(AnalysisUncertaintyBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
    analysis_uid: FelicityIDType
    min: float| None = None
    max: float| None = None
    min_warn: float| None = None
    max_warn: float| None = None
    min_report: str | None = None
    max_report: str | None = None
    warn_values: str | None = None
    warn_report: str | None = None
    gender: str | None = None
    age_min: int | None = None
    age_max: int | None = None
    method_uid: FelicityIDType| None = None
    unit_uid: FelicityIDType| None = None
    unit: Optional[Unit]


class AnalysisSpecificationBaseInDB(AnalysisSpecificationBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
    analysis_uid: FelicityIDType| None = None


class ResultOptionBaseInDB(ResultOptionBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
    patient_uid: FelicityIDType| None = None
    client_uid: FelicityIDType| None = None
    request_id: str | None = None
    client_request_id: str | None = None
    internal_use: bool| None = False


class AnalysisRequestBaseInDB(AnalysisRequestBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
# Sample Schemas
#

# Shared properties
class SampleBase(BaseAuditModel):
    analysis_request_uid: FelicityIDType| None = None
    sample_type_uid: FelicityIDType| None = None
    profiles: Optional[List[Profile]] = []
    analyses: Optional[List[Analysis]] = []
    sample_id: str | None = None
    priority: int | None = 0
    invalidated_by_uid: FelicityIDType| None = None
    date_invalidated: datetime | None = None
    internal_use: bool| None = False
    due_date: datetime | None = None
    status: str | None = None


class SampleBaseInDB(SampleBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class SampleCreate(SampleBase):
    pass


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
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
    analysis_uid: FelicityIDType| None = None
    parent_id: FelicityIDType| None = None
    sample_uid: FelicityIDType| None = None
    instrument_uid: FelicityIDType| None = None
    method_uid: FelicityIDType| None = None
    result: str | None = None
    analyst_uid: FelicityIDType| None = None
    submitted_by_uid: FelicityIDType| None = None
    date_submitted: datetime | None = None
    date_verified: datetime | None = None
    invalidated_by_uid: FelicityIDType| None = None
    date_invalidated: datetime | None = None
    status: str | None = None
    worksheet_uid: FelicityIDType| None = None
    worksheet_position: int | None = None
    assigned: bool| None = False
    retest: bool| None = False
    reportable: bool| None = True
    reflex_level: int | None = None


class AnalysisResultBaseInDB(AnalysisResultBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class AnalysisResultCreate(AnalysisResultBase):
    pass


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
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
    departments: Optional[List[Department]] = []
    qc_levels: Optional[List[QCLevel]] = []


class QCTemplateBaseInDB(QCTemplateBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


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
