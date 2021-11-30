<template>
  <section class="flex justify-between">
    <h1 class="text-2xl text-gray-800 font-bold">DashBoard</h1>
    <div class="flex justify-end align-items-center">
      <button type="button" class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Today</button>
      <button type="button" class="px-2 py-1 mr-2 border-yellow-500 border text-yellow-500 rounded transition duration-300 hover:bg-yellow-700 hover:text-white focus:outline-none">Yesterday</button>
      <button type="button" class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Week</button>
      <button type="button" class="px-2 py-1 mr-2 border-yellow-500 border text-yellow-500 rounded transition duration-300 hover:bg-yellow-700 hover:text-white focus:outline-none">Last Week</button>
      <button type="button" class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Month</button>
      <button type="button" class="px-2 py-1 mr-2 border-yellow-500 border text-yellow-500 rounded transition duration-300 hover:bg-yellow-700 hover:text-white focus:outline-none">Last Month</button>
      <button type="button" class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Quarter</button>
      <button type="button" class="px-2 py-1 mr-2 border-yellow-500 border text-yellow-500 rounded transition duration-300 hover:bg-yellow-700 hover:text-white focus:outline-none">Last Quarter</button>
      <button type="button" class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Year</button>
      <button type="button" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">All</button>

      <span class="ml-4 mr-1 px-2 py-1 border-gray-500 border text-gray-500 rounded transition duration-300 hover:bg-gray-700 hover:text-white focus:outline-none">12, Jan 2020 - 31 March 2021</span>
      <button type="button" class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Apply</button>
    </div>
  </section>

  <section class="col-span-12 mt-2">

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

    <div class="pt-4">
      <tab-overview v-if="currentTab === 'overview'" />
      <tab-resource v-if="currentTab === 'resource'" />
      <tab-laggard v-if="currentTab === 'laggard'" />
      <tab-notice v-if="currentTab === 'notices'" />
      <tab-line-listing v-if="currentTab === 'line-listing'" />
    </div>

  </section>


</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import tabOverview from './Overview.vue';
import tabLaggard from './Laggard.vue';
import tabResource from './Resource.vue';
import tabLineListing from './LineListing.vue';
import tabNotice from './Notice.vue';

export default defineComponent({
  name: "DashBoard",
  components: {
    tabOverview,
    tabLaggard,
    tabResource,
    tabLineListing,
    tabNotice
  },
  setup() {

    // move this to be managed in a central dash board composable private state
    // also in same state manage dashboard global drill down filters
    let currentTab = ref('overview');
    const tabs = ['overview', 'resource', 'laggard', 'notices', 'line-listing'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);

    //
    return { 
      tabs,
      currentTab,
      currentTabComponent,
    };
  },
});
</script>