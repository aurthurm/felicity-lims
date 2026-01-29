<script setup lang="ts">
  import { computed, ref, toRefs, watch, defineAsyncComponent } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { AddAnalysisDetectionLimitDocument, AddAnalysisDetectionLimitMutation, AddAnalysisDetectionLimitMutationVariables,
    EditAnalysisDetectionLimitDocument, EditAnalysisDetectionLimitMutation, EditAnalysisDetectionLimitMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { AnalysisDetectionLimitType, InstrumentType, MethodType } from '@/types/gql';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

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

  const detectionSchema = yup.object({
    instrumentUid: yup.string().trim().required('Instrument is required'),
    methodUid: yup.string().trim().required('Method is required'),
    lowerLimit: yup
      .number()
      .typeError('Lower limit must be a number')
      .required('Lower limit is required'),
    upperLimit: yup
      .number()
      .typeError('Upper limit must be a number')
      .required('Upper limit is required'),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: detectionSchema,
    initialValues: {
      instrumentUid: '',
      methodUid: '',
      lowerLimit: '',
      upperLimit: '',
    },
  });

  const { value: instrumentUid, errorMessage: instrumentError } = useField<string>('instrumentUid');
  const { value: methodUid, errorMessage: methodError } = useField<string>('methodUid');
  const { value: lowerLimit, errorMessage: lowerLimitError } = useField<number | string>('lowerLimit');
  const { value: upperLimit, errorMessage: upperLimitError } = useField<number | string>('upperLimit');

  watch(() => props.analysisUid, (anal, prev) => {
      
  })

  setupStore.fetchInstruments();
  const instruments = computed<InstrumentType[]>(() => setupStore.getInstruments)

  setupStore.fetchMethods();
  const methods = computed<MethodType[]>(() => setupStore.getMethods)

  function addAnalysisDetectionLimit(payload: { instrumentUid: string; methodUid: string; lowerLimit: number; upperLimit: number; analysisUid: string }): void {
      withClientMutation<AddAnalysisDetectionLimitMutation, AddAnalysisDetectionLimitMutationVariables>(AddAnalysisDetectionLimitDocument, { payload }, "createAnalysisDetectionLimit")
      .then((result) => analysisStore.addAnalysisDetectionLimit(result));
  }

  function editAnalysisDetectionLimit(payload: { instrumentUid: string; methodUid: string; lowerLimit: number; upperLimit: number; analysisUid: string }): void {
      if (!currentUid.value) return;
      withClientMutation<EditAnalysisDetectionLimitMutation, EditAnalysisDetectionLimitMutationVariables>(EditAnalysisDetectionLimitDocument, { uid: currentUid.value, payload }, "updateAnalysisDetectionLimit")
      .then((result) => analysisStore.updateAnalysisDetectionLimit(result));
  }

  function FormManager(create: boolean, obj = {} as AnalysisDetectionLimitType):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSIS DETECTION_LIMIT";
      if (create) {
          currentUid.value = null;
          resetForm({
            values: {
              instrumentUid: '',
              methodUid: '',
              lowerLimit: '',
              upperLimit: '',
            },
          });
      } else {
          currentUid.value = obj.uid ?? null;
          setValues({
            instrumentUid: obj.instrumentUid ?? '',
            methodUid: obj.methodUid ?? '',
            lowerLimit: obj.lowerLimit ?? '',
            upperLimit: obj.upperLimit ?? '',
          });
      }
  }

  const saveForm = handleSubmit((values) => {
      const analysisUid = analysis?.value?.uid;
      if (!analysisUid) return;
      const payload = {
        instrumentUid: values.instrumentUid,
        methodUid: values.methodUid,
        lowerLimit: Number(values.lowerLimit),
        upperLimit: Number(values.upperLimit),
        analysisUid,
      };
      if (formAction.value === true) addAnalysisDetectionLimit(payload);
      if (formAction.value === false) editAnalysisDetectionLimit(payload);
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
    <fel-heading title="Detection Limits">
      <fel-button @click="FormManager(true)">Add Detection Limit</fel-button>
    </fel-heading>

    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Instrument</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Method</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Lower Limit</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Upper Limit</th>
                <th class="px-4 py-2 border-b border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-card">
            <tr v-for="limit in analysis?.detectionLimits" :key="limit?.uid" class="hover:bg-accent/50">
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ instrumentName(limit?.instrumentUid) }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ methodName(limit?.methodUid) }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ limit.lowerLimit }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ limit.upperLimit }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                    <button 
                      @click="FormManager(false, limit)" 
                      class="px-2 py-1 mr-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground"
                    >
                      Edit
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

  <!-- Detection Limit Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-4 gap-4">
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
              <span class="text-sm font-medium text-muted-foreground">Lower Limit</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="lowerLimit"
                placeholder="Value ..."
              />
              <p v-if="lowerLimitError" class="text-sm text-destructive">{{ lowerLimitError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Upper Limit</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="upperLimit"
                placeholder="Value ..."
              />
              <p v-if="upperLimitError" class="text-sm text-destructive">{{ upperLimitError }}</p>
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
  </modal>

</template>
