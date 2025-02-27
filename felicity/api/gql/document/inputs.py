from datetime import datetime
from typing import Optional, List

import strawberry


# Document Category Inputs
@strawberry.input
class DocumentCategoryInputType:
    name: str = strawberry.field(description="Category name")


@strawberry.input
class DocumentCategoryUpdateInputType(DocumentCategoryInputType):
    uid: str
    name: Optional[str] = strawberry.field(description="Category name", default=None)


# Document Tag Inputs
@strawberry.input
class DocumentTagInputType:
    name: str = strawberry.field(description="Tag name")


@strawberry.input
class DocumentTagUpdateInputType(DocumentTagInputType):
    uid: str
    name: Optional[str] = strawberry.field(description="Tag name", default=None)


# Document Folder Inputs
@strawberry.input
class DocumentFolderInputType:
    name: str = strawberry.field(description="Folder name")
    description: Optional[str] = strawberry.field(description="Folder description", default=None)
    parent: Optional[str] = strawberry.field(description="Parent folder UID", default=None)


@strawberry.input
class DocumentFolderUpdateInputType(DocumentFolderInputType):
    uid: str
    name: Optional[str] = strawberry.field(description="Folder name", default=None)


# Document Template Inputs
@strawberry.input
class DocumentTemplateInputType:
    name: str = strawberry.field(description="Template name")
    description: Optional[str] = strawberry.field(description="Template description", default=None)
    content: str = strawberry.field(description="Template content")
    category: Optional[str] = strawberry.field(description="Category UID", default=None)


@strawberry.input
class DocumentTemplateUpdateInputType(DocumentTemplateInputType):
    uid: str
    name: Optional[str] = strawberry.field(description="Template name", default=None)
    content: Optional[str] = strawberry.field(description="Template content", default=None)


# Document Version Inputs
@strawberry.input
class DocumentVersionInputType:
    document: str = strawberry.field(description="Document UID")
    version_number: str = strawberry.field(description="Version number")
    content: str = strawberry.field(description="Document content")
    change_summary: Optional[str] = strawberry.field(description="Change summary", default=None)


@strawberry.input
class DocumentVersionUpdateInputType(DocumentVersionInputType):
    uid: str
    document: Optional[str] = strawberry.field(description="Document UID", default=None)
    version_number: Optional[str] = strawberry.field(description="Version number", default=None)
    content: Optional[str] = strawberry.field(description="Document content", default=None)


# Document Status Inputs
@strawberry.input
class DocumentStatusInputType:
    document: str = strawberry.field(description="Document UID")
    status: str = strawberry.field(description="Document status")
    date: Optional[datetime] = strawberry.field(description="Status date", default=None)


@strawberry.input
class DocumentStatusUpdateInputType(DocumentStatusInputType):
    uid: str
    document: Optional[str] = strawberry.field(description="Document UID", default=None)
    status: Optional[str] = strawberry.field(description="Document status", default=None)


# Document Review Step Inputs
@strawberry.input
class DocumentReviewStepInputType:
    review_cycle: str = strawberry.field(description="Review cycle UID")
    reviewer: str = strawberry.field(description="Reviewer UID")
    sequence: int = strawberry.field(description="Review sequence")
    status: str = strawberry.field(description="Review status")
    comments: Optional[str] = strawberry.field(description="Review comments", default=None)
    action_date: Optional[datetime] = strawberry.field(description="Action date", default=None)


@strawberry.input
class DocumentReviewStepUpdateInputType(DocumentReviewStepInputType):
    uid: str
    review_cycle: Optional[str] = strawberry.field(description="Review cycle UID", default=None)
    reviewer: Optional[str] = strawberry.field(description="Reviewer UID", default=None)
    sequence: Optional[int] = strawberry.field(description="Review sequence", default=None)
    status: Optional[str] = strawberry.field(description="Review status", default=None)


# Document Review Cycle Inputs
@strawberry.input
class DocumentReviewCycleInputType:
    document: str = strawberry.field(description="Document UID")
    start_date: datetime = strawberry.field(description="Start date")
    end_date: Optional[datetime] = strawberry.field(description="End date", default=None)
    status: str = strawberry.field(description="Review cycle status")
    reviewers: Optional[List[str]] = strawberry.field(description="Reviewers UIDs", default_factory=list)


@strawberry.input
class DocumentReviewCycleUpdateInputType(DocumentReviewCycleInputType):
    uid: str
    document: Optional[str] = strawberry.field(description="Document UID", default=None)
    start_date: Optional[datetime] = strawberry.field(description="Start date", default=None)
    status: Optional[str] = strawberry.field(description="Review cycle status", default=None)


