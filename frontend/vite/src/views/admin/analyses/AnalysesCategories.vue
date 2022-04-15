<script setup lang="ts">
  import modal from '../../../components/SimpleModal.vue';
  import { ref, reactive, computed } from 'vue';
  import { IAnalysisCategory } from '../../../models/analysis';
  import { ADD_ANALYSIS_CATEGORY, EDIT_ANALYSIS_CATEGORY  } from '../../../graphql/analyses.mutations';
  import { useSetupStore, useAnalysisStore } from '../../../stores';
  import { useApiUtil } from '../../../composables';

  const analysisStore = useAnalysisStore()
  const  setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  let form = reactive({} as IAnalysisCategory);
  const formAction = ref(true);

  const departments = computed<any[]>(() => setupStore.getDepartments);

  analysisStore.fetchAnalysesCategories();
  const analysesCategories= computed(() => analysisStore.getAnalysesCategories);

  function addAnalysesCategory(): void {
    const payload = { 
      name: form.name, 
      description: form.description, 
      departmentUid: form.departmentUid,
      active: form.active 
    }
    withClientMutation(ADD_ANALYSIS_CATEGORY, { payload }, "createAnalysisCategory")
    .then((result) => analysisStore.addAnalysisCategory(result));
  }

  function editAnalysesCategory(): void {
    const payload = { 
      name: form.name, 
      description: form.description, 
      departmentUid: form.departmentUid,
      active: form.active 
    }
    withClientMutation(EDIT_ANALYSIS_CATEGORY, { uid: form.uid, payload }, "updateAnalysisCategory")
    .then((result) => analysisStore.updateAnalysisCategory(result));
  }

  function FormManager(create: boolean, obj: IAnalysisCategory | null):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES CATEGORY";
    if (create) {
      Object.assign(form, {} as IAnalysisCategory);
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) addAnalysesCategory();
    if (formAction.value === false) editAnalysesCategory();
    showModal.value = false;
  }

</script>

<template>

    <div class="container w-full my-4">
        <hr>
          <button @click="FormManager(true, null)"
           class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add Analyses Category</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Category Name</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Department</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                </tr>
                </thead>
                <tbody class="bg-white">
                <tr v-for="category in analysesCategories"  :key="category?.uid">
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="flex items-center">
                        <div>
                        <div class="text-sm leading-5 text-gray-800">{{ category?.name }}</div>
                        </div>
                    </div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="text-sm leading-5 text-sky-800">{{ category?.department?.name }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                        <button @click="FormManager(false, category)" class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Edit</button>
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
            <span class="text-gray-700">Category Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Department</span>
            <select class="form-select block w-full mt-1" v-model="form.departmentUid">
               <option></option>
              <option v-for="department in departments" :key="department.uid" :value="department?.uid">{{ department.name }}</option>
            </select>
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Description</span>
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
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>