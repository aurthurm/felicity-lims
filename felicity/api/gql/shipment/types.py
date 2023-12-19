from datetime import datetime

import strawberry  # noqa

from api.gql.analysis.types.analysis import (
    SampleType,
)
from api.gql.types import JSONScalar, BytesScalar
from api.gql.types import PageInfo
from api.gql.user.types import UserType
from apps.shipment.models import ShippedSample


@strawberry.type
class ReferralLaboratoryType:
    uid: str
    name: str | None
    code: str | None
    url: str | None
    username: str | None
    password: str | None
    is_reference: bool | None
    is_referral: bool | None
    created_by_uid: str | None
    created_by: UserType | None
    created_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: str | None


@strawberry.type
class ShipmentType:
    uid: str
    shipment_id: str | None
    comment: str | None
    courier: str | None
    assigned_count: int | None
    data: JSONScalar | None
    samples: list[SampleType] | None
    shipped_samples: list["ShippedSampleType"] | None
    state: str | None
    incoming: bool | None = False
    laboratory_uid: str | None
    laboratory: ReferralLaboratoryType | None
    json_content: JSONScalar | None
    pdf_content: BytesScalar | None
    finalised_by_uid: str | None
    finalised_by: UserType | None
    date_finalised: datetime | None
    dispatched_by_uid: str | None
    dispatched_by: UserType | None
    date_dispatched: datetime | None
    recalled_by_uid: str | None
    recalled_by: UserType | None
    date_recalled: datetime | None
    rejected_by_uid: str | None
    rejected_by: UserType | None
    date_rejected: datetime | None
    received_by_uid: str | None
    received_by: UserType | None
    date_received: datetime | None
    created_by_uid: str | None
    created_by: UserType | None
    created_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: str | None
    samples: list["SampleType"] | None

    @strawberry.field
    async def samples(self, info) -> list["SampleType"] | None:
        return [
            s
            for s in list(
                map(
                    lambda sam: sam.sample,
                    await ShippedSample.get_all(shipment_uid=self.uid),
                )
            )
        ]

    @strawberry.field
    async def shipped_samples(self, info) -> list["ShippedSampleType"] | None:
        return await ShippedSample.get_all(shipment_uid=self.uid)


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


@strawberry.type
class ShippedSampleType:
    sample_uid: str
    sample: SampleType
    shipment_uid: str
    shipment: ShipmentType
    result_notified: bool | None
    ext_sample_uid: str | None
    ext_sample_id: str | None
