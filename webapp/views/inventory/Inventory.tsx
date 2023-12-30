import { defineComponent, computed, ref, defineAsyncComponent } from 'vue';
import { ADD_STOCK_ORDER } from '../../graphql/operations/inventory.mutations';
import { useApiUtil } from '../../composables';
import { useInventoryStore, useStorageStore, useSetupStore, useUserStore } from '../../stores';
const Drawer = defineAsyncComponent(
    () => import('../../components/Drawer.vue')
)
const PageHeading = defineAsyncComponent(
    () => import('../components/PageHeading.vue')
)
const InventoryAdjustments = defineAsyncComponent(
    () => import('./InvAdjustments')
)
const InventoryListing = defineAsyncComponent(
    () => import('./InvListing')
)
const InventoryTransactions = defineAsyncComponent(
    () => import('./InvTransactions')
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
        inventoryStore.fetchPackages();

        const currentTab = ref('orders');
        const inventoryTabs = ref(['orders', 'stock-listing', 'transactions', 'adjustments']);
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
                withClientMutation(
                    ADD_STOCK_ORDER,
                    {
                        payload: {
                            orderProducts: basket.map(order => ({
                                productUid: order.product.uid,
                                quantity: order.quantity,
                                price: 0.0,
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
                <PageHeading title="Inventory" />
                <section class="col-span-12 mt-2">
                    <nav class="flex justify-between bg-white shadow-md mt-2">
                        <div class="-mb-px flex justify-start">
                            {this.inventoryTabs?.map(tab => (
                                <a
                                    key={tab}
                                    class={[
                                        'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
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
                        {this.currentTab === 'stock-listing' && <InventoryListing />}
                        {this.currentTab === 'transactions' && <InventoryTransactions />}
                        {this.currentTab === 'adjustments' && <InventoryAdjustments />}
                    </div>

                    <Drawer show={this.viewBasket} onClose={() => (this.viewBasket = false)}>
                        {{
                            header: () => 'Your Order Basket',
                            body: () => (
                                <>
                                    <div class="overflow-x-auto mt-2 mb-4">
                                        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                                            <table class="min-w-full">
                                                <thead>
                                                    <tr>
                                                        <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">
                                                            Product Name
                                                        </th>
                                                        <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                                            Quantity
                                                        </th>
                                                        <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"></th>
                                                    </tr>
                                                </thead>
                                                <tbody class="bg-white">
                                                    {this.basket.map(item => (
                                                        <tr key={item.product.uid} v-motion-slide-right>
                                                            <td>
                                                                <p>{item.product.name}</p>
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
                                                                    class="bg-sky-800 text-white rounded-sm leading-none px-2 py-1"
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
                                        class="mt-4 bg-sky-800 text-white rounded-sm leading-none px-2 py-1"
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
