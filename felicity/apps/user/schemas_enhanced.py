from datetime import datetime
from typing import Dict, List, Optional, Union
from pydantic import BaseModel, ConfigDict, EmailStr, Field, validator

from felicity.apps.common.schemas import BaseAuditModel


# Enhanced User Schemas

class UserLaboratoryAssignment(BaseModel):
    """User-Laboratory assignment details"""
    laboratory_uid: str
    role_in_laboratory: str = "user"
    assigned_at: Optional[datetime] = None
    assigned_by_uid: Optional[str] = None

class UserValidationRules(BaseModel):
    """User validation rules configuration"""
    min_username_length: int = 3
    min_password_length: int = 8
    require_password_complexity: bool = True
    allow_email_as_username: bool = False
    require_unique_email: bool = True

class EnhancedUserCreate(BaseModel):
    """Enhanced user creation schema with multi-tenant support"""
    user_name: str = Field(..., min_length=3, max_length=50)
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    mobile_phone: Optional[str] = Field(None, max_length=20)
    business_phone: Optional[str] = Field(None, max_length=20)
    
    # Laboratory assignments
    laboratory_uids: List[str] = Field(default_factory=list, description="List of laboratory UIDs to assign user to")
    laboratory_roles: Optional[Dict[str, str]] = Field(default_factory=dict, description="Role mapping per laboratory")
    active_laboratory_uid: Optional[str] = Field(None, description="Default active laboratory")
    
    # Account settings
    is_active: bool = True
    is_superuser: bool = False
    send_welcome_email: bool = True
    
    # Profile information
    profile_picture: Optional[str] = None
    bio: Optional[str] = Field(None, max_length=500)
    department: Optional[str] = Field(None, max_length=100)
    position: Optional[str] = Field(None, max_length=100)
    
    @validator('laboratory_uids')
    def validate_laboratory_uids(cls, v):
        if not v:
            raise ValueError("User must be assigned to at least one laboratory")
        return v
    
    @validator('active_laboratory_uid')
    def validate_active_laboratory(cls, v, values):
        if v and 'laboratory_uids' in values and v not in values['laboratory_uids']:
            raise ValueError("Active laboratory must be in assigned laboratories")
        return v
    
    @validator('user_name')
    def validate_username(cls, v):
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError("Username can only contain letters, numbers, hyphens, and underscores")
        return v.lower()
    
    @validator('first_name', 'last_name')
    def validate_names(cls, v):
        if not v.replace(' ', '').replace('-', '').replace("'", '').isalpha():
            raise ValueError("Names can only contain letters, spaces, hyphens, and apostrophes")
        return v.title()

class EnhancedUserUpdate(BaseModel):
    """Enhanced user update schema"""
    user_name: Optional[str] = Field(None, min_length=3, max_length=50)
    first_name: Optional[str] = Field(None, min_length=2, max_length=100)
    last_name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    mobile_phone: Optional[str] = Field(None, max_length=20)
    business_phone: Optional[str] = Field(None, max_length=20)
    
    # Account settings
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    active_laboratory_uid: Optional[str] = None
    
    # Profile information
    profile_picture: Optional[str] = None
    bio: Optional[str] = Field(None, max_length=500)
    department: Optional[str] = Field(None, max_length=100)
    position: Optional[str] = Field(None, max_length=100)
    
    @validator('user_name')
    def validate_username(cls, v):
        if v and not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError("Username can only contain letters, numbers, hyphens, and underscores")
        return v.lower() if v else v
    
    @validator('first_name', 'last_name')
    def validate_names(cls, v):
        if v and not v.replace(' ', '').replace('-', '').replace("'", '').isalpha():
            raise ValueError("Names can only contain letters, spaces, hyphens, and apostrophes")
        return v.title() if v else v

class BatchUserCreate(BaseModel):
    """Schema for batch user creation"""
    users: List[EnhancedUserCreate]
    default_laboratory_uid: Optional[str] = None
    default_role: str = "user"
    send_welcome_emails: bool = True
    validate_all_before_create: bool = True

class BulkLaboratoryAssignment(BaseModel):
    """Schema for bulk laboratory assignment"""
    user_uids: List[str]
    laboratory_uid: str
    role: str = "user"
    replace_existing: bool = False
    set_as_active: bool = False

class UserLaboratoryRole(BaseModel):
    """User laboratory role assignment"""
    user_uid: str
    laboratory_uid: str
    role: str
    assigned_by: Optional[str] = None
    assigned_at: Optional[datetime] = None

class UserValidationResult(BaseModel):
    """User validation result"""
    is_valid: bool
    errors: Dict[str, List[str]] = Field(default_factory=dict)
    warnings: Dict[str, List[str]] = Field(default_factory=dict)
    sanitized_data: Optional[Dict] = None

class UserActivitySummary(BaseModel):
    """User activity and access summary"""
    user_uid: str
    total_laboratories: int
    active_laboratory_uid: Optional[str]
    laboratories: List[str]
    groups: List[str]
    permissions_count: int
    last_login: Optional[datetime]
    account_status: str
    recent_activities: List[Dict]

class UserSearchFilter(BaseModel):
    """User search and filtering options"""
    text: Optional[str] = None
    laboratory_uid: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    is_blocked: Optional[bool] = None
    is_superuser: Optional[bool] = None
    department: Optional[str] = None
    position: Optional[str] = None
    limit: int = Field(default=50, le=100)
    offset: int = Field(default=0, ge=0)

class PasswordResetRequest(BaseModel):
    """Password reset request"""
    email_or_username: str
    laboratory_context: Optional[str] = None

