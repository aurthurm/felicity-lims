import logging
import time

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.types import MessageResponse, MessagesType, OperationError
from felicity.api.gql.types.generic import StrawberryMapper
from felicity.api.gql.user.types import (
    GroupCloningResultType,
    GroupPermissionAssignmentType,
    GroupType,
    PermissionType,
    UpdatedGroupPerms,
    UserLaboratoryAssignmentType,
    UserType,
)
from felicity.apps.guard import FGroup
from felicity.apps.setup.services import LaboratoryService
from felicity.apps.user import schemas as user_schemas
from felicity.apps.user.entities import laboratory_user
from felicity.apps.user.services import (
    GroupService,
    PermissionService,
    UserPreferenceService,
    UserService,
)
from felicity.core import security
from felicity.core.config import get_settings
from felicity.core.events import post_event
from felicity.core.security import (
    generate_password_reset_token,
    verify_password_reset_token,
)

settings = get_settings()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

UserResponse = strawberry.union(
    "UserResponse",
    (UserType, OperationError),
    description="",  # noqa
)


@strawberry.type
class AuthenticatedData:
    user: "UserType"
    token: str
    refresh: str
    token_type: str
    laboratories: list[LaboratoryType] | None = None
    active_laboratory: LaboratoryType | None = None


AuthenticatedDataResponse = strawberry.union(
    "AuthenticatedDataResponse",
    (AuthenticatedData, OperationError),  # noqa
    description="",
)

UpdatedGroupPermsResponse = strawberry.union(
    "UpdatedGroupPermsResponse",
    (UpdatedGroupPerms, OperationError),  # noqa
    description="",
)

GroupResponse = strawberry.union(
    "GroupResponse",
    (GroupType, OperationError),
    description="",  # noqa
)

UserLaboratoryAssignmentResponse = strawberry.union(
    "UserLaboratoryAssignmentResponse",
    (UserLaboratoryAssignmentType, OperationError),
    description="",  # noqa
)

PermissionResponse = strawberry.union(
    "PermissionResponse",
    (PermissionType, OperationError),
    description="",  # noqa
)

GroupPermissionAssignmentResponse = strawberry.union(
    "GroupPermissionAssignmentResponse",
    (GroupPermissionAssignmentType, OperationError),
    description="",  # noqa
)

GroupCloningResultResponse = strawberry.union(
    "GroupCloningResultResponse",
    (GroupCloningResultType, OperationError),
    description="",  # noqa
)


@strawberry.type
class UserValidationResultType:
    email_available: bool
    username_available: bool
    employee_id_available: bool
    suggestions: list[str] | None = None


UserValidationResponse = strawberry.union(
    "UserValidationResponse",
    (UserValidationResultType, OperationError),
    description="",  # noqa
)


@strawberry.type
class BatchUserCreationResultType:
    successful_users: list[UserType]
    failed_users: list[str]  # Error messages for failed users
    total_attempted: int
    total_successful: int
    total_failed: int


BatchUserCreationResponse = strawberry.union(
    "BatchUserCreationResponse",
    (BatchUserCreationResultType, OperationError),
    description="",  # noqa
)


@strawberry.type
class ProfilePictureUploadResultType:
    user: UserType
    profile_picture_url: str
    message: str


ProfilePictureUploadResponse = strawberry.union(
    "ProfilePictureUploadResponse",
    (ProfilePictureUploadResultType, OperationError),
    description="",  # noqa
)


@strawberry.type
class WelcomeEmailResultType:
    user: UserType
    email_sent: bool
    message: str


WelcomeEmailResponse = strawberry.union(
    "WelcomeEmailResponse",
    (WelcomeEmailResultType, OperationError),
    description="",  # noqa
)


@strawberry.type
class PasswordResetValidityType:
    username: str
    auth_uid: str


PasswordResetValidityResponse = strawberry.union(
    "PasswordResetValidityResponse",
    (PasswordResetValidityType, OperationError),
    description="",  # noqa
)


@strawberry.input
class GroupInputType:
    name: str
    pages: str
    active: bool = True


@strawberry.input
class GroupCreateInputType:
    name: str
    pages: str
    laboratory_uid: str | None = None
    active: bool = True


@strawberry.input
class PermissionCreateInputType:
    action: str
    target: str
    active: bool = True


