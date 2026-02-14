<script setup lang="ts">
 import { ref, computed } from 'vue';
 import { useField, useForm } from 'vee-validate';
 import * as yup from 'yup';
 import { IQCTemplateType, IQCLevelType } from '@/types/gql';
 import { AddQcTemplateDocument, AddQcTemplateMutation, AddQcTemplateMutationVariables,
 EditQcTemplateDocument, EditQcTemplateMutation, EditQcTemplateMutationVariables } from '@/graphql/operations/analyses.mutations';
 import { useAnalysisStore } from '@/stores/analysis';
 import useApiUtil from '@/composables/api_util';

 const analysisStore = useAnalysisStore()
 const { withClientMutation } = useApiUtil()
  let showModal = ref(false);
 let formTitle = ref('');
 const formAction = ref(true);
 const currentUid = ref<string | null>(null);

 const qcTemplateSchema = yup.object({
 name: yup.string().trim().required('Template name is required'),
 description: yup.string().trim().nullable(),
 qcLevels: yup.array().nullable(),
 departments: yup.array().nullable(),
 });

 const { handleSubmit, resetForm, setValues } = useForm({
 validationSchema: qcTemplateSchema,
 initialValues: {
 name: '',
 description: '',
 qcLevels: [],
 departments: [],
 },
 });

 const { value: name, errorMessage: nameError } = useField<string>('name');
 const { value: description, errorMessage: descriptionError } = useField<string | null>('description');
 const { value: qcLevelsField, errorMessage: qcLevelsError } = useField<IQCLevelType[]>('qcLevels');
 const { value: departments } = useField<any[]>('departments');

 analysisStore.fetchQCLevels();
 analysisStore.fetchQCTemplates();

 const qcTemplates = computed(() => analysisStore.getQCTemplates)
 const qcLevels = computed(() => analysisStore.getQCLevels)

 function addQCTemplate(payload: { name: string; description: string | null; levels: string[]; departments: any[] }): void {
 withClientMutation<AddQcTemplateMutation, AddQcTemplateMutationVariables>(AddQcTemplateDocument, { payload},"createQcTemplate")
 .then((result) => analysisStore.addQcTemplate(result));
 }

 function editQCTemplate(payload: { name: string; description: string | null; levels: string[]; departments: any[] }): void {
 if (!currentUid.value) return;
 withClientMutation<EditQcTemplateMutation, EditQcTemplateMutationVariables>(EditQcTemplateDocument, { uid: currentUid.value, payload },"updateQcTemplate")
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
 formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' +"QC Template";
 if (create) {
 currentUid.value = null;
 resetForm({
 values: {
 name: '',
 description: '',
 qcLevels: [],
 departments: [],
 },
 });
 } else {
 currentUid.value = obj.uid ?? null;
 setValues({
 name: obj.name ?? '',
 description: obj.description ?? '',
 qcLevels: obj.qcLevels ?? [],
 departments: obj.departments ?? [],
 });
 }
 }

 function levelsNames(levels: IQCLevelType[]): string {
 if (levels?.length <= 0 ) return '';
 let qcLevels: string[] = [];
 levels?.forEach(level => qcLevels.push(level.level!));
 return qcLevels.join(",");
 }

 const saveForm = handleSubmit((values) => {
 const payload = {
 name: values.name,
 description: values.description ?? null,
 levels: levelsUids(values.qcLevels ?? []),
 departments: values.departments ?? [],
 };
 if (formAction.value === true) addQCTemplate(payload);
 if (formAction.value === false) editQCTemplate(payload);
 showModal.value = false;
 });

</script>

<template>
 <div>
 <beak-heading title="QC Templates">
 <beak-button @click="FormManager(true)">Add QC Template</beak-button>
 </beak-heading>

 <div class="shadow-sm rounded-lg bg-card p-6">
 <div class="overflow-x-auto">
 <table class="min-w-full divide-y divide-border beak-table">
 <thead>
 <tr>
 <th class="text-left text-sm font-semibold text-foreground">QC Template Name</th>
 <th class="text-left text-sm font-semibold text-foreground">Quality Control level(s)</th>
 <th class="text-left text-sm font-semibold text-foreground">Department(s)</th>
 <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
 <span class="sr-only">Actions</span>
 </th>
 </tr>
 </thead>
 <tbody class="divide-y divide-border bg-background">
 <tr v-for="templt in qcTemplates" :key="templt?.uid" class="hover:bg-muted/50">
 <td class="whitespace-nowrap text-sm text-foreground">
 <div class="font-medium text-foreground">{{ templt?.name }}</div>
 <div class="text-sm text-muted-foreground" v-if="templt?.description">{{ templt?.description }}</div>
 </td>
 <td class="whitespace-nowrap text-sm text-foreground">{{ levelsNames(templt?.qcLevels ?? []) }}</td>
 <td class="whitespace-nowrap text-sm text-foreground">{{ templt?.category }}</td>
 <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
 <button  @click="FormManager(false, templt)"  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
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
 <beak-modal v-if="showModal" @close="showModal = false">
 <template v-slot:header>
 <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
 </template>

 <template v-slot:body>
 <form @submit.prevent="saveForm" class="p-6 space-y-6">
 <div class="space-y-4">
 <div class="space-y-2">
 <label for="name" class="text-sm font-medium text-muted-foreground">QC Template Name</label>
 <input
 id="name"
 class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
 v-model="name"
 placeholder="Enter template name"
 />
 <p v-if="nameError" class="text-sm text-destructive">{{ nameError }}</p>
 </div>
 <div class="space-y-2">
 <label for="description" class="text-sm font-medium text-muted-foreground">Description</label>
 <textarea
 id="description"
 class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
 v-model="description"
 placeholder="Enter template description"
 rows="3"
 />
 <p v-if="descriptionError" class="text-sm text-destructive">{{ descriptionError }}</p>
 </div>
 <div class="space-y-2">
 <label for="controlLevels" class="text-sm font-medium text-muted-foreground">Quality Control Sample Levels</label>
 <select  name="controlLevels"  id="controlLevels"  v-model="qcLevelsField"
 class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"  multiple
 >
 <option disabled value="">Select QC Levels</option>
 <option  v-for="level in qcLevels"
 :key="level.uid"
 :value="level"
 class="py-1"
 >
 {{ level.level }}
 </option>
 </select>
 <p class="text-xs text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple levels</p>
 <p v-if="qcLevelsError" class="text-sm text-destructive">{{ qcLevelsError }}</p>
 </div>
 </div>

 <div class="pt-4">
 <button
 type="submit"
 class="w-full inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
 >
 Save Changes
 </button>
 </div>
 </form>
 </template>
 </beak-modal>
</template>
