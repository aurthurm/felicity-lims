<script setup lang="ts">
import { computed, reactive, ref, h } from 'vue';
import { useInventoryStore } from '@/stores/inventory';
import { useSetupStore } from '@/stores/setup';
import type { StockOrderProductType, StockOrderType } from '@/types/gql';
import type { ExtStockOrderProductType } from '@/types/ext';
import useApiUtil from '@/composables/api_util';
import Drawer from '@/components/ui/Drawer.vue';
import {
  GetAllStockOrderProductsDocument,
  GetAllStockOrderProductsQuery,
  GetAllStockOrderProductsQueryVariables,
} from '@/graphql/operations/inventory.queries';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import {
  EditStockOrderDocument,
  EditStockOrderMutation,
  EditStockOrderMutationVariables,
  IssueStockOrderDocument,
  IssueStockOrderMutation,
  IssueStockOrderMutationVariables,
  SubmitStockOrderDocument,
  SubmitStockOrderMutation,
  SubmitStockOrderMutationVariables,
} from '@/graphql/operations/inventory.mutations';
import * as shield from '@/guards';
import DataTable from '@/components/common/DataTable.vue';

defineOptions({ name: 'StockOrders' });

const { withClientQuery, withClientMutation } = useApiUtil();
const setupStore = useSetupStore();
const inventoryStore = useInventoryStore();
inventoryStore.fetchStockOrders({
  first: 50,
  after: '',
  text: '',
  status: 'preparation',
  sortBy: ['-uid'],
});

const openDrawer = ref(false);
const selectedStockOrder = reactive<{
  order: StockOrderType;
  products: ExtStockOrderProductType[];
  departmentUid: string;
}>({
  order: {} as StockOrderType,
  products: [],
  departmentUid: '',
});

async function getOrderProducts(stockOrderUid: string) {
  const products = await withClientQuery<GetAllStockOrderProductsQuery, GetAllStockOrderProductsQueryVariables>(
    GetAllStockOrderProductsDocument,
    { stockOrderUid },
    'stockOrderProductAll',
  );
  selectedStockOrder.products = ((products as StockOrderProductType[]) ?? []).map((op) => ({
    ...op,
    issue: op.quantity,
  })) as ExtStockOrderProductType[];
}

const tableColumns = ref([
  { name: 'UID', value: 'uid', sortable: true, sortBy: 'asc', defaultSort: true, showInToggler: false, hidden: true },
  {
    name: 'Order Number',
    value: 'orderNumber',
    sortable: false,
    sortBy: 'asc',
    hidden: false,
    customRender(order: StockOrderType) {
      return h('span', {
        innerHTML: order?.orderNumber,
        onClick: () => {
          selectedStockOrder.order = order;
          selectedStockOrder.departmentUid = order?.department?.uid ?? '';
          getOrderProducts(order?.uid ?? '');
          openDrawer.value = true;
        },
      });
    },
  },
  { name: 'Department', value: 'department.name', sortable: false, sortBy: 'asc', hidden: false },
  {
    name: 'Orderer',
    value: 'orderBy',
    sortable: false,
    sortBy: 'asc',
    hidden: false,
    customRender(order: StockOrderType) {
      return h('span', {
        innerHTML: `${order?.orderBy?.firstName ?? '---'} ${order?.orderBy?.lastName ?? ''}`,
      });
    },
  },
  { name: 'Issued By', value: 'status', sortable: false, sortBy: 'asc', hidden: false },
  { name: 'Status', value: 'status', sortable: false, sortBy: 'asc', hidden: false },
]);

const stockOrderParams = reactive({
  first: 50,
  before: '',
  text: '',
  sortBy: ['-uid'],
  filterAction: false,
  status: 'preparation',
});

const filterOptions = [
  { name: 'All', value: '' },
  { name: 'Preparation', value: 'preparation' },
  { name: 'Submitted', value: 'submitted' },
  { name: 'Processed', value: 'processed' },
];

function filterStockOrders(opts: { filterText?: string; filterStatus?: string }) {
  stockOrderParams.first = 50;
  stockOrderParams.before = '';
  stockOrderParams.text = opts.filterText ?? '';
  stockOrderParams.status = opts.filterStatus ?? stockOrderParams.status;
  stockOrderParams.filterAction = true;
  inventoryStore.fetchStockOrders(stockOrderParams);
}

function showMoreStockOrders(opts: { fetchCount?: number; filterText?: string; filterStatus?: string }) {
  stockOrderParams.first = opts.fetchCount ?? 50;
  stockOrderParams.before = inventoryStore.stockOrdersPaging?.pageInfo?.endCursor ?? '';
  stockOrderParams.text = opts.filterText ?? '';
  stockOrderParams.status = opts.filterStatus ?? stockOrderParams.status;
  stockOrderParams.filterAction = false;
  inventoryStore.fetchStockOrders(stockOrderParams);
}

const countNone = computed(
  () => `${inventoryStore.stockOrders?.length ?? 0} of ${inventoryStore.stockOrdersPaging?.totalCount ?? 0} orders`,
);

