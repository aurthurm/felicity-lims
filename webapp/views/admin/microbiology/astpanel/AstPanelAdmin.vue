<script setup lang="ts">
import {computed, defineAsyncComponent} from 'vue';

const TabsNav = defineAsyncComponent(() => import("@/components/ui/tabs/TabsNav.vue"));

const tabs = computed(() => [
  {
    id: "abx-ast-panel", label: "ast-panel",
    component: defineAsyncComponent(() => import("./AstPanel.vue")),
  },
]);
</script>

<template>
  <TabsNav :tabs="tabs" initial-tab="abx-ast-panel"/>
</template>
