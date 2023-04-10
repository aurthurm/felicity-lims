import { defineComponent } from 'vue';
import Modal from '../../../components/SimpleModal.vue';
import { ref, reactive, computed } from 'vue';
import { ADD_STOCK_ITEM, EDIT_STOCK_ITEM } from '../../../graphql/inventory.mutations';
import { useInventoryStore, useSetupStore } from '../../../stores';
import { useApiUtil } from '../../../composables';
import { IStockItem } from '../../../models/inventory';

const StockItem = defineComponent({
    name: 'stock-item',
    setup(props, ctx) {
        const inventoryStore = useInventoryStore();
        const setupStore = useSetupStore();
        const { withClientMutation } = useApiUtil();

        let showModal = ref(false);
        let formTitle = ref('');
        let form = reactive({} as IStockItem);
        const formAction = ref(true);

        let itemParams = reactive({
            first: 50,
            after: '',
            text: '',
            sortBy: ['uid'],
        });

        setupStore.fetchDepartments({});
        const departments = computed<any[]>(() => setupStore.getDepartments);

        inventoryStore.fetchAllDependencies();
        inventoryStore.fetchItems(itemParams);
        const stockItems = computed(() => inventoryStore.getStockItems);

        function addStockItem(): void {
            const payload = { ...form };
            withClientMutation(ADD_STOCK_ITEM, { payload }, 'createStockItem').then(result => inventoryStore.addItem(result));
        }

        function editStockItem(): void {
            const payload = {
                name: form.name,
                description: form.description,
                departmentUid: form.departmentUid,
            };
            withClientMutation(EDIT_STOCK_ITEM, { uid: form.uid, payload }, 'updateStockItem').then(result =>
                inventoryStore.updateItem(result)
            );
        }

        function FormManager(create: boolean, obj: IStockItem | null): void {
            formAction.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + 'STOCK ITEM';
            showModal.value = true;
            if (create) {
                Object.assign(form, {} as IStockItem);
            } else {
                Object.assign(form, { ...obj });
            }
        }

        function saveForm(): void {
            console.log(formAction);
            if (formAction.value === true) addStockItem();
            if (formAction.value === false) editStockItem();
            showModal.value = false;
        }

        return {
            form,
            FormManager,
            saveForm,
            stockItems,
            showModal,
            formTitle,
            departments,
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
                    Add Stock Item
                </button>
                <hr />

                <div class="overflow-x-auto mt-4">
                    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                        Item Name
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                        Description
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
                                        Main User (Department)
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                                </tr>
                            </thead>
                            <tbody class="bg-white">
                                {this.stockItems?.map(item => {
                                    return (
                                        <tr key={item?.uid}>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                                <div class="flex items-center">
                                                    <div class="text-sm leading-5 text-gray-800">{item?.name}</div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                                <div class="text-sm leading-5 text-sky-800">{item?.description}</div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                                <div class="text-sm leading-5 text-sky-800">{item?.department?.name}</div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                                                <button
                                                    onClick={() => this.FormManager(false, item)}
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

                {/* StockItem Form Modal */}
                {this.showModal ? (
                    <Modal onClose={() => (this.showModal = false)} contentWidth="w-1/4">
                        {{
                            header: () => <h3>{this.formTitle}</h3>,
                            body: () => {
                                return (
                                    <form action="post" class="p-1">
                                        <div class="grid grid-cols-2 gap-x-4 mb-4">
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-gray-700">Stock Item Name</span>
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
                                            <label class="block col-span-1 mb-2">
                                                <span class="text-gray-700">Department</span>
                                                <select class="form-select block w-full mt-1" v-model={this.form.departmentUid}>
                                                    <option></option>
                                                    {this.departments.map(department => (
                                                        <option key={department.uid} value={department?.uid}>
                                                            {department.name}
                                                        </option>
                                                    ))}
                                                </select>
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

export { StockItem };
