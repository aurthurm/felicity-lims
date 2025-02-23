import logging

from .groups_perms import seed_group_permissions_defaults, seed_groups, seed_permissions
from .setup_analyses import (
    seed_analyses_services_and_profiles,
    seed_categories,
    seed_coding_standards,
    seed_id_sequence,
    seed_qc_levels,
    seed_rejection_reasons,
    seed_sample_types,
)
from .setup_instruments import seed_instrument_categories
from .setup_inventory import seed_stock_categories, seed_stock_hazards, seed_stock_units
from .setup_laboratory import seed_clients, seed_geographies, seed_laboratory
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

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def requisite_setup(lab_name: str = "Felicity Labs") -> bool:
    logger.info("Loading requisite setup ...")

    await seed_laboratory(lab_name)
    await seed_groups()
    await seed_permissions()
    await seed_group_permissions_defaults()
    await seed_id_sequence()
    await seed_coding_standards()
    await seed_daemon_user()
    await seed_super_user()

    logger.info("Loading requisite setup complete.")
    return True


async def default_setup() -> bool:
    logger.info("Loading default setup ...")
    await seed_geographies()
    await seed_clients()
    await seed_categories()
    await seed_qc_levels()
    await seed_sample_types()
    await seed_analyses_services_and_profiles()
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
    logger.info("Loading default setup complete.")
    return True


async def initialize_felicity() -> bool:
    logger.info("Initializing Felicity LIMS ...")
    await requisite_setup()
    await default_setup()
    logger.info("Felicity LIMS Initialisation completed.")
    return True
