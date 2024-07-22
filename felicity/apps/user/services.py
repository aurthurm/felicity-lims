from core.security import (
    verify_password
)
from felicity.apps.abstract.service import BaseService
from felicity.apps.common.utils import is_valid_email
from felicity.apps.user.conf import LABORATORY_CONTACT
from felicity.apps.user.entities import Group, Permission, User, UserAuth, UserPreference
from felicity.apps.user.repository import GroupRepository, PermissionRepository, UserRepository
from felicity.apps.user.schemas import AuthCreate, AuthUpdate, GroupCreate, GroupUpdate, PermissionCreate, PermissionUpdate, UserCreate, UserUpdate



class UserAuthService(BaseService[UserAuth, AuthCreate, AuthUpdate]):
    def __init__(self) -> None:
        super().__init__(UserAuth)

    async def acquire_user_type(self, user_type):
        _update = {
            "user_type": user_type
        }  # {**self.to_dict(), **{'user_type': user_type}}
        update_in = AuthUpdate(**_update)
        await self.update(update_in)

    async def has_access(self, password):
        if self.is_blocked:
            raise Exception("Blocked Account: Reset Password to regain access")
        #  dynamically get self.ccuser / self.lcuser / self.dcuser

        # _user = getattr(self, self.user_type)
        _user = await User.get(auth_uid=self.uid)
        if not _user:
            raise Exception(
                "Authentication disabled for this account. Contact Admin to re-link"
            )

        if not getattr(_user, "is_active"):  # e.g self.ccuser.is_active
            raise Exception("In active account: contact administrator")

        auth_obj = self.to_dict()
        retries = self.login_retry
        if not verify_password(password, self.hashed_password):
            msg = ""
            if self.login_retry < 3:
                retries += 1
                msg = f"Wrong Password {3 - retries} attempts left"
                auth_obj["login_retry"] = retries
                if retries == 3:
                    auth_obj["is_blocked"] = True
                    msg = "Sorry your Account has been Blocked"
            await self.update(auth_obj)
            raise Exception(msg)
        if self.login_retry != 0:
            auth_obj["login_retry"] = 0
            await self.update(auth_obj)
        return self

    async def authenticate(self, username, password):
        if is_valid_email(username):
            raise Exception("Use your username authenticate")
        auth_obj = await self.get_by_username(username)
        has_access = await auth_obj.has_access(password)
        return has_access

class UserService(BaseService[User, UserCreate, UserUpdate]):
    def __init__(self) -> None:
        super().__init__(UserRepository)

    async def propagate_user_type(self):
        """sets the user_type field in auth"""
        if self.auth:
            await self.auth.acquire_user_type(LABORATORY_CONTACT)
        elif self.auth_uid:
            auth = await UserAuth.get(uid=self.auth_uid)
            await auth.acquire_user_type(LABORATORY_CONTACT)
        else:
            raise Exception("auth obj is None")

    async def unlink_auth(self):
        auth = self.auth
        _update = {**self.to_dict(), **{"auth_uid": None, "auth": None}}
        update_in = UserUpdate(**_update)
        await self.update(update_in)
        if not self.auth:
            await auth.delete()

    async def link_auth(self, auth_uid):
        _update = {
            "auth_uid": auth_uid
        }  # {**result.to_dict(), **{'auth_uid': auth_uid}}
        update_in = UserUpdate(**_update)
        await self.update(update_in)

    async def link_preference(self, preference_uid):
        _update = {
            "preference_uid": preference_uid
        }  # {**result.to_dict(), **{'auth_uid': auth_uid}}
        update_in = UserUpdate(**_update)
        return await self.update(update_in)


class GroupService(BaseService[Group, GroupCreate, GroupUpdate]):
    def __init__(self):
        super().__init__(GroupRepository)

    def add_member(self, member):
        self.members.add(member)

    def remove_member(self, member):
        self.members.remove(member)

    def add_perm(self, perm):
        self.permissions.add(perm)

    def remove_perm(self, perm):
        self.permissions.remove(perm)
  

class PermissionService(BaseService[Permission, PermissionCreate, PermissionUpdate]):
    def __init__(self):
        super().__init__(PermissionRepository)


class UserPreferenceService(BaseService[UserPreference]):
    def __init__(self) -> None:
        super().__init__(UserPreference)
