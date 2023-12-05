import logging
from datetime import datetime
import strawberry  # noqa
from strawberry.types import Info  # noqa

from api.gql.auth import auth_from_info, verify_user_auth
from api.gql.billing.types import (
    ProfilePriceType, ProfileDiscountType,
    AnalysisPriceType, AnalysisDiscountType,
    VoucherType, VoucherCodeType,
    TestBillTransactionType, TestBillType
)
from api.gql.permissions import IsAuthenticated
from api.gql.types import OperationError, DeletedItem
from apps.billing import models, schemas, utils

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ProfilePriceResponse = strawberry.union(
    "ProfilePriceResponse", (ProfilePriceType, OperationError), description=""  # noqa
)

AnalysisPriceResponse = strawberry.union(
    "AnalysisPriceResponse", (AnalysisPriceType, OperationError), description="" #
)

ProfileDiscountResponse = strawberry.union(
    "ProfileDiscountResponse", (ProfileDiscountType, OperationError), description=""  # noqa
)

AnalysisDiscountResponse = strawberry.union(
    "AnalysisDiscountResponse", (AnalysisDiscountType, OperationError), description="" #
)

VoucherResponse = strawberry.union(
    "VoucherResponse", (VoucherType, OperationError), description="" #
)

VoucherCodeResponse = strawberry.union(
    "VoucherCodeResponse", (VoucherCodeType, OperationError), description="" #
)

TestBillTransactionResponse = strawberry.union(
    "TestBillTransactionResponse", (TestBillTransactionType, OperationError), description="" #
)

TestBillResponse = strawberry.union(
    "TestBillResponse", (TestBillType, OperationError), description="" #
)


@strawberry.input
class PriceInput:
    amount: float
    is_active: bool | None = True

@strawberry.input
class PriceDiscountInput:
    name: str
    discount_type: str
    value_type: str
    start_date: datetime
    end_date: datetime
    voucher_uid: str
    value_percent: float
    value_amount: float
    is_active: bool

@strawberry.input
class VoucherInput:
    name: str
    usage_limit: int
    used: int
    start_date: datetime
    end_date: datetime
    once_per_customer: bool
    once_per_order: bool

@strawberry.input
class VoucherCodeInput:
    code: str
    voucher_uid: str
    usage_limit: int
    used: int
    is_active: bool
    
@strawberry.input
class BillTransactionInput:
    test_bill_uid: str
    kind: str
    amount: float
    error: bool | None = False
    is_success: bool | None = True
    action_required: str | None = ""
    processed: bool | None = False
    notes: str | None = ""
    patient_uid: str
    client_uid: str
    
@strawberry.input
class ApplyVoucherInput:
    voucher_code: str
    test_bill_uid: str 
    customer_uid: str


