import logging
import time

import strawberry  # noqa

from felicity.api.gql.auth import (
    auth_from_info,
    verify_user_auth,
)
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import MessageResponse, MessagesType, OperationError
from felicity.api.gql.types.generic import StrawberryMapper
from felicity.api.gql.user.types import (
    AuthenticatedData,
    GroupType,
    UpdatedGroupPerms,
    UserAuthType,
    UserType,
)
from felicity.apps.user import models as user_models
from felicity.apps.user import schemas as user_schemas
from felicity.core import security
from felicity.core.config import get_settings
from felicity.core.events import post_event
from felicity.core.security import generate_password_reset_token, verify_password_reset_token

settings = get_settings()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

UserResponse = strawberry.union(
    "UserResponse", (UserType, OperationError), description=""  # noqa
)

UserAuthResponse = strawberry.union(
    "UserAuthResponse", (UserAuthType, OperationError), description=""  # noqa
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
            group_uid: str | None = None,
            open_reg: bool | None = False,
    ) -> UserResponse:
        if open_reg and not settings.USERS_OPEN_REGISTRATION:
            return OperationError(
                error="Open user registration is forbidden on this server"
            )

        if email:
            user_e = await user_models.User.get_by_email(email=email)
            if user_e:
                return OperationError(
                    error="A user with this email already exists in the system"
                )

        user_in = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "is_superuser": False,
        }
        user_in = user_schemas.UserCreate(**user_in)
        user: user_models.User = await user_models.User.create(user_in=user_in)
        if group_uid:
            group = await user_models.Group.get(uid=group_uid)
            user.groups.append(group)
            user = await user.save_async()

        # initial user-preferences
        pref_in = user_schemas.UserPreferenceCreate(expanded_menu=False, theme="LIGHT")
        preference = await user_models.UserPreference.create(obj_in=pref_in)
        user = await user.link_preference(preference_uid=preference.uid)

        if user_in.email:
            logger.info("Handle email sending in a standalone service")
        return UserType(**user.marshal_simple())

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
    ) -> UserResponse:

        user = await user_models.User.get_one(uid=user_uid)
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
        user = await user.update(user_in)

        # group management
        grp_ids = [grp.uid for grp in user.groups]
        if group_uid and group_uid not in grp_ids:
            group = await user_models.Group.get(uid=group_uid)
            for grp in user.groups:
                user.groups.remove(grp)
            await user.save_async()
            user.groups = [group]
            user = await user.save_async()

        return UserType(**user.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_user_auth(
            self, info, user_uid: str, user_name: str, password: str, passwordc: str
    ) -> UserResponse:

        auth = await user_models.UserAuth.get_by_username(username=user_name)
        user = await user_models.User.get(uid=user_uid)

        # 1. Link if not already Linked
        if auth and user:
            linked_user = await user_models.User.get(auth_uid=auth.uid)

            if user.auth:
                if user.auth.uid == auth.uid:
                    return OperationError(error=f"The two accounts are already linked")
                else:
                    return OperationError(
                        error=f"User is already linked to different auth details"
                    )
            elif linked_user:  # auth.lcuser/auth.ccuser/auth.dcuser
                return OperationError(
                    error=f"Auth details are already linked to {linked_user.full_name}"
                )
            else:
                await user.link_auth(auth_uid=auth.uid)
        else:
            if not user:  # if there is no user there is nothing to link
                return OperationError(error="An error occurred: Try Again")

            if password != passwordc:
                return OperationError(error="Password do not match, try again")

            auth_in = {
                "user_name": user_name,
                "password": password,
                "login_retry": 0,
                "is_blocked": False,
            }
            auth_schema = user_schemas.AuthCreate(**auth_in)
            auth: user_models.UserAuth = await user_models.UserAuth.create(
                auth_schema
            )  # noqa
            await user.link_auth(auth_uid=auth.uid)
            time.sleep(1)
            await user.propagate_user_type()
        # return UserAuthType(**auth.marshal_simple(exclude=['hashed_password']))
        user = await user_models.User.get(uid=user.uid)
        return UserType(**user.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_user_auth(
            self,
            info,
            user_uid: str,
            user_name: str | None,
            password: str | None,
            passwordc: str | None,
    ) -> UserResponse:

        if not user_name or not password:
            return OperationError(error="Provide username and password to update")

        user = await user_models.User.get_one(uid=user_uid)
        if not user:
            return OperationError(error="Error, failed to fetch user for updating")

        if not user.auth_uid:
            return OperationError(
                error=f"User {user.full_name} has not authentication account"
            )

        auth = user.auth
        auth_in = user_schemas.AuthUpdate(**auth.to_dict())

        if user_name:
            if user_name != auth.user_name:
                username_taken = await user_models.UserAuth.get_by_username(
                    username=user_name
                )
                if username_taken:
                    return OperationError(
                        error=f"The username {user_name} is already taken"
                    )

                auth_in.user_name = user_name

        if password:
            if len(password) < 5:
                return OperationError(
                    error=f"Password must be more than characters long"
                )

            if password != passwordc:
                return OperationError(error=f"provided passwords do not match")

            auth_in.password = password

        await auth.update(auth_in)
        user = await user_models.User.get(uid=user.uid)
        return UserType(**user.marshal_simple())

    @strawberry.mutation
    async def authenticate_user(
            self, info, username: str, password: str
    ) -> AuthenticatedDataResponse:
        auth = await user_models.UserAuth.get_by_username(username=username)
        if not auth:
            return OperationError(error="Incorrect username")
        has_access = await auth.has_access(password)
        if not has_access:
            return OperationError(error="Failed to log you in")

        # _user = getattr(auth, auth.user_type)
        _user = await user_models.User.get(auth_uid=auth.uid)
        access_token = security.create_access_token(_user.uid)
        refresh_token = security.create_refresh_token(_user.uid)
        return StrawberryMapper[AuthenticatedData]().map(
            token=access_token, refresh=refresh_token, token_type="bearer", user=_user
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

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def unlink_user_auth(self, info, user_uid: str) -> UserResponse:
        user = await user_models.User.get(uid=user_uid)
        if not user:
            return OperationError(error="User not found")

        if not user.auth_uid:
            return OperationError(
                error=f"User {user.full_name} is not linked to auth access"
            )

        await user.unlink_auth()
        return StrawberryMapper[UserType]().map(**user.marshal_simple())

    @strawberry.mutation()
    async def request_password_reset(self, info, email: str) -> MessageResponse:

        user = await user_models.User.get_by_email(email)
        if not user:
            return OperationError(
                error="User with provided email not found? Check your email and try again"
            )

        if not user.auth_uid:
            return OperationError(
                error="Authentication for provided user does not exist. Talk to your administrator"
            )

        password_reset_token = generate_password_reset_token(email)

        post_event("password-reset", user=user, token=password_reset_token)

        msg = "Password recovery email sent"
        return MessagesType(message=msg)

    @strawberry.mutation()
    async def validate_password_reset_token(
            self, info, token: str
    ) -> PasswordResetValidityResponse:

        email = verify_password_reset_token(token)
        if not email:
            return OperationError(error="Your token is invalid")

        user = await user_models.User.get_by_email(email)
        if not user:
            return OperationError(error="Your token is invalid")
        auth = await user_models.UserAuth.get(uid=user.auth_uid)
        return PasswordResetValidityType(
            username=auth.user_name, auth_uid=user.auth_uid
        )

    @strawberry.mutation()
    async def reset_password(
            self,
            info,
            auth_uid: str,
            username: str,
            password: str,
            passwordc: str,
    ) -> MessageResponse:

        auth = await user_models.UserAuth.get(uid=auth_uid, user_name=username)

        if password != passwordc:
            return OperationError(error=f"Passwords dont match")

        auth_in = user_schemas.AuthUpdate(password=password, user_name=username)
        await auth.update(auth_in)
        return MessagesType(
            message="Password was successfully reset, Now login with your new password"
        )

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_group(info, payload: GroupInputType) -> GroupResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can add user groups",
        )

        if not payload.name:
            return OperationError(error="Name Required")

        group = await user_models.Group.get(name=payload.name)
        if group:
            return OperationError(
                error=f"Group with name {payload.name} already exists"
            )

        incoming = {
            "keyword": payload.name.upper(),
            # "created_by_uid": felicity_user.uid,
            # "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        group: user_models.Group = await user_models.Group.create(incoming)
        return GroupType(**group.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_group(info, uid: str, payload: GroupInputType) -> GroupResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update user groups",
        )

        group = await user_models.Group.get(uid=uid)
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

        group = await group.update(group.to_dict())
        return GroupType(**group.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_group_permissions(
            self, info, group_uid: str, permission_uid: str
    ) -> UpdatedGroupPermsResponse:
        if not group_uid or not permission_uid:
            return OperationError(error="Group and Permission are required.")

        group = await user_models.Group.get(uid=group_uid)
        if not group:
            return OperationError(error=f"group with uid {group_uid} not found")

        if permission_uid in [perm.uid for perm in group.permissions]:
            permissions = filter(lambda p: p.uid == permission_uid, group.permissions)
            permission = list(permissions)[0]
            group.permissions.remove(permission)
        else:
            permission = await user_models.Permission.get(uid=permission_uid)
            if not permission:
                return OperationError(
                    error=f"permission with uid {permission_uid} not found"
                )
            group.permissions.append(permission)
        await group.save_async()

        return UpdatedGroupPerms(group=group, permission=permission)
