from felicity.apps.analysis.models.analysis import SampleType
from felicity.apps.analysis import schemas
from felicity.apps.analysis.conf import states
from felicity.apps.analysis.models import results


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
