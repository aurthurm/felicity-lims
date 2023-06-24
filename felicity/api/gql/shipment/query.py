import logging
from typing import List

import sqlalchemy as sa
import strawberry  # noqa
from api.gql import PageInfo
from api.gql.shipment.types import (
    ShipmentCursorPage,
    ShipmentEdge,
    ShipmentType,
    ReferralLaboratoryType
)
from api.gql.types import BytesScalar
from apps.shipment import models
from utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@strawberry.type
class ShipmentQuery:
    @strawberry.field
    async def shipment_all(
        self,
        info,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        incoming: bool = False,
        status: str | None = None,
        sort_by: list[str] | None = None,
    ) -> ShipmentCursorPage:

        filters = [
            {"incoming" : incoming }
        ]

        _or_text_ = {}
        if has_value_or_is_truthy(text):
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

        page = await models.Shipment.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[ShipmentEdge[ShipmentType]] = page.edges
        items: List[ShipmentType] = page.items
        page_info: PageInfo = page.page_info

        return ShipmentCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field
    async def shipment_by_uid(self, info, shipment_uid: str) -> ShipmentType:
        return await models.Shipment.get(uid=shipment_uid)

    @strawberry.field
    async def shipment_by_id(self, info, shipment_id: str) -> ShipmentType:
        return await models.Shipment.get(shipment_id=shipment_id)

    @strawberry.field
    async def shipment_by_status(
        self, info, shipment_status: str
    ) -> List[ShipmentType]:
        return await models.Shipment.get_all(status__exact=shipment_status)
    
    @strawberry.field
    async def referral_laboratory_all(self, info) -> list[ReferralLaboratoryType]:
        return await models.ReferralLaboratory.all()

    @strawberry.field
    async def referral_laboratory_by_uid(self, info, uid: str) -> ReferralLaboratoryType:
        return await models.ReferralLaboratory.get(uid=uid)

    @strawberry.field
    async def referral_laboratory_by_code(self, info, code: str) -> ReferralLaboratoryType:
        return await models.ReferralLaboratory.get(code=code)
    
    @strawberry.field
    async def manifest_report_download(
        self, info, uid: str
    ) -> BytesScalar | None:
        shipment = await models.Shipment.get(uid=uid)

        if not shipment:
            return None

        # io.BytesIO()
        return shipment.pdf_content
