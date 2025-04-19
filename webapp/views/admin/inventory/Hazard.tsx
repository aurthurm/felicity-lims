import { defineAsyncComponent, defineComponent, toRefs } from 'vue';
import { ref, reactive, computed } from 'vue';
import { AddHazardDocument, AddHazardMutation, AddHazardMutationVariables,
  EditHazardDocument, EditHazardMutation, EditHazardMutationVariables } from '@/graphql/operations/inventory.mutations';
import { useInventoryStore } from '@/stores/inventory';
import  useApiUtil  from '@/composables/api_util';
import { IHazard } from '@/models/inventory';
const Modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
)

const Hazard = defineComponent({
    name: 'hazard',
    setup(props, ctx) {
        const inventoryStore = useInventoryStore();
        const { withClientMutation } = useApiUtil();

        let showModal = ref(false);
        let formTitle = ref('');
        let form = reactive({} as IHazard);
        const formAction = ref(true);

        inventoryStore.fetchHazards();
        const hazards = computed(() => inventoryStore.getHazards);

        function addHazard(): void {
            const payload = { ...form };
            withClientMutation<AddHazardMutation, AddHazardMutationVariables>(AddHazardDocument, { payload }, 'createHazard').then(result => inventoryStore.addHazard(result));
        }

        function editHazard(): void {
            const payload = {
                name: form.name,
                description: form.description,
            };
            withClientMutation<EditHazardMutation, EditHazardMutationVariables>(EditHazardDocument, { uid: form.uid, payload }, 'updateHazard').then(result => inventoryStore.updateHazard(result));
        }

        function FormManager(create: boolean, obj: IHazard | null): void {
            formAction.value = create;
            formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + 'A HAZARD';
            showModal.value = true;
            if (create) {
                Object.assign(form, {} as IHazard);
            } else {
                Object.assign(form, { ...obj });
            }
        }

        function saveForm(): void {
            if (formAction.value === true) addHazard();
            if (formAction.value === false) editHazard();
            showModal.value = false;
        }

        return {
            form,
            FormManager,
            saveForm,
            hazards,
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
                    class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none"
                >
                    Add Hazard
                </button>
                <hr />

                <div class="overflow-x-auto mt-4">
                    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                        <table class="min-w-full">
                            <thead>
                                <tr>
                                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">
                                        Hazard Name
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">
                                        Description
                                    </th>
                                    <th class="px-1 py-1 border-b-2 border-border"></th>
                                </tr>
                            </thead>
                            <tbody class="bg-white">
                                {this.hazards.map(hazard => {
                                    return (
                                        <tr key={hazard?.uid}>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                                <div class="flex items-center">
                                                    <div class="text-sm leading-5 text-gray-800">{hazard?.name}</div>
                                                </div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                                <div class="text-sm leading-5 text-primary">{hazard?.description}</div>
                                            </td>
                                            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                                                <button
                                                    onClick={() => this.FormManager(false, hazard)}
                                                    class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none"
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
                                                <span class="text-gray-700">Hazard Name</span>
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
                                            class="-mb-4 w-full border border-primary bg-primary text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
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

export { Hazard };
export default Hazard