<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue'
import { useFullscreen } from '@vueuse/core'
const HeaderMain = defineAsyncComponent(() => import('@/components/nav/NavigationMain.vue'))
const FelNotification = defineAsyncComponent(() => import('@/components/notification/FelNotification.vue'))

const { toggle } = useFullscreen()

onMounted(() => toggle())

// Async components
</script>

<template>
  <div class="font-roboto antialiased min-h-screen flex flex-col">
    <header-main />
    <main class="px-8 pt-4 flex-1">
      <slot />
    </main>
  </div>
  <fel-notification />
</template>

