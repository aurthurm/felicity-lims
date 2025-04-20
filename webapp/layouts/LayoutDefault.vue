<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeaderMain = defineAsyncComponent(() => import('@/components/layout/HeaderMain.vue'))
const FelNotification = defineAsyncComponent(() => import('@/components/notification/FelNotification.vue'))
</script>

<template>
  <div class="min-h-screen bg-background">
    <header-main />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <fel-notification />
  </div>
</template> 