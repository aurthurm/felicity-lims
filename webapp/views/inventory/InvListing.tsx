import { computed, watch, defineComponent, reactive, ref, h, defineAsyncComponent } from 'vue';
import { useInventoryStore } from '@/stores/inventory';
import { StockLotType, StockItemVariantType } from '@/types/gql';
import useApiUtil from '@/composables/api_util';
import Modal from '@/components/ui/Modal.vue';
import Drawer from '@/components/ui/Drawer.vue';
import {
    AddStockAdjustmentDocument,
    AddStockAdjustmentMutation,
    AddStockAdjustmentMutationVariables,
} from '@/graphql/operations/inventory.mutations';
import { GetAllStockLotsDocument, GetAllStockLotsQuery, GetAllStockLotsQueryVariables } from '@/graphql/operations/inventory.queries';
import { parseDate } from '@/utils';

const DataTable = defineAsyncComponent(() => import('@/components/common/DataTable.vue'));
const StockReceiveForm = defineAsyncComponent(() => import('./StockReceiveForm.vue'));
const ProductDetail = defineAsyncComponent(() => import('./ProductDetail'));

const InventoryListing = defineComponent({
    name: 'stock-listing',
    setup(props, ctx) {
        const { withClientMutation, withClientQuery } = useApiUtil();
        const inventoryStore = useInventoryStore();
        inventoryStore.fetchProducts({
            first: 50,
            after: '',
            text: '',
            sortBy: ['-uid'],
        });

        const choiceProduct = reactive({
            product: {} as StockItemVariantType,
            quantity: 0,
            stockLotUid: '',
            type: '',
            remarks: '',
        });
        const openAddProduct = ref(false);

        const stockLots = ref([] as StockLotType[]);
        const fetchLots = (productUid: string) => {
            withClientQuery<GetAllStockLotsQuery, GetAllStockLotsQueryVariables>(GetAllStockLotsDocument, { productUid }, 'stockLots').then(
                result => {
                    stockLots.value = result as StockLotType[];
                },
            );
        };

        watch(
            () => choiceProduct.product?.uid,
            (itemUid, _) => itemUid && fetchLots(itemUid),
        );

        const openAdjustProduct = ref(false);
        const openProductDetail = ref(false);
        const productDetailItem = ref({} as StockItemVariantType);

        const tableColumns = ref([
            {
                name: 'UID',
                value: 'uid',
                sortable: true,
                sortBy: 'asc',
                defaultSort: true,
                showInToggler: false,
                hidden: true,
            },
            {
                name: 'Name',
                value: 'stockItem.name',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Type',
                value: 'name',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Category',
                value: 'stockItem.category.name',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Hazard',
                value: 'stockItem.hazard.name',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Quantity',
                value: 'quantity',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Description',
                value: 'description',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Actions',
                value: '',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
                customRender: function (product, _) {
                    return h(
                        'div',
                        {
                            class: 'flex justify-start align-items-center gap-x-4',
                        },
                        [
                            h(
                                'button',
                                {
                                    type: 'button',
                                    class: 'bg-primary text-primary-foreground py-1 px-2 rounded-sm leading-none disabled:bg-muted',
                                    innerHTML: '+ Basket',
                                    disabled: product.quantity < 1,
                                    onClick: () => {
                                        choiceProduct.product = product;
                                        choiceProduct.quantity = 0;
                                        openAddProduct.value = true;
                                    },
                                },
                                [],
                            ),
                            h(
                                'button',
                                {
                                    type: 'button',
                                    class: 'bg-primary text-primary-foreground py-1 px-2 rounded-sm leading-none disabled:bg-muted',
                                    innerHTML: '+/- Adjust',
                                    disabled: product.quantity < 1,
                                    onClick: () => {
                                        choiceProduct.product = product;
                                        choiceProduct.quantity = 0;
                                        openAdjustProduct.value = true;
                                    },
                                },
                                [],
                            ),
                            h(
                                'button',
                                {
                                    type: 'button',
                                    class: 'bg-primary text-primary-foreground py-1 px-2 rounded-sm leading-none',
                                    innerHTML: 'View Detail',
                                    onClick: () => {
                                        openProductDetail.value = true;
                                        productDetailItem.value = product;
                                    },
                                },
                                [],
                            ),
                        ],
                    );
                },
            },
        ]);

        const productParams = reactive({
            first: 50,
            before: '',
            text: '',
            sortBy: ['-uid'],
            filterAction: false,
        });

        return {
            tableColumns,
            inventoryStore,
            openDrawer: ref(false),
            openAddProduct,
            choiceProduct,
            openAdjustProduct,
            stockLots,
            openProductDetail,
            productDetailItem,
            filterProducts: (opts: any) => {
                productParams.first = 50;
                productParams.before = '';
                productParams.text = opts.filterText;
                productParams.filterAction = true;
                inventoryStore.fetchProducts(productParams);
            },
            showMoreProducts: (opts: any) => {
                productParams.first = opts.fetchCount;
                productParams.before = inventoryStore.productsPaging?.pageInfo?.endCursor ?? '';
                productParams.text = opts.filterText;
                productParams.filterAction = false;
                inventoryStore.fetchProducts(productParams);
            },
            countNone: computed(() => inventoryStore.products?.length + ' of ' + inventoryStore.productsPaging.totalCount + ' products'),
            validateMinMax: event => {
                // const value = Math.max(0, Math.min(choiceProduct.product.remaining ?? 0, Number(event.target.value)));
                // choiceProduct.quantity = value;
            },
            adjustStock: () => {
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
                ).then(result => {});
            },
        };
    },
    render() {
        return (
            <>
                <div class="space-y-4">
                    <button
                        onClick={() => (this.openDrawer = true)}
                        class="text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-primary rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    >
                        Receive Stock
                    </button>
                </div>
                <DataTable
                    columns={this.tableColumns}
                    data={this.inventoryStore.products}
                    toggleColumns={false}
                    loading={false}
                    paginable={true}
                    pageMeta={{
                        fetchCount: 10,
                        hasNextPage: false,
                        countNone: this.countNone,
                    }}
                    searchable={true}
                    filterable={false}
                    selectable={false}
                    onOnSearch={x => this.filterProducts(x)}
                    onOnPaginate={x => this.showMoreProducts(x)}
                ></DataTable>

                {/* Drawer */}
                <Drawer show={this.openDrawer} onClose={() => (this.openDrawer = false)}>
                    {{
                        header: () => 'Receive Stock',
                        body: () => [<StockReceiveForm onClose={() => (this.openDrawer = false)} />],
                    }}
                </Drawer>

                {/* Drawer */}
                <Drawer show={this.openProductDetail} onClose={() => (this.openProductDetail = false)}>
                    {{
                        header: () => 'Product Details',
                        body: () => [<ProductDetail product={this.productDetailItem} onClose={() => (this.openProductDetail = false)} />],
                    }}
                </Drawer>

                {this.openAddProduct && (
                    <Modal onClose={() => (this.openAddProduct = false)} contentWidth="w-1/4">
                        {{
                            header: () => (
                                <h3 class="text-foreground text-lg font-medium">
                                    {this.choiceProduct.product?.stockItem?.name} ({this.choiceProduct.product.name})
                                </h3>
                            ),
                            body: () => {
                                return (
                                    <form action="post" class="space-y-4 p-4">
                                        <div class="space-y-2">
                                            <label class="text-foreground block text-sm font-medium">Product Lot</label>
                                            <select
                                                class="text-foreground bg-background border-border focus:ring-primary focus:border-primary w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none"
                                                v-model={this.choiceProduct.stockLotUid}
                                                aria-label="Product Lot"
                                            >
                                                <option value=""></option>
                                                {this.stockLots?.map((lot: StockLotType) => (
                                                    <option key={lot.uid} value={lot.uid}>
                                                        {lot.lotNumber} ({lot.quantity}) [{parseDate(lot.expiryDate, false)}]
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div class="space-y-2">
                                            <label class="text-foreground block text-sm font-medium">Quantity</label>
                                            <input
                                                class="text-foreground bg-background border-border focus:ring-primary focus:border-primary w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none"
                                                type="number"
                                                onChange={this.validateMinMax}
                                                v-model={this.choiceProduct.quantity}
                                                placeholder="Quantity..."
                                            />
                                        </div>
                                        <div class="border-border my-4 border-t"></div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                this.inventoryStore.addToBasket(
                                                    this.choiceProduct.product.uid,
                                                    this.choiceProduct.stockLotUid,
                                                    this.choiceProduct.quantity,
                                                );
                                                this.openAddProduct = false;
                                            }}
                                            class="text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-primary w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={!this.choiceProduct.stockLotUid}
                                        >
                                            Add to basket
                                        </button>
                                    </form>
                                );
                            },
                        }}
                    </Modal>
                )}

                {this.openAdjustProduct && (
                    <Modal onClose={() => (this.openAdjustProduct = false)} contentWidth="w-1/4">
                        {{
                            header: () => (
                                <h3 class="text-foreground text-lg font-medium">
                                    {this.choiceProduct.product?.stockItem?.name} ({this.choiceProduct.product.name})
                                </h3>
                            ),
                            body: () => {
                                return (
                                    <form action="post" class="space-y-4 p-4">
                                        <div class="space-y-2">
                                            <label class="text-foreground block text-sm font-medium">Product Lot</label>
                                            <select
                                                class="text-foreground bg-background border-border focus:ring-primary focus:border-primary w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none"
                                                v-model={this.choiceProduct.stockLotUid}
                                                aria-label="Product Lot"
                                            >
                                                <option value=""></option>
                                                {this.stockLots?.map((lot: StockLotType) => (
                                                    <option key={lot.uid} value={lot.uid}>
                                                        {lot.lotNumber}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div class="space-y-2">
                                            <label class="text-foreground block text-sm font-medium">Adjustment Type</label>
                                            <select
                                                class="text-foreground bg-background border-border focus:ring-primary focus:border-primary w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none"
                                                v-model={this.choiceProduct.type}
                                                aria-label="Adjustment Type"
                                            >
                                                <option value="lost">Lost</option>
                                                <option value="theft">Theft</option>
                                                <option value="transfer-out">Transfer Out</option>
                                            </select>
                                        </div>
                                        <div class="space-y-2">
                                            <label class="text-foreground block text-sm font-medium">Quantity</label>
                                            <input
                                                class="text-foreground bg-background border-border focus:ring-primary focus:border-primary w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none"
                                                type="number"
                                                onChange={this.validateMinMax}
                                                v-model={this.choiceProduct.quantity}
                                                placeholder="Quantity..."
                                            />
                                        </div>
                                        <div class="space-y-2">
                                            <label class="text-foreground block text-sm font-medium">Remarks</label>
                                            <textarea
                                                class="text-foreground bg-background border-border focus:ring-primary focus:border-primary w-full rounded-md border px-3 py-2 shadow-sm transition-colors duration-200 focus:ring-2 focus:outline-none"
                                                rows="3"
                                                v-model={this.choiceProduct.remarks}
                                                placeholder="Remarks..."
                                            ></textarea>
                                        </div>
                                        <div class="border-border my-4 border-t"></div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                this.adjustStock();
                                                this.openAdjustProduct = false;
                                            }}
                                            class="text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-primary w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={!this.choiceProduct.stockLotUid}
                                        >
                                            Adjust
                                        </button>
                                    </form>
                                );
                            },
                        }}
                    </Modal>
                )}
            </>
        );
    },
});
export { InventoryListing };
export default InventoryListing;
