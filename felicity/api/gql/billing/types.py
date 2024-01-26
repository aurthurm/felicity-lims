from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import (
    AnalysisRequestType,
    AnalysisType,
    ProfileType,
)
from felicity.api.gql.client.types import ClientType
from felicity.api.gql.patient.types import PatientType
from felicity.api.gql.types import BytesScalar, JSONScalar
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType
from felicity.apps.analysis.models.analysis import AnalysisRequest
from felicity.apps.billing.models import TestBill, test_bill_item, VoucherCode


@strawberry.type
class AnalysisPriceType:
    uid: str
    analysis_uid: str
    analysis: AnalysisType
    is_active: bool
    amount: float
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class ProfilePriceType:
    uid: str
    profile_uid: str
    profile: ProfileType
    is_active: bool
    amount: float
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class AnalysisDiscountType:
    uid: str
    analysis_uid: str
    analysis: AnalysisType
    name: str
    discount_type: str
    value_type: str
    start_date: datetime
    end_date: datetime
    voucher_uid: str | None
    voucher: Optional["VoucherType"]
    value_percent: float
    value_amount: float
    is_active: bool
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class ProfileDiscountType:
    uid: str
    profile_uid: str
    profile: ProfileType
    name: str
    discount_type: str
    value_type: str
    start_date: datetime
    end_date: datetime
    voucher_uid: str | None
    voucher: Optional["VoucherType"]
    value_percent: float
    value_amount: float
    is_active: bool
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class VoucherType:
    uid: str
    name: str
    usage_limit: int
    used: int
    start_date: str
    end_date: str
    once_per_customer: bool
    once_per_order: bool
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None

    @strawberry.field
    async def codes(self) -> Optional[list["VoucherCodeType"]]:
        return await VoucherCode.get_all(voucher_uid=self.uid)


@strawberry.type
class VoucherCodeType:
    uid: str
    code: str
    voucher_uid: str
    voucher: VoucherType
    usage_limit: int
    used: int
    is_active: bool
    created_at: str
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class VoucherCustomerType:
    uid: str
    patient_uid: str
    patient: PatientType
    voucher_code_uid: str
    voucher_code: VoucherCodeType
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class TestBillType:
    uid: str
    bill_id: str
    patient_uid: str
    patient: PatientType
    client_uid: str
    client: ClientType
    is_active: bool
    to_confirm: bool
    partial: bool
    total_charged: float
    total_paid: float
    json_content: JSONScalar | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None

    @strawberry.field
    async def orders(self) -> Optional[list[AnalysisRequestType]]:
        test_bills = await TestBill.query_table(
            test_bill_item, ["analysis_request_uid"], test_bill_uid=self.uid
        )
        return await AnalysisRequest.get_by_uids(uids=test_bills)


@strawberry.type
class TestBillEdge:
    cursor: str
    node: TestBillType


@strawberry.type
class TestBillCursorPage:
    page_info: PageInfo
    edges: Optional[List[TestBillEdge]]
    items: Optional[List[TestBillType]]
    total_count: int


@strawberry.type
class TestBillTransactionType:
    uid: str
    test_bill_uid: str
    test_bill: TestBillType
    kind: str
    amount: float
    is_success: bool
    action_required: bool
    processed: bool
    notes: str
    message: str
    action_message: str
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class TestBillInvoiceType:
    uid: str
    test_bill_uid: str
    test_bill: TestBillType
    json_content: JSONScalar | None
    pdf_content: BytesScalar | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None
