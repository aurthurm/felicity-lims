from sqlalchemy import Boolean, Column, String
from sqlalchemy.dialects.postgresql import JSONB

from felicity.apps import BaseAuditDBModel


class FhirTask(BaseAuditDBModel):
    incoming = Column(Boolean, default=True)
    data = Column(JSONB)
    status = Column(String)
