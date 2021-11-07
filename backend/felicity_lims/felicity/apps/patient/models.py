import logging
from datetime import datetime

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, func
from sqlalchemy.future import select
from sqlalchemy.orm import relationship

from felicity.apps.client.models import Client
from felicity.apps.core.utils import sequencer
from felicity.apps.patient import schemas
from felicity.apps import DBModel, Auditable

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Patient(Auditable, DBModel):
    # Identification
    client_patient_id = Column(String, index=True, unique=True, nullable=False)
    patient_id = Column(String, index=True, unique=True, nullable=True)
    client_uid = Column(Integer, ForeignKey('client.uid'), nullable=True)
    client = relationship(Client, backref="patients", lazy="selectin")
    # Details
    first_name = Column(String, nullable=False)
    middle_name = Column(String, nullable=True)
    last_name = Column(String, nullable=False)
    gender = Column(Integer, nullable=False, default=2)
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
    def get_gender(self):
        genders = ["Male", "Female", "Missing", "Trans Gender"]
        if not isinstance(self.gender, int) or self.gender > 3 or self.gender < 0:
            return genders[2]
        return genders[self.gender]
    
    @property
    def full_name(self):
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        else:
            return f"{self.first_name} {self.last_name}"

    @classmethod
    async def create(cls, obj_in: schemas.PatientCreate) -> schemas.Patient:
        data = cls._import(obj_in)
        data['patient_id'] = await cls.create_patient_id()
        return await super().create(**data)

    async def update(self, obj_in: schemas.PatientUpdate) -> schemas.Patient:
        data = self._import(obj_in)
        return await super().update(**data)
        
    @classmethod
    async def create_patient_id(cls):
        prefix_key = "P"
        prefix_year = str(datetime.now().year)[2:]
        prefix = f"{prefix_key}{prefix_year}"
        stmt = cls.where(patient_id__startswith=f'%{prefix}%')
        res = await cls.session.execute(stmt)
        count = len(res.scalars().all())
        if isinstance(count, type(None)):
            count = 0
        return f"{prefix}-{sequencer(count + 5, 5)}"
