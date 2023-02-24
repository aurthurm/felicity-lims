import logging

from felicity.init.setup.create_superuser import create_super_user, create_daemon_user
from felicity.init.setup.groups_perms import setup_default_permissions
from felicity.init.setup.setup_laboratory import (
    create_geographies,
    create_clients,
    create_laboratory,
)
from felicity.init.setup.setup_analyses import (
    create_qc_levels,
    create_categories,
    create_sample_types,
    init_id_sequence,
    create_analyses_services_and_profiles,
    create_rejection_reasons
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def requisite_setup(lab_name="Felicity Labs") -> bool:
    logger.info("Loading requisite setup ...")

    await create_laboratory(lab_name)
    await create_daemon_user()
    await create_super_user()
    await setup_default_permissions()
    await init_id_sequence()

    logger.info("Loading requisite setup complete.")
    return True


async def default_setup() -> bool:
    logger.info("Loading default setup ...")

    await create_geographies()
    await create_clients()
    await create_categories()
    await create_qc_levels()
    await create_sample_types()
    await create_analyses_services_and_profiles()
    await create_rejection_reasons()

    logger.info("Loading default setup complete.")
    return True


async def initialize_felicity() -> bool:
    logger.info("Initializing Felicity LIMS ...")
    await requisite_setup()
    await default_setup()
    logger.info("Felicity LIMS Initialisation completed.")
    return True
