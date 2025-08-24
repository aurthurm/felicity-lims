import logging
from typing import Annotated, Any
from uuid import uuid4

from fastapi import APIRouter, Depends

from felicity.api.deps import get_current_user
from felicity.apps.analysis.services.analysis import AnalysisService
from felicity.apps.analytics import schemas as an_schema
from felicity.apps.analytics.entities import analysis_reports
from felicity.apps.analytics.enum import ReportState
from felicity.apps.analytics.services import ReportMetaService
from felicity.apps.job import schemas as job_schemas
from felicity.apps.job.enum import JobAction, JobCategory, JobPriority, JobState
from felicity.apps.job.services import JobService
from felicity.apps.user.schemas import User
from felicity.utils.dirs import delete_file, get_download_path, get_full_path_from_relative, resolve_media_dirs_for

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

reports = APIRouter(tags=["reports"], prefix="/reports")


@reports.get("")
async def read_reports(
        report_servie: Annotated[ReportMetaService, Depends(ReportMetaService)],
        current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Retrieve previously generated csv reports with download links.
    """
    _r = await report_servie.all()

    def marshal_with_location(r):
        report_dict = r.marshal_simple()
        location = getattr(r, "location", None)
        if location:
            report_dict["location"] = get_download_path(location)
        else:
            report_dict["location"] = None
        return report_dict

    return list(map(marshal_with_location, _r))


@reports.post("", response_model=an_schema.ReportMeta)
async def request_report_generation(
        request_in: an_schema.ReportRequest,
        report_service: Annotated[ReportMetaService, Depends(ReportMetaService)],
        analysis_service: Annotated[AnalysisService, Depends(AnalysisService)],
        job_service: Annotated[JobService, Depends(JobService)],
        current_user: Annotated[User, Depends(get_current_user)],
) -> Any:
    """
    Generate Reports.
    """
    # logger.info(f"Report Gen request: {request_in.__dict__}")
    _, relative_path = resolve_media_dirs_for("reports")
    file_path = relative_path + uuid4().hex
    analyses = await analysis_service.get_all(uid__in=request_in.analyses_uids)
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
        analyses=analyses if analyses else []
    )
    data = report_in.model_dump(exclude_unset=True)
    data['analyses'] = analyses
    report = await report_service.create(data, related=['analyses', 'created_by', 'updated_by'])
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
        report_service: Annotated[ReportMetaService, Depends(ReportMetaService)],
        current_user: Annotated[User, Depends(get_current_user)],
):
    report = await report_service.get(uid=report_uid)

    _file_path = get_full_path_from_relative(report.location) if report.location else None
    try:
        delete_file(_file_path)
        message = f"File {report.location} deleted successfully."
    except Exception as e:
        message = f"Error deleting File {report.location}. Report record deleted successfully."
        logger.error(f"Error deleting file {report.location}: {e}")

    # TODO: use a single sessibon transaction to delete from the 2 tables
    await report_service.repository.table_delete(
        analysis_reports,
        report_uid=report.uid
    )
    await report_service.delete(report.uid)
    return {"uid": report_uid, "message": message}
