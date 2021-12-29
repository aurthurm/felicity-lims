import inspect
import logging
from typing import Optional, List

import strawberry  # noqa

from felicity.apps.kanban import schemas, models
from felicity.apps.user import models as user_models
from felicity.gql import auth_from_info, verify_user_auth, DeletedItem, OperationError, DeleteResponse
from felicity.gql.kanban import types
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BoardResponse = strawberry.union("BoardResponse",
                                 (types.BoardType, OperationError),  # noqa
                                 description=""
                                 )

BoardListingResponse = strawberry.union("BoardListingResponse",
                                        (types.BoardListingType, OperationError),  # noqa
                                        description=""
                                        )

ListingTaskResponse = strawberry.union("ListingTaskResponse",
                                       (types.ListingTaskType, OperationError),  # noqa
                                       description=""
                                       )

TaskMilestoneResponse = strawberry.union("TaskMilestoneResponse",
                                         (types.TaskMilestoneType, OperationError),  # noqa
                                         description=""
                                         )

TaskCommentResponse = strawberry.union("TaskCommentResponse",
                                       (types.TaskCommentType, OperationError),  # noqa
                                       description=""
                                       )


@strawberry.input
class BoardInputType:
    title: str
    description: Optional[str] = None
    department_uid: Optional[int] = None
    archived: Optional[bool] = False


@strawberry.input
class BoardListingInputType:
    title: str
    board_uid: int
    description: Optional[str] = None


@strawberry.input
class ListingTaskInputType:
    title: Optional[str] = None
    description: Optional[str] = None
    listing_uid: Optional[int] = None
    due_date: Optional[str] = None
    assignee_uid: Optional[int] = None
    member_uids: Optional[List[int]] = None
    tags: Optional[List[str]] = None
    complete: Optional[bool] = None
    archived: Optional[bool] = None


