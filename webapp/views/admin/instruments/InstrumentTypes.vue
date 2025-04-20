<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent, onMounted } from 'vue';
  import { IInstrumentType } from '@/models/setup'
  import { AddInstrumentTypeDocument, AddInstrumentTypeMutation, AddInstrumentTypeMutationVariables,
    EditInstrumentTypeDocument, EditInstrumentTypeMutation, EditInstrumentTypeMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);

  onMounted(() => {
    setupStore.fetchInstrumentTypes(); 
  })
   
  const instrumentTypes = computed(() => setupStore.getInstrumentTypes);
  let instrumentType = reactive({}) as IInstrumentType;

  function addInstrumentType(): void {
    const payload = { name: instrumentType.name, description: instrumentType.description }
    withClientMutation<AddInstrumentTypeMutation, AddInstrumentTypeMutationVariables>(AddInstrumentTypeDocument, { payload }, "createInstrumentType")
    .then((result) => setupStore.addInstrumentType(result));
  }

  function editInstrumentType(): void {
    const payload = { name: instrumentType.name, description: instrumentType.description }
    withClientMutation<EditInstrumentTypeMutation, EditInstrumentTypeMutationVariables>(EditInstrumentTypeDocument, { uid: instrumentType.uid, payload }, "updateInstrumentType")
    .then((result) => setupStore.updateInstrumentType(result));
  }

  function selectInstrumentType(obj: IInstrumentType): void {
    Object.assign(instrumentType, { ...obj})
  }
  
  function resetInstrumentType(): void {
    Object.assign(instrumentType, { ...({} as IInstrumentType)})
  }

  function FormManager(create: boolean, obj = {} as IInstrumentType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "INSTRUMENT TYPE";
    if (create) {
      Object.assign(instrumentType, { ...({} as IInstrumentType) });
    } else {
      Object.assign(instrumentType, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) addInstrumentType();
    if (formAction.value === false) editInstrumentType();
    showModal.value = false;
  }
  
</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Instrument Types">
      <fel-button @click="FormManager(true)"> Add Instrument Type</fel-button>
    </fel-heading>

    <div class="border border-border bg-background rounded-lg shadow-sm p-6 overflow-hidden">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:border-b">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Name</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Description</th>
              <th class="px-4 py-2 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr v-for="instype in instrumentTypes" :key="instype?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td class="px-4 py-2 align-middle">{{ instype?.name }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ instype?.description }}</td>
              <td class="px-4 py-2 align-middle text-right">
                <button 
                  @click="FormManager(false, instype)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Instrument Type Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-4">
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Name
            </label>
            <input
              v-model="instrumentType.name"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter instrument type name..."
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description
            </label>
            <textarea
              v-model="instrumentType.description"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter description..."
            />
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
  </fel-modal>
</template>