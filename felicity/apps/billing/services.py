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
from felicity.apps.billing.schemas import TestBillCreate, TestBillUpdate
from felicity.apps.idsequencer.entities import IdSequence
from felicity.apps.idsequencer.service import IdSequenceService


class AnalysisPriceService(BaseService[AnalysisPrice]):
    def __init__(self) -> None:
        super().__init__(AnalysisPriceRepository)


AnalysisPriceService().create()

class ProfilePriceService(BaseService[ProfilePrice]):
    def __init__(self) -> None:
        super().__init__(ProfilePriceRepository)

class AnalysisDiscountService(BaseService[AnalysisDiscount]):
    def __init__(self) -> None:
        super().__init__(AnalysisDiscountRepository)

class ProfileDiscountService(BaseService[ProfileDiscount]):
    def __init__(self) -> None:
        super().__init__(ProfileDiscountRepository)

class VoucherService(BaseService[Voucher]):
    def __init__(self) -> None:
        super().__init__(VoucherRepository)

class VoucherCodeService(BaseService[VoucherCode]):
    def __init__(self) -> None:
        super().__init__(VoucherCodeRepository)

class VoucherCustomerService(BaseService[VoucherCustomer]):
    def __init__(self) -> None:
        super().__init__(VoucherCustomerRepository)

class TestBillService(BaseService[TestBill, TestBillCreate, TestBillUpdate]):
    id_sequence_servce = IdSequenceService()

    def __init__(self) -> None:
        super().__init__(TestBillRepository)

    @classmethod
    async def create(cls, obj_in: dict | TestBillCreate) -> "TestBill":
        data = cls._import(obj_in)
        data["bill_id"] = (await cls.id_sequence_servce.get_next_number(prefix="X", generic=True))[1]
        return await super().create(**data)

class TestBillTransactionService(BaseService[TestBillTransaction]):
    def __init__(self) -> None:
        super().__init__(TestBillTransactionRepository)

class TestBillInvoiceService(BaseService[TestBillInvoice]):
    def __init__(self) -> None:
        super().__init__(TestBillInvoiceRepository)
