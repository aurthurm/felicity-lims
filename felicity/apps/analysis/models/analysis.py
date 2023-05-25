import logging
from datetime import datetime, timedelta
from typing import Any, List, Union

from apps import Auditable, BaseAuditDBModel, DBModel
from apps.analysis import schemas
from apps.analysis.conf import states
from apps.analysis.models.qc import QCLevel, QCSet
from apps.client import models as ct_models
from apps.common import BaseMPTT
from apps.common.models import IdSequence
from apps.common.utils import sequencer
from apps.notification.utils import FelicityStreamer
from apps.patient import models as pt_models
from apps.user.models import User

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
)
from sqlalchemy.orm import relationship

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
 Many to Many Link between SampleType and Profile
"""
profile_sample_type = Table(
    "profile_sample_type",
    DBModel.metadata,
    Column("sample_type_uid", ForeignKey("sampletype.uid"), primary_key=True),
    Column("profile_uid", ForeignKey("profile.uid"), primary_key=True),
)

"""
Many to Many Link between Analysis and SampleType
"""
analysis_sample_type = Table(
    "analysis_sample_type",
    DBModel.metadata,
    Column("sample_type_uid", ForeignKey("sampletype.uid"), primary_key=True),
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
)

"""
 Many to Many Link between Analysis and Profile
    Offers multi-profiles flexibility per analysis
    A rare scenario worth supporting :)
"""
analysis_profile = Table(
    "analysis_profile",
    DBModel.metadata,
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("profile_uid", ForeignKey("profile.uid"), primary_key=True),
)


class AnalysisCategory(BaseAuditDBModel):
    """Categorise Analysis"""

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    department_uid = Column(String, ForeignKey(
        "department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    active = Column(Boolean(), default=False)

    @classmethod
    async def create(
        cls, obj_in: schemas.AnalysisCategoryCreate
    ) -> schemas.AnalysisCategory:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.AnalysisCategoryUpdate
    ) -> schemas.AnalysisCategory:
        data = self._import(obj_in)
        return await super().update(**data)


class Profile(BaseAuditDBModel):
    """Grouped Analysis e.g FBC, U&E's, MCS ..."""

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    keyword = Column(String, nullable=True, unique=True)
    tat_length_minutes = Column(Integer, nullable=True)
    active = Column(Boolean(), default=False)
    analyses = relationship(
        "Analysis",
        secondary=analysis_profile,
        back_populates="profiles",
        lazy="selectin",
    )
    sample_types = relationship(
        "SampleType", secondary=profile_sample_type, backref="profiles", lazy="selectin"
    )
    department_uid = Column(String, ForeignKey(
        "department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")

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


"""
 Many to Many Link between Analyses and Method
"""
analysis_method = Table(
    "analysis_method",
    DBModel.metadata,
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("method_uid", ForeignKey("method.uid"), primary_key=True),
)

"""
 Many to Many Link between Analyses and Intruments
"""
analysis_instrument = Table(
    "analysis_instrument",
    DBModel.metadata,
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("instrument_uid", ForeignKey("instrument.uid"), primary_key=True),
)


class Analysis(BaseAuditDBModel):
    """Analysis Test/Service"""

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    keyword = Column(String, nullable=False, unique=True)
    # default unit: can be overridden by specification unit
    unit_uid = Column(String, ForeignKey("unit.uid"), nullable=True)
    unit = relationship("Unit", lazy="selectin")
    profiles = relationship(
        "Profile", 
        secondary=analysis_profile, 
        back_populates="analyses",
        lazy="selectin"
    )
    sample_types = relationship(
        "SampleType",
        secondary=analysis_sample_type,
        backref="analyses",
        lazy="selectin",
    )
    instruments = relationship(
        "Instrument", secondary=analysis_instrument, backref="analyses", lazy="selectin"
    )
    methods = relationship(
        "Method", secondary=analysis_method, backref="analyses", lazy="selectin"
    )
    interims = relationship(
        "AnalysisInterim", backref="analysis", lazy="selectin")
    correction_factors = relationship(
        "AnalysisCorrectionFactor", backref="analysis", lazy="selectin"
    )
    specifications = relationship(
        "AnalysisSpecification", backref="analysis", lazy="selectin"
    )
    detection_limits = relationship(
        "AnalysisDetectionLimit", backref="analysis", lazy="selectin"
    )
    uncertainties = relationship(
        "AnalysisUncertainty", backref="analysis", lazy="selectin"
    )
    result_options = relationship(
        "ResultOption", backref="analyses", lazy="selectin")
    category_uid = Column(String, ForeignKey("analysiscategory.uid"))
    category = relationship(
        AnalysisCategory, backref="analyses", lazy="selectin")
    tat_length_minutes = Column(Integer, nullable=True)  # to calculate TAT
    sort_key = Column(Integer, nullable=True)
    internal_use = Column(Boolean(), default=False)  # e.g QC Services
    department_uid = Column(String, ForeignKey(
        "department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    # precision -> decimal places to report
    precision = Column(Integer, nullable=True)
    required_verifications = Column(Integer, nullable=True, default=1)
    self_verification = Column(Boolean(), default=False)
    hidden = Column(Boolean(), default=False)
    active = Column(Boolean(), default=False)

    @classmethod
    async def create(cls, obj_in: schemas.AnalysisCreate) -> schemas.Analysis:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.AnalysisUpdate) -> schemas.Analysis:
        data = self._import(obj_in)
        return await super().update(**data)


class AnalysisInterim(BaseAuditDBModel):
    """Analysis Interim Result Field"""

    key = Column(Integer, nullable=False)
    value = Column(String, nullable=False)
    analysis_uid = Column(String, ForeignKey(
        "analysis.uid"), nullable=True)
    instrument_uid = Column(String, ForeignKey(
        "instrument.uid"), nullable=True)
    instrument = relationship("Instrument")

    @classmethod
    async def create(
        cls, obj_in: schemas.AnalysisInterimCreate
    ) -> schemas.AnalysisInterim:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.AnalysisInterimUpdate
    ) -> schemas.AnalysisInterim:
        data = self._import(obj_in)
        return await super().update(**data)


class AnalysisCorrectionFactor(BaseAuditDBModel):
    """Analysis Correction Factor"""

    factor = Column(Float, nullable=False)
    analysis_uid = Column(String, ForeignKey(
        "analysis.uid"), nullable=True)
    instrument_uid = Column(String, ForeignKey(
        "instrument.uid"), nullable=True)
    method_uid = Column(String, ForeignKey("method.uid"), nullable=True)

    @classmethod
    async def create(
        cls, obj_in: schemas.AnalysisCorrectionFactorCreate
    ) -> schemas.AnalysisCorrectionFactor:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.AnalysisCorrectionFactorUpdate
    ) -> schemas.AnalysisCorrectionFactor:
        data = self._import(obj_in)
        return await super().update(**data)


