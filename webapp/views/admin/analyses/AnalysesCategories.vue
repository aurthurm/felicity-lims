<script setup lang="ts">
 import { ref, computed } from 'vue';
 import { useField, useForm } from 'vee-validate';
 import * as yup from 'yup';
 import { AnalysisCategoryType } from '@/types/gql';
 import { AddAnalysisCategoryDocument, AddAnalysisCategoryMutation, AddAnalysisCategoryMutationVariables,
 EditAnalysisCategoryDocument, EditAnalysisCategoryMutation, EditAnalysisCategoryMutationVariables } from '@/graphql/operations/analyses.mutations';
 import { useSetupStore } from '@/stores/setup';
 import { useAnalysisStore } from '@/stores/analysis';
 import useApiUtil from '@/composables/api_util';

 const analysisStore = useAnalysisStore()
 const setupStore = useSetupStore()
 const { withClientMutation } = useApiUtil()
  let showModal = ref(false);
 let formTitle = ref('');
 const formAction = ref(true);
 const currentUid = ref<string | null>(null);

 const categorySchema = yup.object({
 name: yup.string().trim().required('Category name is required'),
 description: yup.string().trim().nullable(),
 departmentUid: yup.string().trim().nullable(),
 active: yup.boolean().default(true),
 });

 const { handleSubmit, resetForm, setValues } = useForm({
 validationSchema: categorySchema,
 initialValues: {
 name: '',
 description: '',
 departmentUid: '',
 active: true,
 },
 });

 const { value: name, errorMessage: nameError } = useField<string>('name');
 const { value: description, errorMessage: descriptionError } = useField<string | null>('description');
 const { value: departmentUid, errorMessage: departmentError } = useField<string | null>('departmentUid');
 const { value: active } = useField<boolean>('active');

 const departments = computed<any[]>(() => setupStore.getDepartments);

 analysisStore.fetchAnalysesCategories();
 const analysesCategories= computed(() => analysisStore.getAnalysesCategories);

 function addAnalysesCategory(payload: { name: string; description: string | null; departmentUid: string | null; active: boolean }): void {
 withClientMutation<AddAnalysisCategoryMutation, AddAnalysisCategoryMutationVariables>(AddAnalysisCategoryDocument, { payload },"createAnalysisCategory")
 .then((result) => analysisStore.addAnalysisCategory(result));
 }

 function editAnalysesCategory(payload: { name: string; description: string | null; departmentUid: string | null; active: boolean }): void {
 if (!currentUid.value) return;
 withClientMutation<EditAnalysisCategoryMutation, EditAnalysisCategoryMutationVariables>(EditAnalysisCategoryDocument, { uid: currentUid.value, payload },"updateAnalysisCategory")
 .then((result) => analysisStore.updateAnalysisCategory(result));
 }

 function FormManager(create: boolean, obj: AnalysisCategoryType | null):void {
 formAction.value = create;
 showModal.value = true;
 formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' +"ANALYSES CATEGORY";
 if (create) {
 currentUid.value = null;
 resetForm({
 values: {
 name: '',
 description: '',
 departmentUid: '',
 active: true,
 },
 });
 } else {
 currentUid.value = obj?.uid ?? null;
 setValues({
 name: obj?.name ?? '',
 description: obj?.description ?? '',
 departmentUid: obj?.departmentUid ?? '',
 active: obj?.active ?? true,
 });
 }
 }

 const saveForm = handleSubmit((values) => {
 const payload = {
 name: values.name,
 description: values.description ?? null,
 departmentUid: values.departmentUid ? values.departmentUid : null,
 active: values.active,
 };
 if (formAction.value === true) addAnalysesCategory(payload);
 if (formAction.value === false) editAnalysesCategory(payload);
 showModal.value = false;
 });

</script>

<template>
 <div class="space-y-6">
 <fel-heading title="Analyses Categories">
 <fel-button @click="FormManager(true, null)">Add Analyses Category</fel-button>
 </fel-heading>

 <div class="shadow-sm rounded-lg bg-card p-6">
 <div class="overflow-x-auto">
 <table class="min-w-full divide-y divide-border fel-table">
 <thead>
 <tr>
 <th class="text-left text-sm font-semibold text-foreground">Category Name</th>
 <th class="text-left text-sm font-semibold text-foreground">Department</th>
 <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
 <span class="sr-only">Actions</span>
 </th>
 </tr>
 </thead>
 <tbody class="divide-y divide-border bg-background">
 <tr v-for="category in analysesCategories" :key="category?.uid" class="hover:bg-muted/50">
 <td class="whitespace-nowrap text-sm text-foreground">{{ category?.name }}</td>
 <td class="whitespace-nowrap text-sm text-foreground">{{ category?.department?.name }}</td>
 <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
 <button
 @click="FormManager(false, category)"
 class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
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

 <!-- Location Edit Form Modal -->
 <fel-modal v-if="showModal" @close="showModal = false">
 <template v-slot:header>
 <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
 </template>

 <template v-slot:body>
 <form @submit.prevent="saveForm" class="p-6 space-y-6">
 <div class="space-y-4">
 <div class="grid grid-cols-2 gap-4">
 <label class="col-span-2 space-y-2">
 <span class="text-sm font-medium text-muted-foreground">Category Name</span>
 <input
 class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
 v-model="name"
 placeholder="Name ..."
 />
 <p v-if="nameError" class="text-sm text-destructive">{{ nameError }}</p>
 </label>
 <label class="col-span-1 space-y-2">
 <span class="text-sm font-medium text-muted-foreground">Department</span>
 <select  class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
 v-model="departmentUid"
 >
 <option value="">Select Department</option>
 <option v-for="department in departments" :key="department.uid" :value="department?.uid">{{ department.name }}</option>
 </select>
 <p v-if="departmentError" class="text-sm text-destructive">{{ departmentError }}</p>
 </label>
 <label class="col-span-2 space-y-2">
 <span class="text-sm font-medium text-muted-foreground">Description</span>
 <textarea
 class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
 v-model="description"
 placeholder="Description ..."
 rows="3"
 />
 <p v-if="descriptionError" class="text-sm text-destructive">{{ descriptionError }}</p>
 </label>
 </div>
 </div>

 <div class="pt-4">
 <button
 type="submit"
 class="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
 >
 Save Form
 </button>
 </div>
 </form>
 </template>
 </fel-modal>

</template>
