<script setup lang="ts">
  import { ref, reactive, computed, PropType, watch, toRefs, defineAsyncComponent } from 'vue';
  import { IInstrument, IMethod } from '@/models/setup'
  import { AddMethodDocument, AddMethodMutation, AddMethodMutationVariables,
    EditMethodDocument, EditMethodMutation, EditMethodMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { IAnalysisService } from '@/models/analysis';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  const VueMultiselect = defineAsyncComponent(
    () => import('vue-multiselect')
  )

  const analysisStore = useAnalysisStore()
  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()

  const props = defineProps({
      method: Object as PropType<IMethod>,
      methodUid: String,
      analysis: Object as PropType<IAnalysisService>,
      analysisUid: String,
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
    withClientMutation<AddMethodMutation, AddMethodMutationVariables>(AddMethodDocument, { payload }, "createMethod").then((result) => {
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
    withClientMutation<EditMethodMutation, EditMethodMutationVariables>(EditMethodDocument, { uid: form?.uid, payload }, "updateMethod")
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
  <form @submit.prevent="saveForm" class="space-y-4">
    <div class="space-y-4">
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2 space-y-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Method Name
          </label>
          <input
            v-model="form.name"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter method name..."
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Keyword
          </label>
          <input
            v-model="form.keyword"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter keyword..."
          />
        </div>
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Analyses
          </label>
          <VueMultiselect
            v-model="selectedAnalyses"
            :options="analyses"
            :multiple="true"
            :searchable="true"
            label="name"
            track-by="uid"
            :disabled="analysis?.uid != undefined"
            class="multiselect-blue"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Instruments
          </label>
          <VueMultiselect
            v-model="selectedIntsruments"
            :options="instruments"
            :multiple="true"
            :searchable="true"
            label="name"
            track-by="uid"
            class="multiselect-blue"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Description
          </label>
          <textarea
            v-model="form.description"
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter description..."
          />
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Save Changes
      </button>
    </div>
  </form>
</template>

<style>
.multiselect-blue {
  --ms-option-bg-selected: theme('colors.primary.DEFAULT');
  --ms-option-color-selected: theme('colors.primary.foreground');
  --ms-tag-bg: theme('colors.primary.DEFAULT');
  --ms-tag-color: theme('colors.primary.foreground');
  --ms-ring-color: theme('colors.primary.DEFAULT');
}
</style>
