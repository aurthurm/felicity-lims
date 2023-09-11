from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from apps import BaseAuditDBModel
from apps.setup import schemas
from apps.user.models import User


class Laboratory(BaseAuditDBModel):
    __tablename__ = "laboratory"

    setup_name = Column(
        String, default="felicity", nullable=False
    )  # Do not change this value ever
    lab_name = Column(String, nullable=False)
    code = Column(String, nullable=True)
    lab_manager_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    lab_manager = relationship(
        User, foreign_keys=[lab_manager_uid], backref="user_uid", lazy="selectin"
    )
    email = Column(String, nullable=True)  # Main Email Adress
    email_cc = Column(String, nullable=True)
    mobile_phone = Column(String, nullable=True)
    business_phone = Column(String, nullable=True)
    address = Column(String)
    logo = Column(String, nullable=True)

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


class LaboratorySetting(BaseAuditDBModel):
    __tablename__ = "laboratory_setting"

    laboratory_uid = Column(String, ForeignKey("laboratory.uid"), nullable=True)
    laboratory = relationship(
        Laboratory, foreign_keys=[laboratory_uid], backref="settings", lazy="selectin"
    )
    allow_self_verification = Column(Boolean(), nullable=False)
    allow_patient_registration = Column(Boolean(), nullable=True)
    allow_sample_registration = Column(Boolean(), nullable=True)
    allow_worksheet_creation = Column(Boolean(), nullable=True)
    default_route = Column(String, nullable=True)
    password_lifetime = Column(Integer, nullable=True)
    inactivity_log_out = Column(Integer, nullable=True)
    default_theme = Column(String, nullable=True)
    auto_receive_samples = Column(Boolean(), nullable=True)
    sticker_copies = Column(Integer, nullable=True)
    default_tat_minutes = Column(Integer, nullable=True, default=1440)

    @classmethod
    async def create(
        cls, obj_in: schemas.LaboratorySettingCreate
    ) -> schemas.LaboratorySetting:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.LaboratorySettingUpdate
    ) -> schemas.LaboratorySetting:
        data = self._import(obj_in)
        return await super().update(**data)


class Supplier(BaseAuditDBModel):
    """Supplier"""

    __tablename__ = "supplier"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    @classmethod
    async def create(cls, obj_in: schemas.SupplierCreate) -> schemas.Supplier:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.SupplierUpdate) -> schemas.Supplier:
        data = self._import(obj_in)
        return await super().update(**data)


class Manufacturer(BaseAuditDBModel):
    """Manufacturer"""

    __tablename__ = "manufacturer"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    @classmethod
    async def create(cls, obj_in: schemas.ManufacturerCreate) -> schemas.Manufacturer:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ManufacturerUpdate) -> schemas.Manufacturer:
        data = self._import(obj_in)
        return await super().update(**data)


class Department(BaseAuditDBModel):
    """Departrments/Sections"""

    __tablename__ = "department"

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


class Unit(BaseAuditDBModel):
    """Unit for analyte measurement"""

    __tablename__ = "unit"

    name = Column(String, nullable=False)
    # SI/Traditional Unit
    is_si_unit = Column(Boolean(), default=False)

    @classmethod
    async def create(cls, obj_in: schemas.UnitCreate) -> schemas.Unit:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.UnitUpdate) -> schemas.Unit:
        data = self._import(obj_in)
        return await super().update(**data)
