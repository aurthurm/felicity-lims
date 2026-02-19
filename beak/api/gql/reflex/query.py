from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa

from beak.api.gql.permissions import IsAuthenticated
from beak.api.gql.reflex.types import (
    ReflexRuleCursorPage,
    ReflexRuleEdge,
    ReflexRuleType,
    ReflexTriggerType,
    ReflexDecisionType,
)
from beak.api.gql.types import PageInfo
from beak.modules.core.reflex.services import (
    ReflexRuleService,
    ReflexTriggerService,
    ReflexDecisionService,
)
from beak.utils import has_value_or_is_truthy


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
        """Fetch a reflex rule with full schema (triggers, decisions, rule groups)"""
        rule = await ReflexRuleService().get(
            uid=uid,
            related=[
                "reflex_triggers",
                "reflex_triggers.decisions",
                "reflex_triggers.decisions.rule_groups",
                "reflex_triggers.decisions.rule_groups.rules",
                "reflex_triggers.decisions.add_analyses",
                "reflex_triggers.decisions.finalize_analyses",
            ],
        )
        return rule

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def reflex_trigger_all(
            self,
            info,
            reflex_rule_uid: str | None = None,
    ) -> List[ReflexTriggerType]:
        """Fetch all reflex triggers, optionally filtered by rule"""
        filters = {}
        if reflex_rule_uid:
            filters["reflex_rule_uid"] = reflex_rule_uid

        triggers = await ReflexTriggerService().get_all(
            **filters,
            related=[
                "analyses",
                "decisions",
                "decisions.rule_groups",
                "decisions.rule_groups.rules",
                "decisions.add_analyses",
                "decisions.finalize_analyses",
            ],
        )
        return triggers

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def reflex_trigger_by_uid(
            self, info, uid: str
    ) -> Optional[ReflexTriggerType]:
        """Fetch a single reflex trigger by UID"""
        return await ReflexTriggerService().get(
            uid=uid,
            related=[
                "analyses",
                "decisions",
                "decisions.rule_groups",
                "decisions.rule_groups.rules",
                "decisions.add_analyses",
                "decisions.finalize_analyses",
            ],
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def reflex_decision_by_uid(
            self, info, uid: str
    ) -> Optional[ReflexDecisionType]:
        """Fetch a single reflex decision by UID"""
        return await ReflexDecisionService().get(
            uid=uid,
            related=[
                "rule_groups",
                "rule_groups.rules",
                "add_analyses",
                "finalize_analyses",
            ],
        )
