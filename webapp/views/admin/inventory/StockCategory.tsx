import { defineAsyncComponent, defineComponent, toRefs } from 'vue';
import { ref, computed } from 'vue';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import Modal from '@/components/ui/Modal.vue';
import {
    AddStockCategoryDocument,
    AddStockCategoryMutation,
    AddStockCategoryMutationVariables,
    EditStockCategoryDocument,
    EditStockCategoryMutation,
    EditStockCategoryMutationVariables,
} from '@/graphql/operations/inventory.mutations';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { useInventoryStore } from '@/stores/inventory';
import useApiUtil from '@/composables/api_util';
import { StockCategoryInputType, StockCategoryType } from '@/types/gql';

const StockCategory = defineComponent({
    name: 'stock-category',
    setup(props, ctx) {
        const inventoryStore = useInventoryStore();
        const { withClientMutation } = useApiUtil();

        const showModal = ref(false);
        const formTitle = ref('');
        const formAction = ref(true);
        const currentUid = ref<string | null>(null);

        const categorySchema = yup.object({
            name: yup.string().trim().required('Category name is required'),
            description: yup.string().trim().nullable(),
        });

        const { handleSubmit, resetForm, setValues } = useForm({
            validationSchema: categorySchema,
            initialValues: {
                name: '',
                description: '',
            },
        });

        const { value: name, errorMessage: nameError } = useField<string>('name');
        const { value: description, errorMessage: descriptionError } = useField<string | null>('description');

        inventoryStore.fetchCategories();
        const stockCategories = computed(() => inventoryStore.getCategories);

        function addStockCategory(payload: StockCategoryInputType): void {
            withClientMutation<AddStockCategoryMutation, AddStockCategoryMutationVariables>(
                AddStockCategoryDocument,
                { payload },
                'createStockCategory',
            ).then(result => inventoryStore.addCategory(result));
        }

        function editStockCategory(payload: StockCategoryInputType): void {
            if (!currentUid.value) return;
            withClientMutation<EditStockCategoryMutation, EditStockCategoryMutationVariables>(
                EditStockCategoryDocument,
                { uid: currentUid.value, payload },
                'updateStockCategory',
            ).then(result => inventoryStore.updateCategory(result));
        }

        function FormManager(create: boolean, obj: StockCategoryType | null): void {
            formAction.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + 'STOCK CATEGORY';
            showModal.value = true;
            if (create) {
                currentUid.value = null;
                resetForm({
                    values: {
                        name: '',
                        description: '',
                    },
                });
            } else {
                currentUid.value = obj?.uid ?? null;
                setValues({
                    name: obj?.name ?? '',
                    description: obj?.description ?? '',
                });
            }
        }

        const saveForm = handleSubmit(values => {
            const payload = {
                name: values.name,
                description: values.description ?? null,
            } as StockCategoryInputType;
            if (formAction.value === true) addStockCategory(payload);
            if (formAction.value === false) editStockCategory(payload);
            showModal.value = false;
        });

        return {
            name,
            nameError,
            description,
            descriptionError,
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
                    <h2 class="text-foreground text-2xl font-semibold">Stock Categories</h2>
                    <button
                        onClick={() => this.FormManager(true, null)}
                        class="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                        Add Stock Category
                    </button>
                </div>

                <div class="border-border bg-card rounded-md border p-6">
                    <div class="relative w-full overflow-auto">
                        <Table class="w-full caption-bottom text-sm">
                            <TableHeader class="[&_tr]:border-b">
                                <TableRow class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                    <TableHead class="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                                        Category Name
                                    </TableHead>
                                    <TableHead class="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                                        Description
                                    </TableHead>
                                    <TableHead class="text-muted-foreground h-12 px-4 text-right align-middle font-medium">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody class="[&_tr:last-child]:border-0">
                                {this.stockCategories.length === 0 ? (
                                    <TableEmpty colspan={3}>
                                        <Empty class="border-0 bg-transparent p-0">
                                            <EmptyContent>
                                                <EmptyHeader>
                                                    <EmptyTitle>No categories found</EmptyTitle>
                                                    <EmptyDescription>Create a category to organize stock items.</EmptyDescription>
                                                </EmptyHeader>
                                            </EmptyContent>
                                        </Empty>
                                    </TableEmpty>
                                ) : (
                                    this.stockCategories.map(category => (
                                        <TableRow
                                            key={category?.uid}
                                            class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                                        >
                                            <TableCell class="p-4 align-middle">{category?.name}</TableCell>
                                            <TableCell class="text-primary p-4 align-middle">{category?.description}</TableCell>
                                            <TableCell class="p-4 text-right align-middle">
                                                <button
                                                    onClick={() => this.FormManager(false, category)}
                                                    class="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                >
                                                    Edit
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {this.showModal && (
                    <Modal onClose={() => (this.showModal = false)}>
                        {{
                            header: () => <h3 class="text-foreground text-lg font-semibold">{this.formTitle}</h3>,
                            body: () => (
                                <form
                                    onSubmit={e => {
                                        e.preventDefault();
                                        this.saveForm();
                                    }}
                                    class="space-y-6"
                                >
                                    <div class="space-y-4">
                                        <div class="space-y-2">
                                            <label class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Category Name
                                            </label>
                                            <input
                                                value={this.name}
                                                onChange={e => (this.name = (e.target as HTMLInputElement).value)}
                                                class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter category name..."
                                            />
                                            {this.nameError ? <p class="text-destructive text-sm">{this.nameError}</p> : null}
                                        </div>
                                        <div class="space-y-2">
                                            <label class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Description
                                            </label>
                                            <textarea
                                                value={this.description}
                                                onChange={e => (this.description = (e.target as HTMLTextAreaElement).value)}
                                                class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter description..."
                                            />
                                            {this.descriptionError ? <p class="text-destructive text-sm">{this.descriptionError}</p> : null}
                                        </div>
                                    </div>
                                    <div class="flex justify-end">
                                        <button
                                            type="submit"
                                            class="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            ),
                        }}
                    </Modal>
                )}
            </div>
        );
    },
});

export { StockCategory };
export default StockCategory;
