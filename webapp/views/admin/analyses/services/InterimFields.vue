<script setup lang="ts">
  import { computed, ref, toRefs, watch, defineAsyncComponent } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { AddAnalysisInterimDocument, AddAnalysisInterimMutation, AddAnalysisInterimMutationVariables,
    EditAnalysisInterimDocument, EditAnalysisInterimMutation, EditAnalysisInterimMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { AnalysisInterimType, InstrumentType } from '@/types/gql';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

  const analysisStore = useAnalysisStore()
  const setupStore = useSetupStore()
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

  const interimSchema = yup.object({
    instrumentUid: yup.string().trim().required('Instrument is required'),
    key: yup
      .number()
      .typeError('Interim key must be a number')
      .integer('Interim key must be an integer')
      .required('Interim key is required'),
    value: yup.string().trim().required('Result value is required'),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: interimSchema,
    initialValues: {
      instrumentUid: '',
      key: '',
      value: '',
    },
  });

  const { value: instrumentUid, errorMessage: instrumentError } = useField<string>('instrumentUid');
  const { value: interimKey, errorMessage: keyError } = useField<number | string>('key');
  const { value: interimValue, errorMessage: valueError } = useField<string>('value');

  watch(() => props.analysisUid, (anal, prev) => {
  })

  setupStore.fetchInstruments();
  const instruments = computed<InstrumentType[]>(() => setupStore.getInstruments)

  function addAnalysisInterim(payload: { instrumentUid: string; key: number; value: string; analysisUid: string }): void {
      withClientMutation<AddAnalysisInterimMutation, AddAnalysisInterimMutationVariables>(AddAnalysisInterimDocument, { payload }, "createAnalysisInterim")
      .then((result) => analysisStore.addAnalysisInterim(result));
  }

  function editAnalysisInterim(payload: { instrumentUid: string; key: number; value: string; analysisUid: string }): void {
      if (!currentUid.value) return;
      withClientMutation<EditAnalysisInterimMutation, EditAnalysisInterimMutationVariables>(EditAnalysisInterimDocument, { uid: currentUid.value, payload }, "updateAnalysisInterim")
      .then((result) => analysisStore.updateAnalysisInterim(result));
  }

  function FormManager(create: boolean, obj = {} as AnalysisInterimType):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSIS INTERIM";
      if (create) {
          currentUid.value = null;
          resetForm({
            values: {
              instrumentUid: '',
              key: '',
              value: '',
            },
          });
      } else {
          currentUid.value = obj.uid ?? null;
          setValues({
            instrumentUid: obj.instrumentUid ?? '',
            key: obj.key ?? '',
            value: obj.value ?? '',
          });
      }
  }

  const saveForm = handleSubmit((values) => {
      const analysisUid = analysis?.value?.uid;
      if (!analysisUid) return;
      const payload = {
        instrumentUid: values.instrumentUid,
        key: Number(values.key),
        value: values.value,
        analysisUid,
      };
      if (formAction.value === true) addAnalysisInterim(payload);
      if (formAction.value === false) editAnalysisInterim(payload);
      showModal.value = false;
  });

  const instrumentName = (uid: string): string => {
    const index = instruments?.value?.findIndex(item => item.uid === uid)
    return instruments?.value[index]?.name || "unknown";
  }

</script>

<template>
    <fel-heading title="Interim Fields">
      <fel-button @click="FormManager(true)">Add Interim Field</fel-button>
    </fel-heading>

    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <table class="min-w-full fel-table">
            <thead>
            <tr>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Interim Key</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Result Value</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Instrument</th>
                <th class="px-4 py-2 border-b border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-card">
            <tr v-for="interim in analysis?.interims" :key="interim?.uid" class="hover:bg-accent/50">
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ interim?.key }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ interim?.value }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ instrumentName(interim?.instrumentUid) }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                    <button 
                      @click="FormManager(false, interim)" 
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

  <!-- Result Options Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
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
              <span class="text-sm font-medium text-muted-foreground">Interim</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="interimKey"
                placeholder="Interim Key ..."
              />
              <p v-if="keyError" class="text-sm text-destructive">{{ keyError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Result</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="interimValue"
                placeholder="Result Value ..."
              />
              <p v-if="valueError" class="text-sm text-destructive">{{ valueError }}</p>
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
