import logging
from typing import List, Optional

import strawberry  # noqa
from api.gql import OperationError, auth_from_info, verify_user_auth
from api.gql.shipment.types import ShipmentType
from apps.common.models import IdSequence
from apps.job import models as job_models
from apps.job import schemas as job_schemas
from apps.job.conf import actions, categories, priorities, states
from apps.job.sched import felicity_resume_workforce
from apps.shipment import conf, models, schemas
from apps.shipment.utils import shipment_unsassign
from apps.analysis.models import analysis


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ShipmentInputType:
    courier: str
    comment: str | None
    count: int | None = 1


@strawberry.input
class ShipmentUpdateInputType:
    courier: str
    comment: str | None


@strawberry.input
class ReferenceSampleInput:
    sample_uid: str
    shiped_sample_uid: str | None
    analyses: list[str] # list of analysis uids being assignes/unassigned

@strawberry.input
class ShipmentManageSamplesInput:
    samples: List[ReferenceSampleInput]
    action: str


@strawberry.type
class ShipmentListingType:
    shipments: Optional[List[ShipmentType]]


ShipmentsResponse = strawberry.union(
    "ShipmentsResponse", (ShipmentListingType, OperationError), description=""  # noqa
)

ShipmentResponse = strawberry.union(
    "ShipmentResponse", (ShipmentType, OperationError), description=""  # noqa
)


@strawberry.type
class ShipmentMutations:

    @strawberry.mutation
    async def create_shipment(
        self,
        info,
        payload: ShipmentInputType
    ) -> ShipmentsResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create shipments",
        )

        if not payload.courier:
            return OperationError(error="Courier Details are required")
        
        incoming = {
            "comment": payload.comment,
            "courier": payload.courier,
            "shipment_id": None,
            "state": conf.shipment_states.EMPTY,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        sh_schema = schemas.ShipmentCreate(**incoming)

        shipment_schemas = [
            sh_schema.copy(
                update={"shipment_id": (await IdSequence.get_next_number("WS"))[1]}
            )
            for i in list(range(payload.count))
        ]

        shipments = await models.Shipment.bulk_create(shipment_schemas)
        logger.info(f"Bulk create: {shipments}")

        # to get lazy loads working otherwise return WorksheetListingType(shipments)
        return ShipmentListingType(
            shipments=[(await models.Shipment.get(uid=sh.uid)) for sh in shipments]
        )

    @strawberry.mutation
    async def update_shipment(
        self,
        info,
        uid: str,
        payload: ShipmentUpdateInputType
    ) -> ShipmentResponse:  # noqa

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update shipments",
        )

        if not uid:
            return OperationError(error="The uid for the update shipment was not provided")
    

        if not all(not getattr(payload, attr) for attr in dir(payload)):
            return OperationError(error="Either comment, courier or samples must be provided.")

        shipment: Optional[models.Shipment] = await models.Shipment.get(
            uid=uid
        )

        if not shipment:
            return OperationError(
                error=f"Shipment {uid} does not exist"
            )
        
        attrs = filter(lambda attr: getattr(payload, attr), dir(payload))

        incoming = {}

        if "comment" in attrs:
            incoming["comment"] = payload.comment

        if "courier" in attrs:
            incoming["comment"] = payload.courier
        
        obj_in = schemas.ShipmentUpdate(**incoming)
        shipment = await shipment.update(obj_in)

        return ShipmentType(**shipment.marshal_simple())


    @strawberry.mutation
    async def shipment_manage_samples(
        self,
        info,
        uid: str,
        payload: ShipmentManageSamplesInput
    ) -> ShipmentResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update shipments",
        )

        if not len(payload.samples) > 0:
            return OperationError(error="Samples for assignment are required")

        if not uid:
            return OperationError(error="Shipment uid is required")

        shipment = await models.Shipment.get(uid=uid)
        if not shipment:
            return OperationError(error=f"Shipment {uid} does not exist")

        if payload.action == "assign":
            # Add a job
            job_schema = job_schemas.JobCreate(
                action=actions.SH_MANUAL_ASSIGN,
                category=categories.SHIPMENT,
                priority=priorities.MEDIUM,
                creator_uid=felicity_user.uid,
                job_id=shipment.uid,
                status=states.PENDING,
                data=payload.samples,
            )
            await job_models.Job.create(job_schema)
            felicity_resume_workforce()
        else:
            # un-assign
            assert payload.action == "un-assign"
            await shipment_unsassign(shipment.uid, payload.samples)

        return ShipmentType(**shipment.marshal_simple())
