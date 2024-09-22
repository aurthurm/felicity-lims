import logging
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.reflex.types import (
    ReflexActionType,
    ReflexBrainType,
    ReflexRuleType,
)
from felicity.api.gql.types import OperationError, DeletedItem
from felicity.apps.analysis.services.analysis import AnalysisService
from felicity.apps.reflex import schemas
from felicity.apps.reflex.entities import (
    ReflexBrainAddition,
    ReflexBrainFinal,
    reflex_action_analysis,
    ReflexBrainConditionCriteria,
)
from felicity.apps.reflex.schemas import (
    ReflexBrainConditionCreate,
    ReflexBrainActionCreate,
)
from felicity.apps.reflex.services import (
    ReflexActionService,
    ReflexBrainService,
    ReflexRuleService,
    ReflexBrainAdditionService,
    ReflexBrainFinalService,
    ReflexBrainConditionCriteriaService,
    ReflexBrainActionService,
    ReflexBrainConditionService,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ReflexRuleInput:
    name: str
    description: str | None = ""


ReflexRuleResponse = strawberry.union(
    "ReflexRuleResponse",
    (ReflexRuleType, OperationError),
    description="",  # noqa
)


@strawberry.input
class ReflexActionInput:
    level: int
    description: str | None = ""
    analyses: List[str]
    reflex_rule_uid: str
    sample_type_uid: str | None = None


ReflexActionResponse = strawberry.union(
    "ReflexActionResponse",
    (ReflexActionType, OperationError),
    description="",  # noqa
)


@strawberry.input
class ReflexBrainCriteriaInput:
    analysis_uid: str
    operator: str
    value: str


@strawberry.input
class ReflexBrainConditionInput:
    description: str | None = ""
    priority: int | None = 0
    criteria: Optional[List[ReflexBrainCriteriaInput]] = None


@strawberry.input
class ReflexAddNewInput:
    analysis_uid: str
    count: int


@strawberry.input
class ReflexFinalInput:
    analysis_uid: str
    value: str


@strawberry.input
class ReflexBrainActionInput:
    add_new: Optional[List[ReflexAddNewInput]] = None
    finalise: Optional[List[ReflexFinalInput]] = None


@strawberry.input
class ReflexBrainInput:
    reflex_action_uid: str
    description: str | None = ""
    priority: int | None = 0
    conditions: Optional[List[ReflexBrainConditionInput]] = None
    actions: Optional[List[ReflexBrainActionInput]] = None


ReflexBrainResponse = strawberry.union(
    "ReflexBrainResponse",
    (ReflexBrainType, OperationError),
    description="",  # noqa
)


@strawberry.type
class ReflexRuleMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_reflex_rule(
        self, info, payload: ReflexRuleInput
    ) -> ReflexRuleResponse:
        felicity_user = await auth_from_info(info)

        if not payload.name or not payload.description:
            return OperationError(error="Name and Description are required")

        exists = await ReflexRuleService().get(name=payload.name)
        if exists:
            return OperationError(error="Reflex Rule name must be unique")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.ReflexRuleCreate(**incoming)
        reflex = await ReflexRuleService().create(obj_in)
        return ReflexRuleType(**reflex.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_reflex_rule(
        self, info, uid: str, payload: ReflexRuleInput
    ) -> ReflexRuleResponse:
        felicity_user = await auth_from_info(info)

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
                try:
                    setattr(reflex_rule, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(reflex_rule, "updated_by_uid", felicity_user.uid)

        obj_in = schemas.ReflexRuleUpdate(**reflex_rule.to_dict())
        reflex_rule = await ReflexRuleService().update(reflex_rule.uid, obj_in)
        return ReflexRuleType(**reflex_rule.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_reflex_action(
        self, info, payload: ReflexActionInput
    ) -> ReflexActionResponse:
        felicity_user = await auth_from_info(info)

        if (
            not len(payload.analyses) > 0
            or not isinstance(payload.level, int)
            or not payload.description
        ):
            return OperationError(
                error="Analysis, Level (as an integer) and description are required"
            )

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        del incoming["analyses"]

        obj_in = schemas.ReflexActionCreate(**incoming)

        analyses = []
        for _anal_uid in payload.analyses:
            _anal = await AnalysisService().get(uid=_anal_uid)
            analyses.append(_anal)

        action = await ReflexActionService().create(obj_in)
        for anal in analyses:
            await ReflexActionService().repository.table_insert(
                table=reflex_action_analysis,
                mappings=[
                    {
                        "analysis_uid": anal.uid,
                        "reflex_action_uid": action.uid,
                    }
                ],
            )

        return ReflexActionType(**action.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_reflex_action(
        self, info, uid: str, payload: ReflexActionInput
    ) -> ReflexActionResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        reflex_action = await ReflexActionService().get_related(
            uid=uid, related=["analyses"]
        )
        if not reflex_action:
            return OperationError(
                error=f"reflex_action with uid {uid} not found. Cannot update obj ..."
            )

        # Update simple fields where present in payload
        obj_data = reflex_action.to_dict()
        updated_fields = {
            field: payload.__dict__[field]
            for field in obj_data
            if field in payload.__dict__
        }
        for field, value in updated_fields.items():
            try:
                setattr(reflex_action, field, value)
            except Exception as e:
                print(
                    f"Error setting attribute {field}: {e}"
                )  # Replace with proper logging

        setattr(reflex_action, "updated_by_uid", felicity_user.uid)
        obj_in = schemas.ReflexActionUpdate(**reflex_action.to_dict())
        reflex_action = await ReflexActionService().update(reflex_action.uid, obj_in)

        for _anal_uid in payload.analyses:
            mappings = {
                "analysis_uid": _anal_uid,
                "reflex_action_uid": reflex_action.uid,
            }
            await ReflexActionService().repository.delete_table(
                table=reflex_action_analysis,
                **mappings,
            )
            await ReflexActionService().repository.table_insert(
                table=reflex_action_analysis,
                mappings=[mappings],
            )

        return ReflexActionType(**reflex_action.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_reflex_brain(
        self, info, payload: ReflexBrainInput
    ) -> ReflexBrainResponse:
        felicity_user = await auth_from_info(info)

        incoming: dict = {
            "reflex_action_uid": payload.reflex_action_uid,
            "description": payload.description,
            "priority": payload.priority,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        obj_in = schemas.ReflexBrainCreate(**incoming)

        # add a brain
        brain = await ReflexBrainService().create(obj_in)

        # add brain conditions
        for _condition in payload.conditions:
            con_in = ReflexBrainConditionCreate(
                reflex_brain_uid=brain.uid,
                description=_condition.description,
                priority=_condition.priority,
                created_by_uid=felicity_user.uid,
                updated_by_uid=felicity_user.uid,
            )
            condition = await ReflexBrainConditionService().create(
                con_in, related=["criteria"]
            )

            criteria = []
            for _crit in _condition.criteria:
                con_crit = ReflexBrainConditionCriteria()
                con_crit.reflex_brain_uid = brain.uid
                con_crit.operator = _crit.operator
                con_crit.value = _crit.value
                con_crit.analysis_uid = _crit.analysis_uid
                criteria.append(con_crit)
            condition.criteria = criteria
            await ReflexBrainConditionService().save(condition)

        # add brain actions
        for _action in payload.actions:
            act_in = ReflexBrainActionCreate(
                reflex_brain_uid=brain.uid,
                description="",
                priority=0,
                created_by_uid=felicity_user.uid,
                updated_by_uid=felicity_user.uid,
            )
            action = await ReflexBrainActionService().create(
                act_in, related=["add_new", "finalise"]
            )

            # add final action
            finalise = []
            for _final in _action.finalise:
                act_final = ReflexBrainFinal()
                act_final.reflex_brain_action_uid = brain.uid
                act_final.value = _final.value
                act_final.analysis_uid = _final.analysis_uid
                finalise.append(act_final)
            action.finalise = finalise

            add_new = []
            for add_n in _action.add_new:
                act_add = ReflexBrainAddition()
                act_add.count = add_n.count
                act_add.analysis_uid = add_n.analysis_uid
                act_add.reflex_brain_uid = brain.uid
                add_new.append(act_add)
            action.add_new = add_new

            await ReflexBrainActionService().save(action)

        brain = await ReflexBrainService().get_related(
            related=["conditions.criteria", "actions.add_new", "actions.finalise"],
            uid=brain.uid,
        )
        return ReflexBrainType(**brain.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_reflex_brain(
        self, info, uid: str, payload: ReflexBrainInput
    ) -> ReflexBrainResponse:
        felicity_user = await auth_from_info(info)

        # clear old
        # delete conditions
        conditions = await ReflexBrainConditionService().get_all(reflex_brain_uid=uid)
        for brain_cond in conditions:
            criteria = await ReflexBrainConditionCriteriaService().get_all(
                reflex_brain_condition_uid=brain_cond.uid
            )
            for cond_crit in criteria:
                await ReflexBrainConditionCriteriaService().delete(cond_crit.uid)
            await ReflexBrainConditionService().delete(brain_cond.uid)

        # delete actions
        brain_actions = await ReflexBrainActionService().get_all(reflex_brain_uid=uid)
        for rb_action in brain_actions:
            additions = await ReflexBrainAdditionService().get_all(
                reflex_brain_action_uid=rb_action.uid
            )
            finals = await ReflexBrainFinalService().get_all(
                reflex_brain_action_uid=rb_action.uid
            )
            for ad in additions:
                await ReflexBrainAdditionService().delete(ad.uid)
            for fin in finals:
                await ReflexBrainFinalService().delete(fin.uid)
            await ReflexBrainActionService().delete(rb_action.uid)

        # set anew
        brain = await ReflexBrainService().get(uid=uid)
        obj_data = brain.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(brain, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass
        setattr(brain, "updated_by_uid", felicity_user.uid)

        # add brain conditions
        conditions = []
        for _condition in payload.conditions:
            con_in = ReflexBrainConditionCreate(
                reflex_brain_uid=brain.uid,
                description=_condition.description,
                priority=_condition.priority,
                created_by_uid=felicity_user.uid,
                updated_by_uid=felicity_user.uid,
            )
            condition = await ReflexBrainConditionService().create(
                con_in, related=["criteria"]
            )

            criteria = []
            for _crit in _condition.criteria:
                con_crit = ReflexBrainConditionCriteria()
                con_crit.reflex_brain_uid = brain.uid
                con_crit.operator = _crit.operator
                con_crit.value = _crit.value
                con_crit.analysis_uid = _crit.analysis_uid
                criteria.append(con_crit)
            condition.criteria = criteria
            await ReflexBrainConditionService().save(condition)

            conditions.append(condition)

        # add brain actions
        actions = []
        for _action in payload.actions:
            act_in = ReflexBrainActionCreate(
                reflex_brain_uid=brain.uid,
                description="",
                priority=0,
                created_by_uid=felicity_user.uid,
                updated_by_uid=felicity_user.uid,
            )
            action = await ReflexBrainActionService().create(
                act_in, related=["add_new", "finalise"]
            )

            # add final action
            finalise = []
            for _final in _action.finalise:
                act_final = ReflexBrainFinal()
                act_final.reflex_brain_action_uid = brain.uid
                act_final.value = _final.value
                act_final.analysis_uid = _final.analysis_uid
                finalise.append(act_final)
            action.finalise = finalise

            add_new = []
            for add_n in _action.add_new:
                act_add = ReflexBrainAddition()
                act_add.count = add_n.count
                act_add.analysis_uid = add_n.analysis_uid
                act_add.reflex_brain_uid = brain.uid
                add_new.append(act_add)
            action.add_new = add_new

            await ReflexBrainActionService().save(action)

            actions.append(action)

        brain.conditions = conditions
        brain.actions = actions

        brain_in = schemas.ReflexBrainUpdate(**brain.to_dict())
        brain = await ReflexBrainService().update(
            uid=brain.uid,
            update=brain_in,
            related=["conditions.criteria", "actions.add_new", "actions.finalise"],
        )
        return ReflexBrainType(**brain.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_reflex_brain(self, info, uid: str) -> DeletedItem:
        # delete conditions
        conditions = await ReflexBrainConditionService().get_all(reflex_brain_uid=uid)
        for brain_cond in conditions:
            criteria = await ReflexBrainConditionCriteriaService().get_all(
                reflex_brain_condition_uid=brain_cond.uid
            )
            for cond_crit in criteria:
                await ReflexBrainConditionCriteriaService().delete(cond_crit.uid)
            await ReflexBrainConditionService().delete(brain_cond.uid)

        # delete actions
        brain_actions = await ReflexBrainActionService().get_all(reflex_brain_uid=uid)
        for rb_action in brain_actions:
            additions = await ReflexBrainAdditionService().get_all(
                reflex_brain_action_uid=rb_action.uid
            )
            finals = await ReflexBrainFinalService().get_all(
                reflex_brain_action_uid=rb_action.uid
            )
            for ad in additions:
                await ReflexBrainAdditionService().delete(ad.uid)
            for fin in finals:
                await ReflexBrainFinalService().delete(fin.uid)
            await ReflexBrainActionService().delete(rb_action.uid)

        # delete brain
        await ReflexBrainService().delete(uid)
        return DeletedItem(uid=uid)