# Document Subscription Inputs
@strawberry.input
class DocumentSubscriptionInputType:
    document: str = strawberry.field(description="Document UID")
    user: str = strawberry.field(description="User UID")
    subscription_type: str = strawberry.field(description="Subscription type")


@strawberry.input
class DocumentSubscriptionUpdateInputType(DocumentSubscriptionInputType):
    uid: str
    document: Optional[str] = strawberry.field(description="Document UID", default=None)
    user: Optional[str] = strawberry.field(description="User UID", default=None)
    subscription_type: Optional[str] = strawberry.field(description="Subscription type", default=None)


# Document Audit Inputs
@strawberry.input
class DocumentAuditInputType:
    document: str = strawberry.field(description="Document UID")
    action: str = strawberry.field(description="Audit action")
    date: Optional[datetime] = strawberry.field(description="Action date", default=None)
    ip_address: Optional[str] = strawberry.field(description="IP address", default=None)


@strawberry.input
class DocumentAuditUpdateInputType(DocumentAuditInputType):
    uid: str
    document: Optional[str] = strawberry.field(description="Document UID", default=None)
    action: Optional[str] = strawberry.field(description="Audit action", default=None)


# AI Model Inputs
@strawberry.input
class DocumentAIModelInputType:
    name: str = strawberry.field(description="Model name")
    description: Optional[str] = strawberry.field(description="Model description", default=None)
    api_endpoint: str = strawberry.field(description="API endpoint")
    capabilities: str = strawberry.field(description="Model capabilities")
    is_active: Optional[bool] = strawberry.field(description="Is active", default=True)


@strawberry.input
class DocumentAIModelUpdateInputType(DocumentAIModelInputType):
    uid: str
    name: Optional[str] = strawberry.field(description="Model name", default=None)
    api_endpoint: Optional[str] = strawberry.field(description="API endpoint", default=None)
    capabilities: Optional[str] = strawberry.field(description="Model capabilities", default=None)


# AI Authoring Session Inputs
@strawberry.input
class DocumentAIAuthoringSessionInputType:
    document: str = strawberry.field(description="Document UID")
    model: str = strawberry.field(description="AI Model UID")
    prompt: str = strawberry.field(description="Prompt")
    conversation: str = strawberry.field(description="Conversation")


@strawberry.input
class DocumentAIAuthoringSessionUpdateInputType(DocumentAIAuthoringSessionInputType):
    uid: str
    document: Optional[str] = strawberry.field(description="Document UID", default=None)
    model: Optional[str] = strawberry.field(description="AI Model UID", default=None)
    prompt: Optional[str] = strawberry.field(description="Prompt", default=None)
    conversation: Optional[str] = strawberry.field(description="Conversation", default=None)


# Compliance Standard Inputs
@strawberry.input
class DocumentComplianceStandardInputType:
    name: str = strawberry.field(description="Standard name")
    description: str = strawberry.field(description="Standard description")
    content: str = strawberry.field(description="Standard content")
    version: str = strawberry.field(description="Standard version")


@strawberry.input
class DocumentComplianceStandardUpdateInputType(DocumentComplianceStandardInputType):
    uid: str
    name: Optional[str] = strawberry.field(description="Standard name", default=None)
    description: Optional[str] = strawberry.field(description="Standard description", default=None)
    content: Optional[str] = strawberry.field(description="Standard content", default=None)
    version: Optional[str] = strawberry.field(description="Standard version", default=None)


# Compliance Issue Inputs
@strawberry.input
class DocumentComplianceIssueInputType:
    check: str = strawberry.field(description="Compliance check UID")
    section: str = strawberry.field(description="Document section")
    description: str = strawberry.field(description="Issue description")
    severity: str = strawberry.field(description="Issue severity")
    suggestion: str = strawberry.field(description="Suggestion")


@strawberry.input
class DocumentComplianceIssueUpdateInputType(DocumentComplianceIssueInputType):
    uid: str
    check: Optional[str] = strawberry.field(description="Compliance check UID", default=None)
    section: Optional[str] = strawberry.field(description="Document section", default=None)
    description: Optional[str] = strawberry.field(description="Issue description", default=None)
    severity: Optional[str] = strawberry.field(description="Issue severity", default=None)
    suggestion: Optional[str] = strawberry.field(description="Suggestion", default=None)


# AI Compliance Check Inputs
@strawberry.input
class DocumentAIComplianceCheckInputType:
    document: str = strawberry.field(description="Document UID")
    standard: str = strawberry.field(description="Compliance standard UID")
    results: str = strawberry.field(description="Check results")
    compliance_score: float = strawberry.field(description="Compliance score")
    issues: Optional[List[DocumentComplianceIssueInputType]] = strawberry.field(
        description="Compliance issues", default_factory=list
    )


