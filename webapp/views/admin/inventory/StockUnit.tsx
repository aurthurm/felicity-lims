import { computed, defineComponent, ref } from 'vue';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import Modal from '@/components/ui/Modal.vue';
import {
    AddStockUnitDocument,
    AddStockUnitMutation,
    AddStockUnitMutationVariables,
    EditStockUnitDocument,
    EditStockUnitMutation,
    EditStockUnitMutationVariables,
} from '@/graphql/operations/inventory.mutations';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { useInventoryStore } from '@/stores/inventory';
import useApiUtil from '@/composables/api_util';
import { StockUnitType } from '@/types/gql';

const StockUnit = defineComponent({
    name: 'stock-unit',
    setup(props, ctx) {
        const inventoryStore = useInventoryStore();
        const { withClientMutation } = useApiUtil();

        const showModal = ref(false);
        const formTitle = ref('');
        const formAction = ref(true);
        const currentUid = ref<string | null>(null);

        const unitSchema = yup.object({
            name: yup.string().trim().required('Stock unit name is required'),
        });

        const { handleSubmit, resetForm, setValues } = useForm({
            validationSchema: unitSchema,
            initialValues: {
                name: '',
            },
        });

        const { value: name, errorMessage: nameError } = useField<string>('name');

        inventoryStore.fetchUnits();
        const stockUnits = computed(() => inventoryStore.getUnits);

        function addStockUnit(payload: { name: string }): void {
            withClientMutation<AddStockUnitMutation, AddStockUnitMutationVariables>(
                AddStockUnitDocument,
                { payload },
                'createStockUnit',
            ).then(result => inventoryStore.addUnit(result));
        }

        function editStockUnit(payload: { name: string }): void {
            if (!currentUid.value) return;
            withClientMutation<EditStockUnitMutation, EditStockUnitMutationVariables>(
                EditStockUnitDocument,
                {
                    uid: currentUid.value,
                    payload,
                },
                'updateStockUnit',
            ).then(result => inventoryStore.updateUnit(result as any));
        }

        function FormManager(create: boolean, obj: StockUnitType | null): void {
            formAction.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + 'STOCK UNIT';
            showModal.value = true;
            if (create) {
                currentUid.value = null;
                resetForm({ values: { name: '' } });
            } else {
                currentUid.value = obj?.uid ?? null;
                setValues({ name: obj?.name ?? '' });
            }
        }

        const saveForm = handleSubmit(values => {
            const payload = { name: values.name };
            if (formAction.value === true) addStockUnit(payload);
            if (formAction.value === false) editStockUnit(payload);
            showModal.value = false;
        });

        return {
            name,
            nameError,
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
                    <h2 class="text-foreground text-2xl font-semibold">Stock Units</h2>
                    <button
                        onClick={() => this.FormManager(true, null)}
                        class="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                    >
                        Add Stock Unit
                    </button>
                </div>

                <div class="border-border bg-card rounded-md border p-6">
                    <div class="relative w-full overflow-auto">
                        <Table class="w-full caption-bottom text-sm">
                            <TableHeader class="[&_tr]:border-b">
                                <TableRow class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                    <TableHead class="text-muted-foreground h-12 px-4 text-left align-middle font-medium">
                                        Unit Name
                                    </TableHead>
                                    <TableHead class="text-muted-foreground h-12 px-4 text-right align-middle font-medium">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody class="[&_tr:last-child]:border-0">
                                {this.stockUnits.length === 0 ? (
                                    <TableEmpty colspan={2}>
                                        <Empty class="border-0 bg-transparent p-0">
                                            <EmptyContent>
                                                <EmptyHeader>
                                                    <EmptyTitle>No units defined</EmptyTitle>
                                                    <EmptyDescription>Add stock units to standardize quantities.</EmptyDescription>
                                                </EmptyHeader>
                                            </EmptyContent>
                                        </Empty>
                                    </TableEmpty>
                                ) : (
                                    this.stockUnits.map(unit => (
                                        <TableRow
                                            key={unit?.uid}
                                            class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                                        >
                                            <TableCell class="p-4 align-middle">{unit?.name}</TableCell>
                                            <TableCell class="p-4 text-right align-middle">
                                                <button
                                                    onClick={() => this.FormManager(false, unit)}
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
                                                Stock Unit Name
                                            </label>
                                            <input
                                                value={this.name}
                                                onChange={e => (this.name = (e.target as HTMLInputElement).value)}
                                                class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter unit name..."
                                            />
                                            {this.nameError ? <p class="text-destructive text-sm">{this.nameError}</p> : null}
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

export { StockUnit };
export default StockUnit;
