import logging
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from graphql import GraphQLError
from jose import jwt, JWTError
from pydantic import ValidationError
from strawberry.fastapi import BaseContext
from strawberry.types.info import Info as StrawberryInfo
from strawberry.types.info import RootValueType

from felicity.apps.common import schemas as core_schemas  # noqa
from felicity.apps.user.entities import User
from felicity.apps.user.services import UserService
from felicity.core import get_settings  # noqa
from felicity.core.tenant_context import (
    get_tenant_context,
    TenantContext,
    require_lab_context,
    require_user_context
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="felicity-gql", scheme_name="JWT")


async def _get_user(token: str):
    user_service = UserService()
    if not token:
        GraphQLError("No auth token")
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = core_schemas.TokenPayload(**payload)
    except (JWTError, ValidationError):
        return None

    return await user_service.get(uid=token_data.sub)


async def get_current_user(
        token: Annotated[str, Depends(oauth2_scheme)],
) -> User | None:
    return await _get_user(token)


async def get_current_active_user(
        token: Annotated[str, Depends(oauth2_scheme)],
) -> User | None:
    current_user = await _get_user(token)
    if not current_user or not current_user.is_active:
        return None
    return current_user


class InfoContext(BaseContext):
    async def user(self) -> User | None:
        if not self.request:
            return None
        authorization = self.request.headers.get("Authorization", None)
        if not authorization:
            return None

        token = authorization.split(" ")[1]
        return await _get_user(token)


Info = StrawberryInfo[InfoContext, RootValueType]


async def get_gql_context() -> InfoContext:
    return InfoContext()


# Tenant-aware dependency functions
def get_current_tenant_context() -> TenantContext:
    """Get current tenant context, raise error if not available"""
    context = get_tenant_context()
    if not context:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No tenant context available"
        )
    return context


def require_authenticated_user() -> str:
    """Require authenticated user, return user UID"""
    try:
        return require_user_context()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )


def require_lab_context_dep() -> str:
    """Require laboratory context, return lab UID"""
    try:
        return require_lab_context()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Laboratory context required. Please select a laboratory."
        )


async def get_current_user_from_context() -> User:
    """Get current user from tenant context"""
    context = get_tenant_context()
    if not context or not context.user_uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )

    user_service = UserService()
    user = await user_service.get(uid=context.user_uid)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user


def get_audit_context() -> dict:
    """Get audit context from tenant context"""
    context = get_tenant_context()
    if not context:
        return {}

    return {
        "user_uid": context.user_uid,
        "laboratory_uid": context.laboratory_uid,
        "organization_uid": context.organization_uid,
        "request_id": context.request_id,
        "ip_address": context.ip_address,
    }
