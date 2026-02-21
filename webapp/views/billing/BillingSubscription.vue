<script setup lang="ts">
import { onMounted, ref } from 'vue';

import useNotifyToast from '@/composables/alert_toast';
import {
    TenantBillingInvoice,
    TenantPaymentAttempt,
    TenantPaymentProof,
    TenantSubscription,
    TenantEntitlements,
    useTenantBillingApi,
} from '@/composables/tenant_billing';

const api = useTenantBillingApi();
const { toastError, toastSuccess, toastWarning } = useNotifyToast();

const loading = ref(false);
const subscription = ref<TenantSubscription | null>(null);
const overview = ref<{
    tenant_slug: string;
    plan_code?: string | null;
    subscription_status?: string | null;
    mrr_snapshot: string;
    aging: { current: string; bucket_30: string; bucket_60: string; bucket_90_plus: string };
} | null>(null);
const entitlements = ref<TenantEntitlements | null>(null);
const invoices = ref<TenantBillingInvoice[]>([]);
const attempts = ref<TenantPaymentAttempt[]>([]);
const proofsByInvoice = ref<Record<string, TenantPaymentProof[]>>({});

const selectedInvoiceUid = ref('');
const proofAmount = ref('');
const proofCurrency = ref('USD');
const proofMethod = ref('');
const proofReference = ref('');
const proofNote = ref('');
const proofFile = ref<File | null>(null);

const fmtMoney = (value: string | number | null | undefined, currency = 'USD'): string => {
    const amount = Number(value ?? 0);
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
};

const hostedUrlForInvoice = (invoice: TenantBillingInvoice): string | null => {
    const url = invoice.metadata?.provider_hosted_url;
    return typeof url === 'string' && url.length > 0 ? url : null;
};

const loadInvoiceProofs = async (invoiceUid: string): Promise<void> => {
    proofsByInvoice.value[invoiceUid] = await api.listPaymentProofs(invoiceUid);
};

const refresh = async (): Promise<void> => {
    loading.value = true;
    try {
        const [sub, ov, ents, inv, atts] = await Promise.all([
            api.getSubscription(),
            api.getOverview(),
            api.getEntitlements(),
            api.listInvoices(),
            api.listPaymentAttempts(20),
        ]);
        subscription.value = sub;
        overview.value = ov;
        entitlements.value = ents;
        invoices.value = inv;
        attempts.value = atts;
        proofsByInvoice.value = {};
        if (invoices.value.length) {
            selectedInvoiceUid.value = selectedInvoiceUid.value || invoices.value[0].uid;
            await loadInvoiceProofs(selectedInvoiceUid.value);
        }
    } catch (error) {
        toastError(error instanceof Error ? error.message : 'Failed to load subscription billing');
    } finally {
        loading.value = false;
    }
};

const submitProof = async (): Promise<void> => {
    if (!selectedInvoiceUid.value) {
        toastWarning('Select an invoice first');
        return;
    }
    if (!proofFile.value) {
        toastWarning('Attach payment proof file');
        return;
    }
    try {
        await api.uploadPaymentProof(selectedInvoiceUid.value, {
            file: proofFile.value,
            amount: proofAmount.value || undefined,
            currency: proofCurrency.value || undefined,
            payment_method: proofMethod.value || undefined,
            payment_reference: proofReference.value || undefined,
            note: proofNote.value || undefined,
        });
        toastSuccess('Payment proof uploaded');
        proofAmount.value = '';
        proofMethod.value = '';
        proofReference.value = '';
        proofNote.value = '';
        proofFile.value = null;
        await loadInvoiceProofs(selectedInvoiceUid.value);
    } catch (error) {
        toastError(error instanceof Error ? error.message : 'Upload failed');
    }
};

const downloadProof = async (proof: TenantPaymentProof): Promise<void> => {
    try {
        const blob = await api.downloadPaymentProof(proof.uid);
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = proof.original_filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    } catch (error) {
        toastError(error instanceof Error ? error.message : 'Failed to download proof');
    }
};

