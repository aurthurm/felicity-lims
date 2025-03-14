import logging

from felicity.apps.user import schemas
from felicity.apps.user.services import GroupService, PermissionService
from .definitions import PERMISSION_GROUPS, FGroup
from .mappings import DEFAULT_PERMISSION_MAPPINGS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_action_targets() -> list[tuple[str, str]]:  # e.g ('verify', 'worksheet'),
    final = []
    for a_key, action in DEFAULT_PERMISSION_MAPPINGS.items():
        for o_key, obj in action.items():
            final.append((a_key, o_key))
    return final


async def create_groups() -> None:
    logger.info("Setting up groups .....")
    group_service = GroupService()

    for _grp in PERMISSION_GROUPS:
        exists = await group_service.get(name=_grp)
        if not exists:
            schema = schemas.GroupCreate(name=_grp, keyword=_grp)
            await group_service.create(schema)


async def create_permissions() -> None:
    logger.info("Setting up permissions .....")
    permission_service = PermissionService()

    for _perm in get_action_targets():
        permission = await permission_service.get(
            action__exact=_perm[0], target__exact=_perm[1]
        )
        if not permission:
            schema = schemas.PermissionCreate(action=_perm[0], target=_perm[1])
            await permission_service.create(schema)


async def create_group_permissions_defaults() -> None:
    logger.info("Setting up default group permissions .....")
    permission_service = PermissionService()
    group_service = GroupService()

    for action, objects in DEFAULT_PERMISSION_MAPPINGS.items():
        for obj, roles in objects.items():
            permission = await permission_service.get(
                action__exact=action, target__exact=obj
            )
            for role in roles:
                group = await group_service.get(name=role)
                if permission.uid not in [p.uid for p in group.permissions]:
                    group.permissions.append(permission)
                    group.pages = "DASHBOARD"
                    if group.name == FGroup.ADMINISTRATOR:
                        group.pages += ", ADMINISTRATION"
                    await group_service.save(group)
