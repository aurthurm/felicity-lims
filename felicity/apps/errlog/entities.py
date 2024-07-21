from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB

from felicity.apps.abstract import AuditUser


class ErrorLog(AuditUser):
    __tablename__ = "error_log"

    content = Column(JSONB)
