from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from felicity.apps import BaseAuditDBModel, DBModel
from felicity.apps.common.models import IdSequence
from felicity.apps.setup import schemas
from felicity.apps.user.models import User
from felicity.core.uid_gen import FelicitySAID


class Laboratory(BaseAuditDBModel):
    setup_name = Column(
        String, default="felicity", nullable=False
    )  # Do not change this value ever
    lab_name = Column(String, nullable=False)
    lab_manager_uid = Column(FelicitySAID, ForeignKey("user.uid"), nullable=True)
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
    laboratory_uid = Column(FelicitySAID, ForeignKey("laboratory.uid"), nullable=True)
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


"""
 Many to Many Link between Method and Instruments
"""
method_instrument = Table(
    "method_instrument",
    DBModel.metadata,
    Column("method_uid", ForeignKey("method.uid"), primary_key=True),
    Column("instrument_uid", ForeignKey("instrument.uid"), primary_key=True),
)


class Method(BaseAuditDBModel):
    """Analyses/Test Method"""

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    keyword = Column(String, nullable=True)
    instruments = relationship(
        "Instrument",
        secondary=method_instrument,
        back_populates="methods",
        lazy="selectin",
    )

    @classmethod
    async def create(cls, obj_in: schemas.MethodCreate) -> schemas.Method:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.MethodUpdate) -> schemas.Method:
        data = self._import(obj_in)
        return await super().update(**data)


# class MethodValidation(BaseAuditDBModel):
#     """Method Validation Test"""
#     pass


class InstrumentType(BaseAuditDBModel):
    """Instrument Type"""

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)

    @classmethod
    async def create(
        cls, obj_in: schemas.InstrumentTypeCreate
    ) -> schemas.InstrumentType:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.InstrumentTypeUpdate
    ) -> schemas.InstrumentType:
        data = self._import(obj_in)
        return await super().update(**data)


class Instrument(BaseAuditDBModel):
    """Instrument/Analyser"""

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    keyword = Column(String, nullable=True)
    instrument_type_uid = Column(
        FelicitySAID, ForeignKey("instrumenttype.uid"), nullable=True
    )
    instrument_type = relationship("InstrumentType", lazy="selectin")
    supplier_uid = Column(FelicitySAID, ForeignKey("supplier.uid"), nullable=True)
    supplier = relationship(Supplier, backref="instruments", lazy="selectin")
    manufacturer_uid = Column(
        FelicitySAID, ForeignKey("manufacturer.uid"), nullable=True
    )
    manufacturer = relationship(
        "Manufacturer", backref="manufacturers", lazy="selectin"
    )
    methods = relationship(
        "Method", secondary=method_instrument, back_populates="instruments"
    )

    @classmethod
    async def create(cls, obj_in: schemas.InstrumentCreate) -> schemas.Instrument:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.InstrumentUpdate) -> schemas.Instrument:
        data = self._import(obj_in)
        return await super().update(**data)


class InstrumentCalibration(BaseAuditDBModel):
    """Instrument Caliberation Task"""

    instrument_uid = Column(FelicitySAID, ForeignKey("instrument.uid"), nullable=True)
    instrument = relationship("Instrument", lazy="selectin")
    calibration_id = Column(String, index=True, unique=True, nullable=False)
    date_reported = Column(DateTime, nullable=True)
    report_id = Column(String, index=True, unique=True, nullable=True)
    performed_by = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    # considerations to take into account before calibration
    notes_before = Column(String, nullable=True)
    work_done = Column(String, nullable=True)
    remarks = Column(String, nullable=True)

    @classmethod
    async def create(
        cls, obj_in: schemas.InstrumentCalibrationCreate
    ) -> schemas.InstrumentCalibration:
        data = cls._import(obj_in)
        data["calibration_id"] = (await IdSequence.get_next_number("ICAL"))[1]
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.InstrumentCalibrationUpdate
    ) -> schemas.InstrumentCalibration:
        data = self._import(obj_in)
        return await super().update(**data)


class CalibrationCertificate(BaseAuditDBModel):
    """Instrument Calibration Certificate"""

    instrument_uid = Column(FelicitySAID, ForeignKey("instrument.uid"), nullable=True)
    instrument = relationship("Instrument", lazy="selectin")
    certificate_code = Column(String, index=True, unique=True, nullable=False)
    internal = Column(Boolean(), nullable=False)
    issuer = Column(String, nullable=True)
    date_issued = Column(DateTime, nullable=True)
    valid_from_date = Column(DateTime, nullable=True)
    valid_to_date = Column(DateTime, nullable=True)
    performed_by = Column(String, nullable=True)
    approved_by = Column(String, nullable=True)
    remarks = Column(String, nullable=True)

    @classmethod
    async def create(
        cls, obj_in: schemas.CalibrationCertificateCreate
    ) -> schemas.CalibrationCertificate:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.CalibrationCertificateUpdate
    ) -> schemas.CalibrationCertificate:
        data = self._import(obj_in)
        return await super().update(**data)


class Unit(BaseAuditDBModel):
    """Unit for analyte measurement"""

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
