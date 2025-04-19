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
  <div class="">
    <div class="container w-full my-4">
      <hr>
      <button
        class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
        @click="FormManager(true)"
      > Add Instrument Type</button>
      <hr>
    </div>

    <div class="overflow-x-auto mt-4  overflow-y-scroll overscroll-contain max-h-[740px]">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Name</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Description</th>
                <th class="px-1 py-1 border-b-2 border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-background">
            <tr v-for="instype in instrumentTypes" :key="instype?.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                  <div class="text-sm leading-5 text-foreground">{{ instype?.name }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-border"></td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
                    <button @click="FormManager(false, instype)" class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- instType Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-foreground">Instrument Type</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="instrumentType.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-foreground">Description</span>
            <textarea
            cols="2"
              class="form-input mt-1 block w-full"
              v-model="instrumentType.description"
              placeholder="Description ..."
            />
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>