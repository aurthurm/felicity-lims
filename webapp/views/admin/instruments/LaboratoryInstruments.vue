<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { ILaboratoryInstrument } from '@/models/setup'
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

  let instrument = reactive({})  as ILaboratoryInstrument;

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

  function FormManager(create: boolean, obj = {} as ILaboratoryInstrument): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "LABORATORY INSTRUMENT";
    if (create) {
      Object.assign(instrument, { ...({} as ILaboratoryInstrument) });
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
  <div class="">
    <div class="container w-full my-4">
      <hr>
      <button
        class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      > Add Laboratory Instrument</button>
      <hr>
    </div>
    <hr />

    <div class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <table class="min-w-full">
          <thead>
          <tr>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Instrument</th>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Lab Name/ID</th>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Serial Number</th>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Date Commisioned</th>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Date Decommisioned</th>
              <th class="px-1 py-1 border-b-2 border-gray-300"></th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr v-for="inst in laboratoryInstruments" :key="inst?.uid">
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-gray-800">{{ inst?.instrument?.name }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-gray-800">{{ inst?.labName }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">{{ inst?.serialNumber }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">{{ inst?.dateCommissioned }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">{{ inst?.dateDecommissioned }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                  <button @click="FormManager(false, inst)" class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Edit</button>
              </td>
          </tr>
          </tbody>
      </table>
      </div>
  </div>

  </div>

  <!-- AnaltsisProfile Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2" >
            <span class="text-gray-700 w-4/12">Instrument</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="instrument.instrumentUid">
                <option></option>
                <option v-for="instrument in instruments" :key="instrument?.uid" :value="instrument.uid"> {{ instrument?.name }}</option>
              </select>
            </div>
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Laboratory Name/ID</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="instrument.labName"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Serial Number</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="instrument.serialNumber"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Date Commisioned</span>
            <input
              type="date"
              class="form-input mt-1 block w-full"
              v-model="instrument.dateCommissioned"
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Date Decommisioned</span>
            <input
              type="date"
              class="form-input mt-1 block w-full"
              v-model="instrument.dateDecommissioned"
            />
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>