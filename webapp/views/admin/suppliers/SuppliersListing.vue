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

    <div class="container w-full my-4">
        <hr>
          <button @click="FormManager(true)"
           class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Add Supplier</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Supplier</th>
                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Description</th>
                    <th class="px-1 py-1 border-b-2 border-border"></th>
                </tr>
                </thead>
                <tbody class="bg-background">
                <tr v-for="supplier in suppliers" :key="supplier?.uid">
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                    <div class="flex items-center">
                        <div>
                        <div class="text-sm leading-5 text-foreground">{{ supplier?.name }}</div>
                        </div>
                    </div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                    <div class="text-sm leading-5 text-primary">{{ supplier?.description }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
                        <button @click="FormManager(false, supplier)" class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Edit</button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>

  <!-- Location Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-foreground">Description</span>
            <textarea
            cols="2"
              class="form-input mt-1 block w-full"
              v-model="form.description"
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


<style scoped>
  .toggle-checkbox:checked {
    right: 0;
    border-color: #68D391;
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: #68D391;
  }
</style>
