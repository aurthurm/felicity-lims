import logging
from datetime import datetime

from felicity.apps.analysis.entities import analysis as a_entities
from felicity.apps.billing.enum import (DiscountType, DiscountValueType,
                                          TransactionKind)
from felicity.apps.billing.exceptions import (
    CustomerAlreadyUsedVoucherException, InactiveTestBillException,
    InactiveVoucherCodeException, InvalidVoucherCodeException,
    VoucherCodeLimitExceededException, VoucherLimitExceededException)
from felicity.apps.billing.entities import (AnalysisDiscount, AnalysisPrice,
                                          ProfileDiscount, ProfilePrice,
                                          TestBill, TestBillTransaction,
                                          Voucher, VoucherCode,
                                          VoucherCustomer, test_bill_item)
from felicity.apps.billing.schemas import (TestBillCreate,
                                           TestBillTransactionCreate,
                                           TestBillTransactionUpdate,
                                           TestBillUpdate)
from felicity.apps.impress.invoicing.utils import impress_invoice
from felicity.apps.setup.entities.setup import Laboratory, LaboratorySetting

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def bill_order(analysis_request: a_entities.AnalysisRequest, auto_bill=False):
    laboratory = await Laboratory.get_by_setup_name("felicity")
    lab_settings = await LaboratorySetting.get(laboratory_uid=laboratory.uid)

    if not lab_settings.allow_billing:
        logger.info("Billing is not allowed")
        return

    # auto_billing ?? or user initiated
    if auto_bill and not lab_settings.allow_auto_billing:
        logger.info("Auto billing is not allowed")
        return

    logger.info("Billing order ...")

    # calculate bill and marshall prices for future reference
    total_charged = 0.00
    profile_uids = []
    analysis_uids = []

    for sample in analysis_request.samples:
        for _prof in sample.profiles:
            profile_uids.append(_prof.uid)
        for _an in sample.analyses:
            analysis_uids.append(_an.uid)

    profiles_prices = await ProfilePrice.get_all(profile_uid__in=profile_uids)
    analysis_prices = await AnalysisPrice.get_all(analysis_uid__in=analysis_uids)

    pricing_lines = {
        "profiles": {},
        "analyses": {},
    }
    today = datetime.now()
    in_transactions = []
    for p_price in profiles_prices:
        total_charged += p_price.amount

        p_discount = await ProfileDiscount.get(
            profile_uid=p_price.profile_uid,
            discount_type=DiscountType.SALE,
            start_date__le=today,
            end_date__ge=today,
            is_active=True,
        )

        discount = {}
        if p_discount:
            discount["discount_type"] = (p_discount.discount_type,)
            discount["value_type"] = (p_discount.value_type,)
            discount["percentage"] = (p_discount.value_percent,)
            discount["amount"] = p_discount.value_amount
            if p_discount.value_type == DiscountValueType.PERCENTATE:
                discount["amount"] = round(float(p_discount.value_percent) * float(
                    p_price.amount
                ), 2)

            in_transactions.append(
                {
                    "kind": TransactionKind.AUTO_DISCOUNT,
                    "amount": discount["amount"],
                    "processed": True,
                    "notes": "automated discount",
                }
            )

        pricing_lines["profiles"][p_price.profile_uid] = {
            "price": p_price.amount,
            "discount": discount,
        }

    for a_price in analysis_prices:
        total_charged += a_price.amount

        a_discount = await AnalysisDiscount.get(
            analysis_uid=a_price.analysis_uid,
            discount_type=DiscountType.SALE,
            start_date__le=today,
            end_date__ge=today,
            is_active=True,
        )

        discount = {}
        if a_discount:
            discount["discount_type"] = (a_discount.discount_type,)
            discount["value_type"] = (a_discount.value_type,)
            discount["percentage"] = (a_discount.value_percent,)
            discount["amount"] = a_discount.value_amount
            if a_discount.value_type == DiscountValueType.PERCENTATE:
                discount["amount"] = round(float(a_discount.value_percent) * float(
                    a_price.amount
                ), 2)

            in_transactions.append(
                {
                    "kind": TransactionKind.AUTO_DISCOUNT,
                    "amount": discount["amount"],
                    "processed": False,
                    "is_success": False,
                    "notes": "automated discount",
                }
            )

        pricing_lines["analyses"][a_price.analysis_uid] = {
            "price": a_price.amount,
            "discount": discount,
        }

    if total_charged <= 0:
        return

    # create a new bill
    bill_in = TestBillCreate(
        bill_id=None,
        patient_uid=analysis_request.patient_uid,
        client_uid=analysis_request.client_uid,
        is_active=True,
        to_confirm=True,
        partial=False,
        total_charged=total_charged,
        total_paid=0.0,
        json_content=pricing_lines,
    )
    bill = await TestBill.create(bill_in)

    # attach related orders to bill
    await TestBill.table_insert(
        test_bill_item,
        {"test_bill_uid": bill.uid, "analysis_request_uid": analysis_request.uid},
    )

    # apply discounts
    logger.info("applying discounts...")
    for t_in in in_transactions:
        # add a transaction
        transaction = await TestBillTransaction.create(
            TestBillTransactionCreate(
                **t_in,
                test_bill_uid=bill.uid,
            )
        )
        # apply sale discounts from the transaction
        bill_update_in = TestBillUpdate(total_paid=bill.total_paid + transaction.amount)
        await bill.update(bill_update_in)
        # update transaction
        tra_update_in = TestBillTransactionUpdate(
            processed=True,
            is_success=True,
        )
        await transaction.update(tra_update_in)

    logger.info(f"invoicing...")
    await impress_invoice(bill)


