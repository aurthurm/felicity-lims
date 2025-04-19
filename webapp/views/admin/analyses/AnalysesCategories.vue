<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { IAnalysisCategory } from '@/models/analysis';
  import { AddAnalysisCategoryDocument, AddAnalysisCategoryMutation, AddAnalysisCategoryMutationVariables,
    EditAnalysisCategoryDocument, EditAnalysisCategoryMutation, EditAnalysisCategoryMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { useSetupStore } from '@/stores/setup';
  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

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
    withClientMutation<AddAnalysisCategoryMutation, AddAnalysisCategoryMutationVariables>(AddAnalysisCategoryDocument, { payload }, "createAnalysisCategory")
    .then((result) => analysisStore.addAnalysisCategory(result));
  }

  function editAnalysesCategory(): void {
    const payload = { 
      name: form.name, 
      description: form.description, 
      departmentUid: form.departmentUid,
      active: form.active 
    }
    withClientMutation<EditAnalysisCategoryMutation, EditAnalysisCategoryMutationVariables>(EditAnalysisCategoryDocument, { uid: form.uid!, payload }, "updateAnalysisCategory")
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
           class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Add Analyses Category</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Category Name</th>
                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Department</th>
                    <th class="px-1 py-1 border-b-2 border-border"></th>
                </tr>
                </thead>
                <tbody class="bg-background">
                <tr v-for="category in analysesCategories"  :key="category?.uid">
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                    <div class="flex items-center">
                        <div>
                        <div class="text-sm leading-5 text-foreground">{{ category?.name }}</div>
                        </div>
                    </div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                    <div class="text-sm leading-5 text-primary">{{ category?.department?.name }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
                        <button @click="FormManager(false, category)" class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Edit</button>
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
            <span class="text-foreground">Category Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Department</span>
            <select class="form-select block w-full mt-1" v-model="form.departmentUid">
               <option></option>
              <option v-for="department in departments" :key="department.uid" :value="department?.uid">{{ department.name }}</option>
            </select>
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