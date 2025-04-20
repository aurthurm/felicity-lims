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

  sampleStore.fetchSampleTypes();    
  setupStore.fetchDepartments({});   

</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Analyses Administration"></fel-heading>

    <!-- Tabs -->
    <nav class="border-b border-border">
      <div class="flex space-x-2">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="[
            'px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            currentTab === tab
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="currentTab = tab"
        >
          {{ tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }}
        </button>
      </div>
    </nav>

    <!-- Tab Content -->
    <div class="mt-6">
      <tab-analyses-profiles v-if="currentTab === 'analyses-profiles'"/>
      <tab-analyses-services v-else-if="currentTab === 'analyses-services'" />
      <tab-analyses-templates v-else-if="currentTab === 'analyses-templates'" />
      <tab-analyses-categories v-else-if="currentTab === 'analyses-categories'" />
      <tab-quality-control-levels v-else-if="currentTab === 'quality-control-levels'" />
      <tab-quality-control-templates v-else-if="currentTab === 'quality-control-templates'" />
      <tab-rejection-reasons v-else-if="currentTab === 'rejection-reasons'" />
    </div>
  </div>
</template>

