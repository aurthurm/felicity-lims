from apps import BaseAuditDBModel
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB

from . import schemas


class ErrorLog(BaseAuditDBModel):
    content = Column(JSONB)

    @classmethod
    async def create(cls, obj_in: schemas.ErrorLogCreate) -> schemas.ErrorLog:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ErrorLogUpdate) -> schemas.ErrorLog:
        data = self._import(obj_in)
        return await super().update(**data)
