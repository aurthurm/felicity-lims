from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from felicity.apps.abstract import AuditUser
from felicity.apps.user.entities import User


class Laboratory(AuditUser):
    __tablename__ = "laboratory"

    setup_name = Column(
        String, default="felicity", nullable=False
    )  # Do not change this value ever
    lab_name = Column(String, nullable=False)
    tag_line = Column(String, nullable=True)
    code = Column(String, nullable=True)
    lab_manager_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    lab_manager = relationship(User, foreign_keys=[lab_manager_uid], lazy="selectin")
    email = Column(String, nullable=True)  # Main Email Adress
    email_cc = Column(String, nullable=True)
    mobile_phone = Column(String, nullable=True)
    business_phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    banking = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    quality_statement = Column(String, nullable=True)

class LaboratorySetting(AuditUser):
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
    #
    allow_billing = Column(Boolean(), nullable=True, default=False)
    allow_auto_billing = Column(Boolean(), nullable=True, default=True)
    currency = Column(String, nullable=True, default="USD")
    payment_terms_days = Column(Integer, nullable=True, default=0)


class Supplier(AuditUser):
    """Supplier"""

    __tablename__ = "supplier"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)


class Manufacturer(AuditUser):
    """Manufacturer"""

    __tablename__ = "manufacturer"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)


class Department(AuditUser):
    """Departrments/Sections"""

    __tablename__ = "department"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    code = Column(String, nullable=True)


class Unit(AuditUser):
    """Unit for analyte measurement"""

    __tablename__ = "unit"

    name = Column(String, nullable=False)
    is_si_unit = Column(Boolean(), default=False)
