<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import usePlatformApi, {
    BillingPlan,
    BillingInvoice,
    BillingPaymentAttempt,
    BillingProviderHealthResponse,
    TenantEntitlements,
    Tenant,
    TenantBillingOverview,
    TenantBillingProfile,
    TenantBillingSubscription,
    TenantUsageSnapshot,
} from '@/composables/platform_api';
import { PLATFORM_LOGIN } from '@/router/platform';
import { usePlatformAuthStore } from '@/stores/platform_auth';

type TabId = 'tenants' | 'provision' | 'labs' | 'operations' | 'modules' | 'billing' | 'users' | 'cleanup';
type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

interface ModuleRow {
    key: string;
    enabled: boolean;
    source: string;
}

const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'tenants', label: 'Tenants' },
    { id: 'provision', label: 'Provision' },
    { id: 'labs', label: 'Labs' },
    { id: 'operations', label: 'Operations' },
    { id: 'modules', label: 'Modules' },
    { id: 'billing', label: 'Billing' },
    { id: 'users', label: 'Users' },
    { id: 'cleanup', label: 'Cleanup' },
];

const api = usePlatformApi();
const authStore = usePlatformAuthStore();
const router = useRouter();

const activeTab = ref<TabId>('tenants');
const tenants = ref<Tenant[]>([]);
const loadingTenants = ref(false);
const activeAction = ref<string | null>(null);

const selectedTenantSlug = ref('');
const tenantDrawerOpen = ref(false);

const migrationSlug = ref('');
const migrationModule = ref('');
const activationSlug = ref('');
const activationForce = ref(false);

const modulesTenantSlug = ref('');
const modules = ref<ModuleRow[]>([]);
const moduleKeyInput = ref('');

const cleanupSlug = ref('');

const provisionForm = ref({
    slug: '',
    name: '',
    admin_email: '',
    initial_lab_name: '',
    primary_industry: 'clinical',
    enabledModulesCsv: '',
});

const addLabForm = ref({
    tenantSlug: '',
    name: '',
    setup_name: 'beak',
});

const toasts = ref<Toast[]>([]);
let toastSequence = 0;

const userSummary = computed(() => {
    const me = authStore.auth.me;
    if (!me) {
        return 'Unavailable';
    }

    const user = [me.email, me.identifier, me.username, me.name, me.sub].find(
        value => typeof value === 'string' && value.trim().length > 0
    );
    return typeof user === 'string' ? user : 'Authenticated User';
});

const tenantCountLabel = computed(() => `${tenants.value.length} tenant${tenants.value.length === 1 ? '' : 's'}`);

const selectedTenant = computed<Tenant | null>(() => {
    if (!selectedTenantSlug.value) {
        return null;
    }
    return tenants.value.find(tenant => (tenant.slug ?? '') === selectedTenantSlug.value) ?? null;
});

const activeTenantSlug = computed(() => selectedTenant.value?.slug ?? '');

const meJson = computed(() => JSON.stringify(authStore.auth.me ?? {}, null, 2));

const billingOverviewRows = ref<TenantBillingOverview[]>([]);
const billingProviderHealth = ref<BillingProviderHealthResponse | null>(null);
const billingSelectedSlug = ref('');
const billingProfile = ref<TenantBillingProfile | null>(null);
const billingSubscription = ref<TenantBillingSubscription | null>(null);
const billingInvoices = ref<BillingInvoice[]>([]);
const billingAttempts = ref<BillingPaymentAttempt[]>([]);
const billingPlans = ref<BillingPlan[]>([]);
const billingEntitlements = ref<TenantEntitlements | null>(null);
const billingUsage = ref<TenantUsageSnapshot | null>(null);
const billingOverridesText = ref('[]');
const billingPlanCreateForm = ref({
    plan_code: '',
    name: '',
    active: true,
    currency: 'USD',
    base_amount: '0',
    limits_json: '[]',
    features_json: '[]',
});
const billingPlanUpdateForm = ref({
    plan_code: '',
    name: '',
    active: true,
    currency: 'USD',
    base_amount: '0',
    limits_json: '',
    features_json: '',
});
const billingPanelLoading = ref(false);
const billingProfileForm = ref({
    legal_name: '',
    billing_email: '',
    currency: 'USD',
    country: '',
    provider_preference: 'stripe' as 'stripe' | 'paystack',
    auto_finalize_invoices: false,
    auto_send_invoices: false,
    payment_terms_days: 30,
});
const billingSubscriptionForm = ref({
    plan_code: '',
    status: 'active' as 'trialing' | 'active' | 'past_due' | 'paused' | 'canceled',
    base_amount: '0',
    usage_overage_amount: '0',
    mrr_snapshot: '0',
    next_billing_date: '',
});
const billingInvoiceForm = ref({
    currency: 'USD',
    due_date: '',
    tax_amount: '0',
    description: '',
    quantity: '1',
    unit_price: '0',
    amount: '0',
});
const markPaidInvoiceUid = ref('');
const markPaidAmount = ref('');

const placeholderUserRows = computed(() =>
    tenants.value.map(tenant => ({
        tenant: tenant.slug ?? 'unknown',
        owner: userSummary.value,
        note: 'Owner mapping pending billing/user service integration',
    }))
);

const isBusy = computed(() => loadingTenants.value || activeAction.value !== null || authStore.loading);
const selectedBillingOverview = computed<TenantBillingOverview | null>(() => {
    if (!billingSelectedSlug.value) {
        return null;
    }
    return billingOverviewRows.value.find(row => row.tenant_slug === billingSelectedSlug.value) ?? null;
});
const tenantBillingOpenTotal = computed(() => {
    if (!selectedBillingOverview.value) {
        return '0.00';
    }
    const aging = selectedBillingOverview.value.aging;
    const total =
        Number(aging.current ?? 0) +
        Number(aging.bucket_30 ?? 0) +
        Number(aging.bucket_60 ?? 0) +
        Number(aging.bucket_90_plus ?? 0);
    return total.toFixed(2);
});

const tenantKey = (tenant: Tenant): string => {
    return String(tenant.slug ?? tenant.id ?? tenant.uid ?? tenant.schema_name ?? tenant.name ?? 'tenant');
};

const pushToast = (type: ToastType, message: string): void => {
    toastSequence += 1;
    const id = toastSequence;
    toasts.value.push({ id, type, message });
    window.setTimeout(() => {
        toasts.value = toasts.value.filter(toast => toast.id !== id);
    }, 3600);
};

const withAction = async (name: string, task: () => Promise<void>): Promise<void> => {
    activeAction.value = name;
    try {
        await task();
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Request failed';
        pushToast('error', message);
    } finally {
        activeAction.value = null;
    }
};

const loadMe = async (): Promise<void> => {
    await withAction('profile', async () => {
        await authStore.fetchMe();
    });
};

