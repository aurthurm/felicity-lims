import logging
from typing import Dict, List, Optional

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.reflex.types import (ReflexActionType, ReflexBrainType,
                                           ReflexRuleType)
from felicity.api.gql.types import OperationError
from felicity.apps.analysis.services.analysis import AnalysisService
from felicity.apps.reflex import schemas
from felicity.apps.reflex.entities import (ReflexBrainAddition,
                                           ReflexBrainCriteria,
                                           ReflexBrainFinal,
                                           reflex_action_analysis)
from felicity.apps.reflex.services import (ReflexActionService,
                                           ReflexBrainService,
                                           ReflexRuleService)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ReflexRuleInput:
    name: str
    description: str


ReflexRuleResponse = strawberry.union(
    "ReflexRuleResponse", (ReflexRuleType, OperationError), description=""  # noqa
)


@strawberry.input
class ReflexActionInput:
    level: int
    description: str
    analyses: List[str]
    reflex_rule_uid: str
    sample_type_uid: str | None = None


ReflexActionResponse = strawberry.union(
    "ReflexActionResponse", (ReflexActionType, OperationError), description=""  # noqa
)


@strawberry.input
class ReflexCriteriaInput:
    analysis_uid: str
    operator: str
    value: str


@strawberry.input
class ReflexAddNewInput:
    analysis_uid: str
    count: int


@strawberry.input
class ReflexFinalInput:
    analysis_uid: str
    value: str


@strawberry.input
class ReflexBrainInput:
    reflex_action_uid: str
    description: str
    analyses_values: Optional[List[ReflexCriteriaInput]] = None
    add_new: Optional[List[ReflexAddNewInput]] = None
    finalise: Optional[List[ReflexFinalInput]] = None


ReflexBrainResponse = strawberry.union(
    "ReflexBrainResponse", (ReflexBrainType, OperationError), description=""  # noqa
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
            return OperationError(error=f"Reflex Rule name must be unique")

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
            or not payload.level
            or not payload.description
        ):
            return OperationError(error="Anaysis, Level and description are required")

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
                mappings={
                    "analysis_uid": anal.uid,
                    "reflex_action_uid": action.uid,
                },
            )

        return ReflexActionType(**action.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_reflex_action(
        self, info, uid: str, payload: ReflexActionInput
    ) -> ReflexActionResponse:

        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        reflex_action = await ReflexActionService().get(uid=uid)
        if not reflex_action:
            return OperationError(
                error=f"reflex_action with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = reflex_action.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(reflex_action, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(reflex_action, "updated_by_uid", felicity_user.uid)

        # analyses = []
        # for _anal_uid in payload.analyses:
        #     _anal = await AnalysisService().get(uid=_anal_uid)
        #     analyses.append(_anal)
        # setattr(reflex_action, "analyses", analyses)

        obj_in = schemas.ReflexActionUpdate(**reflex_action.to_dict())
        reflex_action = await ReflexActionService().update(reflex_action.uid, obj_in)
        return ReflexActionType(**reflex_action.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_reflex_brain(
        self, info, payload: ReflexBrainInput
    ) -> ReflexBrainResponse:

        felicity_user = await auth_from_info(info)

        if not payload.description:
            return OperationError(error="Description are required")

        incoming: dict = {
            "reflex_action_uid": payload.reflex_action_uid,
            "description": payload.description,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        obj_in = schemas.ReflexBrainCreate(**incoming)

        brain = await ReflexBrainService().create(obj_in)

        analyses_values = []
        for criteria in payload.analyses_values:
            _anal = await AnalysisService().get(uid=criteria.analysis_uid)
            assoc = ReflexBrainCriteria()
            assoc.operator = criteria.operator
            assoc.value = criteria.value
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = brain.uid
            analyses_values.append(assoc)
        brain.analyses_values = analyses_values

        finalise = []
        for final in payload.finalise:
            _anal = await AnalysisService().get(uid=final.analysis_uid)
            assoc = ReflexBrainFinal()
            assoc.value = final.value
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = brain.uid
            finalise.append(assoc)
        brain.finalise = finalise

        add_new = []
        for add_n in payload.add_new:
            _anal = await AnalysisService().get(uid=add_n.analysis_uid)
            assoc = ReflexBrainAddition()
            assoc.count = add_n.count
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = brain.uid
            add_new.append(assoc)
        brain.add_new = add_new

        await ReflexBrainService().save(brain)
        brain = await ReflexBrainService().get_related(
            related=["add_new.analysis", "analyses_values.analysis"], uid=brain.uid
        )
        return ReflexBrainType(**brain.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_reflex_brain(
        self, info, uid: str, payload: ReflexBrainInput
    ) -> ReflexBrainResponse:

        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        reflex_brain = await ReflexBrainService().get(uid=uid)
        if not reflex_brain:
            return OperationError(
                error=f"reflex_action with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = reflex_brain.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(reflex_brain, field, payload.__dict__[field])
                except Exception as e:  # noqa
                    pass

        setattr(reflex_brain, "updated_by_uid", felicity_user.uid)

        analyses_values = []
        for criteria in payload.analyses_values:
            _anal = await AnalysisService().get(uid=criteria.analysis_uid)
            assoc = ReflexBrainCriteria()
            assoc.operator = criteria.operator
            assoc.value = criteria.value
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = reflex_brain.uid
            analyses_values.append(assoc)
        reflex_brain.analyses_values = analyses_values

        finalise = []
        for final in payload.finalise:
            _anal = await AnalysisService().get(uid=final.analysis_uid)
            assoc = ReflexBrainFinal()
            assoc.value = final.value
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = reflex_brain.uid
            finalise.append(assoc)
        reflex_brain.finalise = finalise

        add_new = []
        for add_n in payload.add_new:
            _anal = await AnalysisService().get(uid=add_n.analysis_uid)
            assoc = ReflexBrainAddition()
            assoc.count = add_n.count
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = reflex_brain.uid
            add_new.append(assoc)
        reflex_brain.add_new = add_new

        obj_in = schemas.ReflexBrainUpdate(**reflex_brain.to_dict())
        reflex_brain = await ReflexBrainService().update(reflex_brain.uid, obj_in)
        return ReflexBrainType(**reflex_brain.marshal_simple())
