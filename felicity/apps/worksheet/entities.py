import logging

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Table
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity, BaseEntity
from felicity.apps.analysis.entities import analysis as analysis_entities
from felicity.apps.analysis.entities import qc as qc_entities
from felicity.apps.instrument.entities import Instrument
from felicity.apps.user.entities import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WSBase(LabScopedEntity):
    __abstract__ = True
    worksheet_type = Column(String)
    reserved = Column(JSONB)
    number_of_samples = Column(Integer)
    rows = Column(Integer)
    cols = Column(Integer)
    row_wise = Column(Boolean(), default=False)
    state = Column(String)


"""
Many to Many Link between WorkSheetTemplate and QCLevel
"""
worksheet_template_qc_level = Table(
    "worksheet_template_qc_level",
    BaseEntity.metadata,
    Column("ws_template_uid", ForeignKey("worksheet_template.uid"), primary_key=True),
    Column("qc_level_uid", ForeignKey("qc_level.uid"), primary_key=True),
)


class WorkSheetTemplate(WSBase):
    """WorkSheetTemplate

    a template has a single analyses associated in order to avoid
    cases where multi analyses can be assigned to a single ws
    """

    __tablename__ = "worksheet_template"

    name = Column(String, unique=True, nullable=False)
    description = Column(String)
    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=True)
    analysis = relationship(analysis_entities.Analysis, lazy="selectin")
    qc_template_uid = Column(String, ForeignKey("qc_template.uid"), nullable=True)
    qc_template = relationship(qc_entities.QCTemplate, lazy="selectin")
    # to help cater for those created without template we also keep the qc_levels
    qc_levels = relationship(
        qc_entities.QCLevel, secondary=worksheet_template_qc_level, lazy="selectin"
    )
    instrument_uid = Column(String, ForeignKey("instrument.uid"), nullable=True)
    instrument = relationship(Instrument, lazy="selectin")
    sample_type_uid = Column(String, ForeignKey("sample_type.uid"), nullable=False)
    sample_type = relationship(analysis_entities.SampleType, lazy="selectin")


class WorkSheet(WSBase):
    __tablename__ = "worksheet"

    template_uid = Column(String, ForeignKey("worksheet_template.uid"), nullable=False)
    template = relationship("WorkSheetTemplate", lazy="selectin")
    analyst_uid = Column(String, ForeignKey("user.uid"), nullable=False)
    analyst = relationship(User, foreign_keys=[analyst_uid], lazy="selectin")
    worksheet_id = Column(String, index=True, unique=True, nullable=False)
    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=True)
    analysis = relationship(analysis_entities.Analysis, lazy="selectin")
    instrument_uid = Column(String, ForeignKey("instrument.uid"), nullable=True)
    instrument = relationship(Instrument, backref="worksheets", lazy="selectin")
    sample_type_uid = Column(String, ForeignKey("sample_type.uid"), nullable=False)
    sample_type = relationship(analysis_entities.SampleType, lazy="selectin")
    assigned_count = Column(Integer, nullable=False, default=0)
    analysis_results = relationship(
        "AnalysisResult", back_populates="worksheet", lazy="selectin"
    )
    #
    submitted_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    submitted_by = relationship(User, foreign_keys=[submitted_by_uid], lazy="selectin")
    date_submitted = Column(DateTime, nullable=True)
    verified_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    verified_by = relationship(User, foreign_keys=[verified_by_uid], lazy="selectin")
    date_verified = Column(DateTime, nullable=True)
