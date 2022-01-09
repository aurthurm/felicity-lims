from typing import List, Optional

import strawberry  # noqa
from felicity.apps.markdown import models
from felicity.gql.markdown.types import (
    DocumentCategoryType,
    DocumentTagType,
    DocumentType,
)

## deprecated soon


@strawberry.type
class MarkDownQuery:
    @strawberry.field
    async def document_all(self, info) -> Optional[List[DocumentType]]:
        return await models.Document.all()

    @strawberry.field
    async def document_tag_all(self, info) -> Optional[List[DocumentTagType]]:
        return await models.DocumentTag.all()

    @strawberry.field
    async def document_category_all(self, info) -> Optional[List[DocumentCategoryType]]:
        return await models.DocumentCategory.all()

    @strawberry.field
    async def document_by_uid(self, info, uid: int) -> Optional[DocumentType]:
        return await models.Document.get(uid=uid)

    @strawberry.field
    async def documents_by_tag(self, info, tag: str) -> Optional[DocumentType]:
        return await models.Document.where(tags___name__ilike=f"%{tag}%").all()

    @strawberry.field
    async def documents_by_category(
        self, info, category: str
    ) -> Optional[List[DocumentType]]:
        return await models.Document.where(category___name__ilike=f"%{category}%").all()

    @strawberry.field
    async def documents_search(self, info, query_string: str) -> List[DocumentType]:
        filters = [
            "name__ilike",
            "subtitle__ilike",
            "document_id__ilike",
            "tags___name__ilike",
        ]
        combined = set()
        for _filter in filters:
            arg = dict()
            arg[_filter] = f"%{query_string}%"
            query = await models.Document.where(**arg).all()
            for item in query:
                combined.add(item)
        return list(combined)
