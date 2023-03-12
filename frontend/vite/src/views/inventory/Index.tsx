import { defineComponent, computed, ref } from 'vue';
import { InventoryDashboard } from './InvDashboard';
import { InventoryAdjustments } from './InvAdjustments';
import { InventoryListing } from './InvListing';
import { InventoryTransactions } from './InvTransactions';
import { InventoryOrders } from './InvOrders';

const InventoryHome = defineComponent({
  name: 'inventory-home',
  setup() {
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
        <section className="col-span-12 mt-2">
          <nav className="bg-white shadow-md mt-2">
            <div className="-mb-px flex justify-start">
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
