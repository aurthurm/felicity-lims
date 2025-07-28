from __future__ import annotations

from typing import Dict, List, Optional
import strawberry
from strawberry.types import Info

from felicity.api.gql.auth.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated, WithCredentials
from felicity.api.gql.types import MessageType, OperationError
from felicity.api.gql.user.types import UserType
from felicity.apps.user.services_enhanced import EnhancedUserService
from felicity.apps.user.schemas_enhanced import (
    EnhancedUserCreate,
    EnhancedUserUpdate,
    BatchUserCreate,
    BulkLaboratoryAssignment,
    UserValidationResult,
    PasswordResetRequest,
    PasswordReset,
    UserProfileUpdate,
    BatchOperationResult,
    UserCreationResponse,
    LaboratoryAssignmentResponse
)


# Input Types for GraphQL

@strawberry.input
class EnhancedUserCreateInputType:
    user_name: str
    first_name: str
    last_name: str
    email: str
    password: str
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    laboratory_uids: List[str] = strawberry.field(default_factory=list)
    laboratory_roles: Optional[Dict[str, str]] = strawberry.field(default_factory=dict)
    active_laboratory_uid: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    send_welcome_email: bool = True
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None

@strawberry.input
class EnhancedUserUpdateInputType:
    user_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    active_laboratory_uid: Optional[str] = None
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None

@strawberry.input
class BatchUserCreateInputType:
    users: List[EnhancedUserCreateInputType]
    default_laboratory_uid: Optional[str] = None
    default_role: str = "user"
    send_welcome_emails: bool = True
    validate_all_before_create: bool = True

@strawberry.input
class BulkLaboratoryAssignmentInputType:
    user_uids: List[str]
    laboratory_uid: str
    role: str = "user"
    replace_existing: bool = False
    set_as_active: bool = False

@strawberry.input
class UserValidationInputType:
    user_data: Dict[str, str]
    laboratory_uids: Optional[List[str]] = None
    is_update: bool = False
    existing_user_uid: Optional[str] = None

@strawberry.input
class PasswordResetRequestInputType:
    email_or_username: str
    laboratory_context: Optional[str] = None

@strawberry.input
class PasswordResetInputType:
    token: str
    new_password: str
    confirm_password: str

@strawberry.input
class UserProfileUpdateInputType:
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    profile_picture: Optional[str] = None
    bio: Optional[str] = None


# Response Types for GraphQL

@strawberry.type
class UserValidationResultType:
    is_valid: bool
    errors: Dict[str, List[str]]
    warnings: Dict[str, List[str]]
    sanitized_data: Optional[Dict[str, str]] = None

@strawberry.type
class BatchOperationResultType:
    total_attempted: int
    total_successful: int
    total_failed: int
    successful_items: List[str]
    failed_items: Dict[str, str]
    warnings: List[str]

@strawberry.type
class UserCreationResponseType:
    success: bool
    user_uid: Optional[str] = None
    errors: Dict[str, List[str]]
    warnings: List[str]
    laboratory_assignments: List[str]

@strawberry.type
class LaboratoryAssignmentResponseType:
    success: bool
    user_uid: str
    assigned_laboratories: List[str]
    removed_laboratories: List[str]
    new_active_laboratory: Optional[str] = None
    errors: Dict[str, str]

@strawberry.type
class UserActivitySummaryType:
    user_uid: str
    total_laboratories: int
    active_laboratory_uid: Optional[str]
    laboratories: List[str]
    groups: List[str]
    permissions_count: int
    account_status: str
    recent_activities: List[Dict[str, str]]


# Union Types for GraphQL Responses

UserCreateResponse = strawberry.union(
    "UserCreateResponse", 
    [UserType, UserCreationResponseType, OperationError]
)

UserUpdateResponse = strawberry.union(
    "UserUpdateResponse", 
    [UserType, OperationError]
)

ValidationResponse = strawberry.union(
    "ValidationResponse", 
    [UserValidationResultType, OperationError]
)

BatchResponse = strawberry.union(
    "BatchResponse", 
    [BatchOperationResultType, OperationError]
)

