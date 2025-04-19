<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useWorksheetStore } from "@/stores/worksheet";
import useWorkSheetComposable from "@/composables/worksheet";

const route = useRoute();
const workshetStore = useWorksheetStore();

const dropdownOpen = ref(false);

workshetStore.fetchWorksheetByUid(route.params?.workSheetUid as string);  
const worksheet = computed(() => {
  const ws = workshetStore.getWorkSheet;
  return ws;
});

const {
  actionWorksheets,
} = useWorkSheetComposable();

const canSubmit = computed(() => {
  if (["pending"].includes(worksheet?.value?.state?.toLowerCase()!)) return true;
  return false;
});
const canApprove = computed(() => {
  if (["awaiting"].includes(worksheet?.value?.state?.toLowerCase()!)) return true;
  return false;
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
          <div>
            <div @click="dropdownOpen = !dropdownOpen"
              class="hidden md:block md:flex md:items-center ml-2 mt-2">
              <button type="button" class="bg-primary text-white px-2 py-1 rounded-sm leading-none">
                {{ worksheet?.state }}
              </button>
              <div class="ml-2">
                <font-awesome-icon icon="chevron-down" class="text-gray-400" />
              </div>
            </div>
            <div v-show="dropdownOpen" @click="dropdownOpen = false" class="fixed inset-0 h-full w-full z-10">
            </div>
            <div v-show="dropdownOpen" class="absolute mt-4 py-0 bg-gray-300 rounded-sm shadow-xl z-20">
              <div v-show="canSubmit" @click="actionWorksheets([worksheet.uid], 'submit')"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-primary hover:text-white">
                Submit
              </div>
              <div v-show="canApprove" @click="actionWorksheets([worksheet.uid], 'approve')"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-primary hover:text-white">
                Approve
              </div>
            </div>
          </div>
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
