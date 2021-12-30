import inspect
import logging
from typing import Optional, List

import strawberry  # noqa

from felicity.apps.markdown import schemas, models, conf
from felicity.gql import auth_from_info, verify_user_auth, OperationError
from felicity.gql.markdown import types
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DocumentTagResponse = strawberry.union("DocumentTagResponse",
                                       (types.DocumentTagType, OperationError),  # noqa
                                       description=""
                                       )

DocumentCategoryResponse = strawberry.union("DocumentCategoryResponse",
                                            (types.DocumentCategoryType, OperationError),  # noqa
                                            description=""
                                            )
DocumentResponse = strawberry.union("DocumentResponse",
                                    (types.DocumentType, OperationError),  # noqa
                                    description=""
                                    )


@strawberry.input
class MarkdownInputType:
    name: Optional[str] = None
    subtitle: Optional[str] = None
    document_id: Optional[str] = None
    version: Optional[str] = None
    department_uid: Optional[int] = None
    category_uid: Optional[int] = None
    tags_uids: Optional[List[int]] = None
    content: Optional[str] = None


@strawberry.type
class MarkdownMutations:
    @strawberry.mutation
    async def create_document_tag(self, info, name: str) -> DocumentTagResponse:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create document tags")

        if not name:
            return OperationError(
                error="Please Provide a Tag name"
            )

        exists = await models.DocumentTag.get(name=name)
        if exists:
            return OperationError(
                error=f"DocumentTag {name} already exists"
            )

        incoming = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid
        }
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.DocumentTagCreate(**incoming)
        tag: models.DocumentTag = await models.DocumentTag.create(obj_in)
        return types.DocumentTagType(**tag.marshal_simple())

    @strawberry.mutation
    async def update_document_tag(self, info, uid: int, name: Optional[str] = None) -> DocumentTagResponse:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update document tags")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

        tag = await models.DocumentTag.get(uid=uid)
        if not tag:
            return OperationError(
                error=f"Tag with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = tag.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(tag, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.DocumentTagUpdate(**tag.to_dict())
        tag = await tag.update(obj_in)
        return types.DocumentTagType(**tag.marshal_simple())

    @strawberry.mutation
    async def create_document_category(self, info, name: str) -> DocumentCategoryResponse:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create document categories")

        if not name:
            return OperationError(
                error="Please Provide a category name"
            )

        exists = await models.DocumentCategory.get(name=name)
        if exists:
            return OperationError(
                error=f"Document Category {name} already exists"
            )

        incoming = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid
        }
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.DocumentCategoryCreate(**incoming)
        category: models.DocumentCategory = await models.DocumentCategory.create(obj_in)
        return types.DocumentCategoryType(**category.marshal_simple())

    @strawberry.mutation
    async def update_document_category(self, info, uid: int, name: Optional[str] = None) -> DocumentCategoryResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update document categories")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

        category = await models.DocumentCategory.get(uid=uid)
        if not category:
            return OperationError(
                error=f"Category with uid {uid} not found. Cannot update obj ..."
            )

        try:
            setattr(category, "name", name)
        except Exception as e:
            logger.warning(e)

        obj_in = schemas.DocumentCategoryUpdate(**category.to_dict())
        category = await category.update(obj_in)
        return types.DocumentCategoryType(**category.marshal_simple())

    @strawberry.mutation
    async def create_document(self, info, payload: MarkdownInputType) -> DocumentResponse:  # noqa

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create document")

        if not payload.name:
            return OperationError(
                error="Please Provide a name"
            )

        exists = models.Document.get(name=payload.name)
        if exists:
            payload.name += " Copy"

        incoming = {
            "name": payload.name,
            "content": f"## {payload.name}",
            "status": conf.states.DRAFT,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        if payload.tags_uids:
            tags = []
            for _tag_uid in payload.tags_uids:
                tag = await models.DocumentTag.get(uid=_tag_uid)
                if tag:
                    tags.append(tag)
            incoming['tags'] = tags

        obj_in = schemas.DocumentCreate(**incoming)
        document: models.Document = await models.Document.create(obj_in)
        return types.DocumentType(**document.marshal_simple())

    @strawberry.mutation
    async def update_document(root, info, uid: int, payload: MarkdownInputType) -> DocumentResponse:  # noqa

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update document")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

        document = await models.Document.get(uid=uid)
        if not document:
            return OperationError(
                error=f"Document with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = document.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(document, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        document.tags.clear()
        if payload.tags_uids:
            tags = []
            for _tag_uid in payload.tags_uids:
                tag = await models.DocumentTag.get(uid=_tag_uid)
                if tag:
                    tags.append(tag)
            setattr(document, 'tags', tags)

        obj_in = schemas.DocumentUpdate(**document.to_dict())
        document = await document.update(obj_in)
        return types.DocumentType(**document.marshal_simple())
