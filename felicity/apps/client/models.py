from apps import BaseAuditDBModel, Auditable
from apps.client import schemas
from apps.setup.models import District, Province
from apps.user import conf
from apps.user.abstract import AbstractBaseUser
from apps.user.models import UserAuth
from core.uid_gen import FelicitySAID
from sqlalchemy import Boolean, Column, ForeignKey, String
from sqlalchemy.orm import backref, relationship


class Client(Auditable):
    """Client/Facility"""

    name = Column(String, nullable=False)
    code = Column(String, index=True, unique=True, nullable=False)
    district_uid = Column(FelicitySAID, ForeignKey(
        "district.uid"), nullable=True)
    district = relationship(District, backref="clients", lazy="selectin")
    province_uid = Column(FelicitySAID, ForeignKey(
        "province.uid"), nullable=True)
    province = relationship(Province, backref="clients", lazy="selectin")
    email = Column(String, nullable=True)
    email_cc = Column(String, nullable=True)
    consent_email = Column(Boolean(), default=False)
    phone_mobile = Column(String, nullable=True)
    phone_business = Column(String, nullable=True)
    consent_sms = Column(Boolean(), default=False)
    internal_use = Column(Boolean(), default=False)  # e.g Test Client
    active = Column(Boolean(), default=False)

    @classmethod
    async def create(cls, obj_in: schemas.ClientCreate) -> schemas.Client:
        exist = await cls.get(code=obj_in.code)
        if exist:
            raise Exception(f"Client with code {obj_in.code} already Exists")

        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ClientUpdate) -> schemas.Client:
        data = self._import(obj_in)
        return await super().update(**data)

    @property
    def get_province(self):
        if self.district:
            return self.district.province.name
        elif self.province:
            return self.province.name
        else:
            return ""

    @property
    def get_country(self):
        if self.district:
            return self.district.province.country.name
        elif self.province:
            return self.province.country.name
        else:
            return ""


class ClientContact(AbstractBaseUser):
    auth_uid = Column(FelicitySAID, ForeignKey("userauth.uid"), nullable=True)
    auth = relationship(UserAuth, backref=backref(
        conf.CLIENT_CONTACT, uselist=False))
    email = Column(String, unique=False, index=True, nullable=True)
    email_cc = Column(String, nullable=True)
    consent_sms = Column(Boolean(), default=False)
    client_uid = Column(FelicitySAID, ForeignKey("client.uid"), nullable=False)
    client = relationship(
        Client,
        backref=backref(
            "contacts",
            uselist=False,
        ),
        lazy="selectin",
    )

    @classmethod
    async def create(
        cls, contact_in: schemas.ClientContactCreate
    ) -> schemas.ClientContact:
        data = cls._import(contact_in)
        return await super().create(**data)

    async def update(
        self, contact_in: schemas.ClientContactUpdate
    ) -> schemas.ClientContact:
        data = self._import(contact_in)
        return await super().update(**data)

    @property
    def user_type(self):
        return conf.CLIENT_CONTACT

    async def propagate_user_type(self):
        """sets the user_type field in auth"""
        await self.auth.acquire_user_type(conf.CLIENT_CONTACT)

    async def unlink_auth(self):
        auth = self.auth
        _update = {**self.to_dict(), **{"auth_uid": None, "auth": None}}
        await self.update(_update)
        if not self.auth:
            auth.delete()

    async def link_auth(self, auth_uid):
        _update = {**self.to_dict(), **{"auth_uid": auth_uid}}
        await self.update(_update)
