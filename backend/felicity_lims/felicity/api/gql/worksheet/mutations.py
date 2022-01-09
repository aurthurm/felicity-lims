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
    analyses: List[int]
    reserved: List[ReservedInputType]
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
            or not len(payload.analyses) > 0
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

        _analyses = []
        if payload.analyses:
            for _uid in payload.analyses:
                a_uids = [an.uid for an in _analyses]
                if _uid not in a_uids:
                    anal = await analysis_models.Analysis.get(uid=_uid)
                    _analyses.append(anal)

        wst_schema = schemas.WSTemplateCreate(**incoming)
        wst_schema.analyses = _analyses
        wst_schema.qc_levels = _qc_levels
        wst: schemas.WorkSheetTemplate = await models.WorkSheetTemplate.create(
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
            if field in payload.__dict__:
                try:
                    setattr(ws_template, field, payload.__dict__[field])
                except AttributeError as e:
                    logger.warning(e)

        _qc_levels = []
        if payload.qc_template_uid:
            qc_template = await qc_models.QCTemplate.get(uid=payload.qc_template_uid)
            if qc_template:
                _qc_levels = qc_template.qc_levels

        if payload.reserved:
            positions = dict()
            for item in payload.reserved:
                positions[item["position"]] = item
                qc_level = await qc_models.QCLevel.get(uid=item["level_uid"])
                if qc_level not in _qc_levels:
                    _qc_levels.append(qc_level)
            setattr(ws_template, "reserved", positions)

        wst_schema = schemas.WSTemplateUpdate(**ws_template.to_dict())
        await ws_template.update(wst_schema)

        _analyses = []
        if payload.analyses:
            for _uid in payload.analyses:
                anal = await analysis_models.Analysis.get(uid=_uid)
                if anal not in _analyses:
                    _analyses.append(anal)

        ws_template.analyses = _analyses
        ws_template.qc_levels = _qc_levels
        ws_template = await ws_template.save()
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
            "state": conf.worksheet_states.PENDING_ASSIGNMENT,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        ws_schema = schemas.WorkSheetCreate(**incoming)
        ws_schema.analyses = ws_temp.analyses
        # ws_schema.qc_levels = ws_temp.qc_levels

        # Add a jobs
        # worksheets: List[models.WorkSheet] = []
        # for i in list(range(count)):
        #     ws = await models.WorkSheet.create(ws_schema)
        #     worksheets.append(ws)
        #     job_schema = job_schemas.JobCreate(
        #         action=actions.WS_ASSIGN,
        #         category=categories.WORKSHEET,
        #         priority=priorities.MEDIUM,
        #         job_id=ws.uid,
        #         status=states.PENDING
        #     )
        #     job = await job_models.Job.create(job_schema)
        #     felicity_resume_workforce()
        #     # await tasks.populate_worksheet_plate(job.uid)

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
        analyst_uid: Optional[int],
        action: Optional[str],
        samples: List[int],
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

        if analyst_uid:
            analyst = await user_models.User.get(uid=analyst_uid)
            if not analyst:
                return OperationError(
                    error=f"Selected Analyst {analyst_uid} does not exist"
                )

            incoming = {"analyst_uid": analyst_uid}
            ws_schema = schemas.WorkSheetUpdate(**incoming)
            worksheet = await models.WorkSheet.update(ws_schema)

        if action and samples:
            if action == actions.WS_UN_ASSIGN:
                for res_uid in samples:
                    result = await result_models.AnalysisResult.get(uid=res_uid)
                    if not result:
                        continue
                    if (
                        not result.sample.qc_level_uid
                    ):  # skip un assign of quality control samples
                        result.un_assign()
                await worksheet.reset_assigned_count()
        else:
            pass

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

        for anal in ws_temp.analyses:
            a_uids = [an.uid for an in ws_schema.analyses]
            if anal.uid not in a_uids:
                ws_schema.analyses.append(anal)

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
