import logging

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Table, Text, UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity, BaseMPTT, BaseEntity
from felicity.apps.analysis.entities.qc import QCLevel, QCSet
from felicity.apps.analysis.enum import ResultType
from felicity.apps.client import entities as ct_entities
from felicity.apps.patient import entities as pt_entities
from felicity.apps.user.entities import User
from felicity.utils.hipaa_fields import EncryptedPHI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CodingStandard(BaseEntity):
    """conding standars e.g LOINC"""

    __tablename__ = "coding_standard"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


class SampleType(BaseEntity):
    """SampleType"""

    __tablename__ = "sample_type"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    active = Column(Boolean(), default=False)
    internal_use = Column(Boolean(), default=False)  # e.g QC Sample
    abbr = Column(String, nullable=False)


class SampleTypeCoding(BaseEntity):
    """SampleTypeCoding"""

    __tablename__ = "sampe_type_coding"

    sample_type_uid = Column(String, ForeignKey("sample_type.uid"), nullable=False)
    sample_type = relationship("SampleType", lazy="selectin")
    coding_standard_uid = Column(
        String, ForeignKey("coding_standard.uid"), nullable=True
    )
    coding_standard = relationship("CodingStandard", lazy="selectin")
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    code = Column(String, nullable=False)


"""
 Many to Many Link between SampleType and Profile
"""
profile_sample_type = Table(
    "profile_sample_type",
    BaseEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("sample_type_uid", ForeignKey("sample_type.uid"), primary_key=True),
    Column("profile_uid", ForeignKey("profile.uid"), primary_key=True),
)

"""
Many to Many Link between Analysis and SampleType
"""
analysis_sample_type = Table(
    "analysis_sample_type",
    BaseEntity.metadata,
    Column("sample_type_uid", ForeignKey("sample_type.uid"), primary_key=True),
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
)

"""
 Many to Many Link between Analysis and Profile
    Offers multi-profiles flexibility per analysis
    A rare scenario worth supporting :)
"""
analysis_profile = Table(
    "analysis_profile",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("profile_uid", ForeignKey("profile.uid"), primary_key=True),
)


