import { defineAsyncComponent, defineComponent, PropType, toRefs, watch } from 'vue';
import { ref, reactive } from 'vue';
import { AddStockItemVariantDocument, AddStockItemVariantMutation, AddStockItemVariantMutationVariables,
  EditStockItemVariantDocument, EditStockItemVariantMutation, EditStockItemVariantMutationVariables } from '@/graphql/operations/inventory.mutations';
import { useInventoryStore } from '@/stores/inventory';
import  useApiUtil  from '@/composables/api_util';
import { IStockItemVariant, IStockItem } from '@/models/inventory';
const Modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
)

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
            <div class="container w-full my-4">
                <section>
                    <h3 class="text-xl font-semibold text-gray-700">{this.stockItem?.name}</h3>
                    <p class="mt-2 italic leading-3 text-gray-500">{this.stockItem?.description}</p>
                </section>

                <hr class="mt-8 " />
                <div className="py-1 flex justify-between items-center">
                    <h3 class="text-xl font-semibold">Item Variants</h3>
                    <button
                        onClick={() => this.FormManager(true, null)}
                        class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
                    >
                    Add New {this.stockItem?.name}
                    </button>
                </div>
                <hr />

                <div class="overflow-x-auto mt-4">
                    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                        Variant Name
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                        Description
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                                </tr>
                            </thead>
                            <tbody class="bg-white">
                                {this.stockItem?.variants?.map(variant => {
                                    return (
                                        <tr key={variant?.uid}>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                                <div class="flex items-center">
                                                    <div class="text-sm leading-5 text-gray-800">{variant?.name}</div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                                <div class="text-sm leading-5 text-sky-800">{variant?.description}</div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                                                <button
                                                    onClick={() => this.FormManager(false, variant)}
                                                    class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
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

                {/* Hazard Form Modal */}
                {this.showModal ? (
                    <Modal onClose={() => (this.showModal = false)} contentWidth="w-1/4">
                        {{
                            header: () => <h3>{this.formTitle}</h3>,
                            body: () => {
                                return (
                                    <form action="post" class="p-1">
                                        <div class="grid grid-cols-2 gap-x-4 mb-4">
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-gray-700">Variant Name</span>
                                                <input
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.form.name}
                                                    placeholder="Name ..."
                                                />
                                            </label>
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-gray-700">Description</span>
                                                <textarea
                                                    cols="2"
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.form.description}
                                                    placeholder="Description ..."
                                                />
                                            </label>
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-gray-700">Minimum Level</span>
                                                <input
                                                    type="number"
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.form.minimumLevel}
                                                    default={0}
                                                />
                                            </label>
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-gray-700">Maximum Level</span>
                                                <input
                                                    type="number"
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.form.maximumLevel}
                                                    default={0}
                                                />
                                            </label>
                                        </div>
                                        <hr />
                                        <button
                                            type="button"
                                            onClick={() => this.saveForm()}
                                            class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
                                        >
                                            Save Form
                                        </button>
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
export default StockItemDetail