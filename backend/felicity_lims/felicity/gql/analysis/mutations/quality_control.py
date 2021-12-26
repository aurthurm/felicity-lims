import inspect
import logging
from typing import Optional, List

import strawberry

from felicity.apps.analysis import schemas
from felicity.apps.analysis.conf import states
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.analysis.models import qc as qc_models
from felicity.apps.analysis.models import results as result_models
from felicity.apps.analysis.utils import (
    get_qc_sample_type
)
from felicity.apps.patient.models import logger
from felicity.apps.setup.models import setup as setup_models
from felicity.gql import auth_from_info, verify_user_auth
from felicity.gql.analysis.types import analysis as a_types
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ARSampleInputType:
    sample_type: int
    profiles: List[int]
    analyses: List[int]


@strawberry.input
class ARResultInputType:
    uid: int
    result: str
    reportable: Optional[bool] = True


@strawberry.input
class QCSetInputType:
    qcTemplateUid: Optional[int]
    qcLevels: List[int]
    analysisProfiles: List[int]
    analysisServices: List[int]


@strawberry.type
class CreateQCSetData:
    samples: List[a_types.SampleType]
    qc_sets: List[a_types.QCSetType]


@strawberry.input
class SampleRejectInputType:
    uid: int
    reasons: List[int]
    other: Optional[str] = None


@strawberry.mutation
async def create_QC_set(info, samples: List[QCSetInputType]) -> CreateQCSetData:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create qc-sets")

    if not samples or len(samples) == 0:
        raise Exception("There are No QC Requests to create")

    qc_sample_type = await get_qc_sample_type()
    qc_samples: List[analysis_models.Sample] = []
    qc_sets: List[analysis_models.QCSet] = []

    for qc_set_in in samples:
        qc_set_schema = schemas.QCSetCreate(name="Set", note="Auto Generated")
        qc_set = await qc_models.QCSet.create(qc_set_schema)

        qc_levels = []
        qc_levels_uids = []
        if qc_set_in.qcTemplateUid:
            qc_template = await qc_models.QCTemplate.get(uid=qc_set_in.qcTemplateUid)
            for level in qc_template.qc_levels:
                if level.uid not in qc_levels_uids:
                    qc_levels.append(level)
                    qc_levels_uids.append(level.uid)

        if qc_set_in.qcLevels:
            for level_uid in qc_set_in.qcLevels:
                if int(level_uid) not in qc_levels_uids:
                    level = await qc_models.QCLevel.get(uid=int(level_uid))
                    qc_levels.append(level)
                    qc_levels_uids.append(level_uid)

        profiles = []
        analyses = []
        _profiles_analyses = set()

        if qc_set_in.analysisProfiles:
            for p_uid in qc_set_in.analysisProfiles:
                profile = await analysis_models.Profile.get(uid=p_uid)
                profiles.append(profile)
                analyses_ = profile.analyses
                for _an in analyses_:
                    _profiles_analyses.add(_an)

        if qc_set_in.analysisServices:
            # make sure the selected analyses are not part of the selected profiles
            for a_uid in qc_set_in.analysisServices:
                analysis = await analysis_models.Analysis.get(uid=a_uid)
                if analysis not in _profiles_analyses:
                    analyses.append(analysis)
                    _profiles_analyses.add(analysis)

        for level in qc_levels:
            # create qc_sample
            s_in = schemas.SampleCreate(
                sampletype_uid=qc_sample_type.uid,
                internal_use=True,
                status=states.sample.RECEIVED,
            )
            sample: analysis_models.Sample = await analysis_models.Sample.create(s_in)
            sample.analyses = analyses
            sample.profiles = profiles
            sample.qc_set_uid = qc_set.uid
            sample.qc_level_uid = level.uid
            sample = await sample.save()

            # Attach Analysis result for each Analyses
            for _service in _profiles_analyses:
                a_result_in = {
                    'sample_uid': sample.uid,
                    'analysis_uid': _service.uid,
                    'status': states.result.PENDING
                }
                a_result_schema = schemas.AnalysisResultCreate(**a_result_in)
                await result_models.AnalysisResult.create(a_result_schema)

            qc_samples.append(sample)

        qc_sets.append(qc_set)

    return CreateQCSetData(samples=qc_samples, qc_sets=qc_sets)


