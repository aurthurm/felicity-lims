import logging

import strawberry  # noqa

from felicity.api.gql.multiplex.microbiology import AbxASTPanelType
from felicity.apps.multiplex.microbiology.entities import panel_breakpoints
from felicity.apps.multiplex.microbiology.schemas import AbxASTPanelCreate, AbxASTPanelUpdate
from felicity.apps.multiplex.microbiology.services import AbxASTPanelService, AbxBreakpointService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
import strawberry
from typing import List
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.types import OperationError


@strawberry.input
class AbxASTPanelInputType:
    name: str
    description: str | None = None
    breakpoints: List[str]
    active: bool = True


AbxASTPanelResponse = strawberry.union(
    "AbxASTPanelResponse",
    (AbxASTPanelType, OperationError),
    description="",
)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_ast_panel(
        info,
        payload: AbxASTPanelInputType
) -> AbxASTPanelResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxASTPanelCreate(**incoming)
    astp_panel = await AbxASTPanelService().create(obj_in)

    # Handle breakpoint associations if provided
    if payload.breakpoints:
        for breakpoint_uid in payload.breakpoints:
            await AbxBreakpointService().repository.table_insert(
                panel_breakpoints,
                [{"panel_uid": astp_panel.uid, "breakpoint_uid": breakpoint_uid}]
            )

    return AbxASTPanelType(**astp_panel.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_ast_panel(
        info,
        uid: str,
        payload: AbxASTPanelInputType
) -> AbxASTPanelResponse:
    felicity_user = await auth_from_info(info)
    astp_panel = await AbxASTPanelService().get(uid=uid)

    panel_data = astp_panel.to_dict()
    for field in panel_data:
        if field in payload.__dict__:
            if field != 'breakpoints':  # Handle breakpoints separately
                try:
                    setattr(astp_panel, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

    setattr(astp_panel, "updated_by_uid", felicity_user.uid)

    panel_in = AbxASTPanelUpdate(**astp_panel.to_dict())
    astp_panel = await AbxASTPanelService().update(astp_panel.uid, panel_in)

    # Update breakpoint associations if provided
    if payload.breakpoints is not None:
        # Remove existing associations
        await AbxBreakpointService().repository.delete_table(
            panel_breakpoints,
            panel_uid=astp_panel.uid
        )

        # Create new associations
        for breakpoint_uid in payload.breakpoints:
            await AbxBreakpointService().repository.table_insert(
                panel_breakpoints,
                [{"panel_uid": astp_panel.uid, "breakpoint_uid": breakpoint_uid}]
            )

    return AbxASTPanelType(**astp_panel.marshal_simple())
