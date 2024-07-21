from datetime import datetime
from io import BytesIO

from PyPDF2 import PdfWriter

from core.setting import settings
from domain.analysis.conf import SampleStates
from domain.analysis.ports.service.analysis import ISampleService
from domain.impress.ports.repository import IReportImpressRepository
from domain.impress.ports.service import IReportImpressService
from domain.impress.reports.generic import FelicityImpress
from domain.impress.schemas import ReportImpress, ReportImpressCreate
from domain.impress.utils import impress_marshaller
from domain.job.conf import JobStates, JobActions, JobCategories, JobPriorities
from domain.job.ports.service import IJobService
from domain.job.schemas import JobCreate
from domain.notification.ports.service import (
    IActivityStreamService,
    INotificationService,
)
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.user.ports.service import IUserService
from domain.user.schemas import User


class ReportImpressService(BaseService[ReportImpress], IReportImpressService):
    def __init__(
        self,
        repository: IReportImpressRepository,
        sample_service: ISampleService,
        activity_stream_service: IActivityStreamService,
        job_service: IJobService,
        user_service: IUserService,
        notification_service: INotificationService,
    ):
        self.repository = repository
        self.sample_service = sample_service
        self.activity_stream_service = activity_stream_service
        self.job_service = job_service
        self.user_service = user_service
        self.notification_service = notification_service

    async def impress_reports_download(self, uids: list[str]) -> bytes | None:
        """Fetch Latest report given sample id"""
        items = await self.get_all(sample_uid__in=uids)

        def _first_of(things: list):
            if len(things) > 0:
                return things[0]
            return None

        def _sorter(to_sort: list) -> list:
            return sorted(to_sort, key=lambda r: r.date_generated, reverse=True)

        reports = []
        for suid in uids:
            _report = _first_of(
                _sorter(list(filter(lambda x: x.sample_uid == suid, items)))
            )
            if _report:
                reports.append(_report)

        if not reports:
            return None

        merger = PdfWriter()
        for report in reports:
            merger.append(BytesIO(report.pdf_content))

        # Write to an output PDF document
        # output = open("merged-output.pdf", "wb")
        # merger.write(output)
        # merger.close()
        # output.close()

        with BytesIO() as bytes_stream:
            merger.write(bytes_stream)
            bytes_stream.seek(0)
            out_stream = bytes_stream.getbuffer().tobytes()

        return out_stream

    async def impress_report_download(self, uid: str) -> bytes | None:
        report = await self.get(uid=uid)

        if not report:
            return None

        # BytesIO()
        return report.pdf_content

    async def impress_samples(self, sample_meta: list[any], user: User):
        to_return = []

        for s_meta in sample_meta:
            sample = await self.sample_service.get(uid=s_meta.get("uid"))
            # logger.info(f"sample {sample} {sample.status}")
            if sample.status in [
                SampleStates.RECEIVED,
                SampleStates.PAIRED,
                SampleStates.AWAITING,
                SampleStates.APPROVED,
                SampleStates.PUBLISHING,
                SampleStates.PUBLISHED,
            ]:
                impress_meta = impress_marshaller(sample)

                report_state = "Unknown"
                action = s_meta.get("action")
                if action == "publish":
                    report_state = "Final Report"
                if action == "re-publish":
                    report_state = "Final Report -- republish"
                if action == "pre-publish":
                    report_state = "Preliminary Report"

                impress_engine = FelicityImpress()
                sample_pdf = await impress_engine.generate(impress_meta, report_state)

                sc_in = ReportImpressCreate(
                    **{
                        "state": report_state,
                        "sample_uid": sample.uid,
                        "json_content": impress_meta,
                        "pdf_content": sample_pdf,
                        "email_required": False,
                        "email_sent": False,
                        "sms_required": False,
                        "sms_sent": False,
                        "generated_by_uid": user.uid,
                        "date_generated": datetime.now(),
                    }
                )

                await super().create(**marshal(sc_in))
                if action != "pre-publish":
                    sample = await self.sample_service.publish(
                        sample, published_by=user
                    )

                # logger.info(f"sample {sample.sample_id} has been impressed.")
                to_return.append(sample)

                await self.activity_stream_service.stream(
                    sample, user, "published", "sample"
                )
            else:
                continue

        return to_return

    async def impress_results(self, job_uid: str):
        job = await self.job_service.get(uid=job_uid)
        if not job:
            return

        if not job.status == JobStates.PENDING:
            return

        await self.job_service.change_status(job, new_status=JobStates.RUNNING)

        user = await self.user_service.get(uid=job.creator_uid)

        try:
            await self.impress_samples(job.data, user)
            await self.job_service.change_status(job, new_status=JobStates.FINISHED)
            await self.notification_service.notify(
                f"Your results were successfully published", user
            )
        except Exception as e:
            await self.job_service.change_status(job, new_status=JobStates.FAILED)
            await self.notification_service.notify(
                f"Failed to publish results in job with uid: {job.uid} with error: {str(e)}",
                user,
            )

    async def prepare_for_impress(self):
        samples = await self.sample_service.get_all(status__in=[SampleStates.APPROVED])
        sample_uids = [sample.uid for sample in samples]

        await self.sample_service.bulk_update_with_mappings(
            [{"uid": uid, "status": SampleStates.PUBLISHING} for uid in sample_uids]
        )

        system_daemon = await self.user_service.get(
            email=settings.SYSTEM_DAEMONUSER_EMAIL
        )

        job_schema = JobCreate(
            action=JobActions.IMPRESS_REPORT,
            category=JobCategories.IMPRESS,
            priority=JobPriorities.NORMAL,
            job_id="0",
            status=JobStates.PENDING,
            creator_uid=system_daemon.uid,
            data=sample_uids,
        )

        await self.job_service.create(**marshal(job_schema))
