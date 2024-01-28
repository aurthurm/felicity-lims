import logging

from .groups_perms import (
    seed_groups,
    seed_permissions,
    seed_group_permissions_defaults
)
from .setup_analyses import (
    seed_categories,
    seed_qc_levels,
    seed_id_sequence,
    seed_coding_standards,
    seed_sample_types,
    seed_analyses_services_and_profiles,
    seed_rejection_reasons
)
from .setup_laboratory import (
    seed_geographies,
    seed_clients,
    seed_laboratory
)
from .superusers import (
    seed_daemon_user,
    seed_super_user
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def requisite_setup(lab_name="Felicity Labs") -> bool:
    logger.info("Loading requisite setup ...")

    await seed_laboratory(lab_name)
    await seed_daemon_user()
    await seed_super_user()
    await seed_groups()
    await seed_permissions()
    await seed_group_permissions_defaults()
    await seed_id_sequence()
    await seed_coding_standards()

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
    logger.info("Loading default setup complete.")
    return True


async def initialize_felicity() -> bool:
    logger.info("Initializing Felicity LIMS ...")
    await requisite_setup()
    await default_setup()
    logger.info("Felicity LIMS Initialisation completed.")
    return True
