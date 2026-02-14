<script setup lang="ts">
 import { ref, computed } from 'vue';
 import { useField, useForm } from 'vee-validate';
 import * as yup from 'yup';
 import { QCLevelType } from '@/types/gql';
 import { AddQcLevelDocument, AddQcLevelMutation, AddQcLevelMutationVariables,
 EditQcLevelDocument, EditQcLevelMutation, EditQcLevelMutationVariables } from '@/graphql/operations/analyses.mutations';

 import { useAnalysisStore } from '@/stores/analysis';
 import useApiUtil from '@/composables/api_util';

 const analysisStore = useAnalysisStore()
 const { withClientMutation } = useApiUtil()
  let showModal = ref(false);
 let formTitle = ref('');
 const formAction = ref(true);
 const currentUid = ref<string | null>(null);

 const qcLevelSchema = yup.object({
 level: yup.string().trim().required('QC level is required'),
 });

 const { handleSubmit, resetForm, setValues } = useForm({
 validationSchema: qcLevelSchema,
 initialValues: {
 level: '',
 },
 });

 const { value: level, errorMessage: levelError } = useField<string>('level');

 analysisStore.fetchQCLevels();
 const qcLevels = computed(() => analysisStore.getQCLevels)

 function addQCLevel(payload: { level: string }): void {
 withClientMutation<AddQcLevelMutation, AddQcLevelMutationVariables>(AddQcLevelDocument, payload,"createQcLevel")
 .then((result) => analysisStore.addQcLevel(result));
 }

 function editQCLevel(payload: { level: string }): void {
 if (!currentUid.value) return;
 withClientMutation<EditQcLevelMutation, EditQcLevelMutationVariables>(EditQcLevelDocument, { uid: currentUid.value, ...payload },"updateQcLevel")
 .then((result) => analysisStore.updateQcLevel(result));
 }

 function FormManager(create: boolean, obj: QCLevelType = {} as QCLevelType):void {
 formAction.value = create;
 showModal.value = true;
 formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' +"QC Level";
 if (create) {
 currentUid.value = null;
 resetForm({ values: { level: '' } });
 } else {
 currentUid.value = obj.uid ?? null;
 setValues({ level: obj.level ?? '' });
 }
 }

 const saveForm = handleSubmit((values) => {
 const payload = { level: values.level };
 if (formAction.value === true) addQCLevel(payload);
 if (formAction.value === false) editQCLevel(payload);
 showModal.value = false;
 });
</script>

<template>
 <div>
 <beak-heading title="QC Levels">
 <beak-button @click="FormManager(true)">Add QC Level</beak-button>
 </beak-heading>

 <div class="shadow-sm rounded-lg bg-card p-6">
 <div class="overflow-x-auto">
 <table class="min-w-full divide-y divide-border beak-table">
 <thead>
 <tr>
 <th class="text-left text-sm font-semibold text-foreground">Level</th>
 <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
 <span class="sr-only">Actions</span>
 </th>
 </tr>
 </thead>
 <tbody class="divide-y divide-border bg-background">
 <tr v-for="level in qcLevels" :key="level?.uid" class="hover:bg-muted/50">
 <td class="whitespace-nowrap text-sm text-foreground">{{ level?.level }}</td>
 <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
 <button  @click="FormManager(false, level)"  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
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
 <beak-modal v-if="showModal" @close="showModal = false">
 <template v-slot:header>
 <h3 class="text-lg font-semibold leading-none tracking-tight">{{ formTitle }}</h3>
 </template>

 <template v-slot:body>
 <form @submit.prevent="saveForm" class="space-y-4 p-4">
 <div class="space-y-2">
 <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
 QC Level
 </label>
 <input
 v-model="level"
 class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
 placeholder="Enter QC level name..."
 />
 <p v-if="levelError" class="text-sm text-destructive">{{ levelError }}</p>
 </div>

 <button
 type="submit"
 class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
 >
 Save Changes
 </button>
 </form>
 </template>
 </beak-modal>
</template>

<style scoped>
@reference "@tw";
 /* CHECKBOX TOGGLE SWITCH */
 /* @apply rules for documentation, these do not work as inline style */
 .toggle-checkbox:checked {
 @apply: right-0 border-sky-800;
 right: 0;
 border-color: hsl(var(--success));
 }
 .toggle-checkbox:checked + .toggle-label {
 @apply: bg-sky-800;
 background-color: hsl(var(--success));
 }
</style>
