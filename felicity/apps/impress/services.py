from datetime import datetime
from io import BytesIO

from PyPDF2 import PdfWriter

from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis.enum import SampleState
from felicity.apps.analysis.services.analysis import SampleService
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.impress.entities import ReportImpress
from felicity.apps.impress.repository import ReportImpressRepository
from felicity.apps.impress.sample.engine import FelicityImpress
from felicity.apps.impress.sample.schemas import ReportImpressCreate, ReportImpressUpdate
from felicity.apps.job.enum import JobAction, JobCategory, JobPriority, JobState
from felicity.apps.job.schemas import JobCreate
from felicity.apps.job.services import JobService
from felicity.apps.notification.services import ActivityStreamService, NotificationService
from felicity.apps.user.entities import User
from felicity.apps.user.services import UserService
from felicity.core.config import get_settings

settings = get_settings()


class ReportImpressService(BaseService[ReportImpress, ReportImpressCreate, ReportImpressUpdate]):
    def __init__(self):
        self.sample_service = SampleService()
        self.activity_stream_service = ActivityStreamService()
        self.job_service = JobService()
        self.user_service = UserService()
        self.notification_service = NotificationService()
        super().__init__(ReportImpressRepository)

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
                SampleState.RECEIVED,
                SampleState.PAIRED,
                SampleState.AWAITING,
                SampleState.APPROVED,
                SampleState.PUBLISHING,
                SampleState.PUBLISHED,
            ]:
                impress_meta = marshaller(sample)

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

                await super().create(marshaller(sc_in))
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

        if not job.status == JobState.PENDING:
            return

        await self.job_service.change_status(job.uid, new_status=JobState.RUNNING)

        user = await self.user_service.get(uid=job.creator_uid)

        try:
            await self.impress_samples(job.data, user)
            await self.job_service.change_status(job.uid, new_status=JobState.FINISHED)
            await self.notification_service.notify(
                f"Your results were successfully published", user
            )
        except Exception as e:
            await self.job_service.change_status(job.uid, new_status=JobState.FAILED)
            await self.notification_service.notify(
                f"Failed to publish results in job with uid: {job.uid} with error: {str(e)}",
                user,
            )

    async def prepare_for_impress(self):
        samples = await self.sample_service.get_all(status__in=[SampleState.APPROVED])
        sample_uids = [sample.uid for sample in samples]

        await self.sample_service.bulk_update_with_mappings(
            [{"uid": uid, "status": SampleState.PUBLISHING} for uid in sample_uids]
        )

        system_daemon = await self.user_service.get(
            email=settings.SYSTEM_DAEMONUSER_EMAIL
        )

        job_schema = JobCreate(
            action=JobAction.IMPRESS_REPORT,
            category=JobCategory.IMPRESS,
            priority=JobPriority.NORMAL,
            job_id="0",
            status=JobState.PENDING,
            creator_uid=system_daemon.uid,
            data=sample_uids,
        )
        await self.job_service.create(job_schema)
