import logging

from felicity.apps.user import models, schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FGroup:  # (KEYWORD, NAME)
    ADMINISTRATOR = ("ADMINISTRATOR", "Administrator")
    LAB_MANAGER = ("LAB_MANAGER", "Laboratory Manager")
    SCIENTIST = ("SCIENTIST", "Laboratory Scientist")
    TECHNOLOGIST = ("TECHNOLOGIST", "Laboratory Technologist")
    LAB_HAND = ("LAB_HAND", "Laboratory Hand")
    GUEST = ("GUEST", "Guest")


class FObject:
    PATIENT = "PATIENT"
    SAMPLE = "SAMPLE"
    ANALYTE = "ANALYTE"
    WORKSHEET = "WORKSHEET"
    BOARD = "BOARD"
    DOCUMENT = "DOCUMENT"


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
]

# default permissions
permissions = {
    fa.CREATE: {
        fo.PATIENT: [fg.LAB_HAND[0]],
        fo.SAMPLE: [fg.LAB_HAND[0]],
        fo.WORKSHEET: [fg.SCIENTIST[0], fg.TECHNOLOGIST[0]],
    },
    fa.READ: {
        fo.PATIENT: [
            fg.ADMINISTRATOR[0],
            fg.LAB_MANAGER[0],
            fg.SCIENTIST[0],
            fg.TECHNOLOGIST[0],
            fg.LAB_HAND[0],
            fg.GUEST[0],
        ],
        fo.SAMPLE: [
            fg.ADMINISTRATOR[0],
            fg.LAB_MANAGER[0],
            fg.SCIENTIST[0],
            fg.TECHNOLOGIST[0],
            fg.LAB_HAND[0],
            fg.GUEST[0],
        ],
        fo.WORKSHEET: [
            fg.ADMINISTRATOR[0],
            fg.LAB_MANAGER[0],
            fg.SCIENTIST[0],
            fg.TECHNOLOGIST[0],
            fg.GUEST[0],
        ],
    },
    fa.UPDATE: {
        fo.PATIENT: [fg.LAB_HAND[0]],
        fo.SAMPLE: [fg.LAB_HAND[0]],
        fo.WORKSHEET: [fg.SCIENTIST[0], fg.TECHNOLOGIST[0]],
    },
    fa.SUBMIT: {
        fo.SAMPLE: [fg.SCIENTIST[0], fg.TECHNOLOGIST[0]],
        fo.WORKSHEET: [fg.SCIENTIST[0], fg.TECHNOLOGIST[0]],
    },
    fa.VERIFY: {
        fo.SAMPLE: [fg.SCIENTIST[0], fg.TECHNOLOGIST[0]],
        fo.WORKSHEET: [fg.SCIENTIST[0], fg.TECHNOLOGIST[0]],
    },
    fa.CANCEL: {fo.SAMPLE: [fg.SCIENTIST[0], fg.TECHNOLOGIST[0], fg.LAB_HAND[0]]},
    fa.RETEST: {
        fo.SAMPLE: [fg.SCIENTIST[0], fg.TECHNOLOGIST[0]],
        fo.WORKSHEET: [fg.SCIENTIST[0], fg.TECHNOLOGIST[0]],
    },
    fa.INVALIDATE: {fo.SAMPLE: [fg.SCIENTIST[0], fg.TECHNOLOGIST[0]]},
    fa.DELETE: {
        fo.BOARD: [
            fg.ADMINISTRATOR[0],
            fg.LAB_MANAGER[0],
            fg.SCIENTIST[0],
            fg.TECHNOLOGIST[0],
            fg.LAB_HAND[0],
        ],
        fo.DOCUMENT: [
            fg.ADMINISTRATOR[0],
            fg.LAB_MANAGER[0],
            fg.SCIENTIST[0],
            fg.TECHNOLOGIST[0],
            fg.LAB_HAND[0],
        ],
    },
}


def get_action_targets():  # e.g ('verify', 'worksheet'),
    final = []
    for a_key, action in permissions.items():
        for o_key, obj in action.items():
            final.append((a_key, o_key))
    return final


async def create_groups() -> None:
    logger.info(f"Setting up groups .....")
    for _grp in groups:
        exists = await models.Group.get(name=_grp[1])
        if not exists:
            schema = schemas.GroupCreate(name=_grp[1], keyword=_grp[0])
            await models.Group.create(schema)


async def create_permissions() -> None:
    logger.info(f"Setting up permissions .....")
    for _perm in get_action_targets():
        exists = await models.Permission.get(
            action__exact=_perm[0], target__exact=_perm[1]
        )
        if not exists:
            schema = schemas.PermissionCreate(action=_perm[0], target=_perm[1])
            await models.Permission.create(schema)
