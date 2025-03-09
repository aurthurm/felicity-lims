from datetime import datetime

from pydantic import ConfigDict

from felicity.apps.common.schemas import BaseAuditModel
from felicity.apps.document.enum import DocumentState


#
# DocumentCategory Schemas
#

# Shared properties
class DocumentCategoryBase(BaseAuditModel):
    name: str | None = None


class DocumentCategoryBaseInDB(DocumentCategoryBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentCategoryCreate(DocumentCategoryBase):
    name: str


# Properties to receive via API on update
class DocumentCategoryUpdate(DocumentCategoryBase):
    pass


# Properties to return via API
class DocumentCategory(DocumentCategoryBaseInDB):
    pass


# Properties stored in DB
class DocumentCategoryInDB(DocumentCategoryBaseInDB):
    pass


#
# DocumentTag Schemas
#

# Shared properties
class DocumentTagBase(BaseAuditModel):
    name: str | None = None


class DocumentTagBaseInDB(DocumentTagBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentTagCreate(DocumentTagBase):
    name: str


# Properties to receive via API on update
class DocumentTagUpdate(DocumentTagBase):
    pass


# Properties to return via API
class DocumentTag(DocumentTagBaseInDB):
    pass


# Properties stored in DB
class DocumentTagInDB(DocumentTagBaseInDB):
    pass


#
# Document Schemas
#

# Shared properties
class DocumentBase(BaseAuditModel):
    name: str | None = None
    subtitle: str | None = None
    document_id: str | None = None
    folder_uid: str | None = None
    department_uid: str | None = None
    category_uid: str | None = None
    template_uid: str | None = None
    last_accessed: datetime | None = None
    last_accessed_by_uid: str | None = None


class DocumentBaseInDB(DocumentBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentCreate(DocumentBase):
    name: str
    document_id: str


# Properties to receive via API on update
class DocumentUpdate(DocumentBase):
    pass


# Properties to return via API
class Document(DocumentBaseInDB):
    pass


# Properties stored in DB
class DocumentInDB(DocumentBaseInDB):
    pass


#
# DocumentStatus Schemas
#

# Shared properties
class DocumentStatusBase(BaseAuditModel):
    document_uid: str | None = None
    status: DocumentState | None = DocumentState.DRAFT
    date: datetime | None = None
    user_uid: str | None = None


class DocumentStatusBaseInDB(DocumentStatusBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentStatusCreate(DocumentStatusBase):
    document_uid: str
    status: DocumentState
    date: datetime
    user_uid: str


# Properties to receive via API on update
class DocumentStatusUpdate(DocumentStatusBase):
    pass


# Properties to return via API
class DocumentStatus(DocumentStatusBaseInDB):
    pass


# Properties stored in DB
class DocumentStatusInDB(DocumentStatusBaseInDB):
    pass


#
# DocumentFolder Schemas
#

# Shared properties
class DocumentFolderBase(BaseAuditModel):
    name: str | None = None
    description: str | None = None
    parent_uid: str | None = None


class DocumentFolderBaseInDB(DocumentFolderBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentFolderCreate(DocumentFolderBase):
    name: str


# Properties to receive via API on update
class DocumentFolderUpdate(DocumentFolderBase):
    pass


# Properties to return via API
class DocumentFolder(DocumentFolderBaseInDB):
    pass


# Properties stored in DB
class DocumentFolderInDB(DocumentFolderBaseInDB):
    pass


#
# DocumentVersion Schemas
#

# Shared properties
class DocumentVersionBase(BaseAuditModel):
    document_uid: str | None = None
    version_number: str | None = None
    content: str | None = None
    change_summary: str | None = None


class DocumentVersionBaseInDB(DocumentVersionBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentVersionCreate(DocumentVersionBase):
    document_uid: str
    version_number: str
    content: str


# Properties to receive via API on update
class DocumentVersionUpdate(DocumentVersionBase):
    thumbnail: str | None = None


# Properties to return via API
class DocumentVersion(DocumentVersionBaseInDB):
    pass


# Properties stored in DB
class DocumentVersionInDB(DocumentVersionBaseInDB):
    pass


#
# DocumentReviewCycle Schemas
#

# Shared properties
class DocumentReviewCycleBase(BaseAuditModel):
    document_uid: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    initiated_by_uid: str | None = None
    status: str | None = None


class DocumentReviewCycleBaseInDB(DocumentReviewCycleBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentReviewCycleCreate(DocumentReviewCycleBase):
    document_uid: str
    start_date: datetime
    initiated_by_uid: str
    status: str


# Properties to receive via API on update
class DocumentReviewCycleUpdate(DocumentReviewCycleBase):
    pass


# Properties to return via API
class DocumentReviewCycle(DocumentReviewCycleBaseInDB):
    pass


# Properties stored in DB
class DocumentReviewCycleInDB(DocumentReviewCycleBaseInDB):
    pass


#
# DocumentReviewStep Schemas
#

# Shared properties
class DocumentReviewStepBase(BaseAuditModel):
    review_cycle_uid: str | None = None
    reviewer_uid: str | None = None
    sequence: int | None = None
    status: str | None = None
    comments: str | None = None
    action_date: datetime | None = None


class DocumentReviewStepBaseInDB(DocumentReviewStepBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentReviewStepCreate(DocumentReviewStepBase):
    review_cycle_uid: str
    reviewer_uid: str
    sequence: int
    status: str


# Properties to receive via API on update
class DocumentReviewStepUpdate(DocumentReviewStepBase):
    pass


# Properties to return via API
class DocumentReviewStep(DocumentReviewStepBaseInDB):
    pass


# Properties stored in DB
class DocumentReviewStepInDB(DocumentReviewStepBaseInDB):
    pass


#
# DocumentTemplate Schemas
#

# Shared properties
class DocumentTemplateBase(BaseAuditModel):
    name: str | None = None
    description: str | None = None
    content: str | None = None
    category_uid: str | None = None


class DocumentTemplateBaseInDB(DocumentTemplateBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentTemplateCreate(DocumentTemplateBase):
    name: str
    content: str


# Properties to receive via API on update
class DocumentTemplateUpdate(DocumentTemplateBase):
    pass


# Properties to return via API
class DocumentTemplate(DocumentTemplateBaseInDB):
    pass


# Properties stored in DB
class DocumentTemplateInDB(DocumentTemplateBaseInDB):
    pass


#
# DocumentSubscription Schemas
#

# Shared properties
class DocumentSubscriptionBase(BaseAuditModel):
    document_uid: str | None = None
    user_uid: str | None = None
    subscription_type: str | None = None


class DocumentSubscriptionBaseInDB(DocumentSubscriptionBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentSubscriptionCreate(DocumentSubscriptionBase):
    document_uid: str
    user_uid: str
    subscription_type: str


# Properties to receive via API on update
class DocumentSubscriptionUpdate(DocumentSubscriptionBase):
    pass


# Properties to return via API
class DocumentSubscription(DocumentSubscriptionBaseInDB):
    pass


# Properties stored in DB
class DocumentSubscriptionInDB(DocumentSubscriptionBaseInDB):
    pass


#
# DocumentAudit Schemas
#

# Shared properties
class DocumentAuditBase(BaseAuditModel):
    document_uid: str | None = None
    action: str | None = None
    date: datetime | None = None
    user_uid: str | None = None
    ip_address: str | None = None


class DocumentAuditBaseInDB(DocumentAuditBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentAuditCreate(DocumentAuditBase):
    document_uid: str
    action: str
    date: datetime
    user_uid: str


# Properties to receive via API on update
class DocumentAuditUpdate(DocumentAuditBase):
    pass


# Properties to return via API
class DocumentAudit(DocumentAuditBaseInDB):
    pass


# Properties stored in DB
class DocumentAuditInDB(DocumentAuditBaseInDB):
    pass


#
# DocumentAIModel Schemas
#

# Shared properties
class DocumentAIModelBase(BaseAuditModel):
    name: str | None = None
    description: str | None = None
    api_endpoint: str | None = None
    capabilities: str | None = None
    is_active: bool | None = True


class DocumentAIModelBaseInDB(DocumentAIModelBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentAIModelCreate(DocumentAIModelBase):
    name: str
    api_endpoint: str
    capabilities: str


# Properties to receive via API on update
class DocumentAIModelUpdate(DocumentAIModelBase):
    pass


# Properties to return via API
class DocumentAIModel(DocumentAIModelBaseInDB):
    pass


# Properties stored in DB
class DocumentAIModelInDB(DocumentAIModelBaseInDB):
    pass


#
# DocumentAIAuthoringSession Schemas
#

# Shared properties
class DocumentAIAuthoringSessionBase(BaseAuditModel):
    document_uid: str | None = None
    ai_model_uid: str | None = None
    prompt: str | None = None
    conversation: str | None = None


class DocumentAIAuthoringSessionBaseInDB(DocumentAIAuthoringSessionBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentAIAuthoringSessionCreate(DocumentAIAuthoringSessionBase):
    document_uid: str
    ai_model_uid: str
    prompt: str


# Properties to receive via API on update
class DocumentAIAuthoringSessionUpdate(DocumentAIAuthoringSessionBase):
    pass


# Properties to return via API
class DocumentAIAuthoringSession(DocumentAIAuthoringSessionBaseInDB):
    pass


# Properties stored in DB
class DocumentAIAuthoringSessionInDB(DocumentAIAuthoringSessionBaseInDB):
    pass


#
# DocumentComplianceStandard Schemas
#

# Shared properties
class DocumentComplianceStandardBase(BaseAuditModel):
    name: str | None = None
    description: str | None = None
    content: str | None = None
    version: str | None = None


class DocumentComplianceStandardBaseInDB(DocumentComplianceStandardBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentComplianceStandardCreate(DocumentComplianceStandardBase):
    name: str
    content: str
    version: str


# Properties to receive via API on update
class DocumentComplianceStandardUpdate(DocumentComplianceStandardBase):
    pass


# Properties to return via API
class DocumentComplianceStandard(DocumentComplianceStandardBaseInDB):
    pass


# Properties stored in DB
class DocumentComplianceStandardInDB(DocumentComplianceStandardBaseInDB):
    pass


#
# DocumentAIComplianceCheck Schemas
#

# Shared properties
class DocumentAIComplianceCheckBase(BaseAuditModel):
    document_uid: str | None = None
    standard_uid: str | None = None
    results: str | None = None
    compliance_score: float | None = None


class DocumentAIComplianceCheckBaseInDB(DocumentAIComplianceCheckBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentAIComplianceCheckCreate(DocumentAIComplianceCheckBase):
    document_uid: str
    standard_uid: str


# Properties to receive via API on update
class DocumentAIComplianceCheckUpdate(DocumentAIComplianceCheckBase):
    pass


# Properties to return via API
class DocumentAIComplianceCheck(DocumentAIComplianceCheckBaseInDB):
    pass


# Properties stored in DB
class DocumentAIComplianceCheckInDB(DocumentAIComplianceCheckBaseInDB):
    pass


#
# DocumentComplianceIssue Schemas
#

# Shared properties
class DocumentComplianceIssueBase(BaseAuditModel):
    check_uid: str | None = None
    section: str | None = None
    description: str | None = None
    severity: str | None = None
    suggestion: str | None = None


class DocumentComplianceIssueBaseInDB(DocumentComplianceIssueBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentComplianceIssueCreate(DocumentComplianceIssueBase):
    check_uid: str
    description: str
    severity: str


# Properties to receive via API on update
class DocumentComplianceIssueUpdate(DocumentComplianceIssueBase):
    pass


# Properties to return via API
class DocumentComplianceIssue(DocumentComplianceIssueBaseInDB):
    pass


# Properties stored in DB
class DocumentComplianceIssueInDB(DocumentComplianceIssueBaseInDB):
    pass


#
# DocumentAIReviewFeedback Schemas
#

# Shared properties
class DocumentAIReviewFeedbackBase(BaseAuditModel):
    review_step_uid: str | None = None
    ai_model_uid: str | None = None
    suggestions: str | None = None


class DocumentAIReviewFeedbackBaseInDB(DocumentAIReviewFeedbackBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentAIReviewFeedbackCreate(DocumentAIReviewFeedbackBase):
    review_step_uid: str
    ai_model_uid: str
    suggestions: str


# Properties to receive via API on update
class DocumentAIReviewFeedbackUpdate(DocumentAIReviewFeedbackBase):
    pass


# Properties to return via API
class DocumentAIReviewFeedback(DocumentAIReviewFeedbackBaseInDB):
    pass


# Properties stored in DB
class DocumentAIReviewFeedbackInDB(DocumentAIReviewFeedbackBaseInDB):
    pass


#
# DocumentAnalytics Schemas
#

# Shared properties
class DocumentAnalyticsBase(BaseAuditModel):
    document_uid: str | None = None
    readability_score: float | None = None
    sentiment_score: float | None = None
    complexity_score: float | None = None
    summary: str | None = None
    key_topics: str | None = None
    generated_date: datetime | None = None


class DocumentAnalyticsBaseInDB(DocumentAnalyticsBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DocumentAnalyticsCreate(DocumentAnalyticsBase):
    document_uid: str
    generated_date: datetime


# Properties to receive via API on update
class DocumentAnalyticsUpdate(DocumentAnalyticsBase):
    pass


# Properties to return via API
class DocumentAnalytics(DocumentAnalyticsBaseInDB):
    pass


# Properties stored in DB
class DocumentAnalyticsInDB(DocumentAnalyticsBaseInDB):
    pass
