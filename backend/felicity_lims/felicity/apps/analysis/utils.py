import logging
from datetime import datetime
from typing import List

from felicity.apps.analysis import schemas
from felicity.apps.analysis.conf import states
from felicity.apps.analysis.models.analysis import SampleType
from felicity.apps.analysis.models.results import (AnalysisResult,
                                                   ResultMutation)
from felicity.apps.notification.utils import FelicityStreamer
from felicity.apps.reflex.utils import ReflexUtil
from felicity.utils import has_value_or_is_truthy
from sqlalchemy import or_

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

streamer = FelicityStreamer()


async def get_qc_sample_type():
    st = await SampleType.get(name="QC Sample")
    if not st:
        st_in = schemas.SampleTypeCreate(
            name="QC Sample", description="QC Sample", abbr="QCS"
        )
        st = await SampleType.create(st_in)
    return st


async def sample_search(
    model, status: str, text: str, client_uid: int
) -> List[schemas.SampleType]:
    """No pagination"""
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

    stmt = model.smart_query(filters=filters, sort_attrs=["uid"])
    return (await model.session.execute(stmt)).scalars().all()


async def retest_from_result_uids(uids: List[int], user):
    originals = []
    retests = []

    for _ar_uid in uids:
        a_result: AnalysisResult = await AnalysisResult.get(uid=_ar_uid)
        if not a_result:
            raise Exception(f"AnalysisResult with uid {_ar_uid} not found")

        _retest, a_result = await a_result.retest_result(
            retested_by=user, next_action="verify"
        )
        if _retest:
            retests.append(_retest)
        originals.append(a_result)
    return retests, originals


async def results_submitter(analysis_results: List[dict], submitter):
    return_results = []

    for _ar in analysis_results:
        uid = _ar["uid"]
        a_result: AnalysisResult = await AnalysisResult.get(uid=uid)
        if not a_result:
            return Exception(f"AnalysisResult with uid {uid} not found")

        # only submit results in pending/submitting state
        if a_result.status not in [states.result.PENDING, states.result.SUBMITTING]:
            return_results.append(a_result)
            continue

        analysis_result = a_result.to_dict(nested=False)
        for field in analysis_result:
            if field in _ar.keys():
                try:
                    setattr(a_result, field, _ar.get(field, None))
                except AttributeError as e:
                    logger.warning(e)

        # No Empty Results
        result = getattr(a_result, "result", None)
        if not result or result.strip() == "" or len(result.strip()) == 0:
            setattr(a_result, "result", None)
        else:
            setattr(a_result, "status", states.result.RESULTED)

            # set submitter ad date_submitted
            setattr(a_result, "submitted_by_uid", submitter.uid)
            setattr(a_result, "date_submitted", datetime.now())

            # set updated_by
            try:
                setattr(a_result, "updated_by_uid", submitter.uid)
            except AttributeError:
                pass

        a_result_in = schemas.AnalysisResultUpdate(**a_result.to_dict())
        a_result = await a_result.update(a_result_in)

        # mutate result
        await result_mutator(a_result)

        if a_result.status == states.result.RESULTED:
            await streamer.stream(a_result, submitter, "submitted", "result")

        # Do Reflex Testing
        logger.info(f"ReflexUtil .... running")
        await ReflexUtil(analysis_result=a_result, user=submitter).do_reflex()
        logger.info(f"ReflexUtil .... done")

        # try to submit sample
        if a_result.sample:
            await a_result.sample.submit(submitted_by=submitter)

        # try to submit associated worksheet
        if a_result.worksheet_uid:
            await a_result.worksheet.submit(submitter=submitter)

        return_results.append(a_result)
    return return_results


async def verify_from_result_uids(uids: List[int], user):
    to_return = []

    for _ar_uid in uids:
        a_result: AnalysisResult = await AnalysisResult.get(uid=_ar_uid)
        if not a_result:
            raise Exception(f"AnalysisResult with uid {_ar_uid} not found")

        # No Empty Results
        status = getattr(a_result, "status", None)
        if status in [states.result.RESULTED, states.result.APPROVING]:
            _, a_result = await a_result.verify(verifier=user)
            to_return.append(a_result)

            if a_result.status == states.result.APPROVED:
                await streamer.stream(a_result, user, "approved", "result")
        else:
            continue

        # try to verify associated sample
        if a_result.sample:
            await a_result.sample.verify(verified_by=user)

        # try to submit associated worksheet
        if a_result.worksheet_uid:
            await a_result.worksheet.verify(verified_by=user)

    return to_return


async def result_mutator(result: AnalysisResult):
    result_in = result.result

    correction_factors = result.analysis.correction_factors
    specifications = result.analysis.specifications
    detection_limits = result.analysis.detection_limits
    uncertainties = result.analysis.uncertainties

    if isinstance(result.result, int):
        # Correction factor
        for cf in correction_factors:
            if (
                cf.instrument_uid == result.instrument_uid
                and cf.method_uid == result.method_uid
            ):
                await ResultMutation.create(
                    obj_in={
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
                await ResultMutation.create(
                    obj_in={
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
                await ResultMutation.create(
                    obj_in={
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
                await ResultMutation.create(
                    obj_in={
                        "result_uid": result.uid,
                        "before": result.result,
                        "after": f"< {dlim.lower_limit}",
                        "mutation": f"Result fell below the Lower Detection Limit {dlim.lower_limit} and must be reported as < {dlim.lower_limit}",
                        "date": datetime.now(),
                    }
                )
                result.result = f"< {dlim.lower_limit}"

            if result.result > dlim.upper_limit:
                await ResultMutation.create(
                    obj_in={
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
                    await ResultMutation.create(
                        obj_in={
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
                await ResultMutation.create(
                    obj_in={
                        "result_uid": result.uid,
                        "before": result.result,
                        "after": spec.warn_report,
                        "mutation": f"Result with specification (result ::equals:: {result.result}) must be reported as {spec.warn_report}",
                        "date": datetime.now(),
                    }
                )
                result.result = spec.warn_report

    if result_in != result.result:
        result = await result.save()
