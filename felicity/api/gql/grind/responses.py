import strawberry

from felicity.api.gql.grind import types
from felicity.api.gql.types import OperationError

GrindSchemeResponse = strawberry.union(
    "GrindSchemeResponse",
    (types.GrindSchemeType, OperationError),
    description="",  # noqa
)

GrindBoardResponse = strawberry.union(
    "GrindBoardResponse",
    (types.GrindBoardType, OperationError),
    description="",  # noqa
)

GrindPosterResponse = strawberry.union(
    "GrindPosterResponse",
    (types.GrindPosterType, OperationError),
    description="",  # noqa
)

GrindErrandResponse = strawberry.union(
    "GrindErrandResponse",
    (types.GrindErrandType, OperationError),
    description="",  # noqa
)

GrindErrandDiscussionResponse = strawberry.union(
    "GrindErrandDiscussionResponse",
    (types.GrindErrandDiscussionType, OperationError),
    description="",  # noqa
)

GrindLabelResponse = strawberry.union(
    "GrindLabelResponse",
    (types.GrindLabelType, OperationError),
    description="",  # noqa
)

GrindMediaResponse = strawberry.union(
    "GrindMediaResponse",
    (types.GrindMediaType, OperationError),
    description="",  # noqa
)

GrindMilestoneResponse = strawberry.union(
    "GrindMilestoneResponse",
    (types.GrindMilestoneType, OperationError),
    description="",  # noqa
)

GrindOccurrenceResponse = strawberry.union(
    "GrindOccurrenceResponse",
    (types.GrindOccurrenceType, OperationError),
    description="",  # noqa
)

GrindStampResponse = strawberry.union(
    "GrindStampResponse",
    (types.GrindStampType, OperationError),
    description="",  # noqa
)
