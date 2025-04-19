import { defineAsyncComponent, defineComponent } from 'vue';
import { ref, reactive, computed } from 'vue';
import { AddStockItemDocument, AddStockItemMutation, AddStockItemMutationVariables,
  EditStockItemDocument, EditStockItemMutation, EditStockItemMutationVariables } from '@/graphql/operations/inventory.mutations';   
import { useInventoryStore } from '@/stores/inventory';
import { useSetupStore } from '@/stores/setup';
import  useApiUtil  from '@/composables/api_util';
import { IStockItem } from '@/models/inventory';
const Modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
)
const Drawer = defineAsyncComponent(
    () => import( '@/components/ui/FelDrawer.vue')
)
const StockItemDetail = defineAsyncComponent(
    () => import( './StockItemDetail')
)
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
            sortBy: ['-uid'],
        });

        inventoryStore.fetchAllDependencies();
        inventoryStore.fetchItems(itemParams);
        const stockItems = computed(() => inventoryStore.getStockItems);
        const hazards = computed(() => inventoryStore.getHazards);
        const categories = computed(() => inventoryStore.getCategories);

        function addStockItem(): void {
            const payload = { ...form };
            withClientMutation<AddStockItemMutation, AddStockItemMutationVariables>(AddStockItemDocument, { payload }, 'createStockItem').then(result => inventoryStore.addItem(result));
        }

        function editStockItem(): void {
            const payload = {
                name: form.name,
                description: form.description,
                hazardUid: form.hazardUid,
                categoryUid: form.categoryUid,
            };
            withClientMutation<EditStockItemMutation, EditStockItemMutationVariables>(EditStockItemDocument, { uid: form.uid, payload }, 'updateStockItem').then(result =>
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
            if (formAction.value === true) addStockItem();
            if (formAction.value === false) editStockItem();
            showModal.value = false;
        }

        // Stock Item Detail
        let openDrawer = ref(false);
        let stockItem = ref<IStockItem>()
        const viewStockItem = (item: IStockItem) => {
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
            <div class="container w-full my-4">
                <hr />
                <button
                    onClick={() => this.FormManager(true, null)}
                    class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
                >
                    Add Stock Item
                </button>
                <hr />

                <div class="overflow-x-auto mt-4">
                    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
                                        Item Name
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
                                        Category
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
                                        Hazard
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
                                        Description
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-border"></th>
                                </tr>
                            </thead>
                            <tbody class="bg-background">
                                {this.stockItems?.map(item => {
                                    return (
                                        <tr key={item?.uid}>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                                                <div class="flex items-center">
                                                    <div class="text-sm leading-5 text-foreground">{item?.name}</div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                                                <div class="text-sm leading-5 text-primary">{item?.category?.name}</div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                                                <div class="text-sm leading-5 text-primary">{item?.hazard?.name}</div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                                                <div class="text-sm leading-5 text-primary">{item?.description}</div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
                                                <button
                                                    onClick={() => this.FormManager(false, item)}
                                                    class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
                                                >
                                                    Edit
                                                </button>  
                                                <button
                                                    onClick={() => this.viewStockItem(item)}
                                                    class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <Drawer show={this.openDrawer} onClose={() => (this.openDrawer = false)}>
                {{
                    header: () => 'Stock Item Detail',
                    body: () => (<StockItemDetail stockItem={this.stockItem} />),
                    footer: () => [<div></div>],
                }}
                </Drawer>

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
                                                <span class="text-foreground">Stock Item Name</span>
                                                <input
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.form.name}
                                                    placeholder="Name ..."
                                                />
                                            </label>
                                            <label class="block col-span-1 mb-2">
                                                <span class="text-foreground">Min Level</span>
                                                <input
                                                    class="form-input mt-1 block w-full"
                                                    type="number"
                                                    v-model={this.form.minimumLevel}
                                                />
                                            </label>
                                            <label class="block col-span-1 mb-2">
                                                <span class="text-foreground">Max Level</span>
                                                <input
                                                    class="form-input mt-1 block w-full"
                                                    type="number"
                                                    v-model={this.form.maximumLevel}
                                                />
                                            </label>
                                            <label class="block col-span-2 mb-2">
                                                <span class="text-foreground">Description</span>
                                                <textarea
                                                    cols="2"
                                                    class="form-input mt-1 block w-full"
                                                    v-model={this.form.description}
                                                    placeholder="Description ..."
                                                />
                                            </label>
                                            <label class="block col-span-1 mb-2">
                                                <span class="text-foreground">Hazard</span>
                                                <select class="form-select block w-full mt-1" v-model={this.form.hazardUid}>
                                                    <option></option>
                                                    {this.hazards.map(hazard => (
                                                        <option key={hazard.uid} value={hazard?.uid}>
                                                            {hazard.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label class="block col-span-1 mb-2">
                                                <span class="text-foreground">Category</span>
                                                <select class="form-select block w-full mt-1" v-model={this.form.categoryUid}>
                                                    <option></option>
                                                    {this.categories.map(category => (
                                                        <option key={category.uid} value={category?.uid}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>
                                        <hr />
                                        <button
                                            type="button"
                                            onClick={() => this.saveForm()}
                                            class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
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
export default StockItem