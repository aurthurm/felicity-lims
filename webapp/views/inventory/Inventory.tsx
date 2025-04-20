import { defineComponent, computed, ref, defineAsyncComponent } from 'vue';
import { AddStockOrderDocument, AddStockOrderMutation, AddStockOrderMutationVariables } from '@/graphql/operations/inventory.mutations';
import  useApiUtil  from '@/composables/api_util';
import { useInventoryStore } from '@/stores/inventory';
import { useStorageStore } from '@/stores/storage';
import { useSetupStore } from '@/stores/setup';
import { useUserStore } from '@/stores/user';

const InventoryAdjustments = defineAsyncComponent(() => import('./InvAdjustments'))
const InventoryListing = defineAsyncComponent(
    () => import('./InvListing')
)
const InventoryOrders = defineAsyncComponent(
    () => import('./InvOrders')
)

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
              id: "orders",
              label: "orders",
              component: <InventoryOrders />,
            },
            {
              id: "products",
              label: "products",
              component: <InventoryListing />
            },
            {
              id: "ledger",
              label: "ledger",
              component: <InventoryAdjustments />
            }
        ]);

        return {
            tabs,
            basket: computed(() => inventoryStore.getBasket),
            viewBasket,
            inventoryStore,
            createOrder: () => {
                const basket = inventoryStore.getBasket;
                withClientMutation<AddStockOrderMutation, AddStockOrderMutationVariables>(AddStockOrderDocument,
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
                    'createStockOrder'
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
                <fel-heading title="Inventory Management" />

                <fel-tabs tabs={this.tabs} initial-tab="listing" class="rounded-lg" />

                <fel-drawer
                    v-model={this.viewBasket}
                    title="Order Basket"
                    class="w-96"
                >
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-medium text-foreground">Products</h3>
                            <button
                                class="px-3 py-1.5 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
                                onClick={() => this.createOrder()}
                            >
                                Submit Order
                            </button>
                        </div>

                        <div class="overflow-hidden shadow ring-1 ring-border ring-opacity-5 rounded-lg">
                            <table class="min-w-full divide-y divide-border">
                                <thead class="bg-muted">
                                    <tr>
                                        <th class="px-3 py-3.5 text-left text-sm font-medium text-foreground">Product</th>
                                        <th class="px-3 py-3.5 text-right text-sm font-medium text-foreground">Quantity</th>
                                        <th class="px-3 py-3.5 text-right text-sm font-medium text-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-border bg-background">
                                    {this.basket.map((item) => (
                                        <tr key={item.product.uid}>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">
                                                {item.product.name}
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-right text-foreground">
                                                {item.quantity}
                                            </td>
                                            <td class="whitespace-nowrap px-3 py-4 text-sm text-right">
                                                <button
                                                    class="text-destructive hover:text-destructive/80 transition-colors duration-200"
                                                    onClick={() => this.inventoryStore.removeFromBasket(item.product.uid)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </fel-drawer>
            </div>
        );
    },
});

export { InventoryHome };
export default InventoryHome
