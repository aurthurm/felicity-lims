<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { IQCLevel } from '@/models/analysis';
  import { AddQcLevelDocument, AddQcLevelMutation, AddQcLevelMutationVariables,
    EditQcLevelDocument, EditQcLevelMutation, EditQcLevelMutationVariables } from '@/graphql/operations/analyses.mutations';

  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';

  const analysisStore = useAnalysisStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  let form = reactive({}) as IQCLevel;
  const formAction = ref(true);

  analysisStore.fetchQCLevels();
  const qcLevels = computed(() => analysisStore.getQCLevels)

  function addQCLevel(): void {
    withClientMutation<AddQcLevelMutation, AddQcLevelMutationVariables>(AddQcLevelDocument, { level: form.level }, "createQcLevel")
    .then((result) => analysisStore.addQcLevel(result));
  }

  function editQCLevel(): void {
    withClientMutation<EditQcLevelMutation, EditQcLevelMutationVariables>(EditQcLevelDocument, { uid: form.uid, level: form.level },"updateQcLevel")
    .then((result) => analysisStore.updateQcLevel(result));
  }

  function FormManager(create: boolean, obj: IQCLevel = {}):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "QC Level";
    if (create) {
      Object.assign(form, { ...({} as IQCLevel) });
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) addQCLevel();
    if (formAction.value === false) editQCLevel();
    showModal.value = false;
  }
</script>

<template>
    <div>
      <fel-heading title="QC Levels">
        <fel-button @click="FormManager(true)">Add QC Level</fel-button>
      </fel-heading>

        <div class="rounded-md border bg-card p-6 shadow-sm">
            <div class="w-full">
                <table class="w-full caption-bottom text-sm">
                    <thead>
                        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Level</th>
                            <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="level in qcLevels" 
                            :key="level?.uid"
                            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                            <td class="p-4 align-middle">
                                <span class="text-sm font-medium leading-none">{{ level?.level }}</span>
                            </td>
                            <td class="p-4 align-middle text-right">
                                <button 
                                    @click="FormManager(false, level)" 
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

    <!-- QC Level Edit Form Modal -->
    <fel-modal v-if="showModal" @close="showModal = false">
        <template v-slot:header>
            <h3 class="text-lg font-semibold leading-none tracking-tight">{{ formTitle }}</h3>
        </template>

        <template v-slot:body>
            <form @submit.prevent="saveForm()" class="space-y-4 p-4">
                <div class="space-y-2">
                    <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        QC Level
                    </label>
                    <input
                        v-model="form.level"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter QC level name..."
                    />
                </div>

                <button
                    type="submit"
                    class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    Save Changes
                </button>
            </form>
        </template>
    </fel-modal>
</template>

<style scoped>
  /* CHECKBOX TOGGLE SWITCH */
  /* @apply rules for documentation, these do not work as inline style */
  .toggle-checkbox:checked {
    @apply: right-0 border-sky-800;
    right: 0;
    border-color: #68D391;
  }
  .toggle-checkbox:checked + .toggle-label {
    @apply: bg-sky-800;
    background-color: #68D391;
  }
</style>
