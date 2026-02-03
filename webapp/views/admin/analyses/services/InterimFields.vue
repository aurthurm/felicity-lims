<script setup lang="ts">
  import { computed, ref, toRefs, watch, defineAsyncComponent } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { AddAnalysisInterimDocument, AddAnalysisInterimMutation, AddAnalysisInterimMutationVariables,
    EditAnalysisInterimDocument, EditAnalysisInterimMutation, EditAnalysisInterimMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { AnalysisInterimType, InstrumentType } from '@/types/gql';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSetupStore } from '@/stores/setup';
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
          default: '',
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
    <PageHeading title="Interim Fields">
      <Button @click="FormManager(true)">Add Interim Field</Button>
    </PageHeading>

    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <Table class="min-w-full">
            <TableHeader>
            <TableRow>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Interim Key</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Result Value</TableHead>
                <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Instrument</TableHead>
                <TableHead class="px-4 py-2 border-b border-border"></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody class="bg-card">
            <TableRow v-for="interim in analysis?.interims" :key="interim?.uid" class="hover:bg-accent/50">
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ interim?.key }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ interim?.value }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ instrumentName(interim?.instrumentUid) }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                    <Button variant="outline" size="sm" @click="FormManager(false, interim)">
                      Edit
                    </Button>
                </TableCell>
            </TableRow>
            </TableBody>
        </Table>
        </div>
    </div>

  <!-- Result Options Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <Form @submit="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
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
            <FormField name="key" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Interim</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" placeholder="Interim Key ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="value" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Result</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Result Value ..." />
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
