<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const tabs = [
  {
    id: "overview",
    label: "Overview",
    component: defineAsyncComponent(() => import("./Overview.vue")),
    summary: "Operational totals and workflow health",
  },
  {
    id: "resource",
    label: "Resource",
    component: defineAsyncComponent(() => import("./Resource.vue")),
    summary: "Instrument and staff utilization",
  },
  {
    id: "laggard",
    label: "Laggard",
    component: defineAsyncComponent(() => import("./Laggard.vue")),
    summary: "Slowest items and bottlenecks",
  },
  {
    id: "peformance",
    label: "Performance",
    component: defineAsyncComponent(() => import("./Peformance.vue")),
    summary: "Time-to-complete process metrics",
  },
  {
    id: "tat",
    label: "TAT",
    component: defineAsyncComponent(() => import("./Tat.vue")),
    summary: "Turn-around-time tracking",
  },
  {
    id: "notices",
    label: "Notices",
    component: defineAsyncComponent(() => import("./Notice.vue")),
    summary: "Important laboratory communication",
  },
  {
    id: "line-listing",
    label: "Line Listing",
    component: defineAsyncComponent(() => import("./LineListing.vue")),
    summary: "Detailed operational listing",
  },
  {
    id: "inventory",
    label: "Inventory",
    component: defineAsyncComponent(() => import("./Inventory.vue")),
    summary: "Stock and consumption snapshots",
  },
];
</script>

<template>
  <section class="space-y-4">
    <beak-tabs :tabs="tabs" />
  </section>
</template>
