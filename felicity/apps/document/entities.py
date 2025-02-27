from sqlalchemy import Column, String, DateTime, ForeignKey, Table, Text, Enum, Float, Boolean, Integer
from sqlalchemy.orm import relationship

from felicity.apps.abstract.entity import BaseEntity
from felicity.apps.document.enum import DocumentState


class DocumentCategory(BaseEntity):
    __tablename__ = 'document_category'

    name = Column(String)


class DocumentTag(BaseEntity):
    __tablename__ = 'document_tag'

    name = Column(String)


document_tagged = Table(
    "document_tagged",
    BaseEntity.metadata,
    Column("document_uid", ForeignKey('document.uid'), primary_key=True),
    Column("document_tag_uid", ForeignKey('document_tag.uid'), primary_key=True),
)

document_author = Table(
    "document_author",
    BaseEntity.metadata,
    Column("document_uid", ForeignKey('document.uid'), primary_key=True),
    Column("user_uid", ForeignKey('user.uid'), primary_key=True),
)

document_reader = Table(
    "document_reader",
    BaseEntity.metadata,
    Column("document_uid", ForeignKey('document.uid'), primary_key=True),
    Column("user_uid", ForeignKey('user.uid'), primary_key=True),
)

document_relation = Table(
    "document_relation",
    BaseEntity.metadata,
    Column("source_document_uid", ForeignKey('document.uid'), primary_key=True),
    Column("target_document_uid", ForeignKey('document.uid'), primary_key=True),
    Column("relation_type", String)  # "references", "supersedes", "complements", etc.
)


class Document(BaseEntity):
    __tablename__ = 'document'

    name = Column(String)
    subtitle = Column(String, nullable=True)
    document_id = Column(String, unique=True)  # Unique identifier for document reference
    folder_uid = Column(String, ForeignKey('document_folder.uid'), nullable=True)
    folder = relationship("DocumentFolder", back_populates="documents")
    tags = relationship(DocumentTag, secondary=document_tagged, backref="documents", lazy="selectin")
    authors = relationship("User", secondary=document_author, lazy="selectin")
    readers = relationship("User", secondary=document_reader, lazy="selectin")
    department_uid = Column(String, ForeignKey('department.uid'), nullable=True)
    department = relationship("Department", lazy="selectin")
    category_uid = Column(String, ForeignKey('document_category.uid'), nullable=True)
    category = relationship(DocumentCategory, lazy="selectin")
    template_uid = Column(String, ForeignKey('document_template.uid'), nullable=True)
    template = relationship("DocumentTemplate")

    # Access tracking
    last_accessed = Column(DateTime, nullable=True)
    last_accessed_by_uid = Column(String, ForeignKey('user.uid'), nullable=True)
    last_accessed_by = relationship("User", foreign_keys=[last_accessed_by_uid])

    # Related documents
    related_to = relationship(
        "Document",
        secondary=document_relation,
        primaryjoin="Document.uid==document_relation.c.source_document_uid",
        secondaryjoin="Document.uid==document_relation.c.target_document_uid",
        backref="related_from"
    )

    @property
    def latest_version(self):
        """Return the latest version of the document sorted by version number."""
        if not self.versions:
            return None
        return sorted(self.versions, key=lambda v: v.version_number, reverse=True)[0]

    @property
    def content(self):
        """Get content from the latest version."""
        version = self.latest_version
        return version.content if version else None

    @property
    def status(self):
        """Return the latest version of the document sorted by version number."""
        if not self.statuses:
            return None
        return sorted(self.statuses, key=lambda v: v.date, reverse=True)[0].status


class DocumentStatus(BaseEntity):
    __tablename__ = 'document_status'

    document_uid = Column(String, ForeignKey('document.uid'))
    document = relationship("Document", backref="statuses")
    status = Column(Enum(DocumentState), default=DocumentState.DRAFT)
    date = Column(DateTime)
    user_uid = Column(String, ForeignKey('user.uid'))
    user = relationship("User", foreign_keys=[user_uid])


class DocumentFolder(BaseEntity):
    __tablename__ = 'document_folder'

    name = Column(String)
    description = Column(String, nullable=True)
    parent_uid = Column(String, ForeignKey('document_folder.uid'), nullable=True)
    parent = relationship("DocumentFolder", remote_side="DocumentFolder.uid", backref="subfolders")
    documents = relationship("Document", back_populates="folder")


class DocumentVersion(BaseEntity):
    __tablename__ = 'document_version'

    document_uid = Column(String, ForeignKey('document.uid'))
    document = relationship("Document", backref="versions")
    version_number = Column(String)  # e.g., "1.0", "1.1", etc.
    content = Column(Text)
    change_summary = Column(String, nullable=True)


