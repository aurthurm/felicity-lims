from cache import AsyncLRU

from felicity.apps.guard.definitions import FObject, FAction, FGroup
from felicity.apps.user.entities import Permission, Group
from felicity.apps.user.services import UserService


@AsyncLRU(maxsize=None)
async def _get_user_permissions(user_uid: str) -> list[Permission]:
    """Cached to reduce the costs of frequent access"""
    # TODO: find a way to invalidate after login or every 5 minutes
    return await UserService().get_user_permissions(user_uid)


@AsyncLRU(maxsize=None)
async def _get_user_groups(user_uid: str) -> list[Group]:
    """Cached to reduce the costs of frequent access"""
    return await UserService().get_user_groups(user_uid)


async def has_perm(user_uid: str, action: FAction | str, target: FObject):
    """
    Check if a user has permission to perform a specific action on an object.

    Args:
        user_uid: The ID of the User
        action: The action to perform (e.g., FAction.CREATE)
        target: The name of the target object (e.g., FObject.CLIENT)

    Returns:
        bool: True if the user has permission, False otherwise
    """
    if not user_uid: return False
    permissions = await _get_user_permissions(user_uid)
    if len(permissions) == 0: return False

    found = list(filter(
        lambda p: p.action.lower() == action.lower() and p.target.lower() == target.lower(),
        permissions
    ))
    return len(found) > 0


async def has_group(user_uid: str, group: FGroup):
    """
    Check if a user belongs to a given group.

    Args:
        user_uid: The ID of the User
        group: The group to check if user belongs to (e.g., FGroup.ADMINISTRATOR)

    Returns:
        bool: True if the user has permission, False otherwise
    """
    if not user_uid or not group: return False
    groups = await _get_user_groups(user_uid)
    if len(groups) == 0: return False

    found = list(filter(lambda g: g.name.lower() == group.lower(), groups))
    return len(found) > 0
