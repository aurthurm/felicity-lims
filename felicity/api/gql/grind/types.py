from __future__ import annotations

from typing import List, Optional

import strawberry

from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType
from felicity.apps.grind.enum import MediaTarget, OccurrenceTarget


# Scheme Types
@strawberry.type
class GrindSchemeType:
    uid: str
    title: str
    description: str | None = None
    assignee_uid: str | None = None
    assignee: UserType | None = None
    start_date: str | None = None
    end_date: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def members(self, info) -> List["UserType"]:
        from felicity.apps.grind.services import GrindSchemeService
        scheme = await GrindSchemeService().get(uid=self.uid)
        return scheme.members if scheme else []

    @strawberry.field
    async def boards(self, info) -> List["GrindBoardType"]:
        from felicity.apps.grind.services import GrindBoardService
        return await GrindBoardService().get_all(scheme_uid=self.uid)


@strawberry.type
class GrindSchemeEdge:
    cursor: str
    node: GrindSchemeType


@strawberry.type
class GrindSchemeCursorPage:
    page_info: PageInfo
    edges: Optional[List[GrindSchemeEdge]] = None
    items: Optional[List[GrindSchemeType]] = None
    total_count: int


# Board Types
@strawberry.type
class GrindBoardType:
    uid: str
    title: str
    description: str | None = None
    scheme_uid: str | None = None
    scheme: GrindSchemeType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def posters(self, info) -> List["GrindPosterType"]:
        from felicity.apps.grind.services import GrindPosterService
        return await GrindPosterService().get_all(board_uid=self.uid)


@strawberry.type
class GrindBoardEdge:
    cursor: str
    node: GrindBoardType


@strawberry.type
class GrindBoardCursorPage:
    page_info: PageInfo
    edges: Optional[List[GrindBoardEdge]] = None
    items: Optional[List[GrindBoardType]] = None
    total_count: int


# Poster Types
@strawberry.type
class GrindPosterType:
    uid: str
    category: str | None = None
    title: str | None = None
    description: str | None = None
    board_uid: str | None = None
    board: GrindBoardType | None = None
    assignee_uid: str | None = None
    assignee: UserType | None = None
    status: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def members(self, info) -> List[UserType]:
        from felicity.apps.grind.services import GrindPosterService
        poster = await GrindPosterService().get(uid=self.uid)
        return poster.members if poster else []

    @strawberry.field
    async def stamps(self, info) -> List["GrindStampType"]:
        from felicity.apps.grind.services import GrindPosterService
        poster = await GrindPosterService().get(uid=self.uid)
        return poster.stamps if poster else []

    @strawberry.field
    async def errands(self, info) -> List["GrindErrandType"]:
        from felicity.apps.grind.services import GrindErrandService
        return await GrindErrandService().get_all(poster_uid=self.uid)


@strawberry.type
class GrindPosterEdge:
    cursor: str
    node: GrindPosterType


@strawberry.type
class GrindPosterCursorPage:
    page_info: PageInfo
    edges: Optional[List[GrindPosterEdge]] = None
    items: Optional[List[GrindPosterType]] = None
    total_count: int


# Stamp Type (referenced but not in entities, adding for relationships)
@strawberry.type
class GrindStampType:
    uid: str
    name: str | None = None
    description: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


# Errand Types
@strawberry.type
class GrindErrandType:
    uid: str
    category: str | None = None
    title: str | None = None
    description: str | None = None
    label_uid: str | None = None
    label: GrindLabelType | None = None
    priority: str | None = None
    poster_uid: str | None = None
    poster: GrindPosterType | None = None
    reporter_uid: str | None = None
    reporter: UserType | None = None
    assignee_uid: str | None = None
    assignee: UserType | None = None
    start_date: str | None = None
    end_date: str | None = None
    progress: int | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def members(self, info) -> List[UserType]:
        from felicity.apps.grind.services import GrindErrandService
        errand = await GrindErrandService().get(uid=self.uid)
        return errand.members if errand else []

    @strawberry.field
    async def stamps(self, info) -> List[GrindStampType]:
        from felicity.apps.grind.services import GrindErrandService
        errand = await GrindErrandService().get(uid=self.uid)
        return errand.stamps if errand else []

    @strawberry.field
    async def milestones(self, info) -> List["GrindMilestoneType"]:
        from felicity.apps.grind.services import GrindMilestoneService
        return await GrindMilestoneService().get_all(errand_uid=self.uid)

    @strawberry.field
    async def occurrences(self, info) -> List["GrindOccurrenceType"]:
        from felicity.apps.grind.services import GrindOccurrenceService
        return await GrindOccurrenceService().get_all(target=OccurrenceTarget.ERRAND.value, target_uid=self.uid)

    @strawberry.field
    async def media(self, info) -> List["GrindMediaType"]:
        from felicity.apps.grind.services import GrindMediaService
        return await GrindMediaService().get_all(target=MediaTarget.ERRAND.value, target_uid=self.uid)


@strawberry.type
class GrindErrandEdge:
    cursor: str
    node: GrindErrandType


@strawberry.type
class GrindErrandCursorPage:
    page_info: PageInfo
    edges: Optional[List[GrindErrandEdge]] = None
    items: Optional[List[GrindErrandType]] = None
    total_count: int


# Label Types
@strawberry.type
class GrindLabelType:
    uid: str
    title: str
    category: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class GrindLabelEdge:
    cursor: str
    node: GrindLabelType


@strawberry.type
class GrindLabelCursorPage:
    page_info: PageInfo
    edges: Optional[List[GrindLabelEdge]] = None
    items: Optional[List[GrindLabelType]] = None
    total_count: int


# Media Types
@strawberry.type
class GrindMediaType:
    uid: str
    target: str | None = None
    target_uid: str | None = None
    destination: str | None = None
    encoding: str | None = None
    filename: str | None = None
    mimetype: str | None = None
    original_name: str | None = None
    path: str | None = None
    size: str | None = None
    description: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class GrindMediaEdge:
    cursor: str
    node: GrindMediaType


@strawberry.type
class GrindMediaCursorPage:
    page_info: PageInfo
    edges: Optional[List[GrindMediaEdge]] = None
    items: Optional[List[GrindMediaType]] = None
    total_count: int


# Milestone Types
@strawberry.type
class GrindMilestoneType:
    uid: str
    errand_uid: str | None = None
    errand: GrindErrandType | None = None
    title: str | None = None
    description: str | None = None
    complete: bool | None = None
    assignee_uid: str | None = None
    assignee: UserType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def occurrences(self, info) -> List["GrindOccurrenceType"]:
        from felicity.apps.grind.services import GrindOccurrenceService
        return await GrindOccurrenceService().get_all(target=OccurrenceTarget.MILESTONE.value, target_uid=self.uid)


@strawberry.type
class GrindMilestoneEdge:
    cursor: str
    node: GrindMilestoneType


@strawberry.type
class GrindMilestoneCursorPage:
    page_info: PageInfo
    edges: Optional[List[GrindMilestoneEdge]] = None
    items: Optional[List[GrindMilestoneType]] = None
    total_count: int


# Occurrence Types
@strawberry.type
class GrindOccurrenceType:
    uid: str
    target: str | None = None
    target_uid: str | None = None
    actor_uid: str | None = None
    actor: UserType | None = None
    description: str | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class GrindOccurrenceEdge:
    cursor: str
    node: GrindOccurrenceType


@strawberry.type
class GrindOccurrenceCursorPage:
    page_info: PageInfo
    edges: Optional[List[GrindOccurrenceEdge]] = None
    items: Optional[List[GrindOccurrenceType]] = None
    total_count: int
