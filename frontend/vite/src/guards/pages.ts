import { roles } from "./constants";
import { pages } from "./../router/constants";

const mappings = new Map();

mappings.set(
    pages.ADMINISTRATION, 
    [roles.ADMINISTRATOR]
);

mappings.set(
    pages.DASHBOARD, 
    [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.LAB_HAND, roles.GUEST]
);

mappings.set(
    pages.PATIENTS, 
    [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.LAB_HAND, roles.GUEST]
);

mappings.set(
    pages.PATIENTS_COMPACT, 
    [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.LAB_HAND, roles.GUEST]
);

mappings.set(
    pages.CLIENTS, 
    [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.LAB_HAND, roles.GUEST]
);

mappings.set(
    pages.SAMPLES, 
    [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.LAB_HAND, roles.GUEST]
);

mappings.set(
    pages.QC_SAMPLES, 
    [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.GUEST]
);

mappings.set(
    pages.WORKSHEETS, 
    [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.GUEST]
);

mappings.set(
    pages.KANBAN_BOARD, 
    [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.GUEST]
);

mappings.set(
    pages.MARKDOWN_DOCUMENTS, 
    [roles.ADMINISTRATOR, roles.LAB_MANAGER, roles.SCIENTIST, roles.TECHNOLOGIST, roles.LAB_HAND, roles.GUEST]
);


function canAccessPage(userRole: string, pageName: string) {
  if (!userRole) {
    return false;
  }

  if (mappings.has(pageName)) {
    return mappings.get(pageName).includes(userRole);
  }

  return false;
}

export default canAccessPage;
