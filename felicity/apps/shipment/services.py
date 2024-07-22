from felicity.apps.abstract.service import BaseService
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.notification.services import ActivityStreamService
from felicity.apps.shipment.conf import ShipmentStates
from felicity.apps.shipment.entities import ReferralLaboratory, Shipment, ShippedSample
from felicity.apps.shipment.repository import ReferralLaboratoryRepository, ShipmentRepository, ShippedSampleRepository
from felicity.apps.shipment.schemas import ReferralLaboratoryCreate, ReferralLaboratoryUpdate, ShipmentCreate, ShipmentUpdate, ShippedSampleCreate, ShippedSampleUpdate


class ReferralLaboratoryService(
    BaseService[ReferralLaboratory, ReferralLaboratoryCreate, ReferralLaboratoryUpdate]
):
    def __init__(self):
        super().__init__(ReferralLaboratoryRepository)


class ShippedSampleService(BaseService[ShippedSample, ShippedSampleCreate, ShippedSampleUpdate]):
    def __init__(self):
        super().__init__(ShippedSampleRepository)


class ShipmentService(BaseService[Shipment, ShipmentCreate, ShipmentUpdate]):
    id_sequence_service = IdSequenceService()

    def __init__(self):
        self.shipped_sample_service = ShipmentRepository()
        self.activity_service = ActivityStreamService()
        super().__init__(ShipmentRepository)

    async def set_flow(self, flow: bool = False):
        """Set whether the flow is incoming or outgoing"""
        self.incoming = flow
        await self.repository.update(self, incoming=flow)

    async def get_samples(self):
        return list(
            map(
                lambda ss: ss.sample, await self.shipped_sample_service.get_all(shipment_uid=self.uid)
            )
        )

    async def change_state(self, state, updated_by_uid):
        self.state = state
        self.updated_by_uid = updated_by_uid  # noqa
        return await self.save_async()

    async def finalise(self, finaliser):
        if self.state == ShipmentStates.PREPERATION:
            self.state = ShipmentStates.READY
            self.finalised_by_uid = finaliser.uid  # noqa
            saved = await self.save_async()
            await self.activity_service.stream(saved, finaliser, "finalised", "shipment")
            return saved
        return self

    async def dispatch(self, dispatcher):
        if self.state == ShipmentStates.READY:
            self.state = ShipmentStates.AWAITING
            self.dispatched_by_uid = dispatcher.uid  # noqa
            saved = await self.save_async()
            await self.activity_service.stream(saved, dispatcher, "dispatched", "shipment")
            return saved
        return self

    @classmethod
    async def create(cls, obj_in: dict | ShipmentCreate) -> Shipment:
        data = cls._import(obj_in)
        data["shipment_id"] = (await cls.id_sequence_service.get_next_number("SHIP"))[1]
        return await super().create(**data)
