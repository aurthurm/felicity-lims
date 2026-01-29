<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Users</h1>
      <button
        @click="FormManager(true)"
        class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-label="Add new user"
      >
        Add User
      </button>
    </div>

    <div class="bg-card rounded-lg shadow-sm">
      <table class="min-w-full divide-y divide-border fel-table">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header"
              class="px-6 py-3 text-left text-sm font-medium text-muted-foreground tracking-wider"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-background divide-y divide-border">
          <tr v-for="user in users" :key="user.uid" class="hover:bg-muted/50">
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ user.firstName }} {{ user.lastName }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  user.isActive ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                ]"
              >
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ user.groups?.map(g => g?.name).join(', ') }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ user.userName }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  user.isBlocked ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'
                ]"
              >
                {{ user.isBlocked ? 'Blocked' : 'Active' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ getLaboratoryName(user.activeLaboratoryUid || "") }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ user.laboratories?.length }} Labs</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
              <button
                @click="FormManager(false, user)"
                class="text-primary hover:text-primary/80 focus:outline-none focus:underline"
                aria-label="Edit user"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <fel-modal v-if="showUserModal" @close="showUserModal = false" :title="userUid ? 'Edit User' : 'Add User'">
    <template v-slot:body>
      <form @submit.prevent="saveUserForm" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- OPTION 1: Enhanced visibility with explicit colors -->
          <div class="space-y-2">
            <label for="firstName" class="block text-sm font-medium text-foreground">
              First Name
            </label>
            <input
              id="firstName"
              v-model="firstName"
              type="text"
              class="mt-1 block w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring hover:border-muted-foreground/40"
              placeholder="Enter first name"
            />
            <p v-if="firstNameError" class="text-sm text-destructive">{{ firstNameError }}</p>
          </div>

          <div class="space-y-2">
            <label for="lastName" class="block text-sm font-medium text-foreground">
              Last Name
            </label>
            <input
              id="lastName"
              v-model="lastName"
              type="text"
              class="mt-1 block w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring hover:border-muted-foreground/40"
              placeholder="Enter last name"
            />
            <p v-if="lastNameError" class="text-sm text-destructive">{{ lastNameError }}</p>
          </div>

          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="mt-1 block w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring hover:border-muted-foreground/40"
              placeholder="Enter email address"
            />
            <p v-if="emailError" class="text-sm text-destructive">{{ emailError }}</p>
          </div>

          <div class="space-y-2">
            <label for="userName" class="block text-sm font-medium text-foreground">
              Username
            </label>
            <!-- <input
              id="userName"
              v-model="form.userName"
              type="text"
              :disabled="form.userUid != ''"
              class="mt-1 block w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring hover:border-muted-foreground/40 disabled:bg-muted disabled:border-border disabled:cursor-not-allowed disabled:text-muted-foreground"
              placeholder="Enter username"
            /> -->
            <FelProtectedInput
              id="userName"
              v-model="userName"
              type="text"
              :required-clicks="5"
              placeholder="Enter username"
            />
            <p v-if="userNameError" class="text-sm text-destructive">{{ userNameError }}</p>
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="mt-1 block w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring hover:border-muted-foreground/40"
              placeholder="Enter password"
            />
            <p v-if="passwordError" class="text-sm text-destructive">{{ passwordError }}</p>
          </div>

          <div class="space-y-2">
            <label for="passwordc" class="block text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <input
              id="passwordc"
              v-model="passwordc"
              type="password"
              class="mt-1 block w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring hover:border-muted-foreground/40"
              placeholder="Confirm password"
            />
            <p v-if="passwordcError" class="text-sm text-destructive">{{ passwordcError }}</p>
          </div>

          <div class="col-span-2 space-y-2">
            <label for="groupUid" class="block text-sm font-medium text-foreground">
              Group
            </label>
            <select
              id="groupUid"
              v-model="groupUid"
              class="mt-1 block w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm text-foreground transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring hover:border-muted-foreground/40"
            >
              <option value="" class="text-muted-foreground">Select a group</option>
              <option
                v-for="group in groups"
                :key="group.uid"
                :value="group.uid"
                class="text-foreground"
              >
                {{ group?.name }}
              </option>
            </select>
            <p v-if="groupUidError" class="text-sm text-destructive">{{ groupUidError }}</p>
          </div>

          <!-- Laboratory Assignment Section -->
          <div class="col-span-2 space-y-4 border-t border-border pt-6">
            <h4 class="text-md font-medium text-foreground">Laboratory Access (Optional)</h4>
            
            <!-- Laboratory Multi-Select -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-foreground">Assigned Laboratories</label>
              <div class="border-2 border-input rounded-md p-3 space-y-2 max-h-32 overflow-y-auto">
                <div v-for="lab in setupStore.getLaboratories" :key="lab.uid" class="flex items-center space-x-3">
                  <input
                    :id="`lab-${lab.uid}`"
                    v-model="laboratoryUids"
                    :value="lab.uid"
                    type="checkbox"
                    class="h-4 w-4 text-primary focus:ring-ring border-input rounded"
                  />
                  <label :for="`lab-${lab.uid}`" class="flex-1 cursor-pointer text-sm">
                    {{ lab.name }} ({{ lab.code }})
                  </label>
                </div>
              </div>
            </div>

            <!-- Active Laboratory Selection -->
            <div v-if="laboratoryUids && laboratoryUids.length > 0" class="space-y-2">
              <label class="block text-sm font-medium text-foreground">Default Active Laboratory</label>
              <select
                v-model="activeLaboratoryUid"
                class="mt-1 block w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm text-foreground transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring hover:border-muted-foreground/40"
              >
                <option value="">Select default laboratory...</option>
                <option
                  v-for="labUid in laboratoryUids"
                  :key="labUid"
                  :value="labUid"
                  class="text-foreground"
                >
                  {{ getLaboratoryName(labUid) }}
                </option>
              </select>
              <p v-if="activeLaboratoryUidError" class="text-sm text-destructive">{{ activeLaboratoryUidError }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <span class="text-sm font-medium text-foreground">Blocked</span>
              <button
                type="button"
                role="switch"
                :aria-checked="isBlocked"
                @click="isBlocked = !isBlocked"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm"
                :class="[isBlocked ? 'bg-destructive' : 'bg-success']"
              >
                <span
                  aria-hidden="true"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out"
                  :class="[isBlocked ? 'translate-x-5' : 'translate-x-0']"
                />
              </button>
            </label>
          </div>

          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <span class="text-sm font-medium text-foreground">Active</span>
              <button
                type="button"
                role="switch"
                :aria-checked="isActive"
                @click="isActive = !isActive"
                class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm"
                :class="[isActive ? 'bg-success' : 'bg-destructive']"
              >
                <span
                  aria-hidden="true"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out"
                  :class="[isActive ? 'translate-x-5' : 'translate-x-0']"
                />
             </button>
            </label>
          </div>
        </div>

        <div class="flex justify-end pt-6">
          <button
            type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors duration-200"
          >
            {{ userUid ? 'Update' : 'Create' }} User
          </button>
        </div>
      </form>
    </template>
  </fel-modal>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted } from "vue";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import {
    AddUserDocument, AddUserMutation, AddUserMutationVariables,
    EditUserDocument, EditUserMutation, EditUserMutationVariables
} from "@/graphql/operations/_mutations";
import { UserType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import { useSetupStore } from "@/stores/setup";
import useApiUtil  from "@/composables/api_util";
import FelProtectedInput from "@/components/ui/form/FelProtectedInput.vue";

const userStore = useUserStore();
const setupStore = useSetupStore();
onMounted(() => {
  userStore.fetchUsers({});
  userStore.fetchGroupsAndPermissions();
  setupStore.fetchLaboratories();
})

let users = computed<UserType[]>(() => userStore.getUsers);
const groups = computed(() => userStore.getGroups);
let showUserModal = ref<boolean>(false);
let formTitle = ref<string>("");

const formAction = ref<boolean>(true);
const userSchema = yup.object({
  userUid: yup.string().nullable(),
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  email: yup.string().trim().email("Enter a valid email").required("Email is required"),
  groupUid: yup.string().trim().required("Group is required"),
  userName: yup.string().trim().required("Username is required"),
  password: yup.string().when("userUid", {
    is: (value: string | null | undefined) => !value,
    then: schema => schema.required("Password is required"),
    otherwise: schema => schema.nullable(),
  }),
  passwordc: yup.string().when("password", {
    is: (value: string | null | undefined) => !!value,
    then: schema => schema.oneOf([yup.ref("password")], "Passwords must match").required("Confirm your password"),
    otherwise: schema => schema.nullable(),
  }),
  isActive: yup.boolean().default(true),
  isBlocked: yup.boolean().default(false),
  laboratoryUids: yup.array().of(yup.string()).default([]),
  activeLaboratoryUid: yup.string().trim().nullable(),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: userSchema,
  initialValues: {
    userUid: "",
    firstName: "",
    lastName: "",
    email: "",
    groupUid: "",
    userName: "",
    password: "",
    passwordc: "",
    isActive: true,
    isBlocked: false,
    laboratoryUids: [] as string[],
    activeLaboratoryUid: "",
  },
});

const { value: userUid } = useField<string | null>("userUid");
const { value: firstName, errorMessage: firstNameError } = useField<string>("firstName");
const { value: lastName, errorMessage: lastNameError } = useField<string>("lastName");
const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: groupUid, errorMessage: groupUidError } = useField<string>("groupUid");
const { value: userName, errorMessage: userNameError } = useField<string>("userName");
const { value: password, errorMessage: passwordError } = useField<string>("password");
const { value: passwordc, errorMessage: passwordcError } = useField<string>("passwordc");
const { value: isActive } = useField<boolean>("isActive");
const { value: isBlocked } = useField<boolean>("isBlocked");
const { value: laboratoryUids } = useField<string[]>("laboratoryUids");
const { value: activeLaboratoryUid, errorMessage: activeLaboratoryUidError } = useField<string | null>("activeLaboratoryUid");

