<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { ManufacturerType } from '@/types/gql'
  import { AddManufacturerDocument, AddManufacturerMutation, AddManufacturerMutationVariables,
    EditManufacturerDocument, EditManufacturerMutation, EditManufacturerMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  import { useField, useForm } from "vee-validate";
  import { object, string } from "yup";
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

  const setupStore = useSetupStore();
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  const formAction = ref<boolean>(true);
  const currentUid = ref<string | null>(null);

  const formSchema = object({
    name: string().required("Name is required"),
    description: string().nullable(),
  });

  const { handleSubmit, errors, resetForm, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      name: "",
      description: "",
    },
  });

  const { value: name } = useField<string>("name");
  const { value: description } = useField<string | null>("description");

  setupStore.fetchManufacturers()
  const manufacturers = computed(() => setupStore.getManufacturers)

  function addManufacturer(payload: { name: string; description?: string | null }): void {
    withClientMutation<AddManufacturerMutation, AddManufacturerMutationVariables>(AddManufacturerDocument, { payload }, "createManufacturer")
    .then((result) => setupStore.addManufacturer(result));
  }

  function editManufacturer(payload: { name: string; description?: string | null }): void {
    if (!currentUid.value) {
      return;
    }
    withClientMutation<EditManufacturerMutation, EditManufacturerMutationVariables>(EditManufacturerDocument, { uid: currentUid.value, payload }, "updateManufacturer")
    .then((result) => setupStore.updateManufacturer(result));
  }

  function FormManager(create: boolean, obj = {} as ManufacturerType):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "MANUFACTURER";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: "",
          description: "",
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        name: obj.name ?? "",
        description: obj.description ?? "",
      });
    }
  }

  const saveForm = handleSubmit((values): void => {
    const payload = { name: values.name, description: values.description };
    if (formAction.value === true) addManufacturer(payload);
    if (formAction.value === false) editManufacturer(payload);
    showModal.value = false;
  });
</script>


<template>
  <div class="space-y-6">
    <fel-heading title="Manufacturers">
      <fel-button @click="FormManager(true)"> Add Manufacturer</fel-button>
    </fel-heading>

    <div class="border border-border bg-background rounded-lg shadow-sm p-6">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:border-b">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Manufacturer</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
              <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr v-for="manufacturer in manufacturers" :key="manufacturer?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td class="p-4 align-middle">{{ manufacturer?.name }}</td>
              <td class="p-4 align-middle text-primary">{{ manufacturer?.description }}</td>
              <td class="p-4 align-middle text-right">
                <button 
                  @click="FormManager(false, manufacturer)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Manufacturer Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-4">
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Name
            </label>
            <input
              v-model="name"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter manufacturer name..."
            />
            <div class="text-sm text-destructive">{{ errors.name }}</div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description
            </label>
            <textarea
              v-model="description"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter manufacturer description..."
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
    </template>
  </fel-modal>
</template>

