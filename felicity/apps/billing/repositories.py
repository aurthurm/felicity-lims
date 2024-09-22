from felicity.apps.abstract import BaseRepository
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


class AnalysisPriceRepository(BaseRepository[AnalysisPrice]):
    def __init__(self) -> None:
        super().__init__(AnalysisPrice)


class ProfilePriceRepository(BaseRepository[ProfilePrice]):
    def __init__(self) -> None:
        super().__init__(ProfilePrice)


class AnalysisDiscountRepository(BaseRepository[AnalysisDiscount]):
    def __init__(self) -> None:
        super().__init__(AnalysisDiscount)


class ProfileDiscountRepository(BaseRepository[ProfileDiscount]):
    def __init__(self) -> None:
        super().__init__(ProfileDiscount)


class VoucherRepository(BaseRepository[Voucher]):
    def __init__(self) -> None:
        super().__init__(Voucher)


class VoucherCodeRepository(BaseRepository[VoucherCode]):
    def __init__(self) -> None:
        super().__init__(VoucherCode)


class VoucherCustomerRepository(BaseRepository[VoucherCustomer]):
    def __init__(self) -> None:
        super().__init__(VoucherCustomer)


class TestBillRepository(BaseRepository[TestBill]):
    def __init__(self) -> None:
        super().__init__(TestBill)


class TestBillTransactionRepository(BaseRepository[TestBillTransaction]):
    def __init__(self) -> None:
        super().__init__(TestBillTransaction)


class TestBillInvoiceRepository(BaseRepository[TestBillInvoice]):
    def __init__(self) -> None:
        super().__init__(TestBillInvoice)
