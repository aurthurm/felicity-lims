<script setup lang="ts">
import { defineAsyncComponent } from "vue"

// Define dashboard tabs
const tabs = [
  {
    id: "overview",
    label: "Overview",
    component: defineAsyncComponent(() => import("./Overview.vue")),
  },
  {
    id: "resource",
    label: "Resource",
    component: defineAsyncComponent(() => import("./Resource.vue")),
  },
  {
    id: "laggard",
    label: "Laggard",
    component: defineAsyncComponent(() => import("./Laggard.vue")),
  },
  {
    id: "peformance",
    label: "Performance",
    component: defineAsyncComponent(() => import("./Peformance.vue")),
  },
  {
    id: "tat",
    label: "TAT",
    component: defineAsyncComponent(() => import("./Tat.vue")),
  },
  {
    id: "notices",
    label: "Notices",
    component: defineAsyncComponent(() => import("./Notice.vue")),
  },
  {
    id: "line-listing",
    label: "Line Listing",
    component: defineAsyncComponent(() => import("./LineListing.vue")),
  }
]
</script>

<template>
  <div class="">
    <fel-heading title="Dashboard" />
    <fel-tabs :tabs="tabs" />
  </div>
</template>