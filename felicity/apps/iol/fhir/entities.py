from sqlalchemy import Boolean, Column, String
from sqlalchemy.dialects.postgresql import JSONB

from felicity.apps.abstract import LabScopedEntity


class FhirTask(LabScopedEntity):
    incoming = Column(Boolean, default=True)
    data = Column(JSONB)
    status = Column(String)
