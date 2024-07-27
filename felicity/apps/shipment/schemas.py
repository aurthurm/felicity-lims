from pydantic import BaseModel, ConfigDict

from felicity.apps.analysis.schemas import SampleBaseInDB

#
# ReferralLaboratory Schemas
#


# Shared properties
class ReferralLaboratoryBase(BaseModel):
    name: str | None = None
    code: str | None = None
    url: str | None = None
    username: str | None = None
    password: str | None = None
    is_reference: bool | None = None
    is_referral: bool | None = None


class ReferralLaboratoryBaseInDB(ReferralLaboratoryBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ReferralLaboratoryCreate(ReferralLaboratoryBase):
    pass


# Properties to receive via API on update
class ReferralLaboratoryUpdate(ReferralLaboratoryBase):
    pass


# Properties to return via API
class ReferralLaboratory(ReferralLaboratoryBaseInDB):
    pass


# Properties stored in DB
class ReferralLaboratoryInDB(ReferralLaboratoryBaseInDB):
    pass


#
# Shipment Schemas
#


# Shared properties
class ShipmentBase(BaseModel):
    shipment_id: str | None = None
    comment: str | None = None
    courier: str | None = None
    assigned_count: int | None = None
    data: dict | None = {}
    samples: SampleBaseInDB | None = None
    state: str | None = None
    incoming: bool | None = False
    laboratory_uid: str | None = None
    finalised_by_uid: str | None = None
    dispatched_by_uid: str | None = None
    recalled_by_uid: str | None = None
    rejected_by_uid: str | None = None
    received_by_uid: str | None = None
    # pdf manifest
    json_content: dict | None = {}
    pdf_content: bytes | None = None


class ShipmentBaseInDB(ShipmentBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


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


#
# ShippedSample Schemas
#


# Shared properties
class ShippedSampleBase(BaseModel):
    sample_uid: str | None = None
    shipment_uid: str | None = None


class ShippedSampleBaseInDB(ShippedSampleBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ShippedSampleCreate(ShippedSampleBase):
    pass


# Properties to receive via API on update
class ShippedSampleUpdate(ShippedSampleBase):
    pass


# Properties to return via API
class ShippedSample(ShippedSampleBaseInDB):
    pass


# Properties stored in DB
class ShippedSampleInDB(ShippedSampleBaseInDB):
    pass
