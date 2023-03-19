import logging
from typing import Optional

import strawberry  # noqa

from felicity.api.gql import OperationError, auth_from_info, verify_user_auth
from felicity.api.gql.analysis.types import analysis as a_types
from felicity.core.uid_gen import FelicityID
from felicity.apps.analysis import schemas
from felicity.apps.analysis.models import analysis as analysis_models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class AnalysisInterimInput:
    key: int
    value: str
    analysis_uid: FelicityID
    instrument_uid: FelicityID


@strawberry.input
class AnalysisCorrectionFactorInput:
    factor: float
    analysis_uid: FelicityID
    instrument_uid: FelicityID
    method_uid: FelicityID


@strawberry.input
class AnalysisDetectionLimitInput:
    lower_limit: float
    upper_limit: float
    analysis_uid: FelicityID
    instrument_uid: FelicityID
    method_uid: FelicityID


@strawberry.input
class AnalysisUncertaintyInput:
    min: float
    max: float
    value: float
    analysis_uid: FelicityID
    instrument_uid: FelicityID
    method_uid: FelicityID


@strawberry.input
class AnalysisSpecificationInput:
    analysis_uid: FelicityID
    min: Optional[float] = None
    max: Optional[float] = None
    min_warn: Optional[float] = None
    max_warn: Optional[float] = None
    min_report: Optional[str] = None
    max_report: Optional[str] = None
    warn_values: Optional[str] = None
    warn_report: Optional[str] = None
    gender: Optional[str] = None
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    method_uid: Optional[FelicityID] = None
    unit_uid: Optional[FelicityID] = None


AnalysisInterimResponse = strawberry.union(
    "AnalysisInterimResponse",
    (a_types.AnalysisInterimType, OperationError),  # noqa
    description="",
)
AnalysisCorrectionFactorResponse = strawberry.union(
    "AnalysisCorrectionFactorResponse",
    (a_types.AnalysisCorrectionFactorType, OperationError),  # noqa
    description="",
)
AnalysisDetectionLimitResponse = strawberry.union(
    "AnalysisDetectionLimitResponse",
    (a_types.AnalysisDetectionLimitType, OperationError),  # noqa
    description="",
)
AnalysisUncertaintyResponse = strawberry.union(
    "AnalysisUncertaintyResponse",
    (a_types.AnalysisUncertaintyType, OperationError),  # noqa
    description="",
)
AnalysisSpecificationResponse = strawberry.union(
    "AnalysisSpecificationResponse",
    (a_types.AnalysisSpecificationType, OperationError),  # noqa
    description="",
)


@strawberry.mutation
async def create_analysis_interim(
    info, payload: AnalysisInterimInput
) -> AnalysisInterimResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can add analysis interims",
    )

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.AnalysisInterimCreate(**incoming)
    interim: analysis_models.AnalysisInterim = (
        await analysis_models.AnalysisInterim.create(obj_in)
    )
    return a_types.AnalysisInterimType(**interim.marshal_simple())


@strawberry.mutation
async def update_analysis_interim(
    info, uid: FelicityID, payload: AnalysisInterimInput
) -> AnalysisInterimResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can update analysis interims",
    )

    interim = await analysis_models.AnalysisInterim.get(uid=uid)
    if not interim:
        return OperationError(
            error=f"Analysis Interim with uid {uid} does not exist -- cannot update"
        )

    interim_data = interim.to_dict()
    for field in interim_data:
        if field in payload.__dict__:
            try:
                setattr(interim, field, payload.__dict__[field])
            except AttributeError as e:
                logger.warning(e)

    analysis_in = schemas.AnalysisInterimUpdate(**interim.to_dict(nested=False))
    interim = await interim.update(analysis_in)
    return a_types.AnalysisInterimType(**interim.marshal_simple())


@strawberry.mutation
async def create_analysis_correction_factor(
    info, payload: AnalysisCorrectionFactorInput
) -> AnalysisCorrectionFactorResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can add analysis correction factors",
    )

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.AnalysisCorrectionFactorCreate(**incoming)
    correction_factor: analysis_models.AnalysisCorrectionFactor = (
        await analysis_models.AnalysisCorrectionFactor.create(obj_in)
    )
    return a_types.AnalysisCorrectionFactorType(**correction_factor.marshal_simple())


@strawberry.mutation
async def update_analysis_correction_factor(
    info, uid: FelicityID, payload: AnalysisCorrectionFactorInput
) -> AnalysisCorrectionFactorResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can update analysis correction factors",
    )

    correction_factor = await analysis_models.AnalysisCorrectionFactor.get(uid=uid)
    if not correction_factor:
        return OperationError(
            error=f"Analysis Correction factor with uid {uid} does not exist -- cannot update"
        )

    correction_factor_data = correction_factor.to_dict()
    for field in correction_factor_data:
        if field in payload.__dict__:
            try:
                setattr(correction_factor, field, payload.__dict__[field])
            except AttributeError as e:
                logger.warning(e)

    analysis_in = schemas.AnalysisCorrectionFactorUpdate(
        **correction_factor.to_dict(nested=False)
    )
    correction_factor = await correction_factor.update(analysis_in)
    return a_types.AnalysisCorrectionFactorType(**correction_factor.marshal_simple())


