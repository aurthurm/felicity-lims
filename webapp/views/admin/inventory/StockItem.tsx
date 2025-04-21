import { defineAsyncComponent, defineComponent } from 'vue';
import { ref, reactive, computed } from 'vue';
import { AddStockItemDocument, AddStockItemMutation, AddStockItemMutationVariables,
  EditStockItemDocument, EditStockItemMutation, EditStockItemMutationVariables } from '@/graphql/operations/inventory.mutations';   
import { useInventoryStore } from '@/stores/inventory';
import  useApiUtil  from '@/composables/api_util';
import { StockItemInputType, StockItemType } from '@/types/gql';

const StockItemDetail = defineAsyncComponent(
    () => import( './StockItemDetail')
)
const StockItem = defineComponent({
    name: 'stock-item',
    setup(props, ctx) {
        const inventoryStore = useInventoryStore();
        const { withClientMutation } = useApiUtil();

        let showModal = ref(false);
        let formTitle = ref('');
        let form = reactive({} as StockItemType);
        const formAction = ref(true);

        let itemParams = reactive({
            first: 50,
            after: '',
            text: '',
            sortBy: ['-uid'],
        });

        inventoryStore.fetchAllDependencies();
        inventoryStore.fetchItems(itemParams);
        const stockItems = computed(() => inventoryStore.getStockItems);
        const hazards = computed(() => inventoryStore.getHazards);
        const categories = computed(() => inventoryStore.getCategories);

        function addStockItem(): void {
            const payload = { ...form } as StockItemInputType;
            withClientMutation<AddStockItemMutation, AddStockItemMutationVariables>(AddStockItemDocument, { payload }, 'createStockItem')
            .then(result => inventoryStore.addItem(result as StockItemType));
        }

        function editStockItem(): void {
            const payload = {
                name: form.name,
                description: form.description,
                hazardUid: form.hazardUid,
                categoryUid: form.categoryUid,
            } as StockItemInputType;
            withClientMutation<EditStockItemMutation, EditStockItemMutationVariables>(EditStockItemDocument, { uid: form.uid, payload }, 'updateStockItem')
            .then(result =>
                inventoryStore.updateItem(result as StockItemType)
            );
        }

        function FormManager(create: boolean, obj: StockItemType | null): void {
            formAction.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + 'STOCK ITEM';
            showModal.value = true;
            if (create) {
                Object.assign(form, {} as StockItemType);
            } else {
                Object.assign(form, { ...obj });
            }
        }

        function saveForm(): void {
            if (formAction.value === true) addStockItem();
            if (formAction.value === false) editStockItem();
            showModal.value = false;
        }

        // Stock Item Detail
        let openDrawer = ref(false);
        let stockItem = ref<StockItemType>()
        const viewStockItem = (item: StockItemType) => {
            stockItem.value = item;
            openDrawer.value = true;
        }

        return {
            form,
            FormManager,
            saveForm,
            stockItems,
            showModal,
            formTitle,
            hazards,
            categories,
            openDrawer,
            viewStockItem,
            stockItem,
        };
    },
    render() {
        return (
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-semibold text-foreground">Stock Items</h2>
                    <button
                        onClick={() => this.FormManager(true, null)}
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Add Stock Item
                    </button>
                </div>

                <div class="rounded-md border border-border bg-card p-6">
                    <div class="relative w-full overflow-auto">
                        <table class="w-full caption-bottom text-sm">
                            <thead class="[&_tr]:border-b">
                                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Item Name</th>
                                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Hazard</th>
                                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                    <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="[&_tr:last-child]:border-0">
                                {this.stockItems?.map(item => {
                                    return (
                                        <tr key={item?.uid} class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td class="p-4 align-middle">{item?.name}</td>
                                            <td class="p-4 align-middle text-primary">{item?.category?.name}</td>
                                            <td class="p-4 align-middle text-primary">{item?.hazard?.name}</td>
                                            <td class="p-4 align-middle text-primary">{item?.description}</td>
                                            <td class="p-4 align-middle text-right">
                                                <div class="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => this.FormManager(false, item)}
                                                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => this.viewStockItem(item)}
                                                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <fel-drawer show={this.openDrawer} onClose={() => (this.openDrawer = false)}>
                    {{
                        header: () => <h3 class="text-lg font-semibold text-foreground">Stock Item Detail</h3>,
                        body: () => <StockItemDetail stockItem={this.stockItem} />,
                        footer: () => <div></div>,
                    }}
                </fel-drawer>

                {/* StockItem Form Modal */}
                {this.showModal && (
                    <fel-modal onClose={() => (this.showModal = false)}>
                        {{
                            header: () => <h3 class="text-lg font-semibold text-foreground">{this.formTitle}</h3>,
                            body: () => (
                                <form onSubmit={(e) => { e.preventDefault(); this.saveForm(); }} class="space-y-6">
                                    <div class="space-y-4">
                                        <div class="space-y-2">
                                            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Stock Item Name
                                            </label>
                                            <input
                                                value={this.form.name}
                                                onChange={(e) => this.form.name = e.target.value}
                                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter item name..."
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
                                                    Hazard
                                                </label>
                                                <select
                                                    title="Hazard"
                                                    value={this.form.hazardUid}
                                                    onChange={(e) => this.form.hazardUid = e.target.value}
                                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">Select a hazard...</option>
                                                    {this.hazards.map(hazard => (
                                                        <option key={hazard.uid} value={hazard?.uid}>
                                                            {hazard.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div class="space-y-2">
                                                <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Category
                                                </label>
                                                <select
                                                    title="Category"
                                                    value={this.form.categoryUid}
                                                    onChange={(e) => this.form.categoryUid = e.target.value}
                                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">Select a category...</option>
                                                    {this.categories.map(category => (
                                                        <option key={category.uid} value={category?.uid}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
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
                            )
                        }}
                    </fel-modal>
                )}
            </div>
        );
    },
});

export { StockItem };
export default StockItem