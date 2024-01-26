import logging

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, LargeBinary, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from felicity.apps import Auditable
from felicity.apps.analysis.models.analysis import Sample
from felicity.apps.impress.sample.schemas import ReportImpressCreate, ReportImpressUpdate
from felicity.apps.notification.utils import FelicityStreamer
from felicity.apps.user.models import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

streamer = FelicityStreamer()


class ReportImpress(Auditable):
    __tablename__ = "report_impress"

    state = Column(String)  # preliminary, final, invalidated
    sample_uid = Column(String, ForeignKey("sample.uid"), nullable=False)
    sample = relationship(Sample, foreign_keys=[sample_uid], lazy="selectin")
    json_content: dict = Column(JSONB, nullable=True)
    pdf_content = Column(LargeBinary, nullable=True)
    email_required = Column(Boolean(), default=False)
    email_sent = Column(Boolean(), default=False)
    sms_required = Column(Boolean(), default=False)
    sms_sent = Column(Boolean(), default=False)
    generated_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    generated_by = relationship(User, foreign_keys=[generated_by_uid], lazy="selectin")
    date_generated = Column(DateTime)

    @classmethod
    async def create(cls, obj_in: dict | ReportImpressCreate) -> "ReportImpress":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | ReportImpressUpdate) -> "ReportImpress":
        data = self._import(obj_in)
        return await super().update(**data)