class DocumentReviewCycle(BaseEntity):
    __tablename__ = 'document_review_cycle'

    document_uid = Column(String, ForeignKey('document.uid'))
    document = relationship("Document", backref="review_cycles")
    start_date = Column(DateTime)
    end_date = Column(DateTime, nullable=True)
    initiated_by_uid = Column(String, ForeignKey('user.uid'))
    initiated_by = relationship("User", foreign_keys=[initiated_by_uid])
    status = Column(String)  # "in_progress", "completed", "cancelled"


class DocumentReviewStep(BaseEntity):
    __tablename__ = 'document_review_step'

    review_cycle_uid = Column(String, ForeignKey('document_review_cycle.uid'))
    review_cycle = relationship("DocumentReviewCycle", backref="steps")
    reviewer_uid = Column(String, ForeignKey('user.uid'))
    reviewer = relationship("User", foreign_keys=[reviewer_uid])
    sequence = Column(Integer)  # Order of review
    status = Column(String)  # "pending", "approved", "rejected"
    comments = Column(Text, nullable=True)
    action_date = Column(DateTime, nullable=True)


class DocumentTemplate(BaseEntity):
    __tablename__ = 'document_template'

    name = Column(String)
    description = Column(String, nullable=True)
    content = Column(Text)
    category_uid = Column(String, ForeignKey('document_category.uid'), nullable=True)
    category = relationship(DocumentCategory)


class DocumentSubscription(BaseEntity):
    __tablename__ = 'document_subscription'

    document_uid = Column(String, ForeignKey('document.uid'))
    document = relationship("Document", backref="subscriptions")
    user_uid = Column(String, ForeignKey('user.uid'))
    user = relationship("User", foreign_keys=[user_uid])
    subscription_type = Column(String)  # "all_changes", "status_changes", "review_requests"


class DocumentAudit(BaseEntity):
    __tablename__ = 'document_audit'

    document_uid = Column(String, ForeignKey('document.uid'))
    document = relationship("Document", backref="audit_records")
    action = Column(String)  # "viewed", "downloaded", "printed", etc.
    date = Column(DateTime)
    user_uid = Column(String, ForeignKey('user.uid'))
    user = relationship("User", foreign_keys=[user_uid])
    ip_address = Column(String, nullable=True)


# AI Assistant
class DocumentAIModel(BaseEntity):
    __tablename__ = 'document_ai_model'

    name = Column(String)
    description = Column(String, nullable=True)
    api_endpoint = Column(String)
    capabilities = Column(String)  # JSON string of capabilities: ["authoring", "review", "compliance"]
    is_active = Column(Boolean, default=True)


class DocumentAIAuthoringSession(BaseEntity):
    __tablename__ = 'document_ai_authoring_session'

    document_uid = Column(String, ForeignKey('document.uid'))
    document = relationship("Document", backref="ai_authoring_sessions")
    ai_model_uid = Column(String, ForeignKey('document_ai_model.uid'))
    ai_model = relationship("DocumentAIModel")
    prompt = Column(Text)
    conversation = Column(Text)  # JSON string of conversation history


class DocumentComplianceStandard(BaseEntity):
    __tablename__ = 'document_compliance_standard'

    name = Column(String)
    description = Column(String)
    content = Column(Text)  # The full standard or SOP text
    version = Column(String)


class DocumentAIComplianceCheck(BaseEntity):
    __tablename__ = 'document_ai_compliance_check'

    document_uid = Column(String, ForeignKey('document.uid'))
    document = relationship("Document", backref="compliance_checks")
    standard_uid = Column(String, ForeignKey('document_compliance_standard.uid'))
    standard = relationship("DocumentComplianceStandard")
    results = Column(Text)  # JSON string of compliance results
    compliance_score = Column(Float)
    issues = relationship("DocumentComplianceIssue", back_populates="check")


class DocumentComplianceIssue(BaseEntity):
    __tablename__ = 'document_compliance_issue'

    check_uid = Column(String, ForeignKey('document_ai_compliance_check.uid'))
    check = relationship("DocumentAIComplianceCheck", back_populates="issues")
    section = Column(String)  # Section in the document where issue was found
    description = Column(Text)
    severity = Column(String)  # "high", "medium", "low"
    suggestion = Column(Text)


class DocumentAIReviewFeedback(BaseEntity):
    __tablename__ = 'document_ai_review_feedback'

    review_step_uid = Column(String, ForeignKey('document_review_step.uid'))
    review_step = relationship("DocumentReviewStep", backref="ai_feedback")
    ai_model_uid = Column(String, ForeignKey('document_ai_model.uid'))
    ai_model = relationship("DocumentAIModel")
    suggestions = Column(Text)  # AI-generated review feedback


class DocumentAnalytics(BaseEntity):
    __tablename__ = 'document_analytics'

    document_uid = Column(String, ForeignKey('document.uid'))
    document = relationship("Document", backref="analytics")
    readability_score = Column(Float)
    sentiment_score = Column(Float)
    complexity_score = Column(Float)
    summary = Column(Text)
    key_topics = Column(String)  # JSON array of extracted topics
    generated_date = Column(DateTime)
