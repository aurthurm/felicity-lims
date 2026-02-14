<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { UnitType } from '@/types/gql'
  import { AddUnitDocument, AddUnitMutation, AddUnitMutationVariables,
    EditUnitDocument, EditUnitMutation, EditUnitMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/BeakModal.vue')
  )

  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);

  setupStore.fetchUnits();    
  const units = computed(() => setupStore.getUnits);

  const unitSchema = yup.object({
    name: yup.string().trim().required('Name is required'),
    description: yup.string().trim().nullable(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: unitSchema,
    initialValues: {
      name: '',
      description: '',
    },
  });

  const { value: name, errorMessage: nameError } = useField<string>('name');
  const { value: description, errorMessage: descriptionError } = useField<string | null>('description');

  const currentUid = ref<string | null>(null);

  function addUnit(payload: { name: string; description: string | null }): void {
    withClientMutation<AddUnitMutation, AddUnitMutationVariables>(AddUnitDocument, { payload }, "createUnit")
    .then((result) => setupStore.addUnit(result));
  }

  function editUnit(payload: { name: string; description: string | null }): void {
    if (!currentUid.value) return;
    withClientMutation<EditUnitMutation, EditUnitMutationVariables>(EditUnitDocument, { uid: currentUid.value, payload }, "updateUnit")
    .then((result) => setupStore.updateUnit(result));
  }

  function FormManager(create: boolean, obj = {} as UnitType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "UNIT";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: '',
          description: '',
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        name: obj.name ?? '',
        description: obj.description ?? '',
      });
    }
  }

  const saveForm = handleSubmit((values) => {
    const payload = {
      name: values.name,
      description: values.description ?? null,
    };
    if (formAction.value === true) addUnit(payload);
    if (formAction.value === false) editUnit(payload);
    showModal.value = false;
  });
  
</script>

<template>
  <div class="space-y-6">
    <beak-heading title="Units">
      <beak-button @click="FormManager(true)"> Add Unit</beak-button>
    </beak-heading>

    <div class="border border-border bg-background rounded-lg shadow-sm p-6 overflow-hidden">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm beak-table">
          <thead class="[&_tr]:border-b">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Name</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Description</th>
              <th class="px-4 py-2 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr v-for="unit in units" :key="unit?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td class="px-4 py-2 align-middle">{{ unit?.name }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ unit?.description }}</td>
              <td class="px-4 py-2 align-middle text-right">
                <button 
                  @click="FormManager(false, unit)"
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

  <!-- Unit Edit Form Modal -->
  <beak-modal v-if="showModal" @close="showModal = false">
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
              placeholder="Enter unit name..."
            />
            <p v-if="nameError" class="text-sm text-destructive">{{ nameError }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description
            </label>
            <input
              v-model="description"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter description..."
            />
            <p v-if="descriptionError" class="text-sm text-destructive">{{ descriptionError }}</p>
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
  </beak-modal>
</template>
