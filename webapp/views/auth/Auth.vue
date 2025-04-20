<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useAuthStore } from '@/stores/auth';

// Lazy load components
const Login = defineAsyncComponent(() => import('./Login.vue'));
const PasswordReset = defineAsyncComponent(() => import('./PasswordReset.vue'));

// Initialize auth store
const authStore = useAuthStore();
authStore.reset();
</script>

<template>
  <div class="min-h-screen bg-background">
    <div v-if="authStore.auth.forgotPassword">
      <PasswordReset @forgot="authStore.setForgotPassword(false)" />
    </div>
    <div v-else>
      <Login @forgot="authStore.setForgotPassword(true)" />
    </div>
  </div>
</template>
