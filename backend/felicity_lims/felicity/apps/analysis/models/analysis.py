from datetime import datetime, timedelta
import logging
from time import sleep
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Table
from sqlalchemy.orm import relationship

from felicity.database.session import async_session_factory
from felicity.apps.analysis import schemas
from felicity.apps.analysis.models.qc import QCLevel, QCSet
from felicity.apps.analysis.conf import states
from felicity.apps.client import models as ct_models
from felicity.apps.core import BaseMPTT
from felicity.apps.core.utils import sequencer
from felicity.apps.patient import models as pt_models
from felicity.apps import BaseAuditDBModel, DBModel, Auditable, SEQUENTIAL_ID_RETRIES
from felicity.apps.stream.utils import FelicityStreamer
from felicity.apps.user.models import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

streamer = FelicityStreamer()


class SampleType(BaseAuditDBModel):
    """SampleType"""
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    active = Column(Boolean(), default=False)
    internal_use = Column(Boolean(), default=False)  # e.g QC Sample
    abbr = Column(String, nullable=False)

    @classmethod
    async def create(cls, obj_in: schemas.SampleTypeCreate) -> schemas.SampleType:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.SampleTypeUpdate) -> schemas.SampleType:
        data = self._import(obj_in)
        return await super().update(**data)


"""
Many to Many Link between Analysis and SampleType
"""
astlink = Table('astlink', DBModel.metadata,
                Column("sampletype_uid", ForeignKey('sampletype.uid'), primary_key=True),
                Column("analysis_uid", ForeignKey('analysis.uid'), primary_key=True)
                )

"""
 Many to Many Link between Analysis and Profile
    Offers multi-profiles flexibility per analysis
    A rare scenario worth supporting :)
"""
aplink = Table('aplink', DBModel.metadata,
               Column("analysis_uid", ForeignKey('analysis.uid'), primary_key=True),
               Column("profile_uid", ForeignKey('profile.uid'), primary_key=True)
               )


class AnalysisCategory(BaseAuditDBModel):
    """Categorise Analysis"""
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    active = Column(Boolean(), default=False)

    @classmethod
    async def create(cls, obj_in: schemas.AnalysisCategoryCreate) -> schemas.AnalysisCategory:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.AnalysisCategoryUpdate) -> schemas.AnalysisCategory:
        data = self._import(obj_in)
        return await super().update(**data)


class Profile(DBModel):
    """Grouped Analysis e.g FBC, U&E's, MCS ..."""
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    keyword = Column(String, nullable=True, unique=True)
    tat_length_minutes = Column(Integer, nullable=True)
    active = Column(Boolean(), default=False)
    analyses = relationship('Analysis', secondary=aplink, back_populates="profiles", lazy="selectin")

    async def update_tat(self):
        tats = []
        tat = None
        for anal in self.analyses:
            tats.append(anal.tat_length_minutes)

        if len(tats) > 0:
            tat = sorted(tats, reverse=False)[0]

        if tat:
            self.tat_length_minutes = tat
            return await self.save()
        return self

    @classmethod
    async def create(cls, obj_in: schemas.ProfileCreate) -> schemas.Profile:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ProfileUpdate) -> schemas.Profile:
        data = self._import(obj_in)
        return await super().update(**data)


class Analysis(BaseAuditDBModel):
    """Analysis Test/Service"""
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    keyword = Column(String, nullable=False, unique=True)
    unit = Column(String, nullable=True)
    profiles = relationship('Profile', secondary=aplink, back_populates="analyses", lazy="selectin")
    sampletypes = relationship('SampleType', secondary=astlink, backref="analyses", lazy="selectin")
    resultoptions = relationship('ResultOption', backref="analyses", lazy="selectin")
    category_uid = Column(Integer, ForeignKey('analysiscategory.uid'))
    category = relationship(AnalysisCategory, backref="analyses", lazy="selectin")
    tat_length_minutes = Column(Integer, nullable=True)  # to calculate TAT
    sort_key = Column(Integer, nullable=True)
    internal_use = Column(Boolean(), default=False)  # e.g QC Services
    active = Column(Boolean(), default=False)

    @classmethod
    async def create(cls, obj_in: schemas.AnalysisCreate) -> schemas.Analysis:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.AnalysisUpdate) -> schemas.Analysis:
        data = self._import(obj_in)
        return await super().update(**data)


