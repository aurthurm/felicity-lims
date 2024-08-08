from .audit import Auditable
from .base import Base
from .listenable import EventListenable


class BaseEntity(Base, Auditable, EventListenable):
    __abstract__ = True
