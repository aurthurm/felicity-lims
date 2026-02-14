import logging
from typing import List

import strawberry  # noqa
from sqlalchemy import select

from beak.api.gql.auth import auth_from_info
from beak.api.gql.permissions import IsAuthenticated
from beak.api.gql.reflex.types import (
    ReflexRuleType,
    #  Types
    ReflexTriggerType,
    ReflexDecisionType,
)
from beak.api.gql.types import OperationError
from beak.api.gql.types.generic import DeletedItem, DeleteResponse
from beak.apps.reflex import schemas
from beak.apps.reflex.services import (
    ReflexRuleService,
    ReflexTriggerService,
    ReflexDecisionService,
    ReflexRuleGroupService,
    ReflexRuleCriteriaService,
    ReflexAddAnalysisService,
    ReflexFinalizeAnalysisService,
    ReflexDecisionExecutionService,
)
from beak.apps.reflex.entities import ReflexDecision, ReflexTrigger

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ReflexRuleInput:
    name: str
    description: str | None = ""
    is_active: bool | None = None  # None = no change, True = published, False = draft


ReflexRuleResponse = strawberry.union(
    "ReflexRuleResponse",
    (ReflexRuleType, OperationError),
    description="",  # noqa
)


@strawberry.input
class ReflexTriggerInput:
    """Input type for creating/updating reflex triggers ( schema)"""
    reflex_rule_uid: str
    level: int = 1
    description: str
    sample_type_uid: str | None = None
    analyses: List[str] | None = None
    pos_x: float | None = None
    pos_y: float | None = None


@strawberry.input
class ReflexRuleCriteriaInput:
    """Input type for individual rule criteria ( schema)"""
    analysis_uid: str
    operator: str
    value: str
    priority: int = 0


@strawberry.input
class ReflexRuleGroupInput:
    """Input type for rule groups ( schema)"""
    description: str | None = None
    priority: int = 0
    rules: List[ReflexRuleCriteriaInput] | None = None
    pos_x: float | None = None
    pos_y: float | None = None


@strawberry.input
class ReflexAddAnalysisInput:
    """Input type for add analysis actions ( schema)"""
    analysis_uid: str
    count: int = 1
    pos_x: float | None = None
    pos_y: float | None = None


@strawberry.input
class ReflexFinalizeAnalysisInput:
    """Input type for finalize analysis actions ( schema)"""
    analysis_uid: str
    value: str
    pos_x: float | None = None
    pos_y: float | None = None


@strawberry.input
class ReflexDecisionInput:
    """Input type for creating/updating reflex decisions ( schema)"""
    reflex_trigger_uid: str
    description: str | None = None
    priority: int = 0
    rule_groups: List[ReflexRuleGroupInput] | None = None
    add_analyses: List[ReflexAddAnalysisInput] | None = None
    finalize_analyses: List[ReflexFinalizeAnalysisInput] | None = None
    pos_x: float | None = None
    pos_y: float | None = None


# Response unions
ReflexTriggerResponse = strawberry.union(
    "ReflexTriggerResponse",
    (ReflexTriggerType, OperationError),
    description="Response for reflex trigger mutations",
)

ReflexDecisionResponse = strawberry.union(
    "ReflexDecisionResponse",
    (ReflexDecisionType, OperationError),
    description="Response for reflex decision mutations",
)


@strawberry.input
class ReflexRuleGraphNode:
    """Represents a node in the Vue Flow graph"""
    id: str
    type: str  # trigger, decision, rule, action
    position_x: float
    position_y: float
    data: strawberry.scalars.JSON  # Node-specific data


@strawberry.input
class ReflexRuleGraphEdge:
    """Represents an edge/connection in the Vue Flow graph"""
    source: str
    target: str
    source_handle: str | None = None
    target_handle: str | None = None


@strawberry.input
class ReflexRuleGraphInput:
    """Input type for saving entire reflex rule graph"""
    nodes: List[ReflexRuleGraphNode]
    edges: List[ReflexRuleGraphEdge]


