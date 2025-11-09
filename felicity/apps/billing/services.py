from __future__ import annotations

import logging

from sqlalchemy.ext.asyncio import AsyncSession

from felicity.apps.abstract import BaseService
from felicity.apps.billing.entities import (
    AnalysisDiscount,
    AnalysisPrice,
    ProfileDiscount,
    ProfilePrice,
    TestBill,
    TestBillInvoice,
    TestBillTransaction,
    Voucher,
    VoucherCode,
    VoucherCustomer,
)
from felicity.apps.billing.repositories import (
    AnalysisDiscountRepository,
    AnalysisPriceRepository,
    ProfileDiscountRepository,
    ProfilePriceRepository,
    TestBillInvoiceRepository,
    TestBillRepository,
    TestBillTransactionRepository,
    VoucherCodeRepository,
    VoucherCustomerRepository,
    VoucherRepository,
)
from felicity.apps.billing.schemas import (
    AnalysisDiscountCreate,
    AnalysisDiscountUpdate,
    AnalysisPriceCreate,
    AnalysisPriceUpdate,
    ProfileDiscountCreate,
    ProfileDiscountUpdate,
    ProfilePriceCreate,
    ProfilePriceUpdate,
    TestBillCreate,
    TestBillInvoiceCreate,
    TestBillInvoiceUpdate,
    TestBillTransactionCreate,
    TestBillTransactionUpdate,
    TestBillUpdate,
    VoucherCodeCreate,
    VoucherCodeUpdate,
    VoucherCreate,
    VoucherCustomerCreate,
    VoucherCustomerUpdate,
    VoucherUpdate,
)
from felicity.apps.idsequencer.service import IdSequenceService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AnalysisPriceService(
    BaseService[AnalysisPrice, AnalysisPriceCreate, AnalysisPriceUpdate]
):
    def __init__(self) -> None:
        super().__init__(AnalysisPriceRepository())


class ProfilePriceService(
    BaseService[ProfilePrice, ProfilePriceCreate, ProfilePriceUpdate]
):
    def __init__(self) -> None:
        super().__init__(ProfilePriceRepository())


class AnalysisDiscountService(
    BaseService[AnalysisDiscount, AnalysisDiscountCreate, AnalysisDiscountUpdate]
):
    def __init__(self) -> None:
        super().__init__(AnalysisDiscountRepository())


class ProfileDiscountService(
    BaseService[ProfileDiscount, ProfileDiscountCreate, ProfileDiscountUpdate]
):
    def __init__(self) -> None:
        super().__init__(ProfileDiscountRepository())


class VoucherService(BaseService[Voucher, VoucherCreate, VoucherUpdate]):
    def __init__(self) -> None:
        super().__init__(VoucherRepository())

    async def get_discount_metrics(self) -> dict:
        """Calculate discount and voucher metrics"""
        # Get all active discounts
        analysis_discounts = await AnalysisDiscountService().get_all(is_active=True)
        profile_discounts = await ProfileDiscountService().get_all(is_active=True)

        # Calculate total discount amounts
        analysis_discount_amount = sum(
            d.value_amount if d.value_amount else 0 for d in analysis_discounts
        )
        profile_discount_amount = sum(
            d.value_amount if d.value_amount else 0 for d in profile_discounts
        )
        total_discount_amount = analysis_discount_amount + profile_discount_amount

        # Get voucher metrics
        vouchers = await self.all()
        total_vouchers = len(vouchers)
        active_vouchers = sum(1 for v in vouchers if v.usage_limit == 0 or v.used < v.usage_limit)

        # Calculate redemption rate
        total_voucher_usage = sum(v.used for v in vouchers)
        total_voucher_limit = sum(v.usage_limit for v in vouchers if v.usage_limit > 0)
        voucher_redemption_rate = (
            (total_voucher_usage / total_voucher_limit * 100)
            if total_voucher_limit > 0
            else 0.0
        )

        # Count vouchers with available usage
        vouchers_with_available_usage = sum(
            1 for v in vouchers if v.usage_limit == 0 or v.used < v.usage_limit
        )

        return {
            "total_discount_amount": total_discount_amount,
            "active_vouchers": active_vouchers,
            "total_vouchers": total_vouchers,
            "voucher_redemption_rate": voucher_redemption_rate,
            "vouchers_with_available_usage": vouchers_with_available_usage,
        }