onMounted(async () => {
    await refresh();
});
</script>

<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">Tenant subscription, invoices, payments, and off-platform proof uploads.</p>
      <button class="btn btn-outline" :disabled="loading" @click="refresh">Refresh</button>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <article class="rounded-lg border p-4">
        <h3 class="font-semibold">Subscription</h3>
        <p class="text-sm text-muted-foreground" v-if="!subscription">No active subscription.</p>
        <dl v-else class="mt-3 space-y-1 text-sm">
          <div><dt class="inline text-muted-foreground">Plan:</dt> <dd class="inline">{{ subscription.plan_code }}</dd></div>
          <div><dt class="inline text-muted-foreground">Status:</dt> <dd class="inline">{{ subscription.status }}</dd></div>
          <div><dt class="inline text-muted-foreground">Base:</dt> <dd class="inline">{{ fmtMoney(subscription.base_amount) }}</dd></div>
          <div><dt class="inline text-muted-foreground">MRR:</dt> <dd class="inline">{{ fmtMoney(subscription.mrr_snapshot) }}</dd></div>
          <div><dt class="inline text-muted-foreground">Next billing:</dt> <dd class="inline">{{ subscription.next_billing_date || 'n/a' }}</dd></div>
        </dl>
      </article>

      <article class="rounded-lg border p-4">
        <h3 class="font-semibold">Aging Snapshot</h3>
        <dl v-if="overview" class="mt-3 space-y-1 text-sm">
          <div><dt class="inline text-muted-foreground">Current:</dt> <dd class="inline">{{ fmtMoney(overview.aging.current) }}</dd></div>
          <div><dt class="inline text-muted-foreground">30 days:</dt> <dd class="inline">{{ fmtMoney(overview.aging.bucket_30) }}</dd></div>
          <div><dt class="inline text-muted-foreground">60 days:</dt> <dd class="inline">{{ fmtMoney(overview.aging.bucket_60) }}</dd></div>
          <div><dt class="inline text-muted-foreground">90+ days:</dt> <dd class="inline">{{ fmtMoney(overview.aging.bucket_90_plus) }}</dd></div>
        </dl>
        <p class="text-sm text-muted-foreground" v-else>Overview unavailable.</p>
      </article>
    </div>

    <article class="rounded-lg border p-4">
      <h3 class="font-semibold">Invoices</h3>
      <p v-if="!invoices.length" class="text-sm text-muted-foreground">No invoices available.</p>
      <div v-else class="space-y-3 mt-3">
        <div
          v-for="invoice in invoices"
          :key="invoice.uid"
          class="rounded border p-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p class="font-medium">{{ invoice.invoice_number }} <span class="text-xs text-muted-foreground">({{ invoice.status }})</span></p>
            <p class="text-sm text-muted-foreground">Due {{ invoice.due_date || 'n/a' }} | Total {{ fmtMoney(invoice.total_amount, invoice.currency) }}</p>
          </div>
          <div class="flex gap-2">
            <a
              v-if="hostedUrlForInvoice(invoice)"
              :href="hostedUrlForInvoice(invoice)!"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-sm"
            >
              Pay Now
            </a>
            <button class="btn btn-sm btn-outline" @click="selectedInvoiceUid = invoice.uid; loadInvoiceProofs(invoice.uid)">Proofs</button>
          </div>
        </div>
      </div>
    </article>

    <article class="rounded-lg border p-4 space-y-3">
      <h3 class="font-semibold">Upload Off-Platform Payment Proof</h3>
      <div class="grid gap-3 md:grid-cols-2">
        <label class="grid gap-1 text-sm">
          Invoice
          <select v-model="selectedInvoiceUid">
            <option v-for="invoice in invoices" :key="invoice.uid" :value="invoice.uid">
              {{ invoice.invoice_number }} ({{ invoice.status }})
            </option>
          </select>
        </label>
        <label class="grid gap-1 text-sm">
          Amount (optional)
          <input v-model.trim="proofAmount" type="text" placeholder="0.00" />
        </label>
        <label class="grid gap-1 text-sm">
          Currency (optional)
          <input v-model.trim="proofCurrency" type="text" placeholder="USD" />
        </label>
        <label class="grid gap-1 text-sm">
          Payment method (optional)
          <input v-model.trim="proofMethod" type="text" placeholder="bank_transfer|cash|mobile_money" />
        </label>
        <label class="grid gap-1 text-sm">
          Payment reference (optional)
          <input v-model.trim="proofReference" type="text" placeholder="TRX-12345" />
        </label>
        <label class="grid gap-1 text-sm">
          Proof file
          <input type="file" @change="proofFile = (($event.target as HTMLInputElement).files || [])[0] || null" />
        </label>
      </div>
      <label class="grid gap-1 text-sm">
        Note (optional)
        <textarea v-model.trim="proofNote" rows="2" placeholder="Paid via bank transfer on 2026-02-21"></textarea>
      </label>
      <button class="btn" :disabled="loading" @click="submitProof">Upload Proof</button>
      <div>
        <p class="text-sm text-muted-foreground mb-2">Uploaded proofs for selected invoice</p>
        <ul class="space-y-2" v-if="proofsByInvoice[selectedInvoiceUid]?.length">
          <li v-for="proof in proofsByInvoice[selectedInvoiceUid]" :key="proof.uid" class="flex items-center justify-between rounded border p-2">
            <div class="text-sm">
              <p class="font-medium">{{ proof.original_filename }}</p>
              <p class="text-muted-foreground">{{ proof.status }} | {{ proof.payment_reference || 'no-ref' }} | {{ proof.created_at || '' }}</p>
            </div>
            <button class="btn btn-sm btn-outline" @click="downloadProof(proof)">Download</button>
          </li>
        </ul>
        <p v-else class="text-sm text-muted-foreground">No proofs uploaded yet.</p>
      </div>
    </article>

    <article class="rounded-lg border p-4">
      <h3 class="font-semibold">Effective Entitlements</h3>
      <p class="text-sm text-muted-foreground" v-if="!entitlements">Entitlements unavailable.</p>
      <div v-else class="grid gap-4 md:grid-cols-2 mt-3">
        <div>
          <p class="text-sm font-medium mb-1">Limits</p>
          <ul class="text-sm space-y-1">
            <li v-for="limit in entitlements.limits" :key="`${limit.metric_key}-${limit.window}`">
              {{ limit.metric_key }}: {{ limit.limit_value }} / {{ limit.window }}
            </li>
          </ul>
        </div>
        <div>
          <p class="text-sm font-medium mb-1">Features</p>
          <ul class="text-sm space-y-1">
            <li v-for="feature in entitlements.features" :key="feature.feature_key">
              {{ feature.feature_key }}: <strong>{{ feature.enabled ? 'enabled' : 'disabled' }}</strong>
            </li>
          </ul>
        </div>
      </div>
    </article>

    <article class="rounded-lg border p-4">
      <h3 class="font-semibold">Recent Payment Attempts</h3>
      <p v-if="!attempts.length" class="text-sm text-muted-foreground">No payment attempts yet.</p>
      <ul v-else class="mt-3 space-y-2 text-sm">
        <li v-for="attempt in attempts" :key="attempt.uid" class="rounded border p-2">
          {{ attempt.created_at || '' }} | {{ attempt.provider }} | {{ attempt.status }} | {{ fmtMoney(attempt.amount, attempt.currency) }}
          <span v-if="attempt.provider_reference" class="text-muted-foreground"> | ref: {{ attempt.provider_reference }}</span>
        </li>
      </ul>
    </article>
  </section>
</template>
