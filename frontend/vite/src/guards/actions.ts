import { authFromStorage } from "../auth";
import { IGroup } from "../models/auth";

function hasRights(action: string, objectName: string) {

    const auth = authFromStorage();
    const groups = auth?.user?.groups
    const group = groups![0] as IGroup

    if (group) {
      if(group.permissions) {
        return group.permissions?.some(perm => perm.action == action && perm.target == objectName);
      }
      return false
    }

  return false;
}

export default hasRights;