const { withClientMutation } = useApiUtil();
function addUser(payload: AddUserMutationVariables): void {
  withClientMutation<AddUserMutation, AddUserMutationVariables>(AddUserDocument, payload, "createUser").then((result) =>
    userStore.addUser(result)
  );
}

function editUser(payload: EditUserMutationVariables): void {
  withClientMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument, payload, "updateUser").then((result) =>
    userStore.updateUser(result)
  );
}

function userGroupsName(user: UserType): string {
  let groups: string[] = [];
  user?.groups?.forEach((g) => groups.push(g?.name!));
  return groups.join(", ");
}

const getLaboratoryName = (labUid: string) => {
  const lab = setupStore.getLaboratories.find(l => l.uid === labUid);
  if(!lab) {
    return "-- Not Assigned --"
  }
  return lab?.name || "Unknown Laboratory";
};

function FormManager(create: boolean, obj: UserType = {} as UserType): void {
  formAction.value = create;
  showUserModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "USER";
  if (create) {
    resetForm({
      values: {
        userUid: "",
        firstName: "",
        lastName: "",
        email: "",
        groupUid: "",
        userName: "",
        password: "",
        passwordc: "",
        isActive: true,
        isBlocked: false,
        laboratoryUids: [],
        activeLaboratoryUid: "",
      },
    });
  } else {
    setValues({
      userUid: obj?.uid || "",
      firstName: obj?.firstName ?? "",
      lastName: obj?.lastName ?? "",
      email: obj?.email ?? "",
      groupUid: obj?.groups && obj.groups[0] ? obj.groups[0].uid : "",
      userName: obj?.userName ?? "",
      password: "",
      passwordc: "",
      isActive: obj?.isActive ?? true,
      isBlocked: obj?.isBlocked ?? false,
      laboratoryUids: (obj?.laboratories as string[]) || [],
      activeLaboratoryUid: obj?.activeLaboratoryUid || "",
    });
  }
}

