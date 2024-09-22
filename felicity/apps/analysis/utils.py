import logging
from datetime import datetime
from typing import List

from sqlalchemy import or_

from felicity.apps.analysis import schemas
from felicity.apps.analysis.entities.analysis import SampleType
from felicity.apps.analysis.entities.results import AnalysisResult, result_verification
from felicity.apps.analysis.enum import SampleState
from felicity.apps.analysis.services.analysis import (
    AnalysisService,
    ProfileService,
    SampleService,
    SampleTypeService,
)
from felicity.apps.analysis.services.result import (
    AnalysisResultService,
    ResultMutationService,
)
from felicity.apps.analysis.workflow.analysis_result import AnalysisResultWorkFlow
from felicity.apps.analysis.workflow.sample import SampleWorkFlow
from felicity.apps.billing.enum import DiscountType, DiscountValueType
from felicity.apps.billing.schemas import (
    AnalysisDiscountCreate,
    AnalysisPriceCreate,
    ProfileDiscountCreate,
    ProfilePriceCreate,
)
from felicity.apps.billing.services import (
    AnalysisDiscountService,
    AnalysisPriceService,
    ProfileDiscountService,
    ProfilePriceService,
)
from felicity.apps.job.enum import JobAction, JobCategory, JobPriority, JobState
from felicity.apps.job.schemas import JobCreate
from felicity.apps.job.services import JobService
from felicity.apps.reflex.services import ReflexEngineService
from felicity.apps.shipment.services import ShippedSampleService
from felicity.apps.user.entities import User
from felicity.apps.user.services import UserService
from felicity.apps.worksheet.workflow import WorkSheetWorkFlow
from felicity.utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

QC_SAMPLE = {"name": "QC Sample", "description": "QC Sample", "abbr": "QCS"}


async def get_qc_sample_type() -> SampleType:
    st_service = SampleTypeService()

    st = await st_service.get(name=QC_SAMPLE.get("name"))
    if not st:
        st_in = schemas.SampleTypeCreate(**QC_SAMPLE)
        st = await st_service.create(st_in)
    return st


async def get_last_verificator(result_uid: str) -> User | None:
    ar_service = AnalysisResultService()
    user_service = UserService()

    data = await ar_service.repository.query_table(
        table=result_verification, result_uid=result_uid
    )
    if not data:
        return None
    return await user_service.get(uid=data[-1])


async def sample_search(
    model, status: str, text: str, client_uid: str
) -> list[SampleType]:
    """No pagination"""
    sample_service = SampleService()

    filters = []
    _or_text_ = {}
    if has_value_or_is_truthy(text):
        arg_list = [
            "sample_id__ilike",
            "analysis_request___patient___first_name__ilike",
            "analysis_request___patient___last_name__ilike",
            "analysis_request___patient___client_patient_id__ilike",
            "analysis_request___client_request_id__ilike",
        ]
        for _arg in arg_list:
            _or_text_[_arg] = f"%{text}%"

        text_filters = {or_: _or_text_}
        filters.append(text_filters)

    if client_uid:
        filters.append({"analysis_request___client_uid__exact": client_uid})

    if status:
        filters.append({"status__exact": status})

    filters.append({"internal_use__ne": True})

    return await sample_service.filter(filters=filters, sort_attrs=["uid"])


async def retest_from_result_uids(
    uids: list[str], user: User
) -> tuple[list[AnalysisResult], list[AnalysisResult]]:
    analysis_result_service = AnalysisResultService()
    analysis_result_wf = AnalysisResultWorkFlow()

    originals: list[AnalysisResult] = []
    retests: list[AnalysisResult] = []

    for _ar_uid in uids:
        a_result = await analysis_result_service.get(uid=_ar_uid)
        if not a_result:
            raise Exception(f"AnalysisResult with uid {_ar_uid} not found")

        _retest, a_result = await analysis_result_wf.retest(
            a_result.uid, retested_by=user, action="verify"
        )
        if _retest:
            retests.append(_retest)
        originals.append(a_result)
    return retests, originals


async def results_submitter(
    analysis_results: List[dict], submitter: User
) -> list[AnalysisResult]:
    sample_wf = SampleWorkFlow()
    worksheet_wf = WorkSheetWorkFlow()
    analysis_result_wf = AnalysisResultWorkFlow()

    return_results: list[AnalysisResult] = []

    _skipped, _submitted = await analysis_result_wf.submit(analysis_results, submitter)
    return_results.extend(_skipped)

    for a_result in _submitted:
        # mutate result
        await result_mutator(a_result)

        # try to submit sample
        try:
            await sample_wf.submit(a_result.sample_uid, submitted_by=submitter)
        except Exception as e:
            await sample_wf.revert(a_result.sample_uid, by_uid=submitter.uid)
            logger.warning(e)

        # try to submit associated worksheet
        if a_result.worksheet_uid:
            try:
                await worksheet_wf.submit(a_result.worksheet_uid, submitter=submitter)
            except Exception as e:
                await worksheet_wf.revert(a_result.worksheet_uid, by_uid=submitter.uid)
                logger.warning(e)

        return_results.append(a_result)
    return return_results


