from typing import Optional

from pydantic import BaseModel

from felicity.core.uid_gen import FelicityIDType


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[FelicityIDType] = None
