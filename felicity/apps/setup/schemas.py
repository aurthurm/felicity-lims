from typing import Optional

from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Dict, List, Optional, Union, Any
from pydantic import BaseModel, ConfigDict, EmailStr, Field, validator

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
class LaboratoryCreate(BaseModel):
    """Enhanced laboratory creation schema with comprehensive setup options"""
    name: str = Field(..., min_length=3, max_length=200, description="Laboratory name")
    code: Optional[str] = Field(None, max_length=50, description="Laboratory code (auto-generated if not provided)")
    organization_uid: str = Field(..., description="Organization UID this laboratory belongs to")
    
    # Contact Information
    email: Optional[EmailStr] = Field(None, description="Laboratory email address")
    email_cc: Optional[str] = Field(None, description="CC email addresses (comma-separated)")
    mobile_phone: Optional[str] = Field(None, max_length=20, description="Laboratory mobile phone")
    business_phone: Optional[str] = Field(None, max_length=20, description="Laboratory business phone")
    address: Optional[str] = Field(None, max_length=500, description="Laboratory physical address")
    
    # Location
    country_uid: Optional[str] = Field(None, description="Country UID")
    province_uid: Optional[str] = Field(None, description="Province/State UID")
    district_uid: Optional[str] = Field(None, description="District/City UID")
    
    # Management
    lab_manager_uid: Optional[str] = Field(None, description="Laboratory manager user UID")
    
    # Laboratory Information
    laboratory_type: str = Field(default="clinical", description="Type of laboratory")
    accreditation_number: Optional[str] = Field(None, max_length=100, description="Laboratory accreditation number")
    license_number: Optional[str] = Field(None, max_length=100, description="Laboratory license number")
    registration_number: Optional[str] = Field(None, max_length=100, description="Laboratory registration number")
    
    # Settings
    timezone: str = Field(default="UTC", description="Laboratory timezone")
    is_active: bool = Field(default=True, description="Whether laboratory is active")
    is_reference_lab: bool = Field(default=False, description="Whether this is a reference laboratory")
    
    # Setup Options
    default_departments: List[str] = Field(default_factory=lambda: ["Clinical", "Microbiology", "Chemistry"], 
                                         description="Default departments to create")
    create_default_settings: bool = Field(default=True, description="Create default laboratory settings")
    
    @validator('name')
    def validate_name(cls, v):
        if not v.replace(' ', '').replace('-', '').replace('_', '').isalnum():
            raise ValueError("Laboratory name can only contain letters, numbers, spaces, hyphens, and underscores")
        return v.strip()
    
    @validator('code')
    def validate_code(cls, v):
        if v and not v.replace('-', '').replace('_', '').isalnum():
            raise ValueError("Laboratory code can only contain letters, numbers, hyphens, and underscores")
        return v.upper() if v else v
    
    @validator('laboratory_type')
    def validate_laboratory_type(cls, v):
        allowed_types = ["clinical", "research", "reference", "veterinary", "environmental", "forensic", "other"]
        if v.lower() not in allowed_types:
            raise ValueError(f"Laboratory type must be one of: {', '.join(allowed_types)}")
        return v.lower()

