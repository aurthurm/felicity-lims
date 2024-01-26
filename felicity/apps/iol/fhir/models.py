from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column, String, Boolean

from felicity.apps import BaseAuditDBModel


class FhirTask(BaseAuditDBModel):
    incoming = Column(Boolean, default=True)
    data = Column(JSONB)
    status = Column(String)
