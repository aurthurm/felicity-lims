import logging

import strawberry

from beak.modules.shared.api.gql.auth import auth_from_info
from beak.modules.core.api.gql.commune.types import SmsTemplateType
from beak.modules.shared.api.gql.permissions import IsAuthenticated
from beak.modules.shared.api.gql.types import OperationError
from beak.modules.shared.api.gql.types.generic import DeletedItem
from beak.modules.core.commune.sms.enum import SmsAudience, SmsTrigger
from beak.modules.core.commune.sms.schemas import SmsTemplateCreate, SmsTemplateUpdate
from beak.modules.core.commune.sms.services import SmsTemplateService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class SmsTemplateInputType:
    name: str = strawberry.field(description="Category name")
    template: str
    description: str
    target_type: str
    target_uid: str
    specification_trigger: SmsTrigger = SmsTrigger.ANY_ABNORMAL
    audience: SmsAudience = SmsAudience.PATIENT
    is_active: bool = True


SmsTemplateResponse = strawberry.union(
    "SmsTemplateResponse",
    (SmsTemplateType, OperationError),
    description="Response for Sms Template operations",
)


@strawberry.type
class CommuneMutations:
    # Document Category Mutations
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_sms_template(
        self, info, payload: SmsTemplateInputType
    ) -> SmsTemplateResponse:
        beak_user = await auth_from_info(info)

        exists = await SmsTemplateService().get(name=payload.name)
        if exists:
            return OperationError(error="Sms template with this name already exists")

        incoming: dict = {
            "created_by_uid": beak_user.uid,
            "updated_by_uid": beak_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = SmsTemplateCreate(**incoming)
        template = await SmsTemplateService().create(obj_in)
        return SmsTemplateType(**template.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_sms_template(
        self, info, uid: str, payload: SmsTemplateInputType
    ) -> SmsTemplateResponse:
        beak_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update object.")

        template = await SmsTemplateService().get(uid=uid)
        if not template:
            return OperationError(
                error=f"Sms template with uid {uid} not found. Cannot update object..."
            )

        update_data = {"updated_by_uid": beak_user.uid}

        for field in template.to_dict():
            if field in payload.__dict__:
                if payload.__dict__[field] is not None:
                    update_data[field] = payload.__dict__[field]

        obj_in = SmsTemplateUpdate(**update_data)
        template = await SmsTemplateService().update(template.uid, obj_in)
        return SmsTemplateType(**template.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_sms_template(self, info, uid: str) -> OperationError | DeletedItem:
        template = await SmsTemplateService().get(uid=uid)
        if not template:
            return OperationError(error=f"Sms template with uid {uid} not found.")
        await SmsTemplateService().delete(uid)
        return DeletedItem(uid=uid)
