import logging
from typing import Annotated

from fastapi import Depends
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
