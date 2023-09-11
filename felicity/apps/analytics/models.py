from sqlalchemy import Column, DateTime, ForeignKey, String, Table
from sqlalchemy.orm import relationship

from apps import BaseAuditDBModel
from . import conf, schemas

"""
Many to Many Link between ReportMeta and Analysis
"""
analysis_reports = Table(
    "analysis_reports",
    BaseAuditDBModel.metadata,
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("report_uid", ForeignKey("report_meta.uid"), primary_key=True),
)


class ReportMeta(BaseAuditDBModel):
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

    async def set_final(self, status: str, location: str | None = None):
        if self.status != conf.report_states.READY:
            self.location = location
            self.status = status
            self.temp = None
            await self.save()

    @classmethod
    async def create(cls, obj_in: schemas.ReportMetaCreate) -> schemas.ReportMeta:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ReportMetaUpdate) -> schemas.ReportMeta:
        data = self._import(obj_in)
        return await super().update(**data)
