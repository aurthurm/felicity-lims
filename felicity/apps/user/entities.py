import logging

from sqlalchemy import Boolean, Column, ForeignKey, String, Table
from sqlalchemy.orm import backref, relationship

from felicity.database.entity import BaseEntity
from . import conf
from .abstract import AbstractAuth, AbstractBaseUser

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# TODO: Refactor User to LaboratoryContact, UserAuth to ContactAuth


class UserAuth(AbstractAuth):
    """Authentication class user access
    @param user_type is dynamically accessed and values are:
    ccuser: client contacts
    lcuser: laboratory contacts
    dcuser: dispatch center contacts
    """

    __tablename__ = "user_auth"

    user_type = Column(String, nullable=True)


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

    auth_uid = Column(String, ForeignKey("user_auth.uid"))
    auth = relationship(
        "UserAuth",
        backref=backref(conf.LABORATORY_CONTACT, uselist=False),
        lazy="joined",
    )
    groups = relationship(
        "Group", secondary=user_groups, back_populates="members", lazy="selectin"
    )
    preference_uid = Column(String, ForeignKey("user_preference.uid"))
    preference = relationship(
        "UserPreference", foreign_keys=[preference_uid], lazy="selectin"
    )
    avatar = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    default_route = Column(Boolean(), nullable=True)

    @property
    def user_type(self):
        return conf.LABORATORY_CONTACT


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
    theme = Column(String, default=conf.themes.LIGHT)  # dark, light