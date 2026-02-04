<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { VITE_USE_MEGA_MENU } from '@/conf'
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'

const HeaderMain = defineAsyncComponent(() => import('@/components/nav/NavigationMain.vue'))
const SideBar = defineAsyncComponent(() => import('@/components/nav/NavigationSidebar.vue'))
const RightSidebar = defineAsyncComponent(() => import('@/components/nav/NavigationRightSidebar.vue'))

useFullscreen()

// Lifted state so main content can animate margin-right when right panel opens/closes
const rightPanelOpen = ref(false)
</script>

<template>
  <div v-if="VITE_USE_MEGA_MENU" class="min-h-screen flex flex-col">
    <header-main />
    <div class="flex flex-1 min-h-0">
      <main class="flex-1 min-w-0 px-8 pt-4">
        <slot />
      </main>
      <RightSidebar class="shrink-0" />
    </div>
  </div>
  <SidebarProvider v-else>
    <Sidebar collapsible="icon">
      <side-bar />
    </Sidebar>
    <SidebarInset
      class="min-w-0 flex-1 transition-[margin-right] duration-200 ease-linear"
      :style="{ marginRight: rightPanelOpen ? 'var(--right-sidebar-panel-width)' : '0' }"
    >
      <header-main :show-sidebar-toggle="true" />
      <main class="flex-1 min-w-0 px-8 pt-4">
        <slot />
      </main>
    </SidebarInset>
    <RightSidebar
      v-model:right-panel-open="rightPanelOpen"
      class="shrink-0"
    />
  </SidebarProvider>
</template>
