<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { useSampleStore } from "@/stores";

const FelTabs =  defineAsyncComponent(
  () => import("@/components/ui/tabs/FelTabs.vue")
)

const sampleStore = useSampleStore();

const targetUid = computed(() => sampleStore.sample?.uid || '');

const tabs = [
  {
    id: 'analysis-results',
    label: 'Analysis Results',
    component: defineAsyncComponent(() => import('./Results.vue'))
  },
  {
    id: 'manage-analyses',
    label: 'Manage Analyses',
    component: defineAsyncComponent(() => import('./ManageAnalyses.vue'))
  },
  {
    id: 'logs',
    label: 'Logs',
    component: defineAsyncComponent(() => import('@/components/audit/FelAuditLog.vue')),
    props: { targetType: 'sample', targetUid: targetUid.value}
  },
  {
    id: 'impress-reports',
    label: 'Impress Reports',
    component: defineAsyncComponent(() => import('./Impress.vue'))
  }
];


const hideTab = (tab) => {
  if (tab.id === 'manage-analyses' && sampleStore.sample?.status === 'published') {
    return true;
  }
  return false;
};

// Define emits at the component level
const handleTabChange = (tabId: string) => {
  console.log(`Tab changed to: ${tabId}`);
};
</script>

<template>
   <FelTabs
    :tabs="tabs"
    initial-tab="analysis-results"
    :hide-tab="hideTab"
    @tab-change="handleTabChange"
  />
</template>
