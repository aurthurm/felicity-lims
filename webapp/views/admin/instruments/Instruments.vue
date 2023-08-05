<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { IInstrument } from '../../../models/setup'
  import { ADD_INSTRUMENT, EDIT_INSTRUMENT  } from '../../../graphql/operations/instrument.mutations';
  import { useUserStore, useSetupStore } from '../../../stores';
  import { useApiUtil } from '../../../composables';
  const modal = defineAsyncComponent(
    () => import('../../../components/SimpleModal.vue')
  )

  const userStore = useUserStore()
  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()

  // each tab if just gonna be forms with updatable values on button click
  let currentTab = ref('view');
  const tabs = ['view', 'configs',];
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);

  let instrument = reactive({})  as IInstrument;

  setupStore.fetchInstrumentTypes();    
  const instrumentTypes = computed(() => setupStore.getInstrumentTypes)

  setupStore.fetchInstruments();    
  const instruments = computed(() => setupStore.getInstruments)

  setupStore.fetchManufacturers();    
  const manufacturers = computed(() => setupStore.getManufacturers)

  setupStore.fetchSuppliers();    
  const suppliers = computed(() => setupStore.getSuppliers)

  function addInstrument(): void {
    const payload = { 
      name: instrument.name, 
      keyword: instrument.keyword, 
      description: instrument.description,
      instrumentTypeUid: instrument.instrumentTypeUid,
      manufacturerUid: instrument.manufacturerUid,
      supplierUid: instrument.supplierUid,
    }
    withClientMutation(ADD_INSTRUMENT, { payload }, "createInstrument")
    .then((result) => setupStore.addInstrument(result));
  }

  function editInstrument(): void {
    const payload = { 
      name: instrument.name, 
      keyword: instrument.keyword, 
      description: instrument.description,
      instrumentTypeUid: instrument.instrumentTypeUid,
      manufacturerUid: instrument.manufacturerUid,
      supplierUid: instrument.supplierUid,
    }
    withClientMutation(EDIT_INSTRUMENT,{ uid: instrument.uid, payload },"updateInstrument")
    .then((result) => setupStore.updateInstrument(result));
  }

  function FormManager(create: boolean, obj = {} as IInstrument): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES INSTRUMENT";
    if (create) {
      Object.assign(instrument, { ...({} as IInstrument) });
    } else {
      Object.assign(instrument, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) addInstrument();
    if (formAction.value === false) editInstrument();
    showModal.value = false;
  }
</script>

<template>
  <div class="">
    <div class="container w-full my-4">
      <hr>
      <button
        class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      > Add Instrument</button>
      <hr>
    </div>
    <hr />

    <div class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <table class="min-w-full">
          <thead>
          <tr>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Name</th>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Type</th>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Manufacturer</th>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Supplier</th>
              <th class="px-1 py-1 border-b-2 border-gray-300"></th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr v-for="inst in instruments" :key="inst?.uid">
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-gray-800">{{ inst?.name }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-gray-800">{{ inst?.instrumentType?.name }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">{{ inst?.manufacturer?.name }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">{{ inst?.supplier?.name }}</div>
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
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Instrument Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="instrument.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">keyword</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="instrument.keyword"
              placeholder="Keyword ..."
            />
          </label>
          <label class="block col-span-1 mb-2" >
            <span class="text-gray-700 w-4/12">Instrument Type</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="instrument.instrumentTypeUid">
                <option></option>
                <option v-for="instrumentType in instrumentTypes" :key="instrumentType?.uid" :value="instrumentType.uid"> {{ instrumentType?.name }}</option>
              </select>
            </div>
          </label>
          <label class="block col-span-1 mb-2" >
            <span class="text-gray-700 w-4/12">Manufacturer</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="instrument.manufacturerUid">
                <option></option>
                <option v-for="manufacturer in manufacturers" :key="manufacturer?.uid" :value="manufacturer.uid"> {{ manufacturer?.name }}</option>
              </select>
            </div>
          </label>
          <label class="block col-span-1 mb-2" >
            <span class="text-gray-700 w-4/12">Supplier</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="instrument.supplierUid">
                <option></option>
                <option v-for="supplier in suppliers" :key="supplier?.uid" :value="supplier.uid"> {{ supplier?.name }}</option>
              </select>
            </div>
          </label>
          <label class="block col-span-3 mb-2">
            <span class="text-gray-700">Description</span>
            <textarea
            cols="2"
              class="form-input mt-1 block w-full"
              v-model="instrument.description"
              placeholder="Description ..."
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