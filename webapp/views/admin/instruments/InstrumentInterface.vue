<script setup lang="ts">
  import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
  import { InstrumentInterfaceType, LaboratoryInstrumentType } from '@/types/gql'
  import { AddInstrumentInterfaceDocument, EditInstrumentInterfaceDocument, EditInstrumentInterfaceMutation, EditInstrumentInterfaceMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  import { useField, useForm } from "vee-validate";
  import { boolean, object, string } from "yup";
import { GetInstrumentInterfacesDocument } from '@/graphql/operations/instrument.queries';
import { AddInstrumentInterfaceMutation, AddInstrumentInterfaceMutationVariables, GetInstrumentInterfacesQuery, GetInstrumentInterfacesQueryVariables } from '@/types/gqlops';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/BeakModal.vue')
  )
  
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

  const { handleSubmit, errors, resetForm, setValues } = useForm({
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

  const { value: laboratoryInstrumentUid } = useField<string>("laboratoryInstrumentUid");
  const { value: host } = useField<string | null>("host");
  const { value: port } = useField<string | null>("port");
  const { value: protocolType } = useField<string | null>("protocolType");
  const { value: socketType } = useField<string | null>("socketType");
  const { value: autoReconnect } = useField<boolean | null>("autoReconnect");
  const { value: isActive } = useField<boolean | null>("isActive");

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
    <beak-heading title="Instrument Interfaces">
      <beak-button @click="FormManager(true)">Add Instrument Interface</beak-button>
    </beak-heading>

    <div class="border border-border bg-background rounded-lg shadow-sm p-6 overflow-hidden">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm beak-table">
          <thead class="[&_tr]:border-b">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Laboratory Instrument</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">TCPIP</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Protocol</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Socket Type</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Auto Reconnect</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Sync Units</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Mapped</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Active</th>
              <th class="px-4 py-2 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr v-for="instInt in instrumentInterfaces" :key="instInt?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td class="px-4 py-2 align-middle">{{ instInt?.laboratoryInstrument?.labName }}</td>
              <td class="px-4 py-2 align-middle">{{ instInt?.host }}:{{ instInt?.port }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ instInt?.protocolType }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ instInt?.socketType }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ instInt?.autoReconnect }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ instInt?.syncUnits }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ instInt?.driverMapping ? 'Yes' : 'No' }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ instInt?.isActive }}</td>
              <td class="px-4 py-2 align-middle text-right">
                <button 
                  @click="FormManager(false, instInt)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                >
                  Edit
                </button>
                <button 
                  @click="mapDriver(instInt)"
                  class="ml-2 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                >
                  Mapper
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Laboratory Instrument Form Modal -->
  <beak-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2 col-span-1 md:col-span-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Instrument
            </label>
            <select 
              v-model="laboratoryInstrumentUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Laboratory Instrument</option>
              <option v-for="instrument in laboratoryInstruments" :key="instrument?.uid" :value="instrument.uid">
                {{ instrument?.labName }}
              </option>
            </select>
            <div class="text-sm text-destructive">{{ errors.laboratoryInstrumentUid }}</div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Host
            </label>
            <input
              v-model="host"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Host Adress..."
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Port
            </label>
            <input
              v-model="port"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Port Number..."
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Protocol Type
            </label>
            <select
              id="instrumentType"
              v-model="protocolType"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="hl7">HL7</option>
              <option value="astm">ASTM</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Socket Type
            </label>
            <select
              id="instrumentType"
              v-model="socketType"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="server">Server</option>
              <option value="client">Client</option>
            </select>
          </div>

          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="autoReconnect"
              v-model="autoReconnect"
              class="h-4 w-4 rounded border-input bg-background text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label for="autoReconnect" class="text-sm font-medium text-muted-foreground">Auto Reconnect</label>
          </div>

          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="isActive"
              v-model="isActive"
              class="h-4 w-4 rounded border-input bg-background text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label for="isActive" class="text-sm font-medium text-muted-foreground">Is Active</label>
          </div>

        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </template>
  </beak-modal>

  <!-- Driver Mapper Modal -->
  <IIMapper 
    v-if="showMapperModal"
    :isOpen="showMapperModal"
    :instrumentInterface="selectedInterfaceForMapping"
    @close="showMapperModal = false; selectedInterfaceForMapping = null"
    @save="onMapperSave"
  />
</template>
