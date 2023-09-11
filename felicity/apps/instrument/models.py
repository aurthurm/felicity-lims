from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Table
from sqlalchemy.orm import relationship

from apps import BaseAuditDBModel, DBModel
from apps.common.models import IdSequence
from apps.instrument import schemas

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

    __tablename__ = "method"

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

    __tablename__ = "instrument_type"

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

    __tablename__ = "instrument"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    keyword = Column(String, nullable=True)
    instrument_type_uid = Column(
        String, ForeignKey("instrument_type.uid"), nullable=True
    )
    instrument_type = relationship("InstrumentType", lazy="selectin")
    supplier_uid = Column(String, ForeignKey("supplier.uid"), nullable=True)
    supplier = relationship("Supplier", backref="instruments", lazy="selectin")
    manufacturer_uid = Column(String, ForeignKey("manufacturer.uid"), nullable=True)
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

    __tablename__ = "instrument_calibration"

    instrument_uid = Column(String, ForeignKey("instrument.uid"), nullable=True)
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

    __tablename__ = "calibration_certificate"

    instrument_uid = Column(String, ForeignKey("instrument.uid"), nullable=True)
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

# class InstrumentCompetence(BaseAuditDBModel):
#     instrument_uid = Column(String, ForeignKey("instrument.uid"), nullable=True)
#     instrument = relationship("Instrument", lazy="selectin")
#     description = Column(
#         String, default="competent", nullable=True
#     )
#     user_uid = Column(String, ForeignKey("user.uid"), nullable=True)
#     user = relationship(
#         User, foreign_keys=[user_uid], backref="user_uid", lazy="selectin"
#     )
#     issue_date = Column(DateTime, nullable=False)
#     expiry_date = Column(DateTime, nullable=False)

#     @classmethod
#     async def create(cls, obj_in: schemas.InstrumentCompetenceCreate) -> schemas.InstrumentCompetence:
#         data = cls._import(obj_in)
#         return await super().create(**data)

#     async def update(self, obj_in: schemas.InstrumentCompetenceUpdate) -> schemas.InstrumentCompetence:
#         data = self._import(obj_in)
#         return await super().update(**data)

#     @property
#     async def is_valid(self):
#         return datetime.now() < self.expiry_date
