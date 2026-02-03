<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const HeaderMain = defineAsyncComponent(() => import('@/components/layout/HeaderMain.vue'))
const NotificationPanel = defineAsyncComponent(() => import('@/components/notification/NotificationPanel.vue'))
</script>

<template>
  <div class="min-h-screen bg-background">
    <header-main />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <NotificationPanel />
  </div>
</template> 