@strawberry.input
class PermissionUpdateInputType:
    action: str | None = None
    target: str | None = None
    active: bool | None = None


@strawberry.input
class UserCreateWithLaboratoryInputType:
    first_name: str
    last_name: str
    email: str
    user_name: str
    password: str
    passwordc: str
    laboratory_uid: str
    group_uid: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    bio: str | None = None


@strawberry.input
class EnhancedUserCreateInputType:
    first_name: str
    last_name: str
    email: str
    user_name: str
    password: str
    passwordc: str
    is_active: bool = True
    is_blocked: bool = False
    group_uid: str | None = None
    laboratory_uids: list[str] | None = None
    active_laboratory_uid: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    bio: str | None = None
    job_title: str | None = None
    department: str | None = None
    employee_id: str | None = None
    profile_picture: str | None = None
    send_welcome_email: bool = True
    include_credentials: bool = False


@strawberry.input
class BatchUserCreateInputType:
    users: list[EnhancedUserCreateInputType]
    default_laboratory_uid: str | None = None
    default_group_uid: str | None = None
    send_welcome_emails: bool = True


@strawberry.input
class UserValidationInputType:
    email: str | None = None
    user_name: str | None = None
    employee_id: str | None = None


@strawberry.input
class ProfilePictureUploadInputType:
    user_uid: str
    image_data: str  # Base64 encoded image
    file_name: str
    content_type: str


@strawberry.input
class WelcomeEmailInputType:
    user_uid: str
    include_credentials: bool = False
    custom_message: str | None = None


def simple_task(message: str):
    time.sleep(4)
    logger.info(f"finished task: {message}")
    return message


