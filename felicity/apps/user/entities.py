import logging

from sqlalchemy import Boolean, Column, ForeignKey, String, Table
from sqlalchemy.orm import relationship

from felicity.apps.abstract.entity import BaseEntity

from .abstract import AbstractBaseUser

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# TODO: Refactor User to LaboratoryContact, UserAuth to ContactAuth


"""
Many to Many Link between Group and User
"""
user_groups = Table(
    "user_groups",
    BaseEntity.metadata,
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
    Column("group_uid", ForeignKey("group.uid"), primary_key=True),
)

"""
Many to Many Link between Group and Permission
"""
permission_groups = Table(
    "permission_groups",
    BaseEntity.metadata,
    Column("permission_uid", ForeignKey("permission.uid"), primary_key=True),
    Column("group_uid", ForeignKey("group.uid"), primary_key=True),
)


class User(AbstractBaseUser):
    __tablename__ = "user"

    groups = relationship(
        "Group", secondary=user_groups, back_populates="members", lazy="selectin"
    )
    preference_uid = Column(String, ForeignKey("user_preference.uid"))
    preference = relationship(
        "UserPreference", foreign_keys=[preference_uid], lazy="selectin"
    )


class Permission(BaseEntity):
    __tablename__ = "permission"

    action = Column(String, nullable=False)  # e.g create, modify
    target = Column(String, nullable=False)  # e.g sample, worksheet
    active = Column(Boolean(), default=True)


class Group(BaseEntity):
    __tablename__ = "group"

    name = Column(String, unique=True, index=True, nullable=False)
    keyword = Column(
        String, unique=True, index=True, nullable=False, default="keyword_x"
    )
    members = relationship(
        "User", secondary=user_groups, back_populates="groups", lazy="selectin"
    )
    permissions = relationship(
        "Permission", secondary=permission_groups, backref="groups", lazy="selectin"
    )
    pages = Column(String, nullable=True)
    active = Column(Boolean(), default=True)


department_preference = Table(
    "department_preference",
    BaseEntity.metadata,
    Column("department_uid", ForeignKey("department.uid"), primary_key=True),
    Column("preference_uid", ForeignKey("user_preference.uid"), primary_key=True),
)


class UserPreference(BaseEntity):
    """Preferences for System Personalisation"""

    __tablename__ = "user_preference"

    expanded_menu = Column(Boolean(), default=False)
    departments = relationship(
        "Department", secondary=department_preference, lazy="selectin"
    )
    theme = Column(String, default="light")  # dark, light
