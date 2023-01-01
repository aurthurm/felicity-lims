<script setup lang="ts">
import { ref, computed } from "vue";
import { useSampleStore, useSetupStore } from "../../../stores";

const setupStore = useSetupStore();
const sampleStore = useSampleStore();

let currentTab = ref("analyses-profiles");
const tabs = [
  "analyses-profiles",
  "analyses-services",
  "analyses-categories",
  "quality-control-levels",
  "quality-control-templates",
  "rejection-reasons",
];
let currentTabComponent = computed(() => "tab-" + currentTab.value);

sampleStore.fetchSampleTypes();
setupStore.fetchDepartments({});
</script>

<template>
  <div class="mt-4">
    <nav class="bg-white shadow-md mt-2">
      <div class="-mb-px flex justify-start">
        <a
          v-for="tab in tabs"
          :key="tab"
          :class="[
            'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab',
            { 'tab-active': currentTab === tab },
          ]"
          @click="currentTab = tab"
          href="#"
        >
          {{ tab }}
        </a>
      </div>
    </nav>
  </div>
</template>

<style lang="postcss"></style>
