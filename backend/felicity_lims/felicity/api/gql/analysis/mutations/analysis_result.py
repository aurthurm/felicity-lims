import logging
from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from felicity.apps.analysis import schemas
from felicity.apps.analysis.conf import states
from felicity.apps.analysis.models import results as result_models
from felicity.api.gql import OperationError, auth_from_info, verify_user_auth
from felicity.api.gql.analysis.types import results as r_types
from felicity.api.gql.permissions import CanVerifyAnalysisResult
from felicity.apps.analysis.utils import verify_from_result_uids, retest_from_result_uids, results_submitter

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

    if len(analysis_results) == 0:
        return OperationError(error=f"No Results to update are provided!")

    an_results = [result.__dict__ for result in analysis_results]
    return_results = await results_submitter(an_results, felicity_user)
    
    return ResultListingType(results=return_results)


@strawberry.mutation(permission_classes=[CanVerifyAnalysisResult])
async def verify_analysis_results(info, analyses: List[int]) -> AnalysisResultResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can verify analysis results",
    )

    if len(analyses) == 0:
        return OperationError(error=f"No analyses to verify are provided!")

    return_results = await verify_from_result_uids(analyses, felicity_user)

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

    if len(analyses) == 0:
        return OperationError(error=f"No analyses to Retest are provided!")

    retests, originals = await retest_from_result_uids(analyses, felicity_user)

    return ResultListingType(retests + originals)


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
