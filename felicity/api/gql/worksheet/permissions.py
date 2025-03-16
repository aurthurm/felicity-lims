import logging
import typing

from strawberry.permission import BasePermission

from felicity.api.deps import Info
from felicity.apps.guard import FObject, has_perm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CanActionWorksheet(BasePermission):
    message = "You cannot take this action on this worksheet"
    error_extensions = {"code": "UNAUTHORIZED"}

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        user = await info.context.user()
        if not user: return False

        action: str | None = kwargs.get("action", None)
        if action is None:
            self.message = f"Invalid action {action} on Worksheet"
            return False

        take_action = has_perm(user.uid, action, FObject.WORKSHEET)
        if not take_action:
            self.message = f"You are not authorized to {action} Worksheet"
        return take_action
