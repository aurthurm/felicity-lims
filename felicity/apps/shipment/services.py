from felicity.apps.abstract.service import BaseService
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.notification.services import ActivityStreamService
from felicity.apps.shipment.entities import ReferralLaboratory, Shipment, ShippedSample
from felicity.apps.shipment.enum import ShipmentState
from felicity.apps.shipment.repository import (
    ReferralLaboratoryRepository,
    ShipmentRepository,
    ShippedSampleRepository,
)
from felicity.apps.shipment.schemas import (
    ReferralLaboratoryCreate,
    ReferralLaboratoryUpdate,
    ShipmentCreate,
    ShipmentUpdate,
    ShippedSampleCreate,
    ShippedSampleUpdate,
)


class ReferralLaboratoryService(
    BaseService[ReferralLaboratory, ReferralLaboratoryCreate, ReferralLaboratoryUpdate]
):
    def __init__(self):
        super().__init__(ReferralLaboratoryRepository)


class ShippedSampleService(
    BaseService[ShippedSample, ShippedSampleCreate, ShippedSampleUpdate]
):
    def __init__(self):
        super().__init__(ShippedSampleRepository)


class ShipmentService(BaseService[Shipment, ShipmentCreate, ShipmentUpdate]):
    def __init__(self):
        self.id_sequence_service = IdSequenceService()
        self.shipped_sample_service = ShipmentRepository()
        self.activity_service = ActivityStreamService()
        super().__init__(ShipmentRepository)

    async def set_flow(self, uid: str, flow: bool = False):
        """Set whether the flow is incoming or outgoing"""
        await super().update(uid, {"incoming": flow})

    async def get_samples(self, uid: str):
        return list(
            map(
                lambda ss: ss.sample,
                await self.shipped_sample_service.get_all(shipment_uid=uid),
            )
        )

    async def change_state(self, uid: str, state, updated_by_uid):
        return await super().update(
            uid, {"state": state, "updated_by_uid": updated_by_uid}
        )

    async def finalise(self, uid: str, finaliser):
        if self.state == ShipmentState.PREPERATION:
            saved = await super().update(
                uid, {"state": ShipmentState.READY, "updated_by_uid": finaliser.uid}
            )
            await self.activity_service.stream(
                saved, finaliser, "finalised", "shipment"
            )
            return saved
        return self

    async def dispatch(self, uid: str, dispatcher):
        if self.state == ShipmentState.READY:
            self.state = ShipmentState.AWAITING
            self.dispatched_by_uid = dispatcher.uid  # noqa
            saved = await super().update(
                uid, {"state": ShipmentState.READY, "dispatched_by_uid": dispatcher.uid}
            )
            await self.activity_service.stream(
                saved, dispatcher, "dispatched", "shipment"
            )
            return saved
        return self

    async def create(
        self, obj_in: dict | ShipmentCreate, related: list[str] = None
    ) -> Shipment:
        data = self._import(obj_in)
        data["shipment_id"] = (await self.id_sequence_service.get_next_number("SHIP"))[
            1
        ]
        return await super().create(data, related)
