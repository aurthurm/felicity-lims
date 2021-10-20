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

import { defineComponent, ref, toRefs, computed, PropType } from 'vue';
import {useStore } from 'vuex';
export default defineComponent({
  name: 'patient-search',
  components: {
    tabResults,
    tabLogs
  },
  setup(props) {
    let store = useStore();

    let currentTab = ref('analysis-results');
    const tabs = ['analysis-results', 'logs'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);

    const sample:ISampleRequest = computed(() => store.getters.getSample)

    return {
      tabs,
      currentTab,
      currentTabComponent,
      sample,
    }
  },
});
</script>
