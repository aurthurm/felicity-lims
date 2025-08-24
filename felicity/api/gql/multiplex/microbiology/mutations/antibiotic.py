import logging

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.multiplex.microbiology import AbxAntibioticType, AbxGuidelineType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError, DeletedItem
from felicity.apps.multiplex.microbiology.entities import laboratory_antibiotics
from felicity.apps.multiplex.microbiology.schemas import AbxGuidelineCreate, AbxGuidelineUpdate, AbxAntibioticCreate, \
    AbxAntibioticUpdate
from felicity.apps.multiplex.microbiology.services import AbxAntibioticGuidelineService, AbxGuidelineService, \
    AbxAntibioticService
from felicity.apps.setup.services import LaboratoryService
from felicity.core.tenant_context import get_current_lab_uid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class AbxGuidelineInputType:
    name: str
    code: str | None = ""
    description: str | None = ""


AbxGuidelineResponse = strawberry.union(
    "AbxGuidelineResponse",
    (AbxGuidelineType, OperationError),  # noqa
    description="",
)


@strawberry.input
class AbxAntibioticInputType:
    name: str
    guidelines: list[str]
    whonet_abx_code: str | None = None
    who_code: str | None = None
    din_code: str | None = None
    jac_code: str | None = None
    eucast_code: str | None = None
    user_code: str | None = None
    abx_number: str | None = None
    potency: str | None = None
    atc_code: str | None = None
    class_: str | None = None
    subclass: str | None = None
    prof_class: str | None = None
    cia_category: str | None = None
    clsi_order: str | None = None
    eucast_order: str | None = None
    human: bool | None = None
    veterinary: bool | None = None
    animal_gp: str | None = None
    loinccomp: str | None = None
    loincgen: str | None = None
    loincdisk: str | None = None
    loincmic: str | None = None
    loincetest: str | None = None
    loincslow: str | None = None
    loincafb: str | None = None
    loincsbt: str | None = None
    loincmlc: str | None = None
    comments: str | None = None


AbxAntibioticResponse = strawberry.union(
    "AbxAntibioticResponse",
    (AbxAntibioticType, OperationError),
    description="",
)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_guideline(info, payload: AbxGuidelineInputType) -> AbxGuidelineResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxGuidelineCreate(**incoming)
    abx_guideline = await AbxGuidelineService().create(obj_in)
    return AbxGuidelineType(**abx_guideline.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_guideline(
        info, uid: str, payload: AbxGuidelineInputType
) -> AbxGuidelineResponse:
    felicity_user = await auth_from_info(info)
    abx_guideline = await AbxGuidelineService().get(uid=uid)

    abx_g_data = abx_guideline.to_dict()
    for field in abx_g_data:
        if field in payload.__dict__:
            try:
                setattr(abx_guideline, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_guideline, "updated_by_uid", felicity_user.uid)

    abx_guideline_in = AbxGuidelineUpdate(**abx_guideline.to_dict())
    abx_guideline = await AbxGuidelineService().update(abx_guideline.uid, abx_guideline_in)
    return AbxGuidelineType(**abx_guideline.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_antibiotic(info, payload: AbxAntibioticInputType) -> AbxAntibioticResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxAntibioticCreate(**incoming)
    abx_antibiotic = await AbxAntibioticService().create(obj_in)

    for guideline in payload.guidelines:
        await AbxAntibioticGuidelineService().create({
            "antibiotic_uid": abx_antibiotic.uid,
            "guideline_uid": guideline
        })
    return AbxAntibioticType(**abx_antibiotic.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_antibiotic(
        info, uid: str, payload: AbxAntibioticInputType
) -> AbxAntibioticResponse:
    felicity_user = await auth_from_info(info)
    abx_antibiotic = await AbxAntibioticService().get(uid=uid)

    abx_data = abx_antibiotic.to_dict()
    for field in abx_data:
        if field in payload.__dict__:
            try:
                setattr(abx_antibiotic, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_antibiotic, "updated_by_uid", felicity_user.uid)

    abx_antibiotic_in = AbxAntibioticUpdate(**abx_antibiotic.to_dict())
    abx_antibiotic = await AbxAntibioticService().update(abx_antibiotic.uid, abx_antibiotic_in)

    # remove previous association
    await AbxAntibioticGuidelineService().delete_where(antibiotic_uid=abx_antibiotic.uid)

    # add current association
    for guideline in payload.guidelines:
        await AbxAntibioticGuidelineService().create({
            "antibiotic_uid": abx_antibiotic.uid,
            "guideline_uid": guideline
        })

    return AbxAntibioticType(**abx_antibiotic.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def use_abx_antibiotic(info, uid: str) -> AbxAntibioticResponse:
    lab_uid = get_current_lab_uid()
    laboratory = await LaboratoryService().get(uid=lab_uid)
    exists = await AbxAntibioticService().repository.table_query(
        table=laboratory_antibiotics,
        columns=["antibiotic_uid"],
        antibiotic_uid=uid,
        laboratory_uid=laboratory.uid
    )
    if exists:
        return OperationError(error="Antibiotic already used in this laboratory.")

    await AbxAntibioticService().repository.table_insert(
        laboratory_antibiotics,
        [{"antibiotic_uid": uid, "laboratory_uid": laboratory.uid}]
    )

    antibiotic = await AbxAntibioticService().get(uid=uid)
    return AbxAntibioticType(**antibiotic.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def discard_abx_antibiotic(info, uid: str) -> DeletedItem:
    lab_uid = get_current_lab_uid()
    laboratory = await LaboratoryService().get(uid=lab_uid)
    await AbxAntibioticService().repository.table_delete(
        table=laboratory_antibiotics,
        antibiotic_uid=uid,
        laboratory_uid=laboratory.uid
    )
    return DeletedItem(uid=uid)