function issueOrder() {
  const payload = selectedStockOrder.products.map((orderProduct) => ({
    productUid: orderProduct.product?.uid,
    stockLotUid: orderProduct.stockLot?.uid,
    quantity: orderProduct?.issue,
    remarks: 'issue stock',
  }));
  withClientMutation<IssueStockOrderMutation, IssueStockOrderMutationVariables>(
    IssueStockOrderDocument,
    { uid: selectedStockOrder?.order?.uid, payload },
    'issueStockOrder',
  ).then((result) => {
    inventoryStore.issueStockOrder(result);
    openDrawer.value = false;
  });
}

function removeOrderProduct(productUid: string) {
  selectedStockOrder.products = selectedStockOrder.products.filter((oi) => oi?.product?.uid !== productUid);
}

function updateOrder() {
  const productLines = selectedStockOrder.products.map((op) => ({
    productUid: op?.product?.uid,
    stockLotUid: op?.stockLot?.uid,
    quantity: op?.quantity,
    remarks: '',
  }));
  withClientMutation<EditStockOrderMutation, EditStockOrderMutationVariables>(
    EditStockOrderDocument,
    {
      uid: selectedStockOrder.order.uid,
      payload: {
        orderProducts: productLines,
        departmentUid: selectedStockOrder.departmentUid,
      },
    },
    'updateStockOrder',
  ).then((result) => {
    inventoryStore.updateStockOrder(result?.stockOrder);
    openDrawer.value = false;
  });
}

function submitOrder() {
  withClientMutation<SubmitStockOrderMutation, SubmitStockOrderMutationVariables>(
    SubmitStockOrderDocument,
    { uid: selectedStockOrder.order.uid },
    'submitStockOrder',
  ).then((result) => {
    inventoryStore.updateStockOrder(result);
    openDrawer.value = false;
  });
}
</script>

