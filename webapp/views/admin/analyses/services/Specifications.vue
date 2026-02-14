<script setup lang="ts">
  import { computed, ref, toRefs, watch, defineAsyncComponent } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { AddAnalysisSpecificationDocument, AddAnalysisSpecificationMutation, AddAnalysisSpecificationMutationVariables,
    EditAnalysisSpecificationDocument, EditAnalysisSpecificationMutation, EditAnalysisSpecificationMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { AnalysisSpecificationType, MethodType } from '@/types/gql';
  import { useSetupStore } from '@/stores/setup';
  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/BeakModal.vue')
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

  const specificationSchema = yup.object({
    minReport: yup.string().trim().nullable(),
    minWarn: yup.number().nullable(),
    min: yup.number().nullable(),
    max: yup.number().nullable(),
    maxWarn: yup.number().nullable(),
    maxReport: yup.string().trim().nullable(),
    warnValues: yup.string().trim().nullable(),
    warnReport: yup.string().trim().nullable(),
    methodUid: yup.string().trim().nullable(),
    gender: yup.string().trim().nullable(),
    ageMin: yup.number().nullable(),
    ageMax: yup.number().nullable(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: specificationSchema,
    initialValues: {
      minReport: '',
      minWarn: '',
      min: '',
      max: '',
      maxWarn: '',
      maxReport: '',
      warnValues: '',
      warnReport: '',
      methodUid: '',
      gender: 'all',
      ageMin: '',
      ageMax: '',
    },
  });

  const { value: minReport, errorMessage: minReportError } = useField<string | null>('minReport');
  const { value: minWarn, errorMessage: minWarnError } = useField<number | string>('minWarn');
  const { value: min, errorMessage: minError } = useField<number | string>('min');
  const { value: max, errorMessage: maxError } = useField<number | string>('max');
  const { value: maxWarn, errorMessage: maxWarnError } = useField<number | string>('maxWarn');
  const { value: maxReport, errorMessage: maxReportError } = useField<string | null>('maxReport');
  const { value: warnValues, errorMessage: warnValuesError } = useField<string | null>('warnValues');
  const { value: warnReport, errorMessage: warnReportError } = useField<string | null>('warnReport');
  const { value: methodUid, errorMessage: methodError } = useField<string | null>('methodUid');
  const { value: gender, errorMessage: genderError } = useField<string | null>('gender');
  const { value: ageMin, errorMessage: ageMinError } = useField<number | string>('ageMin');
  const { value: ageMax, errorMessage: ageMaxError } = useField<number | string>('ageMax');

  watch(() => props.analysisUid, (anal, prev) => {
      
  })

  setupStore.fetchMethods();
  const methods = computed<MethodType[]>(() => setupStore.getMethods)

  const toNumberOrNull = (value: number | string | null | undefined): number | null => {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  function addAnalysisSpecification(payload: AnalysisSpecificationType): void {
      withClientMutation<AddAnalysisSpecificationMutation, AddAnalysisSpecificationMutationVariables>(AddAnalysisSpecificationDocument, { payload }, "createAnalysisSpecification")
      .then((result) => analysisStore.addAnalysisSpecification(result));
  }

  function editAnalysisSpecification(payload: AnalysisSpecificationType): void {
      if (!currentUid.value) return;
      withClientMutation<EditAnalysisSpecificationMutation, EditAnalysisSpecificationMutationVariables>(EditAnalysisSpecificationDocument, { uid: currentUid.value, payload }, "updateAnalysisSpecification")
      .then((result) => analysisStore.updateAnalysisSpecification(result));
  }

  function FormManager(create: boolean, obj = {} as AnalysisSpecificationType):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSIS SPECIFICATION";
      if (create) {
          currentUid.value = null;
          resetForm({
            values: {
              minReport: '',
              minWarn: '',
              min: '',
              max: '',
              maxWarn: '',
              maxReport: '',
              warnValues: '',
              warnReport: '',
              methodUid: '',
              gender: 'all',
              ageMin: '',
              ageMax: '',
            },
          });
      } else {
          currentUid.value = obj.uid ?? null;
          setValues({
            minReport: obj.minReport ?? '',
            minWarn: obj.minWarn ?? '',
            min: obj.min ?? '',
            max: obj.max ?? '',
            maxWarn: obj.maxWarn ?? '',
            maxReport: obj.maxReport ?? '',
            warnValues: obj.warnValues ?? '',
            warnReport: obj.warnReport ?? '',
            methodUid: obj.methodUid ?? '',
            gender: obj.gender ?? 'all',
            ageMin: obj.ageMin ?? '',
            ageMax: obj.ageMax ?? '',
          });
      }
  }

  const saveForm = handleSubmit((values) => {
      const analysisUid = analysis?.value?.uid;
      if (!analysisUid) return;
      const payload: AnalysisSpecificationType = {
        analysisUid,
        minReport: values.minReport ?? null,
        minWarn: toNumberOrNull(values.minWarn),
        min: toNumberOrNull(values.min),
        max: toNumberOrNull(values.max),
        maxWarn: toNumberOrNull(values.maxWarn),
        maxReport: values.maxReport ?? null,
        warnValues: values.warnValues ?? null,
        warnReport: values.warnReport ?? null,
        gender: values.gender ?? null,
        ageMin: toNumberOrNull(values.ageMin),
        ageMax: toNumberOrNull(values.ageMax),
        methodUid: values.methodUid ? values.methodUid : null,
      };
      if (formAction.value === true) addAnalysisSpecification(payload);
      if (formAction.value === false) editAnalysisSpecification(payload);
      showModal.value = false;
  });

  const methodName = (uid: string | undefined): string => {
    if (!uid || !methods.value) return '';
    const index = methods.value.findIndex(item => item.uid === uid);
    return methods.value[index]?.name || '';
  }

</script>

<template>
    <beak-heading title="Specifications">
      <beak-button @click="FormManager(true)">Add Specification</beak-button>
    </beak-heading>
    
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <table class="min-w-full beak-table">
            <thead>
            <tr>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-destructive">Min Report</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-warning">Min Warn</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Min</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Max</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-warning">Max Warn</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-destructive">Max Report</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Warn Texts</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Text Report</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Method</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Gender</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Age Min</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Age Max</th>
                <th class="px-4 py-2 border-b border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-card">
            <tr v-for="specification in analysis?.specifications" :key="specification?.uid" class="hover:bg-accent/50">
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-destructive">{{ specification.minReport }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-warning">{{ specification.minWarn }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.min }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.max }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-warning">{{ specification.maxWarn }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-destructive">{{ specification.maxReport }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.warnValues }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.warnReport }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-foreground">{{ methodName(specification?.methodUid) || '' }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.gender }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.ageMin }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.ageMax }}</div>
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-right border-b border-border">
                    <button @click="FormManager(false, specification)" class="px-2 py-1 mr-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

  <!-- Detection Limit Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-3/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Numerical Results</h4>
          <hr class="border-border">
          <div class="grid grid-cols-6 gap-4">
            <label class="space-y-2">
              <span class="text-sm font-medium text-destructive">Min Report</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="minReport"
                placeholder="Value ..."
              />
              <p v-if="minReportError" class="text-sm text-destructive">{{ minReportError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-warning">Min Warn</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="minWarn"
                placeholder="Value ..."
              />
              <p v-if="minWarnError" class="text-sm text-destructive">{{ minWarnError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Min</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="min"
                placeholder="Value ..."
              />
              <p v-if="minError" class="text-sm text-destructive">{{ minError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Max</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="max"
                placeholder="Value ..."
              />
              <p v-if="maxError" class="text-sm text-destructive">{{ maxError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-warning">Max Warn</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="maxWarn"
                placeholder="Value ..."
              />
              <p v-if="maxWarnError" class="text-sm text-destructive">{{ maxWarnError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-destructive">Max Report</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="maxReport"
                placeholder="Value ..."
              />
              <p v-if="maxReportError" class="text-sm text-destructive">{{ maxReportError }}</p>
            </label>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Textual Results</h4>
          <hr class="border-border">
          <div class="grid grid-cols-2 gap-4">
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Textual Results (comma separated)</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="warnValues"
                placeholder="Value ..."
              />
              <p v-if="warnValuesError" class="text-sm text-destructive">{{ warnValuesError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Report Message</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="warnReport"
                placeholder="Value ..."
              />
              <p v-if="warnReportError" class="text-sm text-destructive">{{ warnReportError }}</p>
            </label>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Conditions if Any</h4>
          <hr class="border-border">
          <div class="grid grid-cols-4 gap-4">
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Method</span>
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
              <span class="text-sm font-medium text-foreground">Gender</span>
              <select 
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="gender"
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <p v-if="genderError" class="text-sm text-destructive">{{ genderError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Age Min</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="ageMin"
                placeholder="Value ..."
              />
              <p v-if="ageMinError" class="text-sm text-destructive">{{ ageMinError }}</p>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Age Max</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="ageMax"
                placeholder="Value ..."
              />
              <p v-if="ageMaxError" class="text-sm text-destructive">{{ ageMaxError }}</p>
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
