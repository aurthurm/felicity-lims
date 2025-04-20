<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { IAnalysisCategory } from '@/models/analysis';
  import { AddAnalysisCategoryDocument, AddAnalysisCategoryMutation, AddAnalysisCategoryMutationVariables,
    EditAnalysisCategoryDocument, EditAnalysisCategoryMutation, EditAnalysisCategoryMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { useSetupStore } from '@/stores/setup';
  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';

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
  <fel-heading title="Analyses Categories">
    <fel-button @click="FormManager(true, null)">Add Analyses Category</fel-button>
  </fel-heading>

  <div class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
      <table class="min-w-full">
          <thead>
          <tr>
              <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Category Name</th>
              <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Department</th>
              <th class="px-4 py-2 border-b border-border"></th>
          </tr>
          </thead>
          <tbody class="bg-card">
          <tr v-for="category in analysesCategories" :key="category?.uid" class="hover:bg-accent/50">
              <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                <div class="text-sm text-foreground">{{ category?.name }}</div>
              </td>
              <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                <div class="text-sm text-foreground">{{ category?.department?.name }}</div>
              </td>
              <td class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                  <button 
                    @click="FormManager(false, category)" 
                    class="px-2 py-1 mr-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground"
                  >
                    Edit
                  </button>
              </td>
          </tr>
          </tbody>
      </table>
      </div>
  </div>

  <!-- Location Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <label class="col-span-2 space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Category Name</span>
              <input
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.name"
                placeholder="Name ..."
              />
            </label>
            <label class="col-span-1 space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Department</span>
              <select 
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.departmentUid"
              >
                <option value="">Select Department</option>
                <option v-for="department in departments" :key="department.uid" :value="department?.uid">{{ department.name }}</option>
              </select>
            </label>
            <label class="col-span-2 space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Description</span>
              <textarea
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.description"
                placeholder="Description ..."
                rows="3"
              />
            </label>
          </div>
        </div>

        <div class="pt-4">
          <button
            type="button"
            @click.prevent="saveForm()"
            class="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Save Form
          </button>
        </div>
      </form>
    </template>
  </fel-modal>

</template>