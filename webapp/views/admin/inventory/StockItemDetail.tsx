import { defineAsyncComponent, defineComponent, PropType, toRefs, watch } from 'vue';
import { ref } from 'vue';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import Modal from '@/components/ui/Modal.vue';
import {
    AddStockItemVariantDocument,
    AddStockItemVariantMutation,
    AddStockItemVariantMutationVariables,
    EditStockItemVariantDocument,
    EditStockItemVariantMutation,
    EditStockItemVariantMutationVariables,
} from '@/graphql/operations/inventory.mutations';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { useInventoryStore } from '@/stores/inventory';
import useApiUtil from '@/composables/api_util';
import { StockItemVariantType, StockItemType, StockItemVariantInputType } from '@/types/gql';

const StockItemDetail = defineComponent({
    name: 'StockItemDetail',
    props: {
        stockItem: {
            type: Object as PropType<StockItemType>,
        },
    },
    setup(props, ctx) {
        const { stockItem } = toRefs(props);
        const inventoryStore = useInventoryStore();
        const { withClientMutation } = useApiUtil();

        // Watch for changes in the stockItem prop to fetch variants
        watch(
            () => props.stockItem?.uid,
            async (newUid, old) => {
                if (newUid) {
                    await inventoryStore.fetchItemVariants(newUid);
                }
            },
        );

        const showModal = ref(false);
        const formTitle = ref('');
        const formAction = ref(true);
        const currentUid = ref<string | null>(null);

        const variantSchema = yup.object({
            name: yup.string().trim().required('Variant name is required'),
            description: yup.string().trim().nullable(),
            minimumLevel: yup.number().nullable(),
            maximumLevel: yup.number().nullable(),
        });

        const { handleSubmit, resetForm, setValues } = useForm({
            validationSchema: variantSchema,
            initialValues: {
                name: '',
                description: '',
                minimumLevel: '',
                maximumLevel: '',
            },
        });

        const { value: name, errorMessage: nameError } = useField<string>('name');
        const { value: description, errorMessage: descriptionError } = useField<string | null>('description');
        const { value: minimumLevel, errorMessage: minimumError } = useField<number | string>('minimumLevel');
        const { value: maximumLevel, errorMessage: maximumError } = useField<number | string>('maximumLevel');

        function addStockItemVariant(payload: StockItemVariantInputType): void {
            withClientMutation<AddStockItemVariantMutation, AddStockItemVariantMutationVariables>(
                AddStockItemVariantDocument,
                { stockItemUid: stockItem?.value?.uid!, payload },
                'createStockItemVariant',
            ).then(result => inventoryStore.addItemVariant(result));
        }

        function editStockItemVariant(payload: StockItemVariantInputType): void {
            if (!currentUid.value) return;
            withClientMutation<EditStockItemVariantMutation, EditStockItemVariantMutationVariables>(
                EditStockItemVariantDocument,
                { uid: currentUid.value, payload },
                'updateStockItemVariant',
            ).then(result => inventoryStore.updateItemVariant(result));
        }

        function FormManager(create: boolean, obj: StockItemVariantType | null): void {
            formAction.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + 'A VARIANT';
            showModal.value = true;
            if (create) {
                currentUid.value = null;
                resetForm({
                    values: {
                        name: '',
                        description: '',
                        minimumLevel: '',
                        maximumLevel: '',
                    },
                });
            } else {
                currentUid.value = obj?.uid ?? null;
                setValues({
                    name: obj?.name ?? '',
                    description: obj?.description ?? '',
                    minimumLevel: obj?.minimumLevel ?? '',
                    maximumLevel: obj?.maximumLevel ?? '',
                });
            }
        }

        const saveForm = handleSubmit(values => {
            const payload = {
                name: values.name,
                description: values.description ?? null,
                minimumLevel: values.minimumLevel === '' ? null : Number(values.minimumLevel),
                maximumLevel: values.maximumLevel === '' ? null : Number(values.maximumLevel),
            } as StockItemVariantInputType;
            if (formAction.value === true) addStockItemVariant(payload);
            if (formAction.value === false) editStockItemVariant(payload);
            showModal.value = false;
        });

        return {
            name,
            nameError,
            description,
            descriptionError,
            minimumLevel,
            minimumError,
            maximumLevel,
            maximumError,
            FormManager,
            saveForm,
            showModal,
            formTitle,
            stockItem,
        };
    },
    render() {
        return (
            <div class="space-y-6">
                <section class="space-y-2">
                    <h2 class="text-foreground text-2xl font-semibold">{this.stockItem?.name}</h2>
                    <p class="text-muted-foreground text-sm">{this.stockItem?.description}</p>
                </section>

                <div class="flex items-center justify-between">
                    <h3 class="text-foreground text-xl font-semibold">Item Variants</h3>
                    <button
                        onClick={() => this.FormManager(true, null)}
                        class="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                        Add New {this.stockItem?.name}
                    </button>
                </div>

                <div class="border-border bg-card rounded-md border p-6">
                    <div class="relative w-full overflow-auto">
                        <Table class="w-full caption-bottom text-sm">
                            <TableHeader class="[&_tr]:border-b">
                                <TableRow class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                    <TableHead class="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                                        Variant Name
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
                                {this.stockItem?.variants?.length === 0 ? (
                                    <TableEmpty colspan={3}>
                                        <Empty class="border-0 bg-transparent p-0">
                                            <EmptyContent>
                                                <EmptyHeader>
                                                    <EmptyTitle>No variants yet</EmptyTitle>
                                                    <EmptyDescription>Add a variant to manage stock levels.</EmptyDescription>
                                                </EmptyHeader>
                                            </EmptyContent>
                                        </Empty>
                                    </TableEmpty>
                                ) : (
                                    this.stockItem?.variants?.map(variant => {
                                        return (
                                            <TableRow
                                                key={variant?.uid}
                                                class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                                            >
                                                <TableCell class="p-4 align-middle">{variant?.name}</TableCell>
                                                <TableCell class="text-primary p-4 align-middle">{variant?.description}</TableCell>
                                                <TableCell class="p-4 text-right align-middle">
                                                    <button
                                                        onClick={() => this.FormManager(false, variant)}
                                                        class="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                    >
                                                        Edit
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Stock Item Variant Form Modal */}
                {this.showModal ? (
                    <Modal onClose={() => (this.showModal = false)}>
                        {{
                            header: () => <h3 class="text-foreground text-lg font-semibold">{this.formTitle}</h3>,
                            body: () => {
                                return (
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
                                                    Variant Name
                                                </label>
                                                <input
                                                    value={this.name}
                                                    onChange={e => (this.name = (e.target as HTMLInputElement).value)}
                                                    class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    placeholder="Enter variant name..."
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
                                                {this.descriptionError ? (
                                                    <p class="text-destructive text-sm">{this.descriptionError}</p>
                                                ) : null}
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
                                );
                            },
                        }}
                    </Modal>
                ) : null}
            </div>
        );
    },
});

export { StockItemDetail };
export default StockItemDetail;
