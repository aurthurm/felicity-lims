from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB

from apps import BaseAuditDBModel
from . import schemas


class ErrorLog(BaseAuditDBModel):
    __tablename__ = "error_log"

    content = Column(JSONB)

    @classmethod
    async def create(cls, obj_in: dict | schemas.ErrorLogCreate) -> schemas.ErrorLog:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | schemas.ErrorLogUpdate) -> schemas.ErrorLog:
        data = self._import(obj_in)
        return await super().update(**data)
