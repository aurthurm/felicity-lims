import logging
from typing import Any 

from sanic.request import Request
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

Info = _Info[Any, RootValueType]

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


async def get_auth_context(request: Request) -> Any:
    if "Authorization" in request.headers:
        authorization = request.headers.get("Authorization", None)
        if not authorization:
            return {"user": None}
        _, credentials = authorization.split()
        return {
            "user": await get_current_active_user(credentials)
        }

    logger.info(f"Context: must authenticate {request}")

    return {"user": None}


async def get_auth_user(request: Request) -> Any:
    if "Authorization" in request.headers:
        authorization = request.headers.get("Authorization", None)
        if not authorization:
            return {"user": None}
        _, credentials = authorization.split()
        return await get_current_active_user(credentials)

    logger.info(f"Context: must authenticate {request}")

    return None
