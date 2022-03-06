import { authFromStorage } from "../auth";
import { IGroup } from "../models/auth";

async function canAccessPage(pageName: string) {
    const auth = await authFromStorage();
    const groups = auth?.user?.groups
    
    if(!groups || groups?.length == 0 ) return false

    const group = groups![0] as IGroup;

    if (group) {
        return group?.pages?.includes(pageName);
    }

    return false;
}

export default canAccessPage;