const loadTenants = async (): Promise<void> => {
    loadingTenants.value = true;
    try {
        const response = await api.listTenants<Tenant[]>();
        tenants.value = Array.isArray(response) ? response : [];
        pushToast('success', `Loaded ${tenants.value.length} tenants`);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load tenants';
        pushToast('error', message);
    } finally {
        loadingTenants.value = false;
    }
};

const openTenantDrawer = (tenant: Tenant): void => {
    const slug = tenant.slug ?? '';
    selectedTenantSlug.value = slug;
    tenantDrawerOpen.value = true;
    if (slug) {
        migrationSlug.value = slug;
        activationSlug.value = slug;
        addLabForm.value.tenantSlug = slug;
        modulesTenantSlug.value = slug;
    }
};

const closeTenantDrawer = (): void => {
    tenantDrawerOpen.value = false;
};

const submitProvisionTenant = async (): Promise<void> => {
    await withAction('provision', async () => {
        const enabledModules = provisionForm.value.enabledModulesCsv
            .split(',')
            .map(moduleId => moduleId.trim())
            .filter(Boolean);
        await api.provisionTenant({
            slug: provisionForm.value.slug,
            name: provisionForm.value.name,
            admin_email: provisionForm.value.admin_email || undefined,
            initial_lab_name: provisionForm.value.initial_lab_name || undefined,
            primary_industry: provisionForm.value.primary_industry || 'clinical',
            enabled_modules: enabledModules.length > 0 ? enabledModules : undefined,
        });
        pushToast('success', `Tenant ${provisionForm.value.slug} provisioned`);
        await loadTenants();
    });
};

const submitMigrateTenant = async (): Promise<void> => {
    if (!migrationSlug.value) {
        pushToast('info', 'Tenant slug is required for migration');
        return;
    }
    await withAction('migrate', async () => {
        await api.migrateTenant(migrationSlug.value, migrationModule.value || undefined);
        pushToast('success', `Migration started for ${migrationSlug.value}`);
    });
};

const submitActivateTenant = async (): Promise<void> => {
    if (!activationSlug.value) {
        pushToast('info', 'Tenant slug is required for activation');
        return;
    }
    await withAction('activate', async () => {
        await api.activateTenant(activationSlug.value, activationForce.value);
        pushToast('success', `Activation requested for ${activationSlug.value}`);
        await loadTenants();
    });
};

const submitAddLab = async (): Promise<void> => {
    if (!addLabForm.value.tenantSlug || !addLabForm.value.name) {
        pushToast('info', 'Tenant slug and lab name are required');
        return;
    }
    await withAction('lab', async () => {
        await api.addLab(addLabForm.value.tenantSlug, {
            name: addLabForm.value.name,
            setup_name: addLabForm.value.setup_name || 'beak',
        });
        pushToast('success', `Lab created for ${addLabForm.value.tenantSlug}`);
    });
};

const normalizeModules = (payload: unknown): ModuleRow[] => {
    if (Array.isArray(payload)) {
        return payload
            .map(item => {
                if (typeof item !== 'object' || item === null) {
                    return null;
                }
                const row = item as Record<string, unknown>;
                const key = String(row.id ?? row.key ?? row.module_id ?? row.name ?? '');
                if (!key) {
                    return null;
                }
                const enabled = Boolean(row.enabled ?? row.is_enabled ?? row.active ?? false);
                return { key, enabled, source: 'array' };
            })
            .filter((row): row is ModuleRow => row !== null);
    }

    if (typeof payload !== 'object' || payload === null) {
        return [];
    }

    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.enabled_modules)) {
        return record.enabled_modules
            .map(moduleId => {
                if (typeof moduleId !== 'string' || !moduleId.trim()) {
                    return null;
                }
                return { key: moduleId.trim(), enabled: true, source: 'enabled_modules' };
            })
            .filter((row): row is ModuleRow => row !== null);
    }
    if (Array.isArray(record.modules)) {
        return normalizeModules(record.modules);
    }

    return Object.entries(record)
        .map(([key, value]) => {
            if (typeof value === 'boolean') {
                return { key, enabled: value, source: 'map' };
            }
            if (typeof value === 'object' && value !== null) {
                const row = value as Record<string, unknown>;
                const enabled = Boolean(row.enabled ?? row.is_enabled ?? row.active ?? false);
                return { key, enabled, source: 'object' };
            }
            return null;
        })
        .filter((row): row is ModuleRow => row !== null);
};

const submitListModules = async (): Promise<void> => {
    if (!modulesTenantSlug.value) {
        pushToast('info', 'Tenant slug is required to list modules');
        return;
    }
    await withAction('modules-list', async () => {
        const payload = await api.listModules<unknown>(modulesTenantSlug.value);
        modules.value = normalizeModules(payload);
        pushToast('success', `Loaded ${modules.value.length} modules for ${modulesTenantSlug.value}`);
    });
};

const submitSetModuleEnabled = async (enabled: boolean): Promise<void> => {
    if (!modulesTenantSlug.value || !moduleKeyInput.value) {
        pushToast('info', 'Tenant slug and module key are required');
        return;
    }
    const moduleId = moduleKeyInput.value.trim();
    if (!moduleId) {
        pushToast('info', 'Module key cannot be blank');
        return;
    }

    await withAction('modules-toggle', async () => {
        await api.setModuleEnabled(modulesTenantSlug.value, moduleId, enabled);
        pushToast('success', `Module ${moduleId} ${enabled ? 'enabled' : 'disabled'}`);
        await submitListModules();
    });
};

const submitCleanupFailed = async (): Promise<void> => {
    await withAction('cleanup', async () => {
        await api.cleanupFailed(cleanupSlug.value || undefined, true);
        pushToast('success', `Cleanup requested${cleanupSlug.value ? ` for ${cleanupSlug.value}` : ''}`);
        await loadTenants();
    });
};

const formatMoney = (value: string | number | null | undefined, currency = 'USD'): string => {
    const numeric = Number(value ?? 0);
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(numeric) ? numeric : 0);
};

const hydrateBillingForms = (): void => {
    const profile = billingProfile.value;
    if (profile) {
        billingProfileForm.value.legal_name = profile.legal_name ?? '';
        billingProfileForm.value.billing_email = profile.billing_email ?? '';
        billingProfileForm.value.currency = profile.currency || 'USD';
        billingProfileForm.value.country = profile.country ?? '';
        billingProfileForm.value.provider_preference = profile.provider_preference ?? 'stripe';
        billingProfileForm.value.auto_finalize_invoices = Boolean(profile.auto_finalize_invoices);
        billingProfileForm.value.auto_send_invoices = Boolean(profile.auto_send_invoices);
        billingProfileForm.value.payment_terms_days = Number(profile.payment_terms_days ?? 30);
    }
    const sub = billingSubscription.value;
    if (sub) {
        billingSubscriptionForm.value.plan_code = sub.plan_code ?? '';
        billingSubscriptionForm.value.status = sub.status ?? 'active';
        billingSubscriptionForm.value.base_amount = sub.base_amount ?? '0';
        billingSubscriptionForm.value.usage_overage_amount = sub.usage_overage_amount ?? '0';
        billingSubscriptionForm.value.mrr_snapshot = sub.mrr_snapshot ?? '0';
        billingSubscriptionForm.value.next_billing_date = sub.next_billing_date ?? '';
    }
};

