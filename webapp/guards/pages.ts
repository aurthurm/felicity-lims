import { useAuthStore } from '../stores';
import { IGroup } from '../models/auth';

async function canAccessPage(pageName: string) {
    const authStore = useAuthStore();

    const groups = authStore.auth?.user?.groups;

    if (!groups || groups?.length == 0) return false;

    const group = groups![0] as IGroup;

    if (group) {
        return group?.pages?.includes(pageName);
    }

    return false;
}

export default canAccessPage;
