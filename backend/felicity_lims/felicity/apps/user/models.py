import logging

from felicity.apps.common.utils import is_valid_email
from felicity.core.security import verify_password
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import backref, relationship

from . import conf
from .abstract import AbstractAuth, AbstractBaseUser, DBModel, schemas

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

    user_type = Column(String, nullable=True)

    async def acquire_user_type(self, user_type):
        _update = {
            "user_type": user_type
        }  # {**self.to_dict(), **{'user_type': user_type}}
        update_in = schemas.AuthUpdate(**_update)
        await self.update(update_in)

    async def has_access(self, password):
        if self.is_blocked:
            raise Exception("Blocked Account: Reset Password to regain access")
        #  dynamically get self.ccuser / self.lcuser / self.dcuser

        # _user = getattr(self, self.user_type)
        _user = await User.get(auth_uid=self.uid)
        if not _user:
            raise Exception(
                "Authentication disabled for this account. Contact Admin to re-link"
            )

        if not getattr(_user, "is_active"):  # e.g self.ccuser.is_active
            raise Exception("In active account: contact administrator")

        auth_obj = self.to_dict()
        retries = self.login_retry
        if not verify_password(password, self.hashed_password):
            msg = ""
            if self.login_retry < 3:
                retries += 1
                msg = f"Wrong Password {3 - retries} attempts left"
                auth_obj["login_retry"] = retries
                if retries == 3:
                    auth_obj["is_blocked"] = True
                    msg = f"Sorry your Account has been Blocked"
            await self.update(auth_obj)
            raise Exception(msg)
        if self.login_retry != 0:
            auth_obj["login_retry"] = 0
            await self.update(auth_obj)
        return self

    async def authenticate(self, username, password):
        if is_valid_email(username):
            raise Exception("Use your username authenticate")
        auth_obj = await self.get_by_username(username)
        has_access = await auth_obj.has_access(password)
        return has_access


"""
Many to Many Link between Group and User
"""
user_groups = Table(
    "user_groups",
    DBModel.metadata,
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
    Column("group_uid", ForeignKey("group.uid"), primary_key=True),
)

"""
Many to Many Link between Group and Permission
"""
permission_groups = Table(
    "permission_groups",
    DBModel.metadata,
    Column("permission_uid", ForeignKey("permission.uid"), primary_key=True),
    Column("group_uid", ForeignKey("group.uid"), primary_key=True),
)


class User(AbstractBaseUser):
    auth_uid = Column(Integer, ForeignKey("userauth.uid"))
    auth = relationship(
        "UserAuth",
        backref=backref(conf.LABORATORY_CONTACT, uselist=False),
        lazy="joined",
    )
    groups = relationship(
        "Group", secondary=user_groups, back_populates="members", lazy="selectin"
    )

    @classmethod
    async def create(cls, user_in: schemas.UserCreate) -> schemas.User:
        data = cls._import(user_in)
        created = await super().create(**data)
        return created

    async def update(self, user_in: schemas.UserUpdate) -> schemas.User:
        data = self._import(user_in)
        updated = await super().update(**data)
        return updated

    @property
    def user_type(self):
        return conf.LABORATORY_CONTACT

    async def propagate_user_type(self):
        """sets the user_type field in auth"""
        if self.auth:
            await self.auth.acquire_user_type(conf.LABORATORY_CONTACT)
        elif self.auth_uid:
            auth = await UserAuth.get(uid=self.auth_uid)
            await auth.acquire_user_type(conf.LABORATORY_CONTACT)
        else:
            raise Exception(f"auth obj is None")

    async def unlink_auth(self):
        auth = self.auth
        _update = {**self.to_dict(), **{"auth_uid": None, "auth": None}}
        update_in = schemas.UserUpdate(**_update)
        await self.update(update_in)
        if not self.auth:
            await auth.delete()

    async def link_auth(self, auth_uid):
        _update = {
            "auth_uid": auth_uid
        }  # {**result.to_dict(), **{'auth_uid': auth_uid}}
        update_in = schemas.UserUpdate(**_update)
        await self.update(update_in)


class Permission(DBModel):
    action = Column(String, nullable=False)  # e.g create, modify
    target = Column(String, nullable=False)  # e.g sample, worksheet
    active = Column(Boolean(), default=True)

    @classmethod
    def create(cls, obj_in):
        data = cls._import(obj_in)
        return super().create(**data)

    def update(self, obj_in):
        data = self._import(obj_in)
        return super().update(**data)


class Group(DBModel):
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
    active = Column(Boolean(), default=True)

    @classmethod
    def create(cls, obj_in):
        data = cls._import(obj_in)
        return super().create(**data)

    def update(self, obj_in):
        data = self._import(obj_in)
        return super().update(**data)

    def add_member(self, member):
        self.members.add(member)

    def remove_member(self, member):
        self.members.remove(member)

    def add_perm(self, perm):
        self.permissions.add(perm)

    def remove_perm(self, perm):
        self.permissions.remove(perm)
