<script setup lang="ts">
import {computed, defineAsyncComponent} from 'vue';

const FelTabs = defineAsyncComponent(() => import("@/components/ui/tabs/FelTabs.vue"));

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
  <FelTabs :tabs="tabs" initial-tab="abx-qc-range"/>
</template>
