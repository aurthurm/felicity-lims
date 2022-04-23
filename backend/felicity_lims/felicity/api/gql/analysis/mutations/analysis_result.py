import logging
import json
from typing import List, Optional

import strawberry  # noqa
from felicity.apps.analysis import schemas
from felicity.apps.analysis.conf import states
from felicity.apps.worksheet import (
    models as ws_models,
    conf as ws_conf
)
from felicity.apps.analysis.models import results as result_models
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.api.gql import OperationError, OperationSuccess, auth_from_info, verify_user_auth
from felicity.api.gql.analysis.types import results as r_types
from felicity.api.gql.permissions import CanVerifyAnalysisResult
from felicity.apps.analysis.utils import verify_from_result_uids, retest_from_result_uids
from felicity.apps.job import models as job_models, schemas as job_schemas
from felicity.apps.job.conf import actions, categories, priorities, states
from felicity.apps.job.sched import felicity_resume_workforce

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

AnalysisResultOperationResponse = strawberry.union(
    "AnalysisResultSubmitResponse",
    (OperationSuccess, OperationError),  # noqa
    description="Union of possible outcomes when submitting/verifying results",
)


@strawberry.mutation
async def submit_analysis_results(
    info, 
    analysis_results: List[ARResultInputType],
    source_object: str,
    source_object_uid: int,
) -> AnalysisResultOperationResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can submit analysis results",
    )

    if len(analysis_results) == 0:
        return OperationError(error=f"No Results to update are provided!")

    an_results = [result.__dict__ for result in analysis_results]
    
    # submit an results as jobs
    job_schema = job_schemas.JobCreate(
            action=actions.RESULT_SUBMIT,
            category=categories.RESULT,
            priority=priorities.MEDIUM,
            job_id=0,
            status=states.PENDING,
            creator_uid=felicity_user.uid,
            data=an_results
        )

    await job_models.Job.create(job_schema)
    
    if source_object == "worksheet" and source_object_uid:
        ws = await ws_models.WorkSheet.get(uid=source_object_uid)
        await ws.change_state(ws_conf.worksheet_states.SUBMITTING, felicity_user.uid)
    # elif source_object == "sample" and source_object_uid:
    #     sa = await analysis_models.Sample.get(uid=source_object_uid)
    #     await sa.change_status("processing", felicity_user.uid)
        
    felicity_resume_workforce()

    return OperationSuccess(message="Your results are being submitted in the background.")


@strawberry.mutation(permission_classes=[CanVerifyAnalysisResult])
async def verify_analysis_results(
    info, analyses: List[int],
    source_object: str,
    source_object_uid: int,
    ) -> AnalysisResultOperationResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can verify analysis results",
    )

    if len(analyses) == 0:
        return OperationError(error=f"No analyses to verify are provided!")

    job_schema = job_schemas.JobCreate(
            action=actions.RESULT_VERIFY,
            category=categories.RESULT,
            priority=priorities.MEDIUM,
            job_id=0,
            status=states.PENDING,
            creator_uid=felicity_user.uid,
            data=analyses
        )

    await job_models.Job.create(job_schema)
    
    if source_object == "worksheet" and source_object_uid:
        ws = await ws_models.WorkSheet.get(uid=source_object_uid)
        await ws.change_state(ws_conf.worksheet_states.APPROVING, felicity_user.uid)
    # elif source_object == "sample" and source_object_uid:
    #     sa = await analysis_models.Sample.get(uid=source_object_uid)
    #     await sa.change_status("APPROVING", felicity_user.uid)
        
    felicity_resume_workforce()

    return OperationSuccess(message="Your results are being verified in the background.")


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

        # must not belong to a worksheet
        if a_result.assigned:
            return_results.append(a_result)
            continue

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
