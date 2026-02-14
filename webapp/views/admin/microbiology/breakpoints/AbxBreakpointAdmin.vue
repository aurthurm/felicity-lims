<script setup lang="ts">
import {computed, defineAsyncComponent} from 'vue';

const BeakTabs = defineAsyncComponent(() => import("@/components/ui/tabs/BeakTabs.vue"));

const tabs = computed(() => [
  {
    id: "abx-breakpoints", label: "breakpoints",
    component: defineAsyncComponent(() => import("./AbxBreakpoint.vue")),
  },
  {
    id: "abx-host", label: "host",
    component: defineAsyncComponent(() => import("./AbxHost.vue")),
  },
  {
    id: "abx-site-of-infection", label: "site-of-infection",
    component: defineAsyncComponent(() => import("./AbxSiteOfInfection.vue")),
  },
  {
    id: "abx-break-point-type", label: "break-point-type",
    component: defineAsyncComponent(() => import("./AbxBreakpointType.vue")),
  },
  {
    id: "abx-test-method", label: "test-method",
    component: defineAsyncComponent(() => import("./AbxTestMethod.vue")),
  },
]);
</script>

<template>
  <BeakTabs :tabs="tabs" initial-tab="abx-breakpoints"/>
</template>
