import logging
from typing import List, Optional

import strawberry  # noqa
from sqlalchemy import or_
from api.gql import OperationError, auth_from_info, verify_user_auth
from api.gql.shipment.types import ShipmentType
from apps.common.models import IdSequence
from apps.job import models as job_models
from apps.job import schemas as job_schemas
from apps.job.conf import actions, categories, priorities, states
from apps.shipment import conf, models, schemas
from apps.shipment.utils import shipment_recover, shipment_recall, action_shipment
from api.gql.shipment import types


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ShipmentInputType:
    laboratory_uid: str | None
    courier: str
    comment: str | None
    count: int | None = 1


@strawberry.input
class ShipmentUpdateInputType:
    laboratory_uid: str | None
    courier: str
    comment: str | None = ""


@strawberry.input
class ReferenceSampleInput:
    sample_uid: str | None = None
    shiped_sample_uid: str | None = None
    analyses: list[str] # list of analysis uids being assignes/unassigned

@strawberry.input
class ShipmentManageSamplesInput:
    samples: List[ReferenceSampleInput]
    action: str


@strawberry.type
class ShipmentListingType:
    shipments: Optional[List[ShipmentType]]



@strawberry.input
class ReferralLaboratoryInputType:
    name: str
    code: str
    url: str
    username: str
    password: str
    is_reference: bool = False
    is_referral: bool = False


ReferralLaboratoryResponse = strawberry.union(
    "ReferralLaboratoryResponse",
    (types.ReferralLaboratoryType, OperationError),  # noqa
    description="",
)



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
            "incoming": False,
            "comment": payload.comment,
            "courier": payload.courier,
            "laboratory_uid": payload.laboratory_uid,
            "shipment_id": None,
            "state": conf.shipment_states.EMPTY,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        sh_schema = schemas.ShipmentCreate(**incoming)

        shipment_schemas = [
            sh_schema.copy(
                update={"shipment_id": (await IdSequence.get_next_number("SH"))[1]}
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
    

        # if not all(not getattr(payload, attr) for attr in dir(payload)):
        #     return OperationError(error="Either comment, courier or samples must be provided.")

        shipment: Optional[models.Shipment] = await models.Shipment.get(
            uid=uid
        )

        if not shipment:
            return OperationError(
                error=f"Shipment {uid} does not exist"
            )
        
        shipment_data = shipment.to_dict()
        for field in shipment_data:
            if field in payload.__dict__:
                try:
                    setattr(shipment, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)
        
        shipment_in = schemas.ShipmentUpdate(**shipment.to_dict())
        shipment = await shipment.update(shipment_in)

        return ShipmentType(**shipment.marshal_simple())

    @strawberry.mutation
    async def action_shipment(
        self,
        info,
        uid: str,
        action: str
    ) -> ShipmentResponse:  # noqa

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can action shipments",
        )

        if not uid or not action:
            return OperationError(error="The uid/action for the update shipment was not provided")
    
        shipment: Optional[models.Shipment] = await models.Shipment.get(
            uid=uid
        )

        if not shipment:
            return OperationError(
                error=f"Shipment {uid} does not exist"
            )
        

        if action == "dispatch":
            shipment = await shipment.change_state(conf.shipment_states.AWAITING, felicity_user.uid)

            job_schema = job_schemas.JobCreate(
                action=actions.SH_DISPATCH,
                category=categories.SHIPMENT,
                priority=priorities.MEDIUM,
                creator_uid=felicity_user.uid,
                job_id=shipment.uid,
                status=states.PENDING,
                data=None,
            )
            await job_models.Job.create(job_schema)
            
        else:
            shipment = await action_shipment(uid, action, felicity_user)

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

        data = list(map(lambda s: s.__dict__, payload.samples))
        if payload.action == "assign":
            # Add a job
            job_schema = job_schemas.JobCreate(
                action=actions.SH_MANUAL_ASSIGN,
                category=categories.SHIPMENT,
                priority=priorities.MEDIUM,
                creator_uid=felicity_user.uid,
                job_id=shipment.uid,
                status=states.PENDING,
                data=data,
            )
            await job_models.Job.create(job_schema)
        elif payload.action == "recover":
            await shipment_recover(shipment.uid, data, felicity_user.uid)            
        elif payload.action == "recall":
            await shipment_recall(shipment.uid, data, felicity_user.uid)
        else:
            pass

        shipment = await models.Shipment.get(uid=uid)
        return ShipmentType(**shipment.marshal_simple())


    @strawberry.mutation
    async def create_referral_laboratory(info, payload: ReferralLaboratoryInputType) -> ReferralLaboratoryResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create referral labs",
        )

        if not payload.name or not payload.code:
            return OperationError(error="Name and Code are mandatory")

        stmt = models.ReferralLaboratory.smart_query(filters={ or_: {
            'name__exact': payload.name, 
            'code__exact': payload.code
        }})
        exists = await models.ReferralLaboratory.from_smart_query(stmt)
        if exists:
            return OperationError(error=f"ReferralLaboratory: {payload.name}, {payload.code} already exists")

        incoming = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.ReferralLaboratoryCreate(**incoming)
        referral_laboratory: models.ReferralLaboratory = await models.ReferralLaboratory.create(
            obj_in
        )
        return types.ReferralLaboratoryType(**referral_laboratory.marshal_simple())


    @strawberry.mutation
    async def update_referral_laboratory(
        info, uid: str, payload: ReferralLaboratoryInputType
    ) -> ReferralLaboratoryResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update referral labs",
        )

        referral_laboratory = await models.ReferralLaboratory.get(uid=uid)
        if not referral_laboratory:
            return OperationError(error=f"ReferralLaboratory with uid {uid} does not exist")

        st_data = referral_laboratory.to_dict()
        for field in st_data:
            if field in payload.__dict__:
                try:
                    setattr(referral_laboratory, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        referral_laboratory_in = schemas.ReferralLaboratoryUpdate(**referral_laboratory.to_dict())
        referral_laboratory = await referral_laboratory.update(referral_laboratory_in)
        return types.ReferralLaboratoryType(**referral_laboratory.marshal_simple())
