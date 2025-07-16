from sqlalchemy import Boolean, Column, ForeignKey, String
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity


class LocationBase(LabScopedEntity):
    __abstract__ = True
    code = Column(String, index=True, unique=True, nullable=True)
    name = Column(String)
    email = Column(String, nullable=True)
    email_cc = Column(String, nullable=True)
    mobile_phone = Column(String, nullable=True)
    business_phone = Column(String, nullable=True)
    active = Column(Boolean(), default=False)


class District(LocationBase):
    __tablename__ = "district"

    province_uid = Column(String, ForeignKey("province.uid"))
    province = relationship("Province", backref="districts", lazy="selectin")


class Province(LocationBase):
    __tablename__ = "province"

    country_uid = Column(String, ForeignKey("country.uid"))
    country = relationship("Country", backref="provinces", lazy="selectin")


class Country(LabScopedEntity):
    __tablename__ = "country"

    name = Column(String, default="Zimbabwe")
    code = Column(String, index=True, unique=True, nullable=True)
    active = Column(Boolean(), default=False)
