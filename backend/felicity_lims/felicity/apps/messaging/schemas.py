from typing import Optional, List
from datetime import datetime

from pydantic import BaseModel

from felicity.apps import BaseAuditModel
from felicity.apps.setup.schemas import Department
from felicity.apps.user.schemas import User


#
# Board Schemas
#
class BoardBase(BaseAuditModel):
    title: Optional[str] = ""
    description: Optional[str] = ""
    archived: Optional[bool] = False
    department_uid: Optional[int] = None
    department: Optional[Department] = None


class Board(BoardBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class BoardCreate(BoardBase):
    pass


class BoardUpdate(BoardBase):
    pass


#
# BoardListing Schemas
#
class BoardListingBase(BaseAuditModel):
    title: Optional[str] = ""
    description: Optional[str] = ""
    board_uid: Optional[int] = ""
    board: Optional[Board] = ""


class BoardListing(BoardListingBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class BoardListingCreate(BoardListingBase):
    pass


class BoardListingUpdate(BoardListingBase):
    pass


#
# TaskTag Schemas
#
class TaskTagBase(BaseAuditModel):
    name: Optional[str] = ""


class TaskTag(TaskTagBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class TaskTagCreate(TaskTagBase):
    pass


class TaskTagUpdate(TaskTagBase):
    pass


#
# Listing Task Schemas
#
class ListingTaskBase(BaseAuditModel):
    title: Optional[str] = ""
    description: Optional[str] = ""
    listing_uid: Optional[int] = ""
    listing: Optional[BoardListing] = None
    assignee_uid: Optional[int] = ""
    assignee: Optional[User] = None
    tags: Optional[List[TaskTag]] = []
    members: Optional[List[User]] = []
    due_date: Optional[datetime] = ""
    complete: Optional[bool] = False
    archived: Optional[bool] = False


class ListingTask(ListingTaskBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class ListingTaskCreate(ListingTaskBase):
    pass


class ListingTaskUpdate(ListingTaskBase):
    pass


#
# TaskMilestone Schemas
#
class TaskMilestoneBase(BaseAuditModel):
    title: Optional[str] = ""
    done: Optional[bool] = False
    task_uid: Optional[int] = ""
    task: Optional[ListingTask] = ""
    assignee_uid: Optional[int] = ""
    assignee: Optional[User] = None


class TaskMilestone(TaskMilestoneBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class TaskMilestoneCreate(TaskMilestoneBase):
    pass


class TaskMilestoneUpdate(TaskMilestoneBase):
    pass


#
# TaskComment Schemas
#
class TaskCommentBase(BaseAuditModel):
    comment: Optional[str] = None
    task_uid: Optional[int] = None
    task: Optional[ListingTask] = None


class TaskComment(TaskCommentBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class TaskCommentCreate(TaskCommentBase):
    pass


class TaskCommentUpdate(TaskCommentBase):
    pass