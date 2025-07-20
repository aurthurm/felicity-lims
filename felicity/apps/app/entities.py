from sqlalchemy import Column, Integer, String, Text, Float
from sqlalchemy.ext.declarative import declarative_base

from felicity.apps.abstract import BaseEntity

Base = declarative_base()


class APPActivityLog(BaseEntity):
    """Model for logging APP activity"""
    __tablename__ = 'app_activity_logs'
    __repr_fields__ = ('token_identifier',)

    token_identifier = Column(String(255), nullable=False)
    user_uid = Column(String(39), nullable=True)
    # Request Info
    request_id = Column(String(39), nullable=True)
    path = Column(String(255), nullable=False)
    method = Column(String(10), nullable=False)
    query_params = Column(Text, nullable=True)
    headers = Column(Text, nullable=True)
    body = Column(Text, nullable=True)
    # Response info
    response_code = Column(Integer, nullable=False)
    response_body = Column(Text, nullable=True)
    # Meta information
    ip_address = Column(String(39), nullable=True)  # GenericIPAddressField equivalent
    user_agent = Column(String(512), nullable=True)
    duration = Column(Float, nullable=False)
    # multitenancy
    laboratory_uid = Column(String(39), nullable=True)
    organization_uid = Column(String(39), nullable=True)
