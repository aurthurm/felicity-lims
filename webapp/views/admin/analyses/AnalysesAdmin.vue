<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { useRoute } from 'vue-router';
  const tabAnalysesCategories = defineAsyncComponent(
    () => import('./AnalysesCategories.vue')
  )
  const tabAnalysesProfiles = defineAsyncComponent(
    () => import('./AnalysesProfiles.vue')
  ) 
  const tabAnalysesTemplates = defineAsyncComponent(
    () => import('./AnalysesTemplates.vue')
  )
  const tabAnalysesServices = defineAsyncComponent(
    () => import('./services/ServicesAdmin.vue')
  )
  const tabQualityControlLevels = defineAsyncComponent(
    () => import('./QCLevels.vue')
  )
  const tabQualityControlTemplates = defineAsyncComponent(
    () => import('./QCTemplates.vue')
  )
  const tabRejectionReasons = defineAsyncComponent(
    () => import('./RejectionReasons.vue')
  )

  import { useSampleStore } from '@/stores/sample';
  import { useSetupStore } from '@/stores/setup';

  const setupStore = useSetupStore()
  const  sampleStore = useSampleStore()
  const route = useRoute();

  let currentTab = ref(route.query.tab || 'analyses-profiles');
  const tabs = [
    'analyses-profiles', 
    'analyses-services', 
    'analyses-templates',
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
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
             
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <tab-analyses-profiles v-if="currentTab === 'analyses-profiles'"/>
        <tab-analyses-services v-else-if="currentTab === 'analyses-services'" />
        <tab-analyses-templates v-else-if="currentTab === 'analyses-templates'" />
        <tab-analyses-categories v-else-if="currentTab === 'analyses-categories'" />
        <tab-quality-control-levels v-else-if="currentTab === 'quality-control-levels'" />
        <tab-quality-control-templates v-else-if="currentTab === 'quality-control-templates'" />
        <tab-rejection-reasons v-else-if="currentTab === 'rejection-reasons'" />

  </div>

</template>

<style lang="postcss">

</style>

