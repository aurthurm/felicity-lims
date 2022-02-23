<template>
     <button
        class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      >Add Correction Factor</button>
    <hr>
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Intrument</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Method</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Factor</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr v-for="cfactor in analysis?.correctionFactors"  :key="cfactor?.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                    <div>
                    <div class="text-sm leading-5 text-gray-800">{{ instrumentName(cfactor?.instrumentUid) }}</div>
                    </div>
                </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ methodName(cfactor?.instrumentUid) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ cfactor.factor  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button @click="FormManager(false, cfactor)" class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

  <!-- Correction Factor Form Modal -->
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
          <label class="block col-span-1 mb-2" >
            <span class="text-gray-700 w-4/12">Method</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="form.methodUid">
                <option></option>
                <option v-for="method in methods" :key="method?.uid" :value="method.uid"> {{ method?.name }}</option>
              </select>
            </div>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Factor</span>
            <input
             type="number"
              class="form-input mt-1 block w-full"
              v-model="form.factor"
              placeholder="Factor ..."
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
  import { ADD_ANALYSIS_CORRECTION_FACTOR, EDIT_ANALYSIS_CORRECTION_FACTOR  } from '../../../../graphql/analyses.mutations';
  import { IAnalysisCorrectionFactor } from '../../../../models/analysis';
  import { IInstrument, IMethod } from '../../../../models/setup';

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
  let form = reactive({}) as IAnalysisCorrectionFactor;
  const formAction = ref(true);

  watch(() => props.analysisUid, (anal, prev) => {
      console.log(analysis);
  })

  store.dispatch(SetupActionTypes.FETCH_INSTRUMENTS);
  const instruments = computed<IInstrument[]>(() => store.getters.getInstruments)

  store.dispatch(SetupActionTypes.FETCH_METHODS);
  const methods = computed<IMethod[]>(() => store.getters.getMethods)

  const { executeMutation: createAnalysisCorrectionFactor } = useMutation(ADD_ANALYSIS_CORRECTION_FACTOR);
  const { executeMutation: updateAnalysisCorrectionFactor } = useMutation(EDIT_ANALYSIS_CORRECTION_FACTOR);

  function addAnalysisCorrectionFactor(): void {
      const payload = { ...form, analysisUid: analysis?.value?.uid }
      createAnalysisCorrectionFactor({ payload }).then((result) => {
          store.dispatch(ActionTypes.ADD_ANALYSIS_CORRECTION_FACTOR, result);
      });
  }

  function editAnalysisCorrectionFactor(): void {
      const payload: any = { ...form };
      delete payload['uid']
      delete payload['__typename']

      updateAnalysisCorrectionFactor({ uid : form.uid,  payload }).then((result) => {
          store.dispatch(ActionTypes.UPDATE_ANALYSIS_CORRECTION_FACTOR, result);
      });
  }

  function FormManager(create: boolean, obj = {} as IAnalysisCorrectionFactor):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSIS CORRECTION FACTOR";
      if (create) {
          Object.assign(form, { factor: null, instrumentUid: null , methodUid: null });
      } else {
          Object.assign(form, { ...obj });
      }
  }

  function saveForm():void {
      if (formAction.value === true) addAnalysisCorrectionFactor();
      if (formAction.value === false) editAnalysisCorrectionFactor();
      showModal.value = false;
  }

  const instrumentName = (uid: number): string => {
    const index = instruments?.value?.findIndex(item => item.uid === uid)
    return instruments?.value[index]?.name || "unknown";
  }

  const methodName = (uid: number): string => {
    const index = methods?.value?.findIndex(item => item.uid === uid)
    return methods?.value[index]?.name || "unknown";
  }

</script>