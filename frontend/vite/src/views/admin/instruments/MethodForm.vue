<script setup lang="ts">
  import VueMultiselect from 'vue-multiselect';
  import { ref, reactive, computed, PropType, watch, toRefs } from 'vue';
  import { IInstrument, IMethod } from '../../../models/setup'
  import { ADD_METHOD, EDIT_METHOD  } from '../../../graphql/instrument.mutations';
  import { IAnalysisService } from '../../../models/analysis';
  import { useAnalysisStore, useSetupStore } from '../../../stores';
  import { useApiUtil } from '../../../composables';

  const analysisStore = useAnalysisStore()
  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()

  const props = defineProps({
      method: Object as PropType<IMethod>,
      methodUid: Number,
      analysis: Object as PropType<IAnalysisService>,
      analysisUid: Number,
  })

  const { method, analysis  } = toRefs(props);

  const form = reactive({ ...method?.value });

  watch(() => props.analysisUid, (anal, prev) => {})
  
  const emit = defineEmits(['close'])

  const analyses = computed<IAnalysisService[]>(() => analysisStore.getAnalysesServicesSimple )
  let selectedAnalyses = ref<IAnalysisService[]>([]);
  if(analysis?.value?.uid !== undefined) {
    selectedAnalyses.value.push(analysis.value)
  } else {
    analyses.value?.forEach(an => {
      if(an?.methods?.some(m => m.uid == method?.value?.uid)) {
        selectedAnalyses.value.push(an)
      }
    })
  }

  setupStore.fetchInstruments();
  const instruments = computed<IInstrument[]>(() => setupStore.getInstruments)
  let selectedIntsruments = ref<IInstrument[]>([]);
  const getAnalMethInstruments = (): IInstrument[] => {
      const final: IInstrument[] = [];
      method?.value?.instruments?.forEach((instrument: any) => {
          const exist = analysis?.value?.instruments?.some(item => item?.uid === instrument?.uid);
          if (exist) {
            final.push(instrument);
          }
      })
    
    return  final;
  }
  selectedIntsruments.value = getAnalMethInstruments()
  if(method?.value?.uid !== undefined){
    method?.value?.instruments?.forEach(inst => selectedIntsruments.value.push(inst))
  }

  // store.dispatch(ActionTypes.FETCH_METHODS);
  // const methods = computed<IMethod[]>(() => store.getters.getMethods) 

  function addMethod(): void {
    const payload = { 
      name: form?.name, 
      keyword: form?.keyword, 
      description: form?.description,
      instruments: selectedIntsruments.value?.map((i) => i.uid), 
      analyses: selectedAnalyses.value?.map((i) => i.uid),
    }
    withClientMutation(ADD_METHOD, { payload }, "createMethod").then((result) => {
      emit('close');
      setupStore.addMethod(result);
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
    withClientMutation(EDIT_METHOD, { uid: form?.uid, payload }, "updateMethod")
    .then((result) => {
      emit('close');
      setupStore.updateMethod(result)
    });
  }

  function saveForm():void {
    if (!method?.value?.uid) addMethod();
    if (method?.value?.uid) editMethod();
  }


</script>

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
