<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useSampleStore } from '@/stores/sample';
import { useSetupStore } from '@/stores/setup';
import TabsNav from '@/components/ui/tabs/TabsNav.vue';
import PageHeading from '@/components/common/PageHeading.vue';

const StockCategory = defineAsyncComponent(() => import('./StockCategory.vue'));
const StockItem = defineAsyncComponent(() => import('./StockItem.vue'));
const StockUnit = defineAsyncComponent(() => import('./StockUnit.vue'));
const Hazard = defineAsyncComponent(() => import('./Hazard.vue'));

const setupStore = useSetupStore();
const sampleStore = useSampleStore();

const tabs = [
  { id: 'stock-categories', label: 'stock-categories', component: StockCategory },
  { id: 'hazards', label: 'hazards', component: Hazard },
  { id: 'stock-units', label: 'stock-units', component: StockUnit },
  { id: 'stock-items', label: 'stock-items', component: StockItem },
];

sampleStore.fetchSampleTypes();
setupStore.fetchDepartments({});
</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Inventory Management" />
    <TabsNav :tabs="tabs" />
  </div>
</template>
