from datetime import datetime

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import SampleType
from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.types import BytesScalar, JSONScalar, PageInfo
from felicity.api.gql.user.types import UserType
from felicity.apps.shipment.services import ShippedSampleService


@strawberry.type
class ReferralLaboratoryType:
    uid: str
    name: str | None = None
    code: str | None = None
    url: str | None = None
    username: str | None = None
    password: str | None = None
    is_reference: bool | None = None
    is_referral: bool | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None


@strawberry.type
class ShipmentType:
    uid: str
    shipment_id: str | None = None
    comment: str | None = None
    courier: str | None = None
    assigned_count: int | None = None
    data: JSONScalar | None = None
    state: str | None = None
    incoming: bool = False
    laboratory_uid: str | None = None
    laboratory: ReferralLaboratoryType | None = None
    json_content: JSONScalar | None = None
    pdf_content: BytesScalar | None = None
    finalised_by_uid: str | None = None
    finalised_by: UserType | None = None
    date_finalised: datetime | None = None
    dispatched_by_uid: str | None = None
    dispatched_by: UserType | None = None
    date_dispatched: datetime | None = None
    recalled_by_uid: str | None = None
    recalled_by: UserType | None = None
    date_recalled: datetime | None = None
    rejected_by_uid: str | None = None
    rejected_by: UserType | None = None
    date_rejected: datetime | None = None
    received_by_uid: str | None = None
    received_by: UserType | None = None
    date_received: datetime | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None

    @strawberry.field
    async def samples(self, info) -> list["SampleType"] | None:
        return [
            s
            for s in list(
                map(
                    lambda sam: sam.sample,
                    await ShippedSampleService().get_all(shipment_uid=self.uid),
                )
            )
        ]

    @strawberry.field
    async def shipped_samples(self, info) -> list["ShippedSampleType"] | None:
        return await ShippedSampleService().get_all(shipment_uid=self.uid)


#  relay paginations
@strawberry.type
class ShipmentEdge:
    cursor: str
    node: ShipmentType


@strawberry.type
class ShipmentCursorPage:
    page_info: PageInfo
    edges: list[ShipmentEdge] | None = None
    items: list[ShipmentType] | None = None
    total_count: int


@strawberry.type
class ShippedSampleType:
    sample_uid: str
    sample: SampleType
    shipment_uid: str
    shipment: ShipmentType
    result_notified: bool | None = None
    ext_sample_uid: str | None = None
    ext_sample_id: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
