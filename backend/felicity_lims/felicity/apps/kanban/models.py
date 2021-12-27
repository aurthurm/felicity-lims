from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Boolean, Table
from sqlalchemy.orm import relationship, backref

from felicity.apps import BaseAuditDBModel, DBModel
from felicity.apps.setup.models.setup import Department
from felicity.apps.user.models import User
from . import schemas


class Board(BaseAuditDBModel):
    title = Column(String)
    description = Column(String)
    archived = Column(Boolean(), default=False)
    department_uid = Column(Integer, ForeignKey('department.uid'), nullable=True)
    department = relationship(Department, backref="boards", lazy="selectin")
    board_listings = relationship("BoardListing", back_populates="board", cascade="all, delete, delete-orphan",
                                  lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.BoardCreate) -> schemas.Board:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.BoardUpdate) -> schemas.Board:
        data = self._import(obj_in)
        return await super().update(**data)


class BoardListing(BaseAuditDBModel):
    title = Column(String)
    description = Column(String)
    board_uid = Column(Integer, ForeignKey('board.uid'), nullable=False)
    board = relationship(Board, back_populates="board_listings", lazy="selectin")
    listing_tasks = relationship("ListingTask", back_populates="listing", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.BoardListingCreate) -> schemas.BoardListing:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.BoardListingUpdate) -> schemas.BoardListing:
        data = self._import(obj_in)
        return await super().update(**data)


class TaskTag(BaseAuditDBModel):
    name = Column(String)

    @classmethod
    async def create(cls, obj_in: schemas.TaskTagCreate) -> schemas.TaskTag:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.TaskTagUpdate) -> schemas.TaskTag:
        data = self._import(obj_in)
        return await super().update(**data)


tagged_tasks = Table("tagged_tasks", DBModel.metadata,
                     Column("task_uid", ForeignKey('listingtask.uid'), primary_key=True),
                     Column("tag_uid", ForeignKey('tasktag.uid'), primary_key=True),
                     )

member_tasks = Table("member_tasks", DBModel.metadata,
                     Column("task_uid", ForeignKey('listingtask.uid'), primary_key=True),
                     Column("user_uid", ForeignKey('user.uid'), primary_key=True),
                     )


class ListingTask(BaseAuditDBModel):
    title = Column(String)
    description = Column(String)
    listing_uid = Column(Integer, ForeignKey('boardlisting.uid'), nullable=False)
    listing = relationship(BoardListing, back_populates="listing_tasks", lazy="selectin")
    assignee_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    assignee = relationship(User, foreign_keys=[assignee_uid], lazy="selectin")
    tags = relationship(TaskTag, secondary=tagged_tasks, lazy="selectin")
    members = relationship(User, secondary=member_tasks, lazy="selectin")
    task_milestones = relationship("TaskMilestone", back_populates="task", cascade="all, delete-orphan",
                                   lazy="selectin")
    task_comments = relationship("TaskComment", back_populates="task", cascade="all, delete-orphan", lazy="selectin")
    due_date = Column(DateTime, nullable=True)
    complete = Column(Boolean(), default=False)
    archived = Column(Boolean(), default=False)

    @classmethod
    async def create(cls, obj_in: schemas.ListingTaskCreate) -> schemas.ListingTask:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ListingTaskUpdate) -> schemas.ListingTask:
        data = self._import(obj_in)
        return await super().update(**data)


class TaskMilestone(BaseAuditDBModel):
    title = Column(String)
    done = Column(Boolean(), default=False)
    task_uid = Column(Integer, ForeignKey('listingtask.uid'), primary_key=True)
    task = relationship(ListingTask, back_populates="task_milestones", lazy="selectin")
    assignee_uid = Column(Integer, ForeignKey('user.uid'), nullable=True)
    assignee = relationship(User, foreign_keys=[assignee_uid], backref="tasks_milestones", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.TaskMilestoneCreate) -> schemas.TaskMilestone:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.TaskMilestoneUpdate) -> schemas.TaskMilestone:
        data = self._import(obj_in)
        return await super().update(**data)


class TaskComment(BaseAuditDBModel):
    comment = Column(String)
    task_uid = Column(Integer, ForeignKey('listingtask.uid'), primary_key=True)
    task = relationship(ListingTask, back_populates="task_comments", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.TaskCommentCreate) -> schemas.TaskComment:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.TaskCommentUpdate) -> schemas.TaskComment:
        data = self._import(obj_in)
        return await super().update(**data)
