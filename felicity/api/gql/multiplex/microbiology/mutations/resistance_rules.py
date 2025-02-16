import logging

import strawberry  # noqa
import strawberry

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.multiplex.microbiology import AbxExpResPhenotypeType, \
    AbxExpertInterpretationRuleType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.multiplex.microbiology.schemas import AbxExpResPhenotypeCreate, AbxExpResPhenotypeUpdate, \
    AbxExpertInterpretationRuleCreate, \
    AbxExpertInterpretationRuleUpdate
from felicity.apps.multiplex.microbiology.services import AbxExpResPhenotypeService, AbxExpertInterpretationRuleService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Input Types
@strawberry.input
class AbxReferenceTableInputType:
    name: str
    description: str | None = None


@strawberry.input
class AbxExpResPhenotypeInputType:
    guideline_uid: str
    reference_table: str
    organism_code: str
    organism_code_type: str
    exception_organism_code: str
    exception_organism_code_type: str
    abx_code: str
    abx_code_type: str
    antibiotic_exceptions: str
    comments: str | None = None


@strawberry.input
class AbxExpertInterpretationRuleInputType:
    rule_code: str
    description: str | None = None
    organism_code: str
    organism_code_type: str
    rule_criteria: str
    affected_antibiotics: str
    antibiotic_exceptions: str


AbxExpertInterpretationRuleResponse = strawberry.union(
    "AbxExpertInterpretationRuleResponse",
    (AbxExpertInterpretationRuleType, OperationError),
    description="",
)

AbxExpResPhenotypeResponse = strawberry.union(
    "AbxExpResPhenotypeResponse",
    (AbxExpResPhenotypeType, OperationError),
    description="",
)


# Expected Resistance Phenotype Mutations
@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_exp_res_phenotype(
        info,
        payload: AbxExpResPhenotypeInputType
) -> AbxExpResPhenotypeResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxExpResPhenotypeCreate(**incoming)
    abx_phenotype = await AbxExpResPhenotypeService().create(obj_in)
    return AbxExpResPhenotypeType(**abx_phenotype.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_exp_res_phenotype(
        info,
        uid: str,
        payload: AbxExpResPhenotypeInputType
) -> AbxExpResPhenotypeResponse:
    felicity_user = await auth_from_info(info)

    abx_phenotype = await AbxExpResPhenotypeService().get(uid=uid)

    phenotype_data = abx_phenotype.to_dict()
    for field in phenotype_data:
        if field in payload.__dict__:
            try:
                setattr(abx_phenotype, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_phenotype, "updated_by_uid", felicity_user.uid)

    phenotype_in = AbxExpResPhenotypeUpdate(**abx_phenotype.to_dict())
    abx_phenotype = await AbxExpResPhenotypeService().update(uid, phenotype_in)
    return AbxExpResPhenotypeType(**abx_phenotype.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_expert_interpretation_rule(
        info,
        payload: AbxExpertInterpretationRuleInputType
) -> AbxExpertInterpretationRuleResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxExpertInterpretationRuleCreate(**incoming)
    expert_rule = await AbxExpertInterpretationRuleService().create(obj_in)
    return AbxExpertInterpretationRuleType(**expert_rule.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_expert_interpretation_rule(
        info,
        uid: str,
        payload: AbxExpertInterpretationRuleInputType
) -> AbxExpertInterpretationRuleResponse:
    felicity_user = await auth_from_info(info)
    expert_rule = await AbxExpertInterpretationRuleService().get(uid=uid)

    rule_data = expert_rule.to_dict()
    for field in rule_data:
        if field in payload.__dict__:
            try:
                setattr(expert_rule, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(expert_rule, "updated_by_uid", felicity_user.uid)

    rule_in = AbxExpertInterpretationRuleUpdate(**expert_rule.to_dict())
    expert_rule = await AbxExpertInterpretationRuleService().update(uid, rule_in)
    return AbxExpertInterpretationRuleType(**expert_rule.marshal_simple())
