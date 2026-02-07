<script setup lang="ts">
  import { ref, computed, toRefs, watch, defineAsyncComponent } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { AddResultOptionDocument, AddResultOptionMutation, AddResultOptionMutationVariables,
    EditResultOptionDocument, EditResultOptionMutation, EditResultOptionMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { ResultOptionType } from '@/types/gql';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSampleStore } from '@/stores/sample';
  import  useApiUtil  from '@/composables/api_util';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import {FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
  import Modal from '@/components/ui/Modal.vue';
  import PageHeading from "@/components/common/PageHeading.vue"
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
          default: '',
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
    <PageHeading title="Result Options">
      <Button @click="FormManager(true)">Add Result Option</Button>
    </PageHeading>

    <div class="mt-4 border border-border bg-card rounded-lg shadow-md">
        <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
            <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Result Key</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Result Value</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sample Types</TableHead>
                <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="option in analysis?.resultOptions" :key="option?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">
                  <div class="text-sm text-foreground">{{ option?.optionKey }}</div>
                </TableCell>
                <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ option?.value }}</TableCell>
                <TableCell class="px-4 py-3 align-middle text-sm">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="stype of option?.sampleTypes" 
                      :key="stype.uid"
                      class="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-md"
                    >
                      {{ stype.name }}
                    </span>
                  </div>
                </TableCell>
                <TableCell class="px-4 py-3 align-middle text-right">
                    <Button variant="outline" size="sm" @click="FormManager(false, option)">
                      Edit
                    </Button>
                </TableCell>
            </TableRow>
            </TableBody>
        </Table>
        </div>
    </div>

  <!-- Result Options Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <FormField name="optionKey" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Result Key</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" placeholder="Key ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="value" v-slot="{ componentField }">
              <FormItem class="col-span-2">
                <FormLabel>Result Value</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Value ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <FormField name="sampleTypes" v-slot="{ value, handleChange }">
            <FormItem>
              <FormLabel>Sample Types</FormLabel>
              <FormControl>
                <VueMultiselect
                  :model-value="value"
                  @update:model-value="handleChange"
                  :options="sampleTypes"
                  :multiple="true"
                  :searchable="true"
                  label="name"
                  track-by="uid"
                  class="multiselect-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="pt-4">
          <Button type="submit" class="w-full">Save Form</Button>
        </div>
      </form>
    </template>
  </Modal>

</template>

<style>

</style>
