from typing import Any, Optional


from pydantic import BaseModel

#
# Job Schemas
#
class ErrorLogBase(BaseModel):
    content: Optional[Any] = None


class ErrorLog(ErrorLogBase):
    uid: str | None = None

    class Config:
        orm_mode = True


class ErrorLogCreate(ErrorLogBase):
    pass


class ErrorLogUpdate(ErrorLogBase):
    pass
