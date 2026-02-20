<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import usePlatformApi, { Tenant } from '@/composables/platform_api';
import { usePlatformAuthStore } from '@/stores/platform_auth';

const api = usePlatformApi();
const authStore = usePlatformAuthStore();
const router = useRouter();

const tenants = ref<Tenant[]>([]);
const busy = ref(false);
const error = ref<string | null>(null);
const message = ref<string>('');

const tenantSlug = ref('');
const moduleKey = ref('');
const failedSlug = ref('');

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

const meJson = computed(() => JSON.stringify(authStore.auth.me ?? {}, null, 2));

const setStatus = (text: string) => {
    message.value = text;
    error.value = null;
};

const setError = (err: unknown) => {
    message.value = '';
    error.value = err instanceof Error ? err.message : 'Request failed';
};

const loadTenants = async () => {
    busy.value = true;
    try {
        const { data } = await api.client.get<Tenant[]>('/tenants');
        const result = data;
        tenants.value = Array.isArray(result) ? result : [];
        setStatus(`Loaded ${tenants.value.length} tenant(s).`);
    } catch (err) {
        setError(err);
    } finally {
        busy.value = false;
    }
};

const loadMe = async () => {
    try {
        const { data } = await api.client.get<Record<string, unknown>>('/auth/me');
        authStore.auth.me = data;
        authStore.persist();
    } catch (err) {
        setError(err);
    }
};

const provisionTenant = async () => {
    busy.value = true;
    try {
        const enabledModules = provisionForm.value.enabledModulesCsv
            .split(',')
            .map(moduleId => moduleId.trim())
            .filter(Boolean);
        const payload = {
            slug: provisionForm.value.slug,
            name: provisionForm.value.name,
            admin_email: provisionForm.value.admin_email,
            initial_lab_name: provisionForm.value.initial_lab_name || undefined,
            primary_industry: provisionForm.value.primary_industry || 'clinical',
            enabled_modules: enabledModules.length ? enabledModules : undefined,
        };
        const { data: result } = await api.client.post('/tenants', payload);
        setStatus(`Tenant provisioned: ${JSON.stringify(result)}`);
        await loadTenants();
    } catch (err) {
        setError(err);
    } finally {
        busy.value = false;
    }
};

const migrateTenant = async () => {
    if (!tenantSlug.value) {
        return;
    }

    busy.value = true;
    try {
        const { data: result } = await api.client.post(`/tenants/${tenantSlug.value}/migrate`);
        setStatus(`Migration started: ${JSON.stringify(result)}`);
    } catch (err) {
        setError(err);
    } finally {
        busy.value = false;
    }
};

const activateTenant = async () => {
    if (!tenantSlug.value) {
        return;
    }

    busy.value = true;
    try {
        const { data: result } = await api.client.post(`/tenants/${tenantSlug.value}/activate`);
        setStatus(`Tenant activated: ${JSON.stringify(result)}`);
        await loadTenants();
    } catch (err) {
        setError(err);
    } finally {
        busy.value = false;
    }
};

const submitAddLab = async () => {
    if (!addLabForm.value.tenantSlug || !addLabForm.value.name) {
        return;
    }

    busy.value = true;
    try {
        const { data: result } = await api.client.post(`/tenants/${addLabForm.value.tenantSlug}/laboratories`, {
            name: addLabForm.value.name,
            setup_name: addLabForm.value.setup_name || 'beak',
        });
        setStatus(`Lab added: ${JSON.stringify(result)}`);
    } catch (err) {
        setError(err);
    } finally {
        busy.value = false;
    }
};

const setModule = async (enabled: boolean) => {
    if (!tenantSlug.value || !moduleKey.value) {
        return;
    }

    busy.value = true;
    try {
        const endpointAction = enabled ? 'enable' : 'disable';
        const { data: result } = await api.client.post(
            `/tenants/${tenantSlug.value}/modules/${moduleKey.value}:${endpointAction}`
        );
        const state = enabled ? 'enabled' : 'disabled';
        setStatus(`Module ${state}: ${JSON.stringify(result)}`);
    } catch (err) {
        setError(err);
    } finally {
        busy.value = false;
    }
};

const cleanupFailed = async () => {
    busy.value = true;
    try {
        const params = {
            slug: failedSlug.value || undefined,
            drop_schema: true,
        };
        const { data: result } = await api.client.delete('/tenants/failed', { params });
        setStatus(`Cleanup failed tenants executed: ${JSON.stringify(result)}`);
    } catch (err) {
        setError(err);
    } finally {
        busy.value = false;
    }
};

const logout = async () => {
    authStore.clear();
    await router.push({ name: 'PLATFORM_LOGIN' });
};

onMounted(async () => {
    if (!authStore.isAuthenticated) {
        await router.replace({ name: 'PLATFORM_LOGIN' });
        return;
    }

    await Promise.all([loadMe(), loadTenants()]);
});
</script>

