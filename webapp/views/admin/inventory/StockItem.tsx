import { defineAsyncComponent, defineComponent } from 'vue';
import { ref, computed } from 'vue';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import Modal from '@/components/ui/Modal.vue';
import Drawer from '@/components/ui/Drawer.vue';
import {
    AddStockItemDocument,
    AddStockItemMutation,
    AddStockItemMutationVariables,
    EditStockItemDocument,
    EditStockItemMutation,
    EditStockItemMutationVariables,
} from '@/graphql/operations/inventory.mutations';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { useInventoryStore } from '@/stores/inventory';
import useApiUtil from '@/composables/api_util';
import { StockItemInputType, StockItemType } from '@/types/gql';

const StockItemDetail = defineAsyncComponent(() => import('./StockItemDetail'));
const StockItem = defineComponent({
    name: 'stock-item',
    setup(props, ctx) {
        const inventoryStore = useInventoryStore();
        const { withClientMutation } = useApiUtil();

        const showModal = ref(false);
        const formTitle = ref('');
        const formAction = ref(true);
        const currentUid = ref<string | null>(null);

        const stockItemSchema = yup.object({
            name: yup.string().trim().required('Stock item name is required'),
            description: yup.string().trim().nullable(),
            hazardUid: yup.string().trim().nullable(),
            categoryUid: yup.string().trim().nullable(),
            minimumLevel: yup.number().nullable(),
            maximumLevel: yup.number().nullable(),
        });

        const { handleSubmit, resetForm, setValues } = useForm({
            validationSchema: stockItemSchema,
            initialValues: {
                name: '',
                description: '',
                hazardUid: '',
                categoryUid: '',
                minimumLevel: '',
                maximumLevel: '',
            },
        });

        const { value: name, errorMessage: nameError } = useField<string>('name');
        const { value: description, errorMessage: descriptionError } = useField<string | null>('description');
        const { value: hazardUid, errorMessage: hazardError } = useField<string | null>('hazardUid');
        const { value: categoryUid, errorMessage: categoryError } = useField<string | null>('categoryUid');
        const { value: minimumLevel, errorMessage: minimumError } = useField<number | string>('minimumLevel');
        const { value: maximumLevel, errorMessage: maximumError } = useField<number | string>('maximumLevel');

        const itemParams = reactive({
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

        function addStockItem(payload: StockItemInputType): void {
            withClientMutation<AddStockItemMutation, AddStockItemMutationVariables>(
                AddStockItemDocument,
                { payload },
                'createStockItem',
            ).then(result => inventoryStore.addItem(result as StockItemType));
        }

        function editStockItem(payload: StockItemInputType): void {
            if (!currentUid.value) return;
            withClientMutation<EditStockItemMutation, EditStockItemMutationVariables>(
                EditStockItemDocument,
                { uid: currentUid.value, payload },
                'updateStockItem',
            ).then(result => inventoryStore.updateItem(result as StockItemType));
        }

        function FormManager(create: boolean, obj: StockItemType | null): void {
            formAction.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + 'STOCK ITEM';
            showModal.value = true;
            if (create) {
                currentUid.value = null;
                resetForm({
                    values: {
                        name: '',
                        description: '',
                        hazardUid: '',
                        categoryUid: '',
                        minimumLevel: '',
                        maximumLevel: '',
                    },
                });
            } else {
                currentUid.value = obj?.uid ?? null;
                setValues({
                    name: obj?.name ?? '',
                    description: obj?.description ?? '',
                    hazardUid: obj?.hazardUid ?? '',
                    categoryUid: obj?.categoryUid ?? '',
                    minimumLevel: obj?.minimumLevel ?? '',
                    maximumLevel: obj?.maximumLevel ?? '',
                });
            }
        }

        const saveForm = handleSubmit(values => {
            const payload = {
                name: values.name,
                description: values.description ?? null,
                hazardUid: values.hazardUid ? values.hazardUid : null,
                categoryUid: values.categoryUid ? values.categoryUid : null,
                minimumLevel: values.minimumLevel === '' ? null : Number(values.minimumLevel),
                maximumLevel: values.maximumLevel === '' ? null : Number(values.maximumLevel),
            } as StockItemInputType;
            if (formAction.value === true) addStockItem(payload);
            if (formAction.value === false) editStockItem(payload);
            showModal.value = false;
        });

        // Stock Item Detail
        const openDrawer = ref(false);
        const stockItem = ref<StockItemType>();
        const viewStockItem = (item: StockItemType) => {
            stockItem.value = item;
            openDrawer.value = true;
        };

        return {
            name,
            nameError,
            description,
            descriptionError,
            hazardUid,
            hazardError,
            categoryUid,
            categoryError,
            minimumLevel,
            minimumError,
            maximumLevel,
            maximumError,
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
                    <h2 class="text-foreground text-2xl font-semibold">Stock Items</h2>
                    <button
                        onClick={() => this.FormManager(true, null)}
                        class="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                        Add Stock Item
                    </button>
                </div>

                <div class="border-border bg-card rounded-md border p-6">
                    <div class="relative w-full overflow-auto">
                        <Table class="w-full caption-bottom text-sm">
                            <TableHeader class="[&_tr]:border-b">
                                <TableRow class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                    <TableHead class="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                                        Item Name
                                    </TableHead>
                                    <TableHead class="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                                        Category
                                    </TableHead>
                                    <TableHead class="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Hazard</TableHead>
                                    <TableHead class="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                                        Description
                                    </TableHead>
                                    <TableHead class="text-muted-foreground h-12 px-4 text-right align-middle font-medium">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody class="[&_tr:last-child]:border-0">
                                {this.stockItems?.length === 0 ? (
                                    <TableEmpty colspan={5}>
                                        <Empty class="border-0 bg-transparent p-0">
                                            <EmptyContent>
                                                <EmptyHeader>
                                                    <EmptyTitle>No stock items found</EmptyTitle>
                                                    <EmptyDescription>Add a stock item to get started.</EmptyDescription>
                                                </EmptyHeader>
                                            </EmptyContent>
                                        </Empty>
                                    </TableEmpty>
                                ) : (
                                    this.stockItems?.map(item => {
                                        return (
                                            <TableRow
                                                key={item?.uid}
                                                class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                                            >
                                                <TableCell class="p-4 align-middle">{item?.name}</TableCell>
                                                <TableCell class="text-primary p-4 align-middle">{item?.category?.name}</TableCell>
                                                <TableCell class="text-primary p-4 align-middle">{item?.hazard?.name}</TableCell>
                                                <TableCell class="text-primary p-4 align-middle">{item?.description}</TableCell>
                                                <TableCell class="p-4 text-right align-middle">
                                                    <div class="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => this.FormManager(false, item)}
                                                            class="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => this.viewStockItem(item)}
                                                            class="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <Drawer show={this.openDrawer} onClose={() => (this.openDrawer = false)}>
                    {{
                        header: () => <h3 class="text-foreground text-lg font-semibold">Stock Item Detail</h3>,
                        body: () => <StockItemDetail stockItem={this.stockItem} />,
                        footer: () => <div></div>,
                    }}
                </Drawer>

                {/* StockItem Form Modal */}
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
                                                Stock Item Name
                                            </label>
                                            <input
                                                value={this.name}
                                                onChange={e => (this.name = (e.target as HTMLInputElement).value)}
                                                class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter item name..."
                                            />
                                            {this.nameError ? <p class="text-destructive text-sm">{this.nameError}</p> : null}
                                        </div>
                                        <div class="grid grid-cols-2 gap-4">
                                            <div class="space-y-2">
                                                <label class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Minimum Level
                                                </label>
                                                <input
                                                    type="number"
                                                    value={this.minimumLevel}
                                                    onChange={e => (this.minimumLevel = (e.target as HTMLInputElement).value)}
                                                    class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    min="0"
                                                    placeholder="0"
                                                />
                                                {this.minimumError ? <p class="text-destructive text-sm">{this.minimumError}</p> : null}
                                            </div>
                                            <div class="space-y-2">
                                                <label class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Maximum Level
                                                </label>
                                                <input
                                                    type="number"
                                                    value={this.maximumLevel}
                                                    onChange={e => (this.maximumLevel = (e.target as HTMLInputElement).value)}
                                                    class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    min="0"
                                                    placeholder="0"
                                                />
                                                {this.maximumError ? <p class="text-destructive text-sm">{this.maximumError}</p> : null}
                                            </div>
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
                                        <div class="grid grid-cols-2 gap-4">
                                            <div class="space-y-2">
                                                <label class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Hazard
                                                </label>
                                                <select
                                                    title="Hazard"
                                                    value={this.hazardUid}
                                                    onChange={e => (this.hazardUid = (e.target as HTMLSelectElement).value)}
                                                    class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">Select a hazard...</option>
                                                    {this.hazards.map(hazard => (
                                                        <option key={hazard.uid} value={hazard?.uid}>
                                                            {hazard.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {this.hazardError ? <p class="text-destructive text-sm">{this.hazardError}</p> : null}
                                            </div>
                                            <div class="space-y-2">
                                                <label class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Category
                                                </label>
                                                <select
                                                    title="Category"
                                                    value={this.categoryUid}
                                                    onChange={e => (this.categoryUid = (e.target as HTMLSelectElement).value)}
                                                    class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="">Select a category...</option>
                                                    {this.categories.map(category => (
                                                        <option key={category.uid} value={category?.uid}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {this.categoryError ? <p class="text-destructive text-sm">{this.categoryError}</p> : null}
                                            </div>
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

export { StockItem };
export default StockItem;
