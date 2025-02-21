<script setup lang="ts">
import {computed, defineAsyncComponent} from 'vue';

const FelTabs = defineAsyncComponent(() => import("@/components/ui/tabs/FelTabs.vue"));

const tabs = computed(() => [
  {
    id: "abx-lab-antibiotics", label: "laboratory antibiotics",
    component: defineAsyncComponent(() => import("./AbxLabAntibiotic.vue")),
  },
  {
    id: "abx-antibiotics", label: "antibiotics",
    component: defineAsyncComponent(() => import("./Antibiotics.vue")),
  },
  {
    id: "abx-antibiotics-guidelines", label: "antibiotics-guidelines",
    component: defineAsyncComponent(() => import("./AbxGuideline.vue")),
  },
]);
</script>

<template>
  <FelTabs :tabs="tabs" initial-tab="abx-lab-antibiotics"/>
</template>
