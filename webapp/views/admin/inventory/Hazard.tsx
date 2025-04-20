import { defineAsyncComponent, defineComponent, toRefs } from 'vue';
import { ref, reactive, computed } from 'vue';
import { AddHazardDocument, AddHazardMutation, AddHazardMutationVariables,
  EditHazardDocument, EditHazardMutation, EditHazardMutationVariables } from '@/graphql/operations/inventory.mutations';
import { useInventoryStore } from '@/stores/inventory';
import  useApiUtil  from '@/composables/api_util';
import { IHazard } from '@/models/inventory';

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
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-semibold text-foreground">Hazards</h2>
                    <button
                        onClick={() => this.FormManager(true, null)}
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    >
                        Add Hazard
                    </button>
                </div>

                <div class="rounded-md border border-border bg-card p-6">
                    <div class="relative w-full overflow-auto">
                        <table class="w-full caption-bottom text-sm">
                            <thead class="[&_tr]:border-b">
                                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Hazard Name</th>
                                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                    <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="[&_tr:last-child]:border-0">
                                {this.hazards.map(hazard => (
                                    <tr key={hazard?.uid} class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td class="p-4 align-middle">{hazard?.name}</td>
                                        <td class="p-4 align-middle text-primary">{hazard?.description}</td>
                                        <td class="p-4 align-middle text-right">
                                            <button
                                                onClick={() => this.FormManager(false, hazard)}
                                                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {this.showModal && (
                    <fel-modal onClose={() => (this.showModal = false)}>
                        {{
                            header: () => <h3 class="text-lg font-semibold text-foreground">{this.formTitle}</h3>,
                            body: () => (
                                <form onSubmit={(e) => { e.preventDefault(); this.saveForm(); }} class="space-y-6">
                                    <div class="space-y-4">
                                        <div class="space-y-2">
                                            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Hazard Name
                                            </label>
                                            <input
                                                value={this.form.name}
                                                onChange={(e) => this.form.name = e.target.value}
                                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter hazard name..."
                                            />
                                        </div>
                                        <div class="space-y-2">
                                            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Description
                                            </label>
                                            <textarea
                                                value={this.form.description}
                                                onChange={(e) => this.form.description = e.target.value}
                                                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Enter description..."
                                            />
                                        </div>
                                    </div>
                                    <div class="flex justify-end">
                                        <button
                                            type="submit"
                                            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            )
                        }}
                    </fel-modal>
                )}
            </div>
        );
    },
});

export { Hazard };
export default Hazard