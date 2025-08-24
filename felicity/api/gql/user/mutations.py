import logging

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.types import MessageResponse, MessagesType, OperationError
from felicity.api.gql.types.generic import StrawberryMapper
from felicity.api.gql.user.types import (
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
            active_laboratory_uid: str | None = None,
            laboratory_uids: list[str] | None = None,
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
            "active_laboratory_uid": active_laboratory_uid,
            "is_superuser": False,
            "login_retry": 0,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        user_in = user_schemas.UserCreate(**user_in)
        user = await user_service.create(user_in=user_in, related=['groups'])
        if isinstance(laboratory_uids, list):
            for laboratory_uid in laboratory_uids:
                await user_service.assign_user_to_laboratory(user.uid, laboratory_uid)

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
            active_laboratory_uid: str | None = None,
            laboratory_uids: list[str] | None = None,
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
        if active_laboratory_uid and "active_laboratory_uid" in user_data:
            setattr(user, "active_laboratory_uid", active_laboratory_uid)
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
        if isinstance(laboratory_uids, list):
            labs_for_user = await user_service.get_laboratories_by_user(user.uid)
            for l_uid in labs_for_user:
                await user_service.remove_user_from_laboratory(user.uid, l_uid)
            for laboratory_uid in laboratory_uids:
                await user_service.assign_user_to_laboratory(user.uid, laboratory_uid)

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
        return GroupType(**group.marshal_simple(exclude=["laboratory"]))

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
