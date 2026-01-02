import strawberry

from felicity.api.gql.analysis import types as a_types
from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.analysis.enum import SampleRelationshipType
from felicity.apps.analysis.services.analysis import (
    SampleRelationshipService,
    SampleService,
)


@strawberry.input
class SampleRelationshipInputType:
    parent_sample_uid: str | None = None
    child_sample_uid: str
    relationship_type: str
    notes: str | None = None


SampleRelationshipResponse = strawberry.union(
    "SampleRelationshipResponse",
    (a_types.SampleRelationshipType, OperationError),
)


SampleParentLinkResponse = strawberry.union(
    "SampleParentLinkResponse",
    (a_types.SampleType, OperationError),
)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_sample_relationship(
    info, payload: SampleRelationshipInputType
) -> SampleRelationshipResponse:
    if payload.relationship_type not in [t.value for t in SampleRelationshipType]:
        return OperationError(error="Invalid relationship type")

    service = SampleRelationshipService()
    relationship = await service.create_relationship(
        parent_sample_uid=payload.parent_sample_uid,
        child_sample_uid=payload.child_sample_uid,
        relationship_type=payload.relationship_type,
        notes=payload.notes,
    )
    return a_types.SampleRelationshipType(**relationship.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def link_sample_parent(
    info,
    child_sample_uid: str,
    parent_sample_uid: str,
    relationship_type: str,
) -> SampleParentLinkResponse:
    if relationship_type not in [t.value for t in SampleRelationshipType]:
        return OperationError(error="Invalid relationship type")

    sample_service = SampleService()
    await sample_service._validate_no_cycle(parent_sample_uid, child_sample_uid)

    child = await sample_service.get(uid=child_sample_uid)
    if not child:
        return OperationError(error=f"Sample with uid {child_sample_uid} not found")

    parent = await sample_service.get(uid=parent_sample_uid)
    if not parent:
        return OperationError(error=f"Sample with uid {parent_sample_uid} not found")

    felicity_user = await auth_from_info(info)
    updated = await sample_service.update(
        child.uid,
        {
            "parent_id": parent.uid,
            "relationship_type": relationship_type,
            "updated_by_uid": felicity_user.uid,
        },
    )
    return a_types.SampleType(**updated.marshal_simple())
