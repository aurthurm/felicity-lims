<script setup lang="ts">
  import { ref, computed, PropType, watch, toRefs, defineAsyncComponent } from 'vue';
  import { useField, useForm } from "vee-validate";
  import { object, string } from "yup";
  import { AddMethodDocument, AddMethodMutation, AddMethodMutationVariables,
    EditMethodDocument, EditMethodMutation, EditMethodMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { AnalysisType, InstrumentType, MethodType } from '@/types/gql';
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
      method: Object as PropType<MethodType>,
      methodUid: String,
      analysis: Object as PropType<AnalysisType>,
      analysisUid: String,
  })

  const { method, analysis  } = toRefs(props);

  const formSchema = object({
    name: string().required("Method name is required"),
    keyword: string().required("Keyword is required"),
    description: string().nullable(),
  });

  const { handleSubmit, errors, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      name: method?.value?.name ?? "",
      keyword: method?.value?.keyword ?? "",
      description: method?.value?.description ?? "",
    },
  });

  const { value: name } = useField<string>("name");
  const { value: keyword } = useField<string>("keyword");
  const { value: description } = useField<string | null>("description");

  watch(() => props.analysisUid, (anal, prev) => {})
  watch(
    () => method?.value,
    (current) => {
      setValues({
        name: current?.name ?? "",
        keyword: current?.keyword ?? "",
        description: current?.description ?? "",
      });
    }
  );
  
  const emit = defineEmits(['close'])

  const analyses = computed<AnalysisType[]>(() => analysisStore.getAnalysesServicesSimple )
  let selectedAnalyses = ref<AnalysisType[]>([]);
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
  const instruments = computed<InstrumentType[]>(() => setupStore.getInstruments)
  let selectedIntsruments = ref<InstrumentType[]>([]);
  const getAnalMethInstruments = (): InstrumentType[] => {
      const final: InstrumentType[] = [];
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

  function addMethod(values: { name: string; keyword: string; description?: string | null }): void {
    const payload = { 
      name: values.name, 
      keyword: values.keyword, 
      description: values.description,
      instruments: selectedIntsruments.value?.map((i) => i.uid), 
      analyses: selectedAnalyses.value?.map((i) => i.uid),
    }
    withClientMutation<AddMethodMutation, AddMethodMutationVariables>(AddMethodDocument, { payload }, "createMethod").then((result) => {
      emit('close');
      setupStore.addMethod(result);
    });
  }

  function editMethod(values: { name: string; keyword: string; description?: string | null }): void {
    const payload = { 
      name: values.name, 
      keyword: values.keyword, 
      description: values.description, 
      instruments: selectedIntsruments.value?.map((i) => i.uid), 
      analyses: selectedAnalyses.value?.map((i) => i.uid),
    }
    withClientMutation<EditMethodMutation, EditMethodMutationVariables>(EditMethodDocument, { uid: method?.value?.uid, payload }, "updateMethod")
    .then((result) => {
      emit('close');
      setupStore.updateMethod(result)
    });
  }

  const saveForm = handleSubmit((values): void => {
    const payload = { name: values.name, keyword: values.keyword, description: values.description };
    if (!method?.value?.uid) addMethod(payload);
    if (method?.value?.uid) editMethod(payload);
  });


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
            v-model="name"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter method name..."
          />
          <div class="text-sm text-destructive">{{ errors.name }}</div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Keyword
          </label>
          <input
            v-model="keyword"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter keyword..."
          />
          <div class="text-sm text-destructive">{{ errors.keyword }}</div>
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
            v-model="description"
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
