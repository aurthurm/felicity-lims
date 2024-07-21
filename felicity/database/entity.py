from sqlalchemy import Column, String
from sqlalchemy.orm import DeclarativeBase

from core.uid_gen import get_flake_uid


class BaseEntity(DeclarativeBase):
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
