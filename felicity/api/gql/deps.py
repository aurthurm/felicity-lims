import logging
from fastapi import Depends
from functools import cached_property
from strawberry.fastapi import BaseContext
from strawberry.types import Info as _Info
from strawberry.types.info import RootValueType

from apps.common import schemas as core_schemas  # noqa
from apps.user import models  # noqa
from core import security  # noqa
from core.config import settings  # noqa
from graphql import GraphQLError
from jose import jwt
from pydantic import ValidationError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def get_current_user(token: str = None) -> models.User:
    if not token:
        GraphQLError("No auth token")
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = core_schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError) as e:
        return None

    return await models.User.get(uid=token_data.sub)


async def get_current_active_user(token: str = None) -> models.User:
    current_user = await get_current_user(token=token)
    if not current_user or not current_user.is_active:
        return None
    return current_user


async def get_current_active_superuser(token: str = None) -> models.User:
    current_user = await get_current_user(token=token)
    if not current_user.is_superuser:
        return None
    return current_user


class Context(BaseContext):
    # @cached_property
    async def user(self) -> models.User | None:
        if not self.request:
            return None
    
        if "Authorization" in self.request.headers:
            authorization = self.request.headers.get("Authorization", None)
            if not authorization:
                return
            _, credentials = authorization.split()
            return await get_current_user(credentials) if authorization else None

        if "auth" in self.request.query_params:
            logger.info(f"Context: must authenticate {self.request.query_params}")
            return None
        
        return  None


Info = _Info[Context, RootValueType]


async def get_context() -> Context:
    return Context()
