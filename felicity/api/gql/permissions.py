import logging
import typing

from strawberry.permission import BasePermission

from felicity.api.deps import Info
from felicity.apps.guard import FAction, FObject, has_perm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class IsAuthenticated(BasePermission):
    message = "Only accessible to authenticated users"
    error_extensions = {"code": "UNAUTHORIZED"}

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        user = await info.context.user()
        return user is not None


class IsActiveUser(BasePermission):
    message = "You must be an active user"
    error_extensions = {"code": "UNAUTHORIZED"}

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        user = await info.context.user()
        if not user:
            return False
        return user.is_active


class IsSuperUser(BasePermission):
    message = "You dont have enough privileges"
    error_extensions = {"code": "UNAUTHORIZED"}

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        user = await info.context.user()
        if not user:
            return False

        if not user.is_active:
            return False

        return user.is_superuser


class HasPermission(BasePermission):
    """
    Permission class for checking if a user has permission to perform actions on objects.
    """
    error_extensions = {"code": "UNAUTHORIZED"}

    def __init__(self, action: FAction, target: FObject, message_action: str | None = None):
        super().__init__()
        self.action = message_action if message_action else action
        self.target = target
        self.message = f"You are not authorized to {action} {target}"

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        user = await info.context.user()
        if not user: return False
        if not user.is_active:  return False
        return await has_perm(user.uid, self.action, self.target)
