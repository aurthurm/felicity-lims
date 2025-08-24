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
from felicity.core.config import settings
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
        user = await self.get(uid=user_uid)
        is_global = user.user_name in [
            settings.SYSTEM_DAEMON_USERNAME, settings.FIRST_SUPERUSER_USERNAME
        ]
        if is_global:
            user_groups_uid = await self.repository.table_query(
                user_groups, ["group_uid"],
                user_uid=user_uid
            )
        else:
            user_groups_uid = await self.repository.table_query(
                user_groups, ["group_uid"],
                user_uid=user_uid
            )
        permissions_uid = set()
        for user_group_uid in user_groups_uid:
            if is_global:
                groups_permissions = await self.repository.table_query(
                    permission_groups, ["permission_uid"],
                    group_uid=user_group_uid
                )
            else:
                groups_permissions = await self.repository.table_query(
                    permission_groups, ["permission_uid"],
                    group_uid=user_group_uid
                )
            for permission_uid in groups_permissions:
                permissions_uid.add(permission_uid)
        return await PermissionService().get_by_uids(list(permissions_uid))

    async def get_user_groups(self, user_uid: str) -> list[Group]:
        user_groups_uid = await self.repository.table_query(user_groups, ["group_uid"], user_uid=user_uid)
        return await GroupService().get_by_uids(user_groups_uid) if user_groups_uid else []

    async def set_active_laboratory(self, user_uid: str, laboratory_uid: str) -> None:
        await super().update(user_uid, {'active_laboratory_uid': laboratory_uid})

    async def get_users_by_laboratory(self, laboratory_uid: str) -> list[User]:
        """Get all users assigned to a specific laboratory"""
        return await self.repository.get_users_by_laboratory(laboratory_uid)

    async def get_laboratories_by_user(self, user_uid: str) -> list[str]:
        """Get all laboratory UIDs a user has access to"""
        return await self.repository.get_laboratories_by_user(user_uid)

    async def assign_user_to_laboratory(self, user_uid: str, laboratory_uid: str) -> User:
        """Assign a user to a laboratory"""
        user = await self.get(uid=user_uid)
        if not user:
            raise ValueError(f"User with uid '{user_uid}' not found")

        # Check if laboratory exists
        from felicity.apps.setup.services import LaboratoryService
        laboratory = await LaboratoryService().get(uid=laboratory_uid)
        if not laboratory:
            raise ValueError(f"Laboratory with uid '{laboratory_uid}' not found")

        await self.repository.assign_user_to_laboratory(user_uid, laboratory_uid)

        # Set as active lab if user has no active laboratory
        if not user.active_laboratory_uid:
            await self.set_active_laboratory(user_uid, laboratory_uid)

        return await self.get(uid=user_uid)

    async def remove_user_from_laboratory(self, user_uid: str, laboratory_uid: str) -> User:
        """Remove a user from a laboratory"""
        user = await self.get(uid=user_uid)
        if not user:
            raise ValueError(f"User with uid '{user_uid}' not found")

        await self.repository.remove_user_from_laboratory(user_uid, laboratory_uid)

        # If removed lab was active, clear active laboratory
        if user.active_laboratory_uid == laboratory_uid:
            # Find another lab to set as active
            remaining_labs = await self.get_laboratories_by_user(user_uid)
            if remaining_labs:
                await self.set_active_laboratory(user_uid, remaining_labs[0])
            else:
                await self.set_active_laboratory(user_uid, None)

        return await self.get(uid=user_uid)

    async def search_users(
            self, text: str, laboratory_uid: str = None, limit: int = 10
    ) -> list[User]:
        """Search users by text"""
        return await self.repository.search_users(text, laboratory_uid, limit)

    async def get_user_by_email_or_username(self, identifier: str) -> User | None:
        """Get user by email or username"""
        return await self.repository.get_user_by_email_or_username(identifier)

    async def create_user_with_laboratory(
            self, user_data: UserCreate, laboratory_uid: str, group_uid: str = None
    ) -> User:
        """Create a new user and assign to laboratory"""
        # Create the user
        user = await self.create(user_data)

        # Assign to laboratory
        await self.assign_user_to_laboratory(user.uid, laboratory_uid)

        # Add to group if provided
        if group_uid:
            group_service = GroupService()
            group = await group_service.get(uid=group_uid)
            if group:
                user.groups.append(group)
                await self.save(user)

        return user

    async def bulk_assign_users_to_laboratory(
            self, user_uids: list[str], laboratory_uid: str
    ) -> list[User]:
        """Assign multiple users to a laboratory"""
        results = []
        for user_uid in user_uids:
            try:
                user = await self.assign_user_to_laboratory(user_uid, laboratory_uid)
                results.append(user)
            except ValueError:
                # Skip invalid users
                continue
        return results

    async def get_user_access_summary(self, user_uid: str) -> dict:
        """Get comprehensive access summary for a user"""
        user = await self.get(uid=user_uid)
        if not user:
            raise ValueError(f"User with uid '{user_uid}' not found")

        laboratories = await self.get_laboratories_by_user(user_uid)
        groups = await self.get_user_groups(user_uid)
        permissions = await self.get_user_permissions(user_uid)

        return {
            "user": user,
            "laboratories": laboratories,
            "active_laboratory": user.active_laboratory_uid,
            "groups": groups,
            "permissions": permissions,
            "is_active": user.is_active,
            "is_blocked": user.is_blocked,
            "is_superuser": user.is_superuser
        }


