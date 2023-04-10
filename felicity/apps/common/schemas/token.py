from typing import Optional

from core.uid_gen import FelicityIDType
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[FelicityIDType] = None
