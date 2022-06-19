import json
import logging
from typing import List, Optional

import strawberry  # noqa
from felicity.apps.analysis.models import (
    analysis as analysis_models,
    qc as qc_models,
    results as result_models,
)
from felicity.apps.common.models import IdSequence
from felicity.apps.job import models as job_models, schemas as job_schemas
from felicity.apps.job.conf import actions, categories, priorities, states
from felicity.apps.job.sched import felicity_resume_workforce
from felicity.apps.user import models as user_models
from felicity.apps.setup import models as setup_models
from felicity.apps.worksheet import conf, models, schemas
from felicity.api.gql import OperationError, auth_from_info, verify_user_auth
from felicity.api.gql.worksheet.types import WorkSheetTemplateType, WorkSheetType
from felicity.utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ReservedInputType:
    position: int
    level_uid: Optional[int]


@strawberry.input
class WorksheetTemplateInputType:
    name: str
    sample_type_uid: int
    reserved: List[ReservedInputType]
    analysis_uid: Optional[int] = None
    number_of_samples: Optional[int] = None
    instrument_uid: Optional[int] = None
    worksheet_type: Optional[str] = None
    rows: Optional[int] = None
    cols: Optional[int] = None
    row_wise: Optional[bool] = True
    description: Optional[str] = None
    qc_template_uid: Optional[int] = None
    profiles: Optional[List[int]] = None


WorkSheetTemplateResponse = strawberry.union(
    "WorkSheetTemplateResponse",
    (WorkSheetTemplateType, OperationError),  # noqa
    description="",
)


@strawberry.type
class WorksheetListingType:
    worksheets: Optional[List[WorkSheetType]]


WorkSheetsResponse = strawberry.union(
    "WorkSheetsResponse", (WorksheetListingType, OperationError), description=""  # noqa
)

WorkSheetResponse = strawberry.union(
    "WorkSheetResponse", (WorkSheetType, OperationError), description=""  # noqa
)