async def verify_from_result_uids(uids: list[str], user: User) -> list[AnalysisResult]:
    job_service = JobService()
    sample_service = SampleService()
    shipped_sample_service = ShippedSampleService()
    worksheet_wf = WorkSheetWorkFlow()
    analysis_result_wf = AnalysisResultWorkFlow()
    sample_wf = SampleWorkFlow()

    approved = await analysis_result_wf.approve(uids, user)

    for a_result in approved:
        # Do Reflex Testing
        logger.info("ReflexUtil .... running")
        await ReflexEngineService(analysis_result=a_result, user=user).do_reflex()
        logger.info("ReflexUtil .... done")

        # try to verify associated sample
        sample_verified = False
        try:
            sample_verified, _ = await sample_wf.approve(
                a_result.sample_uid, approved_by=user
            )
        except Exception as e:
            await sample_wf.revert(a_result.sample_uid, by_uid=user.uid)
            logger.warning(e)

        # try to submit associated worksheet
        if a_result.worksheet_uid:
            try:
                await worksheet_wf.approve(a_result.worksheet_uid, approved_by=user)
            except Exception as e:
                await worksheet_wf.revert(a_result.worksheet_uid, by_uid=user.uid)
                logger.warning(e)

        # If referral then send results and mark sample as published
        shipped = await shipped_sample_service.get(sample_uid=a_result.sample_uid)

        # TODO: decouple this and fire events that will trigger the shipment etc

        if shipped:
            # 1. create a Job to send the result
            job_schema = JobCreate(
                action=JobAction.SHIPPED_REPORT,
                category=JobCategory.SHIPMENT,
                priority=JobPriority.MEDIUM,
                job_id=shipped.uid,
                status=JobState.PENDING,
                creator_uid=user.uid,
                data={"target": "result", "uid": a_result.uid},
            )
            await job_service.create(job_schema)

            # 2. if sample is verified, then all results are verified, send all samples
            if sample_verified:
                # 1. create a Job to send results
                job_schema = JobCreate(
                    action=JobAction.SHIPPED_REPORT,
                    category=JobCategory.SHIPMENT,
                    priority=JobPriority.MEDIUM,
                    job_id=shipped.uid,
                    status=JobState.PENDING,
                    creator_uid=user.uid,
                    data={"target": "sample", "uid": a_result.sample_uid},
                )
                await job_service.create(job_schema)

                # 2. mark sample as published
                await sample_service.change_status(
                    a_result.sample_uid, SampleState.PUBLISHED
                )

    return approved


