import logging

import strawberry  # noqa

from felicity.api.gql.analysis.types import analysis as a_types
from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.analysis import schemas
from felicity.apps.analysis.services.analysis import (
    AnalysisCorrectionFactorService, AnalysisDetectionLimitService,
    AnalysisInterimService, AnalysisSpecificationService,
    AnalysisUncertaintyService)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class AnalysisInterimInput:
    key: int
    value: str
    analysis_uid: str
    instrument_uid: str


@strawberry.input
class AnalysisCorrectionFactorInput:
    factor: float
    analysis_uid: str
    instrument_uid: str
    method_uid: str


@strawberry.input
class AnalysisDetectionLimitInput:
    lower_limit: float
    upper_limit: float
    analysis_uid: str
    instrument_uid: str
    method_uid: str


@strawberry.input
class AnalysisUncertaintyInput:
    min: float
    max: float
    value: float
    analysis_uid: str
    instrument_uid: str
    method_uid: str


@strawberry.input
class AnalysisSpecificationInput:
    analysis_uid: str
    min: float | None = None
    max: float | None = None
    min_warn: float | None = None
    max_warn: float | None = None
    min_report: str | None = None
    max_report: str | None = None
    warn_values: str | None = None
    warn_report: str | None = None
    gender: str | None = None
    age_min: int | None = None
    age_max: int | None = None
    method_uid: str | None = None
    unit_uid: str | None = None


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


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_analysis_interim(
    info, payload: AnalysisInterimInput
) -> AnalysisInterimResponse:

    felicity_user = await auth_from_info(info)

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.AnalysisInterimCreate(**incoming)
    interim = await AnalysisInterimService().create(obj_in)
    return a_types.AnalysisInterimType(**interim.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_analysis_interim(
    info, uid: str, payload: AnalysisInterimInput
) -> AnalysisInterimResponse:

    felicity_user = await auth_from_info(info)

    interim = await AnalysisInterimService().get(uid=uid)
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
    interim = await AnalysisInterimService().update(interim.uid, analysis_in)
    return a_types.AnalysisInterimType(**interim.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_analysis_correction_factor(
    info, payload: AnalysisCorrectionFactorInput
) -> AnalysisCorrectionFactorResponse:

    felicity_user = await auth_from_info(info)

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.AnalysisCorrectionFactorCreate(**incoming)
    correction_factor = await AnalysisCorrectionFactorService().create(obj_in)
    return a_types.AnalysisCorrectionFactorType(**correction_factor.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_analysis_correction_factor(
    info, uid: str, payload: AnalysisCorrectionFactorInput
) -> AnalysisCorrectionFactorResponse:

    felicity_user = await auth_from_info(info)

    correction_factor = await AnalysisCorrectionFactorService().get(uid=uid)
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
    correction_factor = await AnalysisCorrectionFactorService().update(
        correction_factor.uid, analysis_in
    )
    return a_types.AnalysisCorrectionFactorType(**correction_factor.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_analysis_detection_limit(
    info, payload: AnalysisDetectionLimitInput
) -> AnalysisDetectionLimitResponse:

    felicity_user = await auth_from_info(info)

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.AnalysisDetectionLimitCreate(**incoming)
    detection_limit = await AnalysisDetectionLimitService().create(obj_in)
    return a_types.AnalysisDetectionLimitType(**detection_limit.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_analysis_detection_limit(
    info, uid: str, payload: AnalysisDetectionLimitInput
) -> AnalysisDetectionLimitResponse:

    felicity_user = await auth_from_info(info)

    detection_limit = await AnalysisDetectionLimitService().get(uid=uid)
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
    detection_limit = await AnalysisDetectionLimitService().update(
        detection_limit.uid, analysis_in
    )
    return a_types.AnalysisDetectionLimitType(**detection_limit.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_analysis_uncertainty(
    info, payload: AnalysisUncertaintyInput
) -> AnalysisUncertaintyResponse:

    felicity_user = await auth_from_info(info)

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.AnalysisUncertaintyCreate(**incoming)
    uncertainty = await AnalysisUncertaintyService().create(obj_in)
    return a_types.AnalysisUncertaintyType(**uncertainty.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_analysis_uncertainty(
    info, uid: str, payload: AnalysisUncertaintyInput
) -> AnalysisUncertaintyResponse:

    felicity_user = await auth_from_info(info)

    uncertainty = await AnalysisUncertaintyService().get(uid=uid)
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
    uncertainty = await AnalysisUncertaintyService().update(
        uncertainty.uid, analysis_in
    )
    return a_types.AnalysisUncertaintyType(**uncertainty.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_analysis_specification(
    info, payload: AnalysisSpecificationInput
) -> AnalysisSpecificationResponse:

    felicity_user = await auth_from_info(info)

    if not payload.min and not payload.warn_values:
        return OperationError(
            error="Specification can not be empty",
            suggestion="Provide values for either numeric or texual specification based on expected result type",
        )

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.AnalysisSpecificationCreate(**incoming)
    specification = await AnalysisSpecificationService().create(obj_in)
    return a_types.AnalysisSpecificationType(**specification.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_analysis_specification(
    info, uid: str, payload: AnalysisSpecificationInput
) -> AnalysisSpecificationResponse:

    felicity_user = await auth_from_info(info)

    specification = await AnalysisSpecificationService().get(uid=uid)
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
    specification = await AnalysisSpecificationService().update(
        specification.uid, analysis_in
    )
    return a_types.AnalysisSpecificationType(**specification.marshal_simple())
