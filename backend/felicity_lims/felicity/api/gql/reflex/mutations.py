import logging
from typing import Dict, Optional, List, Tuple

import strawberry  # noqa
from felicity.apps.reflex import models, schemas
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.api.gql import OperationError, auth_from_info, verify_user_auth
from felicity.api.gql.reflex.types import ReflexRuleType, ReflexActionType, ReflexBrainType, ReflexAnalysisValueType
from felicity.database.session import async_session_factory

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ReflexRuleInput:
    name: str
    description: str


ReflexRuleResponse = strawberry.union("ReflexRuleResponse",
                                      (ReflexRuleType, OperationError),  # noqa
                                      description=""
                                      )


@strawberry.input
class ReflexActionInput:
    level: int
    description: str
    analysis_uid: int
    reflex_rule_uid: int
    sample_type_uid: Optional[int] = None


ReflexActionResponse = strawberry.union("ReflexActionResponse",
                                        (ReflexActionType, OperationError),  # noqa
                                        description=""
                                        )


@strawberry.input
class ReflexAnalysisValueInput:
    uid: int
    value: str


@strawberry.input
class ReflexAddNewInput:
    uid: int
    count: int


@strawberry.input
class ReflexBrainInput:
    reflex_action_uid: int
    description: str
    analyses_values: Optional[List[ReflexAnalysisValueInput]] = None
    add_new: Optional[List[ReflexAddNewInput]] = None
    finalise: Optional[List[ReflexAnalysisValueInput]] = None


ReflexBrainResponse = strawberry.union("ReflexBrainResponse",
                                       (ReflexBrainType, OperationError),  # noqa
                                       description=""
                                       )


@strawberry.type
class ReflexRuleMutations:
    @strawberry.mutation
    async def create_reflex_rule(self, info, payload: ReflexRuleInput) -> ReflexRuleResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can add reflex rules")

        if not payload.name or not payload.description:
            return OperationError(
                error="Name and Description are required"
            )

        exists = await models.ReflexRule.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"Reflex Rule name must be unique"
            )

        incoming: Dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.ReflexRuleCreate(**incoming)
        reflex: models.ReflexRule = await models.ReflexRule.create(obj_in)
        return ReflexRuleType(**reflex.marshal_simple())

    @strawberry.mutation
    async def reflex_rule(self, info, uid: int, payload: ReflexRuleInput) -> ReflexRuleResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update reflex rules")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

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
    async def create_reflex_action(self, info, payload: ReflexActionInput) -> ReflexActionResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can add reflex actions")

        if not payload.analysis_uid or not payload.level or not payload.description:
            return OperationError(
                error="Anaysis, Level and description are required"
            )

        incoming: Dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.ReflexActionCreate(**incoming)
        action: models.ReflexAction = await models.ReflexAction.create(obj_in)
        return ReflexActionType(**action.marshal_simple())

    @strawberry.mutation
    async def update_reflex_action(self, info, uid: int, payload: ReflexActionInput) -> ReflexActionResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can add reflex actions")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

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

        obj_in = schemas.ReflexActionUpdate(**reflex_action.to_dict())
        reflex_action = await reflex_action.update(obj_in)
        return ReflexActionType(**reflex_action.marshal_simple())

    @strawberry.mutation
    async def create_reflex_brain(self, info, payload: ReflexBrainInput) -> ReflexBrainResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can add reflex brains")

        if not payload.description:
            return OperationError(
                error="Description are required"
            )

        incoming: Dict = {
            "reflex_action_uid": payload.reflex_action_uid,
            "description": payload.description,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid
        }
        obj_in = schemas.ReflexBrainCreate(**incoming)

        analyses_values = []
        for av in payload.analyses_values:
            _anal = await analysis_models.Analysis.get(uid=av.uid)
            ra_in = schemas.ReflexAnalysisValueCreate(
                analysis_uid=_anal.uid,
                value=av.value,
            )
            _anal_val = await models.ReflexAnalysisValue.create(ra_in)
            analyses_values.append(_anal_val)
        obj_in.analyses_values = analyses_values

        finalise = []
        for av in payload.finalise:
            _anal = await analysis_models.Analysis.get(uid=av.uid)
            ra_in = schemas.ReflexAnalysisValueCreate(
                analysis_uid=_anal.uid,
                value=av.value,
            )
            _anal_val = await models.ReflexAnalysisValue.create(ra_in)
            finalise.append(_anal_val)
        obj_in.finalise = finalise

        brain: models.ReflexBrain = await models.ReflexBrain.create(obj_in)

        add_new = []
        for _add in payload.add_new:
            _anal = await analysis_models.Analysis.get(uid=_add.uid)
            assoc = models.ReflexBrainAnalysis()
            assoc.count = _add.count
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = brain.uid
            add_new.append(assoc)
        brain.add_new = add_new

        brain = await brain.save()
        return ReflexBrainType(**brain.marshal_simple())

    @strawberry.mutation
    async def update_reflex_brain(self, info, uid: int, payload: ReflexBrainInput) -> ReflexBrainResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can add reflex brains")

        if not uid:
            return OperationError(
                error="No uid provided to identify update obj"
            )

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
        for av in payload.analyses_values:
            _anal = await analysis_models.Analysis.get(uid=av.uid)
            ra_in = schemas.ReflexAnalysisValueCreate(
                analysis_uid=_anal.uid,
                value=av.value,
            )
            _anal_val = await models.ReflexAnalysisValue.create(ra_in)
            analyses_values.append(_anal_val)
        reflex_brain.analyses_values = analyses_values

        add_new = []
        for _add in payload.add_new:
            _anal = await analysis_models.Analysis.get(uid=_add.uid)
            assoc = models.ReflexBrainAnalysis()
            assoc.count = _add.count
            assoc.analysis_uid = _anal.uid
            assoc.reflex_brain_uid = reflex_brain.uid
            add_new.append(assoc)
        reflex_brain.add_new = add_new

        finalise = []
        for av in payload.finalise:
            _anal = await analysis_models.Analysis.get(uid=av.uid)
            ra_in = schemas.ReflexAnalysisValueCreate(
                analysis_uid=_anal.uid,
                value=av.value,
            )
            _anal_val = await models.ReflexAnalysisValue.create(ra_in)
            finalise.append(_anal_val)
        reflex_brain.finalise = finalise

        obj_in = schemas.ReflexBrainUpdate(**reflex_brain.to_dict())
        reflex_brain = await reflex_brain.update(obj_in)
        return ReflexBrainType(**reflex_brain.marshal_simple())