async def result_mutator(result: AnalysisResult) -> None:
    result_mutation_service = ResultMutationService()
    analysis_result_service = AnalysisResultService()

    result_in = result.result

    correction_factors = result.analysis.correction_factors
    specifications = result.analysis.specifications
    detection_limits = result.analysis.detection_limits
    uncertainties = result.analysis.uncertainties

    if isinstance(result.result, int):
        # Correction factor
        for cf in correction_factors:
            if (
                cf.instrument_uid == result.laboratory_instrument_uid
                and cf.method_uid == result.method_uid
            ):
                await result_mutation_service.create(
                    c={
                        "result_uid": result.uid,
                        "before": result.result,
                        "after": result.result * cf.factor,
                        "mutation": f"Multiplied the result {result.result} with a correction factor of {cf.factor}",
                        "date": datetime.now(),
                    }
                )
                result.result = result.result * cf.factor

        # Specifications: Take more priority than DL
        for spec in specifications:
            # Min
            if result.result < spec.min_warn:
                await result_mutation_service.create(
                    c={
                        "result_uid": result.uid,
                        "before": result.result,
                        "after": spec.min_report,
                        "mutation": f"Result was less than the minimun warning specification {spec.min_warn} and must be reported as {spec.min_report}",
                        "date": datetime.now(),
                    }
                )
                result.result = spec.min_report

            elif result.result < spec.min:
                result.result = result.result

            # Max
            if result.result > spec.max_warn:
                await result_mutation_service.create(
                    c={
                        "result_uid": result.uid,
                        "before": result.result,
                        "after": spec.max_report,
                        "mutation": f"Result was greater than the maximun warning specification {spec.max_warn} and must be reported as {spec.max_report}",
                        "date": datetime.now(),
                    }
                )
                result.result = spec.max_report

            elif result.result > spec.max:
                result.result = result.result

        # Detection Limit Check
        for dlim in detection_limits:
            if result.result < dlim.lower_limit:
                await result_mutation_service.create(
                    c={
                        "result_uid": result.uid,
                        "before": result.result,
                        "after": f"< {dlim.lower_limit}",
                        "mutation": f"Result fell below the Lower Detection Limit {dlim.lower_limit} and must be reported as < {dlim.lower_limit}",
                        "date": datetime.now(),
                    }
                )
                result.result = f"< {dlim.lower_limit}"

            if result.result > dlim.upper_limit:
                await result_mutation_service.create(
                    c={
                        "result_uid": result.uid,
                        "before": result.result,
                        "after": f"> {dlim.upper_limit}",
                        "mutation": f"Result fell Above the Upper Detection Limit {dlim.upper_limit} and must be reported as > {dlim.upper_limit}",
                        "date": datetime.now(),
                    }
                )
                result.result = f"> {dlim.upper_limit}"

        # uncertainty
        if isinstance(result.result, int):
            for uncert in uncertainties:
                if uncert.min <= result.result <= uncert.max:
                    await result_mutation_service.create(
                        c={
                            "result_uid": result.uid,
                            "before": result.result,
                            "after": f"{result.result} +/- {uncert.value}",
                            "mutation": f"Result fell inside the range [{uncert.min},{uncert.max}]  with an un uncertainty of +/- {uncert.value}",
                            "date": datetime.now(),
                        }
                    )
                    result.result = f"{result.result} +/- {uncert.value}"

    elif isinstance(result.result, str):
        for spec in specifications:
            if result.result in spec.warn_values.split(","):
                await result_mutation_service.create(
                    c={
                        "result_uid": result.uid,
                        "before": result.result,
                        "after": spec.warn_report,
                        "mutation": f"Result with specification (result ::equals:: {result.result}) must be reported as {spec.warn_report}",
                        "date": datetime.now(),
                    }
                )
                result.result = spec.warn_report

    if result_in != result.result:
        result = await analysis_result_service.save(result)


async def billing_setup_profiles(profile_uids: list[str] = None) -> None:
    profile_service = ProfileService()
    profile_price_service = ProfilePriceService()
    profile_discount_service = ProfileDiscountService()

    if profile_uids:
        profiles = await profile_service.get_by_uids(profile_uids)
    else:
        profiles = await profile_service.all()

    for profile in profiles:
        exists = await profile_price_service.get(profile_uid=profile.uid)
        if not exists:
            await profile_price_service.create(
                ProfilePriceCreate(
                    **{"profile_uid": profile.uid, "amount": 0.0, "is_active": True}
                )
            )

        exists = await profile_discount_service.get(profile_uid=profile.uid)
        if not exists:
            await profile_discount_service.create(
                ProfileDiscountCreate(
                    **{
                        "name": profile.name + "-Discount",
                        "profile_uid": profile.uid,
                        "discount_type": DiscountType.SALE,
                        "value_type": DiscountValueType.PERCENTATE,
                        "value_percent": 0.0,
                        "value_amount": 0.0,
                        "is_active": False,
                    }
                )
            )


async def billing_setup_analysis(analysis_uids: list[str] = None) -> None:
    analysis_service = AnalysisService()
    analysis_price_service = AnalysisPriceService()
    analysis_discount_service = AnalysisDiscountService()

    if analysis_uids:
        analyses = await analysis_service.get_by_uids(analysis_uids)
    else:
        analyses = await analysis_service.all()

    for analysis in analyses:
        exists = await analysis_price_service.get(analysis_uid=analysis.uid)
        if not exists:
            await analysis_price_service.create(
                AnalysisPriceCreate(
                    **{"analysis_uid": analysis.uid, "amount": 0.0, "is_active": True}
                )
            )

        exists = await analysis_discount_service.get(analysis_uid=analysis.uid)
        if not exists:
            await analysis_discount_service.create(
                AnalysisDiscountCreate(
                    **{
                        "name": analysis.name + "-Discount",
                        "analysis_uid": analysis.uid,
                        "discount_type": DiscountType.SALE,
                        "value_type": DiscountValueType.PERCENTATE,
                        "value_percent": 0.0,
                        "value_amount": 0.0,
                        "is_active": False,
                    }
                )
            )
