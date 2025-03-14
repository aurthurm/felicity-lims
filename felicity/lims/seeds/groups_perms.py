from felicity.apps.guard.utils import create_groups, create_permissions, create_group_permissions_defaults


async def seed_groups_perms() -> None:
    await create_groups()
    await create_permissions()
    await create_group_permissions_defaults()
