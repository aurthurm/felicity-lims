<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { SampleTypeTyp } from '@/types/gql'
  import { AddSampleTypeDocument, AddSampleTypeMutation, AddSampleTypeMutationVariables,
    EditSampleTypeDocument, EditSampleTypeMutation, EditSampleTypeMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { useSampleStore } from '@/stores/sample';
  import  useApiUtil  from '@/composables/api_util';
  import { useField, useForm } from "vee-validate";
  import { boolean, object, string } from "yup";
  const modal = defineAsyncComponent(
  () => import("@/components/ui/BeakModal.vue")
)

  const sampleStore = useSampleStore();
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  const formAction = ref<boolean>(true);
  const currentUid = ref<string | null>(null);

  const formSchema = object({
    name: string().required("Sample type name is required"),
    abbr: string().required("Prefix is required"),
    description: string().nullable(),
    active: boolean().nullable(),
  });

  const { handleSubmit, errors, resetForm, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      name: "",
      abbr: "",
      description: "",
      active: true,
    },
  });

  const { value: name } = useField<string>("name");
  const { value: abbr } = useField<string>("abbr");
  const { value: description } = useField<string | null>("description");
  const { value: active } = useField<boolean | null>("active");

  sampleStore.fetchSampleTypes();
  const sampleTypes = computed(() => sampleStore.getSampleTypes)

  function FormManager(create: boolean, obj = {} as SampleTypeTyp):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "SAMPLE TYPE";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: "",
          abbr: "",
          description: "",
          active: true,
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        name: obj.name ?? "",
        abbr: obj.abbr ?? "",
        description: obj.description ?? "",
        active: obj.active ?? true,
      });
    }
  }

  const saveForm = handleSubmit((values): void => {
    const payload = {
      name: values.name,
      abbr: values.abbr,
      description: values.description,
      active: values.active,
    };

    if (formAction.value === true) {
      withClientMutation<AddSampleTypeMutation, AddSampleTypeMutationVariables>(AddSampleTypeDocument, { payload }, "createSampleType")
      .then((result) => sampleStore.addSampleType(result));
    };

    if (formAction.value === false) {
      if (!currentUid.value) {
        return;
      }
      withClientMutation<EditSampleTypeMutation, EditSampleTypeMutationVariables>(EditSampleTypeDocument, { uid: currentUid.value, payload }, "updateSampleType")
      .then((result) => sampleStore.updateSampleType(result));
    };

    showModal.value = false;
  });

</script>

<template>
  <div class="space-y-6">
    <beak-heading title="Sample Types">
      <beak-button @click="FormManager(true)">Add Sample Type</beak-button>
    </beak-heading>

    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden shadow-md rounded-lg bg-background p-6">
          <table class="min-w-full divide-y divide-border beak-table">
            <thead class="bg-muted">
              <tr>
                <th scope="col" class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Sample Type</th>
                <th scope="col" class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Prefix</th>
                <th scope="col" class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Active</th>
                <th scope="col" class="px-4 py-2 text-right text-sm font-medium text-muted-foreground tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-background divide-y divide-border">
              <tr v-for="s_type in sampleTypes" :key="s_type?.uid">
                <td class="px-4 py-2 whitespace-nowrap">
                  <div class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{{ s_type?.name }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap">
                  <div class="text-sm text-primary">{{ s_type?.abbr }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap">
                  <div class="text-sm text-primary">{{ s_type?.active }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="FormManager(false, s_type)" 
                    class="text-primary hover:text-primary/80 transition-colors duration-200"
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
  </div>

  <!-- Sample Type Edit Form Modal -->
  <beak-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-1 gap-4">
          <label class="block">
            <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Sample Type Name</span>
            <input
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="name"
              placeholder="Name ..."
            />
            <div class="text-sm text-destructive">{{ errors.name }}</div>
          </label>
          <label class="block">
            <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Prefix</span>
            <input
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="abbr"
              placeholder="Prefix ..."
            />
            <div class="text-sm text-destructive">{{ errors.abbr }}</div>
          </label>
          <label class="block">
            <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Description</span>
            <textarea
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="description"
              placeholder="Description ..."
              rows="3"
            />
          </label>
          <div class="flex items-center">
            <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-2">Active</span>
            <div class="relative inline-block w-10 align-middle select-none">
              <input 
                type="checkbox" 
                name="toggle" 
                id="toggle" 
                v-model="active"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-background border-4 appearance-none cursor-pointer outline-none transition-colors duration-200"
              />
              <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-muted cursor-pointer transition-colors duration-200"></label>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Save Sample Type
          </button>
        </div>
      </form>
    </template>
  </beak-modal>
</template>


<style scoped>
  .toggle-checkbox:checked {
    right: 0;
    border-color: hsl(var(--success));
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: hsl(var(--success));
  }
</style>
