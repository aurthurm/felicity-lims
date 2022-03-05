
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


export { actions, objects };
  