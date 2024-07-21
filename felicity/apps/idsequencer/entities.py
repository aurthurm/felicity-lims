from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from infrastructure.database import DBModel


class IdSequence(DBModel):
    __tablename__ = "id_sequence"

    prefix = Column(String, nullable=False, unique=True)
    number = Column(Integer, nullable=False)
    updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
