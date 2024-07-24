from datetime import datetime
from typing import Mapping, Any

from sqlalchemy import Column, String
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy_mixins import ReprMixin, SerializeMixin

from felicity.core.dtz import format_datetime
from felicity.core.uid_gen import get_flake_uid


class BaseEntity(DeclarativeBase, ReprMixin, SerializeMixin, AsyncAttrs):
    __repr__ = ReprMixin.__repr__
    __name__: str
    __abstract__ = True
    __mapper_args__ = {"eager_defaults": True}

    uid = Column(
        String,
        primary_key=True,
        index=True,
        nullable=False,
        default=get_flake_uid,
    )

    def marshal_simple(self, exclude=None) -> Mapping[str, Any]:
        """convert instance to dict
        leverages instance.__dict__
        """
        if exclude is None:
            exclude = []
        exclude.append("_sa_instance_state")

        data = self.__dict__
        return_data = {}

        for field in data:
            if field not in exclude:
                _v = data[field]
                if isinstance(_v, datetime):
                    _v = format_datetime(_v, human_format=False, with_time=True)
                return_data[field] = _v

        return return_data
