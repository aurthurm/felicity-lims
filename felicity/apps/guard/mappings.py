from .definitions import FAction, FObject, FGroup

DEFAULT_PERMISSION_MAPPINGS = {
    FAction.CREATE: {
        FObject.CLIENT: [FGroup.ADMINISTRATOR],
        FObject.PATIENT: [FGroup.LAB_HAND],
        FObject.SAMPLE: [FGroup.LAB_HAND],
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
    FAction.READ: {
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
        ]
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
        ]
    },
    FAction.VERIFY: {
        FObject.SAMPLE: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.RESULT: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.WORKSHEET: [FGroup.SCIENTIST, FGroup.TECHNOLOGIST],
        FObject.DOCUMENT: [
            FGroup.ADMINISTRATOR,
            FGroup.STORES,
            FGroup.LAB_HAND,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
        ]
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
    FAction.ORDER: {
        FObject.PRODUCT: [
            FGroup.ADMINISTRATOR,
            FGroup.LAB_MANAGER,
            FGroup.SCIENTIST,
            FGroup.TECHNOLOGIST,
            FGroup.STORES,
        ],
    },
}
