from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float
from sqlalchemy.orm import relationship

from felicity.apps.abstract import BaseEntity, LabScopedEntity
from felicity.apps.user.entities import User
from felicity.apps.billing.enum import PaymentStatus


class Organization(BaseEntity):
    """Organization entity - single organization per installation"""
    __tablename__ = "organization"

    setup_name = Column(
        String, default="felicity", nullable=False
    )
    name = Column(String, nullable=False, unique=True)
    code = Column(String, nullable=True, unique=True)
    timezone = Column(String, nullable=True, default="UTC")
    tag_line = Column(String, nullable=True)
    email = Column(String, nullable=True)
    email_cc = Column(String, nullable=True)
    mobile_phone = Column(String, nullable=True)
    business_phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    banking = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    quality_statement = Column(String, nullable=True)
    country_uid = Column(String, ForeignKey("country.uid"))
    country = relationship("Country", lazy="selectin")
    province_uid = Column(String, ForeignKey("province.uid"))
    province = relationship("Province", lazy="selectin")
    district_uid = Column(String, ForeignKey("district.uid"))
    district = relationship("District", lazy="selectin")
    settings = relationship("OrganizationSetting", back_populates="organization", lazy="selectin")
    laboratories = relationship("Laboratory", back_populates="organization", lazy="selectin")


class OrganizationSetting(BaseEntity):
    __tablename__ = "organization_setting"

    organization_uid = Column(String, ForeignKey("organization.uid"), nullable=False)
    organization = relationship(
        Organization, back_populates="settings", lazy="selectin"
    )
    password_lifetime = Column(Integer, nullable=True)
    inactivity_log_out = Column(Integer, nullable=True)
    # Billing settings
    allow_billing = Column(Boolean(), nullable=True, default=False)
    allow_auto_billing = Column(Boolean(), nullable=True, default=True)
    process_billed_only = Column(Boolean(), nullable=True, default=False)
    # minimum payment status to allow services
    min_payment_status = Column(String, nullable=True, default=PaymentStatus.UNPAID)
    min_partial_perentage = Column(Float, nullable=True, default=0.5)
    currency = Column(String, nullable=True, default="USD")
    payment_terms_days = Column(Integer, nullable=True, default=0)


class Laboratory(BaseEntity):
    __tablename__ = "laboratory"

    organization_uid = Column(String, ForeignKey("organization.uid"), nullable=False)
    organization = relationship(
        Organization, back_populates="laboratories", lazy="selectin"
    )
    # Allow specific lab to override organisation details and be unique if necessary
    name = Column(String, nullable=False)
    tag_line = Column(String, nullable=True)
    code = Column(String, nullable=True)
    lab_manager_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    lab_manager = relationship(User, foreign_keys=[lab_manager_uid], lazy="selectin")
    email = Column(String, nullable=True)
    email_cc = Column(String, nullable=True)
    mobile_phone = Column(String, nullable=True)
    business_phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    banking = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    quality_statement = Column(String, nullable=True)
    country_uid = Column(String, ForeignKey("country.uid"))
    country = relationship("Country", lazy="selectin")
    province_uid = Column(String, ForeignKey("province.uid"))
    province = relationship("Province", lazy="selectin")
    district_uid = Column(String, ForeignKey("district.uid"))
    district = relationship("District", lazy="selectin")

    @property
    def sms_metadata(self) -> dict:
        result = {
            "lab_name": self.name,
            "lab_email": self.email,
            "lab_phone": self.mobile_phone
        }
        return result


class LaboratorySetting(LabScopedEntity):
    __tablename__ = "laboratory_setting"

    allow_self_verification = Column(Boolean(), nullable=False)
    allow_patient_registration = Column(Boolean(), nullable=True)
    allow_sample_registration = Column(Boolean(), nullable=True)
    allow_worksheet_creation = Column(Boolean(), nullable=True)
    default_route = Column(String, nullable=True)
    default_theme = Column(String, nullable=True)
    auto_receive_samples = Column(Boolean(), nullable=True)
    sticker_copies = Column(Integer, nullable=True)
    default_tat_minutes = Column(Integer, nullable=True, default=1440)

    # organisation settings overrides
    password_lifetime = Column(Integer, nullable=True)
    inactivity_log_out = Column(Integer, nullable=True)
    # Billing settings
    allow_billing = Column(Boolean(), nullable=True, default=False)
    allow_auto_billing = Column(Boolean(), nullable=True, default=True)
    process_billed_only = Column(Boolean(), nullable=True, default=False)
    # minimum payment status to allow services
    min_payment_status = Column(String, nullable=True, default=PaymentStatus.UNPAID)
    min_partial_perentage = Column(Float, nullable=True, default=0.5)
    currency = Column(String, nullable=True, default="USD")
    payment_terms_days = Column(Integer, nullable=True, default=0)


class Supplier(BaseEntity):
    """Supplier"""

    __tablename__ = "supplier"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)


class Manufacturer(BaseEntity):
    """Manufacturer"""

    __tablename__ = "manufacturer"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)


class Department(BaseEntity):
    """Departrments/Sections"""

    __tablename__ = "department"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    code = Column(String, nullable=True)


class Unit(BaseEntity):
    """Unit for analyte measurement"""

    __tablename__ = "unit"

    name = Column(String, nullable=False)
    is_si_unit = Column(Boolean(), default=False)
