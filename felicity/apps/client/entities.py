from sqlalchemy import Boolean, Column, ForeignKey, String
from sqlalchemy.orm import backref, relationship

from felicity.apps.abstract import AuditHistory
from felicity.apps.setup.entities import District, Province
from felicity.apps.user.abstract import AbstractBaseUser
from felicity.apps.user.conf import CLIENT_CONTACT


class Client(AuditHistory):
    """Client/Facility"""

    __tablename__ = "client"

    name = Column(String, nullable=False)
    code = Column(String, index=True, unique=True, nullable=False)
    district_uid = Column(String, ForeignKey("district.uid"), nullable=True)
    district = relationship(District, backref="clients", lazy="selectin")
    province_uid = Column(String, ForeignKey("province.uid"), nullable=True)
    province = relationship(Province, backref="clients", lazy="selectin")
    email = Column(String, nullable=True)
    email_cc = Column(String, nullable=True)
    consent_email = Column(Boolean(), default=False)
    phone_mobile = Column(String, nullable=True)
    phone_business = Column(String, nullable=True)
    consent_sms = Column(Boolean(), default=False)
    internal_use = Column(Boolean(), default=False)  # e.g Test Client
    active = Column(Boolean(), default=False)

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
    __tablename__ = "client_contact"

    email = Column(String, unique=False, index=True, nullable=True)
    email_cc = Column(String, nullable=True)
    consent_sms = Column(Boolean(), default=False)
    client_uid = Column(String, ForeignKey("client.uid"), nullable=False)
    client = relationship(
        Client,
        backref=backref(
            "contacts",
            uselist=False,
        ),
        lazy="selectin",
    )

    @property
    def user_type(self):
        return CLIENT_CONTACT