class AnalysisCategory(BaseEntity):
    """Categorise Analysis"""

    __tablename__ = "analysis_category"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    department_uid = Column(String, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    active = Column(Boolean(), default=False)


class Profile(LabScopedEntity):
    """Grouped Analysis e.g FBC, U&E's, MCS ..."""

    __tablename__ = "profile"

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
    department_uid = Column(String, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")


class ProfileCoding(LabScopedEntity):
    """ProfileCoding"""

    __tablename__ = "profile_coding"

    profile_uid = Column(String, ForeignKey("profile.uid"), nullable=True)
    profile = relationship("Profile", lazy="selectin")
    coding_standard_uid = Column(
        String, ForeignKey("coding_standard.uid"), nullable=True
    )
    coding_standard = relationship("CodingStandard", lazy="selectin")
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    code = Column(String, nullable=False)


"""
 Many to Many Link between Analyses and Analysis_Template
"""
analysis_analysis_template = Table(
    "analysis_analysis_template",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column(
        "analysis_template_uid", ForeignKey("analysis_template.uid"), primary_key=True
    ),
)


class AnalysisTemplate(LabScopedEntity):
    """Template for adding Analysis extras"""

    __tablename__ = "analysis_template"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    analyses = relationship(
        "Analysis",
        secondary=analysis_analysis_template,
        lazy="selectin",
    )
    department_uid = Column(String, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")


"""
 Many to Many Link between Analyses and Method
"""
analysis_method = Table(
    "analysis_method",
    BaseEntity.metadata,
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("method_uid", ForeignKey("method.uid"), primary_key=True),
)

"""
 Many to Many Link between Analyses and Instruments
"""
analysis_instrument = Table(
    "analysis_instrument",
    BaseEntity.metadata,
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
    Column("instrument_uid", ForeignKey("instrument.uid"), primary_key=True),
)


class Analysis(BaseEntity):
    """Analysis Test/Service"""

    __tablename__ = "analysis"

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
        lazy="selectin",
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
    interims = relationship("AnalysisInterim", backref="analysis", lazy="selectin")
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
    result_options = relationship("ResultOption", backref="analyses", lazy="selectin")
    # result_type : numeric, short-text, long-text (long text are a special requiring special handling)
    result_type = Column(String, default=ResultType.SHORT_TEXT, nullable=False)
    category_uid = Column(String, ForeignKey("analysis_category.uid"))
    category = relationship(AnalysisCategory, backref="analyses", lazy="selectin")
    tat_length_minutes = Column(Integer, default=60 * 24)  # default 1 day
    sort_key = Column(Integer, default=1)
    internal_use = Column(Boolean(), default=False)  # e.g QC Services
    department_uid = Column(String, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    # precision -> decimal places to report
    precision = Column(Integer, nullable=True)
    required_verifications = Column(Integer, default=1)
    self_verification = Column(Boolean(), default=False)
    hidden = Column(Boolean(), default=False)
    active = Column(Boolean(), default=False)

    @property
    def sms_metadata(self) -> dict:
        result = {
            "analysis_keyword": self.keyword,
            "analysis_name": self.name,
        }

        if self.unit and hasattr(self.unit, 'name'):
            try:
                result.update({"unit": self.unit.name})
            except Exception:
                pass

        return result


class AnalysisCoding(BaseEntity):
    """AnalysisCoding"""

    __tablename__ = "analysis_coding"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=True)
    analysis = relationship("Analysis", lazy="selectin")
    coding_standard_uid = Column(
        String, ForeignKey("coding_standard.uid"), nullable=True
    )
    coding_standard = relationship("CodingStandard", lazy="selectin")
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    code = Column(String, nullable=False)


class AnalysisInterim(BaseEntity):
    """Analysis Interim Result Field"""

    __tablename__ = "analysis_interim"

    key = Column(Integer, nullable=False)
    value = Column(String, nullable=False)
    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=True)
    instrument_uid = Column(String, ForeignKey("instrument.uid"), nullable=True)
    instrument = relationship("Instrument")


class AnalysisCorrectionFactor(BaseEntity):
    """Analysis Correction Factor"""

    __tablename__ = "analysis_correction_factor"

    factor = Column(Float, nullable=False)
    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=True)
    instrument_uid = Column(String, ForeignKey("instrument.uid"), nullable=True)
    method_uid = Column(String, ForeignKey("method.uid"), nullable=True)


class AnalysisDetectionLimit(BaseEntity):
    """Analysis Detection Limit"""

    __tablename__ = "analysis_detection_limit"

    lower_limit = Column(Float, nullable=False)
    upper_limit = Column(Float, nullable=False)
    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=True)
    instrument_uid = Column(String, ForeignKey("instrument.uid"), nullable=True)
    method_uid = Column(String, ForeignKey("method.uid"), nullable=True)


class AnalysisUncertainty(LabScopedEntity):
    """Analysis Measurement Uncertainty
    If value is within the range min.max then result becomes a range (result +/- value)
    """

    __tablename__ = "analysis_uncertainty"

    min = Column(Float, nullable=False)
    max = Column(Float, nullable=False)
    value = Column(Float, nullable=False)
    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=True)
    instrument_uid = Column(String, ForeignKey("instrument.uid"), nullable=True)
    method_uid = Column(String, ForeignKey("method.uid"), nullable=True)


class AnalysisSpecification(BaseEntity):
    """Analysis Specification Ranges"""

    __tablename__ = "analysis_specification"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=True)
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
    # Textual expected Normal Range a.k.a Expected Value
    normal_value = Column(String, nullable=True)
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


"""
 Many to Many Link between Analyses and Intruments
"""
result_option_sample_type = Table(
    "result_option_sample_type",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("result_option_uid", ForeignKey("result_options.uid"), primary_key=True),
    Column("sample_type_uid", ForeignKey("sample_type.uid"), primary_key=True),
)