class AnalysisDetectionLimit(BaseAuditDBModel):
    """Analysis Detection Limit"""

    lower_limit = Column(Float, nullable=False)
    upper_limit = Column(Float, nullable=False)
    analysis_uid = Column(String, ForeignKey(
        "analysis.uid"), nullable=True)
    instrument_uid = Column(String, ForeignKey(
        "instrument.uid"), nullable=True)
    method_uid = Column(String, ForeignKey("method.uid"), nullable=True)

    @classmethod
    async def create(
        cls, obj_in: schemas.AnalysisDetectionLimitCreate
    ) -> schemas.AnalysisDetectionLimit:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.AnalysisDetectionLimitUpdate
    ) -> schemas.AnalysisDetectionLimit:
        data = self._import(obj_in)
        return await super().update(**data)


class AnalysisUncertainty(BaseAuditDBModel):
    """Analysis Measurment Uncertainty
    If value is within the the range min.max then result becomes a range (result +/- value)
    """

    min = Column(Float, nullable=False)
    max = Column(Float, nullable=False)
    value = Column(Float, nullable=False)
    analysis_uid = Column(String, ForeignKey(
        "analysis.uid"), nullable=True)
    instrument_uid = Column(String, ForeignKey(
        "instrument.uid"), nullable=True)
    method_uid = Column(String, ForeignKey("method.uid"), nullable=True)

    @classmethod
    async def create(
        cls, obj_in: schemas.AnalysisUncertaintyCreate
    ) -> schemas.AnalysisUncertainty:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.AnalysisUncertaintyUpdate
    ) -> schemas.AnalysisUncertainty:
        data = self._import(obj_in)
        return await super().update(**data)


