from .definitions import FAction, FObject, FGroup

""" Object Actions:
WORKSHEET: CREATE, READ, UPDATE, SUBMIT, APPROVE, RETEST
STORAGE: CREATE, READ, UPDATE
CLIENT: CREATE, READ, UPDATE
PATIENT: CREATE, READ, UPDATE
SAMPLE: CREATE, READ, UPDATE, SUBMIT, APPROVE, CANCEL, RETEST, INVALIDATE, STORE, PUBLISH, PRINT
RESULT: READ, UPDATE, SUBMIT, APPROVE, CANCEL, RETEST
PRODUCT: CREATE, READ, UPDATE, ISSUE
PRODUCT_ORDER: CREATE, READ, ISSUE, APPROVE
SHIPMENT: CREATE, READ, UPDATE, CANCEL
SCHEMES: CREATE, READ, UPDATE
DOCUMENT: CREATE, READ, UPDATE, SUBMIT, APPROVE, ISSUE
ANALYTICS: READ
NOTICE: CREATE, READ, UPDATE, DELETE
BILLING: UPDATE, READ
"""

DEFAULT_PERMISSION_MAPPINGS = {
    FAction.CREATE: {
        FObject.CLIENT: [FGroup.ADMINISTRATOR],
        FObject.PATIENT: [FGroup.LAB_HAND],
        FObject.SAMPLE: [FGroup.LAB_HAND],
        FObject.WORKSHEET: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.SHIPMENT: [FGroup.LAB_HAND, FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.STORAGE: [
            FGroup.ADMINISTRATOR,
            FGroup.STORES,
            FGroup.LAB_HAND,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
        ],
        FObject.SCHEMES: [
            FGroup.ADMINISTRATOR,
            FGroup.STORES,
            FGroup.LAB_HAND,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
        ],
        FObject.DOCUMENT: [
            FGroup.ADMINISTRATOR,
            FGroup.STORES,
            FGroup.LAB_HAND,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
        ],
        FObject.NOTICE: [
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.STORES,
        ],
        FObject.PRODUCT: [FGroup.STORES],
        FObject.PRODUCT_ORDER: [
            FGroup.ADMINISTRATOR,
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.STORES,
        ],
    },
    FAction.READ: {
        FObject.BILLING: [FGroup.ACCOUNTING],
        FObject.ANALYTICS: [
            FGroup.ADMINISTRATOR,
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.LAB_HAND,
            FGroup.GUEST,
        ],
        FObject.CLIENT: [
            FGroup.ADMINISTRATOR,
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.LAB_HAND,
            FGroup.GUEST,
        ],
        FObject.PATIENT: [
            FGroup.ADMINISTRATOR,
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.LAB_HAND,
            FGroup.GUEST,
        ],
        FObject.SAMPLE: [
            FGroup.ADMINISTRATOR,
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.LAB_HAND,
            FGroup.GUEST,
        ],
        FObject.RESULT: [
            FGroup.ADMINISTRATOR,
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.GUEST,
        ],
        FObject.WORKSHEET: [
            FGroup.ADMINISTRATOR,
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.GUEST,
        ],
        FObject.PRODUCT: [
            FGroup.ADMINISTRATOR,
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.GUEST,
            FGroup.STORES,
        ],
        FObject.PRODUCT_ORDER: [
            FGroup.ADMINISTRATOR,
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.STORES,
        ],
        FObject.SHIPMENT: [FGroup.LAB_HAND, FGroup.SCIENTIST, FGroup.TECHNOLOGIST, FGroup.GUEST],
        FObject.STORAGE: [
            FGroup.ADMINISTRATOR,
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.GUEST,
            FGroup.STORES,
        ],
        FObject.SCHEMES: [
            FGroup.ADMINISTRATOR,
            FGroup.STORES,
            FGroup.LAB_HAND,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
        ],
        FObject.DOCUMENT: [
            FGroup.ADMINISTRATOR,
            FGroup.STORES,
            FGroup.LAB_HAND,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
        ],
        FObject.NOTICE: [
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.STORES,
        ],
    },
    FAction.UPDATE: {
        FObject.CLIENT: [FGroup.ADMINISTRATOR],
        FObject.PATIENT: [FGroup.LAB_HAND],
        FObject.SAMPLE: [FGroup.LAB_HAND],
        FObject.RESULT: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.WORKSHEET: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.PRODUCT: [FGroup.STORES],
        FObject.SHIPMENT: [FGroup.LAB_HAND, FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.STORAGE: [
            FGroup.ADMINISTRATOR,
            FGroup.STORES,
            FGroup.LAB_HAND,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
        ],
        FObject.NOTICE: [
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.STORES,
        ],
        FObject.BILLING: [FGroup.ACCOUNTING],
        FObject.SCHEMES: [
            FGroup.ADMINISTRATOR,
            FGroup.STORES,
            FGroup.LAB_HAND,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
        ],
        FObject.DOCUMENT: [
            FGroup.ADMINISTRATOR,
            FGroup.STORES,
            FGroup.LAB_HAND,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
        ]
    },
    FAction.SUBMIT: {
        FObject.SAMPLE: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.RESULT: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.WORKSHEET: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.DOCUMENT: [
            FGroup.ADMINISTRATOR,
            FGroup.STORES,
            FGroup.LAB_HAND,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
        ],
        FObject.PRODUCT_ORDER: [
            FGroup.ADMINISTRATOR,
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.STORES,
        ],
    },
    FAction.APPROVE: {
        FObject.SAMPLE: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.RESULT: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.WORKSHEET: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.DOCUMENT: [
            FGroup.ADMINISTRATOR,
            FGroup.STORES,
            FGroup.LAB_HAND,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
        ],
        FObject.PRODUCT_ORDER: [
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.STORES,
        ],
    },
    FAction.CANCEL: {
        FObject.SAMPLE: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST, FGroup.LAB_HAND],
        FObject.RESULT: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.SHIPMENT: [FGroup.LAB_HAND, FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
    },
    FAction.RETEST: {
        FObject.SAMPLE: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.RESULT: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.WORKSHEET: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
    },
    FAction.INVALIDATE: {FObject.SAMPLE: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST]},
    FAction.ISSUE: {
        FObject.PRODUCT: [FGroup.STORES],
        FObject.DOCUMENT: [
            FGroup.ADMINISTRATOR,
            FGroup.STORES,
            FGroup.LAB_HAND,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
        ]
    },
    FAction.ASSIGN: {FObject.SAMPLE: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST]},
    FAction.PRINT: {FObject.SAMPLE: [FGroup.LAB_HAND]},
    FAction.PUBLISH: {FObject.SAMPLE: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST]},
    FAction.STORE: {
        FObject.SAMPLE: [
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST
        ],
    },
    FAction.DELETE: {
        FObject.NOTICE: [
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.STORES,
        ],
    }
}
