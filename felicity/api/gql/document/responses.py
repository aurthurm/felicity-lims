import strawberry

from felicity.api.gql.document import types
from felicity.api.gql.types import OperationError

DocumentCategoryResponse = strawberry.union(
    "DocumentCategoryResponse",
    (types.DocumentCategoryType, OperationError),
    description="Response for document category operations",
)

DocumentTagResponse = strawberry.union(
    "DocumentTagResponse",
    (types.DocumentTagType, OperationError),
    description="Response for document tag operations",
)

DocumentFolderResponse = strawberry.union(
    "DocumentFolderResponse",
    (types.DocumentFolderType, OperationError),
    description="Response for document folder operations",
)

DocumentTemplateResponse = strawberry.union(
    "DocumentTemplateResponse",
    (types.DocumentTemplateType, OperationError),
    description="Response for document template operations",
)

DocumentResponse = strawberry.union(
    "DocumentResponse",
    (types.DocumentType, OperationError),
    description="Response for document operations",
)

DocumentVersionResponse = strawberry.union(
    "DocumentVersionResponse",
    (types.DocumentVersionType, OperationError),
    description="Response for document version operations",
)

DocumentStatusResponse = strawberry.union(
    "DocumentStatusResponse",
    (types.DocumentStatusType, OperationError),
    description="Response for document status operations",
)

DocumentReviewCycleResponse = strawberry.union(
    "DocumentReviewCycleResponse",
    (types.DocumentReviewCycleType, OperationError),
    description="Response for document review cycle operations",
)

DocumentReviewStepResponse = strawberry.union(
    "DocumentReviewStepResponse",
    (types.DocumentReviewStepType, OperationError),
    description="Response for document review step operations",
)

DocumentSubscriptionResponse = strawberry.union(
    "DocumentSubscriptionResponse",
    (types.DocumentSubscriptionType, OperationError),
    description="Response for document subscription operations",
)

DocumentAuditResponse = strawberry.union(
    "DocumentAuditResponse",
    (types.DocumentAuditType, OperationError),
    description="Response for document audit operations",
)

DocumentAIModelResponse = strawberry.union(
    "DocumentAIModelResponse",
    (types.DocumentAIModelType, OperationError),
    description="Response for document AI model operations",
)

DocumentAIAuthoringSessionResponse = strawberry.union(
    "DocumentAIAuthoringSessionResponse",
    (types.DocumentAIAuthoringSessionType, OperationError),
    description="Response for document AI authoring session operations",
)

DocumentComplianceStandardResponse = strawberry.union(
    "DocumentComplianceStandardResponse",
    (types.DocumentComplianceStandardType, OperationError),
    description="Response for document compliance standard operations",
)

DocumentAIComplianceCheckResponse = strawberry.union(
    "DocumentAIComplianceCheckResponse",
    (types.DocumentAIComplianceCheckType, OperationError),
    description="Response for document AI compliance check operations",
)

DocumentComplianceIssueResponse = strawberry.union(
    "DocumentComplianceIssueResponse",
    (types.DocumentComplianceIssueType, OperationError),
    description="Response for document compliance issue operations",
)

DocumentAIReviewFeedbackResponse = strawberry.union(
    "DocumentAIReviewFeedbackResponse",
    (types.DocumentAIReviewFeedbackType, OperationError),
    description="Response for document AI review feedback operations",
)

DocumentAnalyticsResponse = strawberry.union(
    "DocumentAnalyticsResponse",
    (types.DocumentAnalyticsType, OperationError),
    description="Response for document analytics operations",
)

DocumentRelationResponse = strawberry.union(
    "DocumentRelationResponse",
    (types.DocumentType, OperationError),
    description="Response for document relation operations",
)
