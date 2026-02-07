<script setup lang="ts">
  import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
  import { InstrumentInterfaceType, LaboratoryInstrumentType } from '@/types/gql'
  import { AddInstrumentInterfaceDocument, EditInstrumentInterfaceDocument, EditInstrumentInterfaceMutation, EditInstrumentInterfaceMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  import { useForm } from "vee-validate";
  import { boolean, object, string } from "yup";
import { GetInstrumentInterfacesDocument } from '@/graphql/operations/instrument.queries';
import { AddInstrumentInterfaceMutation, AddInstrumentInterfaceMutationVariables, GetInstrumentInterfacesQuery, GetInstrumentInterfacesQueryVariables } from '@/types/gqlops';
  import { Button } from "@/components/ui/button";
  import { Checkbox } from "@/components/ui/checkbox";
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
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import PageHeading from "@/components/common/PageHeading.vue"
  const IIMapper = defineAsyncComponent(
    () => import('@/components/IIMapper.vue')
  )

  const setupStore = useSetupStore()
  const { withClientMutation, withClientQuery } = useApiUtil()

  let showModal = ref(false);
  let showMapperModal = ref(false);
  let selectedInterfaceForMapping = ref<InstrumentInterfaceType | null>(null);
  let formTitle = ref('');
  const formAction = ref(true);
  const currentUid = ref<string | null>(null);

  let instrumentInterfaces = ref<InstrumentInterfaceType[]>([]);
  const interfaceExtras = ref({
    syncUnits: false,
    driverMapping: null as any,
  });

  const formSchema = object({
    laboratoryInstrumentUid: string().required("Laboratory instrument is required"),
    host: string().nullable(),
    port: string().nullable(),
    protocolType: string().nullable(),
    socketType: string().nullable(),
    autoReconnect: boolean().nullable(),
    isActive: boolean().nullable(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      laboratoryInstrumentUid: "",
      host: "",
      port: "",
      protocolType: "",
      socketType: "",
      autoReconnect: false,
      isActive: true,
    },
  });

  onMounted(() => {
    setupStore.fetchLaboratoryInstruments();
    withClientQuery<GetInstrumentInterfacesQuery, GetInstrumentInterfacesQueryVariables>(GetInstrumentInterfacesDocument, {}, "instrumentInterfaces") 
    .then((result) => {
      instrumentInterfaces.value = (result ?? []) as InstrumentInterfaceType[];
    });
  });
  
  const instruments = computed(() => setupStore.getInstruments)
  const laboratoryInstruments = computed(() => setupStore.getLaboratoryInstruments)

  function addInstrumentInterface(values: Record<string, any>): void {
    const payload = { 
      laboratoryInstrumentUid: values.laboratoryInstrumentUid, 
      host: values.host || '', 
      port: values.port || '',
      protocolType: values.protocolType || '',
      socketType: values.socketType || '',
      syncUnits: interfaceExtras.value.syncUnits,
      driverMapping: interfaceExtras.value.driverMapping,
      isActive: values.isActive,
    }
    withClientMutation<AddInstrumentInterfaceMutation, AddInstrumentInterfaceMutationVariables>
    (AddInstrumentInterfaceDocument, { payload }, "createInstrumentInterface")
    .then((result) => instrumentInterfaces.value.push(result));
  }

  function editInstrumentInterface(values: Record<string, any>): void {
    if (!currentUid.value) {
      return;
    }
    const payload = { 
      laboratoryInstrumentUid: values.laboratoryInstrumentUid, 
      host: values.host || '', 
      port: values.port || '',
      protocolType: values.protocolType || '',
      socketType: values.socketType || '',
      syncUnits: interfaceExtras.value.syncUnits,
      driverMapping: interfaceExtras.value.driverMapping as any,
      isActive: values.isActive,
    }
    withClientMutation<EditInstrumentInterfaceMutation, EditInstrumentInterfaceMutationVariables>(EditInstrumentInterfaceDocument, { uid: currentUid.value, payload } ,"updateInstrumentInterface")
    .then((result) => {
      const index = instrumentInterfaces.value.findIndex((instInt) => instInt.uid === result.uid);
      if (index !== -1) {
        instrumentInterfaces.value[index] = result;
      }
    });
  }

  function FormManager(create: boolean, obj = {} as InstrumentInterfaceType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "INSTRUMENT INTERFACE";
    if (create) {
      currentUid.value = null;
      interfaceExtras.value = {
        syncUnits: false,
        driverMapping: null,
      };
      resetForm({
        values: {
          laboratoryInstrumentUid: "",
          host: "",
          port: "",
          protocolType: "",
          socketType: "",
          autoReconnect: false,
          isActive: true,
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      interfaceExtras.value = {
        syncUnits: obj.syncUnits ?? false,
        driverMapping: obj.driverMapping ?? null,
      };
      setValues({
        laboratoryInstrumentUid: obj.laboratoryInstrumentUid ?? "",
        host: obj.host ?? "",
        port: obj.port ?? "",
        protocolType: obj.protocolType ?? "",
        socketType: obj.socketType ?? "",
        autoReconnect: obj.autoReconnect ?? false,
        isActive: obj.isActive ?? true,
      });
    }
  }

  const saveForm = handleSubmit((values): void => {
    if (formAction.value === true) addInstrumentInterface(values);
    if (formAction.value === false) editInstrumentInterface(values);
    showModal.value = false;
  });

  // Driver Mapping
  function mapDriver(instInt: InstrumentInterfaceType): void {
    selectedInterfaceForMapping.value = instInt;
    showMapperModal.value = true;
  }

  function onMapperSave(driverMapping: Record<string, any>): void {
    if (!selectedInterfaceForMapping.value) return;
    
    // Create payload to update the interface with new driver mapping
    const payload = { 
      laboratoryInstrumentUid: selectedInterfaceForMapping.value.laboratoryInstrumentUid, 
      host: selectedInterfaceForMapping.value.host || '', 
      port: selectedInterfaceForMapping.value.port || '',
      protocolType: selectedInterfaceForMapping.value.protocolType || '',
      socketType: selectedInterfaceForMapping.value.socketType || '',
      syncUnits: selectedInterfaceForMapping.value.syncUnits,
      driverMapping: JSON.stringify(driverMapping) as any,
      isActive: selectedInterfaceForMapping.value.isActive,
    }
    
    // Update via GraphQL
    withClientMutation<EditInstrumentInterfaceMutation, EditInstrumentInterfaceMutationVariables>(
      EditInstrumentInterfaceDocument, 
      { uid: selectedInterfaceForMapping.value.uid, payload }, 
      "updateInstrumentInterface"
    ).then((result) => {
      const index = instrumentInterfaces.value.findIndex((instInt) => instInt.uid === result.uid);
      if (index !== -1) {
        instrumentInterfaces.value[index] = result;
      }
    });
  }
</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Instrument Interfaces">
      <Button @click="FormManager(true)">Add Instrument Interface</Button>
    </PageHeading>

    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Laboratory Instrument</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">TCPIP</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Protocol</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Socket Type</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Auto Reconnect</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sync Units</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Mapped</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Active</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="instInt in instrumentInterfaces" :key="instInt?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle text-sm">{{ instInt?.laboratoryInstrument?.labName }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm">{{ instInt?.host }}:{{ instInt?.port }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-primary">{{ instInt?.protocolType }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-primary">{{ instInt?.socketType }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-primary">{{ instInt?.autoReconnect }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-primary">{{ instInt?.syncUnits }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-primary">{{ instInt?.driverMapping ? 'Yes' : 'No' }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-primary">{{ instInt?.isActive }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right text-sm">
                <Button variant="outline" size="sm" @click="FormManager(false, instInt)">
                  Edit
                </Button>
                <Button variant="outline" size="sm" class="ml-2" @click="mapDriver(instInt)">
                  Mapper
                </Button>
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!instrumentInterfaces || instrumentInterfaces.length === 0" :colspan="9">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No instrument interfaces found</EmptyTitle>
                    <EmptyDescription>Add an interface to get started.</EmptyDescription>
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
      <form @submit.prevent="saveForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField name="laboratoryInstrumentUid" v-slot="{ componentField }">
            <FormItem class="col-span-1 md:col-span-2">
              <FormLabel>Instrument</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Laboratory Instrument" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="instrument in laboratoryInstruments" :key="instrument?.uid" :value="instrument.uid">
                      {{ instrument?.labName }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="host" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Host</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Host Adress..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="port" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Port</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Port Number..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="protocolType" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Protocol Type</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hl7">HL7</SelectItem>
                    <SelectItem value="astm">ASTM</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="socketType" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Socket Type</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select socket type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="autoReconnect" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" />
              </FormControl>
              <FormLabel>Auto Reconnect</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="isActive" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" />
              </FormControl>
              <FormLabel>Is Active</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </template>
  </Modal>

  <!-- Driver Mapper Modal -->
  <IIMapper 
    v-if="showMapperModal"
    :isOpen="showMapperModal"
    :instrumentInterface="selectedInterfaceForMapping"
    @close="showMapperModal = false; selectedInterfaceForMapping = null"
    @save="onMapperSave"
  />
</template>
