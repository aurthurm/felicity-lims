import { defineComponent, toRefs } from 'vue';
import Modal from '../../../components/SimpleModal.vue';
import { ref, reactive, computed } from 'vue';
import { ADD_STOCK_PACKAGING, EDIT_STOCK_PACKAGING } from '../../../graphql/inventory.mutations';
import { useInventoryStore } from '../../../stores';
import { useApiUtil } from '../../../composables';
import { IStockPackaging } from '../../../models/inventory';

const StockPackaging = defineComponent({
    name: 'stock-packaging',
    setup(props, ctx) {
        const inventoryStore = useInventoryStore();
        const { withClientMutation } = useApiUtil();

        let showModal = ref(false);
        let formTitle = ref('');
        let form = reactive({} as IStockPackaging);
        const formAction = ref(true);

        inventoryStore.fetchPackages();
        const stockPackages = computed(() => inventoryStore.getPackages);

        function addStockPackaging(): void {
            const payload = { ...form };
            withClientMutation(ADD_STOCK_PACKAGING, { payload }, 'createStockPackaging').then(result =>
                inventoryStore.addPackaging(result)
            );
        }

        function editStockPackaging(): void {
            const payload = {
                name: form.name,
            };
            withClientMutation(EDIT_STOCK_PACKAGING, { uid: form.uid, payload }, 'updateStockPackaging').then(result =>
                inventoryStore.updatePackaging(result)
            );
        }

        function FormManager(create: boolean, obj: IStockPackaging | null): void {
            formAction.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + 'STOCK PACKAGING';
            showModal.value = true;
            if (create) {
                Object.assign(form, {} as IStockPackaging);
            } else {
                Object.assign(form, { ...obj });
            }
        }

        function saveForm(): void {
            console.log(formAction);
            if (formAction.value === true) addStockPackaging();
            if (formAction.value === false) editStockPackaging();
            showModal.value = false;
        }

        return {
            form,
            FormManager,
            saveForm,
            stockPackages,
            showModal,
            formTitle,
        };
    },
    render() {
        return (
            <div class="container w-full my-4">
                <hr />
                <button
                    onClick={() => this.FormManager(true, null)}
                    class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
                >
                    Add Stock Packaging
                </button>
                <hr />

                <div class="overflow-x-auto mt-4">
                    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                        Packaging Name
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"></th>
                                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                                </tr>
                            </thead>
                            <tbody class="bg-white">
                                {this.stockPackages.map(pckg => {
                                    return (
                                        <tr key={pckg?.uid}>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                                <div class="flex items-center">
                                                    <div class="text-sm leading-5 text-gray-800">{pckg?.name}</div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                                <div class="text-sm leading-5 text-sky-800"></div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                                                <button
                                                    onClick={() => this.FormManager(false, pckg)}
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

                {/* StockPackaging Form Modal */}
                {this.showModal ? (
                    <Modal onClose={() => (this.showModal = false)} contentWidth="w-1/4">
                        {{
                            header: () => <h3>{this.formTitle}</h3>,
                            body: () => {
                                return (
                                    <form action="post" class="p-1">
                                        <div class="grid grid-cols-2 gap-x-4 mb-4">
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-gray-700">Stock Packaging Name</span>
                                                <input
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.form.name}
                                                    placeholder="Name ..."
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

export { StockPackaging };
