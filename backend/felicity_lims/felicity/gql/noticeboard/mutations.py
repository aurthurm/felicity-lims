import inspect
import logging
from datetime import datetime
from typing import Optional, List

import strawberry

from felicity.apps.noticeboard import schemas, models
from felicity.gql import auth_from_info, verify_user_auth
from felicity.gql.noticeboard.types import NoticeType
from felicity.apps.patient.models import logger
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class NoticeMutations:
    @strawberry.mutation
    async def create_notice(self, info, title: str, body: str, expiry: str, groups: Optional[List[int]] = [],
                            departments: Optional[List[int]] = []) -> NoticeType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create notices")

        if not title or not body or not expiry:
            raise Exception("title, body, and expiry are mandatory")

        exists = await models.Notice.get(title=title)
        if exists:
            raise Exception(f"Notice with title {title} already exists: change your title !")

        incoming = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid
        }
        for k, v in passed_args.items():
            incoming[k] = v

        if groups:
            incoming['groups'] = []
            for g_uid in groups:
                _gr = models.Group.get(uid=g_uid)
                if _gr:
                    incoming['groups'].append(_gr)

        if departments:
            incoming['departments'] = []
            for dept_uid in groups:
                _gr = models.Department.get(uid=dept_uid)
                if _gr:
                    incoming['departments'].append(_gr)

        obj_in = schemas.NoticeCreate(**incoming)
        notice: models.Notice = await models.Notice.create(obj_in)
        return notice

    @strawberry.mutation
    async def update_notice(self, info, uid: int, title: str, body: str, expiry: str, groups: Optional[List[int]] = [],
                            departments: Optional[List[int]] = []) -> NoticeType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update notices")

        notice = await models.Notice.get(uid=uid)
        if not notice:
            raise Exception(f"notice with uid {uid} does not exist")

        notice_data = notice.to_dict()
        for field in notice_data:
            if field in passed_args:
                try:
                    setattr(notice, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        if groups:
            _groups = []
            for g_uid in groups:
                _gr = models.Group.get(uid=g_uid)
                if _gr:
                    _groups.append(_gr)
            setattr(notice, "groups", _groups)

        if departments:
            _departments = []
            for dept_uid in groups:
                _gr = models.Department.get(uid=dept_uid)
                if _gr:
                    _departments.append(_gr)
            setattr(notice, "departments", _departments)

        setattr(notice, "update_by_uid", felicity_user.uid)

        notice_in = schemas.NoticeUpdate(**notice.to_dict())
        notice = await notice.update(notice_in)
        return notice

    @strawberry.mutation
    async def view_notice(self, info, uid: int, viewer: int) -> NoticeType:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can view notices")

        notice: models.Notice = await models.Notice.get(uid=uid)
        if not notice:
            raise Exception(f"Notice with uid {uid} does not exist")

        _viewer = await models.User.get(uid=viewer)
        if not _viewer:
            raise Exception(f"User with uid {viewer} does not exist")

        notice = await notice.add_viewer(_viewer)
        return notice

    @strawberry.mutation
    async def delete_notice(self, info, uid: int) -> int:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can view notices")

        notice: models.Notice = await models.Notice.get(uid=uid)
        if not notice:
            raise Exception(f"Notice with uid {uid} does not exist")

        await notice.delete()
        return uid