class ResultOption(BaseEntity):
    """Result Choices"""

    __tablename__ = "result_options"

    option_key = Column(Integer, nullable=False)
    value = Column(String, nullable=False)
    analysis_uid = Column(String, ForeignKey("analysis.uid"))
    sample_types = relationship(
        SampleType, secondary=result_option_sample_type, lazy="selectin"
    )


class AnalysisRequest(LabScopedEntity):
    """AnalysisRequest a.k.a Laboratory Request"""

    __tablename__ = "analysis_request"

    patient_uid = Column(String, ForeignKey("patient.uid"))
    patient = relationship(
        pt_entities.Patient, backref="analysis_requests", lazy="selectin"
    )
    client_uid = Column(String, ForeignKey("client.uid"))
    client = relationship(
        ct_entities.Client, backref="analysis_requests", lazy="selectin"
    )
    client_contact_uid = Column(String, ForeignKey("client_contact.uid"))
    client_contact = relationship(
        ct_entities.ClientContact, backref="analysis_requests", lazy="selectin"
    )
    samples = relationship("Sample", back_populates="analysis_request", lazy="selectin")
    request_id = Column(String, index=True, unique=True, nullable=True)
    client_request_id = Column(String, unique=True, nullable=False)
    internal_use = Column(Boolean(), default=False)  # e.g Test Requests
    # Metadata snapshot
    metadata_snapshot = Column(JSONB, nullable=False)

    clinical_data = relationship(
        "ClinicalData",
        uselist=False,  # ensure one-to-one
        back_populates="analysis_request",
        cascade="all, delete-orphan",
        lazy="selectin"
    )

    @property
    def sms_metadata(self) -> dict:
        result = {
            "request_id": self.request_id,
            "client_request_id": self.client_request_id,
        }


class ClinicalData(LabScopedEntity):
    __tablename__ = "clinical_data"

    analysis_request_uid = Column(String, ForeignKey("analysis_request.uid"), nullable=False, unique=True)
    analysis_request = relationship("AnalysisRequest", back_populates="clinical_data", lazy="selectin")
    symptoms = Column(ARRAY(String), nullable=True)  # e,g Fever, Cough - keep unencrypted for analytics
    # HIPAA: Encrypt detailed clinical information that could identify patients
    symptoms_raw = Column(EncryptedPHI(2000), nullable=True)
    clinical_indication = Column(EncryptedPHI(2000), nullable=True)  # reason for the lab test
    pregnancy_status = Column(Boolean, nullable=True)  # Boolean is not identifiable
    breast_feeding = Column(Boolean, nullable=True)  # Boolean is not identifiable
    vitals = Column(EncryptedPHI(1000), nullable=True)  # e.g., {"bp": "120/80", "temp": 37.2}
    treatment_notes = Column(EncryptedPHI(2000), nullable=True)
    other_context = Column(EncryptedPHI(2000), nullable=True)  # for any extra structured fields
    codings = relationship(
        "ClinicalDataCoding",
        back_populates="clinical_data",
        cascade="all, delete-orphan",
        lazy="selectin"
    )


class ClinicalDataCoding(LabScopedEntity):
    __tablename__ = "clinical_data_coding"
    __table_args__ = (  # prevent multiple codes from the same coding standard
        UniqueConstraint("clinical_data_uid", "coding_standard_uid"),
    )

    clinical_data_uid = Column(
        String, ForeignKey("clinical_data.uid"), nullable=False
    )
    clinical_data = relationship("ClinicalData", back_populates="codings", lazy="selectin")

    coding_standard_uid = Column(
        String, ForeignKey("coding_standard.uid"), nullable=False
    )
    coding_standard = relationship("CodingStandard", lazy="selectin")

    code = Column(String, nullable=False)  # e.g. "A09"
    name = Column(String, nullable=True)  # Optional: "Infectious gastroenteritis"
    description = Column(Text, nullable=True)