class AnalysisSpecification(BaseAuditDBModel):
    """Analysis Specification Ranges"""

    analysis_uid = Column(String, ForeignKey(
        "analysis.uid"), nullable=True)
    unit_uid = Column(String, ForeignKey("unit.uid"), nullable=True)
    unit = relationship("Unit", lazy="selectin")
    # Normal Range
    min = Column(Float, nullable=True)
    max = Column(Float, nullable=True)
    # Below Normal Range: Raise Alarm
    min_warn = Column(Float, nullable=True)
    # Above Normal Range: Raise Alarm
    max_warn = Column(Float, nullable=True)
    # Result Value if less than min_warn
    min_report = Column(String, nullable=True)
    # Result Value if more than max_warn
    max_report = Column(String, nullable=True)
    # If result is textual
    # comma seperated warn results
    warn_values = Column(String, nullable=True)
    # Result Value if result in warn_values
    warn_report = Column(String, nullable=True)
    #
    # dependencies
    method_uid = Column(String, ForeignKey("method.uid"), nullable=True)
    gender = Column(String, nullable=True)
    age_min = Column(Integer, nullable=True)
    age_max = Column(Integer, nullable=True)

    @classmethod
    async def create(
        cls, obj_in: schemas.AnalysisSpecificationCreate
    ) -> schemas.AnalysisSpecification:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.AnalysisSpecificationUpdate
    ) -> schemas.AnalysisSpecification:
        data = self._import(obj_in)
        return await super().update(**data)


class ResultOption(BaseAuditDBModel):
    """Result Choices"""

    option_key = Column(Integer, nullable=False)
    value = Column(String, nullable=False)
    analysis_uid = Column(String, ForeignKey("analysis.uid"))

    @classmethod
    async def create(cls, obj_in: schemas.ResultOptionCreate) -> schemas.ResultOption:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ResultOptionUpdate) -> schemas.ResultOption:
        data = self._import(obj_in)
        return await super().update(**data)


class AnalysisRequest(BaseAuditDBModel):
    """AnalysisRequest a.k.a Laboratory Request"""

    patient_uid = Column(String, ForeignKey("patient.uid"))
    patient = relationship(
        pt_models.Patient, backref="analysis_requests", lazy="selectin"
    )
    client_uid = Column(String, ForeignKey("client.uid"))
    client = relationship(
        ct_models.Client, backref="analysis_requests", lazy="selectin"
    )
    samples = relationship(
        "Sample", back_populates="analysis_request", lazy="selectin")
    request_id = Column(String, index=True, unique=True, nullable=True)
    client_request_id = Column(String, unique=True, nullable=False)
    internal_use = Column(Boolean(), default=False)  # e.g Test Requests

    @classmethod
    async def create(
        cls, obj_in: schemas.AnalysisRequestCreate
    ) -> schemas.AnalysisRequest:
        data = cls._import(obj_in)
        data["request_id"] = (await IdSequence.get_next_number("AR"))[1]
        return await super().create(**data)

    async def update(self, obj_in: schemas.SampleTypeUpdate) -> schemas.AnalysisRequest:
        data = self._import(obj_in)
        return await super().update(**data)


"""
Many to Many Link between Sample and Profile
"""
sample_profile = Table(
    "sample_profile",
    DBModel.metadata,
    Column("sample_uid", ForeignKey("sample.uid"), primary_key=True),
    Column("profile_uid", ForeignKey("profile.uid"), primary_key=True),
)

"""
Many to Many Link between Sample and Analysis
"""
sample_analysis = Table(
    "sample_analysis",
    DBModel.metadata,
    Column("sample_uid", ForeignKey("sample.uid"), primary_key=True),
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
)

"""
Many to Many Link between Sample and Rejection Reason
"""
sample_rejection_reason = Table(
    "sample_rejection_reason",
    DBModel.metadata,
    Column("sample_uid", ForeignKey("sample.uid"), primary_key=True),
    Column("rejection_reason_uid", ForeignKey(
        "rejectionreason.uid"), primary_key=True),
)


