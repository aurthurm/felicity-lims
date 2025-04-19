<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { AddDepartmentDocument, AddDepartmentMutation, AddDepartmentMutationVariables,
    EditDepartmentDocument, EditDepartmentMutation, EditDepartmentMutationVariables } from '@/graphql/operations/_mutations';
  import { IDepartment } from '@/models/setup';

  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';

  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  let form = reactive({}) as IDepartment;
  const formAction = ref(true);

  setupStore.fetchDepartments({})
  const departments = computed(() => setupStore.getDepartments)

  function FormManager(create: boolean, obj: any):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "Department";
    if (create) {
      Object.assign(form, { ...(new Object()) });
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) {
      withClientMutation<AddDepartmentMutation, AddDepartmentMutationVariables>(AddDepartmentDocument, { payload: { name: form.name } }, "createDepartment")
      .then((result) => setupStore.addDepartment(result));
    } else {
      withClientMutation<EditDepartmentMutation, EditDepartmentMutationVariables>(EditDepartmentDocument, { uid: form.uid, payload: { name: form.name }},"updateDepartment")
      .then((result) => setupStore.updateDepartment(result));
    };
    showModal.value = false;
  }

</script>

<template>

    <div class="container w-full my-4">
        <hr>
          <button @click="FormManager(true, null)"
           class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none">Add Department</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">Name</th>
                    <!-- <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">HOD</th> -->
                    <th class="px-1 py-1 border-b-2 border-border"></th>
                </tr>
                </thead>
                <tbody class="bg-white">
                <tr v-for="dept in departments" :key="dept?.uid">
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="flex items-center">
                        <div>
                        <div class="text-sm leading-5 text-gray-800">{{ dept?.name }}</div>
                        </div>
                    </div>
                    </td>
                    <!-- <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="text-sm leading-5 text-primary"></div>
                    </td> -->
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                        <button @click="FormManager(false, dept)" class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none">Edit</button>
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
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Department Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-primary bg-primary text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>