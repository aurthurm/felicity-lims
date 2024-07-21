import sqlalchemy as sa

from domain.shared.ports.paginator.cursor import PageCursor
from domain.shipment.ports.repository import (
    IReferralLaboratoryRepository,
    IShipmentRepository,
    IShippedSampleRepository,
)
from infrastructure.database.repository.base import BaseRepository
from infrastructure.database.shipment.entities import (
    ReferralLaboratory,
    Shipment,
    ShippedSample,
)


class ReferralLaboratoryRepository(
    BaseRepository[ReferralLaboratory], IReferralLaboratoryRepository
):
    def __init__(self) -> None:
        self.model = ReferralLaboratory
        super().__init__()


class ShipmentRepository(BaseRepository[Shipment], IShipmentRepository):
    def __init__(self) -> None:
        self.model = Shipment
        super().__init__()

    async def paginate_with_cursors(
        self,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        incoming: bool = False,
        status: str | None = None,
        sort_by: list[str] | None = None,
    ) -> PageCursor:

        filters = [{"incoming": incoming}]

        _or_text_ = {}
        if text:
            arg_list = [
                "state__ilike",
                "shipment_id__ilike",
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        if status:
            filters.append({"state__exact": status})
        return super().paginate(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class ShippedSampleRepository(BaseRepository[ShippedSample], IShippedSampleRepository):
    def __init__(self) -> None:
        self.model = ShippedSample
        super().__init__()
