from typing import Annotated, Any
from uuid import uuid4

from fastapi import APIRouter, Depends

from apps.analysis.services.analysis import AnalysisService
from apps.analytics.enum import ReportState
from apps.analytics.services import ReportMetaService
from apps.job.enum import JobAction, JobCategory, JobPriority, JobState
from apps.job.services import JobService
from felicity.api.deps import get_current_user
from felicity.apps.analytics import schemas as an_schema
from felicity.apps.job import schemas as job_schemas
from felicity.apps.user.schemas import User
from felicity.utils.dirs import delete_file, resolve_media_dirs_for

reports = APIRouter(tags=["reports"], prefix="/reports")


@reports.get("")
async def read_reports(
        report_servie: Annotated[ReportMetaService, Depends(ReportMetaService)],
        current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Retrieve previously generated csv reports.
    """
    _r = await report_servie.all()
    return list(map(lambda r: r.marshall_simple(), _r))


@reports.post("")
async def request_report_generation(
        request_in: an_schema.ReportRequest,
        report_servie: Annotated[ReportMetaService, Depends(ReportMetaService)],
        analysis_servie: Annotated[AnalysisService, Depends(AnalysisService)],
        job_service: Annotated[JobService, Depends(JobService)],
        current_user: Annotated[User, Depends(get_current_user)],
) -> Any:
    """
    Generate Reports.
    """
    # logger.info(f"Report Gen request: {request_in.__dict__}")
    media_dir = resolve_media_dirs_for("reports")
    file_path = media_dir + uuid4().hex
    analyses = await analysis_servie.get_all(uid__in=request_in.analyses_uids)
    report_in = an_schema.ReportMetaCreate(
        period_start=request_in.period_start.replace(tzinfo=None),
        period_end=request_in.period_end.replace(tzinfo=None),
        date_column=request_in.date_column,
        temp=file_path,
        report_type=request_in.report_type,
        sample_states=", ".join(request_in.sample_states),
        status=ReportState.PENDING,
        created_by_uid=current_user.uid,
        updated_by_uid=current_user.uid,
    )
    report_in.analyses = analyses if analyses else []
    report = await report_servie.create(report_in)
    # Add a job
    job_schema = job_schemas.JobCreate(
        action=JobAction.GENERATE_REPORT,
        category=JobCategory.REPORT,
        priority=JobPriority.NORMAL,
        creator_uid=current_user.uid,
        job_id=report.uid,
        status=JobState.PENDING,
    )
    await job_service.create(job_schema)
    return report


@reports.delete("/{report_uid}")
async def delete_report(
        report_uid: str,
        report_servie: Annotated[ReportMetaService, Depends(ReportMetaService)],
        current_user: Annotated[User, Depends(get_current_user)],
):
    report = await report_servie.get(uid=report_uid)
    delete_file(report.location)
    for analysis in report.analyses:
        report.analyses.remove(analysis)
    report.analyses = []
    await report_servie.save(report)
    await report_servie.delete(report.uid)
    return {"uid": report_uid, "message": "Deletion Success!!"}
