<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { UnitType } from '@/types/gql'
  import { AddUnitDocument, AddUnitMutation, AddUnitMutationVariables,
    EditUnitDocument, EditUnitMutation, EditUnitMutationVariables } from '@/graphql/operations/instrument.mutations';
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

  setupStore.fetchUnits();    
  const units = computed(() => setupStore.getUnits);

  let unit = reactive({}) as UnitType;

  function addUnit(): void {
    const payload = { name: unit.name, description: unit.description }
    withClientMutation<AddUnitMutation, AddUnitMutationVariables>(AddUnitDocument, { payload }, "createUnit")
    .then((result) => setupStore.addUnit(result));
  }

  function editUnit(): void {
    const payload = { name: unit.name, description: unit.description }
    withClientMutation<EditUnitMutation, EditUnitMutationVariables>(EditUnitDocument, { uid: unit.uid, payload }, "updateUnit")
    .then((result) => setupStore.updateUnit(result));
  }

  function FormManager(create: boolean, obj = {} as UnitType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "UNIT";
    if (create) {
      Object.assign(unit, { ...({} as UnitType) });
    } else {
      Object.assign(unit, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) addUnit();
    if (formAction.value === false) editUnit();
    showModal.value = false;
  }
  
</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Units">
      <fel-button @click="FormManager(true)"> Add Unit</fel-button>
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
            <tr v-for="unit in units" :key="unit?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td class="px-4 py-2 align-middle">{{ unit?.name }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ unit?.description }}</td>
              <td class="px-4 py-2 align-middle text-right">
                <button 
                  @click="FormManager(false, unit)"
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

  <!-- Unit Edit Form Modal -->
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
              v-model="unit.name"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter unit name..."
            />
          </div>
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="unit.description"
              class="h-4 w-4 rounded border-input bg-background text-primary focus:ring-primary"
            />
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Is SI Unit
            </label>
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

