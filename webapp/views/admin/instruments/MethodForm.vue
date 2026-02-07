<script setup lang="ts">
  import { ref, computed, PropType, watch, toRefs, defineAsyncComponent } from 'vue';
  import { useForm } from "vee-validate";
  import { object, string } from "yup";
  import { AddMethodDocument, AddMethodMutation, AddMethodMutationVariables,
    EditMethodDocument, EditMethodMutation, EditMethodMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { AnalysisType, InstrumentType, MethodType } from '@/types/gql';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import {FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Label } from "@/components/ui/label";
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

  const { handleSubmit, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      name: method?.value?.name ?? "",
      keyword: method?.value?.keyword ?? "",
      description: method?.value?.description ?? "",
    },
  });

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
        <FormField name="name" v-slot="{ componentField }">
          <FormItem class="col-span-2">
            <FormLabel>Method Name</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="Enter method name..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="keyword" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Keyword</FormLabel>
            <FormControl>
              <Input v-bind="componentField" placeholder="Enter keyword..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="space-y-4">
        <div class="grid gap-2">
          <Label>Analyses</Label>
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

        <div class="grid gap-2">
          <Label>Instruments</Label>
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

        <FormField name="description" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea v-bind="componentField" placeholder="Enter description..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <div class="flex justify-end">
      <Button type="submit">Save Changes</Button>
    </div>
  </form>
</template>
