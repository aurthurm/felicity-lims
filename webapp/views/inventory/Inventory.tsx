import { defineComponent, computed, ref, defineAsyncComponent } from 'vue';
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
const InventoryAdjustments = defineAsyncComponent(() => import('./InvAdjustments'));
const InventoryListing = defineAsyncComponent(() => import('./InvListing'));
const InventoryOrders = defineAsyncComponent(() => import('./InvOrders'));

const InventoryHome = defineComponent({
    name: 'inventory-home',
    setup() {
        const { withClientMutation } = useApiUtil();

        // Prefetch data
        const inventoryStore = useInventoryStore();
        const setupStore = useSetupStore();
        const storageStore = useStorageStore();
        const userStore = useUserStore();
        inventoryStore.fetchItems({
            first: 10000,
            after: '',
            text: '',
            sortBy: ['-uid'],
        });
        userStore.fetchUsers({});
        setupStore.fetchSuppliers();
        setupStore.fetchDepartments({});
        inventoryStore.fetchCategories();
        inventoryStore.fetchHazards();
        storageStore.fetchStoreRooms();
        inventoryStore.fetchUnits();

        const viewBasket = ref(false);

        const tabs = computed(() => [
            {
                id: 'orders',
                label: 'orders',
                component: <InventoryOrders />,
            },
            {
                id: 'products',
                label: 'products',
                component: <InventoryListing />,
            },
            {
                id: 'ledger',
                label: 'ledger',
                component: <InventoryAdjustments />,
            },
        ]);

        return {
            tabs,
            basket: computed(() => inventoryStore.getBasket),
            viewBasket,
            inventoryStore,
            createOrder: () => {
                const basket = inventoryStore.getBasket;
                withClientMutation<AddStockOrderMutation, AddStockOrderMutationVariables>(
                    AddStockOrderDocument,
                    {
                        payload: {
                            orderProducts: basket.map(order => ({
                                productUid: order.product.uid,
                                stockLotUid: order.stockLotUid,
                                quantity: order.quantity,
                                remarks: '',
                            })),
                            departmentUid: undefined,
                        },
                    },
                    'createStockOrder',
                ).then(result => {
                    inventoryStore.addStockOrder(result?.stockOrder);
                    inventoryStore.clearBasket();
                    viewBasket.value = false;
                });
            },
        };
    },
    render() {
        return (
            <div class="space-y-4">
                <PageHeading title="Inventory Management" />

                <TabsNav tabs={this.tabs} initial-tab="listing" class="rounded-lg" />

                <Drawer
                    show={this.viewBasket}
                    onClose={() => (this.viewBasket = false)}
                    class="w-96"
                    v-slots={{
                        header: () => 'Order Basket',
                        body: () => (
                            <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <h3 class="text-foreground text-lg font-medium">Products</h3>
                            <button
                                class="text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-primary rounded-md border border-transparent px-3 py-1.5 text-sm font-medium shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                                onClick={() => this.createOrder()}
                            >
                                Submit Order
                            </button>
                        </div>

                        <div class="ring-border ring-opacity/5 overflow-hidden rounded-lg shadow ring-1">
                            <Table class="divide-border min-w-full divide-y">
                                <TableHeader class="bg-muted">
                                    <TableRow>
                                        <TableHead class="text-foreground px-3 py-3.5 text-left text-sm font-medium">Product</TableHead>
                                        <TableHead class="text-foreground px-3 py-3.5 text-right text-sm font-medium">Quantity</TableHead>
                                        <TableHead class="text-foreground px-3 py-3.5 text-right text-sm font-medium">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody class="divide-border bg-background divide-y">
                                    {this.basket.length === 0 ? (
                                        <TableEmpty colspan={3}>
                                            <Empty class="border-0 bg-transparent p-0">
                                                <EmptyContent>
                                                    <EmptyHeader>
                                                        <EmptyTitle>No products in the basket</EmptyTitle>
                                                        <EmptyDescription>Add products to submit a new order.</EmptyDescription>
                                                    </EmptyHeader>
                                                </EmptyContent>
                                            </Empty>
                                        </TableEmpty>
                                    ) : (
                                        this.basket.map(item => (
                                            <TableRow key={item.product.uid}>
                                                <TableCell class="text-foreground px-3 py-4 text-sm whitespace-nowrap">
                                                    {item.product.name}
                                                </TableCell>
                                                <TableCell class="text-foreground px-3 py-4 text-right text-sm whitespace-nowrap">
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell class="px-3 py-4 text-right text-sm whitespace-nowrap">
                                                    <button
                                                        class="text-destructive hover:text-destructive/80 transition-colors duration-200"
                                                        onClick={() => this.inventoryStore.removeFromBasket(item.product.uid)}
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
                        ),
                    }}
                >
                </Drawer>
            </div>
        );
    },
});

export { InventoryHome };
export default InventoryHome;
