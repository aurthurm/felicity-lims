
const roles = {
  ADMINISTRATOR: "ADMINISTRATOR",
  LAB_MANAGER: "LAB_MANAGER",
  SCIENTIST: "SCIENTIST",
  TECHNOLOGIST: "TECHNOLOGIST", // Associates, lab technicians
  LAB_HAND: "LAB_HAND",  // help, data entry, clerks, secretary etc
  GUEST: "GUEST", // visitor - read only e,g cdc, auditors, etx
};

const objects = {
  PATIENT: "PATIENT",
  CLIENT: "CLIENT",
  SAMPLE: "SAMPLE",
  RESULT: "RESULT",
  WORKSHEET: "WORKSHEET",
  BOARD: "BOARD",
  DOCUMENT: "DOCUMENT",
}

// Actions that can be effected on objects
const actions = {
    // GENERIC
    CREATE: "CREATE",
    READ: "READ",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
    // SPECIAL
    SUBMIT: "SUBMIT",
    CANCEL: "CANCEL",
    VERIFY: "VERIFY",
};


export { actions, roles, objects };
  