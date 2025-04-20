import { defineAsyncComponent, defineComponent, PropType, toRefs, watch } from 'vue';
import { ref, reactive } from 'vue';
import { AddStockItemVariantDocument, AddStockItemVariantMutation, AddStockItemVariantMutationVariables,
  EditStockItemVariantDocument, EditStockItemVariantMutation, EditStockItemVariantMutationVariables } from '@/graphql/operations/inventory.mutations';
import { useInventoryStore } from '@/stores/inventory';
import  useApiUtil  from '@/composables/api_util';
import { IStockItemVariant, IStockItem } from '@/models/inventory';

const StockItemDetail = defineComponent({
    name: 'StockItemDetail',
    props: {
        stockItem: {
            type: Object as PropType<IStockItem>,
        },
    },
    setup(props, ctx) {
        const { stockItem } = toRefs(props);
        const inventoryStore = useInventoryStore();
        const { withClientMutation } = useApiUtil();

        // Watch for changes in the stockItem prop to fetch variants
        watch(() => props.stockItem?.uid, async (newUid, old) => {
            if (newUid) {
                await inventoryStore.fetchItemVariants(newUid);
            }
        });

        let showModal = ref(false);
        let formTitle = ref('');
        let form = reactive({} as IStockItemVariant);
        const formAction = ref(true);

        function addStockItemVariant(): void {
            const payload = { ...form };
            withClientMutation<AddStockItemVariantMutation, AddStockItemVariantMutationVariables>(AddStockItemVariantDocument, { stockItemUid: stockItem?.value?.uid, payload }, 'createStockItemVariant').then(result => inventoryStore.addItemVariant(result));
        }

        function editStockItemVariant(): void {
            const payload = {
                name: form.name,
                description: form.description,
                minimumLevel: form.minimumLevel,
                maximumLevel: form.maximumLevel,
            };
            withClientMutation<EditStockItemVariantMutation, EditStockItemVariantMutationVariables>(EditStockItemVariantDocument, { uid: form.uid, payload }, 'updateStockItemVariant').then(result => inventoryStore.updateItemVariant(result));
        }

        function FormManager(create: boolean, obj: IStockItemVariant | null): void {
            formAction.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + 'A VARIANT';
            showModal.value = true;
            if (create) {
                Object.assign(form, {} as IStockItemVariant);
            } else {
                Object.assign(form, { ...obj });
            }
        }

        function saveForm(): void {
            if (formAction.value === true) addStockItemVariant();
            if (formAction.value === false) editStockItemVariant();
            showModal.value = false;
        }

        return {
            form,
            FormManager,
            saveForm,
            showModal,
            formTitle,
            stockItem
        };
    },
    render() {
        return (
            <div class="space-y-6">
                <section class="space-y-2">
                    <h2 class="text-2xl font-semibold text-foreground">{this.stockItem?.name}</h2>
                    <p class="text-sm text-muted-foreground">{this.stockItem?.description}</p>
                </section>

                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-semibold text-foreground">Item Variants</h3>
                    <button
                        onClick={() => this.FormManager(true, null)}
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Add New {this.stockItem?.name}
                    </button>
                </div>

                <div class="rounded-md border border-border bg-card p-6">
                    <div class="relative w-full overflow-auto">
                        <table class="w-full caption-bottom text-sm">
                            <thead class="[&_tr]:border-b">
                                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Variant Name</th>
                                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                    <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="[&_tr:last-child]:border-0">
                                {this.stockItem?.variants?.map(variant => {
                                    return (
                                        <tr key={variant?.uid} class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td class="p-4 align-middle">{variant?.name}</td>
                                            <td class="p-4 align-middle text-primary">{variant?.description}</td>
                                            <td class="p-4 align-middle text-right">
                                                <button
                                                    onClick={() => this.FormManager(false, variant)}
                                                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stock Item Variant Form Modal */}
                {this.showModal ? (
                    <fel-modal onClose={() => (this.showModal = false)}>
                        {{
                            header: () => (
                                <h3 class="text-lg font-semibold text-foreground">{this.formTitle}</h3>
                            ),
                            body: () => {
                                return (
                                    <form onSubmit={(e) => { e.preventDefault(); this.saveForm(); }} class="space-y-6">
                                        <div class="space-y-4">
                                            <div class="space-y-2">
                                                <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Variant Name
                                                </label>
                                                <input
                                                    value={this.form.name}
                                                    onChange={(e) => this.form.name = e.target.value}
                                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder="Enter variant name..."
                                                />
                                            </div>
                                            <div class="space-y-2">
                                                <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Description
                                                </label>
                                                <textarea
                                                    value={this.form.description}
                                                    onChange={(e) => this.form.description = e.target.value}
                                                    class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder="Enter description..."
                                                />
                                            </div>
                                            <div class="grid grid-cols-2 gap-4">
                                                <div class="space-y-2">
                                                    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        Minimum Level
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={this.form.minimumLevel}
                                                        onChange={(e) => this.form.minimumLevel = Number(e.target.value)}
                                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        min="0"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div class="space-y-2">
                                                    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        Maximum Level
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={this.form.maximumLevel}
                                                        onChange={(e) => this.form.maximumLevel = Number(e.target.value)}
                                                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        min="0"
                                                        placeholder="0"
                                                    />
                                                </div>
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
                                );
                            },
                        }}
                    </fel-modal>
                ) : null}
            </div>
        );
    },
});

export { StockItemDetail };
export default StockItemDetail