<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<template>
  <form action="post" class="p-1">

    <div class="grid grid-cols-3 gap-x-4 mb-4">
      <label class="block col-span-2 mb-2">
        <span class="text-gray-700">Method Name</span>
        <input
          class="form-input mt-1 block w-full"
          v-model="form.name"
          placeholder="Name ..."
        />
      </label>
      <label class="block col-span-1 mb-2">
        <span class="text-gray-700">keyword</span>
        <input
          class="form-input mt-1 block w-full"
          v-model="form.keyword"
          placeholder="Keyword ..."
        />
      </label>
    </div>

    <div class="grid grid-cols-2 gap-x-4 mb-4">
      <label class="block col-span-2 mb-2" >
        <span class="text-gray-700">Analyses</span>
        <VueMultiselect
        v-model="selectedAnalyses"
        :options="analyses"
        :multiple="true"
        :searchable="true"
        label="name"
        track-by="uid"
        :disabled="analysis?.uid != undefined">
        </VueMultiselect>
      </label>
      <label class="block col-span-2 mb-2">
        <span class="text-gray-700">Instruments</span>
        <VueMultiselect
        v-model="selectedIntsruments"
        :options="instruments"
        :multiple="true"
        :searchable="true"
        label="name"
        track-by="uid">
        </VueMultiselect>
      </label>
      <label class="block col-span-2 mb-2">
        <span class="text-gray-700">Description</span>
        <textarea
        cols="2"
          class="form-input mt-1 block w-full"
          v-model="form.description"
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

<script setup lang="ts">
  import VueMultiselect from 'vue-multiselect';
  import { useMutation } from '@urql/vue';
  import { ref, reactive, computed, PropType, watch, toRefs } from 'vue';
  import { useStore } from 'vuex';
  import { ActionTypes as AnalysisActionTypes} from '../../../../store/modules/analysis';
  import { ActionTypes } from '../../../../store/modules/setup';
  import { IInstrument, IMethod } from '../../../../models/setup'
  import { ADD_METHOD, EDIT_METHOD  } from '../../../../graphql/instrument.mutations';
  import { IAnalysisService } from '../../../../models/analysis';

  const props = defineProps({
      method: Object as PropType<IMethod>,
      methodUid: Number,
      analysis: {
          type: Object as PropType<IAnalysisService>,
          required: false,
          default: () => ({}),
      },
      analysisUid: {
          type: Number | undefined,
          required: false,
          default: undefined,
      },
  })

  const { method, analysis  } = toRefs(props);

  const form = reactive({ ...method?.value });

  watch(() => props.analysisUid, (anal, prev) => {})
  
  const emit = defineEmits(['close'])

  let store = useStore();

  let selectedAnalyses = ref<IAnalysisService[]>([]);
  if(analysis.value?.uid !== undefined) {
    selectedAnalyses.value.push(analysis.value)
  } else {
    const analysesParams = { first: 1000, after: "", text: "", sortBy: ["name"]}
    store.dispatch(AnalysisActionTypes.FETCH_ANALYSES_SERVICES, analysesParams);
  }
  const analyses = computed<IAnalysisService[]>(() => store.getters.getAnalysesServicesSimple)

  store.dispatch(ActionTypes.FETCH_INSTRUMENTS);
  const instruments = computed<IInstrument[]>(() => store.getters.getInstruments)
  let selectedIntsruments = ref<IInstrument[]>([]);
  const getAnalMethInstruments = (): IInstrument[] => {
      const final: IInstrument[] = [];
      method.value?.instruments?.forEach((instrument: any) => {
          const exist = analysis.value?.instruments?.some(item => item?.uid === instrument?.uid);
          if (exist) {
            final.push(instrument);
          }
      })
    
    return  final;
  }
  selectedIntsruments.value = getAnalMethInstruments()

  // store.dispatch(ActionTypes.FETCH_METHODS);
  // const methods = computed<IMethod[]>(() => store.getters.getMethods) 

  const { executeMutation: createMethod } = useMutation(ADD_METHOD);
  const { executeMutation: updateMethod } = useMutation(EDIT_METHOD);

  function addMethod(): void {
    const payload = { 
      name: form?.name, 
      keyword: form?.keyword, 
      description: form?.description,
      instruments: selectedIntsruments.value?.map((i) => i.uid), 
      analyses: selectedAnalyses.value?.map((i) => i.uid),
    }
    createMethod({ payload }).then((result) => {
      store.dispatch(ActionTypes.ADD_METHOD, result);
    });
  }

  function editMethod(): void {
    const payload = { 
      name: form?.name, 
      keyword: form?.keyword, 
      description: form?.description, 
      instruments: selectedIntsruments.value?.map((i) => i.uid), 
      analyses: selectedAnalyses.value?.map((i) => i.uid),
    }
    updateMethod({ uid: form?.uid, payload }).then((result) => {
      store.dispatch(ActionTypes.UPDATE_METHOD, result);
    });
  }

  function saveForm():void {
    if (!method?.value?.uid) addMethod();
    if (method?.value?.uid) editMethod();
    emit('close');
  }


</script>