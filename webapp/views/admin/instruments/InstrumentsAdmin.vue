<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  const tabInstrumentTypes = defineAsyncComponent(
    () => import('./InstrumentTypes.vue')
  )
  const tabLaboratoryInstruments = defineAsyncComponent(
    () => import('./LaboratoryInstruments.vue')
  )
  const tabInstruments = defineAsyncComponent(
    () => import('./Instruments.vue')
  )
  const tabMethods = defineAsyncComponent(
    () => import('./Methods.vue')
  )
  const tabUnits = defineAsyncComponent(
    () => import('./Units.vue')
  )

  let currentTab = ref('laboratory-instruments');
  const tabs = ['laboratory-instruments', 'instrument-types', 'instruments', 'methods', 'units'];
  let currentTabComponent = computed(() => 'tab-' + currentTab.value);
</script>

<template>
  <div class="mt-4">

        <nav class="bg-white shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
             
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <tab-laboratory-instruments v-if="currentTab === 'laboratory-instruments'"/>
        <tab-instrument-types v-if="currentTab === 'instrument-types'"/>
        <tab-instruments v-if="currentTab === 'instruments'"/>
        <tab-methods v-if="currentTab === 'methods'" />
        <tab-units v-if="currentTab === 'units'" />

  </div>
</template>


