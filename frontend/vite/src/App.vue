<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStreamStore } from './stores'
  import { userPreferenceComposable } from './composables'

  const streamStore = useStreamStore()

  const { loadPreferedTheme } = userPreferenceComposable()

  onMounted(() => {
    loadPreferedTheme()
    streamStore.subscribeToActivityStream()
  })

  if (window.performance.getEntriesByType('navigation').map((nav: any) => nav.type).includes('reload')) {
    loadPreferedTheme()
  }

  const { currentRoute } = useRouter();
  const defaultLayout = 'default';
  const layout = computed(() => `${currentRoute.value.meta.layout || defaultLayout}-layout`);

</script>

<template>
  <component :is="layout">
    <!-- <div class="text-center">Flash Messages will come here.</div> -->
    <router-view />
  </component>
</template>

