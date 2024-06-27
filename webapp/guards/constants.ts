const objects = {
    PATIENT: 'PATIENT',
    CLIENT: 'CLIENT',
    SAMPLE: 'SAMPLE',
    RESULT: 'RESULT',
    WORKSHEET: 'WORKSHEET',
    PRODUCT: 'PRODUCT',
    SHIPMENT: "SHIPMENT"
};

// Actions that can be effected on objects
const actions = {
    // GENERIC
    CREATE: 'CREATE',
    READ: 'READ',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    // SPECIAL
    SUBMIT: 'SUBMIT',
    CANCEL: 'CANCEL',
    VERIFY: 'VERIFY',
    // INVENTORY
    ISSUE: 'ISSUE',
    ORDER: 'ORDER',
};

export { actions, objects };
