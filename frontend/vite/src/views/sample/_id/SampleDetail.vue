<template>

  <section class="col-span-12" >

      <nav class="bg-white px-6 pt-2 shadow-md mt-2">
        <div class="-mb-px flex justify-start">
          <a
            v-for="tab in tabs"
            :key="tab"
            :class="[
              'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 mr-8 tab',
              { 'tab-active': currentTab === tab },
            ]"
            @click="currentTab = tab"
            href="#"
          >
            {{ tab }}
          </a>
        </div>
      </nav>

      <div>
        <tab-results v-if="currentTab === 'analysis-results'" />
        <tab-logs 
        v-if="currentTab === 'logs'"
        targetType="sample"
        :targetId="sample?.uid"
        />
      </div>

  </section>


</template>

<script lang="ts">
import tabResults from './Results.vue';
import tabLogs from '../../components/AuditLog.vue';

import { defineComponent, ref, computed, reactive, toRefs } from 'vue';
import {useStore } from 'vuex';
import { ISample } from '../../../models/analysis';

export default defineComponent({
  name: 'patient-search',
  components: {
    tabResults,
    tabLogs
  },
  setup() {
    let store = useStore();

    const state = reactive({
      currentTab: ref('analysis-results'),
      tabs: ['analysis-results', 'logs'],
      sample: computed<ISample>(() => store.getters.getSample)
    })

    let currentTabComponent = computed(() => 'tab-' + state.currentTab);
    
    return {
      ...toRefs(state),
      currentTabComponent,
    }
  },
});
</script>
