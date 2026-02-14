<script setup lang="ts">
import {computed, defineAsyncComponent} from 'vue';

const BeakTabs = defineAsyncComponent(() => import("@/components/ui/tabs/BeakTabs.vue"));

const tabs = computed(() => [
  {
    id: "abx-ast-panel", label: "ast-panel",
    component: defineAsyncComponent(() => import("./AstPanel.vue")),
  },
]);
</script>

<template>
  <BeakTabs :tabs="tabs" initial-tab="abx-ast-panel"/>
</template>
