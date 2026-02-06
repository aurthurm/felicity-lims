<script setup lang="ts">
import { computed, reactive, ref, watch, h } from 'vue';
import { useInventoryStore } from '@/stores/inventory';
import type { StockLotType, StockItemVariantType } from '@/types/gql';
import useApiUtil from '@/composables/api_util';
import Modal from '@/components/ui/Modal.vue';
import Drawer from '@/components/ui/Drawer.vue';
import { AddStockAdjustmentDocument, AddStockAdjustmentMutation, AddStockAdjustmentMutationVariables } from '@/graphql/operations/inventory.mutations';
import { GetAllStockLotsDocument, GetAllStockLotsQuery, GetAllStockLotsQueryVariables } from '@/graphql/operations/inventory.queries';
import { parseDate } from '@/utils';
import DataTable from '@/components/common/DataTable.vue';
import StockReceiveForm from './StockReceiveForm.vue';
import ProductDetail from './ProductDetail.vue';

defineOptions({ name: 'StockListing' });

const { withClientMutation, withClientQuery } = useApiUtil();
const inventoryStore = useInventoryStore();
inventoryStore.fetchProducts({
  first: 50,
  after: '',
  text: '',
  sortBy: ['-uid'],
});

const choiceProduct = reactive<{
  product: StockItemVariantType;
  quantity: number;
  stockLotUid: string;
  type: string;
  remarks: string;
}>({
  product: {} as StockItemVariantType,
  quantity: 0,
  stockLotUid: '',
  type: '',
  remarks: '',
});

const openDrawer = ref(false);
const openAddProduct = ref(false);
const openAdjustProduct = ref(false);
const openProductDetail = ref(false);
const productDetailItem = ref<StockItemVariantType>({} as StockItemVariantType);
const stockLots = ref<StockLotType[]>([]);

function fetchLots(productUid: string) {
  withClientQuery<GetAllStockLotsQuery, GetAllStockLotsQueryVariables>(GetAllStockLotsDocument, { productUid }, 'stockLots').then(
    (result) => {
      stockLots.value = (result as StockLotType[]) ?? [];
    },
  );
}

watch(
  () => choiceProduct.product?.uid,
  (itemUid) => itemUid && fetchLots(itemUid),
);

const productParams = reactive({
  first: 50,
  before: '',
  text: '',
  sortBy: ['-uid'],
  filterAction: false,
});

const tableColumns = ref([
  { name: 'UID', value: 'uid', sortable: true, sortBy: 'asc', defaultSort: true, showInToggler: false, hidden: true },
  { name: 'Name', value: 'stockItem.name', sortable: false, sortBy: 'asc', hidden: false },
  { name: 'Type', value: 'name', sortable: false, sortBy: 'asc', hidden: false },
  { name: 'Category', value: 'stockItem.category.name', sortable: false, sortBy: 'asc', hidden: false },
  { name: 'Hazard', value: 'stockItem.hazard.name', sortable: false, sortBy: 'asc', hidden: false },
  { name: 'Quantity', value: 'quantity', sortable: false, sortBy: 'asc', hidden: false },
  { name: 'Description', value: 'description', sortable: false, sortBy: 'asc', hidden: false },
  {
    name: 'Actions',
    value: '',
    sortable: false,
    sortBy: 'asc',
    hidden: false,
    customRender(product: StockItemVariantType) {
      return h('div', { class: 'flex justify-start align-items-center gap-x-4' }, [
        h(
          'button',
          {
            type: 'button',
            class: 'rounded-sm bg-primary px-2 py-1 leading-none text-primary-foreground disabled:bg-muted',
            disabled: product.quantity < 1,
            onClick: () => {
              choiceProduct.product = product;
              choiceProduct.quantity = 0;
              choiceProduct.stockLotUid = '';
              openAddProduct.value = true;
            },
          },
          '+ Basket',
        ),
        h(
          'button',
          {
            type: 'button',
            class: 'rounded-sm bg-primary px-2 py-1 leading-none text-primary-foreground disabled:bg-muted',
            disabled: product.quantity < 1,
            onClick: () => {
              choiceProduct.product = product;
              choiceProduct.quantity = 0;
              choiceProduct.stockLotUid = '';
              choiceProduct.type = '';
              choiceProduct.remarks = '';
              openAdjustProduct.value = true;
            },
          },
          '+/- Adjust',
        ),
        h(
          'button',
          {
            type: 'button',
            class: 'rounded-sm bg-primary px-2 py-1 leading-none text-primary-foreground',
            onClick: () => {
              openProductDetail.value = true;
              productDetailItem.value = product;
            },
          },
          'View Detail',
        ),
      ]);
    },
  },
]);

function filterProducts(opts: { filterText?: string }) {
  productParams.first = 50;
  productParams.before = '';
  productParams.text = opts.filterText ?? '';
  productParams.filterAction = true;
  inventoryStore.fetchProducts(productParams);
}

