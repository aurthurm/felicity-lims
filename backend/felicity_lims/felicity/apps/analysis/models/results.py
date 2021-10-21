import logging
from datetime import datetime

from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from felicity.apps.analysis import schemas, conf
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.core import BaseMPTT
from felicity.apps.setup.models.setup import Instrument, Method
from felicity.apps.worksheet import models as ws_models
from felicity.apps import BaseAuditDBModel, Auditable

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AnalysisResult(Auditable, BaseMPTT):
    """Test/Analysis Result
    Number of analysis results per sample will be directly proportional to
    the number of linked sample_analyses at minimum :)
    """
    sample_uid = Column(Integer, ForeignKey('sample.uid'), nullable=False)
    sample = relationship(analysis_models.Sample, back_populates="analysis_results", lazy="selectin")
    worksheet_uid = Column(Integer, ForeignKey('worksheet.uid'), nullable=True)
    worksheet = relationship(ws_models.WorkSheet, back_populates="analysis_results", lazy="selectin")
    worksheet_position = Column(Integer, nullable=True)
    assigned = Column(Boolean(), default=False)
    analysis_uid = Column(Integer, ForeignKey('analysis.uid'), nullable=False)
    analysis = relationship(analysis_models.Analysis, backref="analysis_results", lazy="selectin")
    instrument_uid = Column(Integer, ForeignKey('instrument.uid'), nullable=True)
    instrument = relationship(Instrument, lazy="selectin")
    method_uid = Column(Integer, ForeignKey('method.uid'), nullable=True)
    method = relationship(Method, lazy="selectin")
    result = Column(String, nullable=True)
    analyst_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    analyst = relationship("User", foreign_keys=[analyst_uid], lazy="selectin")
    submitted_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    submitted_by = relationship("User", foreign_keys=[submitted_by_uid], lazy="selectin")
    date_submitted = Column(DateTime, nullable=True)
    verified_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    verified_by = relationship("User", foreign_keys=[verified_by_uid], lazy="selectin")
    date_verified = Column(DateTime, nullable=True)
    invalidated_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    invalidated_by = relationship("User", foreign_keys=[invalidated_by_uid], lazy="selectin")
    date_invalidated = Column(DateTime, nullable=True)
    cancelled_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    cancelled_by = relationship("User", foreign_keys=[cancelled_by_uid], lazy="selectin")
    date_cancelled = Column(DateTime, nullable=True)
    retest = Column(Boolean(), default=False)
    reportable = Column(Boolean(), default=True)  # for retests or reflex
    status = Column(String, nullable=False)

    async def assign(self, ws_uid, position):
        self.worksheet_uid = ws_uid
        self.assigned = True
        self.worksheet_position = position
        return await self.save()

    async def un_assign(self):
        self.worksheet_uid = None
        self.assigned = False
        self.worksheet_position = None
        return await self.save()

    async def verify(self, verifier):
        self.status = conf.states.result.VERIFIED
        self.verified_by_uid = verifier.uid
        self.date_verified = datetime.now()
        self.updated_by_uid = verifier.uid # noqa
        return await self.save()

    async def retract(self, retracted_by):
        self.status = conf.states.result.RETRACTED
        self.verified_by_uid = retracted_by.uid
        self.date_verified = datetime.now()
        self.updated_by_uid = retracted_by.uid # noqa
        return await self.save()

    async def cancel(self, cancelled_by):
        if self.status in [conf.states.result.PENDING]:
            self.status = conf.states.result.CANCELLED
            self.cancelled_by_uid = cancelled_by.uid
            self.date_cancelled = datetime.now()
            self.updated_by_uid = cancelled_by.uid # noqa
            return await self.save()
        return None

    async def re_instate(self, re_instated_by):
        if self.sample.status in [conf.states.sample.CANCELLED]:
            raise Exception("You cannot reinstate analytes of cancelled sample. Reinstate the sample instead")

        if self.status in [conf.states.result.CANCELLED]:
            self.status = conf.states.result.PENDING
            self.cancelled_by_uid = None
            self.date_cancelled = None
            self.updated_by_uid = re_instated_by.uid # noqa
            return await self.save()
        return None

    async def change_status(self, status):
        self.status = status
        return await self.save()

    async def hide_report(self):
        self.reportable = False
        return await self.save()

    @classmethod
    async def create(cls, obj_in: schemas.AnalysisResultCreate) -> schemas.AnalysisResult:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.AnalysisResultUpdate) -> schemas.AnalysisResult:
        data = self._import(obj_in)
        return await super().update(**data)