const loadBillingPortfolio = async (): Promise<void> => {
    if (!tenants.value.length) {
        billingOverviewRows.value = [];
        return;
    }
    billingPanelLoading.value = true;
    try {
        const slugs = tenants.value.map(tenant => tenant.slug).filter((slug): slug is string => Boolean(slug));
        const rows = await Promise.all(
            slugs.map(async slug => {
                try {
                    return await api.getTenantBillingOverview(slug);
                } catch {
                    return {
                        tenant_slug: slug,
                        plan_code: null,
                        subscription_status: null,
                        mrr_snapshot: '0',
                        aging: { current: '0', bucket_30: '0', bucket_60: '0', bucket_90_plus: '0' },
                    } as TenantBillingOverview;
                }
            })
        );
        billingOverviewRows.value = rows;
        if (!billingSelectedSlug.value && rows.length) {
            billingSelectedSlug.value = rows[0].tenant_slug;
        }
    } finally {
        billingPanelLoading.value = false;
    }
};

const loadProviderHealth = async (): Promise<void> => {
    try {
        billingProviderHealth.value = await api.getBillingProvidersHealth();
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load provider health';
        pushToast('error', message);
    }
};

const loadTenantBillingDetails = async (slug: string): Promise<void> => {
    if (!slug) {
        return;
    }
    billingPanelLoading.value = true;
    billingSelectedSlug.value = slug;
    try {
        const [profile, subscription, invoices, attempts, entitlements, usage] = await Promise.all([
            api.getTenantBillingProfile(slug),
            api.getTenantBillingSubscription(slug),
            api.listTenantBillingInvoices(slug),
            api.listTenantBillingPaymentAttempts(slug, 20),
            api.getTenantEntitlements(slug),
            api.getTenantUsageSnapshot(slug),
        ]);
        billingProfile.value = profile;
        billingSubscription.value = subscription;
        billingInvoices.value = invoices;
        billingAttempts.value = attempts;
        billingEntitlements.value = entitlements;
        billingUsage.value = usage;
        billingOverridesText.value = '[]';
        hydrateBillingForms();
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load tenant billing details';
        pushToast('error', message);
    } finally {
        billingPanelLoading.value = false;
    }
};

const refreshBilling = async (): Promise<void> => {
    await withAction('billing-refresh', async () => {
        await Promise.all([loadBillingPortfolio(), loadProviderHealth(), loadBillingPlans()]);
        if (billingSelectedSlug.value) {
            await loadTenantBillingDetails(billingSelectedSlug.value);
        }
    });
};

const parseJsonArray = <T = unknown>(value: string, label: string): T[] => {
    const trimmed = value.trim();
    if (!trimmed) {
        return [];
    }
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
        throw new Error(`${label} must be a JSON array`);
    }
    return parsed as T[];
};

const loadBillingPlans = async (): Promise<void> => {
    try {
        billingPlans.value = await api.listBillingPlans();
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load billing plans';
        pushToast('error', message);
    }
};

const createBillingPlan = async (): Promise<void> => {
    await withAction('billing-plan-create', async () => {
        const limits = parseJsonArray(billingPlanCreateForm.value.limits_json, 'limits_json');
        const features = parseJsonArray(billingPlanCreateForm.value.features_json, 'features_json');
        await api.createBillingPlan({
            plan_code: billingPlanCreateForm.value.plan_code.trim(),
            name: billingPlanCreateForm.value.name.trim(),
            active: billingPlanCreateForm.value.active,
            currency: billingPlanCreateForm.value.currency.trim() || 'USD',
            base_amount: billingPlanCreateForm.value.base_amount,
            limits,
            features,
        });
        pushToast('success', `Plan ${billingPlanCreateForm.value.plan_code} created`);
        await loadBillingPlans();
    });
};

const updateBillingPlan = async (): Promise<void> => {
    if (!billingPlanUpdateForm.value.plan_code.trim()) {
        pushToast('info', 'Plan code is required');
        return;
    }
    await withAction('billing-plan-update', async () => {
        const payload: Record<string, unknown> = {
            name: billingPlanUpdateForm.value.name.trim() || undefined,
            active: billingPlanUpdateForm.value.active,
            currency: billingPlanUpdateForm.value.currency.trim() || undefined,
            base_amount: billingPlanUpdateForm.value.base_amount || undefined,
        };
        if (billingPlanUpdateForm.value.limits_json.trim()) {
            payload.limits = parseJsonArray(billingPlanUpdateForm.value.limits_json, 'limits_json');
        }
        if (billingPlanUpdateForm.value.features_json.trim()) {
            payload.features = parseJsonArray(billingPlanUpdateForm.value.features_json, 'features_json');
        }
        await api.updateBillingPlan(billingPlanUpdateForm.value.plan_code.trim(), payload);
        pushToast('success', `Plan ${billingPlanUpdateForm.value.plan_code} updated`);
        await loadBillingPlans();
    });
};

const saveBillingOverrides = async (): Promise<void> => {
    if (!billingSelectedSlug.value) {
        pushToast('info', 'Select a tenant in billing overview');
        return;
    }
    await withAction('billing-overrides', async () => {
        const overrides = parseJsonArray(billingOverridesText.value, 'overrides');
        await api.putTenantEntitlements(billingSelectedSlug.value, overrides);
        pushToast('success', `Entitlement overrides updated for ${billingSelectedSlug.value}`);
        await loadTenantBillingDetails(billingSelectedSlug.value);
    });
};

const saveBillingProfile = async (): Promise<void> => {
    if (!billingSelectedSlug.value) {
        pushToast('info', 'Select a tenant in billing overview');
        return;
    }
    await withAction('billing-profile', async () => {
        await api.updateTenantBillingProfile(billingSelectedSlug.value, billingProfileForm.value);
        pushToast('success', `Billing profile updated for ${billingSelectedSlug.value}`);
        await loadTenantBillingDetails(billingSelectedSlug.value);
    });
};

const saveBillingSubscription = async (): Promise<void> => {
    if (!billingSelectedSlug.value || !billingSubscriptionForm.value.plan_code.trim()) {
        pushToast('info', 'Tenant and plan code are required');
        return;
    }
    await withAction('billing-subscription', async () => {
        await api.updateTenantBillingSubscription(billingSelectedSlug.value, {
            plan_code: billingSubscriptionForm.value.plan_code.trim(),
            status: billingSubscriptionForm.value.status,
            base_amount: billingSubscriptionForm.value.base_amount,
            usage_overage_amount: billingSubscriptionForm.value.usage_overage_amount,
            mrr_snapshot: billingSubscriptionForm.value.mrr_snapshot,
            next_billing_date: billingSubscriptionForm.value.next_billing_date || null,
            metadata: {},
        });
        pushToast('success', `Subscription updated for ${billingSelectedSlug.value}`);
        await refreshBilling();
    });
};

