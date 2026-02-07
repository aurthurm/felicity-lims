<script setup lang="ts">
import { ref, watch } from 'vue';
import useApiUtil from '@/composables/api_util';
import type { StockAdjustmentType, StockLotType, StockItemVariantType } from '@/types/gql';
import type { StockAdjustmentCursorPage } from '@/types/gql';
import {
  GetAllStockLotsDocument,
  GetAllStockLotsQuery,
  GetAllStockLotsQueryVariables,
  GetAllStockAdjustmentsDocument,
  GetAllStockAdjustmentsQuery,
  GetAllStockAdjustmentsQueryVariables,
} from '@/graphql/operations/inventory.queries';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { parseDate } from '@/utils';

defineOptions({ name: 'ProductDetail' });

const props = defineProps<{
  product?: StockItemVariantType | null;
}>();

const { withClientQuery } = useApiUtil();
const stockLots = ref<StockLotType[]>([]);
const stockAdjustments = ref<StockAdjustmentType[]>([]);
const currentTab = ref('stock-lots');
const inventoryTabs = ref(['stock-lots', 'ledger']);

watch(
  () => props.product?.uid,
  async (newUid) => {
    if (!newUid) return;
    const lots = await withClientQuery<GetAllStockLotsQuery, GetAllStockLotsQueryVariables>(
      GetAllStockLotsDocument,
      { productUid: newUid },
      'stockLots',
    );
    stockLots.value = (lots as StockLotType[]) ?? [];
    const paging = await withClientQuery<GetAllStockAdjustmentsQuery, GetAllStockAdjustmentsQueryVariables>(
      GetAllStockAdjustmentsDocument,
      {
        first: 25,
        after: '',
        text: '',
        sortBy: ['-uid'],
        productUid: newUid,
      },
      'stockAdjustmentAll',
    );
    stockAdjustments.value = ((paging as StockAdjustmentCursorPage)?.items ?? []) as StockAdjustmentType[];
  },
);
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-foreground">Stock Item: {{ product?.stockItem?.name }}</h3>
    <p class="text-sm text-muted-foreground">{{ product?.stockItem?.description }}</p>
    <div class="my-4 border-t border-border" />

    <h3 class="text-lg font-medium text-foreground">Stock Variant: {{ product?.name }}</h3>
    <p class="text-sm text-muted-foreground">{{ product?.description }}</p>
    <div class="my-4 border-t border-border" />

    <nav class="flex justify-between rounded-md bg-background shadow-md">
      <div class="flex justify-start">
        <button
          v-for="tab in inventoryTabs"
          :key="tab"
          type="button"
          :class="[
            'rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wide no-underline transition-colors duration-200 text-muted-foreground',
            currentTab === tab ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
          ]"
          @click="currentTab = tab"
        >
          {{ tab }}
        </button>
      </div>
    </nav>

    <div class="pt-4">
      <div v-if="currentTab === 'stock-lots'" class="border border-border bg-card rounded-lg shadow-md">
        <div class="relative w-full overflow-auto">
          <Table class="w-full caption-bottom text-sm">
            <TableHeader class="[&_tr]:border-b">
              <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Lot Number</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Quantity</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Expiry Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody class="[&_tr:last-child]:border-0">
            <template v-if="stockLots.length === 0">
              <TableEmpty :colspan="3">
                <Empty class="border-0 bg-transparent p-0">
                  <EmptyContent>
                    <EmptyHeader>
                      <EmptyTitle>No stock lots available</EmptyTitle>
                      <EmptyDescription>Lots will appear here once stock is received.</EmptyDescription>
                    </EmptyHeader>
                  </EmptyContent>
                </Empty>
              </TableEmpty>
            </template>
            <TableRow
              v-for="lot in stockLots"
              v-else
              :key="lot.uid"
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ lot.lotNumber }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ lot.quantity }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ parseDate(lot.expiryDate, false) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        </div>
      </div>

      <div v-if="currentTab === 'ledger'" class="border border-border bg-card rounded-lg shadow-md">
        <div class="relative w-full overflow-auto">
          <Table class="w-full caption-bottom text-sm">
            <TableHeader class="[&_tr]:border-b">
              <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Lot</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Transaction Type</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Quantity</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody class="[&_tr:last-child]:border-0">
            <template v-if="stockAdjustments.length === 0">
              <TableEmpty :colspan="5">
                <Empty class="border-0 bg-transparent p-0">
                  <EmptyContent>
                    <EmptyHeader>
                      <EmptyTitle>No adjustments recorded</EmptyTitle>
                      <EmptyDescription>Ledger activity will appear here after updates.</EmptyDescription>
                    </EmptyHeader>
                  </EmptyContent>
                </Empty>
              </TableEmpty>
            </template>
            <TableRow
              v-for="adjustment in stockAdjustments"
              v-else
              :key="adjustment.uid"
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ parseDate(adjustment?.adjustmentDate) }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ adjustment?.stockLot?.lotNumber }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ adjustment?.adjustmentType }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ adjustment?.adjust }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ adjustment?.adjustmentBy?.firstName }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  </div>
</template>
