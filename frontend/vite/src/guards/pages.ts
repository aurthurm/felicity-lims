import { authFromStorage } from "../auth";
import { IGroup } from "../models/auth";

function canAccessPage(pageName: string) {
    const auth = authFromStorage();
    const groups = auth?.user?.groups
    const group = groups![0] as IGroup;

    if (group) {
        return group?.pages?.includes(pageName);
    }

    return false;
}

export default canAccessPage;