@strawberry.type
class ReflexRuleMutations:
    @staticmethod
    async def _clear_reflex_decision_rule_groups(
            decision_uid: str, session=None
    ) -> None:
        """Remove decision rule groups and criteria before re-creating them."""
        rule_groups = await ReflexRuleGroupService().get_all(
            reflex_decision_uid=decision_uid, session=session
        )
        for group in rule_groups:
            await ReflexRuleCriteriaService().delete_where(
                reflex_rule_group_uid=group.uid, session=session
            )

        await ReflexRuleGroupService().delete_where(
            reflex_decision_uid=decision_uid, session=session
        )

    @staticmethod
    async def _clear_reflex_decision_children(
            decision_uid: str, session=None
    ) -> None:
        """Remove decision child records before re-creating them."""
        await ReflexRuleMutations._clear_reflex_decision_rule_groups(
            decision_uid, session=session
        )
        await ReflexAddAnalysisService().delete_where(
            reflex_decision_uid=decision_uid, session=session
        )
        await ReflexFinalizeAnalysisService().delete_where(
            reflex_decision_uid=decision_uid, session=session
        )

    @staticmethod
    async def _delete_reflex_decision_tree(
            decision_uid: str, session=None
    ) -> None:
        """Delete a decision and all dependent records."""
        await ReflexRuleMutations._clear_reflex_decision_children(
            decision_uid, session=session
        )
        await ReflexDecisionExecutionService().delete_where(
            reflex_decision_uid=decision_uid, session=session
        )
        await ReflexDecisionService().delete(decision_uid, session=session)

    @staticmethod
    async def _sync_reflex_trigger_analyses(
            trigger_uid: str, analyses: list[str], session=None
    ) -> None:
        """Ensure reflex trigger analysis links match the provided list."""
        from beak.apps.reflex.entities import reflex_trigger_analysis

        await ReflexTriggerService().table_delete(
            table=reflex_trigger_analysis,
            reflex_trigger_uid=trigger_uid,
            session=session,
        )

        if not analyses:
            return

        mappings = [
            {"analysis_uid": uid, "reflex_trigger_uid": trigger_uid}
            for uid in analyses
        ]
        await ReflexTriggerService().table_insert(
            table=reflex_trigger_analysis, mappings=mappings, session=session
        )

    @staticmethod
    async def _create_decision_children(
            decision_uid: str,
            rule_groups: list[dict],
            add_analyses: list[dict],
            finalize_analyses: list[dict],
            session=None,
    ) -> None:
        """Create rule groups and actions tied to a decision."""
        for group_data in rule_groups or []:
            group_in = schemas.ReflexRuleGroupCreate(
                reflex_decision_uid=decision_uid,
                description=group_data.get("description"),
                priority=group_data.get("priority", 0),
                pos_x=group_data.get("pos_x"),
                pos_y=group_data.get("pos_y"),
            )
            group = await ReflexRuleGroupService().create(group_in, session=session)

            for rule_data in group_data.get("rules", []) or []:
                if not rule_data.get("analysis_uid"):
                    continue

                rule_in = schemas.ReflexRuleCriteriaCreate(
                    reflex_rule_group_uid=group.uid,
                    analysis_uid=rule_data["analysis_uid"],
                    operator=rule_data["operator"],
                    value=rule_data["value"],
                    priority=rule_data.get("priority", 0),
                )
                await ReflexRuleCriteriaService().create(rule_in, session=session)

        for add_data in add_analyses or []:
            if not add_data.get("analysis_uid"):
                continue

            add_in = schemas.ReflexAddAnalysisCreate(
                reflex_decision_uid=decision_uid,
                analysis_uid=add_data["analysis_uid"],
                count=add_data.get("count", 1),
                pos_x=add_data.get("pos_x"),
                pos_y=add_data.get("pos_y"),
            )
            await ReflexAddAnalysisService().create(add_in, session=session)

        for finalize_data in finalize_analyses or []:
            if not finalize_data.get("analysis_uid"):
                continue

            finalize_in = schemas.ReflexFinalizeAnalysisCreate(
                reflex_decision_uid=decision_uid,
                analysis_uid=finalize_data["analysis_uid"],
                value=finalize_data.get("value", ""),
                pos_x=finalize_data.get("pos_x"),
                pos_y=finalize_data.get("pos_y"),
            )
            await ReflexFinalizeAnalysisService().create(finalize_in, session=session)

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_reflex_rule(
            self, info, payload: ReflexRuleInput
    ) -> ReflexRuleResponse:
        beak_user = await auth_from_info(info)

        if not payload.name or not payload.description:
            return OperationError(error="Name and Description are required")

        exists = await ReflexRuleService().get(name=payload.name)
        if exists:
            return OperationError(error="Reflex Rule name must be unique")

        incoming: dict = {
            "created_by_uid": beak_user.uid,
            "updated_by_uid": beak_user.uid,
        }
        # Only include non-None values from payload to allow schema defaults
        for k, v in payload.__dict__.items():
            if v is not None:
                incoming[k] = v

        obj_in = schemas.ReflexRuleCreate(**incoming)
        reflex = await ReflexRuleService().create(obj_in)
        return ReflexRuleType(**reflex.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_reflex_rule(
            self, info, uid: str, payload: ReflexRuleInput
    ) -> ReflexRuleResponse:
        beak_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        reflex_rule = await ReflexRuleService().get(uid=uid)
        if not reflex_rule:
            return OperationError(
                error=f"reflex_rule with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = reflex_rule.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                # Only update if value is not None to preserve existing values
                value = payload.__dict__[field]
                if value is not None:
                    try:
                        setattr(reflex_rule, field, value)
                    except (AttributeError, TypeError) as e:
                        logger.warning(f"Cannot set field {field} on reflex_rule: {e}")

        setattr(reflex_rule, "updated_by_uid", beak_user.uid)

        obj_in = schemas.ReflexRuleUpdate(**reflex_rule.to_dict())
        reflex_rule = await ReflexRuleService().update(reflex_rule.uid, obj_in)
        return ReflexRuleType(**reflex_rule.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_reflex_trigger(
            self, info, payload: "ReflexTriggerInput"
    ) -> "ReflexTriggerResponse":
        """Create a new reflex trigger ( schema)"""
        beak_user = await auth_from_info(info)

        if not payload.reflex_rule_uid or not payload.description:
            return OperationError(error="Reflex rule UID and description are required")

        incoming: dict = {
            "reflex_rule_uid": payload.reflex_rule_uid,
            "level": payload.level,
            "description": payload.description,
            "sample_type_uid": payload.sample_type_uid,
            "created_by_uid": beak_user.uid,
            "updated_by_uid": beak_user.uid,
        }

        obj_in = schemas.ReflexTriggerCreate(**incoming)

        # Create trigger
        trigger = await ReflexTriggerService().create(obj_in)

        # Link analyses if provided
        analyses = [uid for uid in payload.analyses if uid] if payload.analyses else []

        if analyses:
            from beak.apps.reflex.entities import reflex_trigger_analysis

            await ReflexTriggerService().repository.table_insert(
                table=reflex_trigger_analysis,
                mappings=[
                    {
                        "analysis_uid": _anal_uid,
                        "reflex_trigger_uid": trigger.uid,
                    }
                    for _anal_uid in analyses
                ],
            )

        trigger = await ReflexTriggerService().get(
            uid=trigger.uid, related=["analyses", "decisions"]
        )
        return ReflexTriggerType(**trigger.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_reflex_decision(
            self, info, payload: "ReflexDecisionInput"
    ) -> "ReflexDecisionResponse":
        """Create a new reflex decision with rule groups and actions ( schema)"""
        beak_user = await auth_from_info(info)

        if not payload.reflex_trigger_uid:
            return OperationError(error="Reflex trigger UID is required")

        async with ReflexDecisionService().transaction() as session:
            # Create decision
            decision_in = schemas.ReflexDecisionCreate(
                reflex_trigger_uid=payload.reflex_trigger_uid,
                description=payload.description,
                priority=payload.priority,
                created_by_uid=beak_user.uid,
                updated_by_uid=beak_user.uid,
            )
            decision = await ReflexDecisionService().create(decision_in, session=session)

            # Create rule groups and rules
            if payload.rule_groups:
                for rule_group_input in payload.rule_groups:
                    group_in = schemas.ReflexRuleGroupCreate(
                        reflex_decision_uid=decision.uid,
                        description=rule_group_input.description,
                        priority=rule_group_input.priority,
                        created_by_uid=beak_user.uid,
                        updated_by_uid=beak_user.uid,
                    )
                    group = await ReflexRuleGroupService().create(group_in, session=session)

                    # Create rules within group
                    if rule_group_input.rules:
                        for rule_input in rule_group_input.rules:
                            rule_in = schemas.ReflexRuleCriteriaCreate(
                                reflex_rule_group_uid=group.uid,
                                analysis_uid=rule_input.analysis_uid,
                                operator=rule_input.operator,
                                value=rule_input.value,
                                priority=rule_input.priority,
                                created_by_uid=beak_user.uid,
                                updated_by_uid=beak_user.uid,
                            )
                            await ReflexRuleCriteriaService().create(rule_in, session=session)

            # Create add analysis actions
            if payload.add_analyses:
                for add_input in payload.add_analyses:
                    add_in = schemas.ReflexAddAnalysisCreate(
                        reflex_decision_uid=decision.uid,
                        analysis_uid=add_input.analysis_uid,
                        count=add_input.count,
                        created_by_uid=beak_user.uid,
                        updated_by_uid=beak_user.uid,
                    )
                    await ReflexAddAnalysisService().create(add_in, session=session)

            # Create finalize analysis actions
            if payload.finalize_analyses:
                for final_input in payload.finalize_analyses:
                    final_in = schemas.ReflexFinalizeAnalysisCreate(
                        reflex_decision_uid=decision.uid,
                        analysis_uid=final_input.analysis_uid,
                        value=final_input.value,
                        created_by_uid=beak_user.uid,
                        updated_by_uid=beak_user.uid,
                    )
                    await ReflexFinalizeAnalysisService().create(final_in, session=session)

        decision = await ReflexDecisionService().get(
            uid=decision.uid,
            related=[
                "rule_groups.rules",
                "add_analyses",
                "finalize_analyses",
            ],
        )
        return ReflexDecisionType(**decision.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_reflex_decision(
            self, info, uid: str, payload: "ReflexDecisionInput"
    ) -> "ReflexDecisionResponse":
        """Update a reflex decision and its actions (schema)."""
        beak_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        existing = await ReflexDecisionService().get(uid=uid)
        if not existing:
            return OperationError(
                error=f"reflex_decision with uid {uid} not found. Cannot update obj ..."
            )

        async with ReflexDecisionService().transaction() as session:
            decision = await ReflexDecisionService().get(uid=uid, session=session)
            for field in ("reflex_trigger_uid", "description", "priority"):
                value = getattr(payload, field)
                if value is not None:
                    setattr(decision, field, value)
            setattr(decision, "updated_by_uid", beak_user.uid)
            await ReflexDecisionService().save(decision, session=session)

            if payload.rule_groups is not None:
                await ReflexRuleMutations._clear_reflex_decision_rule_groups(
                    decision.uid, session=session
                )

                for rule_group_input in payload.rule_groups:
                    group_in = schemas.ReflexRuleGroupCreate(
                        reflex_decision_uid=decision.uid,
                        description=rule_group_input.description,
                        priority=rule_group_input.priority,
                        created_by_uid=beak_user.uid,
                        updated_by_uid=beak_user.uid,
                    )
                    group = await ReflexRuleGroupService().create(
                        group_in, session=session
                    )

                    if rule_group_input.rules:
                        for rule_input in rule_group_input.rules:
                            rule_in = schemas.ReflexRuleCriteriaCreate(
                                reflex_rule_group_uid=group.uid,
                                analysis_uid=rule_input.analysis_uid,
                                operator=rule_input.operator,
                                value=rule_input.value,
                                priority=rule_input.priority,
                                created_by_uid=beak_user.uid,
                                updated_by_uid=beak_user.uid,
                            )
                            await ReflexRuleCriteriaService().create(
                                rule_in, session=session
                            )

            if payload.add_analyses is not None:
                await ReflexAddAnalysisService().delete_where(
                    reflex_decision_uid=decision.uid, session=session
                )
                for add_input in payload.add_analyses:
                    add_in = schemas.ReflexAddAnalysisCreate(
                        reflex_decision_uid=decision.uid,
                        analysis_uid=add_input.analysis_uid,
                        count=add_input.count,
                        created_by_uid=beak_user.uid,
                        updated_by_uid=beak_user.uid,
                    )
                    await ReflexAddAnalysisService().create(add_in, session=session)

            if payload.finalize_analyses is not None:
                await ReflexFinalizeAnalysisService().delete_where(
                    reflex_decision_uid=decision.uid, session=session
                )
                for final_input in payload.finalize_analyses:
                    final_in = schemas.ReflexFinalizeAnalysisCreate(
                        reflex_decision_uid=decision.uid,
                        analysis_uid=final_input.analysis_uid,
                        value=final_input.value,
                        created_by_uid=beak_user.uid,
                        updated_by_uid=beak_user.uid,
                    )
                    await ReflexFinalizeAnalysisService().create(
                        final_in, session=session
                    )

        decision = await ReflexDecisionService().get(
            uid=uid,
            related=[
                "rule_groups.rules",
                "add_analyses",
                "finalize_analyses",
            ],
        )
        return ReflexDecisionType(**decision.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_reflex_trigger(
            self, info, uid: str, payload: "ReflexTriggerInput"
    ) -> "ReflexTriggerResponse":
        """Update a reflex trigger (schema)."""
        beak_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        trigger = await ReflexTriggerService().get(uid=uid)
        if not trigger:
            return OperationError(
                error=f"reflex_trigger with uid {uid} not found. Cannot update obj ..."
            )

        update_data = {"updated_by_uid": beak_user.uid}
        for field in ("reflex_rule_uid", "level", "description", "sample_type_uid"):
            value = getattr(payload, field)
            if value is not None:
                update_data[field] = value

        obj_in = schemas.ReflexTriggerUpdate(**update_data)
        trigger = await ReflexTriggerService().update(trigger.uid, obj_in)

        if payload.analyses is not None:
            from beak.apps.reflex.entities import reflex_trigger_analysis

            await ReflexTriggerService().table_delete(
                table=reflex_trigger_analysis, reflex_trigger_uid=trigger.uid
            )

            if payload.analyses:
                await ReflexTriggerService().table_insert(
                    table=reflex_trigger_analysis,
                    mappings=[
                        {
                            "analysis_uid": _anal_uid,
                            "reflex_trigger_uid": trigger.uid,
                        }
                        for _anal_uid in payload.analyses
                    ],
                )

        trigger = await ReflexTriggerService().get(
            uid=trigger.uid, related=["analyses", "decisions"]
        )
        return ReflexTriggerType(**trigger.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_reflex_trigger(self, info, uid: str) -> DeleteResponse:
        """Delete a reflex trigger and its decisions."""
        trigger = await ReflexTriggerService().get(uid=uid, related=["decisions"])
        if not trigger:
            return OperationError(error=f"reflex_trigger with uid {uid} not found.")

        async with ReflexTriggerService().transaction() as session:
            trigger = await ReflexTriggerService().get(
                uid=uid, related=["decisions"], session=session
            )
            for decision in trigger.decisions or []:
                await ReflexRuleMutations._delete_reflex_decision_tree(
                    decision.uid, session=session
                )

            from beak.apps.reflex.entities import reflex_trigger_analysis

            await ReflexTriggerService().table_delete(
                table=reflex_trigger_analysis,
                reflex_trigger_uid=trigger.uid,
                session=session,
            )
            await ReflexTriggerService().delete(trigger.uid, session=session)

        return DeletedItem(uid=uid)

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_reflex_decision(self, info, uid: str) -> DeleteResponse:
        """Delete a reflex decision and its dependent records."""
        decision = await ReflexDecisionService().get(uid=uid)
        if not decision:
            return OperationError(error=f"reflex_decision with uid {uid} not found.")

        async with ReflexDecisionService().transaction() as session:
            await ReflexRuleMutations._delete_reflex_decision_tree(uid, session=session)

        return DeletedItem(uid=uid)

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def save_reflex_rule_graph(
            self, info, uid: str, graph: ReflexRuleGraphInput
    ) -> ReflexRuleResponse:
        """
        Save entire reflex rule graph (unified create/update).

        Converts Vue Flow nodes/edges to backend entities with positions.
        Handles both create and update based on entity UIDs in node data.

        Args:
            uid: ReflexRule UID
            graph: Graph structure with nodes and edges

        Returns:
            Complete ReflexRule with all nested entities and positions
        """
        try:
            # Verify rule exists
            rule = await ReflexRuleService().get(uid=uid)
            if not rule:
                return OperationError(error=f"ReflexRule with uid {uid} not found")

            # Build edge lookup map for relationships
            edge_map = {}
            for edge in graph.edges:
                if edge.source not in edge_map:
                    edge_map[edge.source] = []
                edge_map[edge.source].append(edge)

            # Group nodes by type
            triggers = [n for n in graph.nodes if n.type == 'trigger']
            decisions = [n for n in graph.nodes if n.type == 'decision']
            rules = [n for n in graph.nodes if n.type == 'rule']
            actions = [n for n in graph.nodes if n.type == 'action']

            async with ReflexTriggerService().transaction() as session:
                existing_trigger_uids = set(
                    (
                        await session.execute(
                            select(ReflexTrigger.uid).where(
                                ReflexTrigger.reflex_rule_uid == uid
                            )
                        )
                    )
                    .scalars()
                    .all()
                )
                graph_trigger_uids: set[str] = set()
                # Process triggers
                for trigger_node in triggers:
                    data = trigger_node.data
                    analyses_raw = data.get('analyses') or []
                    analysis_uids: list[str] = []
                    for entry in analyses_raw:
                        if isinstance(entry, dict):
                            uid_value = entry.get('uid') or entry.get('analysis_uid')
                        else:
                            uid_value = entry
                        if uid_value:
                            analysis_uids.append(uid_value)

                    payload = schemas.ReflexTriggerCreate(
                        reflex_rule_uid=uid,
                        level=data.get('level', 1),
                        description=data.get('description', ''),
                        sample_type_uid=data.get('sample_type_uid'),
                        pos_x=trigger_node.position_x,
                        pos_y=trigger_node.position_y,
                    )

                    if 'uid' in data and data['uid']:
                        # Update existing
                        await ReflexTriggerService().update(
                            data['uid'], payload, session=session
                        )
                        trigger_uid = data['uid']
                    else:
                        # Create new
                        trigger = await ReflexTriggerService().create(
                            payload, session=session
                        )
                        trigger_uid = trigger.uid
                    graph_trigger_uids.add(trigger_uid)

                    # Process decisions connected to this trigger
                    trigger_edges = edge_map.get(trigger_node.id, [])
                    graph_decision_uids: set[str] = set()
                    for edge in trigger_edges:
                        decision_node = next((d for d in decisions if d.id == edge.target), None)
                        if not decision_node:
                            continue

                        # Get all rules and actions connected to this decision
                        decision_edges = edge_map.get(decision_node.id, [])

                        # Build rule groups (from rule nodes)
                        rule_groups_data: list[dict] = []
                        for dec_edge in decision_edges:
                            if dec_edge.source_handle == 'rules':
                                rule_node = next((r for r in rules if r.id == dec_edge.target), None)
                                if rule_node:
                                    rule_data = rule_node.data or {}
                                    criteria = []
                                    for crit in rule_data.get('criteria', []) or []:
                                        analysis_uid = crit.get('analysis_uid')
                                        operator = crit.get('operator')
                                        value = crit.get('value')
                                        if not (analysis_uid and operator and value is not None):
                                            continue
                                        criteria.append(
                                            {
                                                "analysis_uid": analysis_uid,
                                                "operator": operator,
                                                "value": value,
                                                "priority": crit.get('priority', 0),
                                            }
                                        )
                                    if not criteria:
                                        analysis_uid = rule_data.get("analysis_uid")
                                        operator = rule_data.get("operator")
                                        value = rule_data.get("value")
                                        if analysis_uid and operator and value is not None:
                                            criteria.append(
                                                {
                                                    "analysis_uid": analysis_uid,
                                                    "operator": operator,
                                                    "value": value,
                                                    "priority": rule_data.get("priority", 0),
                                                }
                                            )

                                    rule_groups_data.append(
                                        {
                                            "description": rule_data.get("description"),
                                            "priority": rule_data.get("priority", 0),
                                            "rules": criteria,
                                            "pos_x": rule_node.position_x,
                                            "pos_y": rule_node.position_y,
                                        }
                                    )

                        # Build add/finalize analyses (from action nodes)
                        add_analyses_data: list[dict] = []
                        finalize_analyses_data: list[dict] = []
                        for dec_edge in decision_edges:
                            if dec_edge.source_handle == 'actions':
                                action_node = next((a for a in actions if a.id == dec_edge.target), None)
                                if not action_node:
                                    continue
                                action_data = action_node.data or {}
                                if action_data.get("actionType") == "add":
                                    add_analyses_data.append(
                                        {
                                            "analysis_uid": action_data.get("analysis_uid"),
                                            "count": action_data.get("count", 1),
                                            "pos_x": action_node.position_x,
                                            "pos_y": action_node.position_y,
                                        }
                                    )
                                elif action_data.get("actionType") == "finalize":
                                    finalize_analyses_data.append(
                                        {
                                            "analysis_uid": action_data.get("analysis_uid"),
                                            "value": action_data.get("value"),
                                            "pos_x": action_node.position_x,
                                            "pos_y": action_node.position_y,
                                        }
                                    )

                        # Save decision with nested structures
                        decision_data = decision_node.data
                        decision_payload = schemas.ReflexDecisionCreate(
                            reflex_trigger_uid=trigger_uid,
                            description=decision_data.get("description"),
                            priority=decision_data.get("priority", 0),
                            pos_x=decision_node.position_x,
                            pos_y=decision_node.position_y,
                        )

                        if 'uid' in decision_data and decision_data['uid']:
                            # Update existing decision
                            await ReflexRuleMutations._clear_reflex_decision_children(
                                decision_data['uid'], session=session
                            )
                            await ReflexDecisionService().update(
                                decision_data['uid'], decision_payload, session=session
                            )
                            await ReflexRuleMutations._create_decision_children(
                                decision_data['uid'],
                                rule_groups_data,
                                add_analyses_data,
                                finalize_analyses_data,
                                session=session,
                            )
                            graph_decision_uids.add(decision_data['uid'])
                        else:
                            # Create new decision
                            decision = await ReflexDecisionService().create(
                                decision_payload, session=session
                            )
                            await ReflexRuleMutations._create_decision_children(
                                decision.uid,
                                rule_groups_data,
                                add_analyses_data,
                                finalize_analyses_data,
                                session=session,
                            )
                            graph_decision_uids.add(decision.uid)
                    await ReflexRuleMutations._sync_reflex_trigger_analyses(
                        trigger_uid, analysis_uids, session=session
                    )
                    existing_decision_uids = set(
                        (
                            await session.execute(
                                select(ReflexDecision.uid).where(
                                    ReflexDecision.reflex_trigger_uid == trigger_uid
                                )
                            )
                        )
                        .scalars()
                        .all()
                    )
                    for decision_uid in existing_decision_uids - graph_decision_uids:
                        await ReflexRuleMutations._delete_reflex_decision_tree(
                            decision_uid, session=session
                        )

                for trigger_uid in existing_trigger_uids - graph_trigger_uids:
                    existing_decision_uids = set(
                        (
                            await session.execute(
                                select(ReflexDecision.uid).where(
                                    ReflexDecision.reflex_trigger_uid == trigger_uid
                                )
                            )
                        )
                        .scalars()
                        .all()
                    )
                    for decision_uid in existing_decision_uids:
                        await ReflexRuleMutations._delete_reflex_decision_tree(
                            decision_uid, session=session
                        )
                    from beak.apps.reflex.entities import reflex_trigger_analysis

                    await ReflexTriggerService().table_delete(
                        table=reflex_trigger_analysis,
                        reflex_trigger_uid=trigger_uid,
                        session=session,
                    )
                    await ReflexTriggerService().delete(trigger_uid, session=session)

            # Return complete rule with all nested data
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
            return ReflexRuleType(**rule.marshal_simple())

        except Exception as e:
            logger.error(f"Error saving reflex rule graph: {e}")
            return OperationError(
                error=f"Failed to save reflex rule graph: {str(e)}",
                suggestion="Check node data structure and ensure all required fields are provided"
            )
