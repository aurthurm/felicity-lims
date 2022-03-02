import canAccessPage from "./pages";
import hasRights from "./actions";
import { actions, objects, roles } from "./constants";
import { pages } from "./../router/constants";

export { canAccessPage, hasRights,  actions, objects, roles, pages};

// Permisions Method 2
// Add Role
// Choose AccessiblePages 
//    for each page: add object actions