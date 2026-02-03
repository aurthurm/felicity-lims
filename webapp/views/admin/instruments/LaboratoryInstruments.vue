<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { LaboratoryInstrumentType } from '@/types/gql'
  import { AddLaboratoryInstrumentDocument, AddLaboratoryInstrumentMutation, AddLaboratoryInstrumentMutationVariables,
    EditLaboratoryInstrumentDocument, EditLaboratoryInstrumentMutation, EditLaboratoryInstrumentMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  import { useForm } from "vee-validate";
  import { object, string } from "yup";
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
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import PageHeading from "@/components/common/PageHeading.vue"
  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()

  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);
  const currentUid = ref<string | null>(null);

  const formSchema = object({
    instrumentUid: string().required("Instrument is required"),
    labName: string().required("Lab name/ID is required"),
    serialNumber: string().nullable(),
    dateCommissioned: string().nullable(),
    dateDecommissioned: string().nullable(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      instrumentUid: "",
      labName: "",
      serialNumber: "",
      dateCommissioned: "",
      dateDecommissioned: "",
    },
  });

  setupStore.fetchInstruments();    
  setupStore.fetchLaboratoryInstruments();   
  const instruments = computed(() => setupStore.getInstruments)
  const laboratoryInstruments = computed(() => setupStore.getLaboratoryInstruments)

  function addLabInstrument(values: Record<string, any>): void {
    const payload = { 
      labName: values.labName, 
      serialNumber: values.serialNumber, 
      dateCommissioned: values.dateCommissioned,
      dateDecommissioned: values.dateDecommissioned,
      instrumentUid: values.instrumentUid,
    }
    withClientMutation<AddLaboratoryInstrumentMutation, AddLaboratoryInstrumentMutationVariables>(AddLaboratoryInstrumentDocument, { payload }, "createLaboratoryInstrument")
    .then((result) => setupStore.addLaboratoryInstrument(result));
  }

  function editLabInstrument(values: Record<string, any>): void {
    if (!currentUid.value) {
      return;
    }
    const payload = { 
      labName: values.labName, 
      serialNumber: values.serialNumber, 
      dateCommissioned: values.dateCommissioned,
      dateDecommissioned: values.dateDecommissioned,
      instrumentUid: values.instrumentUid,
    }
    withClientMutation<EditLaboratoryInstrumentMutation, EditLaboratoryInstrumentMutationVariables>(EditLaboratoryInstrumentDocument, { uid: currentUid.value, payload },"updateLaboratoryInstrument")
    .then((result) => setupStore.updateLaboratoryInstrument(result));
  }

  function FormManager(create: boolean, obj = {} as LaboratoryInstrumentType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "LABORATORY INSTRUMENT";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          instrumentUid: "",
          labName: "",
          serialNumber: "",
          dateCommissioned: "",
          dateDecommissioned: "",
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        instrumentUid: obj.instrumentUid ?? "",
        labName: obj.labName ?? "",
        serialNumber: obj.serialNumber ?? "",
        dateCommissioned: obj.dateCommissioned ?? "",
        dateDecommissioned: obj.dateDecommissioned ?? "",
      });
    }
  }

  const saveForm = handleSubmit((values): void => {
    if (formAction.value === true) addLabInstrument(values);
    if (formAction.value === false) editLabInstrument(values);
    showModal.value = false;
  });
</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Laboratory Instruments">
      <Button @click="FormManager(true)"> Add Laboratory Instrument</Button>
    </PageHeading>

    <div class="border border-border bg-background rounded-lg shadow-sm p-6 overflow-hidden">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Instrument</TableHead>
              <TableHead class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Lab Name/ID</TableHead>
              <TableHead class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Serial Number</TableHead>
              <TableHead class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Date Commissioned</TableHead>
              <TableHead class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Date Decommissioned</TableHead>
              <TableHead class="px-4 py-2 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="inst in laboratoryInstruments" :key="inst?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-2 align-middle">{{ inst?.instrument?.name }}</TableCell>
              <TableCell class="px-4 py-2 align-middle">{{ inst?.labName }}</TableCell>
              <TableCell class="px-4 py-2 align-middle text-primary">{{ inst?.serialNumber }}</TableCell>
              <TableCell class="px-4 py-2 align-middle text-primary">{{ inst?.dateCommissioned }}</TableCell>
              <TableCell class="px-4 py-2 align-middle text-primary">{{ inst?.dateDecommissioned }}</TableCell>
              <TableCell class="px-4 py-2 align-middle text-right">
                <Button variant="outline" size="sm" @click="FormManager(false, inst)">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!laboratoryInstruments || laboratoryInstruments.length === 0" :colspan="6">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No laboratory instruments found</EmptyTitle>
                    <EmptyDescription>Add a laboratory instrument to get started.</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            </TableEmpty>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Laboratory Instrument Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <Form @submit="saveForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <FormField name="labName" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Laboratory Name/ID</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter lab name or ID..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="serialNumber" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Serial Number</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter serial number..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="dateCommissioned" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Date Commissioned</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="dateDecommissioned" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Date Decommissioned</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </Form>
    </template>
  </Modal>
</template>
