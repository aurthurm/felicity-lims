from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from felicity.core.dtz import timenow_dt


class AnalysisPriceBase(BaseModel):
    is_active: bool
    amount: float
    analysis_uid: str | None = None


class AnalysisPriceBaseInDB(AnalysisPriceBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisPriceCreate(AnalysisPriceBase):
    pass


# Properties to receive via API on update
class AnalysisPriceUpdate(AnalysisPriceBase):
    pass


class ProfilePriceBase(BaseModel):
    is_active: bool
    amount: float
    profile_uid: str | None = None


class ProfilePriceBaseInDB(ProfilePriceBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ProfilePriceCreate(ProfilePriceBase):
    pass


# Properties to receive via API on update
class ProfilePriceUpdate(ProfilePriceBase):
    pass


class AnalysisDiscountBase(BaseModel):
    analysis_uid: str
    name: str
    discount_type: str
    value_type: str
    start_date: datetime = timenow_dt()
    end_date: datetime = timenow_dt()
    voucher_uid: str | None = None
    value_percent: float | None = None
    value_amount: float | None = None
    is_active: bool = True


class AnalysisDiscountBaseInDB(AnalysisDiscountBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class AnalysisDiscountCreate(AnalysisDiscountBase):
    pass


# Properties to receive via API on update
class AnalysisDiscountUpdate(AnalysisDiscountBase):
    analysis_uid: str | None = None
    name: str | None = None


class ProfileDiscountBase(BaseModel):
    profile_uid: str
    name: str
    discount_type: str | None = None
    value_type: str | None = None
    start_date: datetime = timenow_dt()
    end_date: datetime = timenow_dt()
    voucher_uid: str | None = None
    value_percent: float | None = None
    value_amount: float | None = None
    is_active: bool = True


class ProfileDiscountBaseInDB(ProfileDiscountBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ProfileDiscountCreate(ProfileDiscountBase):
    pass


# Properties to receive via API on update
class ProfileDiscountUpdate(ProfileDiscountBase):
    profile_uid: str | None = None
    name: str | None = None


class VoucherBase(BaseModel):
    name: str
    usage_limit: int
    used: int | None = None
    start_date: datetime
    end_date: datetime
    once_per_customer: bool
    once_per_order: bool


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
    voucher_uid: str
    usage_limit: int
    used: int | None = None
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
    bill_id: str | None = None
    patient_uid: str
    client_uid: str
    is_active: bool
    to_confirm: bool
    partial: bool = False
    total_charged: float
    total_paid: float = 0.0
    json_content: Optional[dict] = {}


class TestBillBaseInDB(TestBillBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class TestBillCreate(TestBillBase):
    pass


# Properties to receive via API on update
class TestBillUpdate(TestBillBase):
    patient_uid: str | None = None
    client_uid: str | None = None
    total_charged: float | None = None
    is_active: bool | None = None
    to_confirm: bool | None = None


class TestBillTransactionBase(BaseModel):
    test_bill_uid: str
    kind: str
    amount: float
    is_success: bool = False
    action_required: bool = False
    processed: bool = False
    notes: str
    message: str | None = ""
    action_message: str | None = ""


class TestBillTransactionBaseInDB(TestBillTransactionBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class TestBillTransactionCreate(TestBillTransactionBase):
    pass


# Properties to receive via API on update
class TestBillTransactionUpdate(TestBillTransactionBase):
    test_bill_uid: str | None = None
    kind: str | None = None
    amount: float | None = None
    notes: str | None = None


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
