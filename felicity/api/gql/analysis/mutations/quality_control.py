import inspect
import logging
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types import (
    analysis as a_types,
    results as r_types
)
from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.analysis import schemas
from felicity.apps.analysis.entities import analysis as analysis_entities
from felicity.apps.analysis.entities import qc as qc_entities
from felicity.apps.analysis.entities import results as result_entities
from felicity.apps.analysis.enum import ResultState, SampleState
from felicity.apps.analysis.utils import get_qc_sample_type
from felicity.apps.setup.entities import setup as setup_entities
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class QCSetInputType:
    qcTemplateUid: str | None
    qcLevels: List[str]
    analysisProfiles: List[str]
    analysisServices: List[str]


@strawberry.type
class CreateQCSetData:
    qc_sets: List[r_types.QCSetWithSamples]


@strawberry.input
class QCTemplateInputType:
    name: str
    description: str = ""
    departments: Optional[List[str]] = None
    levels: List[str] = None


QCSetResponse = strawberry.union(
    "QCSetResponse", (CreateQCSetData, OperationError), description=""  # noqa
)

QCLevelResponse = strawberry.union(
    "QCLevelResponse", (a_types.QCLevelType, OperationError), description=""  # noqa
)

QCTemplateResponse = strawberry.union(
    "QCTemplateResponse",
    (a_types.QCTemplateType, OperationError),  # noqa
    description="",
)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_QC_set(info, samples: List[QCSetInputType]) -> QCSetResponse:
    felicity_user = await auth_from_info(info)

    if not samples or len(samples) == 0:
        return OperationError(error="There are No QC Requests to create")

    qc_sample_type = await get_qc_sample_type()
    qc_samples: List[analysis_entities.Sample] = []
    qc_sets: List[analysis_entities.QCSet] = []

    for qc_set_in in samples:
        qc_set_schema = schemas.QCSetCreate(name="Set", note="Auto Generated")
        qc_set = await qc_entities.QCSet.create(qc_set_schema)

        qc_levels = []
        qc_levels_uids = []
        if qc_set_in.qcTemplateUid:
            qc_template = await qc_entities.QCTemplate.get(uid=qc_set_in.qcTemplateUid)
            for level in qc_template.qc_levels:
                if level.uid not in qc_levels_uids:
                    qc_levels.append(level)
                    qc_levels_uids.append(level.uid)

        if qc_set_in.qcLevels:
            for level_uid in qc_set_in.qcLevels:
                if level_uid not in qc_levels_uids:
                    level = await qc_entities.QCLevel.get(uid=level_uid)
                    qc_levels.append(level)
                    qc_levels_uids.append(level_uid)

        profiles = []
        analyses = []
        _profiles_analyses = set()

        if qc_set_in.analysisProfiles:
            for p_uid in qc_set_in.analysisProfiles:
                profile = await analysis_entities.Profile.get(uid=p_uid)
                profiles.append(profile)
                analyses_ = profile.analyses
                for _an in analyses_:
                    _profiles_analyses.add(_an)

        if qc_set_in.analysisServices:
            # make sure the selected analyses are not part of the selected profiles
            for a_uid in qc_set_in.analysisServices:
                analysis = await analysis_entities.Analysis.get(uid=a_uid)
                if analysis not in _profiles_analyses:
                    analyses.append(analysis)
                    _profiles_analyses.add(analysis)

        for level in qc_levels:
            # create qc_sample
            s_in = schemas.SampleCreate(
                sample_type_uid=qc_sample_type.uid,
                internal_use=True,
                status=SampleState.RECEIVED,
            )
            sample = await analysis_entities.Sample.create(s_in)
            sample.analyses = analyses
            sample.profiles = profiles
            sample.qc_set_uid = qc_set.uid
            sample.qc_level_uid = level.uid
            sample = await sample.save_async()

            # Attach Analysis result for each Analyses
            for _service in _profiles_analyses:
                a_result_in = {
                    "sample_uid": sample.uid,
                    "analysis_uid": _service.uid,
                    "status": ResultState.PENDING,
                }
                a_result_schema = schemas.AnalysisResultCreate(**a_result_in)
                await result_entities.AnalysisResult.create(a_result_schema)

            qc_samples.append(sample)

        qc_sets.append((await analysis_entities.QCSet.get(uid=qc_set.uid)))
    return CreateQCSetData(qc_sets=qc_sets)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_QC_level(info, level: str) -> QCLevelResponse:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    felicity_user = await auth_from_info(info)

    if not level:
        return OperationError(error="Level Name is mandatory")

    exists = await qc_entities.QCLevel.get(level=level)
    if exists:
        return OperationError(error=f"A QCLevel named {level} already exists")

    obj_in = schemas.QCLevelCreate(**passed_args)
    qc_level: qc_entities.QCLevel = await qc_entities.QCLevel.create(obj_in)
    return a_types.QCLevelType(**qc_level.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_QC_level(info, uid: str, level: str) -> QCLevelResponse:
    felicity_user = await auth_from_info(info)

    qc_level = await qc_entities.QCLevel.get(uid=uid)
    if not qc_level:
        return OperationError(error=f"QCLevel with uid {uid} does not exist")

    try:
        setattr(qc_level, "level", level)
    except AttributeError as e:
        logger.warning(e)

    qc_in = schemas.QCTemplateUpdate(**qc_level.to_dict())
    qc_level = await qc_level.update(qc_in)
    return a_types.QCLevelType(**qc_level.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_QC_template(info, payload: QCTemplateInputType) -> QCTemplateResponse:
    felicity_user = await auth_from_info(info)

    if not payload.name:
        return OperationError(error="Name is mandatory")

    exists = await qc_entities.QCTemplate.get(name=payload.name)
    if exists:
        return OperationError(error=f"A QCTemplate named {payload.name} already exists")

    incoming = {}
    for k, v in payload.__dict__.items():
        if k not in ["levels", "departments"]:
            incoming[k] = v

    obj_in = schemas.QCTemplateCreate(**incoming)
    qc_template: qc_entities.QCTemplate = await qc_entities.QCTemplate.create(obj_in)

    qc_template.qc_levels.clear()
    if payload.levels:
        for _uid in payload.levels:
            level = await qc_entities.QCLevel.get(uid=_uid)
            if level not in qc_template.qc_levels:
                qc_template.qc_levels.append(level)
    qc_template = await qc_template.save_async()

    qc_template.departments.clear()
    if payload.departments:
        for _uid in payload.departments:
            dept = await setup_entities.Department.get(uid=_uid)
            if dept not in qc_template.departments:
                qc_template.departments.append(dept)
    qc_template = await qc_template.save_async()
    return a_types.QCTemplateType(**qc_template.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_QC_template(
        info, uid: str, payload: QCTemplateInputType
) -> QCTemplateResponse:
    felicity_user = await auth_from_info(info)

    qc_template = await qc_entities.QCTemplate.get(uid=uid)
    if not qc_template:
        return OperationError(error=f"QCTemplate with uid {uid} does not exist")

    qc_data = qc_template.to_dict()
    for field in qc_data:
        if field in payload.__dict__:
            try:
                setattr(qc_template, field, payload.__dict__[field])
            except AttributeError as e:  # noqa
                # raise Exception(f"{e}")
                pass

    qc_in = schemas.QCTemplateUpdate(**qc_template.to_dict())
    qc_template = await qc_template.update(qc_in)

    if payload.levels:
        qc_template.qc_levels.clear()
        qc_template = await qc_template.save_async()
        for _uid in payload.levels:
            level = await qc_entities.QCLevel.get(uid=_uid)
            if level not in qc_template.qc_levels:
                qc_template.qc_levels.append(level)
        qc_template = await qc_template.save_async()

    if payload.departments:
        qc_template.departments.clear()
        qc_template = await qc_template.save_async()
        for _uid in payload.departments:
            dept = await setup_entities.Department.get(uid=_uid)
            if dept not in qc_template.departments:
                qc_template.departments.append(dept)
        qc_template = await qc_template.save_async()
    return a_types.QCTemplateType(**qc_template.marshal_simple())
