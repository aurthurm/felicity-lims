<script setup lang="ts">
  import { ref, computed, toRefs, watch, defineAsyncComponent } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { AddResultOptionDocument, AddResultOptionMutation, AddResultOptionMutationVariables,
    EditResultOptionDocument, EditResultOptionMutation, EditResultOptionMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { ResultOptionType } from '@/types/gql';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSampleStore } from '@/stores/sample';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )
  const VueMultiselect = defineAsyncComponent(
    () => import('vue-multiselect')
  )

  const analysisStore = useAnalysisStore()
  const sampleStore = useSampleStore()
  const { withClientMutation } = useApiUtil()

  const sampleTypes = computed<any[]>(() => sampleStore.getSampleTypes);

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

  const resultOptionSchema = yup.object({
    optionKey: yup
      .number()
      .typeError('Result key must be a number')
      .integer('Result key must be an integer')
      .required('Result key is required'),
    value: yup.string().trim().required('Result value is required'),
    sampleTypes: yup.array().nullable(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: resultOptionSchema,
    initialValues: {
      optionKey: '',
      value: '',
      sampleTypes: [],
    },
  });

  const { value: optionKey, errorMessage: optionKeyError } = useField<number | string>('optionKey');
  const { value: resultValue, errorMessage: resultValueError } = useField<string>('value');
  const { value: sampleTypesField, errorMessage: sampleTypesError } = useField<any[]>('sampleTypes');

  watch(() => props.analysisUid, (anal, prev) => {
      
  })

  function addResultOption(payload: { optionKey: number; value: string; sampleTypes: string[]; analysisUid: string }): void {
      withClientMutation<AddResultOptionMutation, AddResultOptionMutationVariables>(AddResultOptionDocument, { payload }, "createResultOption")
      .then((result) => analysisStore.addResultOption(result));
  }

  function editResultOption(payload: { optionKey: number; value: string; sampleTypes: string[]; analysisUid: string }): void {
      if (!currentUid.value) return;
      withClientMutation<EditResultOptionMutation, EditResultOptionMutationVariables>(EditResultOptionDocument, { uid: currentUid.value, payload }, "updateResultOption")
      .then((result) => analysisStore.updateResultOption(result));
  }

  function FormManager(create: boolean, obj = {} as ResultOptionType):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "RESULT OPTION";
      if (create) {
          currentUid.value = null;
          resetForm({
            values: {
              optionKey: '',
              value: '',
              sampleTypes: [],
            },
          });
      } else {
          currentUid.value = obj.uid ?? null;
          setValues({
            optionKey: obj.optionKey ?? '',
            value: obj.value ?? '',
            sampleTypes: obj.sampleTypes ?? [],
          });
      }
  }

  const saveForm = handleSubmit((values) => {
      const analysisUid = analysis?.value?.uid;
      if (!analysisUid) return;
      const payload = {
        optionKey: Number(values.optionKey),
        value: values.value,
        sampleTypes: (values.sampleTypes ?? []).map((item: any) => item.uid),
        analysisUid,
      };
      if (formAction.value === true) addResultOption(payload);
      if (formAction.value === false) editResultOption(payload);
      showModal.value = false;
  });

</script>

<template>
    <fel-heading title="Result Options">
      <fel-button @click="FormManager(true)">Add Result Option</fel-button>
    </fel-heading>

    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <table class="min-w-full fel-table">
            <thead>
            <tr>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Result Key</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Result Value</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Sample Types</th>
                <th class="px-4 py-2 border-b border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-card">
            <tr v-for="option in analysis?.resultOptions" :key="option?.uid" class="hover:bg-accent/50">
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-foreground">{{ option?.optionKey }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-foreground">{{ option?.value }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="stype of option?.sampleTypes" 
                      :key="stype.uid"
                      class="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-md"
                    >
                      {{ stype.name }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-right border-b border-border">
                    <button 
                      @click="FormManager(false, option)" 
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
              <span class="text-sm font-medium text-muted-foreground">Result Key</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="optionKey"
                placeholder="Key ..."
              />
              <p v-if="optionKeyError" class="text-sm text-destructive">{{ optionKeyError }}</p>
            </label>
            <label class="col-span-2 space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Result Value</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="resultValue"
                placeholder="Value ..."
              />
              <p v-if="resultValueError" class="text-sm text-destructive">{{ resultValueError }}</p>
            </label>
          </div>

          <div class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Sample Types</span>
            <VueMultiselect
              v-model="sampleTypesField"
              :options="sampleTypes"
              :multiple="true"
              :searchable="true"
              label="name"
              track-by="uid"
              class="multiselect-primary"
            >
            </VueMultiselect>
            <p v-if="sampleTypesError" class="text-sm text-destructive">{{ sampleTypesError }}</p>
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

<style>

</style>