@strawberry.mutation
async def create_analysis_detection_limit(
    info, payload: AnalysisDetectionLimitInput
) -> AnalysisDetectionLimitResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can add analysis detection limits",
    )

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.AnalysisDetectionLimitCreate(**incoming)
    detection_limit: analysis_models.AnalysisDetectionLimit = (
        await analysis_models.AnalysisDetectionLimit.create(obj_in)
    )
    return a_types.AnalysisDetectionLimitType(**detection_limit.marshal_simple())


@strawberry.mutation
async def update_analysis_detection_limit(
    info, uid: FelicityID, payload: AnalysisDetectionLimitInput
) -> AnalysisDetectionLimitResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can update analysis interims",
    )

    detection_limit = await analysis_models.AnalysisDetectionLimit.get(uid=uid)
    if not detection_limit:
        return OperationError(
            error=f"Analysis detection limit with uid {uid} does not exist -- cannot update"
        )

    detection_limit_data = detection_limit.to_dict()
    for field in detection_limit_data:
        if field in payload.__dict__:
            try:
                setattr(detection_limit, field, payload.__dict__[field])
            except AttributeError as e:
                logger.warning(e)

    analysis_in = schemas.AnalysisDetectionLimitUpdate(
        **detection_limit.to_dict(nested=False)
    )
    detection_limit = await detection_limit.update(analysis_in)
    return a_types.AnalysisDetectionLimitType(**detection_limit.marshal_simple())


@strawberry.mutation
async def create_analysis_uncertainty(
    info, payload: AnalysisUncertaintyInput
) -> AnalysisUncertaintyResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can add analysis uncertainties",
    )

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.AnalysisUncertaintyCreate(**incoming)
    uncertainty: analysis_models.AnalysisUncertainty = (
        await analysis_models.AnalysisUncertainty.create(obj_in)
    )
    return a_types.AnalysisUncertaintyType(**uncertainty.marshal_simple())


@strawberry.mutation
async def update_analysis_uncertainty(
    info, uid: FelicityID, payload: AnalysisUncertaintyInput
) -> AnalysisUncertaintyResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can update analysis interims",
    )

    uncertainty = await analysis_models.AnalysisUncertainty.get(uid=uid)
    if not uncertainty:
        return OperationError(
            error=f"Analysis uncertainty with uid {uid} does not exist -- cannot update"
        )

    uncertainty_data = uncertainty.to_dict()
    for field in uncertainty_data:
        if field in payload.__dict__:
            try:
                setattr(uncertainty, field, payload.__dict__[field])
            except AttributeError as e:
                logger.warning(e)

    analysis_in = schemas.AnalysisUncertaintyUpdate(**uncertainty.to_dict(nested=False))
    uncertainty = await uncertainty.update(analysis_in)
    return a_types.AnalysisUncertaintyType(**uncertainty.marshal_simple())


@strawberry.mutation
async def create_analysis_specification(
    info, payload: AnalysisSpecificationInput
) -> AnalysisSpecificationResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can add analysis specifications",
    )

    if not payload.min and not payload.warn_values:
        return OperationError(
            error=f"Specification can not be empty",
            suggestion="Provide values for either numeric or texual specification based on expected result type",
        )

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.AnalysisSpecificationCreate(**incoming)
    specification: analysis_models.AnalysisSpecification = (
        await analysis_models.AnalysisSpecification.create(obj_in)
    )
    return a_types.AnalysisSpecificationType(**specification.marshal_simple())


@strawberry.mutation
async def update_analysis_specification(
    info, uid: FelicityID, payload: AnalysisSpecificationInput
) -> AnalysisSpecificationResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can update analysis specifications",
    )

    specification = await analysis_models.AnalysisSpecification.get(uid=uid)
    if not specification:
        return OperationError(
            error=f"Analysis Specification with uid {uid} does not exist -- cannot update"
        )

    specification_data = specification.to_dict()
    for field in specification_data:
        if field in payload.__dict__:
            try:
                setattr(specification, field, payload.__dict__[field])
            except AttributeError as e:
                logger.warning(e)

    analysis_in = schemas.AnalysisSpecificationUpdate(
        **specification.to_dict(nested=False)
    )
    specification = await specification.update(analysis_in)
    return a_types.AnalysisSpecificationType(**specification.marshal_simple())
