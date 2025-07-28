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
      <table class="min-w-full divide-y divide-border">
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
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ user.firstName }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">{{ user.lastName }}</td>
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

  <fel-modal v-if="showUserModal" @close="showUserModal = false" :title="form.userUid ? 'Edit User' : 'Add User'">
    <template v-slot:body>
      <form @submit.prevent="saveUserForm()" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <!-- OPTION 1: Enhanced visibility with explicit colors -->
          <div class="space-y-2">
            <label for="firstName" class="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              class="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-400"
              placeholder="Enter first name"
            />
          </div>

          <div class="space-y-2">
            <label for="lastName" class="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              class="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-400"
              placeholder="Enter last name"
            />
          </div>

          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-400"
              placeholder="Enter email address"
            />
          </div>

          <div class="space-y-2">
            <label for="userName" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <!-- <input
              id="userName"
              v-model="form.userName"
              type="text"
              :disabled="form.userUid != ''"
              class="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-400 disabled:bg-gray-100 disabled:border-gray-200 disabled:cursor-not-allowed disabled:text-gray-500"
              placeholder="Enter username"
            /> -->
            <FelProtectedInput
              id="userName"
              v-model="form.userName"
              type="text"
              :required-clicks="5"
              placeholder="Enter username"
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-400"
              placeholder="Enter password"
            />
          </div>

          <div class="space-y-2">
            <label for="passwordc" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="passwordc"
              v-model="form.passwordc"
              type="password"
              class="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-400"
              placeholder="Confirm password"
            />
          </div>

          <div class="col-span-2 space-y-2">
            <label for="groupUid" class="block text-sm font-medium text-gray-700">
              Group
            </label>
            <select
              id="groupUid"
              v-model="form.groupUid"
              class="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-400"
            >
              <option value="" class="text-gray-400">Select a group</option>
              <option
                v-for="group in groups"
                :key="group.uid"
                :value="group.uid"
                class="text-gray-900"
              >
                {{ group?.name }}
              </option>
            </select>
          </div>

          <!-- Laboratory Assignment Section -->
          <div class="col-span-2 space-y-4 border-t border-gray-200 pt-6">
            <h4 class="text-md font-medium text-gray-700">Laboratory Access (Optional)</h4>
            
            <!-- Laboratory Multi-Select -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Assigned Laboratories</label>
              <div class="border-2 border-gray-300 rounded-md p-3 space-y-2 max-h-32 overflow-y-auto">
                <div v-for="lab in mockLaboratories" :key="lab.uid" class="flex items-center space-x-3">
                  <input
                    :id="`lab-${lab.uid}`"
                    v-model="form.laboratoryUids"
                    :value="lab.uid"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label :for="`lab-${lab.uid}`" class="flex-1 cursor-pointer text-sm">
                    {{ lab.name }} ({{ lab.code }})
                  </label>
                </div>
              </div>
            </div>

            <!-- Active Laboratory Selection -->
            <div v-if="form.laboratoryUids && form.laboratoryUids.length > 0" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Default Active Laboratory</label>
              <select
                v-model="form.activeLaboratoryUid"
                class="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:border-gray-400"
              >
                <option value="">Select default laboratory...</option>
                <option
                  v-for="labUid in form.laboratoryUids"
                  :key="labUid"
                  :value="labUid"
                  class="text-gray-900"
                >
                  {{ getLaboratoryName(labUid) }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700">Blocked</span>
              <button
                type="button"
                role="switch"
                :aria-checked="form.isBlocked"
                @click="form.isBlocked = !form.isBlocked"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                :class="[form.isBlocked ? 'bg-red-500' : 'bg-green-500']"
              >
                <span
                  aria-hidden="true"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="[form.isBlocked ? 'translate-x-5' : 'translate-x-0']"
                />
              </button>
            </label>
          </div>

          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700">Active</span>
              <button
                type="button"
                role="switch"
                :aria-checked="form.isActive"
                @click="form.isActive = !form.isActive"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                :class="[form.isActive ? 'bg-green-500' : 'bg-red-500']"
              >
                <span
                  aria-hidden="true"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="[form.isActive ? 'translate-x-5' : 'translate-x-0']"
                />
              </button>
            </label>
          </div>
        </div>

        <div class="flex justify-end pt-6">
          <button
            type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            {{ form.userUid ? 'Update' : 'Create' }} User
          </button>
        </div>
      </form>
    </template>
  </fel-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, defineAsyncComponent, onMounted } from "vue";
