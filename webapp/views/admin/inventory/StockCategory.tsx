import { defineAsyncComponent, defineComponent, toRefs } from 'vue';
import { ref, reactive, computed } from 'vue';
import { AddStockCategoryDocument, AddStockCategoryMutation, AddStockCategoryMutationVariables,
  EditStockCategoryDocument, EditStockCategoryMutation, EditStockCategoryMutationVariables } from '@/graphql/operations/inventory.mutations';
import { useInventoryStore } from '@/stores/inventory';
import  useApiUtil  from '@/composables/api_util';
import { StockCategoryInputType, StockCategoryType } from '@/types/gql';

const StockCategory = defineComponent({
    name: 'stock-category',
    setup(props, ctx) {
        const inventoryStore = useInventoryStore();
        const { withClientMutation } = useApiUtil();

        let showModal = ref(false);
        let formTitle = ref('');
        let form = reactive({} as StockCategoryType);
        const formAction = ref(true);

        inventoryStore.fetchCategories();
        const stockCategories = computed(() => inventoryStore.getCategories);

        function addStockCategory(): void {
            const payload = { ...form } as StockCategoryInputType;
            withClientMutation<AddStockCategoryMutation, AddStockCategoryMutationVariables>(AddStockCategoryDocument, { payload }, 'createStockCategory')
            .then(result => inventoryStore.addCategory(result));
        }

        function editStockCategory(): void {
            const payload = {
                name: form.name,
                description: form.description,
            } as StockCategoryInputType;
            withClientMutation<EditStockCategoryMutation, EditStockCategoryMutationVariables>(EditStockCategoryDocument, { uid: form.uid, payload }, 'updateStockCategory')
            .then(result =>
                inventoryStore.updateCategory(result)
            );
        }

        function FormManager(create: boolean, obj: StockCategoryType | null): void {
            formAction.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + 'STOCK CATEGORY';
            showModal.value = true;
            if (create) {
                Object.assign(form, {} as StockCategoryType);
            } else {
                Object.assign(form, { ...obj });
            }
        }

        function saveForm(): void {
            if (formAction.value === true) addStockCategory();
            if (formAction.value === false) editStockCategory();
            showModal.value = false;
        }

        return {
            form,
            FormManager,
            saveForm,
            stockCategories,
            showModal,
            formTitle,
        };
    },
    render() {
        return (
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-semibold text-foreground">Stock Categories</h2>
                    <button
                        onClick={() => this.FormManager(true, null)}
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Add Stock Category
                    </button>
                </div>

                <div class="rounded-md border border-border bg-card p-6">
                    <div class="relative w-full overflow-auto">
                        <table class="w-full caption-bottom text-sm">
                            <thead class="[&_tr]:border-b">
                                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category Name</th>
                                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                    <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="[&_tr:last-child]:border-0">
                                {this.stockCategories.map(category => (
                                    <tr key={category?.uid} class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td class="p-4 align-middle">{category?.name}</td>
                                        <td class="p-4 align-middle text-primary">{category?.description}</td>
                                        <td class="p-4 align-middle text-right">
                                            <button
                                                onClick={() => this.FormManager(false, category)}
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
                                                Category Name
                                            </label>
                                            <input
                                                value={this.form.name}
                                                onChange={(e) => this.form.name = e.target.value}
                                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter category name..."
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

export { StockCategory };
export default StockCategory