import logging

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from felicity.apps import Auditable
from felicity.apps.client.models import Client
from felicity.apps.common.models import IdSequence
from felicity.apps.patient import schemas
from felicity.core.uid_gen import FelicitySAID

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Patient(Auditable):
    # Identification
    client_patient_id = Column(String, index=True, unique=True, nullable=False)
    patient_id = Column(String, index=True, unique=True, nullable=True)
    client_uid = Column(FelicitySAID, ForeignKey("client.uid"), nullable=True)
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
    # status
    internal_use = Column(Boolean(), default=False)  # e.g Test Patient
    active = Column(Boolean(), default=True)

    @property
    def full_name(self):
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        else:
            return f"{self.first_name} {self.last_name}"

    @classmethod
    async def create(cls, obj_in: schemas.PatientCreate) -> schemas.Patient:
        data = cls._import(obj_in)
        data["patient_id"] = (await IdSequence.get_next_number("P"))[1]
        return await super().create(**data)

    async def update(self, obj_in: schemas.PatientUpdate) -> schemas.Patient:
        data = self._import(obj_in)
        return await super().update(**data)
