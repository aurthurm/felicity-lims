<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { useRoute } from 'vue-router';
  import { useSampleStore } from '@/stores/sample';
  import { useSetupStore } from '@/stores/setup';

  const setupStore = useSetupStore()
  const  sampleStore = useSampleStore()
  const route = useRoute();

  let currentTab = ref(route.query.tab || 'analyses-profiles');

  // Tabs definition
  const tabs = computed(() => [
    {
      id: "analyses-profiles",
      label: "Analyses Profiles",
      component: defineAsyncComponent(() =>
        import("./AnalysesProfiles.vue")
      )
    },
    {
      id: "analyses-services",
      label: "Analyses Services",
      component: defineAsyncComponent(() =>
        import("./services/ServicesAdmin.vue")
      )
    },
    {
      id: "analyses-templates",
      label: "Analyses Templates",
      component: defineAsyncComponent(() =>
        import("./AnalysesTemplates.vue")
      )
    },
    {
      id: "analyses-categories",
      label: "Analyses-Categories",
      component: defineAsyncComponent(() =>
        import("./AnalysesCategories.vue")
      )
    },
    {
      id: "quality-control-levels",
      label: "Quality Control Levels",
      component: defineAsyncComponent(() =>
        import("./QCLevels.vue")
      )
    },
    {
      id: "quality-control-templates",
      label: "Quality Control Templates",
      component: defineAsyncComponent(() =>
        import("./QCTemplates.vue")
      )
    },
    {
      id: "rejection-reasons",
      label: "Rejection Reasons",
      component: defineAsyncComponent(() =>
        import("./RejectionReasons.vue")
      )
    }
  ]);

  sampleStore.fetchSampleTypes();    
  setupStore.fetchDepartments({});   

</script>

<template>
  <div class="space-y-6">
    <beak-heading title="Analyses Administration"></beak-heading>

    <beak-tabs :tabs="tabs" :initial-tab="currentTab" class="rounded-lg" />
  </div>
</template>

