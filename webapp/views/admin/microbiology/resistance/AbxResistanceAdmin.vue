<script setup lang="ts">
import {computed, defineAsyncComponent} from 'vue';

const TabsNav = defineAsyncComponent(() => import("@/components/ui/tabs/TabsNav.vue"));

const tabs = computed(() => [
  {
    id: "abx-expert-interpretation-rule", label: "expert-interpretation-rule",
    component: defineAsyncComponent(() => import("./AbxExpertInterpretationRule.vue")),
  },
  {
    id: "abx-ext-res-phenotype", label: "expected-resistance-phenotype",
    component: defineAsyncComponent(() => import("./AbxExpResPhenotype.vue")),
  }
]);
</script>

<template>
  <TabsNav :tabs="tabs" initial-tab="antibiotics"/>
</template>
