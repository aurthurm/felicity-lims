<script setup lang="ts">
import {defineAsyncComponent} from 'vue'
import {useFullscreen} from '@vueuse/core'
import { VITE_USE_MEGA_MENU } from '@/conf'

const HeaderMain = defineAsyncComponent(() => import('@/components/nav/NavigationMain.vue'))
const SideBar = defineAsyncComponent(() => import('@/components/nav/NavigationSidebar.vue'))
const FelNotification = defineAsyncComponent(() => import('@/components/notification/FelNotification.vue'))

const {toggle} = useFullscreen()

// onMounted(() => toggle())

// Async components
</script>

<template>
  <div v-if="VITE_USE_MEGA_MENU"
  class="font-roboto antialiased min-h-screen flex flex-col">
    <header-main/>
    <main class="px-8 pt-4 flex-1">
      <slot/>
    </main>
  </div>
  <div v-else class="min-h-screen flex flex-col">
    <header-main />
    <div class="flex flex-row flex-1">
      <div class="bg-primary">
        <side-bar />
      </div>
      <main class="px-8 pt-4 flex-1">
        <slot />
      </main>
    </div>
  </div>
  <fel-notification/>
</template>