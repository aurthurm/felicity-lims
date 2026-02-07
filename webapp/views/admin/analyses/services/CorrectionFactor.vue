<script setup lang="ts">
  import { computed, ref, toRefs, watch } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { AddAnalysisCorrectionFactorDocument, AddAnalysisCorrectionFactorMutation, AddAnalysisCorrectionFactorMutationVariables,
    EditAnalysisCorrectionFactorDocument, EditAnalysisCorrectionFactorMutation, EditAnalysisCorrectionFactorMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { AnalysisCorrectionFactorType, InstrumentType, MethodType } from '@/types/gql';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import {FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
  import Modal from '@/components/ui/Modal.vue';
  import PageHeading from "@/components/common/PageHeading.vue";

  const SELECT_NONE = '__none__';

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
          default: '',
      },
  })

  const { analysis } = toRefs(props);
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);
  const currentUid = ref<string | null>(null);

  const correctionSchema = yup.object({
    instrumentUid: yup.string().trim().required('Instrument is required'),
    methodUid: yup.string().trim().required('Method is required'),
    factor: yup
      .number()
      .typeError('Factor must be a number')
      .required('Factor is required'),
  });

  const { handleSubmit, resetForm, setValues, setFieldValue } = useForm({
    validationSchema: correctionSchema,
    initialValues: {
      instrumentUid: '',
      methodUid: '',
      factor: '',
    },
  });

  watch(() => props.analysisUid, (anal, prev) => {
      
  })

  setupStore.fetchInstruments();
  const instruments = computed<InstrumentType[]>(() => setupStore.getInstruments)

  setupStore.fetchMethods();
  const methods = computed<MethodType[]>(() => setupStore.getMethods);

  function onInstrumentChange(v: string) {
    setFieldValue('instrumentUid', v === SELECT_NONE ? '' : v);
  }
  function onMethodChange(v: string) {
    setFieldValue('methodUid', v === SELECT_NONE ? '' : v);
  }

  function addAnalysisCorrectionFactor(payload: { instrumentUid: string; methodUid: string; factor: number; analysisUid: string }): void {
      withClientMutation<AddAnalysisCorrectionFactorMutation, AddAnalysisCorrectionFactorMutationVariables>(AddAnalysisCorrectionFactorDocument, { payload }, "createAnalysisCorrectionFactor")
      .then((result) => analysisStore.AddAnalysisCorrectionFactor(result));
  }

  function editAnalysisCorrectionFactor(payload: { instrumentUid: string; methodUid: string; factor: number; analysisUid: string }): void {
      if (!currentUid.value) return;
      withClientMutation<EditAnalysisCorrectionFactorMutation, EditAnalysisCorrectionFactorMutationVariables>(EditAnalysisCorrectionFactorDocument, { uid: currentUid.value, payload }, "updateAnalysisCorrectionFactor")
      .then((result) => analysisStore.updateAnalysisCorrectionFactor(result));
  }

  function FormManager(create: boolean, obj = {} as AnalysisCorrectionFactorType):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSIS CORRECTION FACTOR";
      if (create) {
          currentUid.value = null;
          resetForm({
            values: {
              instrumentUid: '',
              methodUid: '',
              factor: '',
            },
          });
      } else {
          currentUid.value = obj.uid ?? null;
          setValues({
            instrumentUid: obj.instrumentUid ?? '',
            methodUid: obj.methodUid ?? '',
            factor: obj.factor ?? '',
          });
      }
  }

  const saveForm = handleSubmit((values) => {
      const analysisUid = analysis?.value?.uid;
      if (!analysisUid) return;
      const payload = {
        instrumentUid: values.instrumentUid,
        methodUid: values.methodUid,
        factor: Number(values.factor),
        analysisUid,
      };
      if (formAction.value === true) addAnalysisCorrectionFactor(payload);
      if (formAction.value === false) editAnalysisCorrectionFactor(payload);
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
    <PageHeading title="Correction Factors">
      <Button @click="FormManager(true)">Add Correction Factor</Button>
    </PageHeading>
    
    <div class="mt-4 border border-border bg-card rounded-lg shadow-md">
        <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
            <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Instrument</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Method</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Factor</TableHead>
                <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="cfactor in analysis?.correctionFactors" :key="cfactor?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ instrumentName(cfactor?.instrumentUid) }}</TableCell>
                <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ methodName(cfactor?.methodUid) }}</TableCell>
                <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ cfactor.factor }}</TableCell>
                <TableCell class="px-4 py-3 align-middle text-right">
                    <Button variant="outline" size="sm" @click="FormManager(false, cfactor)">
                      Edit
                    </Button>
                </TableCell>
            </TableRow>
            </TableBody>
        </Table>
        </div>
    </div>

  <!-- Correction Factor Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <FormField name="instrumentUid" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Instrument</FormLabel>
                <FormControl>
                  <Select
                    :model-value="componentField.modelValue || SELECT_NONE"
                    @update:model-value="onInstrumentChange"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="SELECT_NONE">Select Instrument</SelectItem>
                      <SelectItem v-for="instrument in instruments" :key="instrument?.uid" :value="instrument.uid">
                        {{ instrument?.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="methodUid" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Method</FormLabel>
                <FormControl>
                  <Select
                    :model-value="componentField.modelValue || SELECT_NONE"
                    @update:model-value="onMethodChange"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="SELECT_NONE">Select Method</SelectItem>
                      <SelectItem v-for="method in methods" :key="method?.uid" :value="method.uid">
                        {{ method?.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="factor" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Factor</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" placeholder="Factor ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <div class="pt-4">
          <Button type="submit" class="w-full">Save Form</Button>
        </div>
      </form>
    </template>
  </Modal>

</template>
