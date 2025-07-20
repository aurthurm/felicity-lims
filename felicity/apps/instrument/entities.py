from sqlalchemy import Boolean, Column, DateTime, ForeignKey, LargeBinary, String, Table
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity, BaseEntity
from felicity.apps.user.entities import User
from felicity.core.dtz import timenow_dt

"""
 Many to Many Link between Method and Instruments
"""
method_instrument = Table(
    "method_instrument",
    BaseEntity.metadata,
    Column("method_uid", ForeignKey("method.uid"), primary_key=True),
    Column("instrument_uid", ForeignKey("instrument.uid"), primary_key=True),
)


class Method(BaseEntity):
    """Method
    analytical method
    """

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


class InstrumentType(BaseEntity):
    """Instrument Type"""

    __tablename__ = "instrument_type"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


class Instrument(BaseEntity):
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


class LaboratoryInstrument(LabScopedEntity):
    """Laboratory Instrument"""

    __tablename__ = "laboratory_instrument"

    instrument_uid = Column(String, ForeignKey("instrument.uid"), nullable=False)
    instrument = relationship("Instrument", lazy="selectin")
    lab_name = Column(String, nullable=False)
    serial_number = Column(String, nullable=False)
    date_commissioned = Column(DateTime, nullable=True)
    date_decommissioned = Column(DateTime, nullable=True)


class InstrumentCalibration(LabScopedEntity):
    """Laboratory Instrument Calibration Task
    -   ensures the measurement accuracy of an instrument meets a known standard
    -   Is it still accurate?
    """

    __tablename__ = "instrument_calibration"

    laboratory_instrument_uid = Column(
        String, ForeignKey("laboratory_instrument.uid"), nullable=False
    )
    laboratory_instrument = relationship("LaboratoryInstrument", lazy="selectin")
    calibration_id = Column(String, index=True, unique=True, nullable=True)
    date_reported = Column(DateTime, nullable=False)
    report_id = Column(String, index=True, unique=True, nullable=True)
    report = Column(LargeBinary, nullable=True)
    performed_by = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    # considerations to take into account before calibration
    notes_before = Column(String, nullable=True)
    work_done = Column(String, nullable=False)
    remarks = Column(String, nullable=True)


class CalibrationCertificate(LabScopedEntity):
    """Instrument Calibration Certificate"""

    __tablename__ = "calibration_certificate"

    laboratory_instrument_uid = Column(
        String, ForeignKey("laboratory_instrument.uid"), nullable=False
    )
    laboratory_instrument = relationship("LaboratoryInstrument", lazy="selectin")
    certificate_code = Column(String, index=True, unique=True, nullable=False)
    certificate = Column(LargeBinary, nullable=True)
    internal = Column(Boolean(), nullable=False)
    issuer = Column(String, nullable=True)
    date_issued = Column(DateTime, nullable=False)
    valid_from_date = Column(DateTime, nullable=False)
    valid_to_date = Column(DateTime, nullable=False)
    performed_by = Column(String, nullable=False)
    approved_by = Column(String, nullable=False)
    remarks = Column(String, nullable=True)

    @property
    async def is_valid(self):
        return timenow_dt() < self.valid_to_date


# class MethodValidation(LabScopedEntity):
#     """Method Validation Test
#     -   Establishing and confirming the analytical performance characteristics of a method
#     -   Is it producing the right results?
#
#     Typical analytical characteristics evaluated during method validation may include:
#         Accuracy
#         Precision
#         Specificity
#         Detection Limit
#         Quantitation Limit
#         Linearity
#         Range
#     """
#
#     __tablename__ = "method_validation"
#
#     laboratory_instrument_uid = Column(String, ForeignKey("laboratory_instrument.uid"), nullable=False)
#     laboratory_instrument = relationship("LaboratoryInstrument", lazy="selectin")


# class MethodVerification(LabScopedEntity):
#     """Method Verification Test
#     -   Assess the suitability of a method under actual conditions of use
#     -   Is it working correctly
#     """
#
#     __tablename__ = "method_verification"
#
#     laboratory_instrument_uid = Column(String, ForeignKey("laboratory_instrument.uid"), nullable=False)
#     laboratory_instrument = relationship("LaboratoryInstrument", lazy="selectin")


class InstrumentCompetence(LabScopedEntity):
    __tablename__ = "instrument_competence"

    instrument_uid = Column(String, ForeignKey("instrument.uid"), nullable=False)
    instrument = relationship("Instrument", lazy="selectin")
    description = Column(String, default="competent", nullable=True)
    user_uid = Column(String, ForeignKey("user.uid"), nullable=False)
    user = relationship(
        User, foreign_keys=[user_uid], backref="user_uid", lazy="selectin"
    )
    issue_date = Column(DateTime, nullable=False)
    expiry_date = Column(DateTime, nullable=False)
    internal = Column(Boolean, nullable=False)
    competence = Column(LargeBinary, nullable=True)

    @property
    async def is_valid(self):
        return timenow_dt() < self.expiry_date

# class MeasurementUncertainty(LabScopedEntity):
#     __tablename__ = "measurement_uncertainty"

# https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8199534/
# https://github.com/1966bc/Biovarase
# https://github.com/aurthurm/sqc-r-scripts
