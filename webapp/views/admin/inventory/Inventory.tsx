import { defineComponent, ref, computed, defineAsyncComponent } from 'vue';
import { useSampleStore } from '@/stores/sample';
import { useSetupStore } from '@/stores/setup';
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

        const tabs = [
            { id: 'stock-categories', label: 'stock-categories', component: StockCategory },
            { id: 'hazards', label: 'hazards', component: Hazard },
            { id: 'stock-units', label: 'stock-units', component: StockUnit },
            { id: 'stock-items', label: 'stock-items', component: StockItem }
        ]

        sampleStore.fetchSampleTypes();
        setupStore.fetchDepartments({});

        return { exposed: { tabs } };
    },
    render() {
        const {  tabs } = this.exposed;
        return (
            <div class="space-y-6">
                <fel-heading title="Inventory Management" />
                <fel-tabs tabs={tabs} />
            </div>
        );
    },
});

export { InventoryHome };
export default InventoryHome
