<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePlatformAuthStore } from '@/stores/platform_auth';

const identifier = ref('');
const password = ref('');
const authStore = usePlatformAuthStore();
const router = useRouter();

const submit = async () => {
    if (!identifier.value || !password.value) {
        return;
    }

    try {
        await authStore.login(identifier.value, password.value);
        await router.push({ name: 'PLATFORM_HOME' });
    } catch {
        // Error state is already captured in the store.
    }
};
</script>

<template>
  <main class="platform-auth">
    <section class="card">
      <h1>Platform Login</h1>
      <p class="subtitle">Authenticate against <code>/api/v1/platform</code>.</p>

      <form class="form" @submit.prevent="submit">
        <label>
          Identifier
          <input v-model="identifier" autocomplete="username" type="text" required />
        </label>

        <label>
          Password
          <input v-model="password" autocomplete="current-password" type="password" required />
        </label>

        <button :disabled="authStore.loading" type="submit">
          {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
    </section>
  </main>
</template>

<style scoped>
.platform-auth {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 1.5rem;
    background: #f3f5f8;
}

.card {
    width: min(420px, 100%);
    background: #ffffff;
    border: 1px solid #d9e0ea;
    border-radius: 10px;
    padding: 1.25rem;
}

.subtitle {
    margin: 0.35rem 0 1rem;
    color: #4b5563;
    font-size: 0.9rem;
}

.form {
    display: grid;
    gap: 0.75rem;
}

label {
    display: grid;
    gap: 0.35rem;
    font-size: 0.9rem;
}

input {
    border: 1px solid #c9d2de;
    border-radius: 8px;
    padding: 0.5rem 0.65rem;
}

button {
    border: 0;
    border-radius: 8px;
    padding: 0.6rem 0.85rem;
    background: #0f4d92;
    color: #fff;
    cursor: pointer;
}

button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.error {
    margin-top: 0.75rem;
    color: #be123c;
    font-size: 0.9rem;
}
</style>