class LaboratoryUpdate(BaseModel):
    """Enhanced laboratory update schema"""
    name: Optional[str] = Field(None, min_length=3, max_length=200)
    code: Optional[str] = Field(None, max_length=50)
    
    # Contact Information
    email: Optional[EmailStr] = None
    email_cc: Optional[str] = None
    mobile_phone: Optional[str] = Field(None, max_length=20)
    business_phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None, max_length=500)
    
    # Location
    country_uid: Optional[str] = None
    province_uid: Optional[str] = None
    district_uid: Optional[str] = None
    
    # Management
    lab_manager_uid: Optional[str] = None
    
    # Laboratory Information
    laboratory_type: Optional[str] = None
    accreditation_number: Optional[str] = Field(None, max_length=100)
    license_number: Optional[str] = Field(None, max_length=100)
    registration_number: Optional[str] = Field(None, max_length=100)
    
    # Settings
    timezone: Optional[str] = None
    is_active: Optional[bool] = None
    is_reference_lab: Optional[bool] = None
    
    @validator('name')
    def validate_name(cls, v):
        if v and not v.replace(' ', '').replace('-', '').replace('_', '').isalnum():
            raise ValueError("Laboratory name can only contain letters, numbers, spaces, hyphens, and underscores")
        return v.strip() if v else v
    
    @validator('code')
    def validate_code(cls, v):
        if v and not v.replace('-', '').replace('_', '').isalnum():
            raise ValueError("Laboratory code can only contain letters, numbers, hyphens, and underscores")
        return v.upper() if v else v
    
    @validator('laboratory_type')
    def validate_laboratory_type(cls, v):
        if v:
            allowed_types = ["clinical", "research", "reference", "veterinary", "environmental", "forensic", "other"]
            if v.lower() not in allowed_types:
                raise ValueError(f"Laboratory type must be one of: {', '.join(allowed_types)}")
            return v.lower()
        return v

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


class LaboratorySettingCreate(BaseModel):
    """Laboratory setting creation schema"""
    laboratory_uid: Optional[str] = None  # Set automatically during creation
    
    # Authentication & Security
    password_lifetime: int = Field(default=90, ge=30, le=365, description="Password lifetime in days")
    inactivity_log_out: int = Field(default=30, ge=5, le=120, description="Inactivity logout time in minutes")
    allow_self_verification: bool = Field(default=False, description="Allow users to verify their own results")
    require_two_factor: bool = Field(default=False, description="Require two-factor authentication")
    
    # Workflow Settings
    allow_patient_registration: bool = Field(default=True, description="Allow patient registration")
    allow_sample_registration: bool = Field(default=True, description="Allow sample registration")
    allow_worksheet_creation: bool = Field(default=True, description="Allow worksheet creation")
    auto_receive_samples: bool = Field(default=False, description="Automatically receive samples")
    auto_assign_worksheets: bool = Field(default=False, description="Automatically assign samples to worksheets")
    
    # Quality Control
    qc_frequency: str = Field(default="daily", description="QC sample frequency")
    qc_percentage: float = Field(default=5.0, ge=0.0, le=100.0, description="QC sample percentage")
    require_qc_approval: bool = Field(default=True, description="Require QC approval before releasing results")
    
    # Reporting
    default_report_format: str = Field(default="pdf", description="Default report format")
    auto_release_results: bool = Field(default=False, description="Automatically release results")
    require_result_verification: bool = Field(default=True, description="Require result verification")
    allow_provisional_results: bool = Field(default=False, description="Allow provisional results")
    
    # Billing
    allow_billing: bool = Field(default=False, description="Enable billing functionality")
    currency: str = Field(default="USD", max_length=3, description="Laboratory currency")
    payment_terms_days: int = Field(default=30, ge=0, le=365, description="Payment terms in days")
    
    # Data Retention
    sample_retention_days: int = Field(default=3650, ge=365, description="Sample retention period in days")
    result_retention_days: int = Field(default=2555, ge=365, description="Result retention period in days")  # 7 years
    audit_retention_days: int = Field(default=2555, ge=365, description="Audit log retention period in days")
    
    # Integration Settings
    external_system_integration: bool = Field(default=False, description="Enable external system integration")
    lis_integration_enabled: bool = Field(default=False, description="Enable LIS integration")
    hl7_enabled: bool = Field(default=False, description="Enable HL7 messaging")
    
    @validator('qc_frequency')
    def validate_qc_frequency(cls, v):
        allowed_frequencies = ["daily", "weekly", "monthly", "per_batch", "custom"]
        if v.lower() not in allowed_frequencies:
            raise ValueError(f"QC frequency must be one of: {', '.join(allowed_frequencies)}")
        return v.lower()
    
    @validator('default_report_format')
    def validate_report_format(cls, v):
        allowed_formats = ["pdf", "html", "excel", "csv", "xml"]
        if v.lower() not in allowed_formats:
            raise ValueError(f"Report format must be one of: {', '.join(allowed_formats)}")
        return v.lower()
    
    @validator('currency')
    def validate_currency(cls, v):
        # Basic currency code validation
        if len(v) != 3 or not v.isalpha():
            raise ValueError("Currency must be a 3-letter ISO code")
        return v.upper()

