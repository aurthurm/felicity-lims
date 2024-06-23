<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { IUnit } from '../../../models/setup'
  import { ADD_UNIT, EDIT_UNIT } from '../../../graphql/operations/instrument.mutations';
  import { useSetupStore } from '../../../stores';
  import { useApiUtil } from '../../../composables';
  const modal = defineAsyncComponent(
    () => import('../../../components/SimpleModal.vue')
  )

  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);

  setupStore.fetchUnits();    
  const units = computed(() => setupStore.getUnits);

  let unit = reactive({}) as IUnit;

  function addUnit(): void {
    const payload = { name: unit.name, description: unit.description }
    withClientMutation(ADD_UNIT, { payload }, "createUnit")
    .then((result) => setupStore.addUnit(result));
  }

  function editUnit(): void {
    const payload = { name: unit.name, description: unit.description }
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
        class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      > Add Unit</button>
      <hr>
    </div>

    <div class="overflow-x-auto mt-4  overflow-y-scroll overscroll-contain max-h-[740px]">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Name</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Description</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr v-for="unit in units" :key="unit?.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-gray-800">{{ unit?.name }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500"></td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button @click="FormManager(false, unit)" class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
      </div>
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
              v-model="unit.description"
            />
            <span class="text-gray-700 ml-4">Is SI Unit</span>
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

