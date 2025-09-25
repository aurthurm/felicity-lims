<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { InstrumentInputType, InstrumentType } from '@/types/gql'
  import { AddInstrumentDocument, AddInstrumentMutation, AddInstrumentMutationVariables,
    EditInstrumentDocument, EditInstrumentMutation, EditInstrumentMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useUserStore } from '@/stores/user';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

  const userStore = useUserStore()
  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()

  // each tab if just gonna be forms with updatable values on button click
  let currentTab = ref('view');
  const tabs = ['view', 'configs',];
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);

  let instrument = reactive({})  as InstrumentType;

  setupStore.fetchInstrumentTypes();    
  const instrumentTypes = computed(() => setupStore.getInstrumentTypes)

  setupStore.fetchInstruments();    
  const instruments = computed(() => setupStore.getInstruments)

  setupStore.fetchManufacturers();    
  const manufacturers = computed(() => setupStore.getManufacturers)

  setupStore.fetchSuppliers();    
  const suppliers = computed(() => setupStore.getSuppliers)

  function addInstrument(): void {
    const payload = { 
      name: instrument.name!, 
      keyword: instrument.keyword!, 
      description: instrument.description,
      instrumentTypeUid: instrument.instrumentTypeUid,
      manufacturerUid: instrument.manufacturerUid,
      supplierUid: instrument.supplierUid,
    }
    withClientMutation<AddInstrumentMutation, AddInstrumentMutationVariables>(AddInstrumentDocument, { payload }, "createInstrument")
    .then((result) => setupStore.addInstrument(result));
  }

  function editInstrument(): void {
    const payload = { 
      name: instrument.name!, 
      keyword: instrument.keyword!, 
      description: instrument.description,
      instrumentTypeUid: instrument.instrumentTypeUid,
      manufacturerUid: instrument.manufacturerUid,
      supplierUid: instrument.supplierUid,
    }
    withClientMutation<EditInstrumentMutation, EditInstrumentMutationVariables>(EditInstrumentDocument, { uid: instrument.uid, payload },"updateInstrument")
    .then((result) => setupStore.updateInstrument(result));
  }

  function FormManager(create: boolean, obj = {} as InstrumentType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES INSTRUMENT";
    if (create) {
      Object.assign(instrument, { ...({} as InstrumentType) });
    } else {
      Object.assign(instrument, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) addInstrument();
    if (formAction.value === false) editInstrument();
    showModal.value = false;
  }
</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Instruments">
      <fel-button @click="FormManager(true)"> Add Instrument</fel-button>
    </fel-heading>

    <div class="border border-border bg-background rounded-lg shadow-sm p-6 overflow-hidden">
      <table class="min-w-full divide-y divide-border">
        <thead>
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Name</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Type</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Manufacturer</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Supplier</th>
            <th class="px-4 py-2 text-right text-sm font-medium text-muted-foreground tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-background divide-y divide-border">
          <tr v-for="inst in instruments" :key="inst?.uid" class="hover:bg-muted/50">
            <td class="px-4 py-2 whitespace-nowrap text-sm text-foreground">{{ inst?.name }}</td>
            <td class="px-4 py-2 whitespace-nowrap text-sm text-foreground">{{ inst?.instrumentType?.name }}</td>
            <td class="px-4 py-2 whitespace-nowrap text-sm text-foreground">{{ inst?.manufacturer?.name }}</td>
            <td class="px-4 py-2 whitespace-nowrap text-sm text-foreground">{{ inst?.supplier?.name }}</td>
            <td class="px-4 py-2 whitespace-nowrap text-sm text-right">
              <button 
                @click="FormManager(false, inst)" 
                class="text-primary hover:text-primary/80 focus:outline-none focus:underline"
                aria-label="Edit instrument"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Instrument Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false"> :title="formTitle">
    <template v-slot:body>
      <form @submit.prevent="saveForm()" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2 md:col-span-2">
            <label for="name" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Instrument Name
            </label>
            <input
              id="name"
              v-model="instrument.name"
              type="text"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter instrument name"
            />
          </div>
          
          <div class="space-y-2">
            <label for="keyword" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Keyword
            </label>
            <input
              id="keyword"
              v-model="instrument.keyword"
              type="text"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter keyword"
            />
          </div>
          
          <div class="space-y-2">
            <label for="instrumentType" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Instrument Type
            </label>
            <select
              id="instrumentType"
              v-model="instrument.instrumentTypeUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select instrument type</option>
              <option 
                v-for="instrumentType in instrumentTypes" 
                :key="instrumentType?.uid" 
                :value="instrumentType.uid"
              >
                {{ instrumentType?.name }}
              </option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label for="manufacturer" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Manufacturer
            </label>
            <select
              id="manufacturer"
              v-model="instrument.manufacturerUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select manufacturer</option>
              <option 
                v-for="manufacturer in manufacturers" 
                :key="manufacturer?.uid" 
                :value="manufacturer.uid"
              >
                {{ manufacturer?.name }}
              </option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label for="supplier" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Supplier
            </label>
            <select
              id="supplier"
              v-model="instrument.supplierUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select supplier</option>
              <option 
                v-for="supplier in suppliers" 
                :key="supplier?.uid" 
                :value="supplier.uid"
              >
                {{ supplier?.name }}
              </option>
            </select>
          </div>
          
          <div class="space-y-2 md:col-span-2">
            <label for="description" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description
            </label>
            <textarea
              id="description"
              v-model="instrument.description"
              rows="3"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter description"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end pt-6">
          <button
            type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {{ formAction ? 'Create' : 'Update' }} Instrument
          </button>
        </div>
      </form>
    </template>
  </fel-modal>
</template>