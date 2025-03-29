import logging

import strawberry  # noqa
from strawberry.permission import PermissionExtension

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.noticeboard.types import NoticeType
from felicity.api.gql.permissions import IsAuthenticated, HasPermission
from felicity.api.gql.types import DeletedItem, DeleteResponse, OperationError
from felicity.apps.guard import FAction, FObject
from felicity.apps.noticeboard import schemas
from felicity.apps.noticeboard.services import NoticeService
from felicity.apps.setup.services import DepartmentService
from felicity.apps.user.services import GroupService, UserService

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
    groups: list[str] | None
    departments: list[str] | None


@strawberry.type
class NoticeMutations:
    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.NOTICE)]
        )]
    )
    async def create_notice(self, info, payload: NoticeInputType) -> NoticeResponse:
        felicity_user = await auth_from_info(info)

        if not payload.title or not payload.body or not payload.expiry:
            return OperationError(
                error="Some fields have missing required data",
                suggestion="Make sure that the fields: [title, body, expiry] all have values",
            )

        exists = await NoticeService().get(title=payload.title)
        if exists:
            return OperationError(
                error="Notice title Duplication not Allowed",
                suggestion="Change the notice title",
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
                _gr = GroupService().get(uid=g_uid)
                if _gr:
                    incoming["groups"].append(_gr)

        if payload.departments:
            incoming["departments"] = []
            for dept_uid in payload.departments:
                _gr = DepartmentService().get(uid=dept_uid)
                if _gr:
                    incoming["departments"].append(_gr)

        obj_in = schemas.NoticeCreate(**incoming)
        notice = await NoticeService().create(obj_in)
        return NoticeType(**notice.marshal_simple())

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.NOTICE)]
        )]
    )
    async def update_notice(
            self, info, uid: str, payload: NoticeInputType
    ) -> NoticeResponse:
        felicity_user = await auth_from_info(info)

        notice = await NoticeService().get(uid=uid)
        if not notice:
            return OperationError(
                error=f"notice with uid {uid} does not exist",
                suggestion="Refresh page",
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
                _gr = GroupService().get(uid=g_uid)
                if _gr:
                    _groups.append(_gr)
            setattr(notice, "groups", _groups)

        if payload.departments:
            _departments = []
            for dept_uid in payload.departments:
                _gr = DepartmentService().get(uid=dept_uid)
                if _gr:
                    _departments.append(_gr)
            setattr(notice, "departments", _departments)

        setattr(notice, "update_by_uid", felicity_user.uid)

        notice_in = schemas.NoticeUpdate(**notice.to_dict())
        notice = await NoticeService().update(notice.uid, notice_in)
        return NoticeType(**notice.marshal_simple())

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.NOTICE)]
        )]
    )
    async def view_notice(self, info, uid: str, viewer: str) -> NoticeType:
        await auth_from_info(info)

        notice = await NoticeService().get(uid=uid)
        if not notice:
            raise Exception(f"Notice with uid {uid} does not exist")

        _viewer = await UserService().get(uid=viewer)
        if not _viewer:
            raise Exception(f"User with uid {viewer} does not exist")

        notice = await NoticeService().add_viewer(notice.uid, _viewer)
        return NoticeType(**notice.marshal_simple())

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.DELETE, FObject.NOTICE)]
        )]
    )
    async def delete_notice(self, info, uid: str) -> DeleteResponse:
        await auth_from_info(info)

        notice = await NoticeService().get(uid=uid)
        if not notice:
            raise Exception(f"Notice with uid {uid} does not exist")

        await NoticeService().delete(uid)
        return DeletedItem(uid=uid)
