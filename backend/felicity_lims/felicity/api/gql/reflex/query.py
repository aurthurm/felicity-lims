from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa

from felicity.api.gql import PageInfo
from felicity.api.gql.reflex.types import (
    ReflexRuleCursorPage,
    ReflexRuleEdge,
    ReflexRuleType,
)
from felicity.core.uid_gen import FelicityID
from felicity.apps.reflex import models
from felicity.utils import has_value_or_is_truthy


@strawberry.type
class ReflexRuleQuery:
    @strawberry.field
    async def reflex_rule_all(
        self,
        info,
        page_size: Optional[int] = None,
        after_cursor: Optional[str] = None,
        before_cursor: Optional[str] = None,
        text: Optional[str] = None,
        sort_by: Optional[List[str]] = None,
    ) -> ReflexRuleCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["name__ilike", "description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        page = await models.ReflexRule.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[ReflexRuleEdge[ReflexRuleType]] = page.edges
        items: List[ReflexRuleType] = page.items
        page_info: PageInfo = page.page_info

        return ReflexRuleCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field
    async def reflex_rule_by_uid(self, info, uid: FelicityID) -> Optional[ReflexRuleType]:
        return await models.ReflexRule.get(uid=uid)
