from __future__ import annotations

from felicity.apps.abstract.service import BaseService
from felicity.apps.common.utils import is_valid_email
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.exceptions import AlreadyExistsError, ValidationError
from felicity.apps.user.entities import Group, Permission, User, UserPreference, user_groups, permission_groups
from felicity.apps.user.repository import (
    GroupRepository,
    PermissionRepository,
    UserPreferenceRepository,
    UserRepository,
)
from felicity.apps.user.schemas import (
    GroupCreate,
    GroupUpdate,
    PermissionCreate,
    PermissionUpdate,
    UserCreate,
    UserPreferenceCreate,
    UserPreferenceUpdate,
    UserUpdate,
)
from felicity.core.security import get_password_hash, password_check, verify_password


class UserService(BaseService[User, UserCreate, UserUpdate]):
    def __init__(self) -> None:
        super().__init__(UserRepository())

    async def create(
            self, user_in: UserCreate, related: list[str] | None = None
    ) -> User:
        by_username = await self.get_by_username(user_in.user_name)
        if by_username:
            raise AlreadyExistsError("Username already exist")

        policy = password_check(user_in.password, user_in.user_name)
        if not policy["password_ok"]:
            raise ValidationError(policy["message"])
        hashed_password = get_password_hash(user_in.password)
        data = self._import(user_in)
        del data["password"]
        data["hashed_password"] = hashed_password
        return await super().create(data, related=related)

    async def update(self, user_uid: str, user_in: UserUpdate, related=None) -> User:
        update_data = self._import(user_in)

        if "password" in update_data:
            policy = password_check(user_in.password, user_in.user_name)
            if not policy["password_ok"]:
                raise Exception(policy["message"])
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        if "user" in update_data:
            del update_data["user"]

        return await super().update(user_uid, update_data, related)

    async def has_access(self, user: User, password: str):
        if user.is_blocked:
            raise Exception("Blocked Account: Reset Password to regain access")

        if not user.is_active:
            raise Exception("In active account: contact administrator")

        if not verify_password(password, user.hashed_password):
            msg = ""
            retries = user.login_retry
            if user.login_retry < 3:
                msg = f"Wrong Password {2 - retries} attempts left"
                user.login_retry = user.login_retry + 1
                if user.login_retry == 3:
                    user.is_blocked = True
                    msg = "Sorry your Account has been Blocked"
            await self.save(user)
            raise Exception(msg)
        if user.login_retry != 0:
            user.login_retry = 0
            await self.save(user)
        return user

    async def authenticate(self, username, password):
        if is_valid_email(username):
            raise Exception("Use your username authenticate")
        user = await self.get_by_username(username)
        return self.has_access(user, password)

    async def get_by_email(self, email):
        user = await self.get(email=email)
        if not user:
            return None
        return user

    async def get_by_username(self, username) -> User:
        return await self.get(user_name=username)

    async def give_super_powers(self, user_uid: str):
        user = self.get(uid=user_uid)
        user_obj = marshaller(user)
        user_in = UserUpdate(**{**user_obj, "is_superuser": True})
        await self.update(user_uid, user_in)

    async def strip_super_powers(self, user_uid: str):
        user = self.get(uid=user_uid)
        user_obj = marshaller(user)
        user_in = UserUpdate(**{**user_obj, "is_superuser": False})
        await self.update(user_uid, user_in)

    async def activate(self, user_uid: str):
        user = self.get(uid=user_uid)
        user_obj = marshaller(user)
        user_in = UserUpdate(**{**user_obj, "is_active": True})
        await super().update(user_uid, user_in)

    async def deactivate(self, user_uid: str):
        user = self.get(uid=user_uid)
        user_obj = marshaller(user)
        user_in = UserUpdate(**{**user_obj, "is_active": False})
        await super().update(user_uid, user_in)

    async def get_user_permissions(self, user_uid: str) -> list[Permission]:
        user_groups_uid = await self.repository.table_query(user_groups, ["group_uid"], user_uid=user_uid)
        permissions_uid = set()
        for user_group_uid in user_groups_uid:
            groups_permissions = await self.repository.table_query(
                permission_groups, ["permission_uid"], group_uid=user_group_uid
            )
            for permission_uid in groups_permissions:
                permissions_uid.add(permission_uid)
        return await PermissionService().get_by_uids(list(permissions_uid))

    async def get_user_groups(self, user_uid: str) -> list[Group]:
        user_groups_uid = await self.repository.table_query(user_groups, ["group_uid"], user_uid=user_uid)
        return await GroupService().get_by_uids(user_groups_uid) if user_groups_uid else []

    async def set_active_laboratory(self, user_uid: str, laboratory_uid: str) -> None:
        await super().update(user_uid, {'active_laboratory_uid': laboratory_uid})


class GroupService(BaseService[Group, GroupCreate, GroupUpdate]):
    def __init__(self):
        super().__init__(GroupRepository())


class PermissionService(BaseService[Permission, PermissionCreate, PermissionUpdate]):
    def __init__(self):
        super().__init__(PermissionRepository())


class UserPreferenceService(
    BaseService[UserPreference, UserPreferenceCreate, UserPreferenceUpdate]
):
    def __init__(self) -> None:
        super().__init__(UserPreferenceRepository())
