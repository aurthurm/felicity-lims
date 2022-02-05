from typing import List
import logging

from felicity.apps.analysis import schemas
from felicity.apps.analysis.models.analysis import SampleType
from felicity.apps.analysis.models.results import AnalysisResult
from felicity.apps.analysis.conf import states
from felicity.apps.reflex.utils import ReflexUtil
from felicity.utils import has_value_or_is_truthy
from sqlalchemy import or_

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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
        a_result: AnalysisResult = await AnalysisResult.get(
            uid=_ar_uid
        )
        if not a_result:
            raise Exception(f"AnalysisResult with uid {_ar_uid} not found")

        _retest, a_result = await a_result.retest_result(
            retested_by=user, next_action="verify"
        )
        if _retest:
            retests.append(_retest)
        originals.append(a_result)
    return retests, originals


async def verify__from_result_uids(uids: List[int], user):
    to_return = []

    for _ar_uid in uids:
        a_result: AnalysisResult = await AnalysisResult.get(
            uid=_ar_uid
        )
        if not a_result:
            raise Exception(f"AnalysisResult with uid {_ar_uid} not found")

        # No Empty Results
        status = getattr(a_result, "status", None)
        if status == states.result.RESULTED:
            a_result = await a_result.verify(verifier=user)
            logger.info(f"ReflexUtil .... running")
            await ReflexUtil(analysis_result=a_result, user=user).do_reflex()
            logger.info(f"ReflexUtil .... done")
            to_return.append(a_result)
        else:
            continue

        # try to verify associated sample
        if a_result.sample:
            await a_result.sample.verify(verified_by=user)

        # try to submit associated worksheet
        if a_result.worksheet_uid:
            await a_result.worksheet.verify(verified_by=user)

    return to_return
