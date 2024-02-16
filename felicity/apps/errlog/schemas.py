from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


#
# Job Schemas
#
class ErrorLogBase(BaseModel):
    content: Optional[Any] = None


class ErrorLog(ErrorLogBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class ErrorLogCreate(ErrorLogBase):
    pass


class ErrorLogUpdate(ErrorLogBase):
    pass
