<script setup lang="ts">
import { storeToRefs } from "pinia";
import tabOverview from "./Overview.vue";
import tabLaggard from "./Laggard.vue";
import tabResource from "./Resource.vue";
import tabPeformance from "./Peformance.vue";
import tabTat from "./Tat.vue";
import tabLineListing from "./LineListing.vue";
import tabNotice from "./Notice.vue";
import { useDashBoardStore } from "../../stores/dashboard";

const dashBoardStore = useDashBoardStore();
const { dashboard } = storeToRefs(dashBoardStore);
</script>

<template>
  <section class="col-span-12 mt-2">
    <nav class="bg-white shadow-md mt-2">
      <div class="-mb-px flex justify-start">
        <a
          v-for="tab in dashboard.tabs"
          :key="tab"
          :class="[
            'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
            { 'tab-active': dashboard.currentTab === tab },
          ]"
          @click="dashBoardStore.setCurrentTab(tab)"
          href="#"
        >
          {{ tab }}
        </a>
      </div>
    </nav>

    <div class="pt-4" 
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, scale: 1 }"
        :variants="{ custom: { scale: 2 } }"
        :delay="400">
      <tab-overview v-if="dashboard.currentTab === 'overview'" />
      <tab-resource v-if="dashboard.currentTab === 'resource'" />
      <tab-laggard v-if="dashboard.currentTab === 'laggard'" />
      <tab-peformance v-if="dashboard.currentTab === 'peformance'" />
      <tab-tat v-if="dashboard.currentTab === 'tat'" />
      <tab-notice v-if="dashboard.currentTab === 'notices'" />
      <tab-line-listing v-if="dashboard.currentTab === 'line-listing'" />
    </div>
  </section>
</template>
