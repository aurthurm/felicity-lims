from datetime import datetime

from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB

from felicity.apps import BaseAuditDBModel, DBModel, Auditable
from felicity.apps.core.utils import sequencer
from felicity.apps.setup.models.setup import Instrument
from felicity.apps.user.models import User
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.analysis.models import qc as qc_models
from felicity.apps.analysis import conf as analysis_conf
from felicity.apps.worksheet import schemas, conf


class WSBase(DBModel):
    __abstract__ = True
    worksheet_type = Column(String)
    reserved = Column(JSONB)
    plate = Column(JSONB)
    number_of_samples = Column(Integer)
    rows = Column(Integer)
    cols = Column(Integer)
    row_wise = Column(Boolean(), default=False)
    state = Column(String)

    def plate_values(self):
        """Values for the WS plate creator"""
        data = dict()
        data['reserved'] = self.reserved
        data['n_samples'] = self.number_of_samples
        data['t_type'] = self.worksheet_type
        data['rows'] = self.rows
        data['cols'] = self.cols
        data['row_wise'] = self.row_wise
        return data


"""
Many to Many Link between WorkSheetTemplate and Profile
"""
wstplink = Table('wstplink', DBModel.metadata,
                 Column("ws_template_uid", ForeignKey('worksheettemplate.uid'), primary_key=True),
                 Column("profile_uid", ForeignKey('profile.uid'), primary_key=True)
                 )

"""
any to Many Link between WorkSheetTemplate and Analysis
"""
wstalink = Table('wstalink', DBModel.metadata,
                 Column("ws_template_uid", ForeignKey('worksheettemplate.uid'), primary_key=True),
                 Column("analysis_uid", ForeignKey('analysis.uid'), primary_key=True)
                 )

"""
Many to Many Link between WorkSheetTemplate and QCLevel
"""
wstqcllink = Table('wstqcllink', DBModel.metadata,
                   Column("ws_template_uid", ForeignKey('worksheettemplate.uid'), primary_key=True),
                   Column("qc_level_uid", ForeignKey('qclevel.uid'), primary_key=True)
                   )


class WorkSheetTemplate(WSBase):
    """WorkSheetTemplate

    a template has a single analyses associated in order to avoid
    cases where multi analyses can be assigned to a single ws
    """
    name = Column(String, unique=True, nullable=False)
    description = Column(String)
    profiles = relationship(analysis_models.Profile, secondary=wstplink, backref="worksheet_templates")
    analyses = relationship(analysis_models.Analysis, secondary=wstalink, backref="worksheet_templates")
    qc_template_uid = Column(Integer, ForeignKey('qctemplate.uid'), nullable=True)
    qc_template = relationship(qc_models.QCTemplate, backref='worksheet_templates')
    # to help cater for those created without template we also keep the qc_levels
    qc_levels = relationship(qc_models.QCLevel, secondary=wstqcllink)
    instrument_uid = Column(Integer, ForeignKey('instrument.uid'), nullable=True)
    instrument = relationship(Instrument, backref='worksheet_templates')
    sample_type_uid = Column(Integer, ForeignKey('sampletype.uid'), nullable=False)
    sample_type = relationship(analysis_models.SampleType, backref='worksheet_templates')

    @classmethod
    async def create(cls, obj_in: schemas.WSTemplateCreate) -> schemas.WSTemplate:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.WSTemplateUpdate) -> schemas.WSTemplate:
        data = self._import(obj_in)
        return await super().update(**data)


"""
Many to Many Link between WorkSheet and Profile
"""
wsplink = Table('wsplink', DBModel.metadata,
                Column("worksheet_uid", ForeignKey('worksheet.uid'), primary_key=True),
                Column("profile_uid", ForeignKey('profile.uid'), primary_key=True)
                )

"""
Many to Many Link between WorkSheet and Analysis
"""
wsalink = Table('wsalink', DBModel.metadata,
                Column("worksheet_uid", ForeignKey('worksheet.uid'), primary_key=True),
                Column("analysis_uid", ForeignKey('analysis.uid'), primary_key=True)
                )


