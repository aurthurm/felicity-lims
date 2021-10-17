<template>

  <div class="">
    <div class="bg-white rounded-lg shadow-sm hover:shadow-lg duration-500 px-4 py-4" >
      <div class="grid grid-cols-12 gap-1">
        <!-- Meta Column -->
        <div class="col-span-12 flex justify-between font-md text-medium mb-2">
          <h3>{{ worksheet?.worksheetId }}</h3>
          <button type="button" class="bg-blue-400 text-white p-1 rounded leading-none">{{ worksheet?.state || "unknown" }}</button>
        </div>
        <!-- Summary Column -->
        <div class="col-span-12  sm:col-end-13 px-3 sm:px-0">
          <hr />
          <div class="grid grid-cols-2 mt-2">
            <div class="col-span-1">
              <!-- Client Details -->
              <div class="flex">
                <span class="text-gray-800 text-sm font-medium w-16">Analyst</span>
                <span class="text-gray-600 text-sm md:text-md">{{ worksheet?.analyst?.firstName }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-sm font-medium w-16">Instrument:</span>
                <span class="text-gray-600 text-sm md:text-md">{{ worksheet?.instrument?.name  }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-sm font-medium w-16">Method:</span>
                <span class="text-gray-600 text-sm md:text-md">{{ worksheet?.method?.name  }}</span>
              </div>
            </div>
            <div class="col-span-1">
              <div class="flex">
                <span class="text-gray-800 text-sm font-medium w-16">Analyses:</span>
                <span class="text-gray-600 text-sm md:text-md">{{ analysesText(worksheet?.analyses) }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-sm font-medium w-16">Samples:</span>
                <span class="text-gray-600 text-sm md:text-md">{{ worksheet?.assignedCount }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-sm font-medium w-16">Template:</span>
                <span class="text-gray-600 text-sm md:text-md">{{ worksheet?.template?.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <router-view />

  </div>

</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ActionTypes, WorkSheet } from '../../../store/modules/worksheets';

export default defineComponent({
  name: "worksheet-single",
  setup() {
    const route = useRoute();
    const store = useStore();

    store.dispatch(ActionTypes.FETCH_WORKSHEET_BY_UID, +route.params.workSheetUid)

    function analysesText(analyses: IAnalysis[]): string {
        let names = [];
        analyses?.forEach(a => names.push(a.name));
        return names.join(', ');
    }

    return { 
      worksheet: computed(() => {
        const ws = store.getters.getWorkSheet;
        return ws;
      }),
      analysesText
    };
  },
});
</script>