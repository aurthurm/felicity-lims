import logging

from .groups_perms import seed_groups_perms
from .setup_analyses import (
    seed_analyses_services_and_profiles,
    seed_categories,
    seed_coding_standards,
    seed_id_sequence,
    seed_qc_levels,
    seed_rejection_reasons,
    seed_sample_types,
)
from .setup_instance import seed_clients, seed_geographies, seed_organisation, seed_laboratory
from .setup_instruments import seed_instrument_categories, seed_lab_instrument
from .setup_inventory import seed_stock_categories, seed_stock_hazards, seed_stock_units
from .setup_microbiology import (
    seed_antibiotics,
    seed_organisms,
    seed_breakpoints,
    seed_expected_resistance_phenotypes,
    seed_expert_interpretation_rules,
    seed_qc_ranges,
    seed_organism_serotypes,
    seed_ast_services
)
from .setup_person import seed_person
from .superusers import seed_daemon_user, seed_super_user
from ...apps.setup.services import LaboratoryService
from ...core.tenant_context import set_tenant_context, TenantContext, get_current_lab_uid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def requisite_setup(org_name: str = "Felicity Labs", lab_name: str = "My First Laboratory") -> bool:
    logger.info("Loading requisite setup ...")

    await seed_organisation(org_name)
    await seed_laboratory(lab_name)
    await seed_id_sequence()
    await seed_coding_standards()
    await seed_groups_perms()
    await seed_daemon_user()
    await seed_super_user()

    logger.info("Loading requisite setup complete.")
    return True


async def default_setup() -> bool:
    logger.info("Loading default setup (generic) ...")
    await seed_geographies()
    await seed_categories()
    await seed_sample_types()
    await seed_rejection_reasons()
    await seed_stock_units()
    await seed_stock_hazards()
    await seed_stock_categories()
    await seed_instrument_categories()
    await seed_person()
    await seed_antibiotics()
    await seed_organisms()
    await seed_organism_serotypes()
    await seed_breakpoints()
    await seed_expected_resistance_phenotypes()
    await seed_expert_interpretation_rules()
    await seed_qc_ranges()
    await seed_ast_services()

    # Loading default setup (lab-specific)
    async def _sync_():
        await seed_clients()
        await seed_qc_levels()
        await seed_analyses_services_and_profiles()
        await seed_lab_instrument()

    if get_current_lab_uid() is not None:
        await _sync_()
    else:
        laboratories = await LaboratoryService().all()
        for lab in laboratories:
            set_tenant_context(TenantContext(laboratory_uid=lab.uid))
            await _sync_()

    logger.info("Loading default setup complete.")
    return True


async def initialize_felicity() -> bool:
    logger.info("Initializing Felicity LIMS ...")
    await requisite_setup()
    await default_setup()
    logger.info("Felicity LIMS Initialisation completed.")
    return True
