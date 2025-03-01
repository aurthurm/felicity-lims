from datetime import datetime
from typing import Optional, List

import strawberry
from strawberry.file_uploads import Upload

from felicity.apps.grind.enum import PosterCategory, ErrandCategory, StampCategory, LabelCategory, MediaTarget


@strawberry.input
class GrindCreateSchemeInput:
    title: str = strawberry.field(description="Scheme Title")
    description: Optional[str] = strawberry.field(description="Scheme Description", default=None)
    assignee: Optional[str] = strawberry.field(description="Assigned to", default=None)
    members: Optional[List[str]] = strawberry.field(description="Scheme Members", default_factory=list)
    start_date: Optional[datetime] = strawberry.field(description="Start Date", default=None)
    end_date: Optional[datetime] = strawberry.field(description="End Date", default=None)


@strawberry.input
class GrindUpdateSchemeInput(GrindCreateSchemeInput):
    title: Optional[str] = strawberry.field(description="Scheme Title", default=None)


@strawberry.input
class GrindCreateStampInput:
    title: str = strawberry.field(description="Stamp title")
    category: StampCategory = strawberry.field(description="Stamp category")


@strawberry.input
class GrindUpdateStampInput(GrindCreateStampInput):
    title: Optional[str] = strawberry.field(description="Stamp title", default=None)
    category: Optional[str] = strawberry.field(description="Stamp category", default=None)


@strawberry.input
class GrindCreatePosterInput:
    category: PosterCategory = strawberry.field(
        description="Poster category", default=None
    )
    title: str = strawberry.field(description="Poster Title", default=None)
    description: Optional[str] = strawberry.field(
        description="Poster description", default=None
    )
    boardUid: Optional[str] = strawberry.field(description="Poster Board", default=None)
    #
    stamps: Optional[List[str]] = strawberry.field(
        description="Poster label", default_factory=list
    )
    # Ignoring createdBy and updatedBy as requested
    assigneeUid: Optional[str] = strawberry.field(
        description="Assigned To", default=None
    )
    members: Optional[List[str]] = strawberry.field(
        description="Poster Members", default_factory=list
    )
    status: Optional[str] = strawberry.field(
        description="Poster status", default=None
    )


@strawberry.input
class GrindUpdatePosterInput(GrindCreatePosterInput):
    ...


@strawberry.input
class GrindCreateMilestoneInput:
    errandUid: str = strawberry.field(description="Milestone Errand")
    title: Optional[str] = strawberry.field(description="Milestone Title", default=None)
    description: Optional[str] = strawberry.field(description="Milestone Description", default=None)
    complete: Optional[bool] = strawberry.field(description="Status", default=None)
    assigneeUid: Optional[str] = strawberry.field(description="Assigned to", default=None)


@strawberry.input
class GrindUpdateMilestoneInput(GrindCreateMilestoneInput):
    ...


@strawberry.input
class GrindCreateMediaInput:
    target: MediaTarget = strawberry.field(
        description="Media target", default=None
    )
    target_uid: str = strawberry.field(
        description="Media Target ID", default=None
    )
    file: Upload


@strawberry.input
class GrindUpdateMediaInput(GrindCreateMediaInput):
    ...


@strawberry.input
class GrindCreateLabelInput:
    title: str = strawberry.field(description="Label title")
    category: LabelCategory = strawberry.field(description="Label category")
    # Ignoring createdBy and updatedBy as requested


@strawberry.input
class GrindUpdateLabelInput(GrindCreateLabelInput):
    title: Optional[str] = strawberry.field(description="Label title", default=None)
    category: Optional[str] = strawberry.field(description="Label category", default=None)


@strawberry.input
class GrindCreateErrandInput:
    category: Optional[ErrandCategory] = strawberry.field(
        description="Errand Category", default=None
    )
    title: Optional[str] = strawberry.field(
        description="Errand Title", default=None
    )
    description: Optional[str] = strawberry.field(
        description="Errand Description", default=None
    )
    milestones: Optional[List[str]] = strawberry.field(
        description="Errand Milestone", default_factory=list
    )
    reporterUid: Optional[str] = strawberry.field(
        description="Assigned To", default=None
    )
    assigneeUid: Optional[str] = strawberry.field(
        description="Assigned To", default=None
    )
    labelUid: Optional[str] = strawberry.field(
        description="Errand Label | Status", default=None
    )
    stamps: Optional[List[str]] = strawberry.field(
        description="Errand Stamps | Tags", default_factory=list
    )
    priority: Optional[str] = strawberry.field(
        description="Errand Priority", default=None
    )
    posterUid: Optional[str] = strawberry.field(
        description="Errand Poster", default=None
    )
    members: Optional[List[str]] = strawberry.field(
        description="Errand Members", default_factory=list
    )
    start_date: Optional[datetime] = strawberry.field(
        description="Start Date", default=None
    )
    end_date: Optional[datetime] = strawberry.field(
        description="End Date", default=None
    )


@strawberry.input
class GrindUpdateErrandInput(GrindCreateErrandInput):
    ...


@strawberry.input
class GrindCreateErrandDiscussionInput:
    comment: str = strawberry.field(description="Comment")
    errand_uid: str = strawberry.field(description="Errand uid")
    parent_uid: Optional[str] = strawberry.field(description="Parent comment uid", default=None)


@strawberry.input
class GrindUpdateErrandDiscussionInput(GrindCreateErrandDiscussionInput):
    ...


@strawberry.input
class GrindCreateBoardInput:
    title: str = strawberry.field(description="Board Title")
    description: Optional[str] = strawberry.field(
        description="Board Description", default=None
    )
    schemeUid: Optional[str] = strawberry.field(
        description="Board Scheme", default=None
    )


@strawberry.input
class GrindUpdateBoardInput(GrindCreateBoardInput):
    title: Optional[str] = strawberry.field(description="Board Title", default=None)