async def apply_voucher(
        voucher_code: str, test_bill_uid: str, customer_uid: str
) -> TestBill:
    today = datetime.now()
    bill = await TestBill.get(uid=test_bill_uid)
    if not bill.is_active:
        raise InactiveTestBillException()

    code: VoucherCode = await VoucherCode.get(code=voucher_code)

    if not code:
        raise InvalidVoucherCodeException()

    if not code.is_active:
        raise InactiveVoucherCodeException()

    if code.used > code.usage_limit:
        raise VoucherCodeLimitExceededException()

    voucher: Voucher = await Voucher.get(uid=code.voucher_uid)
    if voucher.used > voucher.usage_limit:
        raise VoucherLimitExceededException()

    if not (voucher.start_date < today < voucher.end_date):
        raise VoucherLimitExceededException()

    voucher_customer = await VoucherCustomer.get(
        patient_uid=customer_uid, voucher_code_uid=code.uid
    )
    if voucher_customer and voucher.once_per_customer:
        raise CustomerAlreadyUsedVoucherException()

    # check voucher eligibility to bill orders
    profiles_uids = []
    analyses_uids = []
    for k, v in bill.json_content.items():
        if k == "profiles":
            profiles_uids = list(v.keys())
        if k == "analyses":
            analyses_uids = list(v.keys())

    profiles_discounts = await ProfileDiscount.get_all(
        profile_uid__in=profiles_uids,
        voucher_uid=voucher.uid,
        discount_type=DiscountType.VOUCHER,
        # start_date__le=today,
        # end_date__ge=today,
        # is_active=True,
    )
    analyses_discounts = await AnalysisDiscount.get_all(
        analysis_uid__in=analyses_uids,
        voucher_uid=voucher.uid,
        discount_type=DiscountType.VOUCHER,
        # start_date__le=today,
        # end_date__ge=today,
        # is_active=True,
    )
    if not analyses_discounts and not profiles_discounts:
        raise InvalidVoucherCodeException()

    prof_in_trans = []
    anal_in_trans = []
    for p_disc in profiles_discounts:
        amount = p_disc.value_amount
        if p_disc.value_type == DiscountValueType.PERCENTATE:
            p_price = await ProfilePrice.get(profile_uid=p_disc.profile_uid)
            amount = float(p_disc.value_percent) * float(p_price.amount)
            amount = round(amount, 2)

        prof_in_trans.append(
            TestBillTransactionCreate(
                test_bill_uid=bill.uid,
                kind=TransactionKind.AUTO_DISCOUNT,
                amount=amount,
                processed=False,
                is_success=False,
                notes="voucher discount",
            )
        )

    for a_disc in analyses_discounts:
        amount = a_disc.value_amount
        if a_disc.value_type == DiscountValueType.PERCENTATE:
            a_price = await AnalysisPrice.get(analysis_uid=a_disc.analysis_uid)
            amount = float(a_disc.value_percent) * float(a_price.amount)
            amount = round(amount, 2)

        anal_in_trans.append(
            TestBillTransactionCreate(
                test_bill_uid=bill.uid,
                kind=TransactionKind.AUTO_DISCOUNT,
                amount=amount,
                processed=False,
                is_success=False,
                notes="voucher discount",
            )
        )

    if voucher.once_per_order:
        # pick one for each with:
        if prof_in_trans:
            prof_in_trans = [sorted(prof_in_trans, key=lambda x: x.amount)[0]]
        if anal_in_trans:
            anal_in_trans = [sorted(anal_in_trans, key=lambda x: x.amount)[0]]

    # combine all
    in_trans = prof_in_trans + anal_in_trans

    for tras_in in in_trans:
        transaction = await TestBillTransaction.create(tras_in)
        # apply sale discounts from the transaction
        bill_update_in = TestBillUpdate(total_paid=bill.total_paid + transaction.amount)
        bill = await bill.update(bill_update_in)
        # update transaction
        tra_update_in = TestBillTransactionUpdate(
            processed=True,
            is_success=True,
        )
        await transaction.update(tra_update_in)

    # add voucher customer
    if not voucher_customer:
        await VoucherCustomer.create(
            {"patient_uid": customer_uid, "voucher_code_uid": code.uid}
        )

    await impress_invoice(bill)
    return bill
