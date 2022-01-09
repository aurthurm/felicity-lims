from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from felicity.api.gql import PageInfo
from felicity.api.gql.setup.types import DepartmentType
from felicity.api.gql.user.types import UserType


@strawberry.type
class TaskTagType:
    uid: int
    name: str


@strawberry.type
class TaskCommentType:
    uid: int
    comment: str
    task_uid: int
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class TaskMilestoneType:
    uid: int
    title: str
    done: bool
    task_uid: int
    assignee_uid: Optional[int]
    assignee: Optional[UserType]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class ListingTaskType:
    uid: int
    title: str
    description: Optional[str]
    listing_uid: Optional[int]
    assignee_uid: Optional[int]
    assignee: Optional[UserType]
    tags: Optional[List[TaskTagType]]
    members: Optional[List[UserType]]
    task_milestones: Optional[List[TaskMilestoneType]]
    task_comments: Optional[List[TaskCommentType]]
    due_date: Optional[datetime]
    complete: bool
    archived: bool
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class BoardListingType:
    uid: int
    title: str
    description: Optional[str]
    board_uid: Optional[int]
    listing_tasks: Optional[List[ListingTaskType]]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class BoardType:
    uid: int
    title: str
    description: Optional[str]
    archived: bool
    board_listings: Optional[List[BoardListingType]]
    department_uid: Optional[int]
    department: Optional[DepartmentType]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


#  relay paginations
@strawberry.type
class BoardEdge:
    cursor: str
    node: BoardType


@strawberry.type
class BoardCursorPage:
    page_info: PageInfo
    edges: Optional[List[BoardEdge]]
    items: Optional[List[BoardType]]
    total_count: int