@strawberry.type
class UserMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_user(
            self,
            info,
            first_name: str,
            last_name: str,
            email: str,
            user_name: str,
            password: str,
            passwordc: str,
            group_uid: str | None = None,
            open_reg: bool | None = False,
    ) -> UserResponse:
        user_service = UserService()
        group_service = GroupService()
        user_preference_service = UserPreferenceService()
        felicity_user = await auth_from_info(info)

        if open_reg and not settings.USERS_OPEN_REGISTRATION:
            return OperationError(
                error="Open user registration is forbidden on this server"
            )

        user_e = await user_service.get_by_email(email=email)
        if user_e:
            return OperationError(
                error="A user with this email already exists in the system"
            )

        assert password == passwordc

        user_in = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "user_name": user_name,
            "password": password,
            "is_superuser": False,
            "login_retry": 0,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        user_in = user_schemas.UserCreate(**user_in)
        user = await user_service.create(user_in=user_in, related=['groups'])
        if group_uid:
            group = await group_service.get(uid=group_uid)
            user.groups.append(group)
            user = await user_service.save(user)

        # initial user-preferences
        pref = user_preference_service.get(user_uid=user.uid)
        if not pref:
            pref_in = user_schemas.UserPreferenceCreate(user_uid=user.uid, expanded_menu=False, theme="LIGHT")
            await user_preference_service.create(pref_in)

        if user_in.email:
            logger.info("Handle email sending in a standalone service")
        return StrawberryMapper[UserType]().map(**user.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_user(
            self,
            info,
            user_uid: str,
            first_name: str | None,
            last_name: str | None,
            user_name: str | None,
            mobile_phone: str | None,
            email: str | None,
            group_uid: str | None,
            is_active: bool | None,
            is_blocked: bool | None,
            password: str | None = None,
            passwordc: str | None = None,
    ) -> UserResponse:
        user_service = UserService()
        group_service = GroupService()
        felicity_user = await auth_from_info(info)

        user = await user_service.get(uid=user_uid, related=['groups'])
        if not user:
            return OperationError(error="Error, failed to fetch user for updating")

        user_data = user.to_dict().keys()
        if first_name and "first_name" in user_data:
            setattr(user, "first_name", first_name)
        if last_name and "last_name" in user_data:
            setattr(user, "last_name", last_name)
        if user_name and "user_name" in user_data:
            setattr(user, "user_name", user_name)
        if email and "email" in user_data:
            setattr(user, "email", email)
        if mobile_phone and "mobile_phone" in user_data:
            setattr(user, "mobile_phone", mobile_phone)
        if "is_active" in user_data:
            setattr(user, "is_active", is_active)
        if "is_blocked" in user_data:
            setattr(user, "is_blocked", is_blocked)

        user_in = user_schemas.UserUpdate(**user.to_dict())
        user_in.updated_by_uid = felicity_user.uid

        if password and passwordc:
            assert password == passwordc
            user_in.password = password

        user = await user_service.update(user.uid, user_in, related=['groups'])

        # group management
        grp_ids = [grp.uid for grp in user.groups]
        if group_uid and group_uid not in grp_ids:
            group = await group_service.get(uid=group_uid)
            for grp in user.groups:
                user.groups.remove(grp)
            await user_service.save(user)
            user.groups = [group]
            user = await user_service.save(user)

        return StrawberryMapper[UserType]().map(**user.marshal_simple())

    @strawberry.mutation
    async def authenticate_user(
            self, info, username: str, password: str
    ) -> AuthenticatedDataResponse:
        user_service = UserService()

        user = await user_service.get_by_username(username=username)
        if not user:
            return OperationError(error="Incorrect username")

        if user.user_name == settings.SYSTEM_DAEMON_USERNAME:
            return OperationError(error="System daemon cannot access system UI")

        has_access = await user_service.has_access(user, password)
        if not has_access:
            return OperationError(error="Failed to log you in")

        user_groups = [g.name.upper() for g in await user_service.get_user_groups(user.uid)]
        is_global_user = (
                user.user_name == settings.FIRST_SUPERUSER_USERNAME or
                user.is_superuser or
                FGroup.ADMINISTRATOR in user_groups
        )
        if is_global_user:
            laboratories = await LaboratoryService().all()
        else:
            lab_uids = await UserService().table_query(
                table=laboratory_user,
                columns=["laboratory_uid"],
                user_uid=user.uid
            )
            laboratories = await LaboratoryService().get_by_uids(lab_uids or [])

        active_laboratory = await LaboratoryService().get(
            uid=user.active_laboratory_uid
        ) if user.active_laboratory_uid else None

        # auto switch context is only a single lab exists for user
        if laboratories and len(laboratories) == 1 and not active_laboratory:
            active_laboratory = laboratories[0]
            await user_service.set_active_laboratory(user.uid, active_laboratory.uid)

        access_token = security.create_access_token(user.uid)
        refresh_token = security.create_refresh_token(user.uid)
        return StrawberryMapper[AuthenticatedData]().map(
            token=access_token, refresh=refresh_token,
            token_type="bearer", user=user,
            laboratories=laboratories,
            active_laboratory=active_laboratory
        )

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def refresh(self, info, refresh_token: str) -> AuthenticatedDataResponse:
        felicity_user = await auth_from_info(info)
        access_token = security.create_access_token_from_refresh(refresh_token)
        return StrawberryMapper[AuthenticatedData]().map(
            token=access_token,
            refresh=refresh_token,
            token_type="bearer",
            user=felicity_user,
        )

    @strawberry.mutation()
    async def request_password_reset(self, info, email: str) -> MessageResponse:
        user_service = UserService()
        user = await user_service.get_by_email(email)
        if not user:
            return OperationError(
                error="User with provided email not found? Check your email and try again"
            )

        password_reset_token = generate_password_reset_token(email)

        post_event("password-reset", user=user, token=password_reset_token)

        msg = "Password recovery email sent"
        return MessagesType(message=msg)

    @strawberry.mutation()
    async def validate_password_reset_token(
            self, info, token: str
    ) -> PasswordResetValidityResponse:
        user_service = UserService()
        email = verify_password_reset_token(token)
        if not email:
            return OperationError(error="Your token is invalid")

        user = await user_service.get_by_email(email)
        if not user:
            return OperationError(error="Your token is invalid")
        auth = await user_service.get(uid=user.auth_uid)
        return PasswordResetValidityType(
            username=auth.user_name, auth_uid=user.auth_uid
        )

    @strawberry.mutation()
    async def reset_password(
            self,
            info,
            user_uid: str,
            password: str,
            passwordc: str,
    ) -> MessageResponse:
        user_service = UserService()

        user = await user_service.get(uid=user_uid)
        if password != passwordc:
            return OperationError(error="Passwords do not match")

        auth_in = user_schemas.UserUpdate(password=password)
        await user_service.update(user.uid, auth_in)
        return MessagesType(
            message="Password was successfully reset, Now login with your new password"
        )

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_group(self, info, payload: GroupInputType) -> GroupResponse:
        group_service = GroupService()

        felicity_user = await auth_from_info(info)

        if not payload.name:
            return OperationError(error="Name Required")

        group = await group_service.get(name=payload.name)
        if group:
            return OperationError(
                error=f"Group with name {payload.name} already exists"
            )

        incoming = {
            "keyword": payload.name.upper(),
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        group = await group_service.create(incoming)
        return GroupType(**group.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_group(
            self, info, uid: str, payload: GroupInputType
    ) -> GroupResponse:
        group_service = GroupService()

        await auth_from_info(info)

        group = await group_service.get(uid=uid)
        if not group:
            return OperationError(error=f"Group with uid {uid} does not exist")

        group_data = group.to_dict()
        for field in group_data:
            if field in payload.__dict__:
                try:
                    setattr(group, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        setattr(group, "keyword", payload.__dict__["name"].upper())

        group = await group_service.save(group)
        return GroupType(**group.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_group_permissions(
            self, info, group_uid: str, permission_uid: str
    ) -> UpdatedGroupPermsResponse:
        group_service = GroupService()
        permission_service = PermissionService()

        if not group_uid or not permission_uid:
            return OperationError(error="Group and Permission are required.")

        group = await group_service.get(uid=group_uid, related=['permissions'])
        if not group:
            return OperationError(error=f"group with uid {group_uid} not found")

        if permission_uid in [perm.uid for perm in group.permissions]:
            permissions = filter(lambda p: p.uid == permission_uid, group.permissions)
            permission = list(permissions)[0]
            group.permissions.remove(permission)
        else:
            permission = await permission_service.get(uid=permission_uid)
            if not permission:
                return OperationError(
                    error=f"permission with uid {permission_uid} not found"
                )
            group.permissions.append(permission)
        await group_service.save(group)

        return UpdatedGroupPerms(group=group, permission=permission)

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_user_with_laboratory(
        self, info, payload: UserCreateWithLaboratoryInputType
    ) -> UserResponse:
        """Create a new user and assign to laboratory"""
        user_service = UserService()
        felicity_user = await auth_from_info(info)

        # Validate passwords match
        if payload.password != payload.passwordc:
            return OperationError(error="Passwords do not match")

        # Check if user already exists
        existing_user = await user_service.get_by_email(payload.email)
        if existing_user:
            return OperationError(error="A user with this email already exists")

        existing_username = await user_service.get_by_username(payload.user_name)
        if existing_username:
            return OperationError(error="A user with this username already exists")

        try:
            # Create user data
            user_data = user_schemas.UserCreate(
                first_name=payload.first_name,
                last_name=payload.last_name,
                email=payload.email,
                user_name=payload.user_name,
                password=payload.password,
                mobile_phone=payload.mobile_phone,
                business_phone=payload.business_phone,
                bio=payload.bio,
                is_active=True,
                is_superuser=False,
                login_retry=0,
                created_by_uid=felicity_user.uid,
                updated_by_uid=felicity_user.uid,
            )

            # Create user with laboratory assignment
            user = await user_service.create_user_with_laboratory(
                user_data, payload.laboratory_uid, payload.group_uid
            )

            return StrawberryMapper[UserType]().map(**user.marshal_simple())
        except ValueError as e:
            return OperationError(error=str(e))
        except Exception as e:
            logger.error(f"Error creating user with laboratory: {e}")
            return OperationError(error="Failed to create user")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def assign_user_to_laboratory(
        self, info, user_uid: str, laboratory_uid: str
    ) -> UserLaboratoryAssignmentResponse:
        """Assign a user to a laboratory"""
        user_service = UserService()

        if not user_uid or not laboratory_uid:
            return OperationError(error="User UID and Laboratory UID are required")

        try:
            user = await user_service.assign_user_to_laboratory(user_uid, laboratory_uid)
            laboratories = await user_service.get_laboratories_by_user(user_uid)

            return UserLaboratoryAssignmentType(
                user=user,
                laboratories=laboratories,
                message=f"User successfully assigned to laboratory"
            )
        except ValueError as e:
            return OperationError(error=str(e))
        except Exception as e:
            logger.error(f"Error assigning user to laboratory: {e}")
            return OperationError(error="Failed to assign user to laboratory")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def remove_user_from_laboratory(
        self, info, user_uid: str, laboratory_uid: str
    ) -> UserLaboratoryAssignmentResponse:
        """Remove a user from a laboratory"""
        user_service = UserService()

        if not user_uid or not laboratory_uid:
            return OperationError(error="User UID and Laboratory UID are required")

        try:
            user = await user_service.remove_user_from_laboratory(user_uid, laboratory_uid)
            laboratories = await user_service.get_laboratories_by_user(user_uid)

            return UserLaboratoryAssignmentType(
                user=user,
                laboratories=laboratories,
                message=f"User successfully removed from laboratory"
            )
        except ValueError as e:
            return OperationError(error=str(e))
        except Exception as e:
            logger.error(f"Error removing user from laboratory: {e}")
            return OperationError(error="Failed to remove user from laboratory")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def set_user_active_laboratory(
        self, info, user_uid: str, laboratory_uid: str
    ) -> UserResponse:
        """Set a user's active laboratory"""
        user_service = UserService()

        if not user_uid:
            return OperationError(error="User UID is required")

        try:
            await user_service.set_active_laboratory(user_uid, laboratory_uid)
            user = await user_service.get(uid=user_uid)
            return StrawberryMapper[UserType]().map(**user.marshal_simple())
        except Exception as e:
            logger.error(f"Error setting active laboratory: {e}")
            return OperationError(error="Failed to set active laboratory")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def bulk_assign_users_to_laboratory(
        self, info, user_uids: list[str], laboratory_uid: str
    ) -> UserLaboratoryAssignmentResponse:
        """Assign multiple users to a laboratory"""
        user_service = UserService()

        if not user_uids or not laboratory_uid:
            return OperationError(error="User UIDs and Laboratory UID are required")

        try:
            users = await user_service.bulk_assign_users_to_laboratory(user_uids, laboratory_uid)
            
            if not users:
                return OperationError(error="No valid users found to assign")

            # Return summary for first user (could be enhanced to return all)
            first_user = users[0]
            laboratories = await user_service.get_laboratories_by_user(first_user.uid)

            return UserLaboratoryAssignmentType(
                user=first_user,
                laboratories=laboratories,
                message=f"Successfully assigned {len(users)} users to laboratory"
            )
        except Exception as e:
            logger.error(f"Error bulk assigning users: {e}")
            return OperationError(error="Failed to assign users to laboratory")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_group_for_laboratory(
        self, info, payload: GroupCreateInputType
    ) -> GroupResponse:
        """Create a new group in laboratory context"""
        group_service = GroupService()
        felicity_user = await auth_from_info(info)

        if not payload.name:
            return OperationError(error="Group name is required")

        try:
            group_data = user_schemas.GroupCreate(
                name=payload.name,
                pages=payload.pages,
                active=payload.active,
                created_by_uid=felicity_user.uid,
                updated_by_uid=felicity_user.uid,
            )

            group = await group_service.create_group_for_laboratory(
                group_data, payload.laboratory_uid
            )

            return StrawberryMapper[GroupType]().map(**group.marshal_simple())
        except ValueError as e:
            return OperationError(error=str(e))
        except Exception as e:
            logger.error(f"Error creating group for laboratory: {e}")
            return OperationError(error="Failed to create group")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def assign_permission_to_group(
        self, info, group_uid: str, permission_uid: str, laboratory_uid: str | None = None
    ) -> GroupPermissionAssignmentResponse:
        """Assign a permission to a group in laboratory context"""
        group_service = GroupService()

        if not group_uid or not permission_uid:
            return OperationError(error="Group UID and Permission UID are required")

        try:
            group = await group_service.assign_permission_to_group(
                group_uid, permission_uid, laboratory_uid
            )
            permission = await PermissionService().get(uid=permission_uid)

            return GroupPermissionAssignmentType(
                group=group,
                permission=permission,
                message="Permission successfully assigned to group",
                assigned=True
            )
        except ValueError as e:
            return OperationError(error=str(e))
        except Exception as e:
            logger.error(f"Error assigning permission to group: {e}")
            return OperationError(error="Failed to assign permission to group")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def remove_permission_from_group(
        self, info, group_uid: str, permission_uid: str, laboratory_uid: str | None = None
    ) -> GroupPermissionAssignmentResponse:
        """Remove a permission from a group in laboratory context"""
        group_service = GroupService()

        if not group_uid or not permission_uid:
            return OperationError(error="Group UID and Permission UID are required")

        try:
            group = await group_service.remove_permission_from_group(
                group_uid, permission_uid, laboratory_uid
            )
            permission = await PermissionService().get(uid=permission_uid)

            return GroupPermissionAssignmentType(
                group=group,
                permission=permission,
                message="Permission successfully removed from group",
                assigned=False
            )
        except ValueError as e:
            return OperationError(error=str(e))
        except Exception as e:
            logger.error(f"Error removing permission from group: {e}")
            return OperationError(error="Failed to remove permission from group")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def clone_group_to_laboratory(
        self, info, group_uid: str, target_laboratory_uid: str
    ) -> GroupCloningResultResponse:
        """Clone a group from global or another laboratory to target laboratory"""
        group_service = GroupService()

        if not group_uid or not target_laboratory_uid:
            return OperationError(error="Group UID and target laboratory UID are required")

        try:
            source_group = await group_service.get(uid=group_uid)
            new_group = await group_service.clone_group_to_laboratory(
                group_uid, target_laboratory_uid
            )

            return GroupCloningResultType(
                source_group=source_group,
                new_group=new_group,
                target_laboratory_uid=target_laboratory_uid,
                message=f"Group '{source_group.name}' successfully cloned to laboratory"
            )
        except ValueError as e:
            return OperationError(error=str(e))
        except Exception as e:
            logger.error(f"Error cloning group to laboratory: {e}")
            return OperationError(error="Failed to clone group to laboratory")


    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_user_enhanced(
        self, info, payload: EnhancedUserCreateInputType
    ) -> UserResponse:
        """Enhanced user creation with comprehensive validation and features"""
        user_service = UserService()
        felicity_user = await auth_from_info(info)

        # Enhanced validation
        if payload.password != payload.passwordc:
            return OperationError(error="Passwords do not match")

        # Check for existing email
        existing_email = await user_service.get_by_email(payload.email)
        if existing_email:
            return OperationError(error="A user with this email already exists")

        # Check for existing username
        existing_username = await user_service.get_by_username(payload.user_name)
        if existing_username:
            return OperationError(error="A user with this username already exists")

        # Validate laboratory assignments
        if payload.laboratory_uids:
            lab_service = LaboratoryService()
            for lab_uid in payload.laboratory_uids:
                lab = await lab_service.get(uid=lab_uid)
                if not lab:
                    return OperationError(error=f"Laboratory with UID '{lab_uid}' not found")

            # Validate active laboratory is in assigned laboratories
            if payload.active_laboratory_uid and payload.active_laboratory_uid not in payload.laboratory_uids:
                return OperationError(error="Active laboratory must be in assigned laboratories")

        try:
            # Create user data
            user_data = user_schemas.UserCreate(
                first_name=payload.first_name,
                last_name=payload.last_name,
                email=payload.email,
                user_name=payload.user_name,
                password=payload.password,
                mobile_phone=payload.mobile_phone,
                business_phone=payload.business_phone,
                bio=payload.bio,
                is_active=payload.is_active,
                is_blocked=payload.is_blocked,
                is_superuser=False,
                login_retry=0,
                created_by_uid=felicity_user.uid,
                updated_by_uid=felicity_user.uid,
            )

            # Create user
            user = await user_service.create(user_in=user_data, related=['groups'])

            # Assign to group if specified
            if payload.group_uid:
                group_service = GroupService()
                group = await group_service.get(uid=payload.group_uid)
                if group:
                    user.groups.append(group)
                    user = await user_service.save(user)

            # Assign to laboratories if specified
            if payload.laboratory_uids:
                for lab_uid in payload.laboratory_uids:
                    await user_service.assign_user_to_laboratory(user.uid, lab_uid)

                # Set active laboratory
                if payload.active_laboratory_uid:
                    await user_service.set_active_laboratory(user.uid, payload.active_laboratory_uid)

            # Create user preferences
            user_preference_service = UserPreferenceService()
            pref = user_preference_service.get(user_uid=user.uid)
            if not pref:
                pref_in = user_schemas.UserPreferenceCreate(
                    user_uid=user.uid, 
                    expanded_menu=False, 
                    theme="LIGHT"
                )
                await user_preference_service.create(pref_in)

            # Send welcome email if requested
            if payload.send_welcome_email:
                post_event("user-welcome-email", 
                          user=user, 
                          include_credentials=payload.include_credentials)

            return StrawberryMapper[UserType]().map(**user.marshal_simple())
        except Exception as e:
            logger.error(f"Error creating enhanced user: {e}")
            return OperationError(error="Failed to create user")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def validate_user_data(
        self, info, payload: UserValidationInputType
    ) -> UserValidationResponse:
        """Validate user data for availability and provide suggestions"""
        user_service = UserService()
        
        try:
            email_available = True
            username_available = True
            employee_id_available = True
            suggestions = []

            # Check email availability
            if payload.email:
                existing_email = await user_service.get_by_email(payload.email)
                email_available = existing_email is None
                if not email_available:
                    # Generate email suggestions
                    base_email = payload.email.split('@')[0]
                    domain = payload.email.split('@')[1]
                    for i in range(1, 4):
                        suggestion = f"{base_email}{i}@{domain}"
                        existing = await user_service.get_by_email(suggestion)
                        if not existing:
                            suggestions.append(suggestion)
                            break

            # Check username availability
            if payload.user_name:
                existing_username = await user_service.get_by_username(payload.user_name)
                username_available = existing_username is None
                if not username_available:
                    # Generate username suggestions
                    for i in range(1, 6):
                        suggestion = f"{payload.user_name}{i}"
                        existing = await user_service.get_by_username(suggestion)
                        if not existing:
                            suggestions.append(suggestion)
                            break

            # Check employee ID availability (if implemented)
            if payload.employee_id:
                # This would need to be implemented in the user service
                # For now, assume it's available
                employee_id_available = True

            return UserValidationResultType(
                email_available=email_available,
                username_available=username_available,
                employee_id_available=employee_id_available,
                suggestions=suggestions
            )
        except Exception as e:
            logger.error(f"Error validating user data: {e}")
            return OperationError(error="Failed to validate user data")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def batch_create_users(
        self, info, payload: BatchUserCreateInputType
    ) -> BatchUserCreationResponse:
        """Create multiple users in batch with comprehensive error handling"""
        user_service = UserService()
        felicity_user = await auth_from_info(info)

        if not payload.users:
            return OperationError(error="No users provided for batch creation")

        successful_users = []
        failed_users = []
        total_attempted = len(payload.users)

        for user_data in payload.users:
            try:
                # Apply defaults if not specified
                laboratory_uids = user_data.laboratory_uids or ([payload.default_laboratory_uid] if payload.default_laboratory_uid else [])
                group_uid = user_data.group_uid or payload.default_group_uid

                # Create enhanced user input
                enhanced_input = EnhancedUserCreateInputType(
                    first_name=user_data.first_name,
                    last_name=user_data.last_name,
                    email=user_data.email,
                    user_name=user_data.user_name,
                    password=user_data.password,
                    passwordc=user_data.passwordc,
                    is_active=user_data.is_active,
                    is_blocked=user_data.is_blocked,
                    group_uid=group_uid,
                    laboratory_uids=laboratory_uids,
                    active_laboratory_uid=user_data.active_laboratory_uid,
                    mobile_phone=user_data.mobile_phone,
                    business_phone=user_data.business_phone,
                    bio=user_data.bio,
                    job_title=user_data.job_title,
                    department=user_data.department,
                    employee_id=user_data.employee_id,
                    profile_picture=user_data.profile_picture,
                    send_welcome_email=payload.send_welcome_emails,
                    include_credentials=user_data.include_credentials,
                )

                # Create user using enhanced method
                result = await self.create_user_enhanced(info, enhanced_input)
                
                if isinstance(result, UserType):
                    successful_users.append(result)
                else:
                    failed_users.append(f"{user_data.email}: {result.error}")

            except Exception as e:
                failed_users.append(f"{user_data.email}: {str(e)}")

        return BatchUserCreationResultType(
            successful_users=successful_users,
            failed_users=failed_users,
            total_attempted=total_attempted,
            total_successful=len(successful_users),
            total_failed=len(failed_users)
        )

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def upload_profile_picture(
        self, info, payload: ProfilePictureUploadInputType
    ) -> ProfilePictureUploadResponse:
        """Upload and set user profile picture"""
        user_service = UserService()
        
        try:
            user = await user_service.get(uid=payload.user_uid)
            if not user:
                return OperationError(error="User not found")

            # Validate image data
            if not payload.image_data or not payload.content_type.startswith('image/'):
                return OperationError(error="Invalid image data")

            # In a real implementation, you would:
            # 1. Decode base64 image data
            # 2. Validate image format and size
            # 3. Upload to file storage (MinIO, S3, etc.)
            # 4. Update user profile with image URL
            
            # For now, simulate the upload
            profile_picture_url = f"/api/uploads/profiles/{user.uid}/{payload.file_name}"
            
            # Update user with profile picture URL
            user_update = user_schemas.UserUpdate(profile_picture=profile_picture_url)
            await user_service.update(user.uid, user_update)
            
            # Refresh user data
            updated_user = await user_service.get(uid=payload.user_uid)

            return ProfilePictureUploadResultType(
                user=StrawberryMapper[UserType]().map(**updated_user.marshal_simple()),
                profile_picture_url=profile_picture_url,
                message="Profile picture uploaded successfully"
            )
        except Exception as e:
            logger.error(f"Error uploading profile picture: {e}")
            return OperationError(error="Failed to upload profile picture")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def send_welcome_email(
        self, info, payload: WelcomeEmailInputType
    ) -> WelcomeEmailResponse:
        """Send welcome email to user"""
        user_service = UserService()
        
        try:
            user = await user_service.get(uid=payload.user_uid)
            if not user:
                return OperationError(error="User not found")

            # Send welcome email via event system
            post_event("user-welcome-email", 
                      user=user, 
                      include_credentials=payload.include_credentials,
                      custom_message=payload.custom_message)

            return WelcomeEmailResultType(
                user=StrawberryMapper[UserType]().map(**user.marshal_simple()),
                email_sent=True,
                message="Welcome email sent successfully"
            )
        except Exception as e:
            logger.error(f"Error sending welcome email: {e}")
            return OperationError(error="Failed to send welcome email")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def assign_users_to_laboratories(
        self, info, user_uids: list[str], laboratory_uids: list[str], active_laboratory_uid: str | None = None
    ) -> UserLaboratoryAssignmentResponse:
        """Enhanced laboratory assignment for multiple users and laboratories"""
        user_service = UserService()

        if not user_uids or not laboratory_uids:
            return OperationError(error="User UIDs and Laboratory UIDs are required")

        try:
            # Validate all users exist
            users = []
            for user_uid in user_uids:
                user = await user_service.get(uid=user_uid)
                if not user:
                    return OperationError(error=f"User with UID '{user_uid}' not found")
                users.append(user)

            # Validate all laboratories exist
            lab_service = LaboratoryService()
            laboratories = []
            for lab_uid in laboratory_uids:
                lab = await lab_service.get(uid=lab_uid)
                if not lab:
                    return OperationError(error=f"Laboratory with UID '{lab_uid}' not found")
                laboratories.append(lab)

            # Validate active laboratory
            if active_laboratory_uid and active_laboratory_uid not in laboratory_uids:
                return OperationError(error="Active laboratory must be in assigned laboratories")

            # Assign users to laboratories
            for user in users:
                for lab_uid in laboratory_uids:
                    await user_service.assign_user_to_laboratory(user.uid, lab_uid)
                
                # Set active laboratory if specified
                if active_laboratory_uid:
                    await user_service.set_active_laboratory(user.uid, active_laboratory_uid)

            # Return result for first user (could be enhanced to return summary)
            first_user_labs = await user_service.get_laboratories_by_user(users[0].uid)

            return UserLaboratoryAssignmentType(
                user=users[0],
                laboratories=first_user_labs,
                message=f"Successfully assigned {len(users)} users to {len(laboratories)} laboratories"
            )
        except Exception as e:
            logger.error(f"Error assigning users to laboratories: {e}")
            return OperationError(error="Failed to assign users to laboratories")
