<script setup lang="ts">
import { ref, computed, onMounted } from"vue";
import { useRouter } from"vue-router";
import { LaboratoryCreateInputType, LaboratoryInputType, LaboratoryType, UserType } from"@/types/gql";
import { useUserStore } from"@/stores/user";
import { useSetupStore } from"@/stores/setup";
import useApiUtil from"@/composables/api_util";
import useNotifyToast from"@/composables/alert_toast";
import { AddLaboratoryDocument, AddLaboratoryMutation, AddLaboratoryMutationVariables, EditLaboratoryDocument, EditLaboratoryMutation, EditLaboratoryMutationVariables } from"@/graphql/operations/_mutations";
import { useField, useForm } from"vee-validate";
import { object, string } from"yup";


const { toastSuccess, toastError } = useNotifyToast();
const { withClientQuery, withClientMutation } = useApiUtil();
const router = useRouter();
const userStore = useUserStore();
const setupStore = useSetupStore();

// Lifecycle
onMounted(() => {
 setupStore.fetchOrganization()
 userStore.fetchUsers({});
 setupStore.fetchLaboratories()
});

const users = computed(() => userStore.getUsers);
const laboratories = computed(() => setupStore.getLaboratories);

const getManagerName = (laboratory: LaboratoryType) => {

 if (laboratory.labManagerUid) {
 const users = userStore.getUsers?.filter(u => u.uid == laboratory.labManagerUid)
 if(users?.length > 0) {
 return `${users[0]?.firstName} ${users[0]?.lastName}`;
 }
 }
 return"No Manager Assigned";
};

// Form Management
let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
const formAction = ref(true);
const currentUid = ref<string | null>(null);

const formSchema = object({
 name: string().required("Laboratory name is required"),
 labManagerUid: string().nullable(),
 businessPhone: string().nullable(),
});

const { handleSubmit, errors, resetForm, setValues } = useForm({
 validationSchema: formSchema,
 initialValues: {
 name:"",
 labManagerUid: null,
 businessPhone:"",
 },
});

const { value: name } = useField<string>("name");
const { value: labManagerUid } = useField<string | null>("labManagerUid");
const { value: businessPhone } = useField<string | null>("businessPhone");

function FormManager(create: boolean, obj: any):void {
 formAction.value = create;
 showModal.value = true;
 formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' +"Laboratory";
 if (create) {
 currentUid.value = null;
 resetForm({
 values: {
 name:"",
 labManagerUid: null,
 businessPhone:"",
 },
 });
 } else {
 currentUid.value = obj?.uid ?? null;
 setValues({
 name: obj?.name ??"",
 labManagerUid: obj?.labManagerUid ?? null,
 businessPhone: obj?.businessPhone ??"",
 });
 }
 }

 const saveForm = handleSubmit((values): void => {
 if (formAction.value === true) {
 withClientMutation<AddLaboratoryMutation, AddLaboratoryMutationVariables>(AddLaboratoryDocument, { payload: {
 ...values as LaboratoryCreateInputType,
 organizationUid: setupStore.getOrganization?.uid!,
 } },"createLaboratory")
 .then((result) => setupStore.addLaboratory(result));
 } else {
 if (!currentUid.value) {
 return;
 }
 withClientMutation<EditLaboratoryMutation, EditLaboratoryMutationVariables>(EditLaboratoryDocument, { uid: currentUid.value, payload: values as LaboratoryInputType },"updateLaboratory")
 .then((result) => setupStore.updateLaboratory(result, true));
 };
 showModal.value = false;
 });
</script>

<template>
 <div class="space-y-6">
 <fel-heading title="Laboratories" description="Manage your laboratories and their details.">
 <fel-button @click="FormManager(true, null)">Add Laboratory</fel-button>
 </fel-heading>

 <div class="shadow-sm rounded-lg bg-card p-6">
 <div class="overflow-x-auto">
 <table class="min-w-full divide-y divide-border fel-table">
 <thead>
 <tr>
 <th class="text-left text-sm font-semibold text-foreground">Name</th>
 <th class="text-left text-sm font-semibold text-foreground">Manager</th>
 <th class="text-left text-sm font-semibold text-foreground">Contact Phone</th>
 <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
 <span class="sr-only">Actions</span>
 </th>
 </tr>
 </thead>
 <tbody class="divide-y divide-border bg-background">
 <tr v-for="lab in laboratories" :key="lab?.uid" class="hover:bg-muted/50">
 <td class="whitespace-nowrap text-sm text-foreground">{{ lab?.name }}</td>
 <td class="whitespace-nowrap text-sm text-foreground">{{ getManagerName(lab) }}</td>
 <td class="whitespace-nowrap text-sm text-foreground">{{ lab?.businessPhone }}</td>
 <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
 <button
 @click="FormManager(false, lab)"
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
 <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
 Laboratory Name
 </label>
 <input
 class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
 v-model="name"
 placeholder="Name ..."
 />
 <div class="text-sm text-destructive">{{ errors.name }}</div>
 </div>
 <div class="space-y-2">
 <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
 Lab Manager
 </label>
 <select  v-model="labManagerUid"
 class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
 >
 <option value="">Select Manager</option>
 <option v-for="user in users" :key="user?.uid" :value="user.uid">
 {{ user?.firstName }} {{ user?.lastName }}
 </option>
 </select>
 </div>
 <div class="space-y-2">
 <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
 Business Phone
 </label>
 <input
 class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
 v-model="businessPhone"
 placeholder="Business Phone ..."
 />
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
