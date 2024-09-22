from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa

from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.reflex.types import (
    ReflexRuleCursorPage,
    ReflexRuleEdge,
    ReflexRuleType,
)
from felicity.api.gql.types import PageInfo
from felicity.apps.reflex.services import ReflexRuleService
from felicity.utils import has_value_or_is_truthy


@strawberry.type
class ReflexRuleQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def reflex_rule_all(
        self,
        info,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        sort_by: list[str] | None = None,
    ) -> ReflexRuleCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["name__ilike", "description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        page = await ReflexRuleService().paging_filter(
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

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def reflex_rule_by_uid(self, info, uid: str) -> Optional[ReflexRuleType]:
        return await ReflexRuleService().get(uid=uid)
