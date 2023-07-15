import { defineAsyncComponent, defineComponent, toRefs } from 'vue';
import { ref, reactive, computed } from 'vue';
import { ADD_STOCK_CATEGORY, EDIT_STOCK_CATEGORY } from '../../../graphql/inventory.mutations';
import { useInventoryStore } from '../../../stores';
import { useApiUtil } from '../../../composables';
import { IStockCategory } from '../../../models/inventory';
const Modal = defineAsyncComponent(
    () => import('../../../components/SimpleModal.vue')
)

const StockCategory = defineComponent({
    name: 'stock-category',
    setup(props, ctx) {
        const inventoryStore = useInventoryStore();
        const { withClientMutation } = useApiUtil();

        let showModal = ref(false);
        let formTitle = ref('');
        let form = reactive({} as IStockCategory);
        const formAction = ref(true);

        inventoryStore.fetchCategories();
        const stockCategories = computed(() => inventoryStore.getCategories);

        function addStockCategory(): void {
            const payload = { ...form };
            withClientMutation(ADD_STOCK_CATEGORY, { payload }, 'createStockCategory').then(result => inventoryStore.addCategory(result));
        }

        function editStockCategory(): void {
            const payload = {
                name: form.name,
                description: form.description,
            };
            withClientMutation(EDIT_STOCK_CATEGORY, { uid: form.uid, payload }, 'updateStockCategory').then(result =>
                inventoryStore.updateCategory(result)
            );
        }

        function FormManager(create: boolean, obj: IStockCategory | null): void {
            formAction.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + 'STOCK CATEGORY';
            showModal.value = true;
            if (create) {
                Object.assign(form, {} as IStockCategory);
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
            <div class="container w-full my-4">
                <hr />
                <button
                    onClick={() => this.FormManager(true, null)}
                    class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
                >
                    Add Stock Category
                </button>
                <hr />

                <div class="overflow-x-auto mt-4">
                    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                        Category Name
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                        Description
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                                </tr>
                            </thead>
                            <tbody class="bg-white">
                                {this.stockCategories.map(category => {
                                    return (
                                        <tr key={category?.uid}>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                                <div class="flex items-center">
                                                    <div class="text-sm leading-5 text-gray-800">{category?.name}</div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                                <div class="text-sm leading-5 text-sky-800">{category?.description}</div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                                                <button
                                                    onClick={() => this.FormManager(false, category)}
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

                {/* StockCategory Form Modal */}
                {this.showModal ? (
                    <Modal onClose={() => (this.showModal = false)} contentWidth="w-1/4">
                        {{
                            header: () => <h3>{this.formTitle}</h3>,
                            body: () => {
                                return (
                                    <form action="post" class="p-1">
                                        <div class="grid grid-cols-2 gap-x-4 mb-4">
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-gray-700">Stock Category Name</span>
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

export { StockCategory };