class WorkSheet(Auditable, WSBase):
    template_uid = Column(Integer, ForeignKey('worksheettemplate.uid'), nullable=False)
    template = relationship('WorkSheetTemplate', backref='worksheets')
    analyst_uid = Column(Integer, ForeignKey('user.uid'), nullable=False)
    analyst = relationship(User, foreign_keys=[analyst_uid], backref="analysed_worksheets")
    worksheet_id = Column(String, index=True, unique=True, nullable=False)
    profiles = relationship(analysis_models.Profile, secondary=wsplink, backref="worksheets")
    analyses = relationship(analysis_models.Analysis, secondary=wsalink, backref="worksheets")
    instrument_uid = Column(Integer, ForeignKey('instrument.uid'), nullable=True)
    instrument = relationship(Instrument, backref='worksheets')
    sample_type_uid = Column(Integer, ForeignKey('sampletype.uid'), nullable=False)
    sample_type = relationship(analysis_models.SampleType, backref='worksheets')
    assigned_count = Column(Integer, nullable=False, default=0)
    #
    submitted_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    submitted_by = relationship(User, foreign_keys=[submitted_by_uid], backref="submitted_worksheets")
    date_submitted = Column(DateTime, nullable=True)
    verified_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    verified_by = relationship(User, foreign_keys=[verified_by_uid], backref="verified_worksheets")
    date_verified = Column(DateTime, nullable=True)

    async def reset_assigned_count(self):
        # TODO: DO NOT COUNT QC SAMPLES
        count = len(self.analysis_results)
        self.assigned_count = count
        if count == 0:
            self.state = conf.worksheet_states.PENDING_ASSIGNMENT
        await self.save()

    async def change_state(self, state, updated_by_uid):
        self.state = state
        self.updated_by_uid = updated_by_uid  # noqa
        await self.save()

    def has_processed_samples(self):
        states = [
            analysis_conf.states.result.RESULTED,
            analysis_conf.states.result.VERIFIED]
        processed = any([res.status in states for res in self.analysis_results])
        return processed

    async def submit(self, submitter):
        if self.state != conf.worksheet_states.TO_BE_VERIFIED:
            states = [
                analysis_conf.states.result.RESULTED,
                analysis_conf.states.result.VERIFIED]

            if all([res.status in states for res in self.analysis_results]):
                self.state = conf.worksheet_states.TO_BE_VERIFIED
                self.updated_by_uid = submitter.uid  # noqa
                self.submitted_by_uid = submitter.uid
                await self.save()

    async def verify(self, verified_by):
        if self.state != conf.worksheet_states.VERIFIED:
            states = [analysis_conf.states.result.VERIFIED, analysis_conf.states.result.RETRACTED]

            if all([res.status in states for res in self.analysis_results]):
                self.state = conf.worksheet_states.VERIFIED
                self.updated_by_uid = verified_by.uid  # noqa
                self.verified_by_uid = verified_by.uid
                await self.save()

    async def set_plate(self, fill):
        self.plate = fill
        await self.save()

    @classmethod
    async def create_worksheet_id(cls):
        prefix_key = "WS"
        prefix_year = str(datetime.now().year)[2:]
        prefix = f"{prefix_key}{prefix_year}"
        stmt = cls.where(worksheet_id__startswith=f'%{prefix}%')
        res = await cls.session.execute(stmt)
        count = len(res.scalars().all())
        if isinstance(count, type(None)):
            count = 0
        return f"{prefix}-{sequencer(count + 1, 5)}"

    @classmethod
    async def create(cls, obj_in: schemas.WorkSheetCreate) -> schemas.WorkSheet:
        data = cls._import(obj_in)
        data['worksheet_id'] = await cls.create_worksheet_id()
        return await super().create(**data)

    async def update(self, obj_in: schemas.WorkSheetUpdate) -> schemas.WorkSheet:
        data = self._import(obj_in)
        return await super().update(**data)