class ResultOption(BaseAuditDBModel):
    """Result Choices"""
    option_key = Column(Integer, nullable=False)
    value = Column(String, nullable=False)
    analysis_uid = Column(Integer, ForeignKey('analysis.uid'))

    @classmethod
    async def create(cls, obj_in: schemas.ResultOptionCreate) -> schemas.ResultOption:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ResultOptionUpdate) -> schemas.ResultOption:
        data = self._import(obj_in)
        return await super().update(**data)


class AnalysisRequest(BaseAuditDBModel):
    """AnalysisRequest a.k.a Laboratory Request"""
    patient_uid = Column(Integer, ForeignKey('patient.uid'))
    patient = relationship(pt_models.Patient, backref="analysis_requests", lazy='selectin')
    client_uid = Column(Integer, ForeignKey('client.uid'))
    client = relationship(ct_models.Client, backref="analysis_requests", lazy='selectin')
    samples = relationship("Sample", back_populates="analysisrequest", lazy='selectin')
    request_id = Column(String, index=True, unique=True, nullable=True)
    client_request_id = Column(String, unique=True, nullable=False)
    internal_use = Column(Boolean(), default=False)  # e.g Test Requests

    @classmethod
    async def create_request_id(cls):
        prefix_key = 'AR'
        prefix_year = str(datetime.now().year)[2:]
        prefix = f"{prefix_key}{prefix_year}"
        stmt = cls.where(request_id__startswith=f'%{prefix}%')
        async with async_session_factory() as session:
            res = await session.execute(stmt)
            count = len(res.scalars().all())
            if isinstance(count, type(None)):
                count = 0
            return f"{prefix}-{sequencer(count + 1, 5)}"

    @classmethod
    async def create(cls, obj_in: schemas.AnalysisRequestCreate) -> schemas.AnalysisRequest:
        data = cls._import(obj_in)
        created = None
        count = 0
        while count < SEQUENTIAL_ID_RETRIES:
            try:
                data['request_id'] = await cls.create_request_id()
                created = await super().create(**data)
                if created:
                    break
            except Exception:  # noqa
                logger.warning(f"AnalysisRequest ID generate Trial {count}")

            count += 1
        return created

    async def update(self, obj_in: schemas.SampleTypeUpdate) -> schemas.AnalysisRequest:
        data = self._import(obj_in)
        return await super().update(**data)


"""
Many to Many Link between Sample and Profile
"""
splink = Table('splink', DBModel.metadata,
               Column("sample_uid", ForeignKey('sample.uid'), primary_key=True),
               Column("profile_uid", ForeignKey('profile.uid'), primary_key=True)
               )

"""
Many to Many Link between Sample and Analysis
"""
salink = Table('salink', DBModel.metadata,
               Column("sample_uid", ForeignKey('sample.uid'), primary_key=True),
               Column("analysis_uid", ForeignKey('analysis.uid'), primary_key=True)
               )

"""
Many to Many Link between Sample and Rejection Reason
"""
rrslink = Table('rrslink', DBModel.metadata,
                Column("sample_uid", ForeignKey('sample.uid'), primary_key=True),
                Column("rejection_reason_uid", ForeignKey('rejectionreason.uid'), primary_key=True)
                )


class RejectionReason(BaseAuditDBModel):
    """Result Choices"""
    reason = Column(String, nullable=False)

    @classmethod
    async def create(cls, obj_in: schemas.RejectionReasonCreate) -> schemas.RejectionReason:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.RejectionReasonUpdate) -> schemas.RejectionReason:
        data = self._import(obj_in)
        return await super().update(**data)