class LaboratorySettingUpdate(BaseModel):
    """Laboratory settings update schema"""
    # Authentication & Security
    password_lifetime: Optional[int] = Field(None, ge=30, le=365)
    inactivity_log_out: Optional[int] = Field(None, ge=5, le=120)
    allow_self_verification: Optional[bool] = None
    require_two_factor: Optional[bool] = None
    
    # Workflow Settings
    allow_patient_registration: Optional[bool] = None
    allow_sample_registration: Optional[bool] = None
    allow_worksheet_creation: Optional[bool] = None
    auto_receive_samples: Optional[bool] = None
    auto_assign_worksheets: Optional[bool] = None
    
    # Quality Control
    qc_frequency: Optional[str] = None
    qc_percentage: Optional[float] = Field(None, ge=0.0, le=100.0)
    require_qc_approval: Optional[bool] = None
    
    # Reporting
    default_report_format: Optional[str] = None
    auto_release_results: Optional[bool] = None
    require_result_verification: Optional[bool] = None
    allow_provisional_results: Optional[bool] = None
    
    # Billing
    allow_billing: Optional[bool] = None
    currency: Optional[str] = Field(None, max_length=3)
    payment_terms_days: Optional[int] = Field(None, ge=0, le=365)
    
    # Data Retention
    sample_retention_days: Optional[int] = Field(None, ge=365)
    result_retention_days: Optional[int] = Field(None, ge=365)
    audit_retention_days: Optional[int] = Field(None, ge=365)
    
    # Integration Settings
    external_system_integration: Optional[bool] = None
    lis_integration_enabled: Optional[bool] = None
    hl7_enabled: Optional[bool] = None
    
    @validator('qc_frequency')
    def validate_qc_frequency(cls, v):
        if v:
            allowed_frequencies = ["daily", "weekly", "monthly", "per_batch", "custom"]
            if v.lower() not in allowed_frequencies:
                raise ValueError(f"QC frequency must be one of: {', '.join(allowed_frequencies)}")
            return v.lower()
        return v
    
    @validator('default_report_format')
    def validate_report_format(cls, v):
        if v:
            allowed_formats = ["pdf", "html", "excel", "csv", "xml"]
            if v.lower() not in allowed_formats:
                raise ValueError(f"Report format must be one of: {', '.join(allowed_formats)}")
            return v.lower()
        return v
    
    @validator('currency')
    def validate_currency(cls, v):
        if v:
            if len(v) != 3 or not v.isalpha():
                raise ValueError("Currency must be a 3-letter ISO code")
            return v.upper()
        return v



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




# Laboratory Templates and Cloning

class LaboratoryTemplate(BaseModel):
    """Laboratory template for cloning and standardization"""
    name: str = Field(..., description="Template name")
    description: Optional[str] = Field(None, description="Template description")
    laboratory_type: str = Field(..., description="Type of laboratory this template is for")
    
    # Template Configuration
    settings: LaboratorySettingCreate
    default_departments: List[str] = Field(default_factory=list)
    default_user_roles: Dict[str, str] = Field(default_factory=dict)  # role_name -> role_description
    
    # Compliance Requirements
    required_accreditations: List[str] = Field(default_factory=list)
    required_licenses: List[str] = Field(default_factory=list)
    compliance_standards: List[str] = Field(default_factory=list)  # ISO, CAP, etc.
    
    # Integration Configuration
    integration_requirements: Dict[str, Any] = Field(default_factory=dict)
    
    # Metadata
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    version: str = Field(default="1.0.0", description="Template version")
    is_active: bool = Field(default=True)

