from typing import List

from sqlalchemy import or_

from felicity.apps.analysis.models.analysis import Sample, SampleType
from felicity.apps.analysis import schemas
from felicity.apps.analysis.conf import states
from felicity.apps.analysis.models import results
from felicity.utils import has_value_or_is_truthy


async def get_qc_sample_type():
    st = await SampleType.get(name="QC Sample")
    if not st:
        st_in = schemas.SampleTypeCreate(name="QC Sample", description="QC Sample", abbr="QCS")
        st = await SampleType.create(st_in)
    return st


async def retest_analysis_result(to_retest: results.AnalysisResult) -> results.AnalysisResult:
    """Creates a retest of an AnalysisResult"""
    a_result_in = {
        'sample_uid': to_retest.sample.uid,
        'analysis_uid': to_retest.analysis_uid,
        'status': states.result.PENDING,
        'instrument_uid': to_retest.instrument_uid,
        'method_uid': to_retest.method_uid,
        'retest': True
    }
    a_result_schema = schemas.AnalysisResultCreate(**a_result_in)
    retest = await results.AnalysisResult.create(a_result_schema)

    retest.parent_id = to_retest.uid
    await retest.save()

    # to_retest.reportable = False
    # to_retest.save()

    return retest


async def sample_search(model, status: str, text: str, client_uid: int) -> List[schemas.SampleType]:
    """No pagination"""
    filters = []
    _or_text_ = {}
    if has_value_or_is_truthy(text):
        arg_list = [
            'sample_id__ilike',
            'analysisrequest___patient___first_name__ilike',
            'analysisrequest___patient___last_name__ilike',
            'analysisrequest___patient___client_patient_id__ilike',
            'analysisrequest___client_request_id__ilike',
        ]
        for _arg in arg_list:
            _or_text_[_arg] = f"%{text}%"

        text_filters = {or_: _or_text_}
        filters.append(text_filters)

    if client_uid:
        filters.append({'analysisrequest___client_uid__exact': client_uid})

    if status:
        filters.append({'status__exact': status})

    filters.append({'internal_use__ne': True})

    stmt = model.smart_query(filters=filters, sort_attrs=["uid"])
    return (await model.session.execute(stmt)).scalars().all()
