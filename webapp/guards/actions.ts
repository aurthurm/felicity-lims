import { useAuthStore } from '../stores';
import { IGroup } from '../models/auth';

function hasRights(action: string, objectName: string) {
    const authStore = useAuthStore();

    const groups = authStore.auth?.user?.groups;

    if (!groups || groups?.length == 0) return false;

    const group = groups![0] as IGroup;

    if (group) {
        if (group.permissions) {
            return group.permissions?.some(perm => perm.action == action && perm.target == objectName);
        }
        return false;
    }

    return false;
}

export default hasRights;
