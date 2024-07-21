from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, relationship

from infrastructure.database import Auditable
from infrastructure.database.client.entities import Client


class Identification(Auditable):
    __tablename__ = "identification"

    name = Column(String, index=True, unique=True, nullable=True)


class PatientIdentification(Auditable):
    __tablename__ = "patient_identification"

    identification_uid = Column(String, ForeignKey("identification.uid"), nullable=True)
    identification: Mapped["Identification"] = relationship(
        "Identification", lazy="selectin"
    )
    patient_uid = Column(String, ForeignKey("patient.uid"), nullable=True)
    patient: Mapped["Patient"] = relationship(
        "Patient", back_populates="identifications", lazy="selectin"
    )
    value = Column(String, index=True, nullable=False)


class Patient(Auditable):
    __tablename__ = "patient"

    # Identification
    client_patient_id = Column(String, index=True, unique=True, nullable=False)
    patient_id = Column(String, index=True, unique=True, nullable=True)
    client_uid = Column(String, ForeignKey("client.uid"), nullable=True)
    client = relationship(Client, backref="patients", lazy="selectin")
    # Details
    first_name = Column(String, nullable=False)
    middle_name = Column(String, nullable=True)
    last_name = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    age_dob_estimated = Column(Boolean(), default=False)
    # Contact
    phone_mobile = Column(String, nullable=True)
    phone_home = Column(String, nullable=True)
    consent_sms = Column(Boolean(), default=False)
    email = Column(String, nullable=True)
    identifications: Mapped[list["PatientIdentification"]] = relationship(
        PatientIdentification, back_populates="patient", lazy="selectin"
    )
    # status
    internal_use = Column(Boolean(), default=False)  # e.g Test Patient
    active = Column(Boolean(), default=True)
    # belonging
    district_uid = Column(String, ForeignKey("district.uid"), nullable=True)
    district = relationship("District", backref="patients", lazy="selectin")
    province_uid = Column(String, ForeignKey("province.uid"), nullable=True)
    province = relationship("Province", backref="patients", lazy="selectin")
    country_uid = Column(String, ForeignKey("country.uid"), nullable=True)
    country = relationship("Country", backref="patients", lazy="selectin")

    @property
    def full_name(self):
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        else:
            return f"{self.first_name} {self.last_name}"
