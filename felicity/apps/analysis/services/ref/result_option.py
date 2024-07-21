import logging

import strawberry  # noqa
from api.gql.analysis.types import analysis as a_types
from api.gql.auth import auth_from_info, verify_user_auth
from api.gql.types import OperationError
from domain.analysis.models import analysis as analysis_models

from domain.analysis import schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ResultOptionInputType:
    analysis_uid: str
    option_key: int
    value: str


ResultOptionResponse = strawberry.union(
    "ResultOptionResponse",
    (a_types.ResultOptionType, OperationError),  # noqa
    description="",
)


async def create_result_option(
    info, payload: ResultOptionInputType
) -> ResultOptionResponse:
    is_authenticated, user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        user,
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
        "created_by_uid": user.uid,
        "updated_by_uid": user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.ResultOptionCreate(**incoming)
    result_option: analysis_models.ResultOption = (
        await analysis_models.ResultOption.create(obj_in)
    )
    return a_types.ResultOptionType(**result_option.marshal_simple())


async def update_result_option(
    info, uid: str, payload: ResultOptionInputType
) -> ResultOptionResponse:
    is_authenticated, user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        user,
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
    return a_types.ResultOptionType(**result_option.marshal_simple())
