class InvalidVoucherCodeException(Exception):
    def __init__(self, message="Invalid Voucher Code"):
        self.message = message
        super().__init__(self.message)


class CustomerAlreadyUsedVoucherException(Exception):
    def __init__(self, message="Customer already used voucher"):
        self.message = message
        super().__init__(self.message)


class InactiveTestBillException(Exception):
    def __init__(self, message="Inactive TestBill"):
        self.message = message
        super().__init__(self.message)


class InvalidVoucherCodeException(Exception):
    def __init__(self, message="Invalid Voucher Code"):
        self.message = message
        super().__init__(self.message)


class InactiveVoucherCodeException(Exception):
    def __init__(self, message="Inactive Voucher Code"):
        self.message = message
        super().__init__(self.message)


class VoucherCodeLimitExceededException(Exception):
    def __init__(self, message="Voucher Code Limit exceeded"):
        self.message = message
        super().__init__(self.message)


class VoucherLimitExceededException(Exception):
    def __init__(self, message="Voucher Limit exceeded"):
        self.message = message
        super().__init__(self.message)
