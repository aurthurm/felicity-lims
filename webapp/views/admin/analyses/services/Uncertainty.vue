<script setup lang="ts">
  import { computed, ref, toRefs, watch, defineAsyncComponent } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { AddAnalysisUncertaintyDocument, AddAnalysisUncertaintyMutation, AddAnalysisUncertaintyMutationVariables,
    EditAnalysisUncertaintyDocument, EditAnalysisUncertaintyMutation, EditAnalysisUncertaintyMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { AnalysisUncertaintyType } from '@/types/gql';
  import { InstrumentType, MethodType } from '@/types/gql';
  import { useSetupStore } from '@/stores/setup';
  import { useAnalysisStore } from '@/stores/analysis';
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
 
import PageHeading from "@/components/common/PageHeading.vue"
defineOptions({ name: 'UncertaintyView' })
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
    <PageHeading title="Uncertainty">
      <Button @click="FormManager(true)">Add Uncertainty</Button>
    </PageHeading>
    
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <Table class="min-w-full">
            <TableHeader>
            <TableRow>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Instrument</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Method</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Min</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Max</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Variance (+/-)</TableHead>
                <TableHead class="px-4 py-2 border-b border-border"></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody class="bg-card">
            <TableRow v-for="variance in analysis?.uncertainties" :key="variance?.uid" class="hover:bg-accent/50">
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ instrumentName(variance?.instrumentUid) }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ methodName(variance?.methodUid) }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ variance.min }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ variance.max }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ variance.value }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                    <Button variant="outline" size="sm" @click="FormManager(false, variance)">Edit</Button>
                </TableCell>
            </TableRow>
            </TableBody>
        </Table>
        </div>
    </div>

  <!-- Uncertainty Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-5 gap-4">
            <FormField name="instrumentUid" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Instrument</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Select Instrument</SelectItem>
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
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Select Method</SelectItem>
                      <SelectItem v-for="method in methods" :key="method?.uid" :value="method.uid">
                        {{ method?.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="min" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Min</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" placeholder="Value ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="max" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Max</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" placeholder="Value ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="value" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Variance +/-</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" placeholder="Value ..." />
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