class PasswordReset(BaseModel):
    """Password reset confirmation"""
    token: str
    new_password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v

class UserProfileUpdate(BaseModel):
    """User profile update (self-service)"""
    first_name: Optional[str] = Field(None, min_length=2, max_length=100)
    last_name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    mobile_phone: Optional[str] = Field(None, max_length=20)
    business_phone: Optional[str] = Field(None, max_length=20)
    profile_picture: Optional[str] = None
    bio: Optional[str] = Field(None, max_length=500)
    
    @validator('first_name', 'last_name')
    def validate_names(cls, v):
        if v and not v.replace(' ', '').replace('-', '').replace("'", '').isalpha():
            raise ValueError("Names can only contain letters, spaces, hyphens, and apostrophes")
        return v.title() if v else v

# Enhanced Group Schemas

class EnhancedGroupCreate(BaseModel):
    """Enhanced group creation schema"""
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    laboratory_uid: Optional[str] = None
    is_active: bool = True
    pages: Optional[List[str]] = Field(default_factory=list)
    permissions: Optional[List[str]] = Field(default_factory=list)
    
    @validator('name')
    def validate_name(cls, v):
        if not v.replace(' ', '').replace('_', '').replace('-', '').isalnum():
            raise ValueError("Group name can only contain letters, numbers, spaces, hyphens, and underscores")
        return v

class EnhancedGroupUpdate(BaseModel):
    """Enhanced group update schema"""
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None
    pages: Optional[List[str]] = None
    
    @validator('name')
    def validate_name(cls, v):
        if v and not v.replace(' ', '').replace('_', '').replace('-', '').isalnum():
            raise ValueError("Group name can only contain letters, numbers, spaces, hyphens, and underscores")
        return v

class GroupPermissionAssignment(BaseModel):
    """Group permission assignment"""
    group_uid: str
    permission_uids: List[str]
    laboratory_uid: Optional[str] = None
    replace_existing: bool = False

# Enhanced Permission Schemas

class EnhancedPermissionCreate(BaseModel):
    """Enhanced permission creation schema"""
    action: str = Field(..., min_length=1, max_length=100)
    target: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_active: bool = True
    category: Optional[str] = Field(None, max_length=50)
    
    @validator('action', 'target')
    def validate_action_target(cls, v):
        if not v.replace('_', '').replace('-', '').replace('.', '').isalnum():
            raise ValueError("Action and target can only contain alphanumeric characters, dots, hyphens, and underscores")
        return v.lower()

class EnhancedPermissionUpdate(BaseModel):
    """Enhanced permission update schema"""
    action: Optional[str] = Field(None, min_length=1, max_length=100)
    target: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None
    category: Optional[str] = Field(None, max_length=50)
    
    @validator('action', 'target')
    def validate_action_target(cls, v):
        if v and not v.replace('_', '').replace('-', '').replace('.', '').isalnum():
            raise ValueError("Action and target can only contain alphanumeric characters, dots, hyphens, and underscores")
        return v.lower() if v else v

class PermissionUsageSummary(BaseModel):
    """Permission usage summary"""
    permission_uid: str
    action: str
    target: str
    global_groups: List[str]
    laboratory_groups: Dict[str, List[str]]
    total_users_affected: int
    is_system_permission: bool

# Audit and Activity Schemas

class UserAuditEntry(BaseModel):
    """User audit log entry"""
    action: str
    target_uid: str
    performed_by: Optional[str]
    laboratory_context: Optional[str]
    details: Dict
    timestamp: datetime
    ip_address: Optional[str]

class ActivityLogFilter(BaseModel):
    """Activity log filtering options"""
    user_uid: Optional[str] = None
    action: Optional[str] = None
    laboratory_uid: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    limit: int = Field(default=50, le=100)
    offset: int = Field(default=0, ge=0)

# Multi-Tenant Operation Results

class BatchOperationResult(BaseModel):
    """Result of batch operations"""
    total_attempted: int
    total_successful: int
    total_failed: int
    successful_items: List[str]
    failed_items: Dict[str, str]  # item_id -> error_message
    warnings: List[str] = Field(default_factory=list)

class LaboratoryUserSummary(BaseModel):
    """Summary of users in a laboratory"""
    laboratory_uid: str
    laboratory_name: str
    total_users: int
    active_users: int
    users_by_role: Dict[str, int]
    recent_assignments: List[Dict]

class UserLaboratoryContext(BaseModel):
    """User's laboratory context information"""
    user_uid: str
    current_laboratory_uid: Optional[str]
    available_laboratories: List[Dict]
    can_switch_context: bool
    permissions_summary: Dict[str, List[str]]

# Response Models

class UserCreationResponse(BaseModel):
    """Response for user creation operations"""
    success: bool
    user_uid: Optional[str] = None
    errors: Dict[str, List[str]] = Field(default_factory=dict)
    warnings: List[str] = Field(default_factory=list)
    laboratory_assignments: List[UserLaboratoryAssignment] = Field(default_factory=list)

class UserUpdateResponse(BaseModel):
    """Response for user update operations"""
    success: bool
    updated_fields: List[str] = Field(default_factory=list)
    errors: Dict[str, List[str]] = Field(default_factory=dict)
    warnings: List[str] = Field(default_factory=list)

class LaboratoryAssignmentResponse(BaseModel):
    """Response for laboratory assignment operations"""
    success: bool
    user_uid: str
    assigned_laboratories: List[str] = Field(default_factory=list)
    removed_laboratories: List[str] = Field(default_factory=list)
    new_active_laboratory: Optional[str] = None
    errors: Dict[str, str] = Field(default_factory=dict)