const saveUserForm = handleSubmit((values) => {
  const basePayload = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    groupUid: values.groupUid,
    activeLaboratoryUid: values.activeLaboratoryUid || null,
    laboratoryUids: values.laboratoryUids || [],
    userName: values.userName,
  };

  if (formAction.value) {
    addUser({
      ...basePayload,
      password: values.password || "",
      passwordc: values.passwordc || "",
    });
  } else {
    if (!values.userUid) return;
    editUser({
      userUid: values.userUid,
      ...basePayload,
      isActive: values.isActive,
      isBlocked: values.isBlocked,
      password: values.password || undefined,
      passwordc: values.passwordc || undefined,
    });
  }
  showUserModal.value = false;
});

const headers = [
  "Full Name",
  "Email",
  "Active",
  "Group",
  "Username",
  "Blocked",
  "Active Laboratory",
  "Assigned Labs",
  "Actions"
];
</script>

<style scoped>
@reference "@/assets/css/style.css";

/* Alternative: CSS custom properties approach for better field visibility */
.form-field-enhanced {
  @apply mt-1 block w-full rounded-md px-3 py-2 text-sm transition-all duration-200;
  border: 2px solid hsl(var(--border));
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

.form-field-enhanced::placeholder {
  color: hsl(var(--muted-foreground));
}

.form-field-enhanced:hover {
  border-color: hsl(var(--muted-foreground));
}

.form-field-enhanced:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
}

.form-field-enhanced:disabled {
  background-color: hsl(var(--muted));
  border-color: hsl(var(--border));
  cursor: not-allowed;
  color: hsl(var(--muted-foreground));
}

/* Enhanced switch styling */
.switch-enhanced {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
