import logging

from felicity.init.setup.create_superuser import create_super_user
from felicity.init.setup.groups_perms import create_groups, create_permissions, set_default_group_permissions
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
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def initialize_felicity() -> bool:
    logger.info("Initializing Felicity LIMS ...")

    # Initial Data pre population
    await create_laboratory("Felicity Labs")
    await create_groups()
    await create_permissions()
    await set_default_group_permissions()
    await create_super_user()
    await create_geographies()
    await create_clients()
    await create_categories()
    await create_qc_levels()
    await create_sample_types()
    await init_id_sequence()
    await create_analyses_services_and_profiles()

    logger.info("Felicity LIMS Initialisation completed.")
    return True
