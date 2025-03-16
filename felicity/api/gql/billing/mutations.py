import logging
from datetime import datetime

import strawberry  # noqa
from strawberry.permission import PermissionExtension
from strawberry.types import Info  # noqa

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.billing.types import (
    AnalysisDiscountType,
    AnalysisPriceType,
    ProfileDiscountType,
    ProfilePriceType,
    TestBillTransactionType,
    TestBillType,
    VoucherCodeType,
    VoucherType,
)
from felicity.api.gql.permissions import IsAuthenticated, HasPermission
from felicity.api.gql.types import OperationError
from felicity.apps.billing import schemas, utils
from felicity.apps.billing.enum import DiscountType, TransactionKind
from felicity.apps.billing.schemas import TestBillTransactionUpdate, TestBillUpdate
from felicity.apps.billing.services import (
    AnalysisDiscountService,
    AnalysisPriceService,
    ProfileDiscountService,
    ProfilePriceService,
    TestBillService,
    TestBillTransactionService,
    VoucherCodeService,
    VoucherService,
)
from felicity.apps.guard import FAction, FObject
from felicity.apps.impress.invoicing import utils as invoice_utils

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ProfilePriceResponse = strawberry.union(
    "ProfilePriceResponse",
    (ProfilePriceType, OperationError),
    description="",  # noqa
)

AnalysisPriceResponse = strawberry.union(
    "AnalysisPriceResponse",
    (AnalysisPriceType, OperationError),
    description="",  #
)

ProfileDiscountResponse = strawberry.union(
    "ProfileDiscountResponse",
    (ProfileDiscountType, OperationError),
    description="",  # noqa
)

AnalysisDiscountResponse = strawberry.union(
    "AnalysisDiscountResponse",
    (AnalysisDiscountType, OperationError),
    description="",  #
)

VoucherResponse = strawberry.union(
    "VoucherResponse",
    (VoucherType, OperationError),
    description="",  #
)

VoucherCodeResponse = strawberry.union(
    "VoucherCodeResponse",
    (VoucherCodeType, OperationError),
    description="",  #
)

TestBillTransactionResponse = strawberry.union(
    "TestBillTransactionResponse",
    (TestBillTransactionType, OperationError),
    description="",  #
)

TestBillResponse = strawberry.union(
    "TestBillResponse",
    (TestBillType, OperationError),
    description="",  #
)


@strawberry.input
class PriceInput:
    amount: float
    is_active: bool | None = True


@strawberry.input
class PriceDiscountInput:
    discount_type: str
    value_type: str | None = None
    start_date: datetime
    end_date: datetime
    voucher_uid: str | None = None
    value_percent: float | None = None
    value_amount: float | None = None
    is_active: bool


@strawberry.input
class VoucherInput:
    name: str
    usage_limit: int
    start_date: datetime
    end_date: datetime
    once_per_customer: bool
    once_per_order: bool


@strawberry.input
class VoucherCodeInput:
    code: str
    voucher_uid: str
    usage_limit: int
    is_active: bool


@strawberry.input
class BillTransactionInput:
    test_bill_uid: str
    kind: str
    amount: float
    notes: str | None = ""


@strawberry.input
class ApplyVoucherInput:
    voucher_code: str
    test_bill_uid: str
    customer_uid: str


