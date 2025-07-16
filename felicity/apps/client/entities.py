from uuid import uuid4

from sqlalchemy import Boolean, Column, ForeignKey, String
from sqlalchemy.orm import backref, relationship

from felicity.apps.abstract import LabScopedEntity
from felicity.apps.setup.entities import District, Province
from felicity.apps.user.abstract import AbstractBaseUser
from felicity.apps.user.enum import UserType


class Client(LabScopedEntity):
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

    @property
    def sms_metadata(self) -> dict:
        result = {
            "client_name": self.name, 
            "client_id": self.code, 
        }
        return result
    
class ClientContact(AbstractBaseUser):
    __tablename__ = "client_contact"

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
    # overrides to allow easy seeding
    email = Column(
        String, unique=True, index=True, nullable=False, default=uuid4().hex
    )
    user_name = Column(
        String, unique=True, index=True, nullable=False, default=uuid4().hex
    )
    hashed_password = Column(String, nullable=False, default=uuid4().hex)

    @property
    def user_type(self):
        return UserType.CLIENT_CONTACT

    @property
    def sms_metadata(self) -> dict:
        result = {"contact_name": self.full_name}
        
        if self.client and hasattr(self.client, 'sms_metadata'):
            try:
                client_metadata = self.client.sms_metadata
                if client_metadata:
                    result.update(client_metadata)
            except Exception:
                pass
                
        return result