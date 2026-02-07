<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';
import { AddStockOrderDocument, AddStockOrderMutation, AddStockOrderMutationVariables } from '@/graphql/operations/inventory.mutations';
import useApiUtil from '@/composables/api_util';
import { useInventoryStore } from '@/stores/inventory';
import { useStorageStore } from '@/stores/storage';
import { useSetupStore } from '@/stores/setup';
import { useUserStore } from '@/stores/user';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import TabsNav from '@/components/ui/tabs/TabsNav.vue';
import Drawer from '@/components/ui/Drawer.vue';
import PageHeading from '@/components/common/PageHeading.vue';

defineOptions({ name: 'InventoryView' });

const InventoryAdjustments = defineAsyncComponent(() => import('./InvAdjustments.vue'));
const InventoryListing = defineAsyncComponent(() => import('./InvListing.vue'));
const InventoryOrders = defineAsyncComponent(() => import('./InvOrders.vue'));

const { withClientMutation } = useApiUtil();
const inventoryStore = useInventoryStore();
const setupStore = useSetupStore();
const storageStore = useStorageStore();
const userStore = useUserStore();

inventoryStore.fetchItems({ first: 10000, after: '', text: '', sortBy: ['-uid'] });
userStore.fetchUsers({});
setupStore.fetchSuppliers();
setupStore.fetchDepartments({});
inventoryStore.fetchCategories();
inventoryStore.fetchHazards();
storageStore.fetchStoreRooms();
inventoryStore.fetchUnits();

const viewBasket = ref(false);
const basket = computed(() => inventoryStore.getBasket);

const tabs = computed(() => [
  { id: 'orders', label: 'orders', component: InventoryOrders },
  { id: 'products', label: 'products', component: InventoryListing },
  { id: 'ledger', label: 'ledger', component: InventoryAdjustments },
]);

function createOrder() {
  const basketItems = inventoryStore.getBasket;
  withClientMutation<AddStockOrderMutation, AddStockOrderMutationVariables>(
    AddStockOrderDocument,
    {
      payload: {
        orderProducts: basketItems.map((order) => ({
          productUid: order.product.uid,
          stockLotUid: order.stockLotUid,
          quantity: order.quantity,
          remarks: '',
        })),
        departmentUid: undefined,
      },
    },
    'createStockOrder',
  ).then((result) => {
    inventoryStore.addStockOrder(result?.stockOrder);
    inventoryStore.clearBasket();
    viewBasket.value = false;
  });
}
</script>

<template>
  <div class="space-y-4">
    <PageHeading title="Inventory Management" />

    <TabsNav :tabs="tabs" initial-tab="products" class="rounded-lg" />

    <Drawer :show="viewBasket" class="w-96" @close="viewBasket = false">
      <template #header>Order Basket</template>
      <template #body>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-foreground">Products</h3>
            <button
              type="button"
              class="rounded-md border border-transparent bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              @click="createOrder()"
            >
              Submit Order
            </button>
          </div>

          <div class="border border-border bg-card rounded-lg shadow-md">
            <div class="relative w-full overflow-auto">
              <Table class="w-full caption-bottom text-sm">
                <TableHeader class="[&_tr]:border-b">
                  <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</TableHead>
                    <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Quantity</TableHead>
                    <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody class="[&_tr:last-child]:border-0">
                <template v-if="basket.length === 0">
                  <TableEmpty :colspan="3">
                    <Empty class="border-0 bg-transparent p-0">
                      <EmptyContent>
                        <EmptyHeader>
                          <EmptyTitle>No products in the basket</EmptyTitle>
                          <EmptyDescription>Add products to submit a new order.</EmptyDescription>
                        </EmptyHeader>
                      </EmptyContent>
                    </Empty>
                  </TableEmpty>
                </template>
                <TableRow v-for="item in basket" :key="item.product.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ item.product.name }}</TableCell>
                  <TableCell class="px-4 py-3 align-middle text-right text-sm text-foreground">{{ item.quantity }}</TableCell>
                  <TableCell class="px-4 py-3 align-middle text-right">
                    <button
                      type="button"
                      class="text-destructive transition-colors duration-200 hover:text-destructive/80"
                      @click="inventoryStore.removeFromBasket(item.product.uid)"
                    >
                      Remove
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            </div>
          </div>
        </div>
      </template>
    </Drawer>
  </div>
</template>
