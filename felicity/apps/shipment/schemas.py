from apps.analysis.schemas import SampleBaseInDB

from pydantic import BaseModel


#
# WSTemplate Schemas
#

# Shared properties
class ShipmentBase(BaseModel):
    shipment_id: str | None = None
    comment: str | None = None
    assigned_count: int | None = None
    data: dict | None = {}
    samples: SampleBaseInDB | None = None
    state: str | None = None
    incoming: bool| None = False
    finalised_by_uid: str| None = None
    dispatched_by_uid: str| None = None
    recalled_by_uid: str| None = None
    rejected_by_uid: str| None = None
    received_by_uid: str| None = None


class ShipmentBaseInDB(ShipmentBase):
    uid: str| None = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ShipmentCreate(ShipmentBase):
    pass


# Properties to receive via API on update
class ShipmentUpdate(ShipmentBase):
    pass


# Properties to return via API
class Shipment(ShipmentBaseInDB):
    pass


# Properties stored in DB
class ShipmentInDB(ShipmentBaseInDB):
    pass
