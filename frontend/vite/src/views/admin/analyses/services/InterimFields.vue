<template>
     <button
        class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      >Add Interim Field</button>
    <hr>
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Interim Key</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Result Value</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Intrument</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr v-for="interim in analysis?.interims"  :key="interim?.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                    <div>
                    <div class="text-sm leading-5 text-gray-800">{{ interim?.key }}</div>
                    </div>
                </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ interim?.value }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ instrumentName(interim?.instrumentUid) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button @click="FormManager(false, interim)" class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

  <!-- Result Options Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body >
      <form action="post" class="p-1">
        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2" >
            <span class="text-gray-700 w-4/12">Instrument</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="form.instrumentUid">
                <option></option>
                <option v-for="instrument in instruments" :key="instrument?.uid" :value="instrument.uid"> {{ instrument?.name }}</option>
              </select>
            </div>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Interim</span>
            <input
             type="number"
              class="form-input mt-1 block w-full"
              v-model="form.key"
              placeholder="Interim Key ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Result</span>
            <input
             type="text"
              class="form-input mt-1 block w-full"
              v-model="form.value"
              placeholder="Resut Value ..."
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
  import { computed, ref, reactive, toRefs, watch } from 'vue';
  import { useMutation } from '@urql/vue';
  import { useStore } from 'vuex';

  import { ActionTypes } from '../../../../store/modules/analysis';
  import { ActionTypes as SetupActionTypes } from '../../../../store/modules/setup';
  import { ADD_ANALYSIS_INTERIM, EDIT_ANALYSIS_INTERIM  } from '../../../../graphql/analyses.mutations';
  import { IAnalysisInterim } from '../../../../models/analysis';
import { IInstrument } from '../../../../models/setup';

  const props = defineProps({
      analysis: {
          type: Object,
          required: true,
          default: () => ({}),
      },
      analysisUid: {
          type: Number,
          required: true,
          default: 0,
      },
  })

  let store = useStore();
  const { analysis } = toRefs(props);
  let showModal = ref(false);
  let formTitle = ref('');
  let form = reactive({}) as IAnalysisInterim;
  const formAction = ref(true);

  watch(() => props.analysisUid, (anal, prev) => {
      console.log(analysis);
  })

  store.dispatch(SetupActionTypes.FETCH_INSTRUMENTS);
  const instruments = computed<IInstrument[]>(() => store.getters.getInstruments)

  const { executeMutation: createAnalysisInterim } = useMutation(ADD_ANALYSIS_INTERIM);
  const { executeMutation: updateAnalysisInterim } = useMutation(EDIT_ANALYSIS_INTERIM);

  function addAnalysisInterim(): void {
      form.key = +form.key!;
      const payload = { ...form, analysisUid: analysis?.value?.uid }
      createAnalysisInterim({ payload }).then((result) => {
          store.dispatch(ActionTypes.ADD_ANALYSIS_INTERIM, result);
      });
  }

  function editAnalysisInterim(): void {
      const payload: any = { ...form };
      delete payload['uid']
      delete payload['__typename']

      updateAnalysisInterim({ uid : form.uid,  payload }).then((result) => {
          store.dispatch(ActionTypes.UPDATE_ANALYSIS_INTERIM, result);
      });
  }

  function FormManager(create: boolean, obj = {} as IAnalysisInterim):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSIS INTERIM";
      if (create) {
          Object.assign(form, { key: null, value: null });
      } else {
          Object.assign(form, { ...obj });
      }
  }

  function saveForm():void {
      if (formAction.value === true) addAnalysisInterim();
      if (formAction.value === false) editAnalysisInterim();
      showModal.value = false;
  }

  const instrumentName = (uid: number): string => {
    const index = instruments?.value?.findIndex(item => item.uid === uid)
    return instruments?.value[index]?.name || "unknown";
  }

</script>