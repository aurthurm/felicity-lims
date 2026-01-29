<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { LaboratoryInstrumentType } from '@/types/gql'
  import { AddLaboratoryInstrumentDocument, AddLaboratoryInstrumentMutation, AddLaboratoryInstrumentMutationVariables,
    EditLaboratoryInstrumentDocument, EditLaboratoryInstrumentMutation, EditLaboratoryInstrumentMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  import { useField, useForm } from "vee-validate";
  import { object, string } from "yup";
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()

  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);
  const currentUid = ref<string | null>(null);

  const formSchema = object({
    instrumentUid: string().required("Instrument is required"),
    labName: string().required("Lab name/ID is required"),
    serialNumber: string().nullable(),
    dateCommissioned: string().nullable(),
    dateDecommissioned: string().nullable(),
  });

  const { handleSubmit, errors, resetForm, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      instrumentUid: "",
      labName: "",
      serialNumber: "",
      dateCommissioned: "",
      dateDecommissioned: "",
    },
  });

  const { value: instrumentUid } = useField<string>("instrumentUid");
  const { value: labName } = useField<string>("labName");
  const { value: serialNumber } = useField<string | null>("serialNumber");
  const { value: dateCommissioned } = useField<string | null>("dateCommissioned");
  const { value: dateDecommissioned } = useField<string | null>("dateDecommissioned");

  setupStore.fetchInstruments();    
  setupStore.fetchLaboratoryInstruments();   
  const instruments = computed(() => setupStore.getInstruments)
  const laboratoryInstruments = computed(() => setupStore.getLaboratoryInstruments)

  function addLabInstrument(values: Record<string, any>): void {
    const payload = { 
      labName: values.labName, 
      serialNumber: values.serialNumber, 
      dateCommissioned: values.dateCommissioned,
      dateDecommissioned: values.dateDecommissioned,
      instrumentUid: values.instrumentUid,
    }
    withClientMutation<AddLaboratoryInstrumentMutation, AddLaboratoryInstrumentMutationVariables>(AddLaboratoryInstrumentDocument, { payload }, "createLaboratoryInstrument")
    .then((result) => setupStore.addLaboratoryInstrument(result));
  }

  function editLabInstrument(values: Record<string, any>): void {
    if (!currentUid.value) {
      return;
    }
    const payload = { 
      labName: values.labName, 
      serialNumber: values.serialNumber, 
      dateCommissioned: values.dateCommissioned,
      dateDecommissioned: values.dateDecommissioned,
      instrumentUid: values.instrumentUid,
    }
    withClientMutation<EditLaboratoryInstrumentMutation, EditLaboratoryInstrumentMutationVariables>(EditLaboratoryInstrumentDocument, { uid: currentUid.value, payload },"updateLaboratoryInstrument")
    .then((result) => setupStore.updateLaboratoryInstrument(result));
  }

  function FormManager(create: boolean, obj = {} as LaboratoryInstrumentType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "LABORATORY INSTRUMENT";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          instrumentUid: "",
          labName: "",
          serialNumber: "",
          dateCommissioned: "",
          dateDecommissioned: "",
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        instrumentUid: obj.instrumentUid ?? "",
        labName: obj.labName ?? "",
        serialNumber: obj.serialNumber ?? "",
        dateCommissioned: obj.dateCommissioned ?? "",
        dateDecommissioned: obj.dateDecommissioned ?? "",
      });
    }
  }

  const saveForm = handleSubmit((values): void => {
    if (formAction.value === true) addLabInstrument(values);
    if (formAction.value === false) editLabInstrument(values);
    showModal.value = false;
  });
</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Laboratory Instruments">
      <fel-button @click="FormManager(true)"> Add Laboratory Instrument</fel-button>
    </fel-heading>

    <div class="border border-border bg-background rounded-lg shadow-sm p-6 overflow-hidden">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm fel-table">
          <thead class="[&_tr]:border-b">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Instrument</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Lab Name/ID</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Serial Number</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Date Commissioned</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Date Decommissioned</th>
              <th class="px-4 py-2 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr v-for="inst in laboratoryInstruments" :key="inst?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td class="px-4 py-2 align-middle">{{ inst?.instrument?.name }}</td>
              <td class="px-4 py-2 align-middle">{{ inst?.labName }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ inst?.serialNumber }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ inst?.dateCommissioned }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ inst?.dateDecommissioned }}</td>
              <td class="px-4 py-2 align-middle text-right">
                <button 
                  @click="FormManager(false, inst)"
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

  <!-- Laboratory Instrument Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Instrument
            </label>
            <select 
              v-model="instrumentUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Instrument</option>
              <option v-for="instrument in instruments" :key="instrument?.uid" :value="instrument.uid">
                {{ instrument?.name }}
              </option>
            </select>
            <div class="text-sm text-destructive">{{ errors.instrumentUid }}</div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Laboratory Name/ID
            </label>
            <input
              v-model="labName"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter lab name or ID..."
            />
            <div class="text-sm text-destructive">{{ errors.labName }}</div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Serial Number
            </label>
            <input
              v-model="serialNumber"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter serial number..."
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Date Commissioned
            </label>
            <input
              type="date"
              v-model="dateCommissioned"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Date Decommissioned
            </label>
            <input
              type="date"
              v-model="dateDecommissioned"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
