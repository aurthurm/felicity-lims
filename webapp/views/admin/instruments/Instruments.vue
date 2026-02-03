<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { InstrumentInputType, InstrumentType } from '@/types/gql'
  import { AddInstrumentDocument, AddInstrumentMutation, AddInstrumentMutationVariables,
    EditInstrumentDocument, EditInstrumentMutation, EditInstrumentMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  import { useForm } from "vee-validate";
  import { object, string } from "yup";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
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
defineOptions({ name: 'InstrumentsView' })
  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()

  // each tab if just gonna be forms with updatable values on button click
  let currentTab = ref('view');
  const tabs = ['view', 'configs',];
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);
  const currentUid = ref<string | null>(null);

  const formSchema = object({
    name: string().required("Name is required"),
    keyword: string().required("Keyword is required"),
    description: string().nullable(),
    instrumentTypeUid: string().nullable(),
    manufacturerUid: string().nullable(),
    supplierUid: string().nullable(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      name: "",
      keyword: "",
      description: "",
      instrumentTypeUid: null,
      manufacturerUid: null,
      supplierUid: null,
    },
  });

  setupStore.fetchInstrumentTypes();    
  const instrumentTypes = computed(() => setupStore.getInstrumentTypes)

  setupStore.fetchInstruments();    
  const instruments = computed(() => setupStore.getInstruments)

  setupStore.fetchManufacturers();    
  const manufacturers = computed(() => setupStore.getManufacturers)

  setupStore.fetchSuppliers();    
  const suppliers = computed(() => setupStore.getSuppliers)

  function addInstrument(values: InstrumentInputType): void {
    const payload = { 
      name: values.name!, 
      keyword: values.keyword!, 
      description: values.description,
      instrumentTypeUid: values.instrumentTypeUid,
      manufacturerUid: values.manufacturerUid,
      supplierUid: values.supplierUid,
    }
    withClientMutation<AddInstrumentMutation, AddInstrumentMutationVariables>(AddInstrumentDocument, { payload }, "createInstrument")
    .then((result) => setupStore.addInstrument(result));
  }

  function editInstrument(values: InstrumentInputType): void {
    if (!currentUid.value) {
      return;
    }
    const payload = { 
      name: values.name!, 
      keyword: values.keyword!, 
      description: values.description,
      instrumentTypeUid: values.instrumentTypeUid,
      manufacturerUid: values.manufacturerUid,
      supplierUid: values.supplierUid,
    }
    withClientMutation<EditInstrumentMutation, EditInstrumentMutationVariables>(EditInstrumentDocument, { uid: currentUid.value, payload },"updateInstrument")
    .then((result) => setupStore.updateInstrument(result));
  }

  function FormManager(create: boolean, obj = {} as InstrumentType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES INSTRUMENT";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: "",
          keyword: "",
          description: "",
          instrumentTypeUid: null,
          manufacturerUid: null,
          supplierUid: null,
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        name: obj.name ?? "",
        keyword: obj.keyword ?? "",
        description: obj.description ?? "",
        instrumentTypeUid: obj.instrumentTypeUid ?? null,
        manufacturerUid: obj.manufacturerUid ?? null,
        supplierUid: obj.supplierUid ?? null,
      });
    }
  }

  const saveForm = handleSubmit((values): void => {
    if (formAction.value === true) addInstrument(values as InstrumentInputType);
    if (formAction.value === false) editInstrument(values as InstrumentInputType);
    showModal.value = false;
  });
</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Instruments">
      <Button @click="FormManager(true)"> Add Instrument</Button>
    </PageHeading>

    <div class="border border-border bg-background rounded-lg shadow-sm p-6 overflow-hidden">
      <Table class="min-w-full divide-y divide-border">
        <TableHeader>
          <TableRow>
            <TableHead class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Name</TableHead>
            <TableHead class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Type</TableHead>
            <TableHead class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Manufacturer</TableHead>
            <TableHead class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Supplier</TableHead>
            <TableHead class="px-4 py-2 text-right text-sm font-medium text-muted-foreground tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="bg-background divide-y divide-border">
          <TableRow v-for="inst in instruments" :key="inst?.uid" class="hover:bg-muted/50">
            <TableCell class="px-4 py-2 whitespace-nowrap text-sm text-foreground">{{ inst?.name }}</TableCell>
            <TableCell class="px-4 py-2 whitespace-nowrap text-sm text-foreground">{{ inst?.instrumentType?.name }}</TableCell>
            <TableCell class="px-4 py-2 whitespace-nowrap text-sm text-foreground">{{ inst?.manufacturer?.name }}</TableCell>
            <TableCell class="px-4 py-2 whitespace-nowrap text-sm text-foreground">{{ inst?.supplier?.name }}</TableCell>
            <TableCell class="px-4 py-2 whitespace-nowrap text-sm text-right">
              <Button variant="outline" size="sm" @click="FormManager(false, inst)">
                Edit
              </Button>
            </TableCell>
          </TableRow>
          <TableEmpty v-if="!instruments || instruments.length === 0" :colspan="5">
            <Empty class="border-0 bg-transparent p-0">
              <EmptyContent>
                <EmptyHeader>
                  <EmptyTitle>No instruments found</EmptyTitle>
                  <EmptyDescription>Add an instrument to get started.</EmptyDescription>
                </EmptyHeader>
              </EmptyContent>
            </Empty>
          </TableEmpty>
        </TableBody>
      </Table>
    </div>
  </div>

  <!-- Instrument Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :title="formTitle">
    <template v-slot:body>
      <Form @submit="saveForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem class="md:col-span-2">
              <FormLabel>Instrument Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter instrument name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="keyword" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Keyword</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter keyword" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="instrumentTypeUid" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Instrument Type</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select instrument type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select instrument type</SelectItem>
                    <SelectItem v-for="instrumentType in instrumentTypes" :key="instrumentType?.uid" :value="instrumentType.uid">
                      {{ instrumentType?.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="manufacturerUid" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select manufacturer</SelectItem>
                    <SelectItem v-for="manufacturer in manufacturers" :key="manufacturer?.uid" :value="manufacturer.uid">
                      {{ manufacturer?.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="supplierUid" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Supplier</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select supplier</SelectItem>
                    <SelectItem v-for="supplier in suppliers" :key="supplier?.uid" :value="supplier.uid">
                      {{ supplier?.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="description" v-slot="{ componentField }">
            <FormItem class="md:col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Enter description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex justify-end pt-2">
          <Button type="submit">
            {{ formAction ? 'Create' : 'Update' }} Instrument
          </Button>
        </div>
      </Form>
    </template>
  </Modal>
</template>
