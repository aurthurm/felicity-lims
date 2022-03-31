<template>
  <component :is="layout">
    <!-- <div class="text-center">Flash Messages will come here.</div> -->
    <router-view />
  </component>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import { ActionTypes } from './store/actions'
  import useStreamComposable from './modules/stream'
  import userPreferenceComposable from './modules/preferences'

  const store = useStore();

  const { initSubscriptions } = useStreamComposable()
  const { loadPreferedTheme } = userPreferenceComposable()

  onMounted(() => {
    loadPreferedTheme()
    initSubscriptions()
  })

  if (window.performance.getEntriesByType('navigation').map((nav: any) => nav.type).includes('reload')) {
    loadPreferedTheme()
    store.dispatch(ActionTypes.PERSIST_AUTH_FROM_LOCAL_STORAGE)
  }

  const { currentRoute } = useRouter();
  const defaultLayout = 'default';
  const layout = computed(() => `${currentRoute.value.meta.layout || defaultLayout}-layout`);

</script>