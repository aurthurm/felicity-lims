import logging

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from felicity.apps import BaseAuditDBModel
from felicity.apps.setup import schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LocationBase(BaseAuditDBModel):
    __abstract__ = True
    code = Column(String, index=True, unique=True, nullable=True)
    name = Column(String)
    email = Column(String, nullable=True)
    email_cc = Column(String, nullable=True)
    mobile_phone = Column(String, nullable=True)
    business_phone = Column(String, nullable=True)
    active = Column(Boolean(), default=False)


class District(LocationBase):
    province_uid = Column(Integer, ForeignKey("province.uid"))
    province = relationship("Province", backref="districts", lazy="selectin")

    @classmethod
    async def create(cls, district: schemas.DistrictCreate) -> schemas.District:
        """Create a new District and return the new instance."""
        exists = await cls.get(code=district.code)
        if exists:
            raise Exception(f"District with code {district.code} already Exists")
        data = cls._import(district)
        return await super().create(**data)

    async def update(self, district: schemas.DistrictUpdate) -> schemas.District:
        """Update the district with given data"""
        data = self._import(district)
        return await super().update(**data)


class Province(LocationBase):
    country_uid = Column(Integer, ForeignKey("country.uid"))
    country = relationship("Country", backref="provinces", lazy="selectin")

    @classmethod
    async def create(cls, province: schemas.ProvinceCreate) -> schemas.Province:
        """Create a new province and return the new instance."""
        exists = await cls.get(code=province.code)
        if exists:
            raise Exception(f"Province with code {province.code} already Exists")
        data = cls._import(province)
        return await super().create(**data)

    async def update(self, province: schemas.ProvinceUpdate) -> schemas.Province:
        """Update the province with given data"""
        data = self._import(province)
        return await super().update(**data)


class Country(BaseAuditDBModel):
    name = Column(String, default='Zimbabwe')
    code = Column(String, index=True, unique=True, nullable=True)
    active = Column(Boolean(), default=False)

    @classmethod
    async def create(cls, country: schemas.CountryCreate) -> schemas.Country:
        """Create a new Country and return the new instance."""
        exists = await cls.get(code=country.code)
        if exists:
            raise Exception(f"Country with code {country.code} already Exists")
        data = cls._import(country)
        return await super().create(**data)

    async def update(self, country: schemas.CountryUpdate) -> schemas.Country:
        """Update the country with given data"""
        data = self._import(country)
        return await super().update(**data)
