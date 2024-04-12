import logging
from pathlib import Path

import pandas as pd

from felicity.apps.analysis.models.analysis import Sample
from felicity.apps.analytics import SampleAnalyticsInit, conf, models
from felicity.apps.job import conf as job_conf
from felicity.apps.job import models as job_models
from felicity.apps.notification.utils import FelicityStreamer, ReportNotifier

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

report_notifier = ReportNotifier()
streamer = FelicityStreamer()


async def generate_report(job_uid: str) -> bool:
    job: job_models.Job = await job_models.Job.get(uid=job_uid)
    report: models.ReportMeta = await models.ReportMeta.get(uid=job.job_id)
    if report.status != conf.report_states.PENDING:
        await job.change_status(new_status=job_conf.states.FAILED)
        await report_notifier.notify(
            f"Failed to generate {report.report_type} report", report.created_by
        )
        return False

    await job.change_status(new_status=job_conf.states.RUNNING)
    analytics = SampleAnalyticsInit(Sample)
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
        await job.change_status(new_status=job_conf.states.FAILED)
        await report.set_final(location=None, status=conf.report_states.FAILED)
        await report_notifier.notify(
            f"Error encountered: Failed to save generated {report.report_type} report: {e}",
            report.created_by,
        )
        return False

    df.to_csv(file_name, index=False)

    file_path = Path(file_name)
    if not file_path.is_file():
        await job.change_status(new_status=job_conf.states.FAILED)
        await report.set_final(status=conf.report_states.FAILED, location=None)
        await report_notifier.notify(
            f"File access error: Failed to access generated {report.report_type} report",
            report.created_by,
        )
        return False

    await job.change_status(new_status=job_conf.states.FINISHED)
    await report.set_final(location=file_name, status=conf.report_states.READY)
    await report_notifier.notify(
        f"Your {report.report_type} report was successfully generated",
        report.created_by,
    )
    await streamer.stream(report, report.created_by, "generated", "report")
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