@strawberry.input
class DocumentAIComplianceCheckUpdateInputType:
    uid: str
    document: Optional[str] = strawberry.field(description="Document UID", default=None)
    standard: Optional[str] = strawberry.field(description="Compliance standard UID", default=None)
    results: Optional[str] = strawberry.field(description="Check results", default=None)
    compliance_score: Optional[float] = strawberry.field(description="Compliance score", default=None)


# AI Review Feedback Inputs
@strawberry.input
class DocumentAIReviewFeedbackInputType:
    review_step: str = strawberry.field(description="Review step UID")
    model: str = strawberry.field(description="AI Model UID")
    suggestions: str = strawberry.field(description="AI suggestions")


@strawberry.input
class DocumentAIReviewFeedbackUpdateInputType(DocumentAIReviewFeedbackInputType):
    uid: str
    review_step: Optional[str] = strawberry.field(description="Review step UID", default=None)
    model: Optional[str] = strawberry.field(description="AI Model UID", default=None)
    suggestions: Optional[str] = strawberry.field(description="AI suggestions", default=None)


# Document Analytics Inputs
@strawberry.input
class DocumentAnalyticsInputType:
    document: str = strawberry.field(description="Document UID")
    readability_score: float = strawberry.field(description="Readability score")
    sentiment_score: float = strawberry.field(description="Sentiment score")
    complexity_score: float = strawberry.field(description="Complexity score")
    summary: str = strawberry.field(description="Document summary")
    key_topics: str = strawberry.field(description="Key topics")
    generated_date: Optional[datetime] = strawberry.field(description="Generated date", default=None)


@strawberry.input
class DocumentAnalyticsUpdateInputType(DocumentAnalyticsInputType):
    uid: str
    document: Optional[str] = strawberry.field(description="Document UID", default=None)
    readability_score: Optional[float] = strawberry.field(description="Readability score", default=None)
    sentiment_score: Optional[float] = strawberry.field(description="Sentiment score", default=None)
    complexity_score: Optional[float] = strawberry.field(description="Complexity score", default=None)
    summary: Optional[str] = strawberry.field(description="Document summary", default=None)
    key_topics: Optional[str] = strawberry.field(description="Key topics", default=None)


# Main Document Inputs
@strawberry.input
class DocumentInputType:
    name: str = strawberry.field(description="Document name")
    subtitle: Optional[str] = strawberry.field(description="Document subtitle", default=None)
    document_id: str = strawberry.field(description="Document ID")
    folder: Optional[str] = strawberry.field(description="Folder UID", default=None)
    department: Optional[str] = strawberry.field(description="Department UID", default=None)
    category: Optional[str] = strawberry.field(description="Category UID", default=None)
    template: Optional[str] = strawberry.field(description="Template UID", default=None)
    tags: Optional[List[str]] = strawberry.field(description="Tag UIDs", default_factory=list)
    authors: Optional[List[str]] = strawberry.field(description="Author UIDs", default_factory=list)
    readers: Optional[List[str]] = strawberry.field(description="Reader UIDs", default_factory=list)
    initial_content: Optional[str] = strawberry.field(description="Initial document content", default=None)
    initial_version: Optional[str] = strawberry.field(description="Initial version number", default="1.0")


@strawberry.input
class DocumentUpdateInputType:
    uid: str
    name: Optional[str] = strawberry.field(description="Document name", default=None)
    subtitle: Optional[str] = strawberry.field(description="Document subtitle", default=None)
    document_id: Optional[str] = strawberry.field(description="Document ID", default=None)
    folder: Optional[str] = strawberry.field(description="Folder UID", default=None)
    department: Optional[str] = strawberry.field(description="Department UID", default=None)
    category: Optional[str] = strawberry.field(description="Category UID", default=None)
    template: Optional[str] = strawberry.field(description="Template UID", default=None)
    tags: Optional[List[str]] = strawberry.field(description="Tag UIDs", default_factory=list)
    authors: Optional[List[str]] = strawberry.field(description="Author UIDs", default_factory=list)
    readers: Optional[List[str]] = strawberry.field(description="Reader UIDs", default_factory=list)


# Document Relation Inputs
@strawberry.input
class DocumentRelationInputType:
    source_document: str = strawberry.field(description="Source document UID")
    target_document: str = strawberry.field(description="Target document UID")
    relation_type: str = strawberry.field(description="Relation type")


@strawberry.input
class DocumentRelationUpdateInputType(DocumentRelationInputType):
    source_document: Optional[str] = strawberry.field(description="Source document UID", default=None)
    target_document: Optional[str] = strawberry.field(description="Target document UID", default=None)
    relation_type: Optional[str] = strawberry.field(description="Relation type", default=None)