@strawberry.mutation
async def create_QC_level(info, level: str) -> a_types.QCLevelType:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create qc-levels")

    if not level:
        raise Exception("Level Name is mandatory")

    exists = await qc_models.QCLevel.get(level=level)
    if exists:
        raise Exception(f"A QCLevel named {level} already exists")

    obj_in = schemas.QCLevelCreate(**passed_args)
    qc_level: qc_models.QCLevel = await qc_models.QCLevel.create(obj_in)
    return qc_level


@strawberry.mutation
async def update_QC_level(info, uid: int, level: str) -> a_types.QCLevelType:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update qc-levels")

    qc_level = await qc_models.QCLevel.get(uid=uid)
    if not qc_level:
        raise Exception(f"QCLevel with uid {uid} does not exist")

    qc_data = qc_level.to_dict()
    for field in qc_data:
        if field in passed_args:
            try:
                setattr(qc_level, field, passed_args[field])
            except AttributeError as e:
                logger.warning(e)

    qc_in = schemas.QCTemplateUpdate(**qc_level.to_dict())
    qc_level = await qc_level.update(qc_in)
    return qc_level


@strawberry.mutation
async def create_QC_template(info, name: str, description: str, departments: Optional[List[int]] = None,
                             levels: List[int] = None) -> a_types.QCTemplateType:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create qc-templates")

    if not name:
        raise Exception("Name is mandatory")

    exists = await qc_models.QCTemplate.get(name=name)
    if exists:
        raise Exception(f"A QCTemplate named {name} already exists")

    incoming = {}
    for k, v in passed_args.items():
        if k not in ['levels', 'departments']:
            incoming[k] = v

    obj_in = schemas.QCTemplateCreate(**incoming)
    qc_template: qc_models.QCTemplate = await qc_models.QCTemplate.create(obj_in)

    levels = passed_args.get('levels', None)
    qc_template.qc_levels.clear()
    if levels:
        for _uid in levels:
            level = await qc_models.QCLevel.get(uid=_uid)
            if level not in qc_template.qc_levels:
                qc_template.qc_levels.append(level)
    qc_template = await qc_template.save()

    departments = passed_args.get('departments', None)
    qc_template.departments.clear()
    if departments:
        for _uid in departments:
            dept = await setup_models.Department.get(uid=_uid)
            if dept not in qc_template.departments:
                qc_template.departments.append(dept)
    qc_template = await qc_template.save()
    return qc_template


@strawberry.mutation
async def update_QC_template(info, uid: int, name: Optional[str] = None, description: Optional[str] = None,
                             departments: List[int] = None, levels: List[int] = None) -> a_types.QCTemplateType:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update qc-templates")

    qc_template = await qc_models.QCTemplate.get(uid=uid)
    if not qc_template:
        raise Exception(f"QCTemplate with uid {uid} does not exist")

    qc_data = qc_template.to_dict()
    for field in qc_data:
        if field in passed_args:
            try:
                setattr(qc_template, field, passed_args[field])
            except AttributeError as e:
                # raise Exception(f"{e}")
                pass

    qc_in = schemas.QCTemplateUpdate(**qc_template.to_dict())
    qc_template = await qc_template.update(qc_in)

    levels = passed_args.get('levels', None)
    qc_template.qc_levels.clear()
    if levels:
        for _uid in levels:
            level = await qc_models.QCLevel.get(uid=_uid)
            if level not in qc_template.qc_levels:
                qc_template.qc_levels.append(level)
    qc_template = await qc_template.save()

    departments = passed_args.get('departments', None)
    qc_template.departments.clear()
    if departments:
        for _uid in departments:
            dept = await setup_models.Department.get(uid=_uid)
            if dept not in qc_template.departments:
                qc_template.departments.append(dept)
    qc_template = await qc_template.save()
    return qc_template
