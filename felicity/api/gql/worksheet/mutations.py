import logging
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.api.gql.worksheet.types import WorkSheetTemplateType, WorkSheetType
from felicity.apps.analysis.services.analysis import SampleTypeService
from felicity.apps.analysis.services.quality_control import (
    QCLevelService,
    QCTemplateService,
)
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.idsequencer.service import IdSequenceService
from felicity.apps.instrument.services import LaboratoryInstrumentService, MethodService
from felicity.apps.job import schemas as job_schemas
from felicity.apps.job.enum import JobAction, JobCategory, JobPriority, JobState
from felicity.apps.job.services import JobService
from felicity.apps.user.services import UserService
from felicity.apps.worksheet import schemas
from felicity.apps.worksheet.entities import worksheet_template_qc_level
from felicity.apps.worksheet.enum import WorkSheetState
from felicity.apps.worksheet.services import WorkSheetService, WorkSheetTemplateService
from felicity.utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ReservedInputType:
    position: int
    level_uid: str | None


@strawberry.input
class WorksheetTemplateInputType:
    name: str
    sample_type_uid: str
    reserved: list[ReservedInputType] | None = None
    analysis_uid: str | None = None
    number_of_samples: int | None = None
    instrument_uid: str | None = None
    worksheet_type: str | None = None
    rows: int | None = None
    cols: int | None = None
    row_wise: bool | None = True
    description: str | None = None
    qc_template_uid: str | None = None
    profiles: list[str] | None = None


WorkSheetTemplateResponse = strawberry.union(
    "WorkSheetTemplateResponse",
    (WorkSheetTemplateType, OperationError),  # noqa
    description="",
)


@strawberry.type
class WorksheetListingType:
    worksheets: Optional[List[WorkSheetType]]


WorkSheetsResponse = strawberry.union(
    "WorkSheetsResponse",
    (WorksheetListingType, OperationError),
    description="",  # noqa
)

WorkSheetResponse = strawberry.union(
    "WorkSheetResponse",
    (WorkSheetType, OperationError),
    description="",  # noqa
)