<template>
  <main class="platform-dashboard">
    <header class="header">
      <h1>Platform Control Dashboard</h1>
      <div class="actions">
        <button :disabled="busy" @click="loadTenants">Refresh Tenants</button>
        <button :disabled="busy" @click="loadMe">Refresh Me</button>
        <button :disabled="busy" class="danger" @click="logout">Logout</button>
      </div>
    </header>

    <p v-if="message" class="ok">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <section class="grid">
      <article class="card">
        <h2>Me Endpoint</h2>
        <pre>{{ meJson }}</pre>
      </article>

      <article class="card">
        <h2>Provision Tenant</h2>
        <form class="form" @submit.prevent="provisionTenant">
          <input v-model="provisionForm.slug" placeholder="slug" required />
          <input v-model="provisionForm.name" placeholder="name" required />
          <input v-model="provisionForm.admin_email" placeholder="admin_email" type="email" required />
          <input v-model="provisionForm.initial_lab_name" placeholder="initial_lab_name (optional)" />
          <input v-model="provisionForm.primary_industry" placeholder="primary_industry (default: clinical)" />
          <input
            v-model="provisionForm.enabledModulesCsv"
            placeholder="enabled modules CSV (optional, e.g. inventory,billing)"
          />
          <button :disabled="busy" type="submit">Provision</button>
        </form>
      </article>

      <article class="card">
        <h2>Tenant Operations</h2>
        <div class="form">
          <input v-model="tenantSlug" placeholder="tenant slug" />
          <button :disabled="busy || !tenantSlug" @click="migrateTenant">Migrate</button>
          <button :disabled="busy || !tenantSlug" @click="activateTenant">Activate</button>
        </div>
      </article>

      <article class="card">
        <h2>Add Lab</h2>
        <form class="form" @submit.prevent="submitAddLab">
          <input v-model="addLabForm.tenantSlug" placeholder="tenant slug" required />
          <input v-model="addLabForm.name" placeholder="lab name" required />
          <input v-model="addLabForm.setup_name" placeholder="setup_name (default: beak)" />
          <button :disabled="busy" type="submit">Add Lab</button>
        </form>
      </article>

      <article class="card">
        <h2>Module Enable / Disable</h2>
        <div class="form">
          <input v-model="tenantSlug" placeholder="tenant slug" />
          <input v-model="moduleKey" placeholder="module key" />
          <div class="actions">
            <button :disabled="busy || !tenantSlug || !moduleKey" @click="setModule(true)">Enable Module</button>
            <button :disabled="busy || !tenantSlug || !moduleKey" class="danger" @click="setModule(false)">Disable Module</button>
          </div>
        </div>
      </article>

      <article class="card">
        <h2>Cleanup Failed Tenants</h2>
        <div class="form">
          <input v-model="failedSlug" placeholder="failed tenant slug (optional)" />
          <button :disabled="busy" class="danger" @click="cleanupFailed">Cleanup Failed (DELETE)</button>
        </div>
      </article>

      <article class="card tenants">
        <h2>Tenant List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Slug</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tenant in tenants" :key="String(tenant.id ?? tenant.uid ?? tenant.slug)">
              <td>{{ tenant.id ?? tenant.uid ?? '-' }}</td>
              <td>{{ tenant.slug ?? '-' }}</td>
              <td>{{ tenant.name ?? '-' }}</td>
              <td>{{ tenant.status ?? (tenant.active ? 'active' : 'unknown') }}</td>
            </tr>
            <tr v-if="!tenants.length">
              <td colspan="4">No tenants found.</td>
            </tr>
          </tbody>
        </table>
      </article>
    </section>
  </main>
</template>

<style scoped>
.platform-dashboard {
    padding: 1rem;
    background: #f7f8fb;
    min-height: 100vh;
    color: #0f172a;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 0.75rem;
}

.card {
    background: #fff;
    border: 1px solid #dae1ea;
    border-radius: 10px;
    padding: 0.9rem;
}

.form {
    display: grid;
    gap: 0.5rem;
}

input,
textarea,
button {
    font: inherit;
}

input,
textarea {
    border: 1px solid #cad4e0;
    border-radius: 8px;
    padding: 0.45rem 0.6rem;
}

button {
    border: 0;
    background: #115197;
    color: #fff;
    border-radius: 8px;
    padding: 0.5rem 0.8rem;
    cursor: pointer;
}

button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

button.danger {
    background: #b91c1c;
}

.ok {
    color: #166534;
}

.error {
    color: #be123c;
}

pre {
    margin: 0;
    max-height: 300px;
    overflow: auto;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.6rem;
    font-size: 0.8rem;
}

.tenants {
    grid-column: 1 / -1;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
    padding: 0.4rem;
    font-size: 0.9rem;
}
</style>