<template>
  <div class="mt-2">
    <DataTable
      :columns="tableColumns"
      :data="inventoryStore.stockOrders"
      :toggle-columns="false"
      :loading="false"
      :paginable="true"
      :page-meta="{ fetchCount: 10, hasNextPage: false, countNone }"
      :searchable="true"
      :filterable="true"
      :filter-meta="{ defaultFilter: stockOrderParams.status, filters: filterOptions }"
      :selectable="false"
      @on-search="filterStockOrders"
      @on-paginate="showMoreStockOrders"
    />

    <Drawer content-width="w-1/2" :show="openDrawer" @close="openDrawer = false">
      <template #header>
        Order: {{ selectedStockOrder?.order?.orderNumber }}
      </template>
      <template #body>
        <template v-if="selectedStockOrder?.order?.status === 'preparation'">
          <div>Status: {{ selectedStockOrder?.order?.status }}</div>
          <hr />
          <label class="mb-4 flex items-center justify-between gap-4">
            <span class="text-foreground">Department</span>
            <select
              v-model="selectedStockOrder.departmentUid"
              class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option v-for="dept in setupStore.departments" :key="dept.uid" :value="dept.uid">
                {{ dept.name }}
              </option>
            </select>
          </label>
          <hr />
          <div class="mb-4 mt-2 overflow-x-auto">
            <div class="inline-block min-w-full overflow-hidden rounded-bl-lg rounded-br-lg bg-background px-2 pt-1 align-middle shadow shadow-dashboard">
              <Table class="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left leading-4 tracking-wider text-foreground">Product</TableHead>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left leading-4 tracking-wider text-foreground">Lot</TableHead>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left text-sm leading-4 tracking-wider text-foreground">Qty</TableHead>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left leading-4 tracking-wider text-foreground" />
                  </TableRow>
                </TableHeader>
                <TableBody class="bg-background">
                  <template v-if="selectedStockOrder.products.length === 0">
                    <TableEmpty :colspan="4">
                      <Empty class="border-0 bg-transparent p-0">
                        <EmptyContent>
                          <EmptyHeader>
                            <EmptyTitle>No products on this order</EmptyTitle>
                            <EmptyDescription>Add products before finalizing the order.</EmptyDescription>
                          </EmptyHeader>
                        </EmptyContent>
                      </Empty>
                    </TableEmpty>
                  </template>
                  <TableRow v-for="item in selectedStockOrder.products" :key="item?.product?.uid">
                    <TableCell><p>{{ item?.product?.name }}</p></TableCell>
                    <TableCell><p>{{ item?.stockLot?.lotNumber }} ({{ item?.stockLot?.quantity }})</p></TableCell>
                    <TableCell class="px-1 py-1">
                      <input v-model.number="item.quantity" type="number" class="rounded border border-input px-2 py-1" placeholder="" />
                    </TableCell>
                    <TableCell class="whitespace-nowrap px-1">
                      <button
                        type="button"
                        class="w-16 rounded-sm bg-primary px-2 py-1 leading-none text-primary-foreground"
                        @click="removeOrderProduct(item?.product?.uid ?? '')"
                      >
                        Remove
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <hr />
          <p class="my-2 text-xs italic text-destructive">
            If you made any changes here please update order first before finalising else your changes wont be saved
          </p>
          <hr />
          <div class="flex justify-start gap-x-4">
            <button
              type="button"
              class="mt-4 rounded-sm bg-primary px-2 py-1 leading-none text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!shield.hasRights(shield.actions.ORDER, shield.objects.PRODUCT)"
              @click="updateOrder()"
            >
              Update
            </button>
            <button
              type="button"
              class="mt-4 rounded-sm bg-primary px-2 py-1 leading-none text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!shield.hasRights(shield.actions.ORDER, shield.objects.PRODUCT)"
              @click="submitOrder()"
            >
              Finalize
            </button>
          </div>
        </template>

        <template v-else-if="['pending', 'submitted'].includes(selectedStockOrder?.order?.status ?? '')">
          <div>Status: {{ selectedStockOrder?.order?.status }}</div>
          <hr />
          <div class="mb-4 mt-4 overflow-x-auto">
            <div class="inline-block min-w-full overflow-hidden rounded-bl-lg rounded-br-lg bg-background px-2 pt-1 align-middle shadow shadow-dashboard">
              <Table class="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left leading-4 tracking-wider text-foreground">Product</TableHead>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left leading-4 tracking-wider text-foreground">Lot</TableHead>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left text-sm leading-4 tracking-wider text-foreground">Available</TableHead>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left text-sm leading-4 tracking-wider text-foreground">Requested</TableHead>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left text-sm leading-4 tracking-wider text-foreground">Issue</TableHead>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left leading-4 tracking-wider text-foreground" />
                  </TableRow>
                </TableHeader>
                <TableBody class="bg-background">
                  <template v-if="selectedStockOrder.products.length === 0">
                    <TableEmpty :colspan="6">
                      <Empty class="border-0 bg-transparent p-0">
                        <EmptyContent>
                          <EmptyHeader>
                            <EmptyTitle>No products on this order</EmptyTitle>
                            <EmptyDescription>Products will appear here once the order is submitted.</EmptyDescription>
                          </EmptyHeader>
                        </EmptyContent>
                      </Empty>
                    </TableEmpty>
                  </template>
                  <TableRow v-for="orderProduct in selectedStockOrder.products" :key="orderProduct.uid">
                    <TableCell><p>{{ orderProduct?.product?.name }}</p></TableCell>
                    <TableCell><p>{{ orderProduct?.stockLot?.lotNumber }}</p></TableCell>
                    <TableCell><p>{{ orderProduct?.stockLot?.quantity }}</p></TableCell>
                    <TableCell><p>{{ orderProduct?.quantity }}</p></TableCell>
                    <TableCell class="whitespace-nowrap px-1 py-1">
                      <input v-model.number="orderProduct.issue" type="number" class="rounded border border-input px-2 py-1" placeholder="" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <hr />
          <button
            type="button"
            class="mt-4 rounded-sm bg-primary px-2 py-1 leading-none text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!shield.hasRights(shield.actions.ISSUE, shield.objects.PRODUCT)"
            @click="issueOrder()"
          >
            Issue Order
          </button>
        </template>

        <template v-else-if="['processed'].includes(selectedStockOrder?.order?.status ?? '')">
          <div>Status: {{ selectedStockOrder?.order?.status }}</div>
          <hr />
          <h4>Request Details</h4>
          <hr />
          <div class="mb-4 mt-4 overflow-x-auto">
            <div class="inline-block min-w-full overflow-hidden rounded-bl-lg rounded-br-lg bg-background px-2 pt-1 align-middle shadow shadow-dashboard">
              <Table class="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left leading-4 tracking-wider text-foreground">Product Name</TableHead>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left text-sm leading-4 tracking-wider text-foreground">Available</TableHead>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left text-sm leading-4 tracking-wider text-foreground">Requested</TableHead>
                    <TableHead class="border-b-2 border-border px-1 py-1 text-left leading-4 tracking-wider text-foreground" />
                  </TableRow>
                </TableHeader>
                <TableBody class="bg-background">
                  <template v-if="selectedStockOrder.products.length === 0">
                    <TableEmpty :colspan="4">
                      <Empty class="border-0 bg-transparent p-0">
                        <EmptyContent>
                          <EmptyHeader>
                            <EmptyTitle>No products on this order</EmptyTitle>
                            <EmptyDescription>There are no products listed for this request.</EmptyDescription>
                          </EmptyHeader>
                        </EmptyContent>
                      </Empty>
                    </TableEmpty>
                  </template>
                  <TableRow v-for="orderProduct in selectedStockOrder.products" :key="orderProduct.uid">
                    <TableCell><p>{{ orderProduct?.product?.name }}</p></TableCell>
                    <TableCell />
                    <TableCell><p>{{ orderProduct.quantity }}</p></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <hr />
        </template>
      </template>
    </Drawer>
  </div>
</template>
