import { computed, defineComponent, reactive, ref, h, defineAsyncComponent } from 'vue';
import { useInventoryStore } from '@/stores/inventory';
import { useSetupStore } from '@/stores/setup';
import { StockOrderProductType, StockOrderType } from '@/types/gql';
import { ExtStockOrderProductType } from '@/types/ext';
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

const DataTable = defineAsyncComponent(() => import('@/components/common/DataTable.vue'));

const InventoryOrders = defineComponent({
    name: 'stock-orders',
    setup(props, ctx) {
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
        const slectedStockOrder = reactive({
            order: {} as StockOrderType,
            products: [] as ExtStockOrderProductType[],
            departmentUid: '',
        });

        const getOrderProducts = async (stockOrderUid: string) => {
            await withClientQuery<GetAllStockOrderProductsQuery, GetAllStockOrderProductsQueryVariables>(
                GetAllStockOrderProductsDocument,
                { stockOrderUid },
                'stockOrderProductAll',
            ).then(products => {
                slectedStockOrder.products = (products as StockOrderProductType[])?.map(op => ({
                    ...op,
                    issue: op.quantity,
                })) as ExtStockOrderProductType[];
            });
        };

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
                name: 'Order Number',
                value: 'orderNumber',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
                customRender: function (order) {
                    return h(
                        'span',
                        {
                            innerHTML: order?.orderNumber,
                            onClick: () => {
                                slectedStockOrder.order = order;
                                slectedStockOrder.departmentUid = order?.department?.uid;
                                getOrderProducts(order?.uid);
                                openDrawer.value = true;
                            },
                        },
                        [],
                    );
                },
            },
            {
                name: 'Department',
                value: 'department.name',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Orderer',
                value: 'orderBy',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
                customRender: function (order) {
                    return h(
                        'span',
                        {
                            innerHTML: `${order?.orderBy?.firstName ?? '---'} ${order?.orderBy?.lastName ?? ''}`,
                        },
                        [],
                    );
                },
            },
            {
                name: 'Issued By',
                value: 'status',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
            {
                name: 'Status',
                value: 'status',
                sortable: false,
                sortBy: 'asc',
                hidden: false,
            },
        ]);

        const stockOrderParams = reactive({
            first: 50,
            before: '',
            text: '',
            sortBy: ['-uid'],
            filterAction: false,
            status: 'preperation',
        });

        return {
            shield,
            tableColumns,
            inventoryStore,
            setupStore,
            slectedStockOrder,
            openDrawer,
            stockOrderParams,
            filterOptions: [
                { name: 'All', value: '' },
                { name: 'Preperation', value: 'preperation' },
                { name: 'Submitted', value: 'submitted' },
                { name: 'Processed', value: 'processed' },
            ],
            filterStockOrders: (opts: any) => {
                stockOrderParams.first = 50;
                stockOrderParams.before = '';
                stockOrderParams.text = opts.filterText;
                stockOrderParams.status = opts.filterStatus;
                stockOrderParams.filterAction = true;
                inventoryStore.fetchStockOrders(stockOrderParams);
            },
            showMoreStockOrders: (opts: any) => {
                stockOrderParams.first = opts.fetchCount;
                stockOrderParams.before = inventoryStore.stockOrdersPaging?.pageInfo?.endCursor ?? '';
                stockOrderParams.text = opts.filterText;
                stockOrderParams.status = opts.filterStatus;
                stockOrderParams.filterAction = false;
                inventoryStore.fetchStockOrders(stockOrderParams);
            },
            countNone: computed(
                () => inventoryStore.stockOrders?.length + ' of ' + inventoryStore.stockOrdersPaging.totalCount + ' orders',
            ),
            issueOrder: () => {
                const payload: any[] = [];
                for (const orderProduct of slectedStockOrder.products) {
                    payload.push({
                        productUid: orderProduct.product?.uid,
                        stockLotUid: orderProduct.stockLot?.uid,
                        quantity: orderProduct?.issue,
                        remarks: 'issue stock',
                    });
                }
                withClientMutation<IssueStockOrderMutation, IssueStockOrderMutationVariables>(
                    IssueStockOrderDocument,
                    {
                        uid: slectedStockOrder?.order?.uid,
                        payload,
                    },
                    'issueStockOrder',
                ).then(result => {
                    inventoryStore.issueStockOrder(result);
                    openDrawer.value = false;
                });
            },
            removeOrderProduct: (productUid: string) => {
                slectedStockOrder.products = [...slectedStockOrder.products.filter(oi => oi?.product?.uid !== productUid)];
            },
            updateOrder: () => {
                const product_lines: any[] = [];

                for (const op of slectedStockOrder.products) {
                    product_lines.push({
                        productUid: op?.product?.uid,
                        stockLotUid: op?.stockLot?.uid,
                        quantity: op?.quantity,
                        remarks: '',
                    });
                }

                withClientMutation<EditStockOrderMutation, EditStockOrderMutationVariables>(
                    EditStockOrderDocument,
                    {
                        uid: slectedStockOrder.order.uid,
                        payload: {
                            orderProducts: product_lines,
                            departmentUid: slectedStockOrder.departmentUid,
                        },
                    },
                    'updateStockOrder',
                ).then(result => {
                    inventoryStore.updateStockOrder(result?.stockOrder);
                    openDrawer.value = false;
                });
            },
            submitOrder: () => {
                withClientMutation<SubmitStockOrderMutation, SubmitStockOrderMutationVariables>(
                    SubmitStockOrderDocument,
                    {
                        uid: slectedStockOrder.order.uid,
                    },
                    'submitStockOrder',
                ).then(result => {
                    inventoryStore.updateStockOrder(result);
                    openDrawer.value = false;
                });
            },
        };
    },
    render() {
        return (
            <div class="mt-2">
                <DataTable
                    columns={this.tableColumns}
                    data={this.inventoryStore.stockOrders}
                    toggleColumns={false}
                    loading={false}
                    paginable={true}
                    pageMeta={{
                        fetchCount: 10,
                        hasNextPage: false,
                        countNone: this.countNone,
                    }}
                    searchable={true}
                    filterable={true}
                    filterMeta={{
                        defaultFilter: this.stockOrderParams.status,
                        filters: this.filterOptions,
                    }}
                    selectable={false}
                    onOnSearch={x => this.filterStockOrders(x)}
                    onOnPaginate={x => this.showMoreStockOrders(x)}
                ></DataTable>
                {/* Drawer */}
                <Drawer contentWidth="w-1/2" show={this.openDrawer} onClose={() => (this.openDrawer = false)}>
                    {{
                        header: () => `Order: ${this.slectedStockOrder?.order.orderNumber}`,
                        body: () => (
                            <>
                                {this.slectedStockOrder?.order?.status == 'preparation' && (
                                    <>
                                        <div>Status: {this.slectedStockOrder?.order?.status}</div>
                                        <hr />
                                        <label class="mb-4 flex items-center justify-between gap-4">
                                            <span class="text-foreground">Department</span>
                                            <select class="form-select mt-1 block w-full" v-model={this.slectedStockOrder.departmentUid}>
                                                {this.setupStore.departments.map(department => (
                                                    <option value={department.uid}>{department.name}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <hr />
                                        <div class="mt-2 mb-4 overflow-x-auto">
                                            <div class="bg-background shadow-dashboard inline-block min-w-full overflow-hidden rounded-br-lg rounded-bl-lg px-2 pt-1 align-middle shadow">
                                                <Table class="min-w-full">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left leading-4 tracking-wider">
                                                                Product
                                                            </TableHead>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left leading-4 tracking-wider">
                                                                Lot
                                                            </TableHead>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left text-sm leading-4 tracking-wider">
                                                                Qty
                                                            </TableHead>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left leading-4 tracking-wider"></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody class="bg-background">
                                                        {this.slectedStockOrder.products.length === 0 ? (
                                                            <TableEmpty colspan={4}>
                                                                <Empty class="border-0 bg-transparent p-0">
                                                                    <EmptyContent>
                                                                        <EmptyHeader>
                                                                            <EmptyTitle>No products on this order</EmptyTitle>
                                                                            <EmptyDescription>
                                                                                Add products before finalizing the order.
                                                                            </EmptyDescription>
                                                                        </EmptyHeader>
                                                                    </EmptyContent>
                                                                </Empty>
                                                            </TableEmpty>
                                                        ) : (
                                                            this.slectedStockOrder.products.map(item => (
                                                                <TableRow key={item?.product?.uid} v-motion-slide-right>
                                                                    <TableCell>
                                                                        <p>{item?.product?.name}</p>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <p>
                                                                            {item?.stockLot?.lotNumber} ({item?.stockLot?.quantity})
                                                                        </p>
                                                                    </TableCell>
                                                                    <TableCell class="px-1 py-1">
                                                                        <input
                                                                            class="form-input"
                                                                            type="number"
                                                                            v-model={item.quantity}
                                                                            placeholder={''}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell class="whitespace-no-wrap px-1">
                                                                        <button
                                                                            type="button"
                                                                            class="bg-primary text-primary-foreground w-16 rounded-sm px-2 py-1 leading-none"
                                                                            onClick={() =>
                                                                                this.removeOrderProduct(item?.product?.uid ?? '')
                                                                            }
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                        <hr />
                                        <div class="my-2">
                                            <p class="text-destructive text-xs italic">
                                                If you made any changes here please update order first before finalising else your changes
                                                wont be saved
                                            </p>
                                        </div>
                                        <hr />
                                        <div class="flex justify-start gap-x-4">
                                            <button
                                                type="button"
                                                onClick={() => this.updateOrder()}
                                                class="bg-primary text-primary-foreground mt-4 rounded-sm px-2 py-1 leading-none disabled:cursor-not-allowed disabled:opacity-50"
                                                disabled={!this.shield.hasRights(shield.actions.ORDER, shield.objects.PRODUCT)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => this.submitOrder()}
                                                class="bg-primary text-primary-foreground mt-4 rounded-sm px-2 py-1 leading-none disabled:cursor-not-allowed disabled:opacity-50"
                                                disabled={!this.shield.hasRights(shield.actions.ORDER, shield.objects.PRODUCT)}
                                            >
                                                Finalize
                                            </button>
                                        </div>
                                    </>
                                )}
                                {['pending', 'submitted'].includes(this.slectedStockOrder?.order?.status ?? '') && (
                                    <>
                                        <div>Status: {this.slectedStockOrder?.order?.status}</div>
                                        <hr />
                                        <div class="mt-4 mb-4 overflow-x-auto">
                                            <div class="bg-background shadow-dashboard inline-block min-w-full overflow-hidden rounded-br-lg rounded-bl-lg px-2 pt-1 align-middle shadow">
                                                <Table class="min-w-full">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left leading-4 tracking-wider">
                                                                Product
                                                            </TableHead>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left leading-4 tracking-wider">
                                                                Lot
                                                            </TableHead>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left text-sm leading-4 tracking-wider">
                                                                Available
                                                            </TableHead>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left text-sm leading-4 tracking-wider">
                                                                Requested
                                                            </TableHead>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left text-sm leading-4 tracking-wider">
                                                                Issue
                                                            </TableHead>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left leading-4 tracking-wider"></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody class="bg-background">
                                                        {this.slectedStockOrder.products.length === 0 ? (
                                                            <TableEmpty colspan={6}>
                                                                <Empty class="border-0 bg-transparent p-0">
                                                                    <EmptyContent>
                                                                        <EmptyHeader>
                                                                            <EmptyTitle>No products on this order</EmptyTitle>
                                                                            <EmptyDescription>
                                                                                Products will appear here once the order is submitted.
                                                                            </EmptyDescription>
                                                                        </EmptyHeader>
                                                                    </EmptyContent>
                                                                </Empty>
                                                            </TableEmpty>
                                                        ) : (
                                                            this.slectedStockOrder.products.map(orderProduct => (
                                                                <TableRow key={orderProduct.uid} v-motion-slide-right>
                                                                    <TableCell>
                                                                        <p>{orderProduct?.product?.name}</p>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <p>{orderProduct?.stockLot?.lotNumber}</p>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <p>{orderProduct?.stockLot?.quantity}</p>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <p>{orderProduct?.quantity}</p>
                                                                    </TableCell>
                                                                    <TableCell class="whitespace-no-wrap px-1 py-1">
                                                                        <label class="block">
                                                                            <input
                                                                                class="form-input"
                                                                                type="number"
                                                                                v-model={orderProduct.issue}
                                                                                placeholder={''}
                                                                            />
                                                                        </label>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                        <hr />
                                        <button
                                            type="button"
                                            class="bg-primary text-primary-foreground mt-4 rounded-sm px-2 py-1 leading-none disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={!this.shield.hasRights(shield.actions.ISSUE, shield.objects.PRODUCT)}
                                            onClick={() => this.issueOrder()}
                                        >
                                            Issue Order
                                        </button>
                                    </>
                                )}
                                {['processed'].includes(this.slectedStockOrder?.order?.status ?? '') && (
                                    <>
                                        <div>Status: {this.slectedStockOrder?.order?.status}</div>
                                        <hr />
                                        <h4>Request Details</h4>
                                        <hr />
                                        <div class="mt-4 mb-4 overflow-x-auto">
                                            <div class="bg-background shadow-dashboard inline-block min-w-full overflow-hidden rounded-br-lg rounded-bl-lg px-2 pt-1 align-middle shadow">
                                                <Table class="min-w-full">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left leading-4 tracking-wider">
                                                                Product Name
                                                            </TableHead>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left text-sm leading-4 tracking-wider">
                                                                Available
                                                            </TableHead>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left text-sm leading-4 tracking-wider">
                                                                Requested
                                                            </TableHead>
                                                            <TableHead class="border-border text-foreground border-b-2 px-1 py-1 text-left leading-4 tracking-wider"></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody class="bg-background">
                                                        {this.slectedStockOrder.products.length === 0 ? (
                                                            <TableEmpty colspan={4}>
                                                                <Empty class="border-0 bg-transparent p-0">
                                                                    <EmptyContent>
                                                                        <EmptyHeader>
                                                                            <EmptyTitle>No products on this order</EmptyTitle>
                                                                            <EmptyDescription>
                                                                                There are no products listed for this request.
                                                                            </EmptyDescription>
                                                                        </EmptyHeader>
                                                                    </EmptyContent>
                                                                </Empty>
                                                            </TableEmpty>
                                                        ) : (
                                                            this.slectedStockOrder.products.map(
                                                                (orderProduct: ExtStockOrderProductType) => (
                                                                    <TableRow key={orderProduct.uid} v-motion-slide-right>
                                                                        <TableCell>
                                                                            <p>{orderProduct?.product?.name}</p>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {/* <p>{orderProduct?.product?.remaining}</p> */}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <p>{orderProduct.quantity}</p>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ),
                                                            )
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                        <hr />
                                    </>
                                )}
                            </>
                        ),
                        footer: () => [],
                    }}
                </Drawer>
            </div>
        );
    },
});

export { InventoryOrders };
export default InventoryOrders;
