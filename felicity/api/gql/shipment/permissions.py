import logging
import typing

from strawberry.permission import BasePermission

from felicity.api.deps import Info
from felicity.apps.guard import FObject, has_perm, FAction

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CanActionShipment(BasePermission):
    message = "You are not authorised to action shipment"
    error_extensions = {"code": "UNAUTHORIZED"}

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        user = await info.context.user()
        if not user: return False

        action: str | None = kwargs.get("action", None)
        if action is None:
            self.message = f"Invalid action {action} on Shipment"
            return False

        return has_perm(user.uid, FAction.CREATE, FObject.WORKSHEET)
