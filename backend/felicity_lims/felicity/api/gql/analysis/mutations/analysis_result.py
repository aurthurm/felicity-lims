import logging
from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from felicity.apps.analysis import schemas
from felicity.apps.analysis.conf import states
from felicity.apps.analysis.models import results as result_models
from felicity.gql import OperationError, auth_from_info, verify_user_auth
from felicity.gql.analysis.types import results as r_types

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ARResultInputType:
    uid: int
    result: str
    reportable: Optional[bool] = True


@strawberry.type
class ResultListingType:
    results: List[r_types.AnalysisResultType]


AnalysisResultResponse = strawberry.union(
    "AnalysisResultResponse",
    (ResultListingType, OperationError),  # noqa
    description="Union of possible outcomes when actioning samples",
)


@strawberry.mutation
async def submit_analysis_results(
    info, analysis_results: List[ARResultInputType]
) -> AnalysisResultResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can submit analysis results",
    )

    return_results = []

    if len(analysis_results) == 0:
        return OperationError(error=f"No Results to update are provided!")

    for _ar in analysis_results:
        uid = _ar.uid
        a_result: result_models.AnalysisResult = await result_models.AnalysisResult.get(
            uid=uid
        )
        if not a_result:
            return OperationError(error=f"AnalysisResult with uid {uid} not found")

        # only submit results in pending state
        if a_result.status not in [states.result.PENDING]:
            return_results.append(a_result)
            continue

        analysis_result = a_result.to_dict(nested=False)
        for field in analysis_result:
            if field in _ar.__dict__.keys():
                try:
                    setattr(a_result, field, getattr(_ar, field, None))
                except AttributeError as e:
                    logger.warning(e)

        # No Empty Results
        result = getattr(a_result, "result", None)
        if not result or result.strip() == "" or len(result.strip()) == 0:
            setattr(a_result, "result", None)
        else:
            setattr(a_result, "status", states.result.RESULTED)

            # set submitter ad date_submitted
            setattr(a_result, "submitted_by_uid", felicity_user.uid)
            setattr(a_result, "date_submitted", datetime.now())

            # set updated_by
            try:
                setattr(a_result, "updated_by_uid", felicity_user.uid)
            except AttributeError:
                pass

        a_result_in = schemas.AnalysisResultUpdate(**a_result.to_dict())
        a_result = await a_result.update(a_result_in)

        # try to submit sample
        if a_result.sample:
            await a_result.sample.submit(submitted_by=felicity_user)

        # try to submit associated worksheet
        if a_result.worksheet_uid:
            await a_result.worksheet.submit(submitter=felicity_user)

        return_results.append(a_result)
    return ResultListingType(return_results)


@strawberry.mutation
async def verify_analysis_results(info, analyses: List[int]) -> AnalysisResultResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can verify analysis results",
    )

    return_results = []

    if len(analyses) == 0:
        return OperationError(error=f"No analyses to verify are provided!")

    for _ar_uid in analyses:
        a_result: result_models.AnalysisResult = await result_models.AnalysisResult.get(
            uid=_ar_uid
        )
        if not a_result:
            return OperationError(error=f"AnalysisResult with uid {_ar_uid} not found")

        # No Empty Results
        status = getattr(a_result, "status", None)
        if status == states.result.RESULTED:
            a_result = await a_result.verify(verifier=felicity_user)
            return_results.append(a_result)
        else:
            continue

        # TODO: optimisation -> reduce db-calls
        #  Avoid calling verify sample & verify worksheet len(analyses) times
        #  However create "set" holder variables and hold sample, worksheet ids
        #  after the for loop has completed, then try verify linkages

        # try to verify associated sample
        if a_result.sample:
            await a_result.sample.verify(verified_by=felicity_user)

        # try to submit associated worksheet
        if a_result.worksheet_uid:
            await a_result.worksheet.verify(verified_by=felicity_user)

    return ResultListingType(return_results)


@strawberry.mutation
async def retract_analysis_results(info, analyses: List[int]) -> AnalysisResultResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can retract analysis results",
    )

    return_results = []

    if len(analyses) == 0:
        return OperationError(error=f"No analyses to retract are provided!")

    for _ar_uid in analyses:
        a_result: result_models.AnalysisResult = await result_models.AnalysisResult.get(
            uid=_ar_uid
        )
        if not a_result:
            return OperationError(error=f"AnalysisResult with uid {_ar_uid} not found")

        retest, a_result = await a_result.retest_result(
            retested_by=felicity_user, next_action="retract"
        )

        # if in worksheet then keep add retest to ws
        if a_result.worksheet_uid:
            retest.worksheet_uid = a_result.worksheet_uid
            retest.worksheet_position = a_result.worksheet_position
            retest.assigned = True
            retest = await retest.save()

        # add retest
        if retest:
            return_results.append(retest)

        # add original
        return_results.append(a_result)
    return ResultListingType(return_results)


@strawberry.mutation
async def retest_analysis_results(info, analyses: List[int]) -> AnalysisResultResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can retest analysis results",
    )

    return_results = []

    if len(analyses) == 0:
        return OperationError(error=f"No analyses to Retest are provided!")

    for _ar_uid in analyses:
        a_result: result_models.AnalysisResult = await result_models.AnalysisResult.get(
            uid=_ar_uid
        )
        if not a_result:
            return OperationError(error=f"AnalysisResult with uid {_ar_uid} not found")

        retest, a_result = await a_result.retest_result(
            retested_by=felicity_user, next_action="verify"
        )
        if retest:
            return_results.append(retest)
        return_results.append(a_result)

    return ResultListingType(return_results)


@strawberry.mutation
async def cancel_analysis_results(info, analyses: List[int]) -> AnalysisResultResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can cancel analysis results",
    )

    return_results = []

    if len(analyses) == 0:
        return OperationError(error=f"No analyses to Retest are provided!")

    for _ar_uid in analyses:
        a_result: result_models.AnalysisResult = await result_models.AnalysisResult.get(
            uid=_ar_uid
        )
        if not a_result:
            return OperationError(error=f"AnalysisResult with uid {_ar_uid} not found")

        a_result = await a_result.cancel(cancelled_by=felicity_user)
        if a_result:
            return_results.append(a_result)

    return ResultListingType(return_results)


@strawberry.mutation
async def re_instate_analysis_results(
    info, analyses: List[int]
) -> AnalysisResultResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can re instate cancelled analysis " "results",
    )

    return_results = []

    if len(analyses) == 0:
        return OperationError(error=f"No analyses to Reinstate are provided!")

    for _ar_uid in analyses:
        a_result: result_models.AnalysisResult = await result_models.AnalysisResult.get(
            uid=_ar_uid
        )
        if not a_result:
            return OperationError(error=f"AnalysisResult with uid {_ar_uid} not found")

        a_result = await a_result.re_instate(re_instated_by=felicity_user)
        if a_result:
            return_results.append(a_result)

    return ResultListingType(return_results)