@strawberry.type
class WorkSheetMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_worksheet_template(
        self, info, payload: WorksheetTemplateInputType
    ) -> WorkSheetTemplateResponse:
        felicity_user = await auth_from_info(info)

        if not payload.name or not payload.sample_type_uid or not payload.analysis_uid:
            return OperationError(
                error="Template name and sample type and analysis are mandatory"
            )

        taken = await WorkSheetTemplateService().get(name=payload.name)
        if taken:
            return OperationError(
                error=f"WorkSheet Template with name {taken.name} already exist"
            )

        sample_type = await SampleTypeService().get(uid=payload.sample_type_uid)
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
            qc_template = await QCTemplateService().get(uid=payload.qc_template_uid)
            if qc_template:
                _qc_levels = qc_template.qc_levels

        incoming["reserved"] = {}
        if payload.reserved:
            positions = {}
            for item in payload.reserved:
                positions[item.position] = {
                    "position": item.position,
                    "level_uid": item.level_uid,
                }
                l_uids = [lvl.uid for lvl in _qc_levels]
                if item.level_uid not in l_uids:
                    qc_level = await QCLevelService().get(uid=item.level_uid)
                    _qc_levels.append(qc_level)

            incoming["reserved"] = positions

        wst_schema = schemas.WSTemplateCreate(**incoming)
        wst: schemas.WSTemplate = await WorkSheetTemplateService().create(wst_schema)

        lvl_uids = [qcl.uid for qcl in _qc_levels]
        for l_uid in lvl_uids:
            await QCLevelService().repository.table_insert(
                table=worksheet_template_qc_level,
                mappings=[
                    {
                        "qc_level_uid": l_uid,
                        "ws_template_uid": wst.uid,
                    }
                ],
            )
        wst = await WorkSheetTemplateService().get(uid=wst.uid)
        return WorkSheetTemplateType(**wst.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_worksheet_template(
        self, uid: str, payload: WorksheetTemplateInputType
    ) -> WorkSheetTemplateResponse:
        if not uid:
            return OperationError(error="Worksheet Template uid is required")

        ws_template = await WorkSheetTemplateService().get(uid=uid)
        if not ws_template:
            return OperationError(error=f"WorkSheet Template with uid {uid} not found")

        wst_data = ws_template.to_dict()
        for field in wst_data:
            if field in payload.__dict__ and field not in ["reserved"]:
                try:
                    setattr(ws_template, field, payload.__dict__[field])
                except AttributeError as e:
                    logger.warning(e)

        _qc_levels = []
        if payload.qc_template_uid:
            ws_template.qc_levels.clear()
            ws_template = await QCTemplateService().save(ws_template)
            qc_template = await QCTemplateService().get(uid=payload.qc_template_uid)
            _qc_levels = qc_template.qc_levels
            ws_template.qc_levels = qc_template.qc_levels
            ws_template = await QCTemplateService().save(ws_template)

        if payload.reserved:
            positions = dict()
            for item in payload.reserved:
                positions[item.position] = item.__dict__
                qc_level = await QCLevelService().get(uid=item.level_uid)
                if qc_level not in _qc_levels:
                    _qc_levels.append(qc_level)
            setattr(ws_template, "reserved", positions)

        wst_schema = schemas.WSTemplateUpdate(**ws_template.to_dict())
        await WorkSheetTemplateService().update(ws_template.uid, wst_schema)

        return WorkSheetTemplateType(**ws_template.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_worksheet(
        self,
        info,
        template_uid: str,
        analyst_uid: str,
        count: int | None = 1,
    ) -> WorkSheetsResponse:
        felicity_user = await auth_from_info(info)

        if not template_uid or not analyst_uid:
            return OperationError(error="Analyst and Template are mandatory")

        ws_temp = await WorkSheetTemplateService().get(uid=template_uid)
        if not ws_temp:
            return OperationError(
                error=f"WorkSheet Template {template_uid} does not exist"
            )

        analyst = await UserService().get(uid=analyst_uid)
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
            "state": WorkSheetState.EMPTY,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        ws_schema = schemas.WorkSheetCreate(**incoming)
        ws_schema.analysis_uid = ws_temp.analysis_uid
        # ws_schema.qc_levels = ws_temp.qc_levels

        worksheet_schemas = [
            ws_schema.model_copy(
                update={
                    "worksheet_id": (await IdSequenceService().get_next_number("WS"))[1]
                }
            )
            for i in list(range(count))
        ]

        worksheets = await WorkSheetService().bulk_create(worksheet_schemas)
        logger.info(f"Bulk create: {worksheets}")

        job_schema = job_schemas.JobCreate(
            action=JobAction.WORKSHEET_ASSIGN,
            category=JobCategory.WORKSHEET,
            priority=JobPriority.MEDIUM,
            job_id=None,
            creator_uid=felicity_user.uid,
            status=JobState.PENDING,
        )
        j_schemas = []
        for ws in worksheets:
            j_schemas.append(job_schema.model_copy(update={"job_id": ws.uid}))

        await JobService().bulk_create(j_schemas)

        # to get lazy loads working otherwise return WorksheetListingType(worksheets)
        to_send = [WorkSheetService().get(uid=ws.uid) for ws in worksheets]

        return WorksheetListingType(worksheets=to_send)

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_worksheet(
        self,
        info,
        worksheet_uid: str,
        analyst_uid: str | None = None,
        instrument_uid: str | None = None,
        method_uid: str | None = None,
        action: str | None = None,
        samples: list[str] | None = None,
    ) -> WorkSheetResponse:  # noqa
        if not worksheet_uid:
            return OperationError(error="Worksheet uid required")

        worksheet = await WorkSheetService().get(uid=worksheet_uid)
        if not worksheet:
            return OperationError(
                error=f"WorkSheet Template {worksheet_uid} does not exist"
            )

        incoming = {}
        result_update = {}
        if analyst_uid:
            analyst = await UserService().get(uid=analyst_uid)
            if not analyst:
                return OperationError(
                    error=f"Selected Analyst {analyst_uid} does not exist"
                )
            incoming["analyst_uid"] = analyst_uid

        if instrument_uid:
            instrument = await LaboratoryInstrumentService().get(uid=instrument_uid)
            if not instrument:
                return OperationError(
                    error=f"Selected Instrument {instrument_uid} does not exist"
                )
            incoming["instrument_uid"] = instrument.instrument_uid
            result_update["laboratory_instrument_uid"] = instrument_uid

        if method_uid:
            method = await MethodService().get(uid=method_uid)
            if not method:
                return OperationError(
                    error=f"Selected Method {instrument_uid} does not exist"
                )
            result_update["method_uid"] = method_uid

        if incoming:
            ws_schema = schemas.WorkSheetUpdate(**incoming)
            worksheet = await WorkSheetService().update(worksheet.uid, ws_schema)

        if result_update:
            # update analysis results with updated instrument and methods
            for result in worksheet.analysis_results:
                await AnalysisResultService().update(result.uid, result_update)

        if action and samples:
            if action == JobAction.WORKSHEET_UN_ASSIGN:
                for res_uid in samples:
                    result = await AnalysisResultService().get(uids=res_uid)
                    if not result:
                        continue
                    # skip un assign of quality control samples
                    if not result.sample.qc_level_uid:
                        await AnalysisResultService().un_assign(result.uid)
                await WorkSheetService().reset_assigned_count(worksheet.uid)

        return WorkSheetType(**worksheet.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_worksheet_apply_template(
        self, info, template_uid: str, worksheet_uid: str
    ) -> WorkSheetResponse:
        felicity_user = await auth_from_info(info)

        if not template_uid or not worksheet_uid:
            return OperationError(error="Template and Worksheet are required")

        ws = await WorkSheetService().get(uid=worksheet_uid)
        if not ws:
            return OperationError(error=f"WorkSheet {worksheet_uid} does not exist")

        ws_temp = await WorkSheetTemplateService().get(uid=template_uid)
        if not ws_temp:
            return OperationError(
                error=f"WorkSheet Template {template_uid} does not exist"
            )

        # If WS already contains at least a sample from a different template do nothing: No confusion here
        if ws.assigned_count > 0 and ws.template_uid != template_uid:
            return OperationError(
                error=f"Worksheet has {ws.assigned_count} assigned samples. You can not apply a different template",
                suggestion="Un-assign contained samples first and you will be able to apply any template of your "
                "choosing ",
            )

        incoming = {
            "template_uid": template_uid,
            "analysis_uid": ws_temp.analysis_uid,
            "instrument_uid": ws_temp.instrument_uid,
            "sample_type_uid": ws_temp.sample_type_uid,
            "reserved": ws_temp.reserved,
            "number_of_samples": ws_temp.number_of_samples,
            "rows": ws_temp.rows,
            "cols": ws_temp.cols,
            "row_wise": ws_temp.row_wise,
            "state": WorkSheetState.EMPTY,
        }

        ws_schema = schemas.WorkSheetUpdate(**incoming)
        ws = await WorkSheetService().update(ws.uid, ws_schema)

        # Add a job
        job_schema = job_schemas.JobCreate(
            action=JobAction.WORKSHEET_ASSIGN,
            category=JobCategory.WORKSHEET,
            priority=JobPriority.MEDIUM,
            creator_uid=felicity_user.uid,
            job_id=ws.uid,
            status=JobState.PENDING,
        )
        await JobService().create(job_schema)
        # await tasks.populate_worksheet_plate(job.uid)

        return WorkSheetType(**ws.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_worksheet_manual_assign(
        self,
        info,
        uid: str,
        analyses_uids: List[str],
        qc_template_uid: str | None = None,
    ) -> WorkSheetResponse:
        felicity_user = await auth_from_info(info)

        if not len(analyses_uids) > 0:
            return OperationError(error="Analyses for assignment are required")

        if not uid:
            return OperationError(error="Worksheet uid is required")

        ws = await WorkSheetService().get(uid=uid)
        if not ws:
            return OperationError(error=f"WorkSheet {uid} does not exist")

        # incoming = {}
        # ws_schema = schemas.WorkSheetUpdate(**incoming)
        # ws = await ws.update(ws_schema)

        # Add a job
        job_schema = job_schemas.JobCreate(
            action=JobAction.WORKSHEET_MANUAL_ASSIGN,
            category=JobCategory.WORKSHEET,
            priority=JobPriority.MEDIUM,
            creator_uid=felicity_user.uid,
            job_id=ws.uid,
            status=JobState.PENDING,
            data={"qc_template_uid": qc_template_uid, "analyses_uids": analyses_uids},
        )
        await JobService().create(job_schema)

        return WorkSheetType(**ws.marshal_simple())
