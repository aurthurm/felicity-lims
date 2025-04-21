import { useAuthStore } from '@/stores/auth';
import { GroupType } from '@/types/gql';

function canAccessPage(pageName: string) {
    const authStore = useAuthStore();

    const groups = authStore.auth?.user?.groups;

    if (!groups || groups?.length == 0) return false;

    const group = groups![0] as GroupType;
    if (group?.pages) {
        return group?.pages?.toLowerCase()?.includes(pageName?.toLowerCase());
    }

    return false;
}

export default canAccessPage;
