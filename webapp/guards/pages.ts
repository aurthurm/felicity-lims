import { useAuthStore } from '@/stores/auth';
import { IGroup } from '@/models/auth';

function canAccessPage(pageName: string) {
    const authStore = useAuthStore();

    const groups = authStore.auth?.user?.groups;

    if (!groups || groups?.length == 0) return false;

    const group = groups![0] as IGroup;
    if (group?.pages) {
        return group?.pages?.toLowerCase()?.includes(pageName?.toLowerCase());
    }

    return false;
}

export default canAccessPage;