@strawberry.type
class WorkSheetMutations:
    @strawberry.mutation
    async def create_worksheet_template(
            self, info, payload: WorksheetTemplateInputType
    ) -> WorkSheetTemplateResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create worksheet templates",
        )

        if (
                not payload.name
                or not payload.sample_type_uid
                or not payload.analysis_uid
        ):
            return OperationError(
                error="Template name and sample type and analysis are mandatory"
            )

        taken = await models.WorkSheetTemplate.get(name=payload.name)
        if taken:
            return OperationError(
                error=f"WorkSheet Template with name {taken.name} already exist"
            )

        sample_type = await analysis_models.SampleType.get(uid=payload.sample_type_uid)
        if not sample_type:
            return OperationError(
                error=f"Sample Type with uid {payload.sample_type_uid} does not exist"
            )

        incoming = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in payload.__dict__.items():
            if has_value_or_is_truthy(v):
                incoming[k] = v

        _qc_levels = []
        if payload.qc_template_uid:
            qc_template = await qc_models.QCTemplate.get(uid=payload.qc_template_uid)
            if qc_template:
                _qc_levels = qc_template.qc_levels

        incoming["reserved"] = []
        if payload.reserved:
            positions = dict()
            for item in payload.reserved:
                positions[item.position] = {
                    "position": item.position,
                    "level_uid": item.level_uid,
                }
                l_uids = [lvl.uid for lvl in _qc_levels]
                if item.level_uid not in l_uids:
                    qc_level = await qc_models.QCLevel.get(uid=item.level_uid)
                    _qc_levels.append(qc_level)

            incoming["reserved"] = positions

        wst_schema = schemas.WSTemplateCreate(**incoming)
        wst_schema.qc_levels = _qc_levels
        wst: schemas.WSTemplate = await models.WorkSheetTemplate.create(
            wst_schema
        )

        return WorkSheetTemplateType(**wst.marshal_simple())

    @strawberry.mutation
    async def update_worksheet_template(
            self, uid: int, payload: WorksheetTemplateInputType
    ) -> WorkSheetTemplateResponse:

        if not uid:
            return OperationError(error="Worksheet Template uid is required")

        ws_template = await models.WorkSheetTemplate.get(uid=uid)
        if not ws_template:
            return OperationError(error=f"WorkSheet Template with uid {uid} not found")

        wst_data = ws_template.to_dict()
        for field in wst_data:
            if field in payload.__dict__ and field not in ['reserved']:
                try:
                    setattr(ws_template, field, payload.__dict__[field])
                except AttributeError as e:
                    logger.warning(e)

        _qc_levels = []
        if payload.qc_template_uid:
            ws_template.qc_levels.clear()
            ws_template = await ws_template.save()
            qc_template = await qc_models.QCTemplate.get(uid=payload.qc_template_uid)
            _qc_levels = qc_template.qc_levels
            ws_template.qc_levels = qc_template.qc_levels
            ws_template = await ws_template.save()

        if payload.reserved:
            positions = dict()
            for item in payload.reserved:
                positions[item.position] = item.__dict__
                qc_level = await qc_models.QCLevel.get(uid=item.level_uid)
                if qc_level not in _qc_levels:
                    _qc_levels.append(qc_level)
            setattr(ws_template, "reserved", positions)

        wst_schema = schemas.WSTemplateUpdate(**ws_template.to_dict())
        await ws_template.update(wst_schema)

        return WorkSheetTemplateType(**ws_template.marshal_simple())

    @strawberry.mutation
    async def create_worksheet(
            self, info, template_uid: int, analyst_uid: int, count: Optional[int] = 1
    ) -> WorkSheetsResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can create worksheets",
        )

        if not template_uid or not analyst_uid:
            return OperationError(error="Analyst and Template are mandatory")

        ws_temp = await models.WorkSheetTemplate.get(uid=template_uid)
        if not ws_temp:
            return OperationError(
                error=f"WorkSheet Template {template_uid} does not exist"
            )

        analyst = await user_models.User.get(uid=analyst_uid)
        if not analyst:
            return OperationError(
                error=f"Selected Analyst {analyst_uid} does not exist"
            )

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
            "state": conf.worksheet_states.EMPTY,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        ws_schema = schemas.WorkSheetCreate(**incoming)
        ws_schema.analysis_uid = ws_temp.analysis_uid
        # ws_schema.qc_levels = ws_temp.qc_levels

        worksheet_schemas = [
            ws_schema.copy(
                update={"worksheet_id": (await IdSequence.get_next_number("WS"))[1]}
            )
            for i in list(range(count))
        ]

        worksheets = await models.WorkSheet.bulk_create(worksheet_schemas)
        logger.info(f"Bulk create: {worksheets}")

        job_schema = job_schemas.JobCreate(
            action=actions.WS_ASSIGN,
            category=categories.WORKSHEET,
            priority=priorities.MEDIUM,
            job_id=None,
            creator_uid=felicity_user.uid,
            status=states.PENDING,
        )
        j_schemas = []
        for ws in worksheets:
            j_schemas.append(job_schema.copy(update={"job_id": ws.uid}))

        await job_models.Job.bulk_create(j_schemas)
        felicity_resume_workforce()

        # to get lazy loads working otherwise return WorksheetListingType(worksheets)
        to_send = [models.WorkSheet.get(uid=ws.uid) for ws in worksheets]

        return WorksheetListingType(to_send)

    @strawberry.mutation
    async def update_worksheet(
            self,
            info,
            worksheet_uid: int,
            analyst_uid: Optional[int] = None,
            instrument_uid: Optional[int] = None,
            method_uid: Optional[int] = None,
            action: Optional[str] = None,
            samples: Optional[List[int]] = None,
    ) -> WorkSheetResponse:  # noqa

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update worksheets",
        )

        if not worksheet_uid:
            return OperationError(error="Worksheet uid required")

        worksheet: Optional[models.WorkSheet] = await models.WorkSheet.get(
            uid=worksheet_uid
        )
        if not worksheet:
            return OperationError(
                error=f"WorkSheet Template {worksheet_uid} does not exist"
            )

        incoming = {}
        result_update = {}
        if analyst_uid:
            analyst = await user_models.User.get(uid=analyst_uid)
            if not analyst:
                return OperationError(
                    error=f"Selected Analyst {analyst_uid} does not exist"
                )
            incoming['analyst_uid'] = analyst_uid

        if instrument_uid:
            instrument = await setup_models.Instrument.get(uid=instrument_uid)
            if not instrument:
                return OperationError(
                    error=f"Selected Instrument {instrument_uid} does not exist"
                )
            incoming['instrument_uid'] = instrument_uid
            result_update['instrument_uid'] = instrument_uid

        if method_uid:
            method = await setup_models.Method.get(uid=method_uid)
            if not method:
                return OperationError(
                    error=f"Selected Method {instrument_uid} does not exist"
                )
            result_update['method_uid'] = method_uid

        if incoming:
            ws_schema = schemas.WorkSheetUpdate(**incoming)
            worksheet = await worksheet.update(ws_schema)

        if result_update:
            # update analysis results with updated instrument and methods
            for result in worksheet.analysis_results:
                await result.update(result_update)

        if action and samples:
            if action == actions.WS_UN_ASSIGN:
                for res_uid in samples:
                    result = await result_models.AnalysisResult.get(uids=res_uid)
                    if not result:
                        continue
                    # skip un assign of quality control samples
                    if not result.sample.qc_level_uid:
                        result.un_assign()
                await worksheet.reset_assigned_count()

        return WorkSheetType(**worksheet.marshal_simple())

    @strawberry.mutation
    async def update_worksheet_apply_template(
            self, info, template_uid: int, worksheet_uid: int
    ) -> WorkSheetResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update worksheets",
        )

        if not template_uid or not worksheet_uid:
            return OperationError(error="Template and Worksheet are required")

        ws = await models.WorkSheet.get(uid=worksheet_uid)
        if not ws:
            return OperationError(error=f"WorkSheet {worksheet_uid} does not exist")

        ws_temp = await models.WorkSheetTemplate.get(uid=template_uid)
        if not ws_temp:
            return OperationError(
                error=f"WorkSheet Template {template_uid} does not exist"
            )

        # If WS already contains at least a sample from a different template do nothing: No confusion here
        if ws.assigned_count > 0 and ws.template_uid != template_uid:
            return OperationError(
                error=f"Worksheet has {ws.assigned_count} assigned samples. You can not apply a different template",
                suggestion="Un-assign contained samples first and you will be able to apply any template of your "
                           "choosing "
            )

        incoming = {
            "template_uid": template_uid,
            "analysis_uid":  ws_temp.analysis_uid,
            "instrument_uid": ws_temp.instrument_uid,
            "sample_type_uid": ws_temp.sample_type_uid,
            "reserved": ws_temp.reserved,
            "number_of_samples": ws_temp.number_of_samples,
            "rows": ws_temp.rows,
            "cols": ws_temp.cols,
            "row_wise": ws_temp.row_wise,
            "state": conf.worksheet_states.EMPTY,
        }

        ws_schema = schemas.WorkSheetUpdate(**incoming)
        ws = await ws.update(ws_schema)
        
        # Add a job
        job_schema = job_schemas.JobCreate(
            action=actions.WS_ASSIGN,
            category=categories.WORKSHEET,
            priority=priorities.MEDIUM,
            creator_uid=felicity_user.uid,
            job_id=ws.uid,
            status=states.PENDING,
        )
        await job_models.Job.create(job_schema)
        felicity_resume_workforce()
        # await tasks.populate_worksheet_plate(job.uid)

        return WorkSheetType(**ws.marshal_simple())

    @strawberry.mutation
    async def update_worksheet_manual_assign(
            self, info, uid: int, analyses_uids: List[int], qc_template_uid: Optional[int] = None,
    ) -> WorkSheetResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can update worksheets",
        )

        if not len(analyses_uids) > 0:
            return OperationError(error="Analyses for assignment are required")

        if not uid:
            return OperationError(error="Worksheet uid is required")

        ws = await models.WorkSheet.get(uid=uid)
        if not ws:
            return OperationError(error=f"WorkSheet {uid} does not exist")

        # incoming = {}
        # ws_schema = schemas.WorkSheetUpdate(**incoming)
        # ws = await ws.update(ws_schema)

        # Add a job
        job_schema = job_schemas.JobCreate(
            action=actions.WS_MANUAL_ASSIGN,
            category=categories.WORKSHEET,
            priority=priorities.MEDIUM,
            creator_uid=felicity_user.uid,
            job_id=ws.uid,
            status=states.PENDING,
            data={
                'qc_template_uid': qc_template_uid,
                'analyses_uids': analyses_uids,
            }
        )
        await job_models.Job.create(job_schema)
        felicity_resume_workforce()

        return WorkSheetType(**ws.marshal_simple())
