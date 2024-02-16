import logging
from dataclasses import field
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types import analysis as a_types
from felicity.api.gql.auth import auth_from_info, verify_user_auth
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.analysis import schemas
from felicity.apps.analysis.models import analysis as analysis_models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ResultOptionInputType:
    analysis_uid: str
    sample_types: Optional[List[str]] = field(default_factory=list)
    option_key: int
    value: str


ResultOptionResponse = strawberry.union(
    "ResultOptionResponse",
    (a_types.ResultOptionType, OperationError),  # noqa
    description="",
)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_result_option(
    info, payload: ResultOptionInputType
) -> ResultOptionResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can add result options",
    )

    if not payload.analysis_uid:
        return OperationError(error="Analysis to attach Result Option Required")

    if not isinstance(payload.option_key, int) or not payload.value:
        return OperationError(error="Result option key and value Required")

    analysis = await analysis_models.Analysis.get(uid=payload.analysis_uid)
    if not analysis:
        return OperationError(
            error=f"Analysis with uid {payload.analysis_uid} does not exist"
        )

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        if k not in ["sample_types"]:
            incoming[k] = v

    obj_in = schemas.ResultOptionCreate(**incoming)
    result_option: analysis_models.ResultOption = (
        await analysis_models.ResultOption.create(obj_in)
    )

    if payload.sample_types:
        for _st_uid in payload.sample_types:
            st = await analysis_models.SampleType.get(uid=_st_uid)
            result_option.sample_types.append(st)
            # await analysis_models.ResultOption.table_insert(
            #     table=analysis_models.result_option_sample_type,
            #     mappings={"sample_type_uid": _st_uid, "result_option_uid": result_option.uid},
            # )
            await result_option.save_async()

    return a_types.ResultOptionType(**result_option.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_result_option(
    info, uid: str, payload: ResultOptionInputType
) -> ResultOptionResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can update result options",
    )

    result_option = await analysis_models.ResultOption.get(uid=uid)
    if not result_option:
        return OperationError(error=f"ResultOption with uid {uid} does not exist")

    ro_data = result_option.to_dict()
    for field in ro_data:
        if field in payload.__dict__:
            try:
                setattr(result_option, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    result_option_in = schemas.ResultOptionUpdate(**result_option.to_dict())
    result_option = await result_option.update(result_option_in)

    if payload.sample_types:
        result_option.sample_types.clear()
        result_option = await result_option.save_async()
        for _uid in payload.sample_types:
            st = await analysis_models.SampleType.get(uid=_uid)
            result_option.sample_types.append(st)
            # await analysis_models.ResultOption.table_insert(
            #     table=analysis_models.result_option_sample_type,
            #     mappings={"sample_type_uid": st, "result_option_uid": result_option.uid},
            # )
            await result_option.save_async()

    return a_types.ResultOptionType(**result_option.marshal_simple())
