import logging

from apps.user import models, schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FGroup:  # (KEYWORD, NAME)
    ADMINISTRATOR = "ADMINISTRATOR"
    LAB_MANAGER = "LAB_MANAGER"
    SCIENTIST = "SCIENTIST"
    TECHNOLOGIST = "TECHNOLOGIST"
    LAB_HAND = "LABORATORY HAND"
    GUEST = "GUEST"
    STORES = "STORES"


class FObject:
    CLIENT = "CLIENT"
    PATIENT = "PATIENT"
    SAMPLE = "SAMPLE"
    RESULT = "RESULT"
    WORKSHEET = "WORKSHEET"
    PRODUCT = "PRODUCT"
    SHIPMENT = "SHIPMENT"
    STORAGE = "STORAGE"


class FAction:
    CREATE = "CREATE"
    READ = "READ"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    SUBMIT = "SUBMIT"
    VERIFY = "VERIFY"
    CANCEL = "CANCEL"
    INVALIDATE = "INVALIDATE"
    REJECT = "REJECT"
    RETEST = "RETEST"
    ORDER = "ORDER"
    ISSUE = "ISSUE"


fg = FGroup()
fo = FObject()
fa = FAction()

groups = [
    fg.ADMINISTRATOR,
    fg.LAB_MANAGER,
    fg.SCIENTIST,
    fg.TECHNOLOGIST,
    fg.LAB_HAND,
    fg.GUEST,
    fg.STORES,
]

# default permissions
permissions = {
    fa.CREATE: {
        fo.CLIENT: [fg.ADMINISTRATOR],
        fo.PATIENT: [fg.LAB_HAND],
        fo.SAMPLE: [fg.LAB_HAND],
        fo.WORKSHEET: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.PRODUCT: [fg.STORES],
        fo.SHIPMENT: [fg.LAB_HAND, fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.STORAGE: [fg.ADMINISTRATOR, fg.STORES, fg.LAB_HAND, fg.SCIENTIST, fg.TECHNOLOGIST]
    },
    fa.READ: {
        fo.CLIENT: [
            fg.ADMINISTRATOR,
            fg.LAB_MANAGER,
            fg.SCIENTIST,
            fg.TECHNOLOGIST,
            fg.LAB_HAND,
            fg.GUEST,
        ],
        fo.PATIENT: [
            fg.ADMINISTRATOR,
            fg.LAB_MANAGER,
            fg.SCIENTIST,
            fg.TECHNOLOGIST,
            fg.LAB_HAND,
            fg.GUEST,
        ],
        fo.SAMPLE: [
            fg.ADMINISTRATOR,
            fg.LAB_MANAGER,
            fg.SCIENTIST,
            fg.TECHNOLOGIST,
            fg.LAB_HAND,
            fg.GUEST,
        ],
        fo.RESULT: [
            fg.ADMINISTRATOR,
            fg.LAB_MANAGER,
            fg.SCIENTIST,
            fg.TECHNOLOGIST,
            fg.GUEST,
        ],
        fo.WORKSHEET: [
            fg.ADMINISTRATOR,
            fg.LAB_MANAGER,
            fg.SCIENTIST,
            fg.TECHNOLOGIST,
            fg.GUEST,
        ],
        fo.PRODUCT: [
            fg.ADMINISTRATOR,
            fg.LAB_MANAGER,
            fg.SCIENTIST,
            fg.TECHNOLOGIST,
            fg.GUEST,
            fg.STORES
        ],
        fo.SHIPMENT: [fg.LAB_HAND,fg.SCIENTIST, fg.TECHNOLOGIST, fg.GUEST],
        fo.STORAGE: [
            fg.ADMINISTRATOR,
            fg.LAB_MANAGER,
            fg.SCIENTIST,
            fg.TECHNOLOGIST,
            fg.GUEST,
            fg.STORES
        ],
    },
    fa.UPDATE: {
        fo.CLIENT: [fg.ADMINISTRATOR],
        fo.PATIENT: [fg.LAB_HAND],
        fo.SAMPLE: [fg.LAB_HAND],
        fo.RESULT: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.WORKSHEET: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.PRODUCT: [fg.STORES],
        fo.SHIPMENT: [fg.LAB_HAND,fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.STORAGE: [fg.ADMINISTRATOR, fg.STORES, fg.LAB_HAND, fg.SCIENTIST, fg.TECHNOLOGIST],
    },
    fa.SUBMIT: {
        fo.SAMPLE: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.RESULT: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.WORKSHEET: [fg.SCIENTIST, fg.TECHNOLOGIST],
    },
    fa.VERIFY: {
        fo.SAMPLE: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.RESULT: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.WORKSHEET: [fg.SCIENTIST, fg.TECHNOLOGIST],
    },
    fa.CANCEL: {
        fo.SAMPLE: [fg.SCIENTIST, fg.TECHNOLOGIST, fg.LAB_HAND],
        fo.RESULT: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.SHIPMENT: [fg.LAB_HAND,fg.SCIENTIST, fg.TECHNOLOGIST]
    },
    fa.RETEST: {
        fo.SAMPLE: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.RESULT: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.WORKSHEET: [fg.SCIENTIST, fg.TECHNOLOGIST],
    },
    fa.INVALIDATE: {fo.SAMPLE: [fg.SCIENTIST, fg.TECHNOLOGIST]},
    fa.ISSUE: {
        fo.PRODUCT: [
            fg.STORES
        ],
    },
    fa.ORDER: {
        fo.PRODUCT: [
            fg.ADMINISTRATOR,
            fg.LAB_MANAGER,
            fg.SCIENTIST,
            fg.TECHNOLOGIST,
            fg.STORES
        ],
    }
}


def get_action_targets():  # e.g ('verify', 'worksheet'),
    final = []
    for a_key, action in permissions.items():
        for o_key, obj in action.items():
            final.append((a_key, o_key))
    return final


async def create_groups() -> None:
    logger.info("Setting up groups .....")
    for _grp in groups:
        exists = await models.Group.get(name=_grp)
        if not exists:
            schema = schemas.GroupCreate(name=_grp, keyword=_grp)
            await models.Group.create(schema)


async def create_permissions() -> None:
    logger.info("Setting up permissions .....")
    for _perm in get_action_targets():
        permission = await models.Permission.get(
            action__exact=_perm[0], target__exact=_perm[1]
        )
        if not permission:
            schema = schemas.PermissionCreate(action=_perm[0], target=_perm[1])
            await models.Permission.create(schema)


async def set_default_group_permissions() -> None:
    logger.info("Setting up default group permissions .....")
    for action, objects in permissions.items():
        for obj, roles in objects.items():
            permission = await models.Permission.get(
                action__exact=action, target__exact=obj
            )
            for role in roles:
                group: models.Group = await models.Group.get(name=role)
                if permission.uid not in [p.uid for p in group.permissions]:
                    group.permissions.append(permission)
                    group.pages = "DASHBOARD"
                    if group.name == FGroup.ADMINISTRATOR:
                        group.pages += ", ADMINISTRATION"
                    await group.save()


async def setup_default_permissions() -> None:
    await create_groups()
    await create_permissions()
    await set_default_group_permissions()
