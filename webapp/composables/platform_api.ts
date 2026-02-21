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

export interface TenantBillingProfile {
    tenant_slug: string;
    customer_uid: string;
    legal_name?: string | null;
    billing_email?: string | null;
    currency: string;
    country?: string | null;
    provider_preference: 'stripe' | 'paystack';
    auto_finalize_invoices: boolean;
    auto_send_invoices: boolean;
    payment_terms_days: number;
    metadata: Record<string, unknown>;
}

export interface TenantBillingProfileUpdate {
    legal_name?: string | null;
    billing_email?: string | null;
    currency?: string | null;
    country?: string | null;
    provider_preference?: 'stripe' | 'paystack' | null;
    auto_finalize_invoices?: boolean | null;
    auto_send_invoices?: boolean | null;
    payment_terms_days?: number | null;
    metadata?: Record<string, unknown> | null;
}

export interface TenantBillingSubscription {
    uid: string;
    tenant_slug: string;
    plan_code: string;
    status: 'trialing' | 'active' | 'past_due' | 'paused' | 'canceled';
    base_amount: string;
    usage_overage_amount: string;
    mrr_snapshot: string;
    next_billing_date?: string | null;
    starts_at?: string | null;
    ends_at?: string | null;
    paused_at?: string | null;
    canceled_at?: string | null;
    metadata: Record<string, unknown>;
}

export interface TenantBillingSubscriptionUpdate {
    plan_code: string;
    status: 'trialing' | 'active' | 'past_due' | 'paused' | 'canceled';
    base_amount: string | number;
    usage_overage_amount: string | number;
    mrr_snapshot: string | number;
    next_billing_date?: string | null;
    starts_at?: string | null;
    ends_at?: string | null;
    paused_at?: string | null;
    canceled_at?: string | null;
    metadata?: Record<string, unknown>;
}

export interface BillingInvoiceLineInput {
    description: string;
    quantity: string | number;
    unit_price: string | number;
    amount: string | number;
    metadata?: Record<string, unknown>;
}

export interface BillingInvoiceCreateInput {
    currency: string;
    due_date?: string | null;
    tax_amount?: string | number;
    metadata?: Record<string, unknown>;
    lines: BillingInvoiceLineInput[];
}

export interface BillingInvoice {
    uid: string;
    tenant_slug: string;
    invoice_number: string;
    status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
    currency: string;
    subtotal: string;
    tax_amount: string;
    total_amount: string;
    amount_due: string;
    amount_paid: string;
    due_date?: string | null;
    issued_at?: string | null;
    finalized_at?: string | null;
    sent_at?: string | null;
    paid_at?: string | null;
    metadata: Record<string, unknown>;
}

export interface BillingProviderHealthResponse {
    providers: Array<{
        provider: 'stripe' | 'paystack';
        healthy: boolean;
        details: string;
    }>;
}

export interface BillingWebhookResult {
    provider: 'stripe' | 'paystack';
    event_id: string;
    accepted: boolean;
    duplicate?: boolean;
    detail: string;
}

export interface TenantBillingOverview {
    tenant_slug: string;
    plan_code?: string | null;
    subscription_status?: 'trialing' | 'active' | 'past_due' | 'paused' | 'canceled' | null;
    mrr_snapshot: string;
    aging: {
        current: string;
        bucket_30: string;
        bucket_60: string;
        bucket_90_plus: string;
    };
}

export interface BillingPaymentAttempt {
    uid: string;
    invoice_uid: string;
    tenant_slug: string;
    provider: 'stripe' | 'paystack';
    status: 'pending' | 'succeeded' | 'failed' | 'action_required';
    amount: string;
    currency: string;
    provider_reference?: string | null;
    failure_reason?: string | null;
    metadata: Record<string, unknown>;
    created_at?: string | null;
    updated_at?: string | null;
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

    const getTenantBillingProfile = async <T = TenantBillingProfile>(slug: string): Promise<T> => {
        const { data } = await platformAxios.get<T>(`/billing/tenants/${slug}/profile`);
        return data;
    };

    const updateTenantBillingProfile = async <T = TenantBillingProfile>(
        slug: string,
        payload: TenantBillingProfileUpdate
    ): Promise<T> => {
        const { data } = await platformAxios.put<T>(`/billing/tenants/${slug}/profile`, payload);
        return data;
    };

    const getTenantBillingSubscription = async <T = TenantBillingSubscription | null>(slug: string): Promise<T> => {
        const { data } = await platformAxios.get<T>(`/billing/tenants/${slug}/subscription`);
        return data;
    };

    const updateTenantBillingSubscription = async <T = TenantBillingSubscription>(
        slug: string,
        payload: TenantBillingSubscriptionUpdate
    ): Promise<T> => {
        const { data } = await platformAxios.put<T>(`/billing/tenants/${slug}/subscription`, payload);
        return data;
    };

    const createTenantBillingInvoice = async <T = BillingInvoice>(
        slug: string,
        payload: BillingInvoiceCreateInput
    ): Promise<T> => {
        const { data } = await platformAxios.post<T>(`/billing/tenants/${slug}/invoices`, payload);
        return data;
    };

    const listTenantBillingInvoices = async <T = BillingInvoice[]>(slug: string): Promise<T> => {
        const { data } = await platformAxios.get<T>(`/billing/tenants/${slug}/invoices`);
        return data;
    };

    const getTenantBillingInvoice = async <T = BillingInvoice>(slug: string, invoiceUid: string): Promise<T> => {
        const { data } = await platformAxios.get<T>(`/billing/tenants/${slug}/invoices/${invoiceUid}`);
        return data;
    };

    const finalizeTenantBillingInvoice = async <T = BillingInvoice>(slug: string, invoiceUid: string): Promise<T> => {
        const { data } = await platformAxios.post<T>(`/billing/tenants/${slug}/invoices/${invoiceUid}/finalize`);
        return data;
    };

    const sendTenantBillingInvoice = async <T = BillingInvoice>(slug: string, invoiceUid: string): Promise<T> => {
        const { data } = await platformAxios.post<T>(`/billing/tenants/${slug}/invoices/${invoiceUid}/send`);
        return data;
    };

    const markTenantBillingInvoicePaid = async <T = BillingInvoice>(
        slug: string,
        invoiceUid: string,
        payload?: { amount?: string | number; payment_reference?: string; note?: string }
    ): Promise<T> => {
        const { data } = await platformAxios.post<T>(
            `/billing/tenants/${slug}/invoices/${invoiceUid}/mark-paid`,
            payload ?? {}
        );
        return data;
    };

    const getBillingProvidersHealth = async <T = BillingProviderHealthResponse>(): Promise<T> => {
        const { data } = await platformAxios.get<T>('/billing/providers/health');
        return data;
    };

    const getTenantBillingOverview = async <T = TenantBillingOverview>(slug: string): Promise<T> => {
        const { data } = await platformAxios.get<T>(`/billing/tenants/${slug}/overview`);
        return data;
    };

    const listTenantBillingPaymentAttempts = async <T = BillingPaymentAttempt[]>(
        slug: string,
        limit = 20
    ): Promise<T> => {
        const { data } = await platformAxios.get<T>(`/billing/tenants/${slug}/payment-attempts`, {
            params: { limit },
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
        getTenantBillingProfile,
        updateTenantBillingProfile,
        getTenantBillingSubscription,
        updateTenantBillingSubscription,
        createTenantBillingInvoice,
        listTenantBillingInvoices,
        getTenantBillingInvoice,
        finalizeTenantBillingInvoice,
        sendTenantBillingInvoice,
        markTenantBillingInvoicePaid,
        getBillingProvidersHealth,
        getTenantBillingOverview,
        listTenantBillingPaymentAttempts,
    };
}

export { PLATFORM_STORAGE_AUTH_KEY, getPlatformAccessToken };
