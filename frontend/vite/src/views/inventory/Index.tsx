import { defineComponent, computed, ref } from 'vue';
import { InventoryDashboard } from './InvDashboard';
import { InventoryAdjustments } from './InvAdjustments';
import { InventoryListing } from './InvListing';
import { InventoryTransactions } from './InvTransactions';
import { InventoryOrders } from './InvOrders';

import { useInventoryStore, useStorageStore, useSetupStore, useUserStore } from '../../stores';

const InventoryHome = defineComponent({
  name: 'inventory-home',
  setup() {
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
    inventoryStore.fetchProducts({
      first: 50,
      after: '',
      text: '',
      sortBy: ['uid'],
    });

    const currentTab = ref('dashboard');
    const inventoryTabs = ref([
      'dashboard',
      'orders',
      'stock-listing',
      'transactions',
      'adjustments',
    ]);
    const currentTabComponent = computed(() => 'tab-' + currentTab.value);

    return {
      currentTab,
      inventoryTabs,
      currentTabComponent,
    };
  },
  render() {
    return (
      <>
        <section class="col-span-12 mt-2">
          <nav class="bg-white shadow-md mt-2">
            <div class="-mb-px flex justify-start">
              {this.inventoryTabs?.map((tab) => (
                <a
                  key={tab}
                  class={[
                    'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
                    { 'tab-active': this.currentTab === tab },
                  ]}
                  onClick={() => (this.currentTab = tab)}
                  href="#"
                >
                  {tab}
                </a>
              ))}
            </div>
          </nav>

          <div>
            {this.currentTab === 'dashboard' && <InventoryDashboard />}
            {this.currentTab === 'orders' && <InventoryOrders />}
            {this.currentTab === 'stock-listing' && <InventoryListing />}
            {this.currentTab === 'transactions' && <InventoryTransactions />}
            {this.currentTab === 'adjustments' && <InventoryAdjustments />}
          </div>
        </section>
      </>
    );
  },
});

export { InventoryHome };
