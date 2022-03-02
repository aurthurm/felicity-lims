import { objects , actions, roles } from "./constants";

const mappings = new Map();

mappings.set(
  actions.CREATE,
  new Map([
    [objects.SAMPLE, [roles.LAB_HAND]],
    [objects.PATIENT, [roles.LAB_HAND]],
    [objects.WORKSHEET, [roles.SCIENTIST, roles.TECHNOLOGIST]],
  ])
);

mappings.set(
  actions.READ,
  new Map([
    [objects.SAMPLE, [roles.ADMINISTRATOR, roles.LAB_HAND, roles.SCIENTIST, roles.TECHNOLOGIST, roles.LAB_HAND, roles.GUEST]],
    [objects.PATIENT, [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.LAB_HAND, roles.GUEST]],
    [objects.WORKSHEET, [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.GUEST]],
  ])
);

mappings.set(
  actions.UPDATE,
  new Map([
    [objects.SAMPLE, [roles.LAB_HAND]],
    [objects.PATIENT, [roles.LAB_HAND]],
    [objects.WORKSHEET, [roles.SCIENTIST, roles.TECHNOLOGIST]],
  ])
);

mappings.set(
  actions.SUBMIT,
  new Map([
    [objects.SAMPLE, [roles.SCIENTIST, roles.TECHNOLOGIST]],
    [objects.WORKSHEET, [roles.SCIENTIST, roles.TECHNOLOGIST]],
  ])
);

mappings.set(
  actions.VERIFY,
  new Map([
    [objects.SAMPLE, [roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST]],
    [objects.WORKSHEET, [roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST]],
  ])
);

mappings.set(
  actions.CANCEL,
  new Map([
    [objects.SAMPLE, [roles.SCIENTIST, roles.TECHNOLOGIST, roles.LAB_HAND]],
  ])
);

mappings.set(
  actions.DELETE,
  new Map([
    [objects.BOARD, [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.LAB_HAND]],
    [objects.DOCUMENT, [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.LAB_HAND]],
  ])
);

// add update, delete, verify, submit mappings
function hasRights(action: string, objectName: string, userRole: string = "") {
  if (userRole.length === 0){
    userRole = localStorage.getItem('fRole') as string;
  }

  if (!userRole || !objectName) {
    return false;
  }

  if (mappings.has(action)) {
    const mapping = mappings.get(action);

    if (mapping.has(objectName)) {
      return mapping.get(objectName).includes(userRole);
    }
  }

  return false;
}

export default hasRights;
