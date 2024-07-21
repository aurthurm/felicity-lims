from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    LargeBinary,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from infrastructure.database import Auditable, DBModel
from infrastructure.database.user.entities import User


class ReferralLaboratory(Auditable):
    __tablename__ = "referral_laboratory"

    name = Column(String, nullable=True)
    code = Column(String, index=True, unique=True, nullable=False)
    url = Column(String, nullable=False)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    is_reference = Column(Boolean(), default=False)
    is_referral = Column(Boolean(), default=False)


class Shipment(Auditable):
    __tablename__ = "shipment"

    shipment_id = Column(String, index=True, unique=True, nullable=False)
    comment = Column(String, nullable=True)
    courier = Column(String, nullable=False)
    assigned_count = Column(Integer, nullable=False, default=0)
    data = Column(JSONB)
    state = Column(String)
    laboratory_uid = Column(
        String, ForeignKey("referral_laboratory.uid"), nullable=True
    )
    laboratory = relationship(
        ReferralLaboratory, foreign_keys=[laboratory_uid], lazy="selectin"
    )
    incoming = Column(Boolean(), default=False)  # either its incoming or outgoing
    finalised_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    finalised_by = relationship(User, foreign_keys=[finalised_by_uid], lazy="selectin")
    date_finalised = Column(DateTime, nullable=True)
    dispatched_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    dispatched_by = relationship(
        User, foreign_keys=[dispatched_by_uid], lazy="selectin"
    )
    date_dispatched = Column(DateTime, nullable=True)
    recalled_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    recalled_by = relationship(User, foreign_keys=[recalled_by_uid], lazy="selectin")
    date_recalled = Column(DateTime, nullable=True)
    rejected_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    rejected_by = relationship(User, foreign_keys=[rejected_by_uid], lazy="selectin")
    date_rejected = Column(DateTime, nullable=True)
    received_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    received_by = relationship(User, foreign_keys=[received_by_uid], lazy="selectin")
    date_received = Column(DateTime, nullable=True)
    # manifest
    json_content: dict = Column(JSONB, nullable=True)
    pdf_content = Column(LargeBinary, nullable=True)


class ShippedSample(DBModel):
    __tablename__ = "shipped_sample"

    """ShippedSample enables samples to be shipped multiple times
    A sample can be tracked through different shipments from inception to end
    """
    sample_uid = Column(String, ForeignKey("sample.uid"), nullable=True)
    sample = relationship("Sample", foreign_keys=[sample_uid], lazy="selectin")
    shipment_uid = Column(String, ForeignKey("shipment.uid"), nullable=True)
    shipment = relationship(Shipment, foreign_keys=[shipment_uid], lazy="selectin")
    result_notified = Column(Boolean(), default=False)
    ext_sample_uid = Column(String, nullable=True)
    ext_sample_id = Column(String, nullable=True)
