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
from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.types import BytesScalar, JSONScalar, PageInfo
from felicity.api.gql.user.types import UserType
from felicity.apps.analysis.services.analysis import AnalysisRequestService
from felicity.apps.billing.entities import test_bill_item
from felicity.apps.billing.services import TestBillService, VoucherCodeService


@strawberry.type
class AnalysisPriceType:
    uid: str
    analysis_uid: str
    analysis: AnalysisType
    is_active: bool
    amount: float
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class ProfilePriceType:
    uid: str
    profile_uid: str
    profile: ProfileType
    is_active: bool
    amount: float
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


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
    voucher_uid: str | None = None
    voucher: Optional["VoucherType"] = None
    value_percent: float
    value_amount: float
    is_active: bool
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


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
    voucher_uid: str | None = None
    voucher: Optional["VoucherType"] = None
    value_percent: float
    value_amount: float
    is_active: bool
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def codes(self) -> Optional[list["VoucherCodeType"]]:
        return await VoucherCodeService().get_all(voucher_uid=self.uid)


@strawberry.type
class VoucherCodeType:
    uid: str
    code: str
    voucher_uid: str
    voucher: VoucherType
    usage_limit: int
    used: int
    is_active: bool
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class VoucherCustomerType:
    uid: str
    patient_uid: str
    patient: PatientType
    voucher_code_uid: str
    voucher_code: VoucherCodeType
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


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
    json_content: JSONScalar | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def orders(self) -> Optional[list[AnalysisRequestType]]:
        test_bills = await TestBillService().repository.table_query(
            test_bill_item, ["analysis_request_uid"], test_bill_uid=self.uid
        )
        return await AnalysisRequestService().get_by_uids(uids=test_bills)


@strawberry.type
class TestBillEdge:
    cursor: str
    node: TestBillType


@strawberry.type
class TestBillCursorPage:
    page_info: PageInfo
    edges: Optional[List[TestBillEdge]] = None
    items: Optional[List[TestBillType]] = None
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
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class TestBillInvoiceType:
    uid: str
    test_bill_uid: str
    test_bill: TestBillType
    json_content: JSONScalar | None = None
    pdf_content: BytesScalar | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
