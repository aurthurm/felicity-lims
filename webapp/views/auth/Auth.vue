<script lang="ts" setup>
  import { defineAsyncComponent } from 'vue' 
  const Login = defineAsyncComponent(
    () => import("./Login.vue")
  )
  const PasswordReset = defineAsyncComponent(
    () => import("./PasswordReset.vue")
  )
  import { useAuthStore } from "@/stores/auth";

  const authStore = useAuthStore();
  authStore.reset();
  
</script>

<template>
  <div v-if="authStore.auth.forgotPassword">
    <PasswordReset @forgot="authStore.setForgotPassword(false)" />
  </div>
  <div v-else>
    <Login @forgot="authStore.setForgotPassword(true)" />
  </div>
</template>
