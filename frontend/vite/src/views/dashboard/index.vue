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
    <nav class="bg-white px-6 pt-2 shadow-md mt-2">
      <div class="-mb-px flex justify-start">
        <a
          v-for="tab in dashboard.tabs"
          :key="tab"
          :class="[
            'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 mr-8 tab',
            { 'tab-active': dashboard.currentTab === tab },
          ]"
          @click="dashBoardStore.setCurrentTab(tab)"
          href="#"
        >
          {{ tab }}
        </a>
      </div>
    </nav>

    <div class="pt-4">
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
