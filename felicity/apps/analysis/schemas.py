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
    name: Optional[str] = None
    description: Optional[str] = None
    abbr: Optional[str] = None
    internal_use: Optional[bool] = False
    active: Optional[bool] = True


class SampleTypeBaseInDB(SampleTypeBase):
    uid: Optional[FelicityIDType] = None

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
    name: Optional[str]
    analyses: Optional[List["Analysis"]]
    sample_types: Optional[List[SampleType]]
    description: Optional[str] = None
    department_uid: Optional[FelicityIDType] = None
    keyword: Optional[str] = None
    tat_length_minutes: Optional[int] = None
    active: Optional[bool] = True


class ProfileBaseInDB(ProfileBase):
    uid: Optional[FelicityIDType] = None

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
    name: Optional[str] = None
    description: Optional[str] = None
    department_uid: Optional[FelicityIDType] = None
    active: Optional[bool] = True


class AnalysisCategoryBaseInDB(AnalysisCategoryBase):
    uid: Optional[FelicityIDType] = None

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
    name: Optional[str] = None
    keyword: Optional[str] = None


# Shared properties
class AnalysisBase(BaseAuditModel):
    name: Optional[str] = None
    description: Optional[str] = None
    keyword: Optional[str] = None
    profiles: Optional[List[Profile]] = []
    sample_types: Optional[List[SampleType]] = []
    tat_length_minutes: Optional[int] = None
    unit: Optional[str] = None
    category_uid: Optional[FelicityIDType]
    sort_key: Optional[int] = 0
    internal_use: Optional[bool] = False
    tat_length_minutes: Optional[int] = None
    precision: Optional[int] = None
    required_verifications: int = 1
    self_verification: Optional[bool] = False
    active: Optional[bool] = True


class AnalysisBasic(AnalysisBasicBase):
    uid: Optional[FelicityIDType] = None

    class Config:
        orm_mode = True


class AnalysisBaseInDB(AnalysisBase):
    uid: Optional[FelicityIDType] = None

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
    uid: Optional[FelicityIDType] = None

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
    uid: Optional[FelicityIDType] = None

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
    uid: Optional[FelicityIDType] = None

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
    uid: Optional[FelicityIDType] = None

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
    min: Optional[float] = None
    max: Optional[float] = None
    min_warn: Optional[float] = None
    max_warn: Optional[float] = None
    min_report: Optional[str] = None
    max_report: Optional[str] = None
    warn_values: Optional[str] = None
    warn_report: Optional[str] = None
    gender: Optional[str] = None
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    method_uid: Optional[FelicityIDType] = None
    unit_uid: Optional[FelicityIDType] = None
    unit: Optional[Unit]


class AnalysisSpecificationBaseInDB(AnalysisSpecificationBase):
    uid: Optional[FelicityIDType] = None

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
    option_key: Optional[int] = None
    value: Optional[str] = None
    analysis_uid: Optional[FelicityIDType] = None


class ResultOptionBaseInDB(ResultOptionBase):
    uid: Optional[FelicityIDType] = None

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
    patient_uid: Optional[FelicityIDType] = None
    client_uid: Optional[FelicityIDType] = None
    request_id: Optional[str] = None
    client_request_id: Optional[str] = None
    internal_use: Optional[bool] = False


class AnalysisRequestBaseInDB(AnalysisRequestBase):
    uid: Optional[FelicityIDType] = None

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
    analysis_request_uid: Optional[FelicityIDType] = None
    sample_type_uid: Optional[FelicityIDType] = None
    profiles: Optional[List[Profile]] = []
    analyses: Optional[List[Analysis]] = []
    sample_id: Optional[str] = None
    priority: Optional[int] = 0
    invalidated_by_uid: Optional[FelicityIDType] = None
    date_invalidated: Optional[datetime] = None
    internal_use: Optional[bool] = False
    due_date: Optional[datetime] = None
    status: Optional[str] = None


class SampleBaseInDB(SampleBase):
    uid: Optional[FelicityIDType] = None

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
    reason: Optional[str] = None


class RejectionReasonBaseInDB(RejectionReasonBase):
    uid: Optional[FelicityIDType] = None

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
    analysis_uid: Optional[FelicityIDType] = None
    parent_id: Optional[FelicityIDType] = None
    sample_uid: Optional[FelicityIDType] = None
    instrument_uid: Optional[FelicityIDType] = None
    method_uid: Optional[FelicityIDType] = None
    result: Optional[str] = None
    analyst_uid: Optional[FelicityIDType] = None
    submitted_by_uid: Optional[FelicityIDType] = None
    date_submitted: Optional[datetime] = None
    date_verified: Optional[datetime] = None
    invalidated_by_uid: Optional[FelicityIDType] = None
    date_invalidated: Optional[datetime] = None
    status: Optional[str] = None
    worksheet_uid: Optional[FelicityIDType] = None
    worksheet_position: Optional[int] = None
    assigned: Optional[bool] = False
    retest: Optional[bool] = False
    reportable: Optional[bool] = True
    reflex_level: Optional[int] = None


class AnalysisResultBaseInDB(AnalysisResultBase):
    uid: Optional[FelicityIDType] = None

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
    name: Optional[str] = None
    note: Optional[str] = None


class QCSetBaseInDB(QCSetBase):
    uid: Optional[FelicityIDType] = None

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
    level: Optional[str] = None


class QCLevelBaseInDB(QCLevelBase):
    uid: Optional[FelicityIDType] = None

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
    name: Optional[str] = None
    description: Optional[str] = None
    departments: Optional[List[Department]] = []
    qc_levels: Optional[List[QCLevel]] = []


class QCTemplateBaseInDB(QCTemplateBase):
    uid: Optional[FelicityIDType] = None

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
