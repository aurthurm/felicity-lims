import logging
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Boolean, Table
from sqlalchemy.orm import relationship, backref

from felicity.apps import BaseAuditDBModel, DBModel
from felicity.apps.setup.models.setup import Department
from felicity.apps.user.models import User
from . import schemas
from felicity.apps import BaseAuditDBModel, DBModel, Auditable

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Message(BaseAuditDBModel):
    """SampleType"""
    recipients = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    body = Column(String, nullable=False)
    archived = Column(Boolean(), default=False)
    deleted_by = Column(Boolean(), default=False)