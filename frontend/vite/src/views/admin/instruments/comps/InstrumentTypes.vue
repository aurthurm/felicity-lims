<template>
  <div class="">
    <div class="container w-full my-4">
      <hr>
      <button
        class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      > Add Instrument Type</button>
      <hr>
    </div>
    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-5">
        <ul>
          <li 
          v-for="instype in instrumentTypes" :key="instype?.uid"
          @click.prevent.stop="selectInstrumentType(instype)"
          class="flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold bg-white p-1 mb-2">
            <span class="cursor-pointer">
              <div class="flex-grow p-1">
                <div class="font-medium text-gray-500 hover:text-gray-700 flex justify-between">
                  <span>{{ instype?.name }}</span>
                  <span class="text-sm text-gray-500"></span>
                </div>
              </div>
            </span>
            <button
              @click="FormManager(false, instype)"
              class="ml-4 inline-flex items-center justify-center w-8 h-8 mr-2 border-blue-500 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                ></path>
              </svg>
            </button>
          </li>
        </ul>
      </section>

    </div>
  </div>

  <!-- instType Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Instrument Type</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="instrumentType.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Description</span>
            <textarea
            cols="2"
              class="form-input mt-1 block w-full"
              v-model="instrumentType.description"
              placeholder="Description ..."
            />
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>

<script setup lang="ts">
  import modal from '../../../../components/SimpleModal.vue';

  import { useMutation } from '@urql/vue';
  import { ref, reactive, computed } from 'vue';
  import { useStore } from 'vuex';
  import { ActionTypes } from '../../../../store/modules/setup';
  import { IInstrumentType } from '../../../../models/setup'
  import { ADD_INSTRUMENT_TYPE, EDIT_INSTRUMENT_TYPE } from '../../../../graphql/instrument.mutations';

  let store = useStore();
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);

  store.dispatch(ActionTypes.FETCH_INSTRUMENT_TYPES);    
  const instrumentTypes = computed(() =>store.getters.getInstrumentTypes);
  let instrumentType = reactive({}) as IInstrumentType;

  const { executeMutation: createInstrumentType } = useMutation(ADD_INSTRUMENT_TYPE);
  const { executeMutation: updateInstrumentType } = useMutation(EDIT_INSTRUMENT_TYPE);

  function addInstrumentType(): void {
    const payload = { name: instrumentType.name, keyword: instrumentType.keyword, description: instrumentType.description }
    createInstrumentType({ payload }).then((result) => {
      store.dispatch(ActionTypes.ADD_INSTRUMENT_TYPE, result);
    });
  }

  function editInstrumentType(): void {
    const payload = { name: instrumentType.name, keyword: instrumentType.keyword, description: instrumentType.description }
    updateInstrumentType({ uid: instrumentType.uid, payload }).then((result) => {
      store.dispatch(ActionTypes.UPDATE_INSTRUMENT_TYPE, result);
    });
  }

  function selectInstrumentType(obj: IInstrumentType): void {
    Object.assign(instrumentType, { ...obj})
  }
  
  function resetInstrumentType(): void {
    Object.assign(instrumentType, { ...({} as IInstrumentType)})
  }

  function FormManager(create: boolean, obj = {} as IInstrumentType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "INSTRUMENT TYPE";
    if (create) {
      Object.assign(instrumentType, { ...({} as IInstrumentType) });
    } else {
      Object.assign(instrumentType, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) addInstrumentType();
    if (formAction.value === false) editInstrumentType();
    showModal.value = false;
  }
  
</script>