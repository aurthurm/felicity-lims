import logging

import typing
from apps.analysis.permissions import (
    check_result_verification,
    check_sample_verification,
)
from strawberry.permission import BasePermission
from api.gql.deps import Info

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class IsAuthenticated(BasePermission):
    message = "Only accessible to authenticated users"

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        return await info.context.user


class IsActiveUser(BasePermission):
    message = "You must be an active user"

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        user = await info.context.user
        if not user:
            return False
        return user.is_active


class IsSuperUser(BasePermission):
    message = "You dont have enough privileges"

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        user = await info.context.user
        if not user:
            return False
        
        if not user.is_active:
            return False

        return user.is_superuser


class CanVerifySample(BasePermission):
    message = "Action not allowed"

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        user = await info.context.user
        if not user:
            return False
        
        if not user.is_active:
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
    message = "Action not allowed"

    async def has_permission(self, source: typing.Any, info: Info, **kwargs):
        user = await info.context.user
        if not user:
            return False
        
        if not user.is_active:
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
