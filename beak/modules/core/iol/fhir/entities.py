from sqlalchemy import Boolean, Column, String
from sqlalchemy.dialects.postgresql import JSONB

from beak.modules.core.abstract import BaseEntity


class FhirTask(BaseEntity):
    incoming = Column(Boolean, default=True)
    data = Column(JSONB)
    status = Column(String)
