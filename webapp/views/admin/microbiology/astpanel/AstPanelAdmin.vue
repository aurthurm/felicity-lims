<script setup lang="ts">
import {computed, defineAsyncComponent} from 'vue';

const FelTabs = defineAsyncComponent(() => import("@/components/ui/tabs/FelTabs.vue"));

const tabs = computed(() => [
  {
    id: "abx-ast-panel", label: "ast-panel",
    component: defineAsyncComponent(() => import("./AstPanel.vue")),
  },
]);
</script>

<template>
  <FelTabs :tabs="tabs" initial-tab="abx-ast-panel"/>
</template>
