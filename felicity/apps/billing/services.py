from felicity.apps.abstract import BaseService
from felicity.apps.billing.entities import (
    AnalysisDiscount, AnalysisPrice,
    ProfileDiscount, ProfilePrice, TestBill,
    TestBillInvoice, TestBillTransaction,
    Voucher, VoucherCode, VoucherCustomer
)
from felicity.apps.billing.repositories import (
    AnalysisDiscountRepository, AnalysisPriceRepository,
    ProfileDiscountRepository, ProfilePriceRepository,
    TestBillInvoiceRepository, TestBillRepository,
    TestBillTransactionRepository, VoucherCodeRepository,
    VoucherCustomerRepository, VoucherRepository
)
from felicity.apps.billing.schemas import (AnalysisDiscountCreate, AnalysisDiscountUpdate,
    AnalysisPriceCreate, AnalysisPriceUpdate, ProfileDiscountCreate, ProfileDiscountUpdate,
    ProfilePriceCreate, ProfilePriceUpdate, TestBillCreate, TestBillInvoiceCreate,
    TestBillInvoiceUpdate, TestBillTransactionCreate, TestBillTransactionUpdate, TestBillUpdate,
    VoucherCodeCreate, VoucherCodeUpdate, VoucherCreate, VoucherCustomerCreate,
    VoucherCustomerUpdate, VoucherUpdate)
from felicity.apps.idsequencer.entities import IdSequence
from felicity.apps.idsequencer.service import IdSequenceService


class AnalysisPriceService(BaseService[AnalysisPrice, AnalysisPriceCreate, AnalysisPriceUpdate]):
    def __init__(self) -> None:
        super().__init__(AnalysisPriceRepository)


class ProfilePriceService(BaseService[ProfilePrice, ProfilePriceCreate, ProfilePriceUpdate]):
    def __init__(self) -> None:
        super().__init__(ProfilePriceRepository)

class AnalysisDiscountService(BaseService[AnalysisDiscount, AnalysisDiscountCreate, AnalysisDiscountUpdate]):
    def __init__(self) -> None:
        super().__init__(AnalysisDiscountRepository)

class ProfileDiscountService(BaseService[ProfileDiscount, ProfileDiscountCreate, ProfileDiscountUpdate]):
    def __init__(self) -> None:
        super().__init__(ProfileDiscountRepository)

class VoucherService(BaseService[Voucher, VoucherCreate, VoucherUpdate]):
    def __init__(self) -> None:
        super().__init__(VoucherRepository)

class VoucherCodeService(BaseService[VoucherCode, VoucherCodeCreate, VoucherCodeUpdate]):
    def __init__(self) -> None:
        super().__init__(VoucherCodeRepository)

class VoucherCustomerService(BaseService[VoucherCustomer, VoucherCustomerCreate, VoucherCustomerUpdate]):
    def __init__(self) -> None:
        super().__init__(VoucherCustomerRepository)

class TestBillService(BaseService[TestBill, TestBillCreate, TestBillUpdate]):
    def __init__(self) -> None:
        self.id_sequence_servce = IdSequenceService()
        super().__init__(TestBillRepository)

    async def create(self, obj_in: dict | TestBillCreate) -> "TestBill":
        data = self._import(obj_in)
        data["bill_id"] = (await self.id_sequence_servce.get_next_number(prefix="X", generic=True))[1]
        return await super().create(**data)

class TestBillTransactionService(BaseService[TestBillTransaction, TestBillTransactionCreate, TestBillTransactionUpdate]):
    def __init__(self) -> None:
        super().__init__(TestBillTransactionRepository)

class TestBillInvoiceService(BaseService[TestBillInvoice, TestBillInvoiceCreate, TestBillInvoiceUpdate]):
    def __init__(self) -> None:
        super().__init__(TestBillInvoiceRepository)
