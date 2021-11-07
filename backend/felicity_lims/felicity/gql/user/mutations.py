from datetime import timedelta
import logging
import time
from typing import Optional

import strawberry

from felicity.core.config import settings
from felicity.core import security
from felicity.core.security import generate_password_reset_token
from felicity.apps.user import models as user_models
from felicity.apps.user import schemas as user_schemas
from felicity.gql.user.types import UserType, AuthenticatedData, UpdatedGroupPerms
from felicity.gql.user.types import UserAuthType

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def simple_task(message: str):
    time.sleep(4)
    logger.info(f"finished task: {message}")
    return message


@strawberry.type
class UserMutations:
    @strawberry.mutation
    async def create_user(self, info, first_name: str, last_name: str,
                          email: str, open_reg: Optional[bool] = False) -> UserType:
        if open_reg and not settings.USERS_OPEN_REGISTRATION:
            raise Exception("Open user registration is forbidden on this server")

        if email:
            user_e = await user_models.User.get_by_email(email=email)
            if user_e:
                raise Exception("A user with this email already exists in the system")

        user_in = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "is_superuser": False,
        }
        user_in = user_schemas.UserCreate(**user_in)
        user = await user_models.User.create(user_in=user_in)
        if user_in.email:
            logger.info("Handle email sending in a standalone service")
        return user

    @strawberry.mutation
    async def update_user(self, info, user_uid: int, first_name: Optional[str], last_name: Optional[str],
                          mobile_phone: Optional[str], email: Optional[str], group_uid: Optional[int],
                          is_active: Optional[bool]) -> UserType:

        user = await user_models.User.get_one(uid=user_uid)
        if not user:
            raise Exception("Error, failed to fetch user for updating")

        user_data = user.to_dict().keys()
        if first_name and 'first_name' in user_data:
            setattr(user, 'first_name', first_name)
        if last_name and 'last_name' in user_data:
            setattr(user, 'last_name', last_name)
        if email and 'email' in user_data:
            setattr(user, 'email', email)
        if mobile_phone and 'mobile_phone' in user_data:
            setattr(user, 'mobile_phone', mobile_phone)
        if is_active and 'is_active' in user_data:
            setattr(user, 'is_active', is_active)

        user_in = user_schemas.UserUpdate(**user.to_dict())
        user = await user.update(user_in)

        # group management
        grp_ids = [grp.uid for grp in user.groups]
        if group_uid and group_uid not in grp_ids:
            group = await user_models.Group.get(uid=group_uid)
            user.groups = [group]
            user = await user.save()

        return user

    @strawberry.mutation
    async def create_user_auth(self, info, user_uid: int, username: str, password: str, passwordc: str) -> UserAuthType:
        auth = await user_models.UserAuth.get_by_username(username=username)
        user = await user_models.User.get(uid=user_uid)

        # 1. Link if not already Linked
        if auth and user:
            linked_user = await user_models.User.get(auth_uid=auth.uid)

            if user.auth:
                if user.auth.uid == auth.uid:
                    raise Exception(f"The two accounts are already linked")
                else:
                    raise Exception(f"User is already linked to different auth details")
            elif linked_user:  # auth.lcuser/auth.ccuser/auth.dcuser
                raise Exception(f"Auth details are already linked to {linked_user.full_name}")
            else:
                await user.link_auth(auth_uid=auth.uid)
        else:
            if not user:  # if there is no user there is nothing to link
                raise Exception("An error occured: Try Again")  # Should never happen :)

            if password != passwordc:
                raise Exception("Password do not match, try again")

            auth_in = {
                "user_name": username,
                "password": password,
                "login_retry": 0,
                "is_blocked": False
            }
            auth_schema = user_schemas.AuthCreate(**auth_in)
            auth = await user_models.UserAuth.create(auth_in=auth_schema)
            await user.link_auth(auth_uid=auth.uid)
            time.sleep(1)
            await user.propagate_user_type()
        return auth

    @strawberry.mutation
    async def update_user_auth(self, info, user_uid: int, username: Optional[str],
                               password: Optional[str], passwordc: Optional[str]) -> UserType:
        if not username or not password:
            raise Exception("Provide username and password to update")

        user = await user_models.User.get_one(uid=user_uid)
        if not user:
            raise Exception("Error, failed to fetch user for updating")

        if not user.auth_uid:
            raise Exception(f"User {user.full_name} has not authentication account")

        auth = user.auth
        auth_in = user_schemas.AuthUpdate(**auth.to_dict())

        if username:
            username_taken = await user_models.UserAuth.get_by_username(username=username)
            if username_taken:
                raise Exception(f"The username {username} is already taken")

            auth_in.user_name = username

        if password:
            if len(password) < 5:
                raise Exception(f"Password must be more than characters long")

            if password != passwordc:
                raise Exception(f"provided passwords do not match")

            auth_in.password = password

        await auth.update(auth_in)
        return user

    @strawberry.mutation
    async def authenticate_user(self, info, username: str, password: str) -> AuthenticatedData:
        auth = await user_models.UserAuth.get_by_username(username=username)
        if not auth:
            raise Exception("Incorrect username")

        has_access = await auth.has_access(password)
        if not has_access:
            raise Exception("Failed to log you in")  # Weird it should not reach here

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        # _user = getattr(auth, auth.user_type)
        _user = await user_models.User.get(auth_uid=auth.uid)
        access_token = security.create_access_token(_user.uid, expires_delta=access_token_expires),
        return AuthenticatedData(token=access_token[0], token_type="bearer", user=_user)

    @strawberry.mutation
    async def unlink_user_auth(self, info, user_uid: int) -> UserType:
        user = await user_models.User.get(uid=user_uid)
        if not user:
            raise Exception("User not found")

        if not user.auth_uid:
            raise Exception(f"User {user.full_name} is not linked to auth access")

        await user.unlink_auth()
        return user

    @strawberry.mutation
    async def recover_password(self, info, username: str) -> str:
        auth = await user_models.UserAuth.get_by_username(username=username)
        if not auth:
            raise Exception("Error, failed to fetch user for password reset")

        user = await user_models.User.get(auth_uid=auth.uid)
        if not user:
            raise Exception("You cannot rest password for an un-linked account")

        password_reset_token = generate_password_reset_token(email=auth.user.email)
        # send_reset_password_email(
        #     email_to=user.email, email=user.email, token=password_reset_token
        # )
        # TODO: MAYBE ADD SECURITY QUESTIONS TO RECOVER PASSWORD or give them a passphrase to remember
        # TODO: send them a new passwod to their registered phone
        # TODO: SEND USER A DEFAULT PASSWORD TO LOGIN WITH SO THEY CAN CHANGE LATER
        msg = "Password recovery email sent"
        return msg

    @strawberry.mutation
    async def update_group_permissions(self, info, group_uid: int, permission_uid: int) -> UpdatedGroupPerms:
        if not group_uid or not permission_uid:
            raise Exception("Group and Permission are required.")

        permission = await user_models.Permission.get(uid=permission_uid)
        if not permission:
            raise Exception(f"permission with uid {permission_uid} not found")

        group = await user_models.Group.get(uid=group_uid)
        if not group:
            raise Exception(f"group with uid {group_uid} not found")

        print(dir(group.permissions))

        if permission in group.permissions:
            group.permissions.remove(permission)
        else:
            group.permissions.append(permission)

        ok = True
        return UpdatedGroupPerms(group=group, permission=permission)

# Reset password is an api_endpoint since it will be a link
