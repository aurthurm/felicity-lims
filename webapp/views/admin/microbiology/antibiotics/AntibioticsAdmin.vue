<script setup lang="ts">
import {computed, defineAsyncComponent} from 'vue';

const FelTabs = defineAsyncComponent(() => import("@/components/ui/tabs/FelTabs.vue"));

const tabs = computed(() => [
  {
    id: "abx-lab-antibiotics", label: "Laboratory Antibiotics",
    component: defineAsyncComponent(() => import("./AbxLabAntibiotic.vue")),
  },
  {
    id: "abx-antibiotics", label: "Antibiotics",
    component: defineAsyncComponent(() => import("./Antibiotics.vue")),
  },
  {
    id: "abx-antibiotics-guidelines", label: "Antibiotic Guidelines",
    component: defineAsyncComponent(() => import("./AbxGuideline.vue")),
  },
]);
</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Antibiotics Management"></fel-heading>
    <fel-tabs :tabs="tabs" initial-tab="abx-lab-antibiotics"/>
  </div>
</template>
