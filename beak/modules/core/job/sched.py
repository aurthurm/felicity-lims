import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from beak.modules.core.analysis.tasks import submit_results, verify_results
from beak.modules.core.analytics.tasks import generate_report
from beak.modules.core.impress.sample.tasks import (
    impress_results,
    prepare_for_impress,
    cleanup_jobs,
)
from beak.modules.core.iol.analyzer.services.connection import ConnectionService
from beak.modules.core.job.enum import JobAction, JobCategory
from beak.modules.core.job.services import JobService
from beak.modules.core.shipment.tasks import (
    dispatch_shipment,
    populate_shipment_manually,
    process_shipped_report,
    return_shipped_report,
    shipment_receive,
)
from beak.modules.core.worksheet.tasks import (
    populate_worksheet_plate,
    populate_worksheet_plate_manually,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# apscheduler
log = logging.getLogger("apscheduler.executors.default")
log.setLevel(logging.WARNING)

scheduler = AsyncIOScheduler()


async def run_jobs_if_exists():
    async def unknown_action(action):
        logging.warning(f"Unknown job action: {action}")

    jobs = await JobService().fetch_sorted()

    # logging.info(f"There are {len(jobs)} Jobs pending running.")

    if len(jobs) == 0:
        # beak_pause_workforce()
        pass
    else:
        job_dispatch_table = {
            JobCategory.WORKSHEET: {
                JobAction.WORKSHEET_ASSIGN: populate_worksheet_plate,
                JobAction.WORKSHEET_MANUAL_ASSIGN: populate_worksheet_plate_manually,
            },
            JobCategory.REPORT: {
                JobAction.GENERATE_REPORT: generate_report,
            },
            JobCategory.IMPRESS: {
                JobAction.IMPRESS_REPORT: impress_results,
            },
            JobCategory.RESULT: {
                JobAction.RESULT_SUBMIT: submit_results,
                JobAction.RESULT_APPROVE: verify_results,
            },
            JobCategory.SHIPMENT: {
                JobAction.SHIPMENT_MANUAL_ASSIGN: populate_shipment_manually,
                JobAction.SHIPMENT_DISPATCH: dispatch_shipment,
                JobAction.SHIPMENT_RECEIVE: shipment_receive,
                JobAction.SHIPPED_REPORT: return_shipped_report,
                JobAction.DIAGNOSTIC_REPORT: process_shipped_report,
            },
        }

        for job in jobs:
            action_function = job_dispatch_table.get(job.category, {}).get(
                job.action, unknown_action
            )
            logging.warning(f"Running Task: {job.action}")
            await action_function(job.uid)


async def beak_workforce_init():
    logging.info("Initialising beak workforce ...")
    scheduler.add_job(
        func=run_jobs_if_exists, trigger=IntervalTrigger(seconds=10), id="beak_wf"
    )
    scheduler.add_job(
        func=prepare_for_impress,
        trigger=IntervalTrigger(seconds=60 * 60),
        id="beak_impress",
    )
    scheduler.add_job(
        func=cleanup_jobs,
        trigger=IntervalTrigger(seconds=60 * 60 * 24),
        id="beak_jobs_clean",
    )

    # Instrument connections
    conn_service = ConnectionService()
    connections = await conn_service.get_links()
    for _conn in connections:
        # Each instrument gets its own persistent job that runs forever
        scheduler.add_job(
            _conn.start_server,
            args=[_conn],
            id=f"instrument_{_conn.uid}",
            replace_existing=True,
        )

    # Start scheduler
    scheduler.start()
