import { defineComponent, computed, ref, defineAsyncComponent } from 'vue';
import { AddStockOrderDocument, AddStockOrderMutation, AddStockOrderMutationVariables } from '@/graphql/operations/inventory.mutations';
import  useApiUtil  from '@/composables/api_util';
import { useInventoryStore } from '@/stores/inventory';
import { useStorageStore } from '@/stores/storage';
import { useSetupStore } from '@/stores/setup';
import { useUserStore } from '@/stores/user';
const Drawer = defineAsyncComponent(
    () => import('@/components/ui/FelDrawer.vue')
)
const PageHeading = defineAsyncComponent(
    () => import('@/components/common/FelPageHeading.vue')
)
const InventoryAdjustments = defineAsyncComponent(
    () => import('./InvAdjustments')
)
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

        const currentTab = ref('orders');
        const inventoryTabs = ref(['orders', 'products', 'ledger']);
        const currentTabComponent = computed(() => 'tab-' + currentTab.value);

        const viewBasket = ref(false);

        return {
            currentTab,
            inventoryTabs,
            currentTabComponent,
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
            <>
                <PageHeading title="Inventory Management" />
                <section class="col-span-12 mt-2">
                    <nav class="flex justify-between bg-background shadow-md mt-2">
                        <div class="-mb-px flex justify-start">
                            {this.inventoryTabs?.map(tab => (
                                <a
                                    key={tab}
                                    class={[
                                        'no-underline text-muted-foreground uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-primary hover:text-muted-foreground',
                                        { 'tab-active': this.currentTab === tab },
                                    ]}
                                    onClick={() => (this.currentTab = tab)}
                                   
                                >
                                    {tab}
                                </a>
                            ))}
                        </div>
                        {this.basket.length > 0 && (
                            <button type="button" class="flex items-center mr-4" onClick={() => (this.viewBasket = true)}>
                                <span class="mr-2">View</span> <font-awesome-icon icon="cart-shopping" />
                            </button>
                        )}
                    </nav>

                    <div>
                        {this.currentTab === 'orders' && <InventoryOrders />}
                        {this.currentTab === 'products' && <InventoryListing />}
                        {this.currentTab === 'ledger' && <InventoryAdjustments />}
                    </div>

                    <Drawer show={this.viewBasket} onClose={() => (this.viewBasket = false)}>
                        {{
                            header: () => 'Your Order Basket',
                            body: () => (
                                <>
                                    <div class="overflow-x-auto mt-2 mb-4">
                                        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                                            <table class="min-w-full">
                                                <thead>
                                                    <tr>
                                                        <th class="px-1 py-1 border-b-2 border-border text-left leading-4 text-foreground tracking-wider">
                                                            Product Name
                                                        </th>
                                                        <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
                                                            Lot Number
                                                        </th>
                                                        <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
                                                            Quantity
                                                        </th>
                                                        <th class="px-1 py-1 border-b-2 border-border text-left leading-4 text-foreground tracking-wider"></th>
                                                    </tr>
                                                </thead>
                                                <tbody class="bg-background">
                                                    {this.basket.map(item => (
                                                        <tr key={item.product.uid} v-motion-slide-right>
                                                            <td>
                                                                <p>{item.product.name}</p>
                                                            </td>
                                                            <td>
                                                                <p>{item.stockLot?.lotNumber}</p>
                                                            </td>
                                                            <td class="px-1 py-1 whitespace-no-wrap">
                                                                <label class="block">
                                                                    <input
                                                                        class="form-input"
                                                                        type="number"
                                                                        v-model={item.quantity}
                                                                        placeholder={item.quantity}
                                                                    />
                                                                </label>
                                                            </td>
                                                            <td class="px-1 whitespace-no-wrap">
                                                                <button
                                                                    type="button"
                                                                    class="bg-primary text-primary-foreground rounded-sm leading-none px-2 py-1"
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
                                    <hr />
                                    <button
                                        type="button"
                                        class="mt-4 bg-primary text-primary-foreground rounded-sm leading-none px-2 py-1"
                                        onClick={() => this.createOrder()}
                                    >
                                        Create Order
                                    </button>
                                </>
                            ),
                            footer: () => [],
                        }}
                    </Drawer>
                </section>
            </>
        );
    },
});

export { InventoryHome };
export default InventoryHome
