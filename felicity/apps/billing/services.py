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
            await self.id_sequence_service.get_next_number(prefix="X", generic=True)
        )[1]
        return await super().create(data, related, commit=commit, session=session)

    async def confirm_bill(self, test_bill_uid: str):
        bill = await self.get(uid=test_bill_uid)
        transactions = await self.test_bill_transaction_service.get_all(
            test_bill_uid=test_bill_uid
        )
        if all(t.processed for t in transactions) and bill.partial == False:
            await self.update(test_bill_uid, {"to_confirm": False})


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
