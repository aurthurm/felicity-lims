import canAccessPage from "./pages";
import hasRights from "./actions";
import { actions, objects, roles } from "./constants";
import { pages } from "./../router/constants";

function hasAccess(userRole: string, objectName: string, action: string) {
    return canAccessPage(userRole, action) && hasRights(userRole, objectName, action);
}

export default hasAccess
export { canAccessPage, hasRights,  actions, objects, roles, pages };
