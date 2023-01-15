import logging
from typing import List

from felicity.apps import Auditable, BaseAuditDBModel, DBModel
from felicity.apps.analysis import conf as analysis_conf
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.analysis.models import qc as qc_models
from felicity.apps.analysis.models import results as result_models
from felicity.apps.common.models import IdSequence
from felicity.apps.notification.utils import FelicityStreamer
from felicity.apps.setup.models.setup import Instrument
from felicity.apps.user.models import User
from felicity.apps.worksheet import conf, schemas
from sqlalchemy import (Boolean, Column, DateTime, ForeignKey, Integer, String,
                        Table)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


streamer = FelicityStreamer()


class WSBase(BaseAuditDBModel):
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
    DBModel.metadata,
    Column("ws_template_uid", ForeignKey("worksheettemplate.uid"), primary_key=True),
    Column("qc_level_uid", ForeignKey("qclevel.uid"), primary_key=True),
)


class WorkSheetTemplate(WSBase):
    """WorkSheetTemplate

    a template has a single analyses associated in order to avoid
    cases where multi analyses can be assigned to a single ws
    """

    name = Column(String, unique=True, nullable=False)
    description = Column(String)
    analysis_uid = Column(Integer, ForeignKey("analysis.uid"), nullable=True)
    analysis = relationship(analysis_models.Analysis, lazy="selectin")
    qc_template_uid = Column(Integer, ForeignKey("qctemplate.uid"), nullable=True)
    qc_template = relationship(qc_models.QCTemplate, lazy="selectin")
    # to help cater for those created without template we also keep the qc_levels
    qc_levels = relationship(
        qc_models.QCLevel, secondary=worksheet_template_qc_level, lazy="selectin"
    )
    instrument_uid = Column(Integer, ForeignKey("instrument.uid"), nullable=True)
    instrument = relationship(Instrument, lazy="selectin")
    sample_type_uid = Column(Integer, ForeignKey("sampletype.uid"), nullable=False)
    sample_type = relationship(analysis_models.SampleType, lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.WSTemplateCreate) -> schemas.WSTemplate:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.WSTemplateUpdate) -> schemas.WSTemplate:
        data = self._import(obj_in)
        return await super().update(**data)


class WorkSheet(Auditable, WSBase):
    template_uid = Column(Integer, ForeignKey("worksheettemplate.uid"), nullable=False)
    template = relationship("WorkSheetTemplate", lazy="selectin")
    analyst_uid = Column(Integer, ForeignKey("user.uid"), nullable=False)
    analyst = relationship(User, foreign_keys=[analyst_uid], lazy="selectin")
    worksheet_id = Column(String, index=True, unique=True, nullable=False)
    analysis_uid = Column(Integer, ForeignKey("analysis.uid"), nullable=True)
    analysis = relationship(analysis_models.Analysis, lazy="selectin")
    instrument_uid = Column(Integer, ForeignKey("instrument.uid"), nullable=True)
    instrument = relationship(Instrument, backref="worksheets", lazy="selectin")
    sample_type_uid = Column(Integer, ForeignKey("sampletype.uid"), nullable=False)
    sample_type = relationship(analysis_models.SampleType, lazy="selectin")
    assigned_count = Column(Integer, nullable=False, default=0)
    analysis_results = relationship(
        "AnalysisResult", back_populates="worksheet", lazy="selectin"
    )
    #
    submitted_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    submitted_by = relationship(User, foreign_keys=[submitted_by_uid], lazy="selectin")
    date_submitted = Column(DateTime, nullable=True)
    verified_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    verified_by = relationship(User, foreign_keys=[verified_by_uid], lazy="selectin")
    date_verified = Column(DateTime, nullable=True)

    async def get_analysis_results(self):
        results: List[result_models.AnalysisResult] = []
        qc_results: List[result_models.AnalysisResult] = []

        all_results = await result_models.AnalysisResult.get_all(worksheet_uid=self.uid)
        for result in all_results:
            if result.sample.sample_type.name == "QC Sample":
                qc_results.append(result)
            else:
                results.append(result)

        return results, qc_results

    async def reset_assigned_count(self):
        # TODO: DO NOT COUNT QC SAMPLES
        analysis_results, _ = await self.get_analysis_results()
        count = len(analysis_results)
        self.assigned_count = count
        if count == 0:
            self.state = conf.worksheet_states.EMPTY

        if count > 0 and self.state == conf.worksheet_states.EMPTY:
            self.state = conf.worksheet_states.PENDING

        await self.save()

    async def change_state(self, state, updated_by_uid):
        self.state = state
        self.updated_by_uid = updated_by_uid  # noqa
        await self.save()

    async def has_processed_samples(self):
        states = [
            analysis_conf.states.result.RESULTED,
            analysis_conf.states.result.APPROVED,
        ]

        results, qc_results = await self.get_analysis_results()
        analysis_results = results + qc_results
        processed = any([res.status in states for res in analysis_results])
        return processed

    async def submit(self, submitter):
        if self.state != conf.worksheet_states.AWAITING:
            states = [
                analysis_conf.states.result.RESULTED,
                analysis_conf.states.result.APPROVED,
            ]

            results, qc_results = await self.get_analysis_results()
            analysis_results = results + qc_results
            if all([res.status in states for res in analysis_results]):
                self.state = conf.worksheet_states.AWAITING
                self.updated_by_uid = submitter.uid  # noqa
                self.submitted_by_uid = submitter.uid
                saved = await self.save()
                await streamer.stream(saved, submitter, "submitted", "worksheet")
                return saved
        return self

    async def verify(self, verified_by):
        if self.state != conf.worksheet_states.APPROVED:
            states = [
                analysis_conf.states.result.APPROVED,
                analysis_conf.states.result.RETRACTED,
            ]

            results, qc_results = await self.get_analysis_results()
            analysis_results = results + qc_results
            if all([res.status in states for res in analysis_results]):
                self.state = conf.worksheet_states.APPROVED
                self.updated_by_uid = verified_by.uid  # noqa
                self.verified_by_uid = verified_by.uid
                saved = await self.save()
                await streamer.stream(saved, verified_by, "verified", "worksheet")
                return saved
        return self

    @classmethod
    async def create(cls, obj_in: schemas.WorkSheetCreate) -> schemas.WorkSheet:
        data = cls._import(obj_in)
        data["worksheet_id"] = (await IdSequence.get_next_number("WS"))[1]
        return await super().create(**data)

    async def update(self, obj_in: schemas.WorkSheetUpdate) -> schemas.WorkSheet:
        data = self._import(obj_in)
        return await super().update(**data)