"""
Many to Many Link between Sample and Profile
"""
sample_profile = Table(
    "sample_profile",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("sample_uid", ForeignKey("sample.uid"), primary_key=True),
    Column("profile_uid", ForeignKey("profile.uid"), primary_key=True),
)

"""
Many to Many Link between Sample and Analysis
"""
sample_analysis = Table(
    "sample_analysis",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("sample_uid", ForeignKey("sample.uid"), primary_key=True),
    Column("analysis_uid", ForeignKey("analysis.uid"), primary_key=True),
)

"""
Many to Many Link between Sample and Rejection Reason
"""
sample_rejection_reason = Table(
    "sample_rejection_reason",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("sample_uid", ForeignKey("sample.uid"), primary_key=True),
    Column(
        "rejection_reason_uid", ForeignKey("rejection_reason.uid"), primary_key=True
    ),
)


class RejectionReason(BaseEntity):
    """Rejection Reason"""

    __tablename__ = "rejection_reason"

    reason = Column(String, nullable=False)


class Sample(LabScopedEntity, BaseMPTT):
    """Sample"""

    __tablename__ = "sample"

    analysis_request_uid = Column(
        String, ForeignKey("analysis_request.uid"), nullable=True
    )
    analysis_request = relationship(
        "AnalysisRequest", back_populates="samples", lazy="selectin"
    )
    sample_type_uid = Column(String, ForeignKey("sample_type.uid"), nullable=False)
    sample_type = relationship("SampleType", backref="samples", lazy="selectin")
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
    received_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    received_by = relationship(User, foreign_keys=[received_by_uid], lazy="selectin")
    date_received = Column(DateTime, nullable=True)
    submitted_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    submitted_by = relationship(User, foreign_keys=[submitted_by_uid], lazy="selectin")
    date_submitted = Column(DateTime, nullable=True)
    verified_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    verified_by = relationship(User, foreign_keys=[verified_by_uid], lazy="selectin")
    date_verified = Column(DateTime, nullable=True)
    published_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    published_by = relationship(User, foreign_keys=[published_by_uid], lazy="selectin")
    date_published = Column(DateTime, nullable=True)
    printed = Column(Boolean(), default=False)
    printed_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    printed_by = relationship(User, foreign_keys=[printed_by_uid], lazy="selectin")
    date_printed = Column(DateTime, nullable=True)
    invalidated_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    invalidated_by = relationship(
        User, foreign_keys=[invalidated_by_uid], lazy="selectin"
    )
    date_invalidated = Column(DateTime, nullable=True)
    cancelled_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
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
    qc_set_uid = Column(String, ForeignKey("qc_set.uid"), nullable=True)
    qc_set = relationship(QCSet, back_populates="samples", lazy="selectin")
    qc_level_uid = Column(String, ForeignKey("qc_level.uid"), nullable=True)
    qc_level = relationship(QCLevel, backref="qc_samples", lazy="selectin")
    # storage -> bio bank
    stored_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    stored_by = relationship("User", foreign_keys=[stored_by_uid], lazy="selectin")
    date_stored = Column(DateTime, nullable=True)
    date_retrieved_from_storage = Column(DateTime, nullable=True)
    storage_container_uid = Column(
        String, ForeignKey("storage_container.uid"), nullable=True
    )
    storage_container = relationship(
        "StorageContainer", back_populates="samples", lazy="selectin"
    )
    storage_slot = Column(String, nullable=True)
    storage_slot_index = Column(Integer, nullable=True)
    # Metadata snapshot
    metadata_snapshot = Column(JSONB, nullable=False)

    @property
    def sms_metadata(self) -> dict:
        result = {
            "sample_id": self.sample_id,
            "date_collected": self.date_collected
        }

        if self.analysis_request and hasattr(self.analysis_request, 'sms_metadata'):
            try:
                ar_metadata = self.analysis_request.sms_metadata
                if ar_metadata:
                    result.update(ar_metadata)
            except Exception:
                pass

        return result