class VoucherCodeService(
    BaseService[VoucherCode, VoucherCodeCreate, VoucherCodeUpdate]
):
    def __init__(self) -> None:
        super().__init__(VoucherCodeRepository())


class VoucherCustomerService(
    BaseService[VoucherCustomer, VoucherCustomerCreate, VoucherCustomerUpdate]
):
    def __init__(self) -> None:
        super().__init__(VoucherCustomerRepository())


class TestBillService(BaseService[TestBill, TestBillCreate, TestBillUpdate]):
    def __init__(self) -> None:
        self.id_sequence_service = IdSequenceService()
        self.test_bill_transaction_service = TestBillTransactionService()
        super().__init__(TestBillRepository())

    async def create(
            self, obj_in: dict | TestBillCreate, related: list[str] | None = None,
            commit: bool = True, session: AsyncSession | None = None
    ) -> "TestBill":
        data = self._import(obj_in)
        data["bill_id"] = (
            await self.id_sequence_service.get_next_number(prefix="RB", generic=True, commit=commit, session=session)
        )[1]
        return await super().create(data, related, commit=commit, session=session)

    async def confirm_bill(self, test_bill_uid: str):
        bill = await self.get(uid=test_bill_uid)
        transactions = await self.test_bill_transaction_service.get_all(
            test_bill_uid=test_bill_uid
        )
        if all(t.processed for t in transactions) and bill.partial == False:
            await self.update(test_bill_uid, {"to_confirm": False})

    async def get_for_client(self, client_uid: str) -> list[TestBill]:
        return await self.get_all(client_uid=client_uid)

    async def get_key_metrics(self) -> dict:
        """Calculate key financial metrics"""
        bills = await self.all()

        total_charged = sum(bill.total_charged for bill in bills)
        total_paid = sum(bill.total_paid for bill in bills)
        outstanding_balance = total_charged - total_paid
        collection_rate = (total_paid / total_charged * 100) if total_charged > 0 else 0.0

        return {
            "total_charged": total_charged,
            "total_paid": total_paid,
            "outstanding_balance": outstanding_balance,
            "collection_rate": collection_rate,
        }

    async def get_volume_metrics(self) -> dict:
        """Calculate bill volume metrics"""
        bills = await self.all()

        active_bills = sum(1 for bill in bills if bill.is_active)
        inactive_bills = sum(1 for bill in bills if not bill.is_active)
        pending_confirmation = sum(1 for bill in bills if bill.to_confirm)
        partial_bills = sum(1 for bill in bills if bill.partial)
        complete_bills = sum(1 for bill in bills if not bill.partial)

        return {
            "active_bills": active_bills,
            "inactive_bills": inactive_bills,
            "pending_confirmation": pending_confirmation,
            "partial_bills": partial_bills,
            "complete_bills": complete_bills,
        }

    async def get_transaction_metrics(self) -> dict:
        """Calculate transaction metrics"""
        transactions = await self.test_bill_transaction_service.all()

        successful_transactions = sum(1 for t in transactions if t.is_success)
        failed_transactions = sum(1 for t in transactions if not t.is_success and t.processed)
        pending_transactions = sum(1 for t in transactions if not t.processed)
        total_transaction_amount = sum(t.amount for t in transactions if t.is_success)

        return {
            "successful_transactions": successful_transactions,
            "failed_transactions": failed_transactions,
            "pending_transactions": pending_transactions,
            "total_transaction_amount": total_transaction_amount,
        }


class TestBillTransactionService(
    BaseService[
        TestBillTransaction, TestBillTransactionCreate, TestBillTransactionUpdate
    ]
):
    def __init__(self) -> None:
        super().__init__(TestBillTransactionRepository())


class TestBillInvoiceService(
    BaseService[TestBillInvoice, TestBillInvoiceCreate, TestBillInvoiceUpdate]
):
    def __init__(self) -> None:
        super().__init__(TestBillInvoiceRepository())
