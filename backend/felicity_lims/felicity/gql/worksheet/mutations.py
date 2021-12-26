import inspect
import logging
from typing import Optional, List

import strawberry

from felicity.apps.job import (
    models as job_models,
    schemas as job_schemas
)
from felicity.apps.job.sched import felicity_resume_workforce
from felicity.apps.user import models as user_models
from felicity.apps.worksheet import models, schemas, conf
from felicity.gql import auth_from_info, verify_user_auth
from felicity.gql.worksheet.types import WorkSheetType, WorkSheetTemplateType
from felicity.apps.job.conf import actions, categories, priorities, states
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.analysis.models import results as result_models
from felicity.apps.analysis.models import qc as qc_models
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ReservedInputType:
    position: int
    level_uid: Optional[int]


@strawberry.type
class WorkSheetMutations:
    @strawberry.mutation
    async def create_worksheet_template(self, info, name: str, sample_type_uid: int, analyses: List[int],  # noqa
                                        number_of_samples: Optional[int], instrument_uid: Optional[int],
                                        worksheet_type: Optional[str],  # noqa
                                        rows: Optional[int] = None, cols: Optional[int] = None,
                                        row_wise: Optional[bool] = None,  # noqa
                                        description: Optional[str] = None, reserved: List[ReservedInputType] = None,
                                        # noqa
                                        qc_template_uid: Optional[int] = None,
                                        profiles: Optional[List[int]] = None) -> WorkSheetTemplateType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not name or not sample_type_uid or not len(analyses) > 0:
            raise Exception("Template name and sample type and analysis are mandatory")

        taken = await models.WorkSheetTemplate.get(name=name)
        if taken:
            raise Exception(f"WorkSheet Template with name {taken.name} already exist")

        sample_type = await analysis_models.SampleType.get(uid=sample_type_uid)
        if not sample_type:
            raise Exception(f"Sample Type with uid {sample_type_uid} does not exist")

        incoming = {}
        for k, v in passed_args.items():
            incoming[k] = v

        qc_template_uid = passed_args.get('qc_template_uid', None)
        _qc_levels = []
        if qc_template_uid:
            qc_template = await qc_models.QCTemplate.get(uid=qc_template_uid)
            if qc_template:
                for qc_level in qc_template.qc_levels:
                    _qc_levels.append(qc_level)

        reserved: List = passed_args.get('reserved', None)
        incoming['reserved'] = []
        if reserved:
            positions = dict()
            for item in reserved:
                positions[item.position] = {"position": item.position, "level_uid": item.level_uid}
                qc_level = await qc_models.QCLevel.get(uid=item.level_uid)
                if qc_level not in _qc_levels:
                    _qc_levels.append(qc_level)
            incoming['reserved'] = positions

        _analyses = []
        if analyses:
            for _uid in analyses:
                anal = await analysis_models.Analysis.get(uid=_uid)
                if anal not in _analyses:
                    _analyses.append(anal)

        logger.warning(f"check schema: {incoming}")
        wst_schema = schemas.WSTemplateCreate(**incoming)
        wst_schema.analyses = _analyses
        wst_schema.qc_levels = _qc_levels
        wst = await models.WorkSheetTemplate.create(wst_schema)

        return wst

    @strawberry.mutation
    async def update_worksheet_template(root, info, uid: int, name: str, sample_type_uid: int, analyses: List[int],
                                        # noqa
                                        number_of_samples: Optional[int], instrument_uid: Optional[int],
                                        worksheet_type: Optional[str],  # noqa
                                        rows: Optional[int] = None, cols: Optional[int] = None,
                                        row_wise: Optional[bool] = None,  # noqa
                                        description: Optional[str] = None, reserved: List[ReservedInputType] = None,
                                        # noqa
                                        qc_template_uid: Optional[int] = None,
                                        profiles: Optional[List[int]] = None) -> WorkSheetTemplateType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not uid:
            raise Exception("Worksheet Template uid is required")

        ws_template = await models.WorkSheetTemplate.get(uid=uid)
        if not ws_template:
            raise Exception(f"WorkSheet Template with uid {uid} not found")

        wst_data = ws_template.to_dict()
        for field in wst_data:
            if field in passed_args:
                try:
                    setattr(ws_template, field, passed_args[field])
                except AttributeError as e:
                    logger.warning(e)

        qc_template_uid = passed_args.get('qc_template_uid', None)
        _qc_levels = []
        if qc_template_uid:
            qc_template = await qc_models.QCTemplate.get(uid=qc_template_uid)
            if qc_template:
                _qc_levels = qc_template.qc_levels

        reserved = passed_args.get('reserved', None)
        if reserved:
            positions = dict()
            for item in reserved:
                positions[item['position']] = item
                qc_level = await qc_models.QCLevel.get(uid=item['level_uid'])
                if qc_level not in _qc_levels:
                    _qc_levels.append(qc_level)
            setattr(ws_template, 'reserved', positions)

        wst_schema = schemas.WSTemplateUpdate(**ws_template.to_dict())
        await ws_template.update(wst_schema)

        _analyses = []
        analyses = passed_args.get('analyses', None)
        if analyses:
            for _uid in analyses:
                anal = await analysis_models.Analysis.get(uid=_uid)
                if anal not in _analyses:
                    _analyses.append(anal)

        ws_template.analyses = _analyses
        ws_template.qc_levels = _qc_levels
        ws_template = await ws_template.save()
        return ws_template

    @strawberry.mutation
    async def create_worksheet(self, info, template_uid: int, analyst_uid: int, count: Optional[int] = 1) -> List[
        WorkSheetType]:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not template_uid or not analyst_uid:
            raise Exception("Analyst and Template are mandatory")

        ws_temp = await models.WorkSheetTemplate.get(uid=template_uid)
        if not ws_temp:
            raise Exception(f"WorkSheet Template {template_uid} does not exist")

        analyst = await user_models.User.get(uid=analyst_uid)
        if not analyst:
            raise Exception(f"Selected Analyst {analyst_uid} does not exist")

        incoming = {
            "template_uid": template_uid,
            "analyst_uid": analyst_uid,
            "instrument_uid": ws_temp.instrument_uid,
            "sample_type_uid": ws_temp.sample_type_uid,
            "worksheet_id": None,
            "reserved": ws_temp.reserved,
            "number_of_samples": ws_temp.number_of_samples,
            "rows": ws_temp.rows,
            "cols": ws_temp.cols,
            "row_wise": ws_temp.row_wise,
            "state": conf.worksheet_states.PENDING_ASSIGNMENT,
        }

        ws_schema = schemas.WorkSheetCreate(**incoming)
        ws_schema.analyses = ws_temp.analyses
        # ws_schema.qc_levels = ws_temp.qc_levels

        # Add a jobs
        worksheets: models.WorkSheet = []
        for i in list(range(count)):
            ws = await models.WorkSheet.create(ws_schema)
            worksheets.append(ws)
            job_schema = job_schemas.JobCreate(
                action=actions.WS_ASSIGN,
                category=categories.WORKSHEET,
                priority=priorities.MEDIUM,
                job_id=ws.uid,
                status=states.PENDING
            )
            job = await job_models.Job.create(job_schema)
            felicity_resume_workforce()
            # await tasks.populate_worksheet_plate(job.uid)

        return worksheets

    @strawberry.mutation  # action=[unassign, etc], samples: [sample_uids]
    async def update_worksheet(self, info, worksheet_uid: int, analyst_uid: Optional[int], action: Optional[str],
                               # noqa
                               samples: List[int]) -> WorkSheetType:  # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        if not worksheet_uid:
            raise Exception("Worksheet uid required")

        worksheet: Optional[models.WorkSheet] = await models.WorkSheet.get(uid=worksheet_uid)
        if not worksheet:
            raise Exception(f"WorkSheet Template {worksheet_uid} does not exist")

        analyst_uid = passed_args.get('analyst_uid')
        if analyst_uid:
            analyst = await user_models.User.get(uid=analyst_uid)
            if not analyst:
                raise Exception(f"Selected Analyst {analyst_uid} does not exist")

            incoming = {
                "analyst_uid": analyst_uid,
            }
            ws_schema = schemas.WorkSheetUpdate(**incoming)
            worksheet = await models.WorkSheet.update(ws_schema)

        action = passed_args.get('action')
        samples = passed_args.get('samples')
        if action and samples:
            if action == actions.WS_UN_ASSIGN:
                for res_uid in samples:
                    result = await result_models.AnalysisResult.get(uid=res_uid)
                    if not result:
                        continue
                    if not result.sample.qc_level_uid:  # skip un assign of quality control samples
                        result.un_assign()
                await worksheet.reset_assigned_count()
        else:
            pass

        return worksheet

    @strawberry.mutation
    async def update_worksheet_apply_template(self, info, template_uid: int, worksheet_uid: int) -> WorkSheetType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update worksheets")

        if not template_uid or not worksheet_uid:
            raise Exception("Template and Worksheet are required")

        ws = await models.WorkSheet.get(uid=worksheet_uid)
        if not ws:
            raise Exception(f"WorkSheet {worksheet_uid} does not exist")

        ws_temp = await models.WorkSheetTemplate.get(uid=template_uid)
        if not ws_temp:
            raise Exception(f"WorkSheet Template {template_uid} does not exist")

        # TODO:
        #   If templates are different then first un-assign else fill in the difference or or un-assign and refill

        incoming = {
            "template_uid": template_uid,
            "instrument_uid": ws_temp.instrument_uid,
            "sample_type_uid": ws_temp.sample_type_uid,
            "reserved": ws_temp.reserved,
            "number_of_samples": ws_temp.number_of_samples,
            "rows": ws_temp.rows,
            "cols": ws_temp.cols,
            "row_wise": ws_temp.row_wise,
            "state": conf.worksheet_states.PENDING_ASSIGNMENT,
        }

        ws_schema = schemas.WorkSheetUpdate(**incoming)
        ws_schema.analyses = ws_temp.analyses
        ws = await ws.update(ws_schema)

        # Add a job
        job_schema = job_schemas.JobCreate(
            action=actions.WS_ASSIGN,
            category=categories.WORKSHEET,
            priority=priorities.MEDIUM,
            creator_uid=felicity_user.uid,
            job_id=ws.uid,
            status=states.PENDING
        )
        await job_models.Job.create(job_schema)
        felicity_resume_workforce()
        # await tasks.populate_worksheet_plate(job.uid)

        return ws
