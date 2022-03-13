<template>

    <div class="container w-full my-4">
        <hr>
          <button @click="FormManager(true, null)"
           class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Add Analyses Category</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Category Name</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Department</th>
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
                    <div class="text-sm leading-5 text-blue-900">{{ category?.department?.name }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                        <button @click="FormManager(false, category)" class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">Edit</button>
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
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>


<style scoped>
  /* CHECKBOX TOGGLE SWITCH */
  /* @apply rules for documentation, these do not work as inline style */
  .toggle-checkbox:checked {
    @apply: right-0 border-green-400;
    right: 0;
    border-color: #68D391;
  }
  .toggle-checkbox:checked + .toggle-label {
    @apply: bg-green-400;
    background-color: #68D391;
  }
</style>

<script setup lang="ts">
  import modal from '../../../components/SimpleModal.vue';

  import { useMutation } from '@urql/vue';
  import { ref, reactive, computed } from 'vue';
  import { useStore } from 'vuex';
  import { ActionTypes,  } from '../../../store/modules/analysis';
  import { IAnalysisCategory } from '../../../models/analysis';
  import { ADD_ANALYSIS_CATEGORY, EDIT_ANALYSIS_CATEGORY  } from '../../../graphql/analyses.mutations';

  const store = useStore();
  
  let showModal = ref(false);
  let formTitle = ref('');
  let form = reactive({} as IAnalysisCategory);
  const formAction = ref(true);

  const departments = computed<any[]>(() => store.getters.getDepartments);

  store.dispatch(ActionTypes.FETCH_ANALYSES_CATEGORIES);
  const analysesCategories= computed(() =>store.getters.getAnalysesCategories);
  const { executeMutation: createAnalysisCategory } = useMutation(ADD_ANALYSIS_CATEGORY);
  const { executeMutation: updateAnalysisCategory } = useMutation(EDIT_ANALYSIS_CATEGORY);

  function addAnalysesCategory(): void {
    const payload = { 
      name: form.name, 
      description: form.description, 
      departmentUid: form.departmentUid,
      active: form.active 
    }
    createAnalysisCategory({ payload }).then((result) => {
      store.dispatch(ActionTypes.ADD_ANALYSES_CATEGORY, result);
    });
  }

  function editAnalysesCategory(): void {
    const payload = { 
      name: form.name, 
      description: form.description, 
      departmentUid: form.departmentUid,
      active: form.active 
    }
    updateAnalysisCategory({ uid: form.uid, payload }).then((result) => {
      store.dispatch(ActionTypes.UPDATE_ANALYSES_CATEGORY, result);
    });
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