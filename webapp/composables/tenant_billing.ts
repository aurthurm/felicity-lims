import axios from '@/composables/axios';

export interface TenantSubscription {
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

export interface TenantBillingInvoice {
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

export interface TenantPaymentAttempt {
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
}

export interface TenantPaymentProof {
    uid: string;
    tenant_slug: string;
    invoice_uid: string;
    status: 'submitted' | 'reviewed' | 'rejected';
    amount?: string | null;
    currency?: string | null;
    payment_method?: string | null;
    payment_reference?: string | null;
    note?: string | null;
    original_filename: string;
    content_type: string;
    size_bytes: number;
    bucket_name: string;
    object_name: string;
    metadata: Record<string, unknown>;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface TenantEntitlements {
    tenant_slug: string;
    plan_code: string;
    limits: Array<{
        metric_key: 'tenant_users' | 'tenant_labs' | 'api_requests_user' | 'api_requests_lab' | 'api_requests_tenant';
        limit_value: number;
        window: 'instant' | 'minute' | 'hour' | 'day' | 'month';
        enforcement_mode: 'hard_block';
    }>;
    features: Array<{
        feature_key: 'billing' | 'inventory' | 'storage' | 'grind' | 'document' | 'shipment' | 'worksheet' | 'reflex';
        enabled: boolean;
        included_units: string;
        unit_price: string;
    }>;
}

const BASE = 'billing/self-service';

export function useTenantBillingApi() {
    const getSubscription = async <T = TenantSubscription | null>(): Promise<T> => {
        const { data } = await axios.get<T>(`${BASE}/subscription`);
        return data;
    };

    const getOverview = async <T = TenantBillingOverview>(): Promise<T> => {
        const { data } = await axios.get<T>(`${BASE}/overview`);
        return data;
    };

    const getEntitlements = async <T = TenantEntitlements>(): Promise<T> => {
        const { data } = await axios.get<T>(`${BASE}/entitlements`);
        return data;
    };

    const listInvoices = async <T = TenantBillingInvoice[]>(): Promise<T> => {
        const { data } = await axios.get<T>(`${BASE}/invoices`);
        return data;
    };

    const listPaymentAttempts = async <T = TenantPaymentAttempt[]>(limit = 20): Promise<T> => {
        const { data } = await axios.get<T>(`${BASE}/payment-attempts`, {
            params: { limit },
        });
        return data;
    };

    const listPaymentProofs = async <T = TenantPaymentProof[]>(invoiceUid: string): Promise<T> => {
        const { data } = await axios.get<T>(`${BASE}/invoices/${invoiceUid}/payment-proofs`);
        return data;
    };

    const uploadPaymentProof = async (
        invoiceUid: string,
        payload: {
            file: File;
            amount?: string | number;
            currency?: string;
            payment_method?: string;
            payment_reference?: string;
            note?: string;
        }
    ): Promise<{ proof: TenantPaymentProof }> => {
        const form = new FormData();
        form.append('file', payload.file);
        if (payload.amount !== undefined && payload.amount !== null) form.append('amount', String(payload.amount));
        if (payload.currency) form.append('currency', payload.currency);
        if (payload.payment_method) form.append('payment_method', payload.payment_method);
        if (payload.payment_reference) form.append('payment_reference', payload.payment_reference);
        if (payload.note) form.append('note', payload.note);

        const { data } = await axios.post<{ proof: TenantPaymentProof }>(
            `${BASE}/invoices/${invoiceUid}/payment-proofs`,
            form,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return data;
    };

    const downloadPaymentProof = async (proofUid: string): Promise<Blob> => {
        const { data } = await axios.get(`${BASE}/payment-proofs/${proofUid}/download`, {
            responseType: 'blob',
        });
        return data as Blob;
    };

    return {
        getSubscription,
        getOverview,
        getEntitlements,
        listInvoices,
        listPaymentAttempts,
        listPaymentProofs,
        uploadPaymentProof,
        downloadPaymentProof,
    };
}
