import logging

from sqlalchemy import Boolean, Column, ForeignKey, String
from sqlalchemy.orm import relationship

from felicity.apps import AuditUser
from felicity.apps.setup import schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LocationBase(AuditUser):
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

    @classmethod
    async def create(cls, district: schemas.DistrictCreate):
        """Create a new District and return the new instance."""
        exists = await cls.get(code=district.code)
        if exists:
            raise Exception(f"District with code {district.code} already Exists")
        data = cls._import(district)
        return await super().create(**data)

    async def update(self, district: schemas.DistrictUpdate):
        """Update the district with given data"""
        data = self._import(district)
        return await super().update(**data)


class Province(LocationBase):
    __tablename__ = "province"

    country_uid = Column(String, ForeignKey("country.uid"))
    country = relationship("Country", backref="provinces", lazy="selectin")

    @classmethod
    async def create(cls, province: schemas.ProvinceCreate):
        """Create a new province and return the new instance."""
        exists = await cls.get(code=province.code)
        if exists:
            raise Exception(f"Province with code {province.code} already Exists")
        data = cls._import(province)
        return await super().create(**data)

    async def update(self, province: schemas.ProvinceUpdate):
        """Update the province with given data"""
        data = self._import(province)
        return await super().update(**data)


class Country(AuditUser):
    __tablename__ = "country"

    name = Column(String, default="Zimbabwe")
    code = Column(String, index=True, unique=True, nullable=True)
    active = Column(Boolean(), default=False)

    @classmethod
    async def create(cls, country: schemas.CountryCreate):
        """Create a new Country and return the new instance."""
        exists = await cls.get(code=country.code)
        if exists:
            raise Exception(f"Country with code {country.code} already Exists")
        data = cls._import(country)
        return await super().create(**data)

    async def update(self, country: schemas.CountryUpdate):
        """Update the country with given data"""
        data = self._import(country)
        return await super().update(**data)
