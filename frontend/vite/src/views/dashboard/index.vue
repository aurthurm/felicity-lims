<template>

  <section class="flex justify-between">
    <h1 class="text-2xl text-gray-800 font-bold">DashBoard</h1>
    <div class="flex justify-end align-items-center">
      <button 
      v-for="(filter, index) in filters"
      :key="index"
      v-show="filter !== filters[filters.length-1]"
      @click="setCurrentFilter(filter)"
      type="button" 
      :class="[
       'px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none',
       {'bg-green-700 text-white': currentFilter === filter }
      ]">{{ filter }}</button>

      <button 
      @click="showModal = true"
      class="ml-4 mr-1 px-2 py-1 border-gray-500 border text-gray-500 rounded transition duration-300 hover:bg-gray-700 hover:text-white focus:outline-none">{{ filterRange.from }} - {{ filterRange.to }}</button>
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
          @click="setCurrentTab(tab)"
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
      <tab-peformance v-if="currentTab === 'peformance'" />
      <tab-tat v-if="currentTab === 'tat'" />
      <tab-notice v-if="currentTab === 'notices'" />
      <tab-line-listing v-if="currentTab === 'line-listing'" />
    </div>

  </section>

  <!-- Custome Date Range Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-1/4'">
    <template v-slot:header>
      <h3>Custom Filter Date Range</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">

        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Date From</span>
            <input
              type="datetime-local"
              class="form-input mt-1 block w-full"
              autocomplete="off"
              v-model="range.from"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Date To</span>
            <input
              type="datetime-local"
              class="form-input mt-1 block w-full"
              v-model="range.to"
              placeholder="Name ..."
            />
          </label>
        </div>

        <hr />
        <button
          type="button"
          @click.prevent="setCustomRange()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>

<script lang="ts">
import modal from '../../components/SimpleModal.vue';
import { defineComponent, ref, reactive } from 'vue'
import tabOverview from './Overview.vue';
import tabLaggard from './Laggard.vue';
import tabResource from './Resource.vue';
import tabPeformance from './Peformance.vue';
import tabTat from './Tat.vue';
import tabLineListing from './LineListing.vue';
import tabNotice from './Notice.vue';

import useDashBoardComposable from '../../modules/dashboard';

export default defineComponent({
  name: "DashBoard",
  components: {
    modal,
    tabOverview,
    tabLaggard,
    tabResource,
    tabPeformance,
    tabTat,
    tabLineListing,
    tabNotice
  },
  setup() {
    const { state, setCurrentTab, setCurrentFilter, setFilterRange } = useDashBoardComposable()

    const localState = reactive({
      range: { from: "", to: "" }
    })
    let showModal = ref(false)

    return { 
      ...state,
      ...localState,
      showModal,
      setCurrentTab, setCurrentFilter,
      setCustomRange: () => setFilterRange(localState.range.from, localState.range.to)
    };
  },
});
</script>