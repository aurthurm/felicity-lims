from datetime import datetime, timedelta

from domain.job.conf import JobStates, JobPriorities
from domain.job.ports.repository import IJobRepository
from domain.job.ports.service import IJobService, IJobWorkerService
from domain.job.schemas import Job
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal


class JobService(BaseService[Job], IJobService):
    def __init__(self, repository: IJobRepository):
        self.repository = repository
        super().__init__(repository)

    async def backoff(self, job: Job, minutes: int = 5, max_retries: int = 5):
        bck = minutes * job.retries
        job.next_try = datetime.now() + timedelta(minutes=bck)

        if job.retries >= max_retries + 1:
            job.status = JobStates.FAILED
            job.reason = f"max retries have been exceeded: {max_retries}"

        job.retries += 1
        await self.repository.update(job, **marshal(job))

    async def fetch_sorted(self):
        return await self.repository.fetch_sorted()

    async def change_status(self, job: Job, new_status, change_reason=""):
        job.status = new_status
        job.reason = change_reason
        await self.repository.update(job, **marshal(job))

    async def increase_priority(self, job: Job):
        if job.priority < JobPriorities.HIGH:
            job.priority += 1
            await self.repository.update(job, **marshal(job))

    async def decrease_priority(self, job: Job):
        if job.priority > JobPriorities.NORMAL:
            job.priority -= 1
            await self.repository.update(job, **marshal(job))


class JobWorkerService(IJobWorkerService):
    def __init__(self, job_service: IJobService):
        self.job_service = job_service

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