class RejectionReason(BaseAuditDBModel):
    """Rejection Reason"""

    reason = Column(String, nullable=False)

    @classmethod
    async def create(
        cls, obj_in: schemas.RejectionReasonCreate
    ) -> schemas.RejectionReason:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.RejectionReasonUpdate
    ) -> schemas.RejectionReason:
        data = self._import(obj_in)
        return await super().update(**data)


class Sample(Auditable, BaseMPTT):
    """Sample"""

    analysis_request_uid = Column(
        String, ForeignKey("analysisrequest.uid"), nullable=True
    )
    analysis_request = relationship(
        "AnalysisRequest", back_populates="samples", lazy="selectin"
    )
    sample_type_uid = Column(String, ForeignKey(
        "sampletype.uid"), nullable=False)
    sample_type = relationship(
        "SampleType", backref="samples", lazy="selectin")
    sample_id = Column(String, index=True, unique=True, nullable=True)
    profiles = relationship(
        Profile, secondary=sample_profile, backref="samples", lazy="selectin"
    )
    analyses = relationship(
        Analysis, secondary=sample_analysis, backref="samples", lazy="selectin"
    )
    analysis_results = relationship(
        "AnalysisResult", back_populates="sample", lazy="selectin"
    )
    assigned = Column(Boolean(), default=False)
    priority = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False)
    date_collected = Column(DateTime, nullable=True)
    received_by_uid = Column(
        String, ForeignKey("user.uid"), nullable=True)
    received_by = relationship(
        User, foreign_keys=[received_by_uid], lazy="selectin")
    date_received = Column(DateTime, nullable=True)
    submitted_by_uid = Column(
        String, ForeignKey("user.uid"), nullable=True)
    submitted_by = relationship(
        User, foreign_keys=[submitted_by_uid], lazy="selectin")
    date_submitted = Column(DateTime, nullable=True)
    verified_by_uid = Column(
        String, ForeignKey("user.uid"), nullable=True)
    verified_by = relationship(
        User, foreign_keys=[verified_by_uid], lazy="selectin")
    date_verified = Column(DateTime, nullable=True)
    published_by_uid = Column(
        String, ForeignKey("user.uid"), nullable=True)
    published_by = relationship(
        User, foreign_keys=[published_by_uid], lazy="selectin")
    date_published = Column(DateTime, nullable=True)
    printed = Column(Boolean(), default=False)
    printed_by_uid = Column(
        String, ForeignKey("user.uid"), nullable=True)
    printed_by = relationship(
        User, foreign_keys=[printed_by_uid], lazy="selectin")
    date_printed = Column(DateTime, nullable=True)
    invalidated_by_uid = Column(
        String, ForeignKey("user.uid"), nullable=True)
    invalidated_by = relationship(
        User, foreign_keys=[invalidated_by_uid], lazy="selectin"
    )
    date_invalidated = Column(DateTime, nullable=True)
    cancelled_by_uid = Column(
        String, ForeignKey("user.uid"), nullable=True)
    cancelled_by = relationship(
        "User", foreign_keys=[cancelled_by_uid], lazy="selectin"
    )
    date_cancelled = Column(DateTime, nullable=True)
    rejection_reasons = relationship(
        RejectionReason, secondary=sample_rejection_reason, lazy="selectin"
    )
    internal_use = Column(Boolean(), default=False)
    due_date = Column(DateTime, nullable=True)
    # QC Samples
    qc_set_uid = Column(String, ForeignKey("qcset.uid"), nullable=True)
    qc_set = relationship(QCSet, back_populates="samples", lazy="selectin")
    qc_level_uid = Column(String, ForeignKey("qclevel.uid"), nullable=True)
    qc_level = relationship(QCLevel, backref="qc_samples", lazy="selectin")
    # storage -> bio bank
    stored_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    stored_by = relationship("User", foreign_keys=[stored_by_uid], lazy="selectin")
    date_stored = Column(DateTime, nullable=True)
    date_retrieved_from_storage = Column(DateTime, nullable=True)
    storage_container_uid = Column(
        String, ForeignKey("storagecontainer.uid"), nullable=True
    )
    storage_container = relationship(
        "StorageContainer", back_populates="samples", lazy="selectin"
    )
    storage_slot = Column(String, nullable=True)
    storage_slot_index = Column(Integer, nullable=True)

    @staticmethod
    def copy_include_keys():
        """Keys to include when duplicating Sample"""
        return [
            "analysis_request_uid",
            "sample_type_uid",
            "status",
            "sample_id",
            "profiles",
            "analyses",
            "priority",
            "received_by_uid",
            "date_received",
            "internal_use",
        ]

    async def update_due_date(self, reset: bool = False):
        tats: List[Union[int, Any]] = []
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

    async def change_status(self, status, updated_by_uid):
        self.status = status
        self.updated_by_uid = updated_by_uid  # noqa
        await self.save()

    async def extend_due_date(self, ext_minutes: int):
        self.due_date += timedelta(minutes=ext_minutes)
        return await self.save()

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
        from apps.analysis.models.results import AnalysisResult

        return await AnalysisResult.get_all(sample_uid=self.uid)
    
    async def get_referred_analyses(self):
        analysis = await self.get_analysis_results()
        return analysis, list(filter(lambda a: a.status == states.Result.REFERRED ,analysis))
    
    async def has_fully_referred_analyses(self):
        analysis, referred = await self.get_referred_analyses()
        return len(analysis) == len(referred)
    
    async def has_no_referred_analyses(self):
        analysis, referred = await self.get_referred_analyses()
        return len(referred) == 0
    
    async def has_partly_referred_analyses(self):
        analysis, referred = await self.get_referred_analyses()
        return len(analysis) != len(referred) and len(referred) > 0

    async def receive(self, received_by):
        if self.status in [states.sample.EXPECTED]:
            self.status = states.sample.RECEIVED
            self.received_by_uid = received_by.uid
            self.date_received = datetime.now()
            self.updated_by_uid = received_by.uid  # noqa
            return await self.save()
        return None

    async def cancel(self, cancelled_by):
        analysis_results = await self.get_analysis_results()
        if self.status in [states.sample.RECEIVED, states.sample.EXPECTED]:
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
            # A better way is to go to audit log and retrieve previous state
            # rather than transitioning all to RECEIVED
            self.status = states.sample.RECEIVED
            self.cancelled_by_uid = None
            self.date_cancelled = None
            self.updated_by_uid = re_instated_by.uid  # noqa
            sample = await self.save()
            for result in analysis_results:
                await result.re_instate(sample, re_instated_by=re_instated_by)
            return sample
        return self

    async def submit(self, submitted_by):
        statuses = [
            states.result.RESULTED,
            states.result.RETRACTED,
            states.result.APPROVED,
            states.result.CANCELLED,
        ]
        analysis_results = await self.get_analysis_results()
        match = all([(sibling.status in statuses)
                    for sibling in analysis_results])
        if match and self.status in [states.sample.RECEIVED]:
            self.status = states.sample.AWAITING
            self.submitted_by_uid = submitted_by.uid
            self.date_submitted = datetime.now()
            self.updated_by_uid = submitted_by.uid  # noqa
            saved = await self.save()
            await streamer.stream(saved, submitted_by, "submitted", "sample")
            return saved
        return self

    async def un_submit(self):
        if self.status == states.sample.AWAITING:
            self.status = states.sample.RECEIVED
            self.submitted_by_uid = None
            self.date_submitted = None
            self.updated_by_uid = None  # noqa
            return await self.save()
        return self

    async def assign(self):
        self.assigned = True
        return await self.save()

    async def un_assign(self):
        self.assigned = False
        return await self.save()

    async def verify(self, verified_by):
        statuses = [
            states.result.APPROVED,
            states.result.RETRACTED,
            states.result.CANCELLED,
        ]
        analysis_results = await self.get_analysis_results()
        match = all([(sibling.status in statuses)
                    for sibling in analysis_results])
        if match and self.status in [states.sample.AWAITING]:
            self.status = states.sample.APPROVED
            self.verified_by_uid = verified_by.uid
            self.date_verified = datetime.now()
            self.updated_by_uid = verified_by.uid  # noqa
            saved = await self.save()
            await streamer.stream(saved, verified_by, "approved", "sample")
            return saved
        return self

    async def publish(self, published_by):
        if self.status in [states.sample.APPROVED, states.sample.PUBLISHING]:
            self.status = states.sample.PUBLISHED
            self.published_by_uid = published_by.uid
            self.date_published = datetime.now()
            self.updated_by_uid = published_by.uid  # noqa
            return await self.save()
        return self

    async def print(self, printed_by):
        if self.status == states.sample.PUBLISHED:
            self.printed = True
            self.printed_by_uid = printed_by.uid
            self.date_printed = datetime.now()
            self.updated_by_uid = printed_by.uid  # noqa
            return await self.save()
        return self

    async def invalidate(self, invalidated_by) -> tuple[schemas.Sample, schemas.Sample]:
        statuses = [states.sample.APPROVED, states.sample.PUBLISHED]
        copy = None
        if self.status in statuses:
            copy = await self.duplicate_unique(invalidated_by)
            self.status = states.sample.INVALIDATED
            self.invalidated_by_uid = invalidated_by.uid
            invalidated = await self.save()
            await streamer.stream(invalidated, invalidated_by, "invalidated", "sample")
            return copy, invalidated
        return copy, self

    async def reject(self, rejected_by):
        statuses = [states.sample.RECEIVED, states.sample.EXPECTED]
        if self.status in statuses:
            self.status = states.sample.REJECTED
            self.received_by_uid = rejected_by.uid
            self.updated_by_uid = rejected_by.uid  # noqa
            rejected = await self.save()
            await streamer.stream(rejected, rejected_by, "rejected", "sample")
            return rejected
        return self

    async def store(self, stored_by):
        statuses = [states.sample.RECEIVED]
        if self.status in statuses:
            self.status = states.sample.STORED
            self.stored_by = stored_by.uid
            self.updated_by_uid = stored_by.uid  # noqa
            stored = await self.save()
            await streamer.stream(stored, stored_by, "stored", "sample")
            return stored
        return self

    async def recover(self):
        statuses = [states.sample.STORED]
        if self.status in statuses:
            self.status = states.sample.RECEIVED
            self.storage_container_uid = None
            self.storage_slot = None
            self.storage_slot_index = None
            self.date_retrieved_from_storage = datetime.now()
            recovered = await self.save()
            return recovered
        return self

    @classmethod
    async def create(cls, obj_in: schemas.SampleCreate) -> schemas.Sample:
        data = cls._import(obj_in)
        sample_type = await SampleType.find(data["sample_type_uid"])
        # data["sample_id"] = (await IdSequence.get_next_number(sample_type.abbr))[1]
        data["sample_id"] = (await IdSequence.get_next_number(prefix="S", generic=True))[1]
        return await super().create(**data)

    async def update(self, obj_in: schemas.SampleUpdate) -> schemas.Sample:
        data = self._import(obj_in)
        return await super().update(**data)

    async def duplicate_unique(self, duplicator) -> schemas.Sample:
        data = self.to_dict(nested=False)
        data["sample_id"] = self.copy_sample_id_unique()
        for key, _ in list(data.items()):
            if key not in self.copy_include_keys():
                del data[key]
        data["status"] = states.sample.RECEIVED
        data["profiles"] = self.profiles
        data["analyses"] = self.analyses
        data["parent_id"] = self.uid
        data["created_by_uid"] = duplicator.uid
        return await super().create(**data)

    async def clone_afresh(self, cloner) -> schemas.Sample:
        data = self.to_dict(nested=False)
        for key, _ in list(data.items()):
            if key not in self.copy_include_keys():
                del data[key]
        data["status"] = states.sample.RECEIVED
        data["profiles"] = self.profiles
        data["analyses"] = self.analyses
        data["parent_id"] = self.uid
        data["created_by_uid"] = cloner.uid
        return await self.create(obj_in=data)
    

# @event.listens_for(Sample, "after_update")
# def stream_sample_verified_models(mapper, connection, target): # noqa
#     logger.log("stream_sample_verified inn")
#     logger.log(target)
#     print("hurray inn")
