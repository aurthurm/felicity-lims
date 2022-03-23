<template>
  <component :is="layout">
    <!-- <div class="text-center">Flash Messages will come here.</div> -->
    <router-view />
  </component>
</template>

<script lang="ts">
  import { defineComponent, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  const defaultLayout = 'default';
  import { ActionTypes } from './store/actions'
  import useStreamComposable from './modules/stream'
  import userPreferenceComposable from './modules/preferences'

  import {
    SUBSCRIBE_TO_ACTIVITY_STREAM
  } from './graphql/stream.subscriptions';

  import { useSubscription } from '@urql/vue'

  export default defineComponent({
    setup() {
      const store = useStore();

      const { initSubscriptions } = useStreamComposable()
      
      initSubscriptions()

      //  const result = useSubscription({
      //   query: SUBSCRIBE_TO_ACTIVITY_STREAM
      // }, (messages = [], response:any) => {
      //   console.log(messages, response)
      //   return [response.newMessages, ...messages];
      // })

      const { loadPreferedTheme } = userPreferenceComposable()

      onMounted(() => {
        loadPreferedTheme()
      })

      if (window.performance.getEntriesByType('navigation').map((nav: any) => nav.type).includes('reload')) {
        loadPreferedTheme()
        store.dispatch(ActionTypes.PERSIST_AUTH_FROM_LOCAL_STORAGE)
      }

      const { currentRoute } = useRouter();

      const layout = computed(() => `${currentRoute.value.meta.layout || defaultLayout}-layout`);

      return {
        layout,
      };
    },
  });
</script>