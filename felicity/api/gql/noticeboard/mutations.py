import logging
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info, verify_user_auth
from felicity.api.gql.noticeboard.types import NoticeType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import DeletedItem, DeleteResponse, OperationError
from felicity.apps.noticeboard import models, schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


NoticeResponse = strawberry.union(
    "NoticeResponse",
    (NoticeType, OperationError),  # noqa
    description="Union of possible outcomes when adding a new notice",
)


@strawberry.input
class NoticeInputType:
    title: str
    body: str
    expiry: str
    groups: Optional[List[str]]
    departments: Optional[List[str]]


@strawberry.type
class NoticeMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_notice(self, info, payload: NoticeInputType) -> NoticeResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create notices",
        )

        if not payload.title or not payload.body or not payload.expiry:
            return OperationError(
                error="Some fields have missing required data",
                suggestion="Make sure that the fields: [title, body, expiry] all have values",
            )

        exists = await models.Notice.get(title=payload.title)
        if exists:
            return OperationError(
                error="Notice title Duplication not Allowed",
                suggestion=f"Change the notice title",
            )

        incoming = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        if payload.groups:
            incoming["groups"] = []
            for g_uid in payload.groups:
                _gr = models.Group.get(uid=g_uid)
                if _gr:
                    incoming["groups"].append(_gr)

        if payload.departments:
            incoming["departments"] = []
            for dept_uid in payload.departments:
                _gr = models.Department.get(uid=dept_uid)
                if _gr:
                    incoming["departments"].append(_gr)

        obj_in = schemas.NoticeCreate(**incoming)
        notice: models.Notice = await models.Notice.create(obj_in)
        return NoticeType(**notice.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_notice(
        self, info, uid: str, payload: NoticeInputType
    ) -> NoticeResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update notices",
        )

        notice = await models.Notice.get(uid=uid)
        if not notice:
            raise OperationError(
                error=f"notice with uid {uid} does not exist",
                suggestion=f"Refresh page",
            )

        notice_data = notice.to_dict()
        for field in notice_data:
            if field in payload.__dict__:
                try:
                    setattr(notice, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        if payload.groups:
            _groups = []
            for g_uid in payload.groups:
                _gr = models.Group.get(uid=g_uid)
                if _gr:
                    _groups.append(_gr)
            setattr(notice, "groups", _groups)

        if payload.departments:
            _departments = []
            for dept_uid in payload.departments:
                _gr = models.Department.get(uid=dept_uid)
                if _gr:
                    _departments.append(_gr)
            setattr(notice, "departments", _departments)

        setattr(notice, "update_by_uid", felicity_user.uid)

        notice_in = schemas.NoticeUpdate(**notice.to_dict())
        notice = await notice.update(notice_in)
        return NoticeType(**notice.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def view_notice(self, info, uid: str, viewer: str) -> NoticeType:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated, felicity_user, "Only Authenticated user can view notices"
        )

        notice: models.Notice = await models.Notice.get(uid=uid)
        if not notice:
            raise Exception(f"Notice with uid {uid} does not exist")

        _viewer = await models.User.get(uid=viewer)
        if not _viewer:
            raise Exception(f"User with uid {viewer} does not exist")

        notice = await notice.add_viewer(_viewer)
        return NoticeType(**notice.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_notice(self, info, uid: str) -> DeleteResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated, felicity_user, "Only Authenticated user can view notices"
        )

        notice: models.Notice = await models.Notice.get(uid=uid)
        if not notice:
            raise Exception(f"Notice with uid {uid} does not exist")

        await notice.delete()
        return DeletedItem(uid=uid)