function showMoreProducts(opts: { fetchCount?: number; filterText?: string }) {
  productParams.first = opts.fetchCount ?? 50;
  productParams.before = inventoryStore.productsPaging?.pageInfo?.endCursor ?? '';
  productParams.text = opts.filterText ?? '';
  productParams.filterAction = false;
  inventoryStore.fetchProducts(productParams);
}

const countNone = computed(() => `${inventoryStore.products?.length ?? 0} of ${inventoryStore.productsPaging?.totalCount ?? 0} products`);

function adjustStock() {
  withClientMutation<AddStockAdjustmentMutation, AddStockAdjustmentMutationVariables>(
    AddStockAdjustmentDocument,
    {
      payload: {
        productUid: choiceProduct.product.uid,
        stockLotUid: choiceProduct.stockLotUid,
        adjustmentType: choiceProduct.type,
        adjust: choiceProduct.quantity,
        remarks: choiceProduct.remarks,
      },
    },
    'createStockAdjustment',
  ).then(() => {});
}

function addToBasketAndClose() {
  inventoryStore.addToBasket(choiceProduct.product.uid, choiceProduct.stockLotUid, choiceProduct.quantity);
  openAddProduct.value = false;
}

function doAdjustAndClose() {
  adjustStock();
  openAdjustProduct.value = false;
}
</script>

<template>
  <div class="space-y-4">
    <button
      type="button"
      class="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      @click="openDrawer = true"
    >
      Receive Stock
    </button>

    <DataTable
      :columns="tableColumns"
      :data="inventoryStore.products"
      :toggle-columns="false"
      :loading="false"
      :paginable="true"
      :page-meta="{ fetchCount: 10, hasNextPage: false, countNone }"
      :searchable="true"
      :filterable="false"
      :selectable="false"
      @on-search="filterProducts"
      @on-paginate="showMoreProducts"
    />

    <Drawer :show="openDrawer" @close="openDrawer = false">
      <template #header>Receive Stock</template>
      <template #body>
        <StockReceiveForm @close="openDrawer = false" />
      </template>
    </Drawer>

    <Drawer :show="openProductDetail" @close="openProductDetail = false">
      <template #header>Product Details</template>
      <template #body>
        <ProductDetail :product="productDetailItem" />
      </template>
    </Drawer>

    <Modal v-if="openAddProduct" content-width="w-1/4" @close="openAddProduct = false">
      <template #header>
        <h3 class="text-lg font-medium text-foreground">
          {{ choiceProduct.product?.stockItem?.name }} ({{ choiceProduct.product?.name }})
        </h3>
      </template>
      <template #body>
        <form class="space-y-4 p-4" action="post" @submit.prevent="addToBasketAndClose">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Product Lot</label>
            <select
              v-model="choiceProduct.stockLotUid"
              class="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Product Lot"
            >
              <option value="">Select lot...</option>
              <option v-for="lot in stockLots" :key="lot.uid" :value="lot.uid">
                {{ lot.lotNumber }} ({{ lot.quantity }}) [{{ parseDate(lot.expiryDate, false) }}]
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Quantity</label>
            <input
              v-model.number="choiceProduct.quantity"
              type="number"
              class="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Quantity..."
            />
          </div>
          <div class="my-4 border-t border-border" />
          <button
            type="submit"
            class="w-full rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!choiceProduct.stockLotUid"
          >
            Add to basket
          </button>
        </form>
      </template>
    </Modal>

    <Modal v-if="openAdjustProduct" content-width="w-1/4" @close="openAdjustProduct = false">
      <template #header>
        <h3 class="text-lg font-medium text-foreground">
          {{ choiceProduct.product?.stockItem?.name }} ({{ choiceProduct.product?.name }})
        </h3>
      </template>
      <template #body>
        <form class="space-y-4 p-4" action="post" @submit.prevent="doAdjustAndClose">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Product Lot</label>
            <select
              v-model="choiceProduct.stockLotUid"
              class="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Product Lot"
            >
              <option value="">Select lot...</option>
              <option v-for="lot in stockLots" :key="lot.uid" :value="lot.uid">
                {{ lot.lotNumber }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Adjustment Type</label>
            <select
              v-model="choiceProduct.type"
              class="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Adjustment Type"
            >
              <option value="lost">Lost</option>
              <option value="theft">Theft</option>
              <option value="transfer-out">Transfer Out</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Quantity</label>
            <input
              v-model.number="choiceProduct.quantity"
              type="number"
              class="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Quantity..."
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground">Remarks</label>
            <textarea
              v-model="choiceProduct.remarks"
              rows="3"
              class="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Remarks..."
            />
          </div>
          <div class="my-4 border-t border-border" />
          <button
            type="submit"
            class="w-full rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!choiceProduct.stockLotUid"
          >
            Adjust
          </button>
        </form>
      </template>
    </Modal>
  </div>
</template>