class LaboratoryCloneRequest(BaseModel):
    """Request to clone a laboratory"""
    source_laboratory_uid: str = Field(..., description="Source laboratory to clone from")
    new_laboratory_name: str = Field(..., description="Name for the new laboratory")
    new_laboratory_code: Optional[str] = Field(None, description="Code for the new laboratory")
    organization_uid: str = Field(..., description="Organization for the new laboratory")
    
    # Clone Options
    clone_settings: bool = Field(default=True, description="Clone laboratory settings")
    clone_departments: bool = Field(default=True, description="Clone departments")
    clone_users: bool = Field(default=False, description="Clone user assignments")
    clone_user_roles: bool = Field(default=True, description="Clone user roles if cloning users")
    
    # New Laboratory Configuration
    lab_manager_uid: Optional[str] = Field(None, description="Manager for the new laboratory")
    location_overrides: Dict[str, str] = Field(default_factory=dict, description="Location field overrides")

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

# Bulk Operations

class BulkLaboratoryOperation(BaseModel):
    """Bulk operation on multiple laboratories"""
    operation_type: str = Field(..., description="Type of bulk operation")
    laboratory_uids: List[str] = Field(..., description="List of laboratory UIDs")
    operation_data: Dict[str, Any] = Field(default_factory=dict, description="Operation-specific data")
    validate_before_execute: bool = Field(default=True, description="Validate all items before executing")

class BulkOperationResult(BaseModel):
    """Result of bulk operations on laboratories"""
    operation_type: str
    total_attempted: int
    total_successful: int
    total_failed: int
    successful_items: List[str]
    failed_items: Dict[str, str]  # laboratory_uid -> error_message
    warnings: List[str] = Field(default_factory=list)
    execution_time: Optional[float] = None

# Validation and Compliance

class LaboratoryValidationResult(BaseModel):
    """Laboratory validation result"""
    laboratory_uid: str
    is_valid: bool
    has_dependencies: bool
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    dependencies: Dict[str, Any] = Field(default_factory=dict)  # dependency_type -> count/details

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

# Search and Filtering

class LaboratorySearchFilter(BaseModel):
    """Laboratory search and filtering options"""
    text: Optional[str] = None
    organization_uid: Optional[str] = None
    laboratory_type: Optional[str] = None
    country_uid: Optional[str] = None
    province_uid: Optional[str] = None
    district_uid: Optional[str] = None
    is_active: Optional[bool] = None
    is_reference_lab: Optional[bool] = None
    has_manager: Optional[bool] = None
    accreditation_status: Optional[str] = None
    limit: int = Field(default=50, le=100)
    offset: int = Field(default=0, ge=0)
    sort_by: str = Field(default="name")
    sort_order: str = Field(default="asc", pattern="^(asc|desc)$")

# Response Models

class LaboratoryCreationResponse(BaseModel):
    """Response for laboratory creation operations"""
    success: bool
    laboratory_uid: Optional[str] = None
    laboratory_code: Optional[str] = None
    errors: Dict[str, List[str]] = Field(default_factory=dict)
    warnings: List[str] = Field(default_factory=list)
    created_departments: List[str] = Field(default_factory=list)
    settings_created: bool = False

class LaboratoryUpdateResponse(BaseModel):
    """Response for laboratory update operations"""
    success: bool
    updated_fields: List[str] = Field(default_factory=list)
    errors: Dict[str, List[str]] = Field(default_factory=dict)
    warnings: List[str] = Field(default_factory=list)

class LaboratoryDeletionResponse(BaseModel):
    """Response for laboratory deletion operations"""
    success: bool
    cleanup_results: Dict[str, Any] = Field(default_factory=dict)
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)

class LaboratoryAssignmentResponse(BaseModel):
    """Response for laboratory user assignment operations"""
    success: bool
    laboratory_uid: str
    assigned_users: List[str] = Field(default_factory=list)
    failed_assignments: Dict[str, str] = Field(default_factory=dict)
    warnings: List[str] = Field(default_factory=list)