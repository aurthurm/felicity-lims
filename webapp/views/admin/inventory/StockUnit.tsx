import {computed, defineComponent, reactive, ref} from 'vue';
import {
    AddStockUnitDocument,
    AddStockUnitMutation,
    AddStockUnitMutationVariables,
    EditStockUnitDocument,
    EditStockUnitMutation,
    EditStockUnitMutationVariables
} from '@/graphql/operations/inventory.mutations';
import {useInventoryStore} from '@/stores/inventory';
import useApiUtil from '@/composables/api_util';
import { StockUnitType } from '@/types/gql';

const StockUnit = defineComponent({
    name: 'stock-unit',
    setup(props, ctx) {
        const inventoryStore = useInventoryStore();
        const {withClientMutation} = useApiUtil();

        let showModal = ref(false);
        let formTitle = ref('');
        let form = reactive({} as StockUnitType);
        const formAction = ref(true);

        inventoryStore.fetchUnits();
        const stockUnits = computed(() => inventoryStore.getUnits);

        function addStockUnit(): void {
            const payload = {...form};
            withClientMutation<AddStockUnitMutation, AddStockUnitMutationVariables>(AddStockUnitDocument, {payload}, 'createStockUnit').then(result => inventoryStore.addUnit(result));
        }

        function editStockUnit(): void {
            const payload = {
                name: form.name,
            };
            withClientMutation<EditStockUnitMutation, EditStockUnitMutationVariables>(EditStockUnitDocument, {
                uid: form.uid,
                payload
            }, 'updateStockUnit').then(result =>
                inventoryStore.updateUnit(result as any)
            );
        }

        function FormManager(create: boolean, obj: StockUnitType  | null): void {
            formAction.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + 'STOCK UNIT';
            showModal.value = true;
            if (create) {
                Object.assign(form, {} as StockUnitType);
            } else {
                Object.assign(form, {...obj});
            }
        }

        function saveForm(): void {
            if (formAction.value === true) addStockUnit();
            if (formAction.value === false) editStockUnit();
            showModal.value = false;
        }

        return {
            form,
            FormManager,
            saveForm,
            stockUnits,
            showModal,
            formTitle,
        };
    },
    render() {
        return (
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-semibold text-foreground">Stock Units</h2>
                    <button
                        onClick={() => this.FormManager(true, null)}
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Add Stock Unit
                    </button>
                </div>

                <div class="rounded-md border border-border bg-card p-6">
                    <div class="relative w-full overflow-auto">
                        <table class="w-full caption-bottom text-sm">
                            <thead class="[&_tr]:border-b">
                                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Unit Name</th>
                                    <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="[&_tr:last-child]:border-0">
                                {this.stockUnits.map(unit => (
                                    <tr key={unit?.uid} class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td class="p-4 align-middle">{unit?.name}</td>
                                        <td class="p-4 align-middle text-right">
                                            <button
                                                onClick={() => this.FormManager(false, unit)}
                                                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {this.showModal && (
                    <fel-modal onClose={() => (this.showModal = false)}>
                        {{
                            header: () => <h3 class="text-lg font-semibold text-foreground">{this.formTitle}</h3>,
                            body: () => (
                                <form onSubmit={(e) => { e.preventDefault(); this.saveForm(); }} class="space-y-6">
                                    <div class="space-y-4">
                                        <div class="space-y-2">
                                            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Stock Unit Name
                                            </label>
                                            <input
                                                value={this.form.name}
                                                onChange={(e) => this.form.name = e.target.value}
                                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter unit name..."
                                            />
                                        </div>
                                    </div>
                                    <div class="flex justify-end">
                                        <button
                                            type="submit"
                                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            )
                        }}
                    </fel-modal>
                )}
            </div>
        );
    },
});

export {StockUnit};
export default StockUnit