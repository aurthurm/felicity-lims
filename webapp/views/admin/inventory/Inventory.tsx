import { defineComponent, ref, computed, defineAsyncComponent } from 'vue';
import { useSampleStore, useSetupStore } from '@/stores';
const StockCategory = defineAsyncComponent(
    () => import('./StockCategory')
)
const StockItem = defineAsyncComponent(
    () => import('./StockItem')
)
const StockUnit = defineAsyncComponent(
    () => import('./StockUnit')
)
const Hazard = defineAsyncComponent(
    () => import('./Hazard')
)

const InventoryHome = defineComponent({
    name: 'InventoryHome',
    setup(props) {
        const setupStore = useSetupStore();
        const sampleStore = useSampleStore();

        let currentTab = ref('stock-categories');
        const tabs = ['stock-categories', 'hazards', 'stock-units', 'stock-items' ];
        let currentTabComponent = computed(() => 'tab-' + currentTab.value);

        sampleStore.fetchSampleTypes();
        setupStore.fetchDepartments({});

        return { exposed: { currentTab, tabs } };
    },
    render() {
        const { currentTab, tabs } = this.exposed;
        return (
            <div class="mt-4">
                <nav class="bg-white shadow-md mt-2">
                    <div class="-mb-px flex justify-start">
                        {tabs.map(tab => {
                            return (
                                <a
                                    key={tab}
                                    class={[
                                        'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
                                        { 'tab-active': currentTab.value === tab },
                                    ]}
                                    onClick={() => (currentTab.value = tab)}
                                   
                                    role="tab"
                                >
                                    {tab}
                                </a>
                            );
                        })}
                    </div>
                </nav>

                {currentTab.value === 'stock-items' ? <StockItem /> : null}
                {currentTab.value === 'stock-categories' ? <StockCategory /> : null}
                {currentTab.value === 'stock-units' ? <StockUnit /> : null}
                {currentTab.value === 'hazards' ? <Hazard /> : null}
            </div>
        );
    },
});

export { InventoryHome };
export default InventoryHome
