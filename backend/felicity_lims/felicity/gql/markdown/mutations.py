import inspect
import logging
from typing import Optional, List

import strawberry

from felicity.apps.markdown import schemas, models, conf
from felicity.gql.markdown import types
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class MarkdownMutations:
    @strawberry.mutation
    async def create_document_tag(self, info, name: str) -> types.DocumentTagType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not name:
            raise Exception("Please Provide a Tag name")

        exists = await models.DocumentTag.get(name=name)
        if exists:
            raise Exception(f"DocumentTag {name} already exists")

        incoming = {}
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.DocumentTagCreate(**incoming)
        tag: models.DocumentTag = await models.DocumentTag.create(obj_in)
        return tag

    @strawberry.mutation
    async def update_document_tag(self, info, uid: int, name: Optional[str] = None) -> types.DocumentTagType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identify update obj")

        tag = await models.DocumentTag.get(uid=uid)
        if not tag:
            raise Exception(f"Tag with uid {uid} not found. Cannot update obj ...")

        obj_data = tag.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(tag, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.DocumentTagUpdate(**tag.to_dict())
        tag = await tag.update(obj_in)
        return tag

    @strawberry.mutation
    async def create_document_category(self, info, name: str) -> types.DocumentCategoryType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not name:
            raise Exception("Please Provide a category name")

        exists = await models.DocumentCategory.get(name=name)
        if exists:
            raise Exception(f"Document Category {name} already exists")

        incoming = {}
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.DocumentCategoryCreate(**incoming)
        category: models.DocumentCategory = await models.DocumentCategory.create(obj_in)
        return category

    @strawberry.mutation
    async def update_document_category(self, info, uid: int, name: Optional[str] = None) -> types.DocumentCategoryType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identify update obj")

        category = await models.DocumentCategory.get(uid=uid)
        if not category:
            raise Exception(f"Category with uid {uid} not found. Cannot update obj ...")

        obj_data = category.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(category, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.DocumentCategoryUpdate(**category.to_dict())
        category = await category.update(obj_in)
        return category

    @strawberry.mutation
    async def create_document(self, info, name: str, subtitle: Optional[str] = None, document_id: Optional[str] = None,  # noqa
                              version: Optional[str] = None, department_uid: Optional[int] = None, category_uid: Optional[int] = None,  # noqa
                              tags_uids: Optional[List[int]] = None) -> types.DocumentType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not name:
            raise Exception("Please Provide a name")

        exists = models.Document.get(name=name)
        if exists:
            name += " Copy"

        incoming = {
            "name": name,
            "content": f"## {name}",
            "status": conf.states.DRAFT,
        }
        for k, v in passed_args.items():
            incoming[k] = v

        tags_uids = passed_args.get('tags_uids', [])
        if tags_uids:
            tags = []
            for _tag_uid in tags_uids:
                tag = await models.DocumentTag.get(uid=_tag_uid)
                if tag:
                    tags.append(tag)
            incoming['tags'] = tags

        obj_in = schemas.DocumentCreate(**incoming)
        document: models.Document = await models.Document.create(obj_in)
        return document

    @strawberry.mutation
    async def update_document(root, info, uid: int, name: Optional[str] = None, subtitle: Optional[str] = None, document_id: Optional[str] = None,  # noqa
                        version: Optional[str] = None, department_uid: Optional[int] = None, category_uid: Optional[int] = None,  # noqa
                        tags_uids: Optional[List[int]] = None, content: Optional[str] = None) -> types.DocumentType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("No uid provided to identify update obj")

        document = await models.Document.get(uid=uid)
        if not document:
            raise Exception(f"Document with uid {uid} not found. Cannot update obj ...")

        obj_data = document.to_dict()
        for field in obj_data:
            if field in passed_args:
                try:
                    setattr(document, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        document.tags.clear()
        tags_uids = passed_args.get('tags_uids', [])
        if tags_uids:
            tags = []
            for _tag_uid in tags_uids:
                tag = await models.DocumentTag.get(uid=_tag_uid)
                if tag:
                    tags.append(tag)
            setattr(document, 'tags', tags)

        obj_in = schemas.DocumentUpdate(**document.to_dict())
        document = await document.update(obj_in)
        return document
