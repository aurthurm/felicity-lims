from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from felicity.apps.abstract import BaseEntity


class IdSequence(BaseEntity):
    __tablename__ = "id_sequence"

    prefix = Column(String, nullable=False, unique=True)
    number = Column(Integer, nullable=False)
    updated = Column(DateTime, default=datetime.now, onupdate=datetime.now)
