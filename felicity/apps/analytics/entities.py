from sqlalchemy import Column, DateTime, ForeignKey, String, Table
from sqlalchemy.orm import relationship

from felicity.apps.abstract import AuditUser

"""
Many to Many Link between ReportMeta and Analysis
"""
analysis_reports = Table(
    "analysis_reports",
    AuditUser.metadata,
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("report_uid", ForeignKey("report_meta.uid"), primary_key=True),
)


class ReportMeta(AuditUser):
    """Generated Reports Metadata"""

    __tablename__ = "report_meta"

    report_type = Column(String)
    analyses = relationship("Analysis", secondary=analysis_reports, lazy="selectin")
    period_start = Column(DateTime)
    period_end = Column(DateTime)
    date_column = Column(String)
    location = Column(String, nullable=True)
    temp = Column(String, nullable=True)
    status = Column(String)
    sample_states = Column(String)
