import axios, { AxiosInstance } from 'axios';
import { PLATFORM_API_BASE_URL, PLATFORM_STORAGE_AUTH_KEY } from '@/conf';

export interface PlatformLoginPayload {
    identifier: string;
    password: string;
}

export interface PlatformAuthResponse {
    access_token: string;
    token_type?: string;
    refresh_token?: string;
    user?: Record<string, unknown>;
}

export interface PlatformAuthStorage {
    token: string;
    refreshToken: string;
    tokenType: string;
    me: Record<string, unknown> | null;
}

export interface ProvisionTenantPayload {
    name: string;
    slug: string;
    admin_email?: string;
    initial_lab_name?: string;
    primary_industry?: string;
    enabled_modules?: string[];
}

export interface AddLabPayload {
    name: string;
    setup_name?: string;
    code?: string;
}

export interface Tenant {
    uid?: string;
    id?: string;
    slug?: string;
    name?: string;
    schema_name?: string;
    status?: string;
    active?: boolean;
    primary_industry?: string;
    enabled_modules?: string[];
}

const getPlatformAccessToken = (): string | undefined => {
    try {
        const raw = localStorage.getItem(PLATFORM_STORAGE_AUTH_KEY);
        if (!raw) {
            return undefined;
        }

        const parsed = JSON.parse(raw) as Partial<PlatformAuthStorage>;
        return parsed.token;
    } catch {
        return undefined;
    }
};

const platformAxios: AxiosInstance = axios.create({
    baseURL: PLATFORM_API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

platformAxios.interceptors.request.use(config => {
    const token = getPlatformAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default function usePlatformApi() {
    const login = async (payload: PlatformLoginPayload): Promise<PlatformAuthResponse> => {
        const { data } = await platformAxios.post<PlatformAuthResponse>('/auth/login', payload);
        return data;
    };

    const me = async <T = Record<string, unknown>>(): Promise<T> => {
        const { data } = await platformAxios.get<T>('/auth/me');
        return data;
    };

    const listTenants = async <T = Tenant[]>(status?: string): Promise<T> => {
        const { data } = await platformAxios.get<T>('/tenants', {
            params: status ? { status } : undefined,
        });
        return data;
    };

    const provisionTenant = async <T = Record<string, unknown>>(payload: ProvisionTenantPayload): Promise<T> => {
        const { data } = await platformAxios.post<T>('/tenants', payload);
        return data;
    };

    const migrateTenant = async <T = Record<string, unknown>>(slug: string, module?: string): Promise<T> => {
        const { data } = await platformAxios.post<T>(`/tenants/${slug}/migrate`, undefined, {
            params: module ? { module } : undefined,
        });
        return data;
    };

    const activateTenant = async <T = Record<string, unknown>>(slug: string, force = false): Promise<T> => {
        const { data } = await platformAxios.post<T>(`/tenants/${slug}/activate`, undefined, {
            params: { force },
        });
        return data;
    };

    const addLab = async <T = Record<string, unknown>>(slug: string, payload: AddLabPayload): Promise<T> => {
        const { data } = await platformAxios.post<T>(`/tenants/${slug}/laboratories`, {
            name: payload.name,
            setup_name: payload.setup_name ?? payload.code ?? 'beak',
        });
        return data;
    };

    const listModules = async <T = Record<string, unknown>>(slug: string): Promise<T> => {
        const { data } = await platformAxios.get<T>(`/tenants/${slug}/modules`);
        return data;
    };

    const setModuleEnabled = async <T = Record<string, unknown>>(
        slug: string,
        moduleId: string,
        enabled: boolean
    ): Promise<T> => {
        const action = enabled ? 'enable' : 'disable';
        const { data } = await platformAxios.post<T>(`/tenants/${slug}/modules/${moduleId}:${action}`);
        return data;
    };

    const cleanupFailed = async <T = Record<string, unknown>>(
        slug?: string,
        dropSchema = true
    ): Promise<T> => {
        const { data } = await platformAxios.delete<T>('/tenants/failed', {
            params: {
                ...(slug ? { slug } : {}),
                drop_schema: dropSchema,
            },
        });
        return data;
    };

    return {
        client: platformAxios,
        login,
        me,
        listTenants,
        provisionTenant,
        migrateTenant,
        activateTenant,
        addLab,
        listModules,
        setModuleEnabled,
        cleanupFailed,
    };
}

export { PLATFORM_STORAGE_AUTH_KEY, getPlatformAccessToken };
