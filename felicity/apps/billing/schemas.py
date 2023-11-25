from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ServicePriceBase(BaseModel):
    is_active: bool
    amount: float
    analysis_service_uid: str


class ServicePriceBaseInDB(ServicePriceBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ServicePriceCreate(ServicePriceBase):
    pass


# Properties to receive via API on update
class ServicePriceUpdate(ServicePriceBase):
    pass


class ProfilePriceBase(BaseModel):
    is_active: bool
    amount: float
    analysis_profile_uid: str


class ProfilePriceBaseInDB(ProfilePriceBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ProfilePriceCreate(ProfilePriceBase):
    pass


# Properties to receive via API on update
class ProfilePriceUpdate(ProfilePriceBase):
    pass


class ServiceDiscountBase(BaseModel):
    name: str
    is_active: bool
    discount_type: bool
    value_type: bool
    start_date: datetime
    end_date: datetime
    voucher_uid: str
    voucher_code_uid: str
    value_percent: float
    value_amount: float
    analysis_service_uid: str


class ServiceDiscountBaseInDB(ServiceDiscountBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ServiceDiscountCreate(ServiceDiscountBase):
    pass


# Properties to receive via API on update
class ServiceDiscountUpdate(ServiceDiscountBase):
    pass


class ProfileDiscountBase(BaseModel):
    name: str
    is_active: bool
    discount_type: bool
    value_type: bool
    start_date: datetime
    end_date: datetime
    voucher_uid: str
    voucher_code_uid: str
    value_percent: float
    value_amount: float
    analysis_profile_uid: str


class ProfileDiscountBaseInDB(ProfileDiscountBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ProfileDiscountCreate(ProfileDiscountBase):
    pass


# Properties to receive via API on update
class ProfileDiscountUpdate(ProfileDiscountBase):
    pass


class VoucherBase(BaseModel):
    name: str
    usage_limit: float
    start_date: datetime
    end_date: datetime
    once_per_customer: bool
    once_per_order: bool
    single_use: bool
    only_for_staff: bool


class VoucherBaseInDB(VoucherBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class VoucherCreate(VoucherBase):
    pass


# Properties to receive via API on update
class VoucherUpdate(VoucherBase):
    pass


class VoucherCodeBase(BaseModel):
    code: str
    used: float
    is_active: bool


class VoucherCodeBaseInDB(VoucherCodeBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class VoucherCodeCreate(VoucherCodeBase):
    pass


# Properties to receive via API on update
class VoucherCodeUpdate(VoucherCodeBase):
    pass


class VoucherCustomerBase(BaseModel):
    patient_uid: str
    voucher_code_uid: str


class VoucherCustomerBaseInDB(VoucherCustomerBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class VoucherCustomerCreate(VoucherCustomerBase):
    pass


# Properties to receive via API on update
class VoucherCustomerUpdate(VoucherCustomerBase):
    pass


class TestBillBase(BaseModel):
    bill_id: str
    patient_uid: str
    client_uid: str
    is_active: bool
    to_confirm: bool
    partial: bool
    total_charged: float
    json_content: Optional[dict] = {}


class TestBillBaseInDB(TestBillBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class TestBillCreate(TestBillBase):
    pass


# Properties to receive via API on update
class TestBillUpdate(TestBillBase):
    pass


class TestBillTransactionBase(BaseModel):
    test_bill_uid: str
    kind: str
    amount: float
    error: bool
    is_success: bool
    action_required: str
    processed: bool


class TestBillTransactionBaseInDB(TestBillTransactionBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class TestBillTransactionCreate(TestBillTransactionBase):
    pass


# Properties to receive via API on update
class TestBillTransactionUpdate(TestBillTransactionBase):
    pass


class TestBillInvoiceBase(BaseModel):
    test_bill_uid: str
    json_content: Optional[dict] = {}
    pdf_content: Optional[bytes] = None


class TestBillInvoiceBaseInDB(TestBillInvoiceBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class TestBillInvoiceCreate(TestBillInvoiceBase):
    pass


# Properties to receive via API on update
class TestBillInvoiceUpdate(TestBillInvoiceBase):
    pass