import {
    AddUserDocument, AddUserMutation, AddUserMutationVariables,
    EditUserDocument, EditUserMutation, EditUserMutationVariables
} from "@/graphql/operations/_mutations";
import { UserType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import useApiUtil  from "@/composables/api_util";
import FelProtectedInput from "@/components/ui/form/FelProtectedInput.vue";

const userStore = useUserStore();
onMounted(() => {
  userStore.fetchUsers({});
  userStore.fetchGroupsAndPermissions();
})

let users = computed<UserType[]>(() => userStore.getUsers);
const groups = computed(() => userStore.getGroups);
let showUserModal = ref<boolean>(false);
let formTitle = ref<string>("");
let form = reactive({ 
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
});

const formAction = ref<boolean>(true);

// Mock laboratories data - in real implementation, these would come from GraphQL queries
const mockLaboratories = ref([
  { uid: "lab1", name: "Central Laboratory", code: "CENTRAL" },
  { uid: "lab2", name: "Branch Laboratory", code: "BRANCH" },
]);

const { withClientMutation } = useApiUtil();
function addUser(): void {
  withClientMutation<AddUserMutation, AddUserMutationVariables>(AddUserDocument, form, "createUser").then((result) =>
    userStore.addUser(result)
  );
}

function editUser(): void {
    withClientMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument, form, "updateUser").then((result) =>
    userStore.updateUser(result)
  );
}

function userGroupsName(user: UserType): string {
  let groups: string[] = [];
  user?.groups?.forEach((g) => groups.push(g?.name!));
  return groups.join(", ");
}

const getLaboratoryName = (labUid: string) => {
  const lab = mockLaboratories.value.find(l => l.uid === labUid);
  return lab?.name || "Unknown Laboratory";
};

function FormManager(create: boolean, obj: UserType = {} as UserType): void {
  formAction.value = create;
  showUserModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "USER";
  if (create) {
    let user = new Object() as UserType;
    user.firstName = "";
    user.lastName = "";
    user.email = "";
    user.isActive = true;
    user.userName = "";
    user.isBlocked = false;
    Object.assign(form, { 
      ...user, 
      groupUid: "", 
      userUid: "",
      laboratoryUids: [],
      activeLaboratoryUid: ""
    });
  } else {
    form.userUid = obj?.uid || "";
    form.groupUid = obj?.groups && obj.groups[0] ? obj.groups[0].uid : "";
    form.isActive = obj.isActive ?? true;
    form.isBlocked = obj.isBlocked ?? false;
    form.userName = obj.userName ?? "";
    form.laboratoryUids = obj.laboratories?.map(lab => lab.uid) || [];
    form.activeLaboratoryUid = obj.activeLaboratoryUid || "";
    Object.assign(form, { ...obj });
  }
}

function saveUserForm(): void {
  if (formAction.value) {
    addUser();
  } else {
    editUser();
  }
  showUserModal.value = false;
}

const headers = [
  "First Name",
  "Last Name",
  "Email",
  "Active",
  "Group",
  "Username",
  "Blocked",
  "Actions"
];
</script>

<style scoped>
/* Alternative: CSS custom properties approach for better field visibility */
.form-field-enhanced {
  @apply mt-1 block w-full rounded-md px-3 py-2 text-sm transition-all duration-200;
  border: 2px solid theme('colors.gray.300');
  background-color: theme('colors.white');
  color: theme('colors.gray.900');
}

.form-field-enhanced::placeholder {
  color: theme('colors.gray.400');
}

.form-field-enhanced:hover {
  border-color: theme('colors.gray.400');
}

.form-field-enhanced:focus {
  outline: none;
  border-color: theme('colors.blue.500');
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-field-enhanced:disabled {
  background-color: theme('colors.gray.100');
  border-color: theme('colors.gray.200');
  cursor: not-allowed;
  color: theme('colors.gray.500');
}

/* Enhanced switch styling */
.switch-enhanced {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>