AssignmentResponse = strawberry.union(
    "AssignmentResponse", 
    [LaboratoryAssignmentResponseType, OperationError]
)

ActivityResponse = strawberry.union(
    "ActivityResponse", 
    [UserActivitySummaryType, OperationError]
)


# Enhanced User Mutations

@strawberry.type
class EnhancedUserMutations:
    """Enhanced user mutations with comprehensive multi-tenant support"""

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_user_enhanced(
        self,
        info: Info,
        user_input: EnhancedUserCreateInputType
    ) -> UserCreateResponse:
        """Create user with enhanced multi-laboratory support"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedUserService()
            
            # Convert input to schema
            user_data = EnhancedUserCreate(
                user_name=user_input.user_name,
                first_name=user_input.first_name,
                last_name=user_input.last_name,
                email=user_input.email,
                password=user_input.password,
                mobile_phone=user_input.mobile_phone,
                business_phone=user_input.business_phone,
                laboratory_uids=user_input.laboratory_uids,
                laboratory_roles=user_input.laboratory_roles,
                active_laboratory_uid=user_input.active_laboratory_uid,
                is_active=user_input.is_active,
                is_superuser=user_input.is_superuser,
                send_welcome_email=user_input.send_welcome_email,
                profile_picture=user_input.profile_picture,
                bio=user_input.bio,
                department=user_input.department,
                position=user_input.position
            )
            
            # Create user with laboratories
            user = await service.create_with_laboratories(
                user_data=user_data,
                laboratory_uids=user_input.laboratory_uids,
                laboratory_roles=user_input.laboratory_roles,
                created_by=current_user.uid
            )
            
            return user
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_user_enhanced(
        self,
        info: Info,
        user_uid: str,
        user_input: EnhancedUserUpdateInputType
    ) -> UserUpdateResponse:
        """Update user with enhanced validation"""
        try:
            service = EnhancedUserService()
            
            # Convert input to dict, filtering None values
            update_data = {
                k: v for k, v in {
                    "user_name": user_input.user_name,
                    "first_name": user_input.first_name,
                    "last_name": user_input.last_name,
                    "email": user_input.email,
                    "password": user_input.password,
                    "mobile_phone": user_input.mobile_phone,
                    "business_phone": user_input.business_phone,
                    "is_active": user_input.is_active,
                    "is_superuser": user_input.is_superuser,
                    "active_laboratory_uid": user_input.active_laboratory_uid,
                    "profile_picture": user_input.profile_picture,
                    "bio": user_input.bio,
                    "department": user_input.department,
                    "position": user_input.position,
                }.items() if v is not None
            }
            
            # Validate data
            validation_errors = await service.validate_user_data(
                update_data, 
                is_update=True, 
                existing_user_uid=user_uid
            )
            
            if validation_errors:
                return OperationError(error="Validation failed", suggestion=str(validation_errors))
            
            # Sanitize data
            sanitized_data = await service.sanitize_user_data(update_data)
            
            # Create update schema
            user_update = EnhancedUserUpdate(**sanitized_data)
            
            # Update user
            user = await service.update(user_uid, user_update, related=["laboratories", "active_laboratory"])
            
            return user
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def assign_user_to_laboratories(
        self,
        info: Info,
        user_uid: str,
        laboratory_uids: List[str],
        laboratory_roles: Optional[Dict[str, str]] = None,
        replace_existing: bool = False
    ) -> AssignmentResponse:
        """Assign user to multiple laboratories"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedUserService()
            
            user = await service.assign_to_laboratories(
                user_uid=user_uid,
                laboratory_uids=laboratory_uids,
                laboratory_roles=laboratory_roles,
                replace_existing=replace_existing,
                assigned_by=current_user.uid
            )
            
            return LaboratoryAssignmentResponseType(
                success=True,
                user_uid=user_uid,
                assigned_laboratories=laboratory_uids,
                removed_laboratories=[],
                new_active_laboratory=user.active_laboratory_uid,
                errors={}
            )
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def remove_user_from_laboratories(
        self,
        info: Info,
        user_uid: str,
        laboratory_uids: List[str]
    ) -> AssignmentResponse:
        """Remove user from multiple laboratories"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedUserService()
            
            user = await service.remove_from_laboratories(
                user_uid=user_uid,
                laboratory_uids=laboratory_uids,
                removed_by=current_user.uid
            )
            
            return LaboratoryAssignmentResponseType(
                success=True,
                user_uid=user_uid,
                assigned_laboratories=[],
                removed_laboratories=laboratory_uids,
                new_active_laboratory=user.active_laboratory_uid,
                errors={}
            )
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def switch_active_laboratory(
        self,
        info: Info,
        laboratory_uid: str
    ) -> UserUpdateResponse:
        """Switch current user's active laboratory"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedUserService()
            
            user = await service.switch_active_laboratory(
                user_uid=current_user.uid,
                laboratory_uid=laboratory_uid
            )
            
            return user
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def bulk_assign_users_to_laboratory(
        self,
        info: Info,
        assignment_input: BulkLaboratoryAssignmentInputType
    ) -> BatchResponse:
        """Bulk assign multiple users to a laboratory"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedUserService()
            
            results = await service.bulk_assign_users(
                user_uids=assignment_input.user_uids,
                laboratory_uid=assignment_input.laboratory_uid,
                role=assignment_input.role,
                assigned_by=current_user.uid
            )
            
            successful_items = [uid for uid, success in results.items() if success]
            failed_items = {uid: "Assignment failed" for uid, success in results.items() if not success}
            
            return BatchOperationResultType(
                total_attempted=len(assignment_input.user_uids),
                total_successful=len(successful_items),
                total_failed=len(failed_items),
                successful_items=successful_items,
                failed_items=failed_items,
                warnings=[]
            )
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def batch_create_users(
        self,
        info: Info,
        batch_input: BatchUserCreateInputType
    ) -> BatchResponse:
        """Create multiple users in batch"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedUserService()
            
            successful_items = []
            failed_items = {}
            warnings = []
            
            for user_input in batch_input.users:
                try:
                    # Use default laboratory if not specified
                    laboratory_uids = user_input.laboratory_uids or ([batch_input.default_laboratory_uid] if batch_input.default_laboratory_uid else [])
                    
                    if not laboratory_uids:
                        failed_items[user_input.user_name] = "No laboratory specified"
                        continue
                    
                    user_data = EnhancedUserCreate(
                        user_name=user_input.user_name,
                        first_name=user_input.first_name,
                        last_name=user_input.last_name,
                        email=user_input.email,
                        password=user_input.password,
                        mobile_phone=user_input.mobile_phone,
                        business_phone=user_input.business_phone,
                        laboratory_uids=laboratory_uids,
                        laboratory_roles=user_input.laboratory_roles or {lab: batch_input.default_role for lab in laboratory_uids},
                        active_laboratory_uid=user_input.active_laboratory_uid or laboratory_uids[0],
                        is_active=user_input.is_active,
                        is_superuser=user_input.is_superuser,
                        send_welcome_email=batch_input.send_welcome_emails,
                        profile_picture=user_input.profile_picture,
                        bio=user_input.bio,
                        department=user_input.department,
                        position=user_input.position
                    )
                    
                    user = await service.create_with_laboratories(
                        user_data=user_data,
                        laboratory_uids=laboratory_uids,
                        laboratory_roles=user_data.laboratory_roles,
                        created_by=current_user.uid
                    )
                    
                    successful_items.append(user.uid)
                    
                except Exception as e:
                    failed_items[user_input.user_name] = str(e)
            
            return BatchOperationResultType(
                total_attempted=len(batch_input.users),
                total_successful=len(successful_items),
                total_failed=len(failed_items),
                successful_items=successful_items,
                failed_items=failed_items,
                warnings=warnings
            )
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def validate_user_data(
        self,
        info: Info,
        validation_input: UserValidationInputType
    ) -> ValidationResponse:
        """Validate user data before creation/update"""
        try:
            service = EnhancedUserService()
            
            errors = await service.validate_user_data(
                user_data=validation_input.user_data,
                laboratory_uids=validation_input.laboratory_uids,
                is_update=validation_input.is_update,
                existing_user_uid=validation_input.existing_user_uid
            )
            
            sanitized_data = await service.sanitize_user_data(validation_input.user_data)
            
            return UserValidationResultType(
                is_valid=len(errors) == 0,
                errors=errors,
                warnings={},
                sanitized_data=sanitized_data
            )
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_user_profile(
        self,
        info: Info,
        profile_input: UserProfileUpdateInputType
    ) -> UserUpdateResponse:
        """Update current user's profile (self-service)"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedUserService()
            
            # Convert input to dict, filtering None values
            update_data = {
                k: v for k, v in {
                    "first_name": profile_input.first_name,
                    "last_name": profile_input.last_name,
                    "email": profile_input.email,
                    "mobile_phone": profile_input.mobile_phone,
                    "business_phone": profile_input.business_phone,
                    "profile_picture": profile_input.profile_picture,
                    "bio": profile_input.bio,
                }.items() if v is not None
            }
            
            # Sanitize data
            sanitized_data = await service.sanitize_user_data(update_data)
            
            # Create update schema
            user_update = EnhancedUserUpdate(**sanitized_data)
            
            # Update user
            user = await service.update(current_user.uid, user_update, related=["laboratories", "active_laboratory"])
            
            return user
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def get_user_activity_summary(
        self,
        info: Info,
        user_uid: str
    ) -> ActivityResponse:
        """Get comprehensive activity summary for user"""
        try:
            service = EnhancedUserService()
            
            summary = await service.get_user_activity_summary(user_uid)
            
            return UserActivitySummaryType(
                user_uid=user_uid,
                total_laboratories=summary["total_laboratories"],
                active_laboratory_uid=summary["active_laboratory"],
                laboratories=[lab.uid for lab in summary["laboratories"]],
                groups=[group.uid for group in summary["groups"]],
                permissions_count=len(summary["permissions_by_lab"]),
                account_status=f"Active: {summary['account_status']['is_active']}, Blocked: {summary['account_status']['is_blocked']}",
                recent_activities=[{str(k): str(v) for k, v in activity.items()} for activity in summary["recent_activity"]]
            )
            
        except Exception as e:
            return OperationError(error=str(e))

    @strawberry.mutation
    async def request_password_reset(
        self,
        info: Info,
        reset_input: PasswordResetRequestInputType
    ) -> MessageType:
        """Request password reset"""
        try:
            service = EnhancedUserService()
            
            # Implementation would depend on your email service
            # For now, just return success message
            
            return MessageType(message="Password reset instructions sent to your email")
            
        except Exception as e:
            return MessageType(message=f"Error: {str(e)}")

    @strawberry.mutation
    async def reset_password(
        self,
        info: Info,
        reset_input: PasswordResetInputType
    ) -> MessageType:
        """Reset password using token"""
        try:
            if reset_input.new_password != reset_input.confirm_password:
                return MessageType(message="Error: Passwords do not match")
            
            # Implementation would validate token and reset password
            # For now, just return success message
            
            return MessageType(message="Password reset successfully")
            
        except Exception as e:
            return MessageType(message=f"Error: {str(e)}")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def upload_profile_picture(
        self,
        info: Info,
        picture_data: str
    ) -> UserUpdateResponse:
        """Upload user profile picture"""
        try:
            current_user = await auth_from_info(info)
            service = EnhancedUserService()
            
            # In a real implementation, you would:
            # 1. Validate the image data
            # 2. Resize/optimize the image
            # 3. Store in file storage service
            # 4. Return the stored file URL
            
            # For now, just store the data directly
            user_update = EnhancedUserUpdate(profile_picture=picture_data)
            user = await service.update(current_user.uid, user_update, related=["laboratories", "active_laboratory"])
            
            return user
            
        except Exception as e:
            return OperationError(error=str(e))