class GroupService(BaseService[Group, GroupCreate, GroupUpdate]):
    def __init__(self):
        super().__init__(GroupRepository())

    async def get_groups_by_laboratory(self, laboratory_uid: str = None) -> list[Group]:
        """Get all groups for a specific laboratory or global groups"""
        return await self.repository.get_groups_by_laboratory(laboratory_uid)

    async def get_group_by_name(self, name: str, laboratory_uid: str = None) -> Group | None:
        """Get group by name within laboratory scope"""
        return await self.repository.get_group_by_name(name, laboratory_uid)

    async def create_group_for_laboratory(
            self, group_data: GroupCreate, laboratory_uid: str = None
    ) -> Group:
        """Create a new group in laboratory context"""
        # Check if group already exists in this context
        existing = await self.get_group_by_name(group_data.name, laboratory_uid)
        if existing:
            scope = "globally" if not laboratory_uid else f"in laboratory {laboratory_uid}"
            raise ValueError(f"Group '{group_data.name}' already exists {scope}")

        # Set laboratory context
        group_dict = group_data.model_dump()
        group_dict["laboratory_uid"] = laboratory_uid
        group_dict["keyword"] = group_data.name.upper()

        return await self.create(group_dict)

    async def search_groups(
            self, text: str, laboratory_uid: str = None, limit: int = 10
    ) -> list[Group]:
        """Search groups by text"""
        return await self.repository.search_groups(text, laboratory_uid, limit)

    async def assign_permission_to_group(
            self, group_uid: str, permission_uid: str, laboratory_uid: str = None
    ) -> Group:
        """Assign a permission to a group"""
        group = await self.get(uid=group_uid)
        if not group:
            raise ValueError(f"Group with uid '{group_uid}' not found")

        # Check if permission exists
        permission = await PermissionService().get(uid=permission_uid)
        if not permission:
            raise ValueError(f"Permission with uid '{permission_uid}' not found")

        await self.repository.assign_permission_to_group(group_uid, permission_uid, laboratory_uid)

        # Return updated group with permissions
        return await self.get(uid=group_uid, related=['permissions'])

    async def remove_permission_from_group(
            self, group_uid: str, permission_uid: str, laboratory_uid: str = None
    ) -> Group:
        """Remove a permission from a group"""
        group = await self.get(uid=group_uid)
        if not group:
            raise ValueError(f"Group with uid '{group_uid}' not found")

        await self.repository.remove_permission_from_group(group_uid, permission_uid, laboratory_uid)

        # Return updated group with permissions
        return await self.get(uid=group_uid, related=['permissions'])

    async def get_groups_with_permission(self, permission_uid: str, laboratory_uid: str = None) -> list[Group]:
        """Get all groups that have a specific permission"""
        return await self.repository.get_groups_with_permission(permission_uid, laboratory_uid)

    async def clone_group_to_laboratory(self, group_uid: str, target_laboratory_uid: str) -> Group:
        """Clone a group from global or another laboratory to target laboratory"""
        source_group = await self.get(uid=group_uid, related=['permissions'])
        if not source_group:
            raise ValueError(f"Source group with uid '{group_uid}' not found")

        # Check if group already exists in target laboratory
        existing = await self.get_group_by_name(source_group.name, target_laboratory_uid)
        if existing:
            raise ValueError(f"Group '{source_group.name}' already exists in target laboratory")

        # Create new group data
        group_data = GroupCreate(
            name=source_group.name,
            keyword=source_group.keyword,
            pages=source_group.pages,
            active=source_group.active
        )

        # Create the group in target laboratory
        new_group = await self.create_group_for_laboratory(group_data, target_laboratory_uid)

        # Copy permissions
        if source_group.permissions:
            for permission in source_group.permissions:
                await self.assign_permission_to_group(
                    new_group.uid, permission.uid, target_laboratory_uid
                )

        return await self.get(uid=new_group.uid, related=['permissions'])


class PermissionService(BaseService[Permission, PermissionCreate, PermissionUpdate]):
    def __init__(self):
        super().__init__(PermissionRepository())

    async def get_permissions_by_action_target(self, action: str, target: str) -> list[Permission]:
        """Get permissions by action and target"""
        return await self.repository.get_permissions_by_action_target(action, target)

    async def get_permissions_by_action(self, action: str) -> list[Permission]:
        """Get all permissions for a specific action"""
        return await self.repository.get_permissions_by_action(action)

    async def get_permissions_by_target(self, target: str) -> list[Permission]:
        """Get all permissions for a specific target object"""
        return await self.repository.get_permissions_by_target(target)

    async def search_permissions(self, text: str, limit: int = 10) -> list[Permission]:
        """Search permissions by text"""
        return await self.repository.search_permissions(text, limit)

    async def create_permission_if_not_exists(self, action: str, target: str) -> Permission:
        """Create a permission if it doesn't already exist"""
        existing = await self.repository.get_permissions_by_action_target(action, target)
        if existing:
            return existing[0]

        permission_data = PermissionCreate(
            action=action,
            target=target,
            active=True
        )

        return await self.create(permission_data)

    async def bulk_create_permissions(self, permissions_data: list[dict]) -> list[Permission]:
        """Create multiple permissions at once"""
        created_permissions = []

        for perm_data in permissions_data:
            try:
                permission = await self.create_permission_if_not_exists(
                    perm_data["action"], perm_data["target"]
                )
                created_permissions.append(permission)
            except Exception:
                # Skip invalid permissions
                continue

        return created_permissions

    async def get_permission_usage_summary(self, permission_uid: str) -> dict:
        """Get summary of groups and users that have this permission"""
        permission = await self.get(uid=permission_uid)
        if not permission:
            raise ValueError(f"Permission with uid '{permission_uid}' not found")

        # Get groups with this permission (both global and lab-specific)
        global_groups = await GroupService().get_groups_with_permission(permission_uid, None)

        # This could be extended to get lab-specific groups as well
        # For now, just return global usage

        return {
            "permission": permission,
            "global_groups": global_groups,
            "total_groups": len(global_groups)
        }


class UserPreferenceService(
    BaseService[UserPreference, UserPreferenceCreate, UserPreferenceUpdate]
):
    def __init__(self) -> None:
        super().__init__(UserPreferenceRepository())
