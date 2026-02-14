<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeaderMain = defineAsyncComponent(() => import('@/components/layout/HeaderMain.vue'))
const BeakNotification = defineAsyncComponent(() => import('@/components/notification/BeakNotification.vue'))
</script>

<template>
  <div class="min-h-screen bg-background">
    <header-main />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <beak-notification />
  </div>
</template> 