<script setup lang="ts">
import { ref, computed, reactive, defineAsyncComponent, onMounted } from "vue";
import {
    AddUserDocument, AddUserMutation, AddUserMutationVariables,
    EditUserDocument, EditUserMutation, EditUserMutationVariables
} from "@/graphql/operations/_mutations";
import { IUser } from "@/models/auth";
import { useUserStore } from "@/stores/user";
import useApiUtil  from "@/composables/api_util";

interface IUserAuthForm extends IUser {
  groupUid: string;
}

const userStore = useUserStore();
onMounted(() => {
  userStore.fetchUsers({});
  userStore.fetchGroupsAndPermissions();
})

let users = computed<IUser[]>(() => userStore.getUsers);
const groups = computed(() => userStore.getGroups);
let showUserModal = ref<boolean>(false);
let formTitle = ref<string>("");
let form = reactive({}) as IUserAuthForm;
const formAction = ref<boolean>(true);

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

function userGroupsName(user: IUser): string {
  let groups: string[] = [];
  user?.groups?.forEach((g) => groups.push(g?.name!));
  return groups.join(", ");
}

function UserFormManager(create: boolean, obj: IUser = {} as IUser): void {
  formAction.value = create;
  showUserModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "USER";
  if (create) {
    let user = new Object() as IUser;
    user.firstName = undefined;
    user.lastName = undefined;
    user.email = undefined;
    user.isActive = true;
    user.groupUid = undefined;
    user.userName = undefined;
    user.isBlocked = false;
    Object.assign(form, { ...user });
  } else {
    obj.userUid = obj?.uid;
    obj.groupUid = obj?.groups![0]?.uid;
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

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Users</h1>
      <button
        @click="showUserModal = true"
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
                @click="editUser(user)"
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

  <fel-modal v-if="showUserModal" @close="showUserModal = false" :title="form.uid ? 'Edit User' : 'Add User'">
    <template v-slot:body>
      <form @submit.prevent="saveUserForm()" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label for="firstName" class="block text-sm font-medium text-foreground">
              First Name
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              class="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter first name"
            />
          </div>

          <div class="space-y-2">
            <label for="lastName" class="block text-sm font-medium text-foreground">
              Last Name
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              class="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter last name"
            />
          </div>

          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter email address"
            />
          </div>

          <div class="space-y-2">
            <label for="userName" class="block text-sm font-medium text-foreground">
              Username
            </label>
            <input
              id="userName"
              v-model="form.userName"
              type="text"
              :disabled="form.uid != undefined"
              class="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
              placeholder="Enter username"
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter password"
            />
          </div>

          <div class="space-y-2">
            <label for="passwordc" class="block text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <input
              id="passwordc"
              v-model="form.passwordc"
              type="password"
              class="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Confirm password"
            />
          </div>

          <div class="col-span-2 space-y-2">
            <label for="groupUid" class="block text-sm font-medium text-foreground">
              Group
            </label>
            <select
              id="groupUid"
              v-model="form.groupUid"
              class="mt-1 block w-full rounded-md border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a group</option>
              <option
                v-for="group in groups"
                :key="group.uid"
                :value="group.uid"
              >
                {{ group?.name }}
              </option>
            </select>
          </div>

          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <span class="text-sm font-medium text-foreground">Blocked</span>
              <button
                type="button"
                role="switch"
                :aria-checked="form.isBlocked"
                @click="form.isBlocked = !form.isBlocked"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                :class="[form.isBlocked ? 'bg-destructive' : 'bg-success']"
              >
                <span
                  aria-hidden="true"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out"
                  :class="[form.isBlocked ? 'translate-x-5' : 'translate-x-0']"
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
                :aria-checked="form.isActive"
                @click="form.isActive = !form.isActive"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                :class="[form.isActive ? 'bg-success' : 'bg-destructive']"
              >
                <span
                  aria-hidden="true"
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out"
                  :class="[form.isActive ? 'translate-x-5' : 'translate-x-0']"
                />
              </button>
            </label>
          </div>
        </div>

        <div class="flex justify-end pt-6">
          <button
            type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {{ form.uid ? 'Update' : 'Create' }} User
          </button>
        </div>
      </form>
    </template>
  </fel-modal>
</template>
@/graphql/operations/_mutations@/graphql/_mutations