const createBillingInvoice = async (): Promise<void> => {
    if (!billingSelectedSlug.value || !billingInvoiceForm.value.description.trim()) {
        pushToast('info', 'Tenant and invoice description are required');
        return;
    }
    await withAction('billing-invoice-create', async () => {
        await api.createTenantBillingInvoice(billingSelectedSlug.value, {
            currency: billingInvoiceForm.value.currency || 'USD',
            due_date: billingInvoiceForm.value.due_date || null,
            tax_amount: billingInvoiceForm.value.tax_amount || '0',
            lines: [
                {
                    description: billingInvoiceForm.value.description.trim(),
                    quantity: billingInvoiceForm.value.quantity || '1',
                    unit_price: billingInvoiceForm.value.unit_price || '0',
                    amount: billingInvoiceForm.value.amount || '0',
                },
            ],
        });
        pushToast('success', `Draft invoice created for ${billingSelectedSlug.value}`);
        billingInvoiceForm.value.description = '';
        await refreshBilling();
    });
};

const finalizeBillingInvoice = async (invoiceUid: string): Promise<void> => {
    if (!billingSelectedSlug.value) {
        return;
    }
    await withAction('billing-invoice-finalize', async () => {
        await api.finalizeTenantBillingInvoice(billingSelectedSlug.value, invoiceUid);
        pushToast('success', 'Invoice finalized');
        await refreshBilling();
    });
};

const sendBillingInvoice = async (invoiceUid: string): Promise<void> => {
    if (!billingSelectedSlug.value) {
        return;
    }
    await withAction('billing-invoice-send', async () => {
        await api.sendTenantBillingInvoice(billingSelectedSlug.value, invoiceUid);
        pushToast('success', 'Invoice sent');
        await refreshBilling();
    });
};

const markBillingInvoicePaid = async (invoiceUid?: string): Promise<void> => {
    const resolvedUid = invoiceUid || markPaidInvoiceUid.value;
    if (!billingSelectedSlug.value || !resolvedUid) {
        pushToast('info', 'Select tenant and invoice');
        return;
    }
    await withAction('billing-invoice-paid', async () => {
        await api.markTenantBillingInvoicePaid(billingSelectedSlug.value, resolvedUid, {
            amount: markPaidAmount.value || undefined,
            note: 'manual platform mark-paid',
        });
        pushToast('success', 'Invoice marked paid');
        markPaidInvoiceUid.value = '';
        markPaidAmount.value = '';
        await refreshBilling();
    });
};

const logout = async (): Promise<void> => {
    authStore.clear();
    await router.push({ name: PLATFORM_LOGIN });
};

onMounted(async () => {
    if (!authStore.isAuthenticated) {
        await router.replace({ name: PLATFORM_LOGIN });
        return;
    }
    await Promise.all([loadMe(), loadTenants()]);
    await refreshBilling();
});
</script>

<template>
  <main class="platform-dashboard">
    <div class="backdrop"></div>

    <header class="dashboard-header panel">
      <div class="title-wrap">
        <p class="kicker">Platform Control Plane</p>
        <h1>Admin Dashboard</h1>
        <p class="meta-line">
          <span class="chip">{{ tenantCountLabel }}</span>
          <span class="chip user-chip">Signed in: {{ userSummary }}</span>
        </p>
      </div>
      <div class="header-actions">
        <button class="btn ghost" :disabled="isBusy" @click="loadTenants">Refresh Tenants</button>
        <button class="btn ghost" :disabled="isBusy" @click="loadMe">Refresh Profile</button>
        <button class="btn danger" :disabled="isBusy" @click="logout">Logout</button>
      </div>
    </header>

    <nav class="tabs panel" aria-label="Platform sections">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        type="button"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <section class="panel content-pane">
      <article v-if="activeTab === 'tenants'" class="stack-lg">
        <div class="section-head">
          <h2>Tenant Registry</h2>
          <p>Inspect status and open the detail drawer for action shortcuts.</p>
        </div>
        <div class="table-wrap">
          <table class="tenant-table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Name</th>
                <th>Status</th>
                <th>Industry</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tenant, index) in tenants" :key="`${tenantKey(tenant)}-${index}`">
                <td>{{ tenant.slug ?? '-' }}</td>
                <td>{{ tenant.name ?? '-' }}</td>
                <td>
                  <span class="status-pill">{{ tenant.status ?? (tenant.active ? 'active' : 'unknown') }}</span>
                </td>
                <td>{{ tenant.primary_industry ?? '-' }}</td>
                <td class="align-right">
                  <button class="btn small ghost" type="button" @click="openTenantDrawer(tenant)">Details</button>
                </td>
              </tr>
              <tr v-if="!tenants.length">
                <td colspan="5" class="empty-row">No tenants found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article v-if="activeTab === 'provision'" class="stack-lg">
        <div class="section-head">
          <h2>Provision Tenant</h2>
          <p>Create a tenant shell and optional starter module set.</p>
        </div>
        <form class="form-grid" @submit.prevent="submitProvisionTenant">
          <label>
            Tenant Slug
            <input v-model.trim="provisionForm.slug" required placeholder="acme-health" />
          </label>
          <label>
            Tenant Name
            <input v-model.trim="provisionForm.name" required placeholder="Acme Health" />
          </label>
          <label>
            Admin Email
            <input v-model.trim="provisionForm.admin_email" type="email" placeholder="admin@acme.test" />
          </label>
          <label>
            Initial Lab Name
            <input v-model.trim="provisionForm.initial_lab_name" placeholder="Main Laboratory" />
          </label>
          <label>
            Industry
            <input v-model.trim="provisionForm.primary_industry" placeholder="clinical" />
          </label>
          <label>
            Enabled Modules (CSV)
            <input v-model.trim="provisionForm.enabledModulesCsv" placeholder="inventory,billing,reporting" />
          </label>
          <button class="btn" :disabled="isBusy" type="submit">Provision Tenant</button>
        </form>
      </article>

      <article v-if="activeTab === 'labs'" class="stack-lg">
        <div class="section-head">
          <h2>Add Laboratory</h2>
          <p>Attach a new lab to an existing tenant.</p>
        </div>
        <form class="form-grid compact" @submit.prevent="submitAddLab">
          <label>
            Tenant Slug
            <input v-model.trim="addLabForm.tenantSlug" required placeholder="tenant-slug" />
          </label>
          <label>
            Lab Name
            <input v-model.trim="addLabForm.name" required placeholder="Lab 01" />
          </label>
          <label>
            Setup Name
            <input v-model.trim="addLabForm.setup_name" placeholder="beak" />
          </label>
          <button class="btn" :disabled="isBusy" type="submit">Add Lab</button>
        </form>
      </article>

      <article v-if="activeTab === 'operations'" class="stack-lg">
        <div class="section-head">
          <h2>Tenant Operations</h2>
          <p>Run migration and activation control actions.</p>
        </div>
        <div class="split-grid">
          <form class="form-grid compact" @submit.prevent="submitMigrateTenant">
            <h3>Migrate</h3>
            <label>
              Tenant Slug
              <input v-model.trim="migrationSlug" required placeholder="tenant-slug" />
            </label>
            <label>
              Module (optional)
              <input v-model.trim="migrationModule" placeholder="module-id" />
            </label>
            <button class="btn" :disabled="isBusy" type="submit">Run Migration</button>
          </form>
          <form class="form-grid compact" @submit.prevent="submitActivateTenant">
            <h3>Activate</h3>
            <label>
              Tenant Slug
              <input v-model.trim="activationSlug" required placeholder="tenant-slug" />
            </label>
            <label class="inline-checkbox">
              <input v-model="activationForce" type="checkbox" />
              Force Activation
            </label>
            <button class="btn" :disabled="isBusy" type="submit">Activate Tenant</button>
          </form>
        </div>
      </article>

      <article v-if="activeTab === 'modules'" class="stack-lg">
        <div class="section-head">
          <h2>Module Controls</h2>
          <p>List available modules and toggle state for one module key.</p>
        </div>
        <form class="form-grid compact" @submit.prevent="submitListModules">
          <label>
            Tenant Slug
            <input v-model.trim="modulesTenantSlug" required placeholder="tenant-slug" />
          </label>
          <button class="btn ghost" :disabled="isBusy" type="submit">Load Modules</button>
        </form>
        <div class="module-toggle-row">
          <input v-model.trim="moduleKeyInput" placeholder="module key" />
          <button class="btn" :disabled="isBusy" type="button" @click="submitSetModuleEnabled(true)">Enable</button>
          <button class="btn danger" :disabled="isBusy" type="button" @click="submitSetModuleEnabled(false)">Disable</button>
        </div>
        <div class="module-list">
          <p v-if="!modules.length" class="muted">No module data loaded for the selected tenant.</p>
          <ul v-else>
            <li v-for="moduleRow in modules" :key="moduleRow.key">
              <span>{{ moduleRow.key }}</span>
              <span class="status-pill" :class="{ on: moduleRow.enabled }">
                {{ moduleRow.enabled ? 'enabled' : 'disabled' }}
              </span>
            </li>
          </ul>
        </div>
      </article>

      <article v-if="activeTab === 'billing'" class="stack-lg">
        <div class="section-head">
          <h2>Platform Billing</h2>
          <p>Portfolio overview, tenant billing detail, invoice actions, and provider health.</p>
        </div>
        <div class="header-actions">
          <button class="btn ghost" :disabled="isBusy || billingPanelLoading" @click="refreshBilling">Refresh Billing</button>
        </div>
        <div class="table-wrap">
          <table class="tenant-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Plan</th>
                <th>Status</th>
                <th>MRR</th>
                <th>A/R Aging</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in billingOverviewRows" :key="row.tenant_slug">
                <td>{{ row.tenant_slug }}</td>
                <td>{{ row.plan_code ?? 'unassigned' }}</td>
                <td><span class="status-pill">{{ row.subscription_status ?? 'none' }}</span></td>
                <td>{{ formatMoney(row.mrr_snapshot) }}</td>
                <td>
                  C {{ formatMoney(row.aging.current) }} |
                  30 {{ formatMoney(row.aging.bucket_30) }} |
                  60 {{ formatMoney(row.aging.bucket_60) }} |
                  90+ {{ formatMoney(row.aging.bucket_90_plus) }}
                </td>
                <td class="align-right">
                  <button class="btn small ghost" type="button" @click="loadTenantBillingDetails(row.tenant_slug)">Details</button>
                </td>
              </tr>
              <tr v-if="!billingOverviewRows.length">
                <td colspan="6" class="empty-row">No billing portfolio rows available.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="split-grid">
          <section class="panel inset-panel stack-lg">
            <h3>Tenant Billing Detail</h3>
            <p v-if="!billingSelectedSlug" class="muted">Select a tenant from overview to manage billing details.</p>
            <template v-else>
              <p class="muted">Tenant: <strong>{{ billingSelectedSlug }}</strong> | Open A/R: {{ formatMoney(tenantBillingOpenTotal) }}</p>
              <form class="form-grid compact" @submit.prevent="saveBillingProfile">
                <label>
                  Legal Name
                  <input v-model.trim="billingProfileForm.legal_name" placeholder="Tenant legal entity" />
                </label>
                <label>
                  Billing Email
                  <input v-model.trim="billingProfileForm.billing_email" type="email" placeholder="billing@tenant.tld" />
                </label>
                <label>
                  Currency
                  <input v-model.trim="billingProfileForm.currency" placeholder="USD" />
                </label>
                <label>
                  Country
                  <input v-model.trim="billingProfileForm.country" placeholder="US" />
                </label>
                <label>
                  Provider
                  <select v-model="billingProfileForm.provider_preference">
                    <option value="stripe">Stripe</option>
                    <option value="paystack">Paystack</option>
                  </select>
                </label>
                <label>
                  Payment Terms (days)
                  <input v-model.number="billingProfileForm.payment_terms_days" type="number" min="1" />
                </label>
                <label class="inline-checkbox">
                  <input v-model="billingProfileForm.auto_finalize_invoices" type="checkbox" />
                  Auto-finalize invoices
                </label>
                <label class="inline-checkbox">
                  <input v-model="billingProfileForm.auto_send_invoices" type="checkbox" />
                  Auto-send invoices
                </label>
                <button class="btn" :disabled="isBusy || billingPanelLoading" type="submit">Save Profile</button>
              </form>

              <form class="form-grid compact" @submit.prevent="saveBillingSubscription">
                <label>
                  Plan Code
                  <input v-model.trim="billingSubscriptionForm.plan_code" required placeholder="starter|growth|enterprise" />
                </label>
                <label>
                  Status
                  <select v-model="billingSubscriptionForm.status">
                    <option value="trialing">trialing</option>
                    <option value="active">active</option>
                    <option value="past_due">past_due</option>
                    <option value="paused">paused</option>
                    <option value="canceled">canceled</option>
                  </select>
                </label>
                <label>
                  Base Amount
                  <input v-model.trim="billingSubscriptionForm.base_amount" />
                </label>
                <label>
                  Overage Amount
                  <input v-model.trim="billingSubscriptionForm.usage_overage_amount" />
                </label>
                <label>
                  MRR Snapshot
                  <input v-model.trim="billingSubscriptionForm.mrr_snapshot" />
                </label>
                <label>
                  Next Billing Date
                  <input v-model="billingSubscriptionForm.next_billing_date" type="date" />
                </label>
                <button class="btn" :disabled="isBusy || billingPanelLoading" type="submit">Save Subscription</button>
              </form>
            </template>
          </section>
          <section class="panel inset-panel stack-lg">
            <h3>Invoice Workflow</h3>
            <form class="form-grid compact" @submit.prevent="createBillingInvoice">
              <label>
                Description
                <input v-model.trim="billingInvoiceForm.description" required placeholder="Base plan monthly charge" />
              </label>
              <label>
                Currency
                <input v-model.trim="billingInvoiceForm.currency" placeholder="USD" />
              </label>
              <label>
                Due Date
                <input v-model="billingInvoiceForm.due_date" type="date" />
              </label>
              <label>
                Quantity
                <input v-model.trim="billingInvoiceForm.quantity" />
              </label>
              <label>
                Unit Price
                <input v-model.trim="billingInvoiceForm.unit_price" />
              </label>
              <label>
                Line Amount
                <input v-model.trim="billingInvoiceForm.amount" />
              </label>
              <label>
                Tax Amount
                <input v-model.trim="billingInvoiceForm.tax_amount" />
              </label>
              <button class="btn" :disabled="isBusy || billingPanelLoading" type="submit">Create Draft Invoice</button>
            </form>
            <div class="module-list">
              <p v-if="!billingInvoices.length" class="muted">No invoices for selected tenant.</p>
              <ul v-else>
                <li v-for="invoice in billingInvoices" :key="invoice.uid">
                  <div>
                    <strong>{{ invoice.invoice_number }}</strong>
                    <p class="muted">{{ invoice.status }} | Due {{ invoice.due_date ?? 'n/a' }}</p>
                    <p class="muted">{{ formatMoney(invoice.total_amount, invoice.currency) }}</p>
                  </div>
                  <div class="drawer-shortcuts">
                    <button
                      class="btn small ghost"
                      type="button"
                      :disabled="invoice.status !== 'draft' || isBusy || billingPanelLoading"
                      @click="finalizeBillingInvoice(invoice.uid)"
                    >
                      Finalize
                    </button>
                    <button
                      class="btn small ghost"
                      type="button"
                      :disabled="invoice.status !== 'open' || isBusy || billingPanelLoading"
                      @click="sendBillingInvoice(invoice.uid)"
                    >
                      Send
                    </button>
                    <button
                      class="btn small"
                      type="button"
                      :disabled="invoice.status === 'paid' || isBusy || billingPanelLoading"
                      @click="markBillingInvoicePaid(invoice.uid)"
                    >
                      Mark Paid
                    </button>
                  </div>
                </li>
              </ul>
            </div>
            <form class="form-grid compact" @submit.prevent="markBillingInvoicePaid()">
              <label>
                Invoice UID
                <input v-model.trim="markPaidInvoiceUid" placeholder="optional if using row action" />
              </label>
              <label>
                Amount (optional)
                <input v-model.trim="markPaidAmount" placeholder="full amount if blank" />
              </label>
              <button class="btn" :disabled="isBusy || billingPanelLoading" type="submit">Manual Mark Paid</button>
            </form>
            <h3>Recent Payment Attempts</h3>
            <div class="module-list">
              <p v-if="!billingAttempts.length" class="muted">No payment attempts recorded.</p>
              <ul v-else>
                <li v-for="attempt in billingAttempts" :key="attempt.uid">
                  <span>{{ attempt.provider }} / {{ attempt.status }} / {{ formatMoney(attempt.amount, attempt.currency) }}</span>
                  <span class="muted">{{ attempt.provider_reference ?? 'n/a' }}</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
        <div class="placeholder-grid">
          <div class="placeholder-card">
            <h3>Provider Health</h3>
            <p v-if="!billingProviderHealth" class="muted">Health status unavailable.</p>
            <ul v-else class="health-list">
              <li v-for="provider in billingProviderHealth.providers" :key="provider.provider">
                <span>{{ provider.provider }}</span>
                <span class="status-pill" :class="{ on: provider.healthy }">{{ provider.healthy ? 'healthy' : 'degraded' }}</span>
                <span class="muted">{{ provider.details }}</span>
              </li>
            </ul>
          </div>
          <div class="placeholder-card">
            <h3>Billing Plans</h3>
            <p class="muted">Manage plans, limits, and feature bundles directly.</p>
            <form class="form-grid compact" @submit.prevent="createBillingPlan">
              <label>
                Plan Code
                <input v-model.trim="billingPlanCreateForm.plan_code" required placeholder="starter" />
              </label>
              <label>
                Name
                <input v-model.trim="billingPlanCreateForm.name" required placeholder="Starter Plan" />
              </label>
              <label>
                Currency
                <input v-model.trim="billingPlanCreateForm.currency" placeholder="USD" />
              </label>
              <label>
                Base Amount
                <input v-model.trim="billingPlanCreateForm.base_amount" placeholder="0" />
              </label>
              <label class="inline-checkbox">
                <input v-model="billingPlanCreateForm.active" type="checkbox" />
                Active
              </label>
              <label>
                Limits JSON
                <textarea v-model="billingPlanCreateForm.limits_json" rows="3"></textarea>
              </label>
              <label>
                Features JSON
                <textarea v-model="billingPlanCreateForm.features_json" rows="3"></textarea>
              </label>
              <button class="btn" :disabled="isBusy || billingPanelLoading" type="submit">Create Plan</button>
            </form>
            <form class="form-grid compact" @submit.prevent="updateBillingPlan">
              <label>
                Plan Code
                <input v-model.trim="billingPlanUpdateForm.plan_code" required placeholder="starter" />
              </label>
              <label>
                Name
                <input v-model.trim="billingPlanUpdateForm.name" placeholder="Optional update" />
              </label>
              <label>
                Currency
                <input v-model.trim="billingPlanUpdateForm.currency" placeholder="USD" />
              </label>
              <label>
                Base Amount
                <input v-model.trim="billingPlanUpdateForm.base_amount" placeholder="0" />
              </label>
              <label class="inline-checkbox">
                <input v-model="billingPlanUpdateForm.active" type="checkbox" />
                Active
              </label>
              <label>
                Limits JSON (optional replace)
                <textarea v-model="billingPlanUpdateForm.limits_json" rows="3"></textarea>
              </label>
              <label>
                Features JSON (optional replace)
                <textarea v-model="billingPlanUpdateForm.features_json" rows="3"></textarea>
              </label>
              <button class="btn" :disabled="isBusy || billingPanelLoading" type="submit">Update Plan</button>
            </form>
            <div class="module-list">
              <p v-if="!billingPlans.length" class="muted">No plans configured.</p>
              <ul v-else>
                <li v-for="plan in billingPlans" :key="plan.uid">
                  <span>{{ plan.plan_code }} ({{ plan.name }})</span>
                  <span class="status-pill" :class="{ on: plan.active }">
                    {{ plan.active ? 'active' : 'inactive' }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div class="placeholder-card">
            <h3>Entitlements & Usage</h3>
            <p class="muted">
              Selected tenant:
              <strong>{{ billingSelectedSlug || 'none' }}</strong>
            </p>
            <div class="module-list">
              <p v-if="!billingEntitlements" class="muted">No entitlement data loaded.</p>
              <ul v-else>
                <li>
                  <span>Plan</span>
                  <span class="muted">{{ billingEntitlements.plan_code }}</span>
                </li>
                <li v-for="row in billingEntitlements.limits" :key="`${row.metric_key}-${row.window}`">
                  <span>{{ row.metric_key }}</span>
                  <span class="muted">{{ row.limit_value }} / {{ row.window }}</span>
                </li>
                <li v-for="row in billingEntitlements.features" :key="row.feature_key">
                  <span>{{ row.feature_key }}</span>
                  <span class="status-pill" :class="{ on: row.enabled }">{{ row.enabled ? 'enabled' : 'disabled' }}</span>
                </li>
              </ul>
            </div>
            <h4>Overrides JSON</h4>
            <form class="form-grid compact" @submit.prevent="saveBillingOverrides">
              <label>
                Overrides
                <textarea v-model="billingOverridesText" rows="5"></textarea>
              </label>
              <button class="btn" :disabled="isBusy || billingPanelLoading" type="submit">Save Overrides</button>
            </form>
            <div class="module-list">
              <p v-if="!billingUsage || !billingUsage.rows.length" class="muted">No usage counters recorded.</p>
              <ul v-else>
                <li v-for="row in billingUsage.rows" :key="`${row.metric_key}-${row.window_start}-${row.scope_user_uid || ''}-${row.scope_lab_uid || ''}`">
                  <span>{{ row.metric_key }}</span>
                  <span class="muted">{{ row.quantity }} ({{ row.window_start }})</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </article>

      <article v-if="activeTab === 'users'" class="stack-lg">
        <div class="section-head">
          <h2>Platform Users (Placeholder)</h2>
          <p>Future user directory and role management. Current preview is derived from loaded tenants.</p>
        </div>
        <div class="placeholder-grid">
          <div v-for="row in placeholderUserRows" :key="`${row.tenant}-${row.owner}`" class="placeholder-card">
            <h3>{{ row.tenant }}</h3>
            <p>Current Operator: {{ row.owner }}</p>
            <p>{{ row.note }}</p>
          </div>
          <p v-if="!placeholderUserRows.length" class="muted">No tenant data available yet.</p>
        </div>
      </article>

      <article v-if="activeTab === 'cleanup'" class="stack-lg">
        <div class="section-head">
          <h2>Cleanup Failed Tenants</h2>
          <p>Removes failed provisioning artifacts. Use with care.</p>
        </div>
        <form class="form-grid compact" @submit.prevent="submitCleanupFailed">
          <label>
            Failed Tenant Slug (optional)
            <input v-model.trim="cleanupSlug" placeholder="tenant-slug" />
          </label>
          <button class="btn danger" :disabled="isBusy" type="submit">Cleanup Failed</button>
        </form>
      </article>
    </section>

    <transition name="fade">
      <button v-if="tenantDrawerOpen" class="drawer-overlay" type="button" aria-label="Close details" @click="closeTenantDrawer"></button>
    </transition>
    <aside class="drawer panel" :class="{ open: tenantDrawerOpen }">
      <header class="drawer-head">
        <h2>Tenant Details</h2>
        <button class="btn small ghost" type="button" @click="closeTenantDrawer">Close</button>
      </header>
      <div v-if="selectedTenant" class="drawer-body">
        <dl>
          <dt>Slug</dt>
          <dd>{{ selectedTenant.slug ?? '-' }}</dd>
          <dt>Name</dt>
          <dd>{{ selectedTenant.name ?? '-' }}</dd>
          <dt>Status</dt>
          <dd>{{ selectedTenant.status ?? (selectedTenant.active ? 'active' : 'unknown') }}</dd>
          <dt>Schema</dt>
          <dd>{{ selectedTenant.schema_name ?? '-' }}</dd>
          <dt>Industry</dt>
          <dd>{{ selectedTenant.primary_industry ?? '-' }}</dd>
          <dt>Modules</dt>
          <dd>{{ (selectedTenant.enabled_modules ?? []).join(', ') || 'None listed' }}</dd>
        </dl>
        <div class="drawer-shortcuts">
          <button class="btn small" type="button" @click="activeTab = 'operations'">Go To Operations</button>
          <button class="btn small" type="button" @click="activeTab = 'modules'">Go To Modules</button>
          <button class="btn small" type="button" @click="activeTab = 'labs'">Go To Labs</button>
        </div>
      </div>
      <p v-else class="muted">Select a tenant from the table to inspect details.</p>
      <details>
        <summary>Current user payload</summary>
        <pre>{{ meJson }}</pre>
      </details>
      <p v-if="activeTenantSlug" class="muted">Focused tenant: {{ activeTenantSlug }}</p>
    </aside>

    <aside class="toast-region" aria-live="polite" aria-atomic="true">
      <transition-group name="toast">
        <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
          {{ toast.message }}
        </div>
      </transition-group>
    </aside>
  </main>
</template>

<style scoped>
.platform-dashboard {
    --bg-main: #0b1021;
    --bg-panel: rgba(14, 23, 45, 0.84);
    --bg-panel-strong: #141f3a;
    --border-soft: rgba(138, 164, 209, 0.3);
    --text-main: #e9edf8;
    --text-muted: #92a1be;
    --accent: #32d1c0;
    --accent-strong: #21b3a3;
    --danger: #f46a87;
    --warning: #ffca6e;
    --ok: #37d07f;
    min-height: 100vh;
    padding: 1.25rem;
    position: relative;
    overflow: hidden;
    font-family: 'Manrope', 'Segoe UI', sans-serif;
    color: var(--text-main);
    background:
        radial-gradient(1200px 560px at 15% -5%, #153463 0%, rgba(11, 16, 33, 0) 65%),
        radial-gradient(1000px 520px at 110% 110%, #2b4d2f 0%, rgba(11, 16, 33, 0) 60%),
        var(--bg-main);
}

.backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
        linear-gradient(transparent 0, transparent 96%, rgba(110, 130, 170, 0.12) 96%, rgba(110, 130, 170, 0.12) 100%),
        linear-gradient(90deg, transparent 0, transparent 96%, rgba(110, 130, 170, 0.12) 96%, rgba(110, 130, 170, 0.12) 100%);
    background-size: 42px 42px;
    opacity: 0.35;
}

.panel {
    position: relative;
    z-index: 1;
    border: 1px solid var(--border-soft);
    background: var(--bg-panel);
    backdrop-filter: blur(10px);
    box-shadow: 0 20px 45px rgba(6, 8, 16, 0.4);
    border-radius: 14px;
}

.dashboard-header {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
}

.kicker {
    margin: 0;
    color: var(--accent);
    letter-spacing: 0.09em;
    text-transform: uppercase;
    font-size: 0.72rem;
    font-weight: 700;
}

h1,
h2,
h3 {
    margin: 0;
    font-family: 'Outfit', 'Avenir Next', sans-serif;
    letter-spacing: 0.015em;
}

h1 {
    font-size: clamp(1.5rem, 2.4vw, 2rem);
}

.meta-line {
    margin: 0.7rem 0 0;
    display: flex;
    gap: 0.55rem;
    flex-wrap: wrap;
}

.chip {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    border: 1px solid rgba(117, 143, 192, 0.5);
    padding: 0.25rem 0.62rem;
    color: var(--text-muted);
    font-size: 0.8rem;
}

.user-chip {
    border-color: rgba(50, 209, 192, 0.45);
}

.header-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    justify-content: flex-end;
}

.tabs {
    margin-top: 0.85rem;
    padding: 0.45rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.tab-button {
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-muted);
    border-radius: 10px;
    padding: 0.5rem 0.82rem;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.18s ease;
}

.tab-button:hover {
    color: var(--text-main);
    border-color: rgba(115, 145, 198, 0.55);
}

.tab-button.active {
    color: #08121e;
    background: linear-gradient(145deg, #5ce4d5 0%, #2ec5b6 100%);
}

.content-pane {
    margin-top: 0.85rem;
    padding: 1rem;
}

.section-head p,
.muted {
    margin: 0.35rem 0 0;
    color: var(--text-muted);
    font-size: 0.9rem;
}

.stack-lg {
    display: grid;
    gap: 0.95rem;
}

.table-wrap {
    overflow: auto;
    border: 1px solid rgba(117, 141, 182, 0.25);
    border-radius: 12px;
}

.tenant-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
}

.tenant-table th,
.tenant-table td {
    padding: 0.62rem 0.68rem;
    border-bottom: 1px solid rgba(109, 130, 171, 0.18);
    font-size: 0.88rem;
    text-align: left;
}

.tenant-table th {
    color: #c7d3ef;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.align-right {
    text-align: right;
}

.empty-row {
    color: var(--text-muted);
    text-align: center;
    padding: 1rem;
}

.status-pill {
    display: inline-flex;
    border: 1px solid rgba(130, 154, 193, 0.45);
    border-radius: 999px;
    padding: 0.12rem 0.55rem;
    color: #d7e2f9;
    font-size: 0.75rem;
    text-transform: lowercase;
}

.status-pill.on {
    border-color: rgba(66, 200, 131, 0.55);
    color: #d7ffe9;
}

.form-grid {
    display: grid;
    gap: 0.7rem;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
}

.form-grid.compact {
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
}

label {
    display: grid;
    gap: 0.34rem;
    color: var(--text-muted);
    font-size: 0.85rem;
}

input,
select,
button {
    font: inherit;
}

input,
select {
    border: 1px solid rgba(118, 146, 195, 0.38);
    border-radius: 10px;
    background: rgba(10, 16, 32, 0.64);
    color: var(--text-main);
    padding: 0.5rem 0.62rem;
}

input::placeholder {
    color: rgba(158, 173, 203, 0.7);
}

.inline-checkbox {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-top: 1.5rem;
}

.inline-checkbox input {
    width: 1rem;
    height: 1rem;
    margin: 0;
}

.split-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 0.9rem;
}

