<script setup lang="ts">
  import { computed, ref, toRefs, watch, defineAsyncComponent } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { AddAnalysisSpecificationDocument, AddAnalysisSpecificationMutation, AddAnalysisSpecificationMutationVariables,
    EditAnalysisSpecificationDocument, EditAnalysisSpecificationMutation, EditAnalysisSpecificationMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { AnalysisSpecificationType, MethodType } from '@/types/gql';
  import { useSetupStore } from '@/stores/setup';
  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import {
    Form,
    FormControl,
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
defineOptions({ name: 'SpecificationsView' })
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
    <PageHeading title="Specifications">
      <Button @click="FormManager(true)">Add Specification</Button>
    </PageHeading>
    
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <Table class="min-w-full">
            <TableHeader>
            <TableRow>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-destructive">Min Report</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-warning">Min Warn</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Min</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Max</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-warning">Max Warn</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-destructive">Max Report</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Warn Texts</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Text Report</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Method</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Gender</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Age Min</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Age Max</TableHead>
                <TableHead class="px-4 py-2 border-b border-border"></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody class="bg-card">
            <TableRow v-for="specification in analysis?.specifications" :key="specification?.uid" class="hover:bg-accent/50">
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-destructive">{{ specification.minReport }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-warning">{{ specification.minWarn }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.min }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.max }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-warning">{{ specification.maxWarn }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-destructive">{{ specification.maxReport }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.warnValues }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.warnReport }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ methodName(specification?.methodUid) || '' }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.gender }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.ageMin }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.ageMax }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                    <Button variant="outline" size="sm" @click="FormManager(false, specification)">Edit</Button>
                </TableCell>
            </TableRow>
            </TableBody>
        </Table>
        </div>
    </div>

  <!-- Detection Limit Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-3/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <Form @submit="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Numerical Results</h4>
          <hr class="border-border">
          <div class="grid grid-cols-6 gap-4">
            <FormField name="minReport" v-slot="{ componentField }">
              <FormItem>
                <FormLabel class="text-destructive">Min Report</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Value ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="minWarn" v-slot="{ componentField }">
              <FormItem>
                <FormLabel class="text-warning">Min Warn</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" placeholder="Value ..." />
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
            <FormField name="maxWarn" v-slot="{ componentField }">
              <FormItem>
                <FormLabel class="text-warning">Max Warn</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" placeholder="Value ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="maxReport" v-slot="{ componentField }">
              <FormItem>
                <FormLabel class="text-destructive">Max Report</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Value ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Textual Results</h4>
          <hr class="border-border">
          <div class="grid grid-cols-2 gap-4">
            <FormField name="warnValues" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Textual Results (comma separated)</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Value ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="warnReport" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Report Message</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Value ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Conditions if Any</h4>
          <hr class="border-border">
          <div class="grid grid-cols-4 gap-4">
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
            <FormField name="gender" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="ageMin" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Age Min</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" placeholder="Value ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="ageMax" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Age Max</FormLabel>
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
      </Form>
    </template>
  </modal>

</template>
