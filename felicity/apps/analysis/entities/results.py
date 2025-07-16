import logging

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Text
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity, BaseMPTT
from felicity.utils.hipaa_fields import EncryptedPHI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

"""
 Many to Many Link between AnalysisResult and User
"""
result_verification = Table(
    "result_verification",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("result_uid", ForeignKey("analysis_result.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)


class AnalysisResult(LabScopedEntity, BaseMPTT):
    """Test/Analysis Result
    Number of analysis results per sample will be directly proportional to
    the number of linked sample_analyses at minimum :)
    """

    __tablename__ = "analysis_result"

    sample_uid = Column(String, ForeignKey("sample.uid"), nullable=False)
    sample = relationship("Sample", back_populates="analysis_results", lazy="selectin")
    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=False)
    analysis = relationship("Analysis", backref="analysis_results", lazy="selectin")
    laboratory_instrument_uid = Column(
        String, ForeignKey("laboratory_instrument.uid"), nullable=True
    )
    laboratory_instrument = relationship("LaboratoryInstrument", lazy="selectin")
    method_uid = Column(String, ForeignKey("method.uid"), nullable=True)
    method = relationship("Method", lazy="selectin")
    # HIPAA: Encrypt test results as they constitute Protected Health Information (PHI)
    result = Column(EncryptedPHI(1000), nullable=True)
    analyst_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    analyst = relationship("User", foreign_keys=[analyst_uid], lazy="selectin")
    submitted_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    submitted_by = relationship(
        "User", foreign_keys=[submitted_by_uid], lazy="selectin"
    )
    submitted_by_name = Column(String, nullable=True)
    date_submitted = Column(DateTime, nullable=True)
    verified_by = relationship("User", secondary=result_verification, lazy="selectin")
    verified_by_name = Column(String, nullable=True)
    date_verified = Column(DateTime, nullable=True)
    invalidated_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    invalidated_by = relationship(
        "User", foreign_keys=[invalidated_by_uid], lazy="selectin"
    )
    date_invalidated = Column(DateTime, nullable=True)
    cancelled_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    cancelled_by = relationship(
        "User", foreign_keys=[cancelled_by_uid], lazy="selectin"
    )
    date_cancelled = Column(DateTime, nullable=True)
    retest = Column(Boolean(), default=False)
    reportable = Column(Boolean(), default=True)  # for retests or reflex
    status = Column(String, nullable=False)
    due_date = Column(DateTime, nullable=True)
    # reflex level
    reflex_level = Column(Integer, nullable=True)
    # worksheet
    worksheet_uid = Column(String, ForeignKey("worksheet.uid"), nullable=True)
    worksheet = relationship(
        "WorkSheet", back_populates="analysis_results", lazy="selectin"
    )
    worksheet_position = Column(Integer, nullable=True)
    assigned = Column(Boolean(), default=False)
    # Metadata snapshot
    metadata_snapshot = Column(JSONB, nullable=False)

    @property
    def keyword(self) -> str:
        return self.analysis.keyword
    
    @property
    def sms_metadata(self) -> dict:
        result = {
           "result": self.result, 
           "date_collected": self.date_collected
        }   

        if self.analysis and hasattr(self.analysis, 'sms_metadata'):
            try:
                an_metadata = self.analysis.sms_metadata
                if an_metadata:
                    result.update(an_metadata)
            except Exception:
                pass
                
        return result

class ResultMutation(LabScopedEntity):
    """Result Mutations tracker"""

    __tablename__ = "result_mutation"

    result_uid = Column(String, ForeignKey("analysis_result.uid"), nullable=False)
    # HIPAA: Encrypt mutation tracking data as it contains PHI history
    before = Column(EncryptedPHI(1000), nullable=False)
    after = Column(EncryptedPHI(1000), nullable=False)
    mutation = Column(String, nullable=False)  # Keep mutation type unencrypted for audit
    date = Column(DateTime, nullable=True)
