<script setup lang="ts">
import {computed, defineAsyncComponent} from 'vue';

const TabsNav = defineAsyncComponent(() => import("@/components/ui/tabs/TabsNav.vue"));

const tabs = computed(() => [
  {
    id: "abx-qc-range", label: "qc-range",
    component: defineAsyncComponent(() => import("./AbxQCRange.vue")),
  },
  {
    id: "abx-medium", label: "medium",
    component: defineAsyncComponent(() => import("./AbxMedium.vue")),
  },
]);
</script>

<template>
  <TabsNav :tabs="tabs" initial-tab="abx-qc-range" class="space-y-6"/>
</template>
