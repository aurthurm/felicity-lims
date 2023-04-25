import logging
from typing import Dict, List, Optional

import strawberry  # noqa
from api.gql import OperationError, auth_from_info, verify_user_auth
from api.gql.reflex.types import ReflexActionType, ReflexBrainType, ReflexRuleType
from apps.analysis.models import analysis as analysis_models
from apps.reflex import models, schemas
from core.uid_gen import FelicityID

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
    analyses: List[FelicityID]
    reflex_rule_uid: FelicityID
    sample_type_uid: FelicityID | None = None


ReflexActionResponse = strawberry.union(
    "ReflexActionResponse", (ReflexActionType, OperationError), description=""  # noqa
)


@strawberry.input
class ReflexCriteriaInput:
    analysis_uid: FelicityID
    operator: str
    value: str


@strawberry.input
class ReflexAddNewInput:
    analysis_uid: FelicityID
    count: int


@strawberry.input
class ReflexFinalInput:
    analysis_uid: FelicityID
    value: str


@strawberry.input
class ReflexBrainInput:
    reflex_action_uid: FelicityID
    description: str
    analyses_values: Optional[List[ReflexCriteriaInput]] = None
    add_new: Optional[List[ReflexAddNewInput]] = None
    finalise: Optional[List[ReflexFinalInput]] = None


ReflexBrainResponse = strawberry.union(
    "ReflexBrainResponse", (ReflexBrainType, OperationError), description=""  # noqa
)


@strawberry.type
class ReflexRuleMutations:
    @strawberry.mutation
    async def create_reflex_rule(
        self, info, payload: ReflexRuleInput
    ) -> ReflexRuleResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can add reflex rules",
        )

        if not payload.name or not payload.description:
            return OperationError(error="Name and Description are required")

        exists = await models.ReflexRule.get(name=payload.name)
        if exists:
            return OperationError(error=f"Reflex Rule name must be unique")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.ReflexRuleCreate(**incoming)
        reflex: models.ReflexRule = await models.ReflexRule.create(obj_in)
        return ReflexRuleType(**reflex.marshal_simple())

    @strawberry.mutation
    async def update_reflex_rule(
        self, info, uid: FelicityID, payload: ReflexRuleInput
    ) -> ReflexRuleResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update reflex rules",
        )

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        reflex_rule: models.ReflexRule = await models.ReflexRule.get(uid=uid)
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
        reflex_rule = await reflex_rule.update(obj_in)
        return ReflexRuleType(**reflex_rule.marshal_simple())

    @strawberry.mutation
    async def create_reflex_action(
        self, info, payload: ReflexActionInput
    ) -> ReflexActionResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can add reflex actions",
        )

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
            _anal = await analysis_models.Analysis.get(uid=_anal_uid)
            analyses.append(_anal)
        obj_in.analyses = analyses

        action: models.ReflexAction = await models.ReflexAction.create(obj_in)
        return ReflexActionType(**action.marshal_simple())

    @strawberry.mutation
    async def update_reflex_action(
        self, info, uid: FelicityID, payload: ReflexActionInput
    ) -> ReflexActionResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can add reflex actions",
        )

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        reflex_action: models.ReflexAction = await models.ReflexAction.get(uid=uid)
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

        analyses = []
        for _anal_uid in payload.analyses:
            _anal = await analysis_models.Analysis.get(uid=_anal_uid)
            analyses.append(_anal)
        setattr(reflex_action, "analyses", analyses)

        obj_in = schemas.ReflexActionUpdate(**reflex_action.to_dict())
        reflex_action = await reflex_action.update(obj_in)
        return ReflexActionType(**reflex_action.marshal_simple())

    @strawberry.mutation
    async def create_reflex_brain(
        self, info, payload: ReflexBrainInput
    ) -> ReflexBrainResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can add reflex brains",
        )

        if not payload.description:
            return OperationError(error="Description are required")

        incoming: dict = {
            "reflex_action_uid": payload.reflex_action_uid,
            "description": payload.description,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        obj_in = schemas.ReflexBrainCreate(**incoming)

        brain: models.ReflexBrain = await models.ReflexBrain.create(obj_in)

        analyses_values = []
        for criteria in payload.analyses_values:
            _anal = await analysis_models.Analysis.get(uid=criteria.analysis_uid)
            assoc = models.ReflexBrainCriteria()
            assoc.operator = criteria.operator
            assoc.value = criteria.value
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = brain.uid
            analyses_values.append(assoc)
        brain.analyses_values = analyses_values

        finalise = []
        for final in payload.finalise:
            _anal = await analysis_models.Analysis.get(uid=final.analysis_uid)
            assoc = models.ReflexBrainFinal()
            assoc.value = final.value
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = brain.uid
            finalise.append(assoc)
        brain.finalise = finalise

        add_new = []
        for add_n in payload.add_new:
            _anal = await analysis_models.Analysis.get(uid=add_n.analysis_uid)
            assoc = models.ReflexBrainAddition()
            assoc.count = add_n.count
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = brain.uid
            add_new.append(assoc)
        brain.add_new = add_new

        await brain.save()
        brain = await models.ReflexBrain.get_related(
            related=["add_new.analysis", "analyses_values.analysis"], uid=brain.uid
        )
        return ReflexBrainType(**brain.marshal_simple())

    @strawberry.mutation
    async def update_reflex_brain(
        self, info, uid: FelicityID, payload: ReflexBrainInput
    ) -> ReflexBrainResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can add reflex brains",
        )

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        reflex_brain: models.ReflexBrain = await models.ReflexBrain.get(uid=uid)
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
            _anal = await analysis_models.Analysis.get(uid=criteria.analysis_uid)
            assoc = models.ReflexBrainCriteria()
            assoc.operator = criteria.operator
            assoc.value = criteria.value
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = reflex_brain.uid
            analyses_values.append(assoc)
        reflex_brain.analyses_values = analyses_values

        finalise = []
        for final in payload.finalise:
            _anal = await analysis_models.Analysis.get(uid=final.analysis_uid)
            assoc = models.ReflexBrainFinal()
            assoc.value = final.value
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = reflex_brain.uid
            finalise.append(assoc)
        reflex_brain.finalise = finalise

        add_new = []
        for add_n in payload.add_new:
            _anal = await analysis_models.Analysis.get(uid=add_n.analysis_uid)
            assoc = models.ReflexBrainAddition()
            assoc.count = add_n.count
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = reflex_brain.uid
            add_new.append(assoc)
        reflex_brain.add_new = add_new

        obj_in = schemas.ReflexBrainUpdate(**reflex_brain.to_dict())
        reflex_brain = await reflex_brain.update(obj_in)
        return ReflexBrainType(**reflex_brain.marshal_simple())
