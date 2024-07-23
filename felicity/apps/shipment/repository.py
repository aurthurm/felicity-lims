import sqlalchemy as sa

from felicity.apps.shipment.entities import (
    ReferralLaboratory,
    Shipment,
    ShippedSample,
)
from felicity.database.paging import PageCursor
from felicity.apps.abstract.repository import BaseRepository


class ReferralLaboratoryRepository(
    BaseRepository[ReferralLaboratory]
):
    def __init__(self) -> None:
        super().__init__(ReferralLaboratory)


class ShipmentRepository(BaseRepository[Shipment]):
    def __init__(self) -> None:
        super().__init__(Shipment)

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
        return super().paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class ShippedSampleRepository(BaseRepository[ShippedSample]):
    def __init__(self) -> None:
        super().__init__(ShippedSample)
