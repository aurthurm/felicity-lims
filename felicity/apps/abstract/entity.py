from typing import Any, Mapping

from sqlalchemy import Column, String, select
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy_mixins import ReprMixin, SerializeMixin, SmartQueryMixin, SessionMixin
from sqlalchemy_mixins.utils import classproperty

from felicity.core.uid_gen import get_flake_uid


def new_query(cls):
    """
    New implementation of query method that returns select(cls).
    """
    return select(cls)


# Remove session-related methods
delattr(SessionMixin, 'set_session')
delattr(SessionMixin, 'session')
SessionMixin.query = classproperty(new_query)


class BaseEntity(DeclarativeBase, ReprMixin, SerializeMixin, SmartQueryMixin, AsyncAttrs):
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

    @classproperty
    def settable_attributes(cls):
        return cls.columns + cls.hybrid_properties + cls.settable_relations

    def fill(self, **kwargs):
        for name in kwargs.keys():
            if name in self.settable_attributes:
                setattr(self, name, kwargs[name])
            else:
                raise KeyError("Attribute '{}' doesn't exist".format(name))

        return self

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
                # if isinstance(_v, datetime):
                #     _v = format_datetime(_v, human_format=False, with_time=True)
                return_data[field] = _v

        return return_data
