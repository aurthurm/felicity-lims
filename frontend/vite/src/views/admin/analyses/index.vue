<script setup lang="ts">
  import { ref, computed } from 'vue';

  import tabAnalysesCategories from './AnalysesCategories.vue';
  import tabAnalysesProfiles from './AnalysesProfiles.vue';
  import tabAnalysesServices from './services/index.vue';
  import tabQualityControlLevels from './QCLevels.vue';
  import tabQualityControlTemplates from './QCTemplates.vue';
  import tabRejectionReasons from './RejectionReasons.vue';

  import { useSampleStore, useSetupStore } from '../../../stores';

  const setupStore = useSetupStore()
  const  sampleStore = useSampleStore()

  let currentTab = ref('analyses-profiles');
  const tabs = [
    'analyses-profiles', 
    'analyses-services', 
    'analyses-categories', 
    'quality-control-levels', 
    'quality-control-templates',
    'rejection-reasons',
  ];
  let currentTabComponent = computed(() => 'tab-' + currentTab.value);

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

        <tab-analyses-profiles v-if="currentTab === 'analyses-profiles'"/>
        <tab-analyses-services v-else-if="currentTab === 'analyses-services'" />
        <tab-analyses-categories v-else-if="currentTab === 'analyses-categories'" />
        <tab-quality-control-levels v-else-if="currentTab === 'quality-control-levels'" />
        <tab-quality-control-templates v-else-if="currentTab === 'quality-control-templates'" />
        <tab-rejection-reasons v-else="currentTab === 'rejection-reasons'" />

  </div>

</template>

<style lang="postcss">

</style>

