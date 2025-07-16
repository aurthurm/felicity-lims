from sqlalchemy import Boolean, Column, ForeignKey, LargeBinary, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity
from felicity.apps.analysis.entities.analysis import Sample
from felicity.apps.user.entities import User


class ReportImpress(LabScopedEntity):
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
