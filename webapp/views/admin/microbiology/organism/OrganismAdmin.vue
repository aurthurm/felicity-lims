<script setup lang="ts">
import {computed, defineAsyncComponent} from 'vue';

const TabsNav = defineAsyncComponent(() => import("@/components/ui/tabs/TabsNav.vue"));

const tabs = computed(() => [
  {
    id: "abx-organism", label: "organism",
    component: defineAsyncComponent(() => import("./AbxOrganism.vue")),
  },
  {
    id: "abx-organism-serotype", label: "organism-serotype",
    component: defineAsyncComponent(() => import("./AbxOrganismSerotype.vue")),
  },
  {
    id: "abx-kingdom", label: "kingdom",
    component: defineAsyncComponent(() => import("./AbxKingdom.vue")),
  },
  {
    id: "abx-phylum", label: "phylum",
    component: defineAsyncComponent(() => import("./AbxPhylum.vue")),
  },
  {
    id: "abx-class", label: "class",
    component: defineAsyncComponent(() => import("./AbxClass.vue")),
  },
  {
    id: "abx-order", label: "order",
    component: defineAsyncComponent(() => import("./AbxOrder.vue")),
  },
  {
    id: "abx-family", label: "family",
    component: defineAsyncComponent(() => import("./AbxFamily.vue")),
  },
  {
    id: "abx-genus", label: "genus",
    component: defineAsyncComponent(() => import("./AbxGenus.vue")),
  },
]);
</script>

<template>
  <TabsNav :tabs="tabs" initial-tab="abx-organism"/>
</template>
