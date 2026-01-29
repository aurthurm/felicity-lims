<script setup lang="ts">
  import { computed, ref, toRefs, watch, defineAsyncComponent } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { AddAnalysisUncertaintyDocument, AddAnalysisUncertaintyMutation, AddAnalysisUncertaintyMutationVariables,
    EditAnalysisUncertaintyDocument, EditAnalysisUncertaintyMutation, EditAnalysisUncertaintyMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { AnalysisUncertaintyType } from '@/types/gql';
  import { InstrumentType, MethodType } from '@/types/gql';
  import { useSetupStore } from '@/stores/setup';
  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';
 
  const analysisStore = useAnalysisStore()
  const  setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  const props = defineProps({
      analysis: {
          type: Object,
          required: true,
          default: () => ({}),
      },
      analysisUid: {
          type: String,
          required: true,
          default: 0,
      },
  })

  const { analysis } = toRefs(props);
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);
  const currentUid = ref<string | null>(null);

  const uncertaintySchema = yup.object({
    instrumentUid: yup.string().trim().required('Instrument is required'),
    methodUid: yup.string().trim().required('Method is required'),
    min: yup.number().typeError('Min must be a number').required('Min is required'),
    max: yup.number().typeError('Max must be a number').required('Max is required'),
    value: yup.number().typeError('Variance must be a number').required('Variance is required'),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: uncertaintySchema,
    initialValues: {
      instrumentUid: '',
      methodUid: '',
      min: '',
      max: '',
      value: '',
    },
  });

  const { value: instrumentUid, errorMessage: instrumentError } = useField<string>('instrumentUid');
  const { value: methodUid, errorMessage: methodError } = useField<string>('methodUid');
  const { value: min, errorMessage: minError } = useField<number | string>('min');
  const { value: max, errorMessage: maxError } = useField<number | string>('max');
  const { value: variance, errorMessage: varianceError } = useField<number | string>('value');

  watch(() => props.analysisUid, (anal, prev) => {
      
  })

  setupStore.fetchInstruments();
  const instruments = computed<InstrumentType[]>(() => setupStore.getInstruments)

  setupStore.fetchMethods();
  const methods = computed<MethodType[]>(() => setupStore.getMethods)

  function addAnalysisUncertainty(payload: { instrumentUid: string; methodUid: string; min: number; max: number; value: number; analysisUid: string }): void {
      withClientMutation<AddAnalysisUncertaintyMutation, AddAnalysisUncertaintyMutationVariables>(AddAnalysisUncertaintyDocument, { payload }, "createAnalysisUncertainty")
      .then((result) => analysisStore.addAnalysisUncertainty(result));
  }

  function editAnalysisUncertainty(payload: { instrumentUid: string; methodUid: string; min: number; max: number; value: number; analysisUid: string }): void {
      if (!currentUid.value) return;
      withClientMutation<EditAnalysisUncertaintyMutation, EditAnalysisUncertaintyMutationVariables>(EditAnalysisUncertaintyDocument, { uid: currentUid.value, payload }, "updateAnalysisUncertainty")
      .then((result) => analysisStore.updateAnalysisUncertainty(result));
  }

  function FormManager(create: boolean, obj = {} as AnalysisUncertaintyType):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSIS UNCERTAINTY";
      if (create) {
          currentUid.value = null;
          resetForm({
            values: {
              instrumentUid: '',
              methodUid: '',
              min: '',
              max: '',
              value: '',
            },
          });
      } else {
          currentUid.value = obj.uid ?? null;
          setValues({
            instrumentUid: obj.instrumentUid ?? '',
            methodUid: obj.methodUid ?? '',
            min: obj.min ?? '',
            max: obj.max ?? '',
            value: obj.value ?? '',
          });
      }
  }

  const saveForm = handleSubmit((values) => {
      const analysisUid = analysis?.value?.uid;
      if (!analysisUid) return;
      const payload = {
        instrumentUid: values.instrumentUid,
        methodUid: values.methodUid,
        min: Number(values.min),
        max: Number(values.max),
        value: Number(values.value),
        analysisUid,
      };
      if (formAction.value === true) addAnalysisUncertainty(payload);
      if (formAction.value === false) editAnalysisUncertainty(payload);
      showModal.value = false;
  });

  const instrumentName = (uid: string): string => {
    const index = instruments?.value?.findIndex(item => item.uid === uid)
    return instruments?.value[index]?.name || "unknown";
  }

  const methodName = (uid: string): string => {
    const index = methods?.value?.findIndex(item => item.uid === uid)
    return methods?.value[index]?.name || "unknown";
  }

</script>

<template>
    <fel-heading title="Uncertainty">
      <fel-button @click="FormManager(true)">Add Uncertainty</fel-button>
    </fel-heading>
    
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Instrument</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Method</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Min</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Max</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Variance (+/-)</th>
                <th class="px-4 py-2 border-b border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-card">
            <tr v-for="variance in analysis?.uncertainties" :key="variance?.uid" class="hover:bg-accent/50">
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ instrumentName(variance?.instrumentUid) }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ methodName(variance?.methodUid) }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ variance.min }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ variance.max }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ variance.value }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                    <button @click="FormManager(false, variance)" class="px-2 py-1 mr-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

  <!-- Uncertainty Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-5 gap-4">
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Instrument</span>
              <select 
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="instrumentUid"
              >
                <option value="">Select Instrument</option>
                <option v-for="instrument in instruments" :key="instrument?.uid" :value="instrument.uid">
                  {{ instrument?.name }}
                </option>
              </select>
              <p v-if="instrumentError" class="text-sm text-destructive">{{ instrumentError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Method</span>
              <select 
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="methodUid"
              >
                <option value="">Select Method</option>
                <option v-for="method in methods" :key="method?.uid" :value="method.uid">
                  {{ method?.name }}
                </option>
              </select>
              <p v-if="methodError" class="text-sm text-destructive">{{ methodError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Min</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="min"
                placeholder="Value ..."
              />
              <p v-if="minError" class="text-sm text-destructive">{{ minError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Max</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="max"
                placeholder="Value ..."
              />
              <p v-if="maxError" class="text-sm text-destructive">{{ maxError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Variance +/-</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="variance"
                placeholder="Value ..."
              />
              <p v-if="varianceError" class="text-sm text-destructive">{{ varianceError }}</p>
            </label>
          </div>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Save Form
          </button>
        </div>
      </form>
    </template>
  </fel-modal>

</template>
