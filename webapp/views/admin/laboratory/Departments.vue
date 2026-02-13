<script setup lang="ts">
 import { ref, computed, defineAsyncComponent } from 'vue';
 import { useField, useForm } from"vee-validate";
 import { object, string } from"yup";
 import { AddDepartmentDocument, AddDepartmentMutation, AddDepartmentMutationVariables,
 EditDepartmentDocument, EditDepartmentMutation, EditDepartmentMutationVariables } from '@/graphql/operations/_mutations';
 import { DepartmentType } from '@/types/gql';

 import { useSetupStore } from '@/stores/setup';
 import useApiUtil from '@/composables/api_util';

 const setupStore = useSetupStore()
 const { withClientMutation } = useApiUtil()
  let showModal = ref<boolean>(false);
 let formTitle = ref<string>('');
 const formAction = ref(true);
 const currentUid = ref<string | null>(null);

 const formSchema = object({
 name: string().required("Department name is required"),
 });

 const { handleSubmit, errors, resetForm, setValues } = useForm({
 validationSchema: formSchema,
 initialValues: {
 name:"",
 },
 });

 const { value: name } = useField<string>("name");

 setupStore.fetchDepartments({})
 const departments = computed(() => setupStore.getDepartments)

 function FormManager(create: boolean, obj: any):void {
 formAction.value = create;
 showModal.value = true;
 formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' +"Department";
 if (create) {
 currentUid.value = null;
 resetForm({ values: { name:"" } });
 } else {
 currentUid.value = obj?.uid ?? null;
 setValues({ name: obj?.name ??"" });
 }
 }

 const saveForm = handleSubmit((values): void => {
 if (formAction.value === true) {
 withClientMutation<AddDepartmentMutation, AddDepartmentMutationVariables>(AddDepartmentDocument, { payload: { name: values.name } },"createDepartment")
 .then((result) => setupStore.addDepartment(result));
 } else {
 if (!currentUid.value) {
 return;
 }
 withClientMutation<EditDepartmentMutation, EditDepartmentMutationVariables>(EditDepartmentDocument, { uid: currentUid.value, payload: { name: values.name }},"updateDepartment")
 .then((result) => setupStore.updateDepartment(result));
 };
 showModal.value = false;
 });

</script>

<template>
 <div class="space-y-6">
 <fel-heading title="Departments">
 <fel-button @click="FormManager(true, null)">Add Department</fel-button>
 </fel-heading>

 <div class="shadow-sm rounded-lg bg-card p-6">
 <div class="overflow-x-auto">
 <table class="min-w-full divide-y divide-border fel-table">
 <thead>
 <tr>
 <th class="text-left text-sm font-semibold text-foreground">Name</th>
 <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
 <span class="sr-only">Actions</span>
 </th>
 </tr>
 </thead>
 <tbody class="divide-y divide-border bg-background">
 <tr v-for="dept in departments" :key="dept?.uid" class="hover:bg-muted/50">
 <td class="whitespace-nowrap text-sm text-foreground">{{ dept?.name }}</td>
 <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
 <button
 @click="FormManager(false, dept)"
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
 <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
 </template>

 <template v-slot:body>
 <form class="space-y-6" @submit.prevent="saveForm">
 <div class="space-y-2">
 <label class="fel-label">
 Department Name
 </label>
 <input
 class="fel-input"
 v-model="name"
 placeholder="Name ..."
 />
 <div class="text-sm text-destructive">{{ errors.name }}</div>
 </div>
 <hr class="border-border" />
 <button
 type="submit"
 class="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
 >
 Save Form
 </button>
 </form>
 </template>
 </fel-modal>
</template>
