from typing import Optional
from felicity.apps.user import models
from felicity.apps.user import schemas


class FGroup:
    ADMINISTRATOR = 'ADMINISTRATOR'
    LAB_MANAGER = 'LAB_MANAGER'
    SCIENTIST = 'SCIENTIST'
    TECHNOLOGIST = 'TECHNOLOGIST'
    LAB_HAND = "LAB_HAND"
    GUEST = "GUEST"


class FObject:
    PATIENT = 'PATIENT'
    SAMPLE = 'SAMPLE'
    ANALYTE = 'ANALYTE'
    WORKSHEET = 'WORKSHEET'
    BOARD = "BOARD"
    DOCUMENT = "DOCUMENT"


class FAction:
    CREATE = 'CREATE'
    READ = 'READ'
    UPDATE = 'UPDATE'
    DELETE = 'DELETE'
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
        fo.PATIENT: [fg.LAB_HAND],
        fo.SAMPLE: [fg.LAB_HAND],
        fo.WORKSHEET: [fg.SCIENTIST, fg.TECHNOLOGIST],
    },
    fa.READ: {
        fo.PATIENT: [fg.ADMINISTRATOR, fg.LAB_MANAGER, fg.SCIENTIST, fg.TECHNOLOGIST, fg.LAB_HAND, fg.GUEST],
        fo.SAMPLE: [fg.ADMINISTRATOR, fg.LAB_MANAGER, fg.SCIENTIST, fg.TECHNOLOGIST, fg.LAB_HAND, fg.GUEST],
        fo.WORKSHEET: [fg.ADMINISTRATOR, fg.LAB_MANAGER, fg.SCIENTIST, fg.TECHNOLOGIST, fg.GUEST],
    },
    fa.UPDATE: {
        fo.PATIENT: [fg.LAB_HAND],
        fo.SAMPLE: [fg.LAB_HAND],
        fo.WORKSHEET: [fg.SCIENTIST, fg.TECHNOLOGIST],
    },
    fa.SUBMIT: {
        fo.SAMPLE: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.WORKSHEET: [fg.SCIENTIST, fg.TECHNOLOGIST],
    },
    fa.VERIFY: {
        fo.SAMPLE: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.WORKSHEET: [fg.SCIENTIST, fg.TECHNOLOGIST],
    },
    fa.CANCEL: {
        fo.SAMPLE: [fg.SCIENTIST, fg.TECHNOLOGIST, fg.LAB_HAND],
    },
    fa.RETEST: {
        fo.SAMPLE: [fg.SCIENTIST, fg.TECHNOLOGIST],
        fo.WORKSHEET: [fg.SCIENTIST, fg.TECHNOLOGIST],
    },
    fa.INVALIDATE: {
        fo.SAMPLE: [fg.SCIENTIST, fg.TECHNOLOGIST],
    },
    fa.DELETE: {
        fo.BOARD: [fg.ADMINISTRATOR, fg.LAB_MANAGER, fg.SCIENTIST, fg.TECHNOLOGIST, fg.LAB_HAND],
        fo.DOCUMENT: [fg.ADMINISTRATOR, fg.LAB_MANAGER, fg.SCIENTIST, fg.TECHNOLOGIST, fg.LAB_HAND],
    },
}


def get_action_targets():  # e.g ('verify', 'worksheet'),
    final = []
    for a_key, action in permissions.items():
        for o_key, obj in action.items():
            final.append((a_key, o_key))
    return final


async def create_groups() -> None:
    for _grp in groups:
        exists = await models.Group.get(name=_grp)
        if not exists:
            schema = schemas.GroupCreate(name=_grp)
            await models.Group.create(schema)


async def create_permissions() -> None:
    for _perm in get_action_targets():
        exists = await models.Permission.get(action__exact=_perm[0], target__exact=_perm[1])
        if not exists:
            schema = schemas.PermissionCreate(action=_perm[0], target=_perm[1])
            await models.Permission.create(schema)
