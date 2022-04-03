<script setup lang="ts">
  import modal from '../../../components/SimpleModal.vue';
  import { ref, reactive, computed } from 'vue';
  import { IUnit } from '../../../models/setup'
  import { ADD_UNIT, EDIT_UNIT } from '../../../graphql/instrument.mutations';
  import { useSetupStore } from '../../../stores';
  import { useApiUtil } from '../../../composables';

  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);

  setupStore.fetchUnits();    
  const units = computed(() => setupStore.getUnits);

  let unit = reactive({}) as IUnit;

  function addUnit(): void {
    const payload = { name: unit.name, isSiUnit: unit.isSiUnit == true }
    withClientMutation(ADD_UNIT, { payload }, "createUnit")
    .then((result) => setupStore.addUnit(result));
  }

  function editUnit(): void {
    const payload = { name: unit.name, isSiUnit: unit.isSiUnit == true }
    withClientMutation(EDIT_UNIT, { uid: unit.uid, payload }, "updateUnit")
    .then((result) => setupStore.updateUnit(result));
  }

  function FormManager(create: boolean, obj = {} as IUnit): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "UNIT";
    if (create) {
      Object.assign(unit, { ...({} as IUnit) });
    } else {
      Object.assign(unit, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) addUnit();
    if (formAction.value === false) editUnit();
    showModal.value = false;
  }
  
</script>

<template>
  <div class="">
    <div class="container w-full my-4">
      <hr>
      <button
        class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      > Add Unit</button>
      <hr>
    </div>
    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-5">
        <ul>
          <li 
          v-for="unit in units" :key="unit?.uid"
          class="flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold bg-white p-1 mb-2">
            <span class="cursor-pointer">
              <div class="flex-grow p-1">
                <div class="font-medium text-gray-500 hover:text-gray-700 flex justify-between">
                  <span>{{ unit?.name }}</span>
                  <span class="text-sm text-gray-500"></span>
                </div>
              </div>
            </span>
            <button
              @click="FormManager(false, unit)"
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
              v-model="unit.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 my-2">
            <input
              type="checkbox"
              v-model="unit.isSiUnit"
            />
            <span class="text-gray-700 ml-4">Is SI Unit</span>
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

