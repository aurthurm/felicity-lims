from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB

from infrastructure.database import BaseAuditDBModel


class ErrorLog(BaseAuditDBModel):
    __tablename__ = "error_log"

    content = Column(JSONB)
