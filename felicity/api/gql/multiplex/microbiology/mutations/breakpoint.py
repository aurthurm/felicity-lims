import logging

import strawberry

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.multiplex.microbiology import AbxTestMethodType, AbxBreakpointTypeTyp, AbxHostType, \
    AbxSiteOfInfectionType, AbxBreakpointTyp
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.multiplex.microbiology.schemas import AbxTestMethodCreate, AbxTestMethodUpdate, \
    AbxBreakpointTypeCreate, AbxBreakpointTypeUpdate, AbxHostCreate, AbxHostUpdate, AbxSiteOfInfectionCreate, \
    AbxSiteOfInfectionUpdate, AbxBreakpointCreate, AbxBreakpointUpdate
from felicity.apps.multiplex.microbiology.services import AbxTestMethodService, AbxBreakpointTypeService, \
    AbxHostService, AbxSiteOfInfectionService, AbxBreakpointService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Input Types
@strawberry.input
class AbxTestMethodInputType:
    name: str
    description: str | None = None


@strawberry.input
class AbxBreakpointTypeInputType:
    name: str
    description: str | None = None


@strawberry.input
class AbxHostInputType:
    name: str
    description: str | None = None


@strawberry.input
class AbxSiteOfInfectionInputType:
    name: str
    description: str | None = None


@strawberry.input
class AbxBreakpointInputType:
    guideline_uid: str
    year: int | None = None
    test_method: str
    potency: str | None = None
    organism_code: str
    organism_code_type: str
    breakpoint_type_uid: str
    host_uid: str | None = None
    site_of_infection_uid: str | None = None
    reference_table: str | None = None
    reference_sequence: str | None = None
    whonet_abx_code: str | None = None
    comments: str | None = None
    r: str | None = None
    i: str | None = None
    sdd: str | None = None
    s: str | None = None
    ecv_ecoff: str | None = None
    ecv_ecoff_tentative: str | None = None


# Response Unions
AbxTestMethodResponse = strawberry.union(
    "AbxTestMethodResponse",
    (AbxTestMethodType, OperationError),
    description="",
)

AbxBreakpointTypeResponse = strawberry.union(
    "AbxBreakpointTypeResponse",
    (AbxBreakpointTypeTyp, OperationError),
    description="",
)

AbxHostResponse = strawberry.union(
    "AbxHostResponse",
    (AbxHostType, OperationError),
    description="",
)

AbxSiteOfInfectionResponse = strawberry.union(
    "AbxSiteOfInfectionResponse",
    (AbxSiteOfInfectionType, OperationError),
    description="",
)

AbxBreakpointResponse = strawberry.union(
    "AbxBreakpointResponse",
    (AbxBreakpointTyp, OperationError),
    description="",
)


