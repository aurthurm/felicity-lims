<style lang="postcss">

</style>

<template>
  <div class="mt-4">

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

        <tab-instrument-types v-if="currentTab === 'instrument-types'"/>
        <tab-instruments v-if="currentTab === 'instruments'"/>
        <tab-methods v-if="currentTab === 'methods'" />
        <tab-units v-if="currentTab === 'units'" />

  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import tabInstrumentTypes from './InstrumentTypes.vue'
  import tabInstruments from './Instruments.vue'
  import tabMethods from './Methods.vue'
  import tabUnits from './Units.vue'

  let currentTab = ref('instruments');
  const tabs = ['instrument-types', 'instruments', 'methods', 'units'];
  let currentTabComponent = computed(() => 'tab-' + currentTab.value);
</script>
