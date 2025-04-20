<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  import { ISupplier } from '@/models/setup'
  import { AddSupplierDocument, AddSupplierMutation, AddSupplierMutationVariables,
    EditSupplierDocument, EditSupplierMutation, EditSupplierMutationVariables } from '@/graphql/operations/instrument.mutations';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

  const setupStore = useSetupStore();
  const { withClientMutation } = useApiUtil();
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  let form = reactive({}) as ISupplier;
  const formAction = ref<boolean>(true);

  setupStore.fetchSuppliers();
  const suppliers = computed(() => setupStore.getSuppliers)

  function addSupplier(): void {
    const payload = { name: form.name, description: form.description }
    withClientMutation<AddSupplierMutation, AddSupplierMutationVariables>(AddSupplierDocument, { payload }, "createSupplier")
    .then((result) => setupStore.addSupplier(result));
  }

  function editSupplier(): void {
    const payload = { name: form.name, description: form.description }
    withClientMutation<EditSupplierMutation, EditSupplierMutationVariables>(EditSupplierDocument, { uid: form.uid, payload }, "updateSupplier")
    .then((result) => setupStore.updateSupplier(result));
  }

  function FormManager(create: boolean, obj = {} as ISupplier):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "SUPPLIER";
    if (create) {
      Object.assign(form, {} as ISupplier);
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) addSupplier();
    if (formAction.value === false) editSupplier();
    showModal.value = false;
  }
</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Suppliers">
      <fel-button @click="FormManager(true)"> Add Supplier</fel-button>
    </fel-heading>

    <div class="border border-border bg-background rounded-lg shadow-sm p-6">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:border-b">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Supplier</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
              <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr v-for="supplier in suppliers" :key="supplier?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td class="p-4 align-middle">{{ supplier?.name }}</td>
              <td class="p-4 align-middle text-primary">{{ supplier?.description }}</td>
              <td class="p-4 align-middle text-right">
                <button 
                  @click="FormManager(false, supplier)"
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

  <!-- Supplier Edit Form Modal -->
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
              v-model="form.name"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter supplier name..."
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description
            </label>
            <textarea
              v-model="form.description"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter supplier description..."
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


<style scoped>
  .toggle-checkbox:checked {
    right: 0;
    border-color: #68D391;
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: #68D391;
  }
</style>