# Test Method Mutations
@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_test_method(
        info,
        payload: AbxTestMethodInputType
) -> AbxTestMethodResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxTestMethodCreate(**incoming)
    abx_test_method = await AbxTestMethodService().create(obj_in)
    return AbxTestMethodType(**abx_test_method.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_test_method(
        info,
        uid: str,
        payload: AbxTestMethodInputType
) -> AbxTestMethodResponse:
    felicity_user = await auth_from_info(info)
    abx_test_method = await AbxTestMethodService().get(uid=uid)

    method_data = abx_test_method.to_dict()
    for field in method_data:
        if field in payload.__dict__:
            try:
                setattr(abx_test_method, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_test_method, "updated_by_uid", felicity_user.uid)

    method_in = AbxTestMethodUpdate(**abx_test_method.to_dict())
    abx_test_method = await AbxTestMethodService().update(abx_test_method.uid, method_in)
    return AbxTestMethodType(**abx_test_method.marshal_simple())


# Breakpoint Type Mutations
@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_breakpoint_type(
        info,
        payload: AbxBreakpointTypeInputType
) -> AbxBreakpointTypeResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxBreakpointTypeCreate(**incoming)
    abx_breakpoint_type = await AbxBreakpointTypeService().create(obj_in)
    return AbxBreakpointTypeTyp(**abx_breakpoint_type.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_breakpoint_type(
        info,
        uid: str,
        payload: AbxBreakpointTypeInputType
) -> AbxBreakpointTypeResponse:
    felicity_user = await auth_from_info(info)
    abx_breakpoint_type = await AbxBreakpointTypeService().get(uid=uid)

    type_data = abx_breakpoint_type.to_dict()
    for field in type_data:
        if field in payload.__dict__:
            try:
                setattr(abx_breakpoint_type, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_breakpoint_type, "updated_by_uid", felicity_user.uid)

    type_in = AbxBreakpointTypeUpdate(**abx_breakpoint_type.to_dict())
    abx_breakpoint_type = await AbxBreakpointTypeService().update(abx_breakpoint_type.uid, type_in)
    return AbxBreakpointTypeTyp(**abx_breakpoint_type.marshal_simple())


# Host Mutations
@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_host(
        info,
        payload: AbxHostInputType
) -> AbxHostResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxHostCreate(**incoming)
    abx_host = await AbxHostService().create(obj_in)
    return AbxHostType(**abx_host.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_host(
        info,
        uid: str,
        payload: AbxHostInputType
) -> AbxHostResponse:
    felicity_user = await auth_from_info(info)
    abx_host = await AbxHostService().get(uid=uid)

    host_data = abx_host.to_dict()
    for field in host_data:
        if field in payload.__dict__:
            try:
                setattr(abx_host, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_host, "updated_by_uid", felicity_user.uid)

    host_in = AbxHostUpdate(**abx_host.to_dict())
    abx_host = await AbxHostService().update(abx_host.uid, host_in)
    return AbxHostType(**abx_host.marshal_simple())


# Site of Infection Mutations
@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_site_of_infection(
        info,
        payload: AbxSiteOfInfectionInputType
) -> AbxSiteOfInfectionResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxSiteOfInfectionCreate(**incoming)
    abx_site = await AbxSiteOfInfectionService().create(obj_in)
    return AbxSiteOfInfectionType(**abx_site.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_site_of_infection(
        info,
        uid: str,
        payload: AbxSiteOfInfectionInputType
) -> AbxSiteOfInfectionResponse:
    felicity_user = await auth_from_info(info)
    abx_site = await AbxSiteOfInfectionService().get(uid=uid)

    site_data = abx_site.to_dict()
    for field in site_data:
        if field in payload.__dict__:
            try:
                setattr(abx_site, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_site, "updated_by_uid", felicity_user.uid)

    site_in = AbxSiteOfInfectionUpdate(**abx_site.to_dict())
    abx_site = await AbxSiteOfInfectionService().update(abx_site.uid, site_in)
    return AbxSiteOfInfectionType(**abx_site.marshal_simple())


# Breakpoint Mutations
@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_breakpoint(
        info,
        payload: AbxBreakpointInputType
) -> AbxBreakpointResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxBreakpointCreate(**incoming)
    abx_breakpoint = await AbxBreakpointService().create(obj_in)
    return AbxBreakpointTyp(**abx_breakpoint.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_breakpoint(
        info,
        uid: str,
        payload: AbxBreakpointInputType
) -> AbxBreakpointResponse:
    felicity_user = await auth_from_info(info)
    abx_breakpoint = await AbxBreakpointService().get(uid=uid)

    breakpoint_data = abx_breakpoint.to_dict()
    for field in breakpoint_data:
        if field in payload.__dict__:
            try:
                setattr(abx_breakpoint, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_breakpoint, "updated_by_uid", felicity_user.uid)

    breakpoint_in = AbxBreakpointUpdate(**abx_breakpoint.to_dict())
    abx_breakpoint = await AbxBreakpointService().update(abx_breakpoint.uid, breakpoint_in)
    return AbxBreakpointTyp(**abx_breakpoint.marshal_simple())
