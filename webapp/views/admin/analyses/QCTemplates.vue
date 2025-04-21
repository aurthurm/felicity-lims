<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { IQCTemplateType, IQCLevelType } from '@/types/gql';
  import { AddQcTemplateDocument, AddQcTemplateMutation, AddQcTemplateMutationVariables,
    EditQcTemplateDocument, EditQcTemplateMutation, EditQcTemplateMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';

  const analysisStore = useAnalysisStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  let form = reactive({}) as IQCTemplateType;
  const formAction = ref(true);

  analysisStore.fetchQCLevels();
  analysisStore.fetchQCTemplates();

  const qcTemplates = computed(() => analysisStore.getQCTemplates)
  const qcLevels = computed(() => analysisStore.getQCLevels)

  function addQCTemplate(): void {
    const payload = { name: form.name, description: form.description, levels: levelsUids(form.qcLevels!), departments: form.departments }
    withClientMutation<AddQcTemplateMutation, AddQcTemplateMutationVariables>(AddQcTemplateDocument, { payload}, "createQcTemplate")
    .then((result) => analysisStore.addQcTemplate(result));
  }

  function editQCTemplate(): void {
    const payload = { name: form.name, description: form.description, levels: levelsUids(form.qcLevels!), departments: form.departments }
    withClientMutation<EditQcTemplateMutation, EditQcTemplateMutationVariables>(EditQcTemplateDocument, { uid: form.uid, payload }, "updateQcTemplate")
    .then((result) => analysisStore.updateQcTemplate(result));
  }

  function levelsUids(levels: IQCLevelType[]): string[] {
    if (levels?.length <= 0 ) return [];
    let qcLevels: string[] = [];
    levels?.forEach(level => qcLevels.push(level.uid!));
    return qcLevels;
  }

  function FormManager(create: boolean, obj = {} as IQCTemplateType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "QC Template";
    if (create) {
      Object.assign(form, { ...({} as IQCTemplateType) });
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function levelsNames(levels: IQCLevelType[]): string {
    if (levels?.length <= 0 ) return '';
    let qcLevels: string[] = [];
    levels?.forEach(level => qcLevels.push(level.level!));
    return qcLevels.join(", ");
  }

  function saveForm(): void {
    if (formAction.value === true) addQCTemplate();
    if (formAction.value === false) editQCTemplate();
    showModal.value = false;
  }

</script>

<template>
    <div>
      <fel-heading title="QC Templates">
        <fel-button @click="FormManager(true)">Add QC Template</fel-button>
      </fel-heading>

        <div class="rounded-md border bg-card p-6 shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                    <tr class="border-b border-border bg-muted/50">
                        <th class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">QC Template Name</th>
                        <th class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Quality Control level(s)</th>
                        <th class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Department(s)</th>
                        <th class="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="templt in qcTemplates" :key="templt?.uid" class="hover:bg-accent/50 transition-colors duration-200">
                        <td class="px-6 py-4 whitespace-nowrap border-b border-border">
                          <div class="font-medium text-foreground">{{ templt?.name }}</div>
                          <div class="text-sm text-muted-foreground" v-if="templt?.description">{{ templt?.description }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap border-b border-border">
                          <div class="text-sm text-foreground">{{ levelsNames(templt?.qcLevels ?? []) }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap border-b border-border">
                          <div class="text-sm text-foreground">{{ templt?.category }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right border-b border-border">
                            <button 
                              @click="FormManager(false, templt)" 
                              class="inline-flex items-center px-3 py-1.5 border border-border bg-background text-foreground text-sm font-medium transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground"
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

    <!-- QC Template Form Modal -->
    <fel-modal v-if="showModal" @close="showModal = false">
        <template v-slot:header>
          <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
        </template>

        <template v-slot:body>
          <form action="post" class="p-6 space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <label for="name" class="text-sm font-medium text-muted-foreground">QC Template Name</label>
                <input
                  id="name"
                  class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  v-model="form.name"
                  placeholder="Enter template name"
                />
              </div>
              <div class="space-y-2">
                <label for="description" class="text-sm font-medium text-muted-foreground">Description</label>
                <textarea
                  id="description"
                  class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
                  v-model="form.description"
                  placeholder="Enter template description"
                  rows="3"
                />
              </div>
              <div class="space-y-2">
                <label for="controlLevels" class="text-sm font-medium text-muted-foreground">Quality Control Sample Levels</label>
                <select 
                  name="controlLevels" 
                  id="controlLevels" 
                  v-model="form.qcLevels"
                  class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" 
                  multiple
                >
                  <option disabled value="">Select QC Levels</option>
                  <option  
                    v-for="level in qcLevels"
                    :key="level.uid"
                    :value="level"
                    class="py-1"
                  >
                    {{ level.level }}
                  </option>
                </select>
                <p class="text-xs text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple levels</p>
              </div>
            </div>

            <div class="pt-4">
              <button
                type="button"
                @click.prevent="saveForm()"
                class="w-full inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </form>
        </template>
    </fel-modal>
</template>
