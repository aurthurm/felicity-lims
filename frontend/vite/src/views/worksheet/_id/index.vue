<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { IAnalysisService } from "../../../models/analysis";
import { useWorksheetStore } from "../../../stores";

const route = useRoute();
const workshetStore = useWorksheetStore();

workshetStore.fetchWorksheetByUid(route.params.workSheetUid);

function analysesText(analyses: IAnalysisService[]): string {
  let names: string[] = [];
  analyses?.forEach((a) => names.push(a.name!));
  return names.join(", ");
}

const worksheet = computed(() => {
  const ws = workshetStore.getWorkSheet;
  return ws;
});
</script>

<template>
  <div class="">
    <div
      class="bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 py-4"
      v-motion-slide-top
    >
      <div class="grid grid-cols-12 gap-1">
        <!-- Meta Column -->
        <div class="col-span-12 flex justify-between font-bold text-medium mb-2">
          <h3>{{ worksheet?.worksheetId }}</h3>
          <button
            type="button"
            class="bg-sky-800 text-white px-2 py-1 rounded-sm leading-none"
          >
            {{ worksheet?.state || "unknown" }}
          </button>
        </div>
        <!-- Summary Column -->
        <div class="col-span-12 sm:col-end-13 px-3 sm:px-0">
          <hr />
          <div class="grid grid-cols-2 mt-2">
            <div class="col-span-1">
              <!-- Client Details -->
              <div class="flex">
                <span class="text-gray-800 text-sm font-semibold w-1/6">Analyst</span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  worksheet?.analyst?.firstName
                }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-md font-semibold w-1/6">Instrument:</span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  worksheet?.instrument?.name
                }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-sm font-semibold w-1/6">Method:</span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  worksheet?.method?.name
                }}</span>
              </div>
            </div>
            <div class="col-span-1">
              <div class="flex">
                <span class="text-gray-800 text-sm font-semibold w-1/6">Analyses:</span>
                <span class="text-gray-600 text-sm md:text-md"
                  >{{ worksheet?.analysis?.name }}
                </span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-sm font-semibold w-1/6">Samples:</span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  worksheet?.assignedCount
                }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-sm font-semibold w-1/6">Template:</span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  worksheet?.template?.name
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <router-view />
  </div>
</template>
