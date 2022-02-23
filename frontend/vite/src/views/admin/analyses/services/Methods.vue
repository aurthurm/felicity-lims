<template>
  <button
      class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
      @click="FormManager(true)"
    >Add Method</button>
  <hr>
  <div class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <table class="min-w-full">
          <thead>
          <tr>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Intrument</th>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Method</th>
              <th class="px-1 py-1 border-b-2 border-gray-300"></th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr v-for="method in methods"  :key="method?.uid">
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="flex items-center">
                  <div>
                  <div class="text-sm leading-5 text-gray-800">{{ instrumentName(1) }}</div>
                  </div>
              </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{ method.name }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                  <button @click="FormManager(false, method)" class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">Edit</button>
              </td>
          </tr>
          </tbody>
      </table>
      </div>
  </div>

  <!-- Method Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body >
      <method-form />
    </template>
  </modal>

</template>

<script setup lang="ts">
  import modal from '../../../../components/SimpleModal.vue';
  import MethodForm from '../../instruments/comps/MethodForm.vue';
  
  import { computed, ref, reactive, toRefs, watch } from 'vue';
  import { useMutation } from '@urql/vue';
  import { useStore } from 'vuex';

  import { ActionTypes } from '../../../../store/modules/analysis';
  import { ActionTypes as SetupActionTypes } from '../../../../store/modules/setup';
  import { ADD_ANALYSIS_UNCERTAINTY, EDIT_ANALYSIS_UNCERTAINTY  } from '../../../../graphql/analyses.mutations';
  import { IAnalysisUncertainty } from '../../../../models/analysis';
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
  let form = reactive({}) as IAnalysisUncertainty;
  const formAction = ref(true);

  watch(() => props.analysisUid, (anal, prev) => {
      console.log(analysis);
  })

  store.dispatch(SetupActionTypes.FETCH_INSTRUMENTS);
  const instruments = computed<IInstrument[]>(() => store.getters.getInstruments)

  store.dispatch(SetupActionTypes.FETCH_METHODS);
  const methods = computed<IMethod[]>(() => store.getters.getMethods)

  const { executeMutation: createAnalysisUncertainty } = useMutation(ADD_ANALYSIS_UNCERTAINTY);
  const { executeMutation: updateAnalysisUncertainty } = useMutation(EDIT_ANALYSIS_UNCERTAINTY);

  function addAnalysisUncertainty(): void {
      const payload = { ...form, analysisUid: analysis?.value?.uid }
      createAnalysisUncertainty({ payload }).then((result) => {
          store.dispatch(ActionTypes.ADD_ANALYSIS_UNCERTAINTY, result);
      });
  }

  function editAnalysisUncertainty(): void {
      const payload: any = { ...form };
      delete payload['uid']
      delete payload['__typename']

      updateAnalysisUncertainty({ uid : form.uid,  payload }).then((result) => {
          store.dispatch(ActionTypes.UPDATE_ANALYSIS_UNCERTAINTY, result);
      });
  }

  function FormManager(create: boolean, obj = {} as IAnalysisUncertainty):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSIS UNCERTAINTY";
      if (create) {
          Object.assign(form, { min: null, max: null, value: null, instrumentUid: null , methodUid: null });
      } else {
          Object.assign(form, { ...obj });
      }
  }

  function saveForm():void {
      if (formAction.value === true) addAnalysisUncertainty();
      if (formAction.value === false) editAnalysisUncertainty();
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