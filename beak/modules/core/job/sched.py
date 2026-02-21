import logging
from collections.abc import Awaitable, Callable

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy import text
from sqlalchemy.exc import ProgrammingError

from beak.core.tenant_context import TenantContext, clear_tenant_context, set_tenant_context
from beak.database.platform_session import PlatformSessionScoped
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
from beak.modules.core.tenant_registry import get_tenant_registry_provider
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
_REGISTERED_TENANTS: set[str] = set()


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


async def _run_in_tenant(
    tenant_slug: str,
    schema_name: str,
    task_name: str,
    task: Callable[[], Awaitable[None]],
) -> None:
    set_tenant_context(TenantContext(schema_name=schema_name, tenant_slug=tenant_slug))
    try:
        await task()
    except Exception as exc:
        logger.exception(
            "Tenant workforce task '%s' failed for tenant '%s' (%s): %s",
            task_name,
            tenant_slug,
            schema_name,
            exc,
        )
    finally:
        clear_tenant_context()


def _tenant_job_id(base_id: str, tenant_slug: str) -> str:
    return f"{base_id}:{tenant_slug}"


def _tenant_job_ids(tenant_slug: str) -> list[str]:
    return [
        _tenant_job_id("beak_wf", tenant_slug),
        _tenant_job_id("beak_impress", tenant_slug),
        _tenant_job_id("beak_jobs_clean", tenant_slug),
    ]


async def _tenant_table_exists(schema_name: str, table_name: str) -> bool:
    stmt = text(
        """
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = :schema_name
              AND table_name = :table_name
        )
        """
    )
    async with PlatformSessionScoped() as session:
        return bool(
            (
                await session.execute(
                    stmt, {"schema_name": schema_name, "table_name": table_name}
                )
            ).scalar()
        )


async def _schedule_tenant_jobs(tenant: dict) -> None:
    tenant_slug = tenant.get("slug")
    schema_name = tenant.get("schema_name")
    if not tenant_slug or not schema_name:
        logger.warning("Skipping tenant with incomplete metadata: %s", tenant)
        return

    if not await _tenant_table_exists(schema_name, "job"):
        logger.warning(
            "Skipping workforce scheduling for tenant '%s' (%s): core table 'job' missing. "
            "Run tenant migrations for this schema.",
            tenant_slug,
            schema_name,
        )
        return

    scheduler.add_job(
        _run_in_tenant,
        args=[tenant_slug, schema_name, "run_jobs_if_exists", run_jobs_if_exists],
        trigger=IntervalTrigger(seconds=10),
        id=_tenant_job_id("beak_wf", tenant_slug),
        replace_existing=True,
    )
    scheduler.add_job(
        _run_in_tenant,
        args=[tenant_slug, schema_name, "prepare_for_impress", prepare_for_impress],
        trigger=IntervalTrigger(seconds=60 * 60),
        id=_tenant_job_id("beak_impress", tenant_slug),
        replace_existing=True,
    )
    scheduler.add_job(
        _run_in_tenant,
        args=[tenant_slug, schema_name, "cleanup_jobs", cleanup_jobs],
        trigger=IntervalTrigger(seconds=60 * 60 * 24),
        id=_tenant_job_id("beak_jobs_clean", tenant_slug),
        replace_existing=True,
    )

    async def _load_and_schedule_instruments() -> None:
        if not await _tenant_table_exists(schema_name, "instrument_interface"):
            logger.info(
                "Skipping instrument link bootstrap for tenant '%s' (%s): "
                "table 'instrument_interface' not found.",
                tenant_slug,
                schema_name,
            )
            return
        conn_service = ConnectionService()
        try:
            connections = await conn_service.get_links()
        except ProgrammingError as exc:
            # Some tenants may not have IOL/instrument tables migrated yet.
            if "instrument_interface" in str(exc):
                logger.info(
                    "Skipping instrument link bootstrap for tenant '%s' (%s): "
                    "table 'instrument_interface' not found.",
                    tenant_slug,
                    schema_name,
                )
                return
            raise
        for conn in connections:
            scheduler.add_job(
                _run_in_tenant,
                args=[
                    tenant_slug,
                    schema_name,
                    f"instrument_server_{conn.uid}",
                    conn.start_server,
                ],
                id=_tenant_job_id(f"instrument_{conn.uid}", tenant_slug),
                replace_existing=True,
            )

    await _run_in_tenant(
        tenant_slug=tenant_slug,
        schema_name=schema_name,
        task_name="load_instrument_links",
        task=_load_and_schedule_instruments,
    )
    _REGISTERED_TENANTS.add(tenant_slug)


def _unschedule_tenant_jobs(tenant_slug: str) -> None:
    ids = _tenant_job_ids(tenant_slug)
    ids.extend(
        job.id
        for job in scheduler.get_jobs()
        if job.id.startswith("instrument_") and job.id.endswith(f":{tenant_slug}")
    )

    for job_id in ids:
        try:
            scheduler.remove_job(job_id)
        except Exception:
            # Job may not exist yet; ignore and continue.
            pass

    _REGISTERED_TENANTS.discard(tenant_slug)


async def refresh_tenant_workforce_jobs() -> None:
    tenants = await get_tenant_registry_provider().list_active()
    active_by_slug = {
        t["slug"]: t for t in tenants if t.get("slug") and t.get("schema_name")
    }

    # Remove stale tenants that are no longer active.
    for stale_slug in sorted(_REGISTERED_TENANTS - set(active_by_slug.keys())):
        logger.info("Removing workforce jobs for inactive tenant '%s'", stale_slug)
        _unschedule_tenant_jobs(stale_slug)

    # Add newly active tenants.
    for slug in sorted(set(active_by_slug.keys()) - _REGISTERED_TENANTS):
        logger.info("Adding workforce jobs for newly active tenant '%s'", slug)
        await _schedule_tenant_jobs(active_by_slug[slug])


async def beak_workforce_init():
    logging.info("Initialising beak workforce ...")
    await refresh_tenant_workforce_jobs()
    scheduler.add_job(
        refresh_tenant_workforce_jobs,
        trigger=IntervalTrigger(seconds=60),
        id="beak_tenant_sync",
        replace_existing=True,
    )

    # Start scheduler
    scheduler.start()
