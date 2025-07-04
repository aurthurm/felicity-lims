import logging
import typing

from strawberry.permission import BasePermission

from felicity.api.deps import Info
from felicity.apps.analysis.permissions import (
    check_result_verification,
    check_sample_verification,
)
from felicity.apps.guard import has_perm, FAction, FObject

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CanVerifySample(BasePermission):
    message = "You have no privileges to verify this sample"
    error_extensions = {"code": "UNAUTHORIZED"}

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        user = await info.context.user()
        if not user:
            return False

        if not user.is_active or not has_perm(user.uid, FAction.APPROVE, FObject.SAMPLE):
            return False

        try:
            samples = kwargs.get("samples", [])
        except KeyError:
            samples = []

        _, restricted, message, suggestion = await check_sample_verification(
            samples, user
        )

        if restricted:
            self.message = message + " " + suggestion
            return False

        return True


class CanVerifyAnalysisResult(BasePermission):
    message = "You have no privileges to verify these analyses"
    error_extensions = {"code": "UNAUTHORIZED"}

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        user = await info.context.user()

        if not user:
            return False

        if not user.is_active or not (await has_perm(user.uid, FAction.APPROVE, FObject.RESULT)):
            return False

        try:
            analyses = kwargs.get("analyses", [])
        except KeyError:
            analyses = []

        _, restricted, message, suggestion = await check_result_verification(
            analyses, user
        )

        if restricted:
            self.message = message + " " + suggestion
            return False

        return True
