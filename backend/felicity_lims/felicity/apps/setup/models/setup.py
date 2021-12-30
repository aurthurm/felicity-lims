from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from felicity.apps import BaseAuditDBModel
from felicity.apps.user.models import User
from felicity.apps.setup import schemas


class Laboratory(BaseAuditDBModel):
    setup_name = Column(String, default="felicity", nullable=False)  # Do not change this value ever
    lab_name = Column(String, nullable=False)
    lab_manager_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    lab_manager = relationship(User, foreign_keys=[lab_manager_uid], backref="lab_manager", lazy="selectin")  # TODO refactor backref value to  backref="laboratory"
    email = Column(String, nullable=True)  # Main Email Adress
    email_cc = Column(String, nullable=True)
    mobile_phone = Column(String, nullable=True)
    business_phone = Column(String, nullable=True)

    @classmethod
    async def create(cls, obj_in: schemas.LaboratoryCreate) -> schemas.Laboratory:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.LaboratoryUpdate) -> schemas.Laboratory:
        data = self._import(obj_in)
        return await super().update(**data)

    @classmethod
    async def get_by_setup_name(cls, keyword="felicity"):
        lab_setup = await cls.get(setup_name=keyword)
        if not lab_setup:
            return None
        return lab_setup


class Supplier(BaseAuditDBModel):
    """Supplier"""
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    @classmethod
    async def create(cls, obj_in: schemas.SupplierCreate) -> schemas.Supplier:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.SupplierUpdate) -> schemas.Supplier:
        data = self._import(obj_in)
        return await super().update(**data)


class Department(BaseAuditDBModel):
    """Departrments/Sections"""
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    code = Column(String, nullable=True)

    @classmethod
    async def create(cls, obj_in: schemas.DepartmentCreate) -> schemas.Department:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.DepartmentUpdate) -> schemas.Department:
        data = self._import(obj_in)
        return await super().update(**data)


class Instrument(BaseAuditDBModel):
    """Instrument/Analyser"""
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    keyword = Column(String, nullable=True)
    supplier_uid = Column(Integer, ForeignKey("supplier.uid"), nullable=True)
    supplier = relationship(Supplier, backref="instruments", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.InstrumentCreate) -> schemas.Instrument:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.InstrumentUpdate) -> schemas.Instrument:
        data = self._import(obj_in)
        return await super().update(**data)


class Method(BaseAuditDBModel):
    """Analyses/Test Method"""
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    keyword = Column(String, nullable=True)

    @classmethod
    async def create(cls, obj_in: schemas.MethodCreate) -> schemas.Method:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.MethodUpdate) -> schemas.Method:
        data = self._import(obj_in)
        return await super().update(**data)
