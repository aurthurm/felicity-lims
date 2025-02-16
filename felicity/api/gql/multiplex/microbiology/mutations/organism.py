import logging

import strawberry

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.multiplex.microbiology import AbxKingdomType, AbxPhylumType, AbxClassType, AbxOrderType, \
    AbxFamilyType, AbxGenusType, AbxOrganismType, AbxOrganismSerotypeType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.multiplex.microbiology.schemas import AbxKingdomCreate, AbxKingdomUpdate, AbxPhylumCreate, \
    AbxPhylumUpdate, AbxOrganismCreate, AbxOrganismUpdate, AbxOrganismSerotypeCreate, AbxOrganismSerotypeUpdate
from felicity.apps.multiplex.microbiology.services import AbxKingdomService, AbxPhylumService, AbxOrganismService, \
    AbxOrganismSerotypeService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Input Types
@strawberry.input
class AbxKingdomInputType:
    name: str


@strawberry.input
class AbxPhylumInputType:
    name: str
    kingdom_uid: str | None = None


@strawberry.input
class AbxClassInputType:
    name: str
    phylum_uid: str | None = None


@strawberry.input
class AbxOrderInputType:
    name: str
    class_uid: str | None = None


@strawberry.input
class AbxFamilyInputType:
    name: str
    order_uid: str | None = None


@strawberry.input
class AbxGenusInputType:
    name: str
    family_uid: str | None = None


@strawberry.input
class AbxOrganismInputType:
    name: str
    whonet_org_code: str | None = None
    replaced_by: str | None = None
    taxonomic_status: str | None = None
    common: str | None = None
    organism_type: str | None = None
    anaerobe: bool | None = None
    morphology: str | None = None
    kingdom_uid: str | None = None
    phylum_uid: str | None = None
    class_uid: str | None = None
    order_uid: str | None = None
    family_uid: str | None = None
    genus_uid: str | None = None
    comments: str | None = None


@strawberry.input
class AbxOrganismSerotypeInputType:
    organism_uid: str
    serotype: str
    serogroup: str | None = None
    subspecies: str | None = None
    o_antigens: str | None = None
    h_phase_1: str | None = None
    h_phase_2: str | None = None
    x997_check: bool | None = None
    fate: str | None = None


# Response Unions
AbxKingdomResponse = strawberry.union(
    "AbxKingdomResponse",
    (AbxKingdomType, OperationError),
    description="",
)

AbxPhylumResponse = strawberry.union(
    "AbxPhylumResponse",
    (AbxPhylumType, OperationError),
    description="",
)

AbxClassResponse = strawberry.union(
    "AbxClassResponse",
    (AbxClassType, OperationError),
    description="",
)

AbxOrderResponse = strawberry.union(
    "AbxOrderResponse",
    (AbxOrderType, OperationError),
    description="",
)

AbxFamilyResponse = strawberry.union(
    "AbxFamilyResponse",
    (AbxFamilyType, OperationError),
    description="",
)

AbxGenusResponse = strawberry.union(
    "AbxGenusResponse",
    (AbxGenusType, OperationError),
    description="",
)

AbxOrganismResponse = strawberry.union(
    "AbxOrganismResponse",
    (AbxOrganismType, OperationError),
    description="",
)

AbxOrganismSerotypeResponse = strawberry.union(
    "AbxOrganismSerotypeResponse",
    (AbxOrganismSerotypeType, OperationError),
    description="",
)


# Mutations
@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_kingdom(info, payload: AbxKingdomInputType) -> AbxKingdomResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxKingdomCreate(**incoming)
    abx_kingdom = await AbxKingdomService().create(obj_in)
    return AbxKingdomType(**abx_kingdom.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_kingdom(
        info, uid: str, payload: AbxKingdomInputType
) -> AbxKingdomResponse:
    felicity_user = await auth_from_info(info)
    abx_kingdom = await AbxKingdomService().get(uid=uid)

    kingdom_data = abx_kingdom.to_dict()
    for field in kingdom_data:
        if field in payload.__dict__:
            try:
                setattr(abx_kingdom, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_kingdom, "updated_by_uid", felicity_user.uid)

    kingdom_in = AbxKingdomUpdate(**abx_kingdom.to_dict())
    abx_kingdom = await AbxKingdomService().update(abx_kingdom.uid, kingdom_in)
    return AbxKingdomType(**abx_kingdom.marshal_simple())


# Similar patterns for Phylum
@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_phylum(info, payload: AbxPhylumInputType) -> AbxPhylumResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxPhylumCreate(**incoming)
    abx_phylum = await AbxPhylumService().create(obj_in)
    return AbxPhylumType(**abx_phylum.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_phylum(
        info, uid: str, payload: AbxPhylumInputType
) -> AbxPhylumResponse:
    felicity_user = await auth_from_info(info)
    abx_phylum = await AbxPhylumService().get(uid=uid)

    phylum_data = abx_phylum.to_dict()
    for field in phylum_data:
        if field in payload.__dict__:
            try:
                setattr(abx_phylum, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_phylum, "updated_by_uid", felicity_user.uid)

    phylum_in = AbxPhylumUpdate(**abx_phylum.to_dict())
    abx_phylum = await AbxPhylumService().update(abx_phylum.uid, phylum_in)
    return AbxPhylumType(**abx_phylum.marshal_simple())


# Organism mutations (as an example of the most complex type)
@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_organism(info, payload: AbxOrganismInputType) -> AbxOrganismResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxOrganismCreate(**incoming)
    abx_organism = await AbxOrganismService().create(obj_in)
    return AbxOrganismType(**abx_organism.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_organism(
        info, uid: str, payload: AbxOrganismInputType
) -> AbxOrganismResponse:
    felicity_user = await auth_from_info(info)
    abx_organism = await AbxOrganismService().get(uid=uid)

    organism_data = abx_organism.to_dict()
    for field in organism_data:
        if field in payload.__dict__:
            try:
                setattr(abx_organism, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_organism, "updated_by_uid", felicity_user.uid)

    organism_in = AbxOrganismUpdate(**abx_organism.to_dict())
    abx_organism = await AbxOrganismService().update(abx_organism.uid, organism_in)
    return AbxOrganismType(**abx_organism.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_organism_serotype(
        info,
        payload: AbxOrganismSerotypeInputType
) -> AbxOrganismSerotypeResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxOrganismSerotypeCreate(**incoming)
    abx_serotype = await AbxOrganismSerotypeService().create(obj_in)
    return AbxOrganismSerotypeType(**abx_serotype.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_organism_serotype(
        info,
        uid: str,
        payload: AbxOrganismSerotypeInputType
) -> AbxOrganismSerotypeResponse:
    felicity_user = await auth_from_info(info)
    abx_serotype = await AbxOrganismSerotypeService().get(
        uid=uid
    )

    serotype_data = abx_serotype.to_dict()
    for field in serotype_data:
        if field in payload.__dict__:
            try:
                setattr(abx_serotype, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_serotype, "updated_by_uid", felicity_user.uid)

    serotype_in = AbxOrganismSerotypeUpdate(**abx_serotype.to_dict())
    abx_serotype = await AbxOrganismSerotypeService().update(uid, serotype_in)
    return AbxOrganismSerotypeType(**abx_serotype.marshal_simple())
