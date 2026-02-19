from beak.modules.core.abstract.repository import BaseRepository
from beak.modules.core.shipment.entities import ReferralLaboratory, Shipment, ShippedSample


class ReferralLaboratoryRepository(BaseRepository[ReferralLaboratory]):
    def __init__(self) -> None:
        super().__init__(ReferralLaboratory)


class ShipmentRepository(BaseRepository[Shipment]):
    def __init__(self) -> None:
        super().__init__(Shipment)


class ShippedSampleRepository(BaseRepository[ShippedSample]):
    def __init__(self) -> None:
        super().__init__(ShippedSample)
