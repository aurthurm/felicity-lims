<template>
  <div class="">
      <section class="col-span-12" >

        <!-- Sample and Case Data -->
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
          <tab-worksheet-results v-if="currentTab === 'detail'" />
          <tab-assign-samples v-if="currentTab === 'assign-samples'"/>
          <tab-logs 
          v-if="currentTab === 'logs'"
          targetType="worksheet"
          :targetId="worksheet?.uid"
          />
        </div>

      </section>

  </div>

</template>

<style lang="postcss" scoped>
.patient-scroll {
  /* min-height: calc(100vh - 250px); */
  min-height: 100%;
}

.tab-active {
  border-bottom: 2px solid rgb(194, 193, 193);
  color: rgb(37, 37, 37) !important;
}
</style>

<script lang="ts">
import tabAssignSamples from './WorkSheetAssign.vue';
import tabWorksheetResults from './WorkSheetResults.vue';
import tabLogs from '../../components/AuditLog.vue';
import { IWorkSheet } from '../../../store/modules/worksheets'

import { defineComponent, ref, toRefs, computed, PropType } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'worksheet-detail',
  components: {
    tabAssignSamples,
    tabWorksheetResults,
    tabLogs,
  },

  setup(props) {
    let store = useStore();

    let currentTab = ref('detail');
    const tabs = ['detail', 'assign-samples', 'logs'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);

    const worksheet:IWorkSheet = computed(() => store.getters.getWorkSheet)

    return {
      tabs,
      currentTab,
      currentTabComponent,
      worksheet
    };
  },
});
</script>
