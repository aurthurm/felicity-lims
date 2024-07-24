import logging
import time

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info, verify_user_auth
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import (MessageResponse, MessagesType,
                                    OperationError)
from felicity.api.gql.types.generic import StrawberryMapper
from felicity.api.gql.user.types import (AuthenticatedData, GroupType,
                                         UpdatedGroupPerms,
                                         UserType)
from felicity.apps.user import schemas as user_schemas
from felicity.apps.user.services import (GroupService, PermissionService,
                                         UserPreferenceService, UserService)
from felicity.core import security
from felicity.core.config import get_settings
from felicity.core.events import post_event
from felicity.core.security import (generate_password_reset_token,
                                    verify_password_reset_token)

settings = get_settings()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

UserResponse = strawberry.union(
    "UserResponse", (UserType, OperationError), description=""  # noqa
)

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
    "GroupResponse", (GroupType, OperationError), description=""  # noqa
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
        is_authenticated, felicity_user = await auth_from_info(info)

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
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid
        }
        user_in = user_schemas.UserCreate(**user_in)
        user = await user_service.create(user_in=user_in)
        if group_uid:
            group = await group_service.get(uid=group_uid)
            user.groups.append(group)
            user = await user_service.save(user)

        # initial user-preferences
        pref_in = user_schemas.UserPreferenceCreate(expanded_menu=False, theme="LIGHT")
        preference = await user_preference_service.create(pref_in)
        user = await user_service.link_preference(user.uid, preference_uid=preference.uid)

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
            mobile_phone: str | None,
            email: str | None,
            group_uid: str | None,
            is_active: bool | None,
            password: str | None = None,
            passwordc: str | None = None,
    ) -> UserResponse:
        user_service = UserService()
        group_service = GroupService()
        is_authenticated, felicity_user = await auth_from_info(info)

        user = await user_service.get(uid=user_uid)
        if not user:
            return OperationError(error="Error, failed to fetch user for updating")

        user_data = user.to_dict().keys()
        if first_name and "first_name" in user_data:
            setattr(user, "first_name", first_name)
        if last_name and "last_name" in user_data:
            setattr(user, "last_name", last_name)
        if email and "email" in user_data:
            setattr(user, "email", email)
        if mobile_phone and "mobile_phone" in user_data:
            setattr(user, "mobile_phone", mobile_phone)
        if is_active and "is_active" in user_data:
            setattr(user, "is_active", is_active)

        user_in = user_schemas.UserUpdate(**user.to_dict())
        user_in.updated_by_uid = felicity_user.uid

        if password and passwordc:
            assert password == passwordc
            user_in.password = password

        user = await user_service.update(user.uid, user_in)

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
        has_access = await user_service.has_access(user, password)
        if not has_access:
            return OperationError(error="Failed to log you in")

        access_token = security.create_access_token(user.uid)
        refresh_token = security.create_refresh_token(user.uid)
        return StrawberryMapper[AuthenticatedData]().map(
            token=access_token, refresh=refresh_token, token_type="bearer", user=user
        )

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def refresh(self, info, refresh_token: str) -> AuthenticatedDataResponse:
        is_authenticated, felicity_user = await auth_from_info(info)
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
            return OperationError(error=f"Passwords do not match")

        auth_in = user_schemas.UserUpdate(password=password)
        await user_service.update(user.uid, auth_in)
        return MessagesType(
            message="Password was successfully reset, Now login with your new password"
        )

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_group(self, info, payload: GroupInputType) -> GroupResponse:
        group_service = GroupService()

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can add user groups",
        )

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
    async def update_group(self, info, uid: str, payload: GroupInputType) -> GroupResponse:
        group_service = GroupService()

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update user groups",
        )

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

        group = await group_service.get(uid=group_uid)
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
