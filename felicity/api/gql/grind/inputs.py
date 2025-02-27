from datetime import datetime
from typing import Optional, List

import strawberry

from felicity.apps.grind.enum import PosterCategory, ErrandCategory


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
    uid: str
    title: Optional[str] = strawberry.field(description="Scheme Title", default=None)


@strawberry.input
class GrindCreateStampInput:
    title: str = strawberry.field(description="Stamp title")
    category: str = strawberry.field(description="Stamp category")


@strawberry.input
class GrindUpdateStampInput(GrindCreateStampInput):
    uid: str
    title: Optional[str] = strawberry.field(description="Stamp title", default=None)
    category: Optional[str] = strawberry.field(description="Stamp category", default=None)


@strawberry.input
class GrindCreatePosterInput:
    category: Optional[PosterCategory] = strawberry.field(
        description="Poster category", default=None
    )
    title: Optional[str] = strawberry.field(description="Poster Title", default=None)
    description: Optional[str] = strawberry.field(
        description="Poster description", default=None
    )
    board: Optional[str] = strawberry.field(description="Poster Board", default=None)
    stamps: Optional[List[str]] = strawberry.field(
        description="Poster label", default_factory=list
    )
    # Ignoring createdBy and updatedBy as requested
    assignee: Optional[str] = strawberry.field(
        description="Assigned To", default=None
    )
    members: Optional[List[str]] = strawberry.field(
        description="Poster Members", default_factory=list
    )
    status: Optional[str] = strawberry.field(
        description="Poster status", default=None
    )
    communities: Optional[List[str]] = strawberry.field(
        description="Poster Communities", default_factory=list
    )


@strawberry.input
class GrindUpdatePosterInput(GrindCreatePosterInput):
    uid: str


@strawberry.input
class GrindCreateMilestoneInput:
    errand: str = strawberry.field(description="Milestone Errand")
    title: Optional[str] = strawberry.field(description="Milestone Title", default=None)
    description: Optional[str] = strawberry.field(description="Milestone Description", default=None)
    complete: Optional[bool] = strawberry.field(description="Status", default=None)
    assignee: Optional[str] = strawberry.field(description="Assigned to", default=None)


@strawberry.input
class GrindUpdateMilestoneInput(GrindCreateMilestoneInput):
    uid: str
    errand: Optional[str] = strawberry.field(description="Milestone Errand", default=None)


@strawberry.input
class GrindCreateMediaInput:
    target: Optional[str] = strawberry.field(
        description="Media target", default=None
    )
    target_uid: Optional[str] = strawberry.field(
        description="Media Target ID", default=None
    )
    destination: Optional[str] = strawberry.field(
        description="Media destination", default=None
    )
    encoding: Optional[str] = strawberry.field(
        description="Media encoding", default=None
    )
    filename: Optional[str] = strawberry.field(
        description="Media filename", default=None
    )
    mimetype: Optional[str] = strawberry.field(
        description="Media mimetype", default=None
    )
    original_name: Optional[str] = strawberry.field(
        description="Media original name", default=None
    )
    path: Optional[str] = strawberry.field(
        description="Media path", default=None
    )
    size: Optional[str] = strawberry.field(
        description="Media size", default=None
    )
    description: Optional[str] = strawberry.field(
        description="Media description", default=None
    )


@strawberry.input
class GrindUpdateMediaInput(GrindCreateMediaInput):
    uid: str


@strawberry.input
class GrindCreateLabelInput:
    title: str = strawberry.field(description="Label title")
    category: str = strawberry.field(description="Label category")
    # Ignoring createdBy and updatedBy as requested


@strawberry.input
class GrindUpdateLabelInput(GrindCreateLabelInput):
    uid: str
    title: Optional[str] = strawberry.field(description="Label title", default=None)
    category: Optional[str] = strawberry.field(description="Label category", default=None)
    # All fields from CreateLabelInput are now optional in the update input


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
    reporter: Optional[str] = strawberry.field(
        description="Assigned To", default=None
    )
    assignee: Optional[str] = strawberry.field(
        description="Assigned To", default=None
    )
    label: Optional[str] = strawberry.field(
        description="Errand Label | Status", default=None
    )
    stamps: Optional[List[str]] = strawberry.field(
        description="Errand Stamps | Tags", default_factory=list
    )
    priority: Optional[str] = strawberry.field(
        description="Errand Priority", default=None
    )
    poster: Optional[str] = strawberry.field(
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
    uid: str


@strawberry.input
class GrindCreateBoardInput:
    title: str = strawberry.field(description="Board Title")
    description: Optional[str] = strawberry.field(
        description="Board Description", default=None
    )
    scheme: Optional[str] = strawberry.field(
        description="Board Scheme", default=None
    )


@strawberry.input
class GrindUpdateBoardInput(GrindCreateBoardInput):
    uid: str
    title: Optional[str] = strawberry.field(description="Board Title", default=None)