class Sample(Auditable, BaseMPTT):
    """Sample"""
    analysisrequest_uid = Column(Integer, ForeignKey('analysisrequest.uid'), nullable=True)
    analysisrequest = relationship('AnalysisRequest', back_populates="samples", lazy='selectin')
    sampletype_uid = Column(Integer, ForeignKey('sampletype.uid'), nullable=False)
    sampletype = relationship('SampleType', backref="samples", lazy='selectin')
    sample_id = Column(String, index=True, unique=True, nullable=True)
    profiles = relationship(Profile, secondary=splink, backref="samples", lazy='selectin')
    analyses = relationship(Analysis, secondary=salink, backref="samples", lazy='selectin')
    analysis_results = relationship("AnalysisResult", back_populates="sample", lazy='selectin')
    priority = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False)
    assigned = Column(Boolean(), default=False)
    received_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    received_by = relationship(User, foreign_keys=[received_by_uid], lazy='selectin')
    date_received = Column(DateTime, nullable=True)
    submitted_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    submitted_by = relationship(User, foreign_keys=[submitted_by_uid], lazy='selectin')
    date_submitted = Column(DateTime, nullable=True)
    verified_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    verified_by = relationship(User, foreign_keys=[verified_by_uid], lazy='selectin')
    date_verified = Column(DateTime, nullable=True)
    published_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    published_by = relationship(User, foreign_keys=[published_by_uid], lazy='selectin')
    date_published = Column(DateTime, nullable=True)
    invalidated_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    invalidated_by = relationship(User, foreign_keys=[invalidated_by_uid], lazy='selectin')
    date_invalidated = Column(DateTime, nullable=True)
    cancelled_by_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    cancelled_by = relationship("User", foreign_keys=[cancelled_by_uid], lazy="selectin")
    date_cancelled = Column(DateTime, nullable=True)
    rejection_reasons = relationship(RejectionReason, secondary=rrslink, lazy='selectin')
    internal_use = Column(Boolean(), default=False)
    due_date = Column(DateTime, nullable=True)
    # QC Samples
    qc_set_uid = Column(Integer, ForeignKey('qcset.uid'), nullable=True)
    qc_set = relationship(QCSet, back_populates="samples", lazy='selectin')
    qc_level_uid = Column(Integer, ForeignKey('qclevel.uid'), nullable=True)
    qc_level = relationship(QCLevel, backref="qcsamples", lazy='selectin')

    @staticmethod
    def copy_include_keys():
        """Keys to include when duplicating Sample"""
        return [
            'analysisrequest_uid',
            'sampletype_uid',
            'status',
            'sample_id',
            'profiles',
            'analyses',
            'priority',
            'received_by_uid',
            'date_received',
            'internal_use',
        ]

    async def update_due_date(self, reset: bool = False):
        tats = []
        length: int = 0
        for anal in self.analyses:
            tats.append(anal.tat_length_minutes)

        for prof in self.profiles:
            tats.append(prof.tat_length_minutes)

        if len(tats) > 0:
            length = sorted(tats, reverse=False)[0]

        if reset:
            start = datetime.now()
        else:
            start = self.created_at
            if not start:
                start = datetime.now()

        if length:
            self.due_date = start + timedelta(minutes=length)
            return await self.save()
        return self

    async def extend_due_date(self, ext_minutes: int):
        self.due_date += timedelta(minutes=ext_minutes)
        return await self.save()

    @classmethod
    async def create_sample_id(cls, sampletype):
        prefix_key = sampletype.abbr
        prefix_year = str(datetime.now().year)[2:]
        prefix = f"{prefix_key}{prefix_year}"
        stmt = cls.where(sample_id__startswith=f'%{prefix}%')
        async with async_session_factory() as session:
            result = await session.execute(stmt)
            count = len(result.scalars().all())
            if isinstance(count, type(None)):
                count = 0
            return f"{prefix}-{sequencer(count + 1, 5)}"

    def copy_sample_id_unique(self):
        split = self.sample_id.split("_R")
        prefix = split[0]
        stub = None
        try:
            stub = split[1]
        except IndexError:
            stub = None
        finally:
            if not stub:
                return prefix + "_R01"
            else:
                count = int(stub)
                return f"{prefix}_R{sequencer(count + 1, 2)}"

    async def get_analysis_results(self):
        from felicity.apps.analysis.models.results import AnalysisResult
        return await AnalysisResult.get_all(sample_uid=self.uid)

    async def receive(self, received_by):
        if self.status in [states.sample.DUE]:
            self.status = states.sample.RECEIVED
            self.received_by_uid = received_by.uid
            self.date_received = datetime.now()
            self.updated_by_uid = received_by.uid  # noqa
            return await self.save()
        return None

    async def cancel(self, cancelled_by):
        analysis_results = await self.get_analysis_results()
        if self.status in [states.sample.RECEIVED, states.sample.DUE]:
            for result in analysis_results:
                await result.cancel(cancelled_by=cancelled_by)
            self.status = states.sample.CANCELLED
            self.cancelled_by_uid = cancelled_by.uid
            self.date_cancelled = datetime.now()
            self.updated_by_uid = cancelled_by.uid  # noqa
            return await self.save()
        return None

    async def re_instate(self, re_instated_by):
        analysis_results = await self.get_analysis_results()
        if self.status in [states.sample.CANCELLED]:
            # A better way is to go to audit log and retrieve previous state especially for  DUE
            # rather than transitioning all to RECEIVED
            self.status = states.sample.RECEIVED
            self.cancelled_by_uid = None
            self.date_cancelled = None
            self.updated_by_uid = re_instated_by.uid  # noqa
            sample = await self.save()
            for result in analysis_results:
                await result.re_instate(re_instated_by=re_instated_by)
            return sample
        return self

    async def submit(self, submitted_by):
        statuses = [states.result.RESULTED, states.result.RETRACTED, states.result.VERIFIED]
        analysis_results = await self.get_analysis_results()
        match = all([(sibling.status in statuses) for sibling in analysis_results])
        if match and self.status == states.sample.RECEIVED:
            self.status = states.sample.TO_BE_VERIFIED
            self.submitted_by_uid = submitted_by.uid
            self.date_submitted = datetime.now()
            self.updated_by_uid = submitted_by.uid  # noqa
            saved = await self.save()
            await streamer.stream(saved, submitted_by, "submitted", "sample")
            return saved
        return self

    async def assign(self):
        self.assigned = True
        return await self.save()

    async def un_assign(self):
        self.assigned = False
        return await self.save()

    async def verify(self, verified_by):
        statuses = [states.result.VERIFIED, states.result.RETRACTED, states.result.CANCELLED]
        analysis_results = await self.get_analysis_results()
        match = all([(sibling.status in statuses) for sibling in analysis_results])
        if match and self.status == states.sample.TO_BE_VERIFIED:
            self.status = states.sample.VERIFIED
            self.verified_by_uid = verified_by.uid
            self.date_verified = datetime.now()
            self.updated_by_uid = verified_by.uid  # noqa
            saved = await self.save()
            await streamer.stream(saved, verified_by, "verified", "sample")
            return saved
        return self

    async def publish(self, published_by):
        if self.status == states.sample.VERIFIED:
            self.status = states.sample.PUBLISHED
            self.published_by_uid = published_by.uid
            self.date_published = datetime.now()
            self.updated_by_uid = published_by.uid  # noqa
            return await self.save()
        return self

    async def invalidate(self, invalidated_by) -> (schemas.Sample, schemas.Sample):
        statuses = [states.sample.VERIFIED, states.sample.PUBLISHED]
        copy = None
        if self.status in statuses:
            copy = await self.duplicate_unique()
            self.status = states.sample.INVALIDATED
            self.invalidated_by_uid = invalidated_by.uid
            invalidated = await self.save()
            return copy, invalidated
        return copy, self

    async def reject(self, reasons, rejected_by):
        statuses = [states.sample.RECEIVED, states.sample.DUE]
        if self.status in statuses:
            self.status = states.sample.REJECTED
            self.rejection_reasons = reasons
            self.received_by_uid = rejected_by.uid
            self.updated_by_uid = rejected_by.uid  # noqa
            return await self.save()
        return self

        # DO REFLEX HERE

    @classmethod
    async def create(cls, obj_in: schemas.SampleCreate) -> schemas.Sample:
        data = cls._import(obj_in)
        sample_type_uid = data['sampletype_uid']

        created = None
        count = 0
        while count < SEQUENTIAL_ID_RETRIES:
            try:
                sample_type = await SampleType.find(sample_type_uid)
                data['sample_id'] = await cls.create_sample_id(sample_type)
                created = await super().create(**data)
                if created:
                    break
            except Exception:  # noqa
                logger.warning(f"Sample ID generate Trial {count}")

            count += 1
        return created

    async def duplicate_unique(self) -> schemas.Sample:
        data = self.to_dict(nested=False)
        data['sample_id'] = self.copy_sample_id_unique()
        for key, _ in list(data.items()):
            if key not in self.copy_include_keys():
                del data[key]
        data['status'] = states.sample.RECEIVED
        data['profiles'] = self.profiles
        data['analyses'] = self.analyses
        data['parent_id'] = self.uid
        return await super().create(**data)

    async def update(self, obj_in: schemas.SampleUpdate) -> schemas.Sample:
        data = self._import(obj_in)
        return await super().update(**data)

# @event.listens_for(Sample, "after_update")
# def stream_sample_verified_models(mapper, connection, target): # noqa
#     logger.log("stream_sample_verified inn")
#     logger.log(target)
#     print("hurray inn")
