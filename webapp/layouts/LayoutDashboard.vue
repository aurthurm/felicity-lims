<script setup lang="ts">
import {defineAsyncComponent, ref, onMounted} from 'vue'
import {useFullscreen} from '@vueuse/core'
import userPreferenceComposable from '@/composables/preferences'

const HeaderMain = defineAsyncComponent(() => import('@/components/nav/NavigationMain.vue'))
const SideBar = defineAsyncComponent(() => import('@/components/nav/NavigationSidebar.vue'))
const FelNotification = defineAsyncComponent(() => import('@/components/notification/FelNotification.vue'))

const {toggle} = useFullscreen()
const { megaMenu } = userPreferenceComposable()

// Capture the initial value on mount and don't react to changes
// Changes will take effect on next page load/login
const useMegaMenu = ref(false)
onMounted(() => {
  useMegaMenu.value = megaMenu.value
})

// onMounted(() => toggle())

// Async components
</script>

<template>
  <div v-if="useMegaMenu"
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