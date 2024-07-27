from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.ext.declarative import declared_attr

from felicity.apps.abstract import AuditUser


class AbstractBaseUser(AuditUser):
    __abstract__ = True

    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    mobile_phone = Column(String, nullable=True)
    business_phone = Column(String, nullable=True)
    user_name = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    login_retry = Column(Integer)
    is_blocked = Column(Boolean(), default=False)
    avatar = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    default_route = Column(Boolean(), nullable=True)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)

    @property
    def has_password(self):
        return True if self.hashed_password else False

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
