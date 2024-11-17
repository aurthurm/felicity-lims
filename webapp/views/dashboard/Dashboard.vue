<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const FelTabs = defineAsyncComponent(
  () => import("@/components/ui/tabs/FelTabs.vue")
)
const PageHeading = defineAsyncComponent(
  () => import("@/components/common/FelPageHeading.vue")
);

const tabs = [
  {
    id: "overview",
    label: "overview",
    component: defineAsyncComponent(() => import("./Overview.vue")),
  },
  {
    id: "resource",
    label: "resource",
    component: defineAsyncComponent(() => import("./Resource.vue")),
  },
  {
    id: "laggard",
    label: "laggard",
    component: defineAsyncComponent(() => import("./Laggard.vue")),
  },
  {
    id: "peformance",
    label: "peformance",
    component: defineAsyncComponent(() => import("./Peformance.vue")),
  },
  {
    id: "tat",
    label: "tat",
    component: defineAsyncComponent(() => import("./Tat.vue")),
  },
  {
    id: "notices",
    label: "notices",
    component: defineAsyncComponent(() => import("./Notice.vue")),
  },
  {
    id: "line-listing",
    label: "line-listing",
    component: defineAsyncComponent(() => import("./LineListing.vue")),
  }
]
</script>

<template>
  <page-heading title="Dashboard" />
  <fel-tabs :tabs="tabs" />
</template>
