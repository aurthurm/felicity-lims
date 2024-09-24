from datetime import timedelta

from felicity.apps.abstract.service import BaseService
from felicity.apps.job.entities import Job
from felicity.apps.job.enum import JobPriority, JobState
from felicity.apps.job.repository import JobRepository
from felicity.apps.job.schemas import JobCreate, JobUpdate
from felicity.core.dtz import timenow_dt


class JobService(BaseService[Job, JobCreate, JobUpdate]):
    def __init__(self):
        self.repository: JobRepository = JobRepository()
        super().__init__(self.repository)

    async def backoff(self, uid: str, minutes: int = 5, max_retries: int = 5):
        job = await self.get(uid=uid)
        bck = minutes * job.retries
        job.next_try = timenow_dt() + timedelta(minutes=bck)

        if job.retries >= max_retries + 1:
            job.status = JobState.FAILED
            job.reason = f"max retries have been exceeded: {max_retries}"

        job.retries += 1
        await self.save(job)

    async def fetch_sorted(self):
        filters = {
            "status__notin": [
                JobState.FINISHED,
                JobState.FAILED,
                JobState.RUNNING,
            ]
        }
        sort_attrs = ["-priority",]
        return await self.repository.filter(filters=filters, sort_attrs=sort_attrs)

    async def change_status(self, uid: str, new_status, change_reason=""):
        job = await self.get(uid=uid)
        job.status = new_status
        job.reason = change_reason
        await self.save(job)

    async def increase_priority(self, uid: str):
        job = await self.get(uid=uid)
        if job.priority < JobPriority.HIGH:
            job.priority += 1
            await self.save(job)

    async def decrease_priority(self, uid: str):
        job = await self.get(uid=uid)
        if job.priority > JobPriority.NORMAL:
            job.priority -= 1
            await self.save(job)


class JobWorkerService:
    def __init__(self):
        self.job_service = JobService()

    async def run_jobs_if_exists(self):
        jobs = await self.job_service.fetch_sorted()

        # logging.info(f"There are {len(jobs)} Jobs pending running.")

        if not jobs:
            return

        job_dispatch_table = {}
        # job_dispatch_table = {
        #     JobCategories.WORKSHEET: {
        #         JobActions.WS_ASSIGN: populate_worksheet_plate,
        #         JobActions.WS_MANUAL_ASSIGN: populate_worksheet_plate_manually,
        #     },
        #     JobCategories.REPORT: {
        #         JobActions.GENERATE_REPORT: generate_report,
        #     },
        #     JobCategories.IMPRESS: {
        #         JobActions.IMPRESS_REPORT: impress_results,
        #     },
        #     JobCategories.RESULT: {
        #         JobActions.RESULT_SUBMIT: submit_results,
        #         JobActions.RESULT_VERIFY: verify_results,
        #     },
        #     JobCategories.SHIPMENT: {
        #         JobActions.SH_MANUAL_ASSIGN: populate_shipment_manually,
        #         JobActions.SH_DISPATCH: dispatch_shipment,
        #         JobActions.SH_RECEIVE: shipment_receive,
        #         JobActions.SHIPPED_REPORT: return_shipped_report,
        #         JobActions.DIAGNOSTIC_REPORT: process_shipped_report,
        #     },
        # }

        for job in jobs:
            action_function = job_dispatch_table.get(job.category, {}).get(
                job.action, self.unknown_action
            )
            # logging.warning(f"Running Task: {job.action}")
            await action_function(job.uid)

    @staticmethod
    async def unknown_action(action: str):
        # logging.warning(f"Unknown job action: {action}")
        pass