.inset-panel {
    padding: 0.75rem;
}

.module-toggle-row {
    display: grid;
    grid-template-columns: minmax(200px, 1fr) auto auto;
    gap: 0.55rem;
    align-items: center;
}

.module-list ul {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid rgba(117, 141, 182, 0.25);
    border-radius: 10px;
}

.module-list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.52rem 0.62rem;
    border-bottom: 1px solid rgba(109, 130, 171, 0.18);
}

.module-list li:last-child {
    border-bottom: 0;
}

.placeholder-grid {
    display: grid;
    gap: 0.7rem;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.placeholder-card {
    border-radius: 11px;
    border: 1px solid rgba(117, 141, 182, 0.32);
    background: var(--bg-panel-strong);
    padding: 0.72rem;
}

.placeholder-card p {
    margin: 0.42rem 0 0;
    color: var(--text-muted);
}

.health-list {
    list-style: none;
    margin: 0.5rem 0 0;
    padding: 0;
    display: grid;
    gap: 0.5rem;
}

.health-list li {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
}

.btn {
    border: 1px solid transparent;
    background: linear-gradient(135deg, #31d2c1 0%, #26b8a9 100%);
    color: #06231f;
    border-radius: 10px;
    padding: 0.5rem 0.78rem;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.18s ease, filter 0.18s ease, opacity 0.18s ease;
}

.btn:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn.ghost {
    background: transparent;
    color: var(--text-main);
    border-color: rgba(121, 145, 188, 0.42);
}

.btn.danger {
    background: linear-gradient(135deg, #f77c97 0%, #df5674 100%);
    color: #32101a;
}

.btn.small {
    font-size: 0.78rem;
    padding: 0.38rem 0.58rem;
}

.drawer-overlay {
    position: fixed;
    inset: 0;
    z-index: 7;
    border: 0;
    background: rgba(5, 8, 14, 0.5);
}

.drawer {
    position: fixed;
    z-index: 8;
    top: 1rem;
    right: 1rem;
    width: min(400px, calc(100% - 2rem));
    max-height: calc(100vh - 2rem);
    overflow: auto;
    transform: translateX(115%);
    transition: transform 0.22s ease;
    padding: 0.9rem;
}

.drawer.open {
    transform: translateX(0);
}

.drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
}

.drawer-body {
    margin-top: 0.75rem;
}

dl {
    margin: 0;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem 0.7rem;
    font-size: 0.88rem;
}

dt {
    color: var(--text-muted);
}

dd {
    margin: 0;
}

.drawer-shortcuts {
    margin-top: 0.85rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

summary {
    margin-top: 0.85rem;
    cursor: pointer;
    color: #d2ddf3;
}

pre {
    margin: 0.65rem 0 0;
    max-height: 220px;
    overflow: auto;
    border: 1px solid rgba(117, 141, 182, 0.3);
    border-radius: 10px;
    background: rgba(10, 16, 32, 0.62);
    color: #d9e2f5;
    padding: 0.56rem;
    font-size: 0.75rem;
}

.toast-region {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 9;
    display: grid;
    gap: 0.55rem;
}

.toast {
    min-width: 220px;
    max-width: 320px;
    border-radius: 10px;
    border: 1px solid rgba(123, 147, 190, 0.3);
    background: rgba(15, 25, 48, 0.92);
    padding: 0.56rem 0.68rem;
    box-shadow: 0 10px 24px rgba(5, 8, 16, 0.4);
    font-size: 0.85rem;
}

.toast.success {
    border-color: rgba(55, 208, 127, 0.45);
}

.toast.error {
    border-color: rgba(244, 106, 135, 0.52);
}

.toast.info {
    border-color: rgba(255, 202, 110, 0.45);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(8px);
}

@media (max-width: 760px) {
    .platform-dashboard {
        padding: 0.85rem;
    }

    .dashboard-header {
        flex-direction: column;
    }

    .header-actions {
        width: 100%;
        justify-content: flex-start;
    }

    .module-toggle-row {
        grid-template-columns: 1fr;
    }
}
</style>
