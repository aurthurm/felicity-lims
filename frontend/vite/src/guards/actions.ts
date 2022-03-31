import { authFromStorage2 } from "../auth";
import { IGroup } from "../models/auth";

function hasRights(action: string, objectName: string) {

    const auth = authFromStorage2();
    const groups = auth?.user?.groups
    
    if(!groups || groups?.length == 0 ) return false

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
