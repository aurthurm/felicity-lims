import logging
from pathlib import Path

import pandas as pd

from felicity.apps.analysis.entities.analysis import Sample
from felicity.apps.analytics import EntityAnalyticsInit
from felicity.apps.analytics.enum import ReportState
from felicity.apps.analytics.services import ReportMetaService
from felicity.apps.job.enum import JobState
from felicity.apps.job.services import JobService
from felicity.apps.notification.services import (
    ActivityStreamService,
    NotificationService,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def generate_report(job_uid: str) -> bool:
    job_service = JobService()
    report_meta_service = ReportMetaService()
    notification_service = NotificationService()
    activity_stream_service = ActivityStreamService()

    job = await job_service.get(uid=job_uid)
    report = await report_meta_service.get(uid=job.job_id)
    if report.status != ReportState.PENDING:
        await job.change_status(new_status=JobState.FAILED)
        await notification_service.notify(
            f"Failed to generate {report.report_type} report", report.created_by
        )
        return False

    await job_service.change_status(job.uid, new_status=JobState.RUNNING)
    analytics = EntityAnalyticsInit(Sample)
    columns, lines = await analytics.get_line_listing(
        period_start=report.period_start,
        period_end=report.period_end,
        sample_states=report.sample_states.split(", "),
        date_column=report.date_column,
        analysis_uids=[an.uid for an in report.analyses],
    )

    data_list = [line for line in lines]

    df = pd.DataFrame(data_list, columns=columns)

    try:
        file_name = report.temp + ".csv"
    except Exception as e:  # noqa
        await job_service.change_status(job.uid, new_status=JobState.FAILED)
        await report_meta_service.set_final(
            report.uid, location=None, status=ReportState.FAILED
        )
        await notification_service.notify(
            f"Error encountered: Failed to save generated {report.report_type} report: {e}",
            report.created_by,
        )
        return False

    df.to_csv(file_name, index=False)

    file_path = Path(file_name)
    if not file_path.is_file():
        await job_service.change_status(job.uid, new_status=JobState.FAILED)
        await report_meta_service.set_final(
            report.uid, status=ReportState.FAILED, location=None
        )
        await notification_service.notify(
            f"File access error: Failed to access generated {report.report_type} report",
            report.created_by,
        )
        return False

    await job_service.change_status(job.uid, new_status=JobState.FINISHED)
    await report_meta_service.set_final(
        report.uid, location=file_name, status=ReportState.READY
    )
    await notification_service.notify(
        f"Your {report.report_type} report was successfully generated",
        report.created_by,
    )
    await activity_stream_service.stream(
        report, report.created_by, "generated", "report"
    )
    return True


# # Convert DataFrame to a buffer (StringIO)
# buffer = StringIO()
# df.to_csv(buffer, index=False)
# buffer.seek(0)  # Reset buffer position to the beginning


# # usage
# @app.route('/download_csv')
# def download_csv():
#     buffer.seek(0)
#     return Response(
#         buffer.getvalue(),
#         mimetype='text/csv',
#         headers={'Content-Disposition': 'attachment; filename=data.csv'}
#     )
