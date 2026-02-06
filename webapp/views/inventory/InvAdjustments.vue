<script setup lang="ts">
import { ref, h } from 'vue';
import { useInventoryStore } from '@/stores/inventory';
import DataTable from '@/components/common/DataTable.vue';

defineOptions({ name: 'StockAdjustments' });

const inventoryStore = useInventoryStore();
inventoryStore.fetchAdjustments({
  first: 50,
  after: '',
  text: '',
  sortBy: ['-uid'],
});

const tableColumns = ref([
  { name: 'UID', value: 'uid', sortable: true, sortBy: 'asc', defaultSort: true, showInToggler: false, hidden: true },
  { name: 'ID', value: 'uid', sortable: false, sortBy: 'asc', hidden: false },
  { name: 'Product', value: 'product.name', sortable: false, sortBy: 'asc', hidden: false },
  { name: 'Adjustment Type', value: 'adjustmentType', sortable: false, sortBy: 'asc', hidden: false },
  { name: 'Adjustment', value: 'adjust', sortable: false, sortBy: 'asc', hidden: false },
  { name: 'Date Adjusted', value: 'adjustmentDate', sortable: false, sortBy: 'asc', hidden: false },
  { name: 'Remarks', value: 'remarks', sortable: false, sortBy: 'asc', hidden: false },
  {
    name: 'Adjusted by',
    value: 'adjustmentBy.firstName',
    sortable: false,
    sortBy: 'asc',
    hidden: false,
    customRender(adjustment: { adjustmentBy?: { firstName?: string; lastName?: string } }) {
      return h('span', {}, `${adjustment?.adjustmentBy?.firstName ?? '---'} ${adjustment?.adjustmentBy?.lastName ?? ''}`);
    },
  },
]);
</script>

<template>
  <DataTable
    :columns="tableColumns"
    :data="inventoryStore.adjustments"
    :toggle-columns="false"
    :loading="false"
    :paginable="false"
    :page-meta="{ fetchCount: 10, hasNextPage: false, countNone: '' }"
    :searchable="false"
    :filterable="false"
    :filter-meta="{ defaultFilter: '', filters: [] }"
    :selectable="false"
    :all-checked="false"
  />
</template>
