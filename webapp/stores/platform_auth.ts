import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import usePlatformApi, {
    PLATFORM_STORAGE_AUTH_KEY,
    PlatformAuthResponse,
    PlatformAuthStorage,
} from '@/composables/platform_api';

const initialState: PlatformAuthStorage = {
    token: '',
    refreshToken: '',
    tokenType: 'Bearer',
    me: null,
};

export const usePlatformAuthStore = defineStore('platformAuth', () => {
    const api = usePlatformApi();

    const auth = ref<PlatformAuthStorage>({ ...initialState });
    const loading = ref(false);
    const error = ref<string | null>(null);

    const isAuthenticated = computed(() => Boolean(auth.value.token));

    const hydrate = () => {
        try {
            const raw = localStorage.getItem(PLATFORM_STORAGE_AUTH_KEY);
            if (!raw) {
                return;
            }

            const parsed = JSON.parse(raw) as Partial<PlatformAuthStorage>;
            auth.value = {
                ...initialState,
                ...parsed,
            };
        } catch {
            localStorage.removeItem(PLATFORM_STORAGE_AUTH_KEY);
        }
    };

    const persist = () => {
        localStorage.setItem(PLATFORM_STORAGE_AUTH_KEY, JSON.stringify(auth.value));
    };

    const clear = () => {
        auth.value = { ...initialState };
        error.value = null;
        localStorage.removeItem(PLATFORM_STORAGE_AUTH_KEY);
    };

    const applyAuthResponse = (payload: PlatformAuthResponse) => {
        auth.value.token = payload.access_token;
        auth.value.refreshToken = payload.refresh_token ?? '';
        auth.value.tokenType = payload.token_type ?? 'Bearer';
        auth.value.me = payload.user ?? auth.value.me;
        persist();
    };

    const login = async (identifier: string, password: string) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.login({ identifier, password });
            applyAuthResponse(response);
            await fetchMe();
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : 'Login failed';
            clear();
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const fetchMe = async () => {
        if (!auth.value.token) {
            auth.value.me = null;
            return null;
        }

        loading.value = true;
        error.value = null;
        try {
            const mePayload = await api.me<Record<string, unknown>>();
            auth.value.me = mePayload;
            persist();
            return mePayload;
        } catch (err: unknown) {
            error.value = err instanceof Error ? err.message : 'Failed to load profile';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    hydrate();

    return {
        auth,
        loading,
        error,
        isAuthenticated,
        hydrate,
        persist,
        clear,
        login,
        fetchMe,
    };
});
