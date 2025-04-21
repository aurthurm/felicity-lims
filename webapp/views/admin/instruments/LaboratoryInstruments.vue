<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { LaboratoryInstrumentType } from '@/types/gql'
  import { AddLaboratoryInstrumentDocument, AddLaboratoryInstrumentMutation, AddLaboratoryInstrumentMutationVariables,
    EditLaboratoryInstrumentDocument, EditLaboratoryInstrumentMutation, EditLaboratoryInstrumentMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()

  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);

  let instrument = reactive({})  as LaboratoryInstrumentType;

  setupStore.fetchInstruments();    
  setupStore.fetchLaboratoryInstruments();   
  const instruments = computed(() => setupStore.getInstruments)
  const laboratoryInstruments = computed(() => setupStore.getLaboratoryInstruments)

  function addLabInstrument(): void {
    const payload = { 
      labName: instrument.labName, 
      serialNumber: instrument.serialNumber, 
      dateCommissioned: instrument.dateCommissioned,
      dateDecommissioned: instrument.dateDecommissioned,
      instrumentUid: instrument.instrumentUid,
    }
    withClientMutation<AddLaboratoryInstrumentMutation, AddLaboratoryInstrumentMutationVariables>(AddLaboratoryInstrumentDocument, { payload }, "createLaboratoryInstrument")
    .then((result) => setupStore.addLaboratoryInstrument(result));
  }

  function editLabInstrument(): void {
    const payload = { 
      labName: instrument.labName, 
      serialNumber: instrument.serialNumber, 
      dateCommissioned: instrument.dateCommissioned,
      dateDecommissioned: instrument.dateDecommissioned,
      instrumentUid: instrument.instrumentUid,
    }
    withClientMutation<EditLaboratoryInstrumentMutation, EditLaboratoryInstrumentMutationVariables>(EditLaboratoryInstrumentDocument, { uid: instrument.uid, payload },"updateLaboratoryInstrument")
    .then((result) => setupStore.updateLaboratoryInstrument(result));
  }

  function FormManager(create: boolean, obj = {} as LaboratoryInstrumentType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "LABORATORY INSTRUMENT";
    if (create) {
      Object.assign(instrument, { ...({} as LaboratoryInstrumentType) });
    } else {
      Object.assign(instrument, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) addLabInstrument();
    if (formAction.value === false) editLabInstrument();
    showModal.value = false;
  }
</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Laboratory Instruments">
      <fel-button @click="FormManager(true)"> Add Laboratory Instrument</fel-button>
    </fel-heading>

    <div class="border border-border bg-background rounded-lg shadow-sm p-6 overflow-hidden">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
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
              v-model="instrument.instrumentUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Instrument</option>
              <option v-for="instrument in instruments" :key="instrument?.uid" :value="instrument.uid">
                {{ instrument?.name }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Laboratory Name/ID
            </label>
            <input
              v-model="instrument.labName"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter lab name or ID..."
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Serial Number
            </label>
            <input
              v-model="instrument.serialNumber"
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
              v-model="instrument.dateCommissioned"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Date Decommissioned
            </label>
            <input
              type="date"
              v-model="instrument.dateDecommissioned"
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