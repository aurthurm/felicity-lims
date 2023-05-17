from datetime import datetime

import strawberry  # noqa
from api.gql import PageInfo
from api.gql.analysis.types.analysis import (
    SampleType,
)
from api.gql.types import JSONScalar
from api.gql.user.types import UserType




@strawberry.type
class ShipmentType:
    uid: str
    shipment_id: str | None
    comment: str | None
    assigned_count: int | None
    data: dict | None = {}
    samples: SampleType | None
    state: str | None
    incoming: bool| None = False
    finalised_by_uid: str | None    
    finalised_by: UserType | None
    date_finalised: datetime | None
    dispatched_by_uid: str| None
    dispatched_by: UserType | None
    date_dispatched: datetime | None
    recalled_by_uid: str| None
    recalled_by: UserType | None
    date_recalled: datetime | None
    rejected_by_uid: str| None
    rejected_by: UserType | None
    date_rejected: datetime | None
    received_by_uid: str| None
    received_by: UserType | None
    date_received: datetime | None


#  relay paginations
@strawberry.type
class ShipmentEdge:
    cursor: str
    node: ShipmentType


@strawberry.type
class ShipmentCursorPage:
    page_info: PageInfo
    edges: list[ShipmentEdge] | None
    items: list[ShipmentType] | None
    total_count: int
