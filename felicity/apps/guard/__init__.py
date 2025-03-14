from cache import AsyncLRU

from felicity.apps.guard.definitions import FObject, FAction
from felicity.apps.user.entities import Permission
from felicity.apps.user.services import UserService


@AsyncLRU(maxsize=None)
async def _get_user_permissions(user_uid: str) -> list[Permission]:
    """Cached to reduce the costs of frequent access"""
    # TODO: find a way to invalidate after login or every 5 minutes
    return await UserService().get_user_permissions(user_uid)


async def has_perm(user_uid: str, action: FAction, target: FObject):
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
