from datetime import datetime
from typing import Dict, List, Optional, Any

from pydantic import BaseModel, ConfigDict, Field

from felicity.apps.common.schemas import BaseAuditModel


#
#  Organization
#

# Shared properties


class OrganizationBase(BaseModel):
    setup_name: str = "felicity"
    name: str | None = None
    code: str | None = None
    timezone: str | None = None
    tag_line: str | None = None
    email: str | None = None
    email_cc: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    address: str | None = None
    banking: str | None = None
    logo: str | None = None
    quality_statement: str | None = None
    country_uid: str | None = None
    province_uid: str | None = None
    district_uid: str | None = None


# Properties to receive via API on creation
class OrganizationCreate(OrganizationBase):
    pass


# Properties to receive via API on update
class OrganizationUpdate(OrganizationBase):
    pass


class OrganizationInDBBase(OrganizationBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class Organization(OrganizationInDBBase):
    pass


# Additional properties stored in DB
class OrganizationInDB(OrganizationInDBBase):
    pass


#
#  OrganizationSetting
#

# Shared properties


class OrganizationSettingBase(BaseModel):
    organization_uid: str
    password_lifetime: int | None = None
    inactivity_log_out: int | None = None
    allow_billing: bool | None = False
    allow_auto_billing: bool | None = False
    currency: str | None = None
    payment_terms_days: int | None = 30


# Properties to receive via API on creation
class OrganizationSettingCreate(OrganizationSettingBase):
    pass


# Properties to receive via API on update
class OrganizationSettingUpdate(OrganizationSettingBase):
    pass


class OrganizationSettingInDBBase(OrganizationSettingBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class OrganizationSetting(OrganizationSettingInDBBase):
    pass


# Additional properties stored in DB
class OrganizationSettingInDB(OrganizationSettingInDBBase):
    pass


#
#  Laboratory
#

# Shared properties


class LaboratoryBase(BaseModel):
    organization_uid: str
    name: str
    tag_line: str | None = None
    code: str | None = None
    lab_manager_uid: str | None = None
    email: str | None = None
    email_cc: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    address: str | None = None
    banking: str | None = None
    logo: str | None = None
    quality_statement: str | None = None
    country_uid: str | None = None
    province_uid: str | None = None
    district_uid: str | None = None


# Properties to receive via API on creation
class LaboratoryCreate(LaboratoryBase):
    pass


class LaboratoryUpdate(LaboratoryBase):
    pass


class LaboratoryInDBBase(LaboratoryBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class Laboratory(LaboratoryInDBBase):
    pass


# Additional properties stored in DB
class LaboratoryInDB(LaboratoryInDBBase):
    pass


class LaboratorySettingBase(BaseAuditModel):
    laboratory_uid: str | None = None
    laboratory: Optional[Laboratory] = None
    allow_self_verification: bool | None = False
    allow_patient_registration: bool | None = True
    allow_sample_registration: bool | None = True
    allow_worksheet_creation: bool | None = True
    default_route: str | None = None
    default_theme: str | None = None
    auto_receive_samples: bool | None = True
    sticker_copies: int | None = 2

    allow_billing: bool | None = False
    allow_auto_billing: bool | None = False
    currency: str | None = "USD"
    payment_terms_days: int = 0
    password_lifetime: int | None = None
    inactivity_log_out: int | None = None


class LaboratorySettingCreate(LaboratorySettingBase):
    pass


class LaboratorySettingUpdate(LaboratorySettingBase):
    pass


class LaboratorySetting(LaboratorySettingBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


#
#  Department
#


# Shared properties
class DepartmentBase(BaseModel):
    name: str
    description: str | None = None
    code: str | None = None


# Properties to receive via API on creation
class DepartmentCreate(DepartmentBase):
    pass


# Properties to receive via API on update
class DepartmentUpdate(DepartmentBase):
    pass


class DepartmentInDBBase(DepartmentBase):
    uid: str | None = None
    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class Department(DepartmentInDBBase):
    pass


# Additional properties stored in DB
class DepartmentInDB(DepartmentInDBBase):
    pass


#
#  Unit
#


# Shared properties
class UnitBase(BaseModel):
    name: str
    description: str | None = None


# Properties to receive via API on creation
class UnitCreate(UnitBase):
    pass


# Properties to receive via API on update
class UnitUpdate(UnitBase):
    pass


class UnitInDBBase(UnitBase):
    uid: str | None = None
    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class Unit(UnitInDBBase):
    pass


# Additional properties stored in DB
class UnitInDB(UnitInDBBase):
    pass


#
#  Supplier
#


# Shared properties
class SupplierBase(BaseModel):
    name: str | None = None
    description: str | None = None
    keyword: str | None = None


# Properties to receive via API on creation
class SupplierCreate(SupplierBase):
    pass


# Properties to receive via API on update
class SupplierUpdate(SupplierBase):
    pass


class SupplierInDBBase(SupplierBase):
    uid: str | None = None
    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class Supplier(SupplierInDBBase):
    pass


# Additional properties stored in DB
class SupplierInDB(SupplierInDBBase):
    pass


#
#  Manufacturer
#


# Shared properties
class ManufacturerBase(BaseModel):
    name: str | None = None
    description: str | None = None
    keyword: str | None = None


# Properties to receive via API on creation
class ManufacturerCreate(ManufacturerBase):
    pass


# Properties to receive via API on update
class ManufacturerUpdate(ManufacturerBase):
    pass


class ManufacturerInDBBase(ManufacturerBase):
    uid: str | None = None
    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class Manufacturer(ManufacturerInDBBase):
    pass


# Additional properties stored in DB
class ManufacturerInDB(ManufacturerInDBBase):
    pass


#
# Country s
#


# Shared properties
class CountryBase(BaseModel):
    name: str | None = None
    code: str | None = None
    active: bool | None = True


class CountryBaseInDB(CountryBase):
    uid: str | None = None
    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class CountryCreate(CountryBase):
    pass


# Properties to receive via API on update
class CountryUpdate(CountryBase):
    pass


# Properties to return via API
class Country(CountryBaseInDB):
    pass


# Properties stored in DB
class CountryInDB(CountryBaseInDB):
    pass


#
# Province s
#


# Shared properties
class ProvinceBase(BaseModel):
    name: str | None = None
    country_uid: str | None = None
    code: str | None = None
    email: str | None = None
    email_cc: str | None = None
    consent_email: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    consent_sms: str | None = None
    active: bool | None = True


class ProvinceBaseInDB(ProvinceBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ProvinceCreate(ProvinceBase):
    country_uid: str


# Properties to receive via API on update
class ProvinceUpdate(ProvinceBase):
    pass


# Properties to return via API
class Province(ProvinceBaseInDB):
    pass


# Properties stored in DB
class ProvinceInDB(ProvinceBaseInDB):
    pass


#
# District s
#


# Shared properties
class DistrictBase(BaseModel):
    name: str | None = None
    province_uid: str | None = None
    code: str | None = None
    email: str | None = None
    email_cc: str | None = None
    consent_email: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    consent_sms: str | None = None
    active: bool | None = True


class DistrictBaseInDB(DistrictBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DistrictCreate(DistrictBase):
    province_uid: str


# Properties to receive via API on update
class DistrictUpdate(DistrictBase):
    pass


# Properties to return via API
class District(DistrictBaseInDB):
    pass


# Properties stored in DB
class DistrictInDB(DistrictBaseInDB):
    pass


# Analytics and Reporting

class LaboratoryAnalytics(BaseModel):
    """Laboratory analytics and metrics"""
    laboratory_uid: str
    laboratory_name: str
    organization_name: Optional[str]
    date_from: datetime
    date_to: datetime

    # User Statistics
    total_users: int
    active_users: int
    inactive_users: int
    user_role_distribution: Dict[str, int]

    # Department Statistics
    total_departments: int
    department_names: List[str]

    # Activity Metrics
    recent_activities: List[Dict[str, Any]]

    # Configuration Metrics
    configuration_completeness: float  # Percentage of configuration completed
    compliance_score: float  # Compliance score percentage

    # Performance Indicators (placeholders for future implementation)
    sample_throughput: Optional[int] = None
    average_turnaround_time: Optional[float] = None
    quality_metrics: Optional[Dict[str, float]] = None


class LaboratoryUserSummary(BaseModel):
    """Summary of users in a laboratory"""
    laboratory_uid: str
    laboratory_name: str
    total_users: int
    active_users: int
    users_by_role: Dict[str, int]
    recent_assignments: List[Dict[str, Any]]
    user_activity_summary: Dict[str, Any]


class LaboratoryComplianceCheck(BaseModel):
    """Laboratory compliance check result"""
    laboratory_uid: str
    overall_score: float  # 0-100 percentage
    checks_passed: int
    total_checks: int
    compliance_items: List[Dict[str, Any]] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    last_checked: datetime = Field(default_factory=datetime.utcnow)


class ComplianceStandard(BaseModel):
    """Compliance standard definition"""
    standard_id: str = Field(..., description="Standard identifier (e.g., ISO-15189)")
    name: str = Field(..., description="Standard name")
    description: Optional[str] = None
    requirements: List[Dict[str, Any]] = Field(default_factory=list)
    applicable_laboratory_types: List[str] = Field(default_factory=list)
    is_mandatory: bool = Field(default=False)
