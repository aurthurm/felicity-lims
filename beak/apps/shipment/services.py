from beak.apps.abstract.service import BaseService
from beak.apps.idsequencer.service import IdSequenceService
from beak.apps.notification.enum import NotificationObject
from beak.apps.notification.services import ActivityStreamService
from beak.apps.shipment.entities import ReferralLaboratory, Shipment, ShippedSample
from beak.apps.shipment.enum import ShipmentState
from beak.apps.shipment.repository import (
    ReferralLaboratoryRepository,
    ShipmentRepository,
    ShippedSampleRepository,
)
from beak.apps.shipment.schemas import (
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
        super().__init__(ReferralLaboratoryRepository())


class ShippedSampleService(
    BaseService[ShippedSample, ShippedSampleCreate, ShippedSampleUpdate]
):
    def __init__(self):
        super().__init__(ShippedSampleRepository())


class ShipmentService(BaseService[Shipment, ShipmentCreate, ShipmentUpdate]):
    def __init__(self):
        self.id_sequence_service = IdSequenceService()
        self.shipped_sample_service = ShipmentRepository()
        self.activity_service = ActivityStreamService()
        super().__init__(ShipmentRepository())

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
        shipment = await self.get(uid=uid)
        if shipment.state == ShipmentState.PREPERATION:
            shipment = await super().update(
                uid, {"state": ShipmentState.READY, "updated_by_uid": finaliser.uid}
            )
            await self.activity_service.stream(
                shipment, finaliser, "finalised", NotificationObject.SHIPMENT
            )
        return shipment

    async def dispatch(self, uid: str, dispatcher):
        shipment = await self.get(uid=uid)
        if shipment.state == ShipmentState.READY:
            self.dispatched_by_uid = dispatcher.uid  # noqa
            shipment = await super().update(
                uid, {"state": ShipmentState.READY, "dispatched_by_uid": dispatcher.uid}
            )
            await self.activity_service.stream(
                shipment, dispatcher, "dispatched", NotificationObject.SHIPMENT
            )
        return shipment

    async def create(
        self, obj_in: dict | ShipmentCreate, related: list[str] | None = None
    ) -> Shipment:
        data = self._import(obj_in)
        data["shipment_id"] = (await self.id_sequence_service.get_next_number("SHIP"))[
            1
        ]
        return await super().create(data, related)