@strawberry.type
class BillingMutations:
    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.BILLING)]
        )]
    )
    async def update_profile_price(
            self, info: Info, uid: str, payload: PriceInput
    ) -> ProfilePriceResponse:
        felicity_user = await auth_from_info(info)

        profile_price = await ProfilePriceService().get(uid=uid)
        incoming: dict = {
            "amount": payload.amount,
            "is_active": payload.is_active,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        obj_in = schemas.ProfilePriceUpdate(**incoming)
        profile_price = await ProfilePriceService().update(profile_price.uid, obj_in)
        return ProfilePriceType(**profile_price.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.BILLING)]
        )]
    )
    async def update_analysis_price(
            self, info: Info, uid: str, payload: PriceInput
    ) -> AnalysisPriceResponse:
        felicity_user = await auth_from_info(info)

        analysis_price = await AnalysisPriceService().get(uid=uid)
        incoming: dict = {
            "amount": payload.amount,
            "is_active": payload.is_active,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        obj_in = schemas.AnalysisPriceUpdate(**incoming)
        analysis_price = await AnalysisPriceService().update(analysis_price.uid, obj_in)
        return AnalysisPriceType(**analysis_price.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.BILLING)]
        )]
    )
    async def update_profile_discount(
            self, info, uid: str, payload: PriceDiscountInput
    ) -> ProfileDiscountResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        profile_discount = await ProfileDiscountService().get(uid=uid)
        if not profile_discount:
            return OperationError(
                error=f"ProfileDiscount with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = profile_discount.to_dict()
        payload_data = payload.__dict__
        if payload_data["discount_type"] == DiscountType.SALE:
            del payload_data["voucher_uid"]

        for field in obj_data:
            if field in payload_data:
                try:
                    setattr(profile_discount, field, payload_data[field])
                except Exception as e:
                    logger.warning(f"failed to set attribute {field}: {e}")

        update_in: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        obj_in = schemas.ProfileDiscountUpdate(
            **{**profile_discount.to_dict(), **update_in}
        )
        profile_discount = await ProfileDiscountService().update(
            profile_discount.uid, obj_in
        )
        return ProfileDiscountType(
            **profile_discount.marshal_simple(),
        )

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.BILLING)]
        )]
    )
    async def update_analysis_discount(
            self, info, uid: str, payload: PriceDiscountInput
    ) -> AnalysisDiscountResponse:
        felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        analysis_discount = await AnalysisDiscountService().get(uid=uid)
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
        obj_in = schemas.AnalysisDiscountUpdate(
            **{**analysis_discount.to_dict(), **update_in}
        )
        analysis_discount = await AnalysisDiscountService().update(
            analysis_discount.uid, obj_in
        )
        return AnalysisDiscountType(**analysis_discount.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.BILLING)]
        )]
    )
    async def create_voucher(
            self, info: Info, payload: VoucherInput
    ) -> VoucherResponse:
        felicity_user = await auth_from_info(info)

        exists = await VoucherService().get(name=payload.name)
        if exists:
            return OperationError(error=f"Voucher {payload.name} already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.VoucherCreate(**incoming)
        voucher = await VoucherService().create(obj_in)
        return VoucherType(**voucher.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.BILLING)]
        )]
    )
    async def update_voucher(
            self, info, uid: str, payload: VoucherInput
    ) -> VoucherResponse:
        await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        voucher = await VoucherService().get(uid=uid)
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
        voucher = await VoucherService().update(voucher.uid, obj_in)
        return VoucherType(**voucher.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.BILLING)]
        )]
    )
    async def create_voucher_code(
            self, info: Info, payload: VoucherCodeInput
    ) -> VoucherCodeResponse:
        felicity_user = await auth_from_info(info)

        exists = await VoucherCodeService().get(code=payload.code)
        if exists:
            return OperationError(error=f"Voucher Code {payload.code} already exists")

        incoming: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.VoucherCodeCreate(**incoming)
        voucher_code = await VoucherCodeService().create(obj_in, related=["voucher"])
        return VoucherCodeType(**voucher_code.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.BILLING)]
        )]
    )
    async def update_voucher_code(
            self, info, uid: str, payload: VoucherCodeInput
    ) -> VoucherCodeResponse:
        await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identify update obj")

        voucher_code = await VoucherCodeService().get(uid=uid)
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
        voucher_code = await VoucherCodeService().update(voucher_code.uid, obj_in)
        return VoucherCodeType(**voucher_code.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.BILLING)]
        )]
    )
    async def create_test_bill_transaction(
            self, info, payload: BillTransactionInput
    ) -> TestBillTransactionResponse:
        felicity_user = await auth_from_info(info)
        if payload.amount <= 0:
            return OperationError(
                error="Invalid transaction Amount.",
                suggestion="Transaction amount must be greater than 0",
            )

        test_bill = await TestBillService().get(uid=payload.test_bill_uid)
        incoming: dict = {
            "patient_uid": test_bill.patient_uid,
            "client_uid": test_bill.client_uid,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.TestBillTransactionCreate(**incoming)
        tbt = await TestBillTransactionService().create(obj_in)

        test_bill_update = {
            "total_paid": test_bill.total_paid + tbt.amount,
            "partial": True,
        }
        if test_bill_update["total_paid"] >= test_bill.total_charged:
            test_bill_update["partial"] = False
            test_bill_update["is_active"] = False
        await TestBillService().update(
            test_bill.uid, TestBillUpdate(**test_bill_update)
        )

        transaction_update = {"is_success": True}
        if payload.kind == TransactionKind.CASH:
            transaction_update["action_required"] = False
            transaction_update["processed"] = True
        else:
            incoming["action_required"] = False
            incoming["action_message"] = "Confirm funds reception"

        tbt = await TestBillTransactionService().update(
            tbt.uid, TestBillTransactionUpdate(**transaction_update)
        )
        await TestBillService().confirm_bill(tbt.test_bill_uid)
        await invoice_utils.impress_invoice(test_bill)
        return TestBillTransactionType(**tbt.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.BILLING)]
        )]
    )
    async def confirm_test_bill_transaction(self, info, uid: str, notes: str | None) -> TestBillTransactionResponse:
        felicity_user = await auth_from_info(info)
        incoming: dict = {
            "notes": notes,
            "processed": True,
            "is_success": True,
            "updated_by_uid": felicity_user.uid,
        }
        obj_in = schemas.TestBillTransactionUpdate(**incoming)
        tbt = await TestBillTransactionService().update(uid, obj_in)
        await TestBillService().confirm_bill(tbt.test_bill_uid)
        return TestBillTransactionType(**tbt.marshal_simple())

    @strawberry.mutation(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.UPDATE, FObject.BILLING)]
        )]
    )
    async def apply_voucher(
            self, info, payload: ApplyVoucherInput
    ) -> TestBillTransactionResponse:
        await auth_from_info(info)
        bill = await utils.apply_voucher(
            payload.voucher_code, payload.test_bill_uid, payload.customer_uid
        )
        return TestBillType(**bill.marshal_simple(exclude=["orders"]))
