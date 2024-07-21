from pathlib import Path

import pandas as pd

from domain.analytics.conf import ReportStates
from domain.analytics.ports.repository import (
    IReportMetaRepository,
    ISampleAnalyticsRepository,
)
from domain.analytics.ports.service import IReportMetaService
from domain.analytics.schemas import ReportMeta
from domain.job.conf import JobStates
from domain.job.ports.service import IJobService
from domain.notification.ports.service import (
    IActivityStreamService,
    INotificationService,
)
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal


class ReportMetaService(BaseService[ReportMeta], IReportMetaService):
    def __init__(
        self,
        repository: IReportMetaRepository,
        sample_analytics_repository: ISampleAnalyticsRepository,
        job_service: IJobService,
        stream_service: IActivityStreamService,
        notification_service: INotificationService,
    ):
        self.repository = repository
        self.sample_analytics = sample_analytics_repository
        self.job_service = job_service
        self.stream_service = stream_service
        self.notification_service = notification_service

    async def set_final(
        self, report: ReportMeta, status: str, location: str | None = None
    ):
        if report.status != ReportStates.READY:
            report.location = location
            report.status = status
            report.temp = None
            await super().update(report, **marshal(report))

    async def generate_report(self, job_uid: str):
        job = await self.jov.get(uid=job_uid)
        report = await self.get(uid=job.job_id)
        if report.status != ReportStates.PENDING:
            await job.change_status(new_status=JobStates.FAILED)
            await self.notification_service.notify(
                f"Failed to generate {report.report_type} report", report.created_by
            )
            return

        await job.change_status(new_status=JobStates.RUNNING)

        columns, lines = await self.sample_analytics.get_line_listing(
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
            await self.job_service.change_status(job, new_status=JobStates.FAILED)
            await self.set_final(report, location=None, status=ReportStates.FAILED)
            await self.notification_service.notify(
                f"Error encountered: Failed to save generated {report.report_type} report: {e}",
                report.created_by,
            )
            return

        df.to_csv(file_name, index=False)

        file_path = Path(file_name)
        if not file_path.is_file():
            await self.job_service.change_status(job, new_status=JobStates.FAILED)
            await self.set_final(report, location=None, status=ReportStates.FAILED)
            await self.notification_service.notify(
                f"File access error: Failed to access generated {report.report_type} report",
                report.created_by,
            )
            return False

        await self.job_service.change_status(job, new_status=JobStates.FINISHED)
        await self.set_final(report, location=file_name, status=ReportStates.READY)
        await self.notification_service.notify(
            f"Your {report.report_type} report was successfully generated",
            report.created_by,
        )
        await self.stream_service.stream(
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