@strawberry.type
class KanBanMutations:
    @strawberry.mutation
    async def create_board(self, info, payload: BoardInputType) -> BoardResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create kanban boards")

        if not payload.title:
            return OperationError(
                error="Please Provide a Board title"
            )

        exists = await models.Board.get(title=payload.title)
        if exists:
            return OperationError(
                error=f"Board {payload.title} already exists"
            )

        incoming = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.BoardCreate(**incoming)
        board: models.Board = await models.Board.create(obj_in)
        return types.BoardType(**board.marshal_simple())

    @strawberry.mutation
    async def update_board(self, info, uid: int, payload: BoardInputType) -> BoardResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update kanban boards")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

        board = await models.Board.get(uid=uid)
        if not board:
            return OperationError(
                error=f"Board with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = board.to_dict(board)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(board, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        try:
            setattr(board, 'updated_by_uid', felicity_user.uid)
        except Exception as e:
            logger.warning(e)

        obj_in = schemas.BoardUpdate(**board.to_dict())
        board = await board.update(obj_in)
        return types.BoardType(**board.marshal_simple())

    @strawberry.mutation
    async def delete_board(self, info, uid: int) -> DeleteResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can delete kanban board")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

        board = await models.Board.get(uid=uid)
        if not board:
            return OperationError(
                error=f"Board with uid {uid} not found. Cannot delete obj ..."
            )

        for listing in board.board_listings:
            if listing.listing_tasks:
                return OperationError(
                    error=f"Cannot Delete a Board whose Listings have tasks ..."
                )

        board_uid = board.uid
        await board.delete()
        return DeletedItem(uid=board_uid)

    @strawberry.mutation
    async def create_board_listing(self, info, payload: BoardListingInputType) -> BoardListingResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create  kanban board listings")

        if not payload.title:
            return OperationError(
                error="Please Provide a Listing title"
            )

        exists = await models.BoardListing.get(title=payload.title, board_uid=payload.board_uid)
        if exists:
            return OperationError(
                error=f"Listing {payload.title} already exists in this board"
            )

        incoming = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.BoardListingCreate(**incoming)
        listing: models.BoardListing = await models.BoardListing.create(obj_in)
        return types.BoardListingType(**listing.marshal_simple())

    @strawberry.mutation
    async def update_board_listing(self, info, uid: int, payload: BoardListingInputType) -> BoardListingResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update kanban board listings")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

        listing = await models.BoardListing.get(uid=uid)
        if not listing:
            return OperationError(
                error=f"Listing with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = listing.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(listing, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        try:
            setattr(listing, 'updated_by_uid', felicity_user.uid)
        except Exception as e:
            logger.warning(e)

        obj_in = schemas.BoardListingUpdate(**listing.to_dict())
        listing = await listing.update(obj_in)
        return types.BoardListingType(**listing.marshal_simple())

    @strawberry.mutation
    async def delete_board_listing(self, info, uid: int) -> DeleteResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can delete kanban board listings")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

        listing = await models.BoardListing.get(uid=uid)
        if not listing:
            return OperationError(
                error=f"Board Listing with uid {uid} not found. Cannot delete obj ..."
            )

        if listing.listing_tasks:
            return OperationError(
                error=f"First Delete/Move tasks from this listings in order to delete ..."
            )

        listing_uid = listing.uid
        await listing.delete()

        return DeletedItem(uid=listing_uid)

    @strawberry.mutation
    async def create_listing_task(self, info, title: str, listing_uid: int,
                                  description: Optional[str] = None) -> ListingTaskResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create kanban tasks")

        if not title:
            return OperationError(
                error="Please Provide a Task title"
            )

        incoming = {
            "assignee_uid": felicity_user.uid,
            "listing_uid": listing_uid,
            "description": description,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        obj_in = schemas.ListingTaskCreate(**incoming)
        task: models.ListingTask = await models.ListingTask.create(obj_in)
        task.members.append(felicity_user)
        task = await task.save()
        return types.ListingTaskType(**task.marshal_simple())

    @strawberry.mutation
    async def update_listing_task(self, info, uid: int, payload: ListingTaskInputType) -> ListingTaskResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update kanban tasks")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

        task = await models.ListingTask.get(uid=uid)
        if not task:
            return OperationError(
                error=f"Listing Task with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = task.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                if payload.__[field] or payload.__dict__[field] is False:
                    try:
                        setattr(task, field, payload.__dict__[field])
                    except Exception as e:
                        logger.warning(e)

        try:
            setattr(task, 'updated_by_uid', felicity_user.uid)
        except Exception as e:
            logger.warning(e)

        obj_in = schemas.ListingTaskUpdate(**task.to_dict())
        task = await task.update(obj_in)

        if payload.member_uids:
            task.members = []
            if len(payload.member_uids) > 0:
                for member_uid in payload.member_uids:
                    member = await user_models.User.get(uid=int(member_uid))
                    task.members.append(member)

        task = await task.save()
        return types.ListingTaskType(**task.marshal_simple())

    @strawberry.mutation
    async def delete_listing_task(self, info, uid: int) -> DeleteResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can delete kanban tasks")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

        task = await models.ListingTask.get(uid=uid)
        if not task:
            return OperationError(
                error=f"Listing Task with uid {uid} not found. Cannot update obj ..."
            )

        for comment in task.task_comments:
            await comment.delete()

        for milestone in task.task_milestones:
            await milestone.delete()

        task_uid = task.uid
        await task.delete()
        return DeletedItem(uid=task_uid)

    @strawberry.mutation
    async def duplicate_listing_task(self, info, uid: int, title: str) -> ListingTaskResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can delete kanban tasks")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

        if not title:
            return OperationError(
                error="Please provide the title for the duplicate task"
            )

        task = await models.ListingTask.get(uid=uid)
        if not task:
            return OperationError(
                error=f"Listing Task with uid {uid} not found. Cannot update obj ..."
            )

        task_data = task.to_dict()
        del task_data['uid']
        task_data['title'] = title

        obj_in = schemas.ListingTaskCreate(**task_data)
        duplicate: models.ListingTask = await models.ListingTask.create(obj_in)
        duplicate.task_milestones = task.task_milestones
        duplicate = await duplicate.save()

        return types.ListingTaskType(**duplicate.marshal_simple())

    @strawberry.mutation
    async def create_task_comment(self, info, comment: str, task_uid: int) -> TaskCommentResponse:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create kanban tasks")

        if not task_uid:
            return OperationError(
                error="Comment Missing the associated Listing Task"
            )

        if not comment:
            return OperationError(
                error="Task Comment cannot be blank"
            )

        incoming = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.TaskCommentCreate(**incoming)
        task_comment: models.TaskComment = await models.TaskComment.create(obj_in)
        return types.TaskCommentType(**task_comment.marshal_simple())

    @strawberry.mutation
    async def create_task_milestone(self, info, title: str, task_uid: int, assignee_uid: Optional[int] = None,
                                    done: Optional[bool] = False) -> TaskMilestoneResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create kanban tasks")

        if not task_uid:
            return OperationError(
                error="Milestone Missing the associated Listing Task"
            )

        if not title:
            return OperationError(
                error="Task Comment title cannot be blank"
            )

        incoming = {
            "assignee_uid": assignee_uid,
            "done": done,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        obj_in = schemas.TaskMilestoneCreate(**incoming)
        task_milestone: models.TaskMilestone = await models.TaskMilestone.create(obj_in)
        return types.TaskMilestoneType(**task_milestone.marshal_simple())