@strawberry.type
class BillingMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_profile_price(self, info: Info, uid:str, payload: PriceInput) -> ProfilePriceType:
        _, felicity_user = await auth_from_info(info)

        profile_price = await models.ProfilePrice.get(uid=uid)
        incoming: dict = {
            "amount": payload.amount,
            "is_active": payload.is_active,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        obj_in = schemas.ProfilePriceUpdate(**incoming)
        profile_price = await profile_price.update(obj_in)
        return ProfilePriceType(**profile_price.marshal_simple())
    
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_analysis_price(self, info: Info, uid:str,payload: PriceInput) -> AnalysisPriceType:
        _, felicity_user = await auth_from_info(info)

        analysis_price = await models.AnalysisPrice.get(uid=uid)
        incoming: dict = {
            "amount": payload.amount,
            "is_active": payload.is_active,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        obj_in = schemas.AnalysisPriceUpdate(**incoming)
        analysis_price = await analysis_price.update(obj_in)
        return AnalysisPriceType(**analysis_price.marshal_simple())


    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_profile_discount(
            self, info, uid: str, payload: PriceDiscountInput
    ) -> ProfileDiscountResponse:
        _, felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        profile_discount = await models.ProfileDiscount.get(uid=uid)
        if not profile_discount:
            return OperationError(
                error=f"ProfileDiscount with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = profile_discount.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(profile_discount, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(f"failed to set attribute {field}: {e}")
                    
        update_in: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        obj_in = schemas.ProfileDiscountUpdate(**{**profile_discount.to_dict(), **update_in})
        profile_discount = await profile_discount.update(obj_in)
        return ProfileDiscountType(**profile_discount.marshal_simple(), )


    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_analysis_discount(
            self, info, uid: str, payload: PriceDiscountInput
    ) -> AnalysisDiscountResponse:
        _, felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        analysis_discount = await models.AnalysisDiscount.get(uid=uid)
        if not analysis_discount:
            return OperationError(
                error=f"AnalysisDiscount with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = analysis_discount.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(analysis_discount, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(f"failed to set attribute {field}: {e}")
                    
        update_in: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        obj_in = schemas.AnalysisDiscountUpdate(**{**analysis_discount.to_dict(), **update_in})
        analysis_discount = await analysis_discount.update(obj_in)
        return AnalysisDiscountType(**analysis_discount.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_voucher(
            self, info: Info, payload: VoucherInput
    ) -> VoucherResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        success, auth_err = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create vouchers",
        )
        if not success:
            return auth_err

        exists = await models.Voucher.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"Voucher {payload.name} already exists"
            )

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.VoucherCreate(**incoming)
        voucher = await models.Voucher.create(obj_in)
        return VoucherType(**voucher.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_voucher(
            self, info, uid: str, payload: VoucherInput
    ) -> VoucherResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update vouchers",
        )

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        voucher = await models.Voucher.get(uid=uid)
        if not voucher:
            return OperationError(
                error=f"Voucher with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = voucher.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(voucher, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(f"failed to set attribute {field}: {e}")
        obj_in = schemas.VoucherUpdate(**voucher.to_dict())
        voucher = await voucher.update(obj_in)
        return VoucherType(**voucher.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_voucher_code(
            self, info: Info, payload: VoucherCodeInput
    ) -> VoucherCodeResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        success, auth_err = verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create voucher codes",
        )
        if not success:
            return auth_err

        exists = await models.VoucherCode.get(code=payload.code)
        if exists:
            return OperationError(
                error=f"Voucher Code {payload.code} already exists"
            )

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.VoucherCodeCreate(**incoming)
        voucher_code = await models.VoucherCode.create(obj_in)
        return VoucherCodeType(**voucher_code.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_voucher_code(
            self, info, uid: str, payload: VoucherCodeInput
    ) -> VoucherResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update voucher codes",
        )

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        voucher_code = await models.VoucherCode.get(uid=uid)
        if not voucher_code:
            return OperationError(
                error=f"Voucher with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = voucher_code.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(voucher_code, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(f"failed to set attribute {field}: {e}")
        obj_in = schemas.VoucherCodeUpdate(**voucher_code.to_dict())
        voucher_code = await voucher_code.update(obj_in)
        return VoucherType(**voucher_code.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_test_bill_transaction(
            self, info, payload: BillTransactionInput
    ) -> TestBillTransactionResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can add test bill transactions",
        )
        
        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.TestBillTransactionCreate(**incoming)
        tbt = await models.TestBillTransaction.create(obj_in)
        
        test_bill = await models.TestBill.get(uid=payload.test_bill_uid)
        test_bill.total_paid+=tbt.amount
        test_bill.partial = True
        if test_bill.total_paid >= test_bill.total_charged:
            test_bill.partial = False
            test_bill.is_active = False
        test_bill.update(**test_bill.dict())
        
        return TestBillTransactionType(**tbt.marshal_simple())


    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def apply_voucher(
            self, info, payload: ApplyVoucherInput
    ) -> TestBillTransactionResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can add test bill transactions",
        )
        bill = await utils.apply_voucher(payload.voucher_code, payload.test_bill_uid, payload.customer_uid)
        return TestBillType(**bill.marshal_simple())    
