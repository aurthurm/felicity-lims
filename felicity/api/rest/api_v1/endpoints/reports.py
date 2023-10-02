from typing import Any
from uuid import uuid4

from sanic import Blueprint
from sanic.log import logger
from apps.analysis.models import analysis as ana_models
from apps.analytics import conf, models
from apps.analytics import schemas as an_schema
from apps.job import conf as job_conf
from apps.job import models as job_models
from apps.job import schemas as job_schemas
from apps.user import models as user_models
from utils.dirs import deleteFile, resolve_media_dirs_for


reports = Blueprint("reports", url_prefix="/reports")


@reports.get("")
async def read_reports(*, current_user: user_models.User) -> Any:
    """
    Retrieve previously generated csv reports.
    """
    return await models.ReportMeta.all()


@reports.post("")
async def request_report_generation(
    *,
    request_in: an_schema.ReportRequest,
    current_user: user_models.User,
) -> Any:
    """
    Generate Reports.
    """
    logger.info(f"Report Gen request: {request_in.__dict__}")
    media_dir = resolve_media_dirs_for("reports")
    file_path = media_dir + uuid4().hex
    analyses = await ana_models.Analysis.get_all(uid__in=request_in.analyses_uids)
    report_in = an_schema.ReportMetaCreate(
        period_start=request_in.period_start.replace(tzinfo=None),
        period_end=request_in.period_end.replace(tzinfo=None),
        date_column=request_in.date_column,
        temp=file_path,
        report_type=request_in.report_type,
        sample_states=", ".join(request_in.sample_states),
        status=conf.report_states.PENDING,
        created_by_uid=current_user.uid,
        updated_by_uid=current_user.uid,
    )
    report_in.analyses = analyses if analyses else []
    report = await models.ReportMeta.create(report_in)
    # Add a job
    job_schema = job_schemas.JobCreate(
        action=job_conf.actions.GENERATE_REPORT,
        category=job_conf.categories.REPORT,
        priority=job_conf.priorities.NORMAL,
        creator_uid=current_user.uid,
        job_id=report.uid,
        status=job_conf.states.PENDING,
    )
    await job_models.Job.create(job_schema)
    return report


@reports.delete("/{report_uid}")
async def delete_report(
    *,
    report_uid: str,
    current_user: user_models.User,
):
    report: models.ReportMeta = await models.ReportMeta.get(uid=report_uid)
    deleteFile(report.location)
    for analysis in report.analyses:
        report.analyses.remove(analysis)
    report.analyses = []
    await report.save()
    await report.delete()
    return an_schema.ReportMetaDeleted(uid=report_uid, message="Deletion Success!!")
