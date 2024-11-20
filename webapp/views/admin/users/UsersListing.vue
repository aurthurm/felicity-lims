<script setup lang="ts">
import { ref, computed, reactive, defineAsyncComponent } from "vue";
import {
    AddUserDocument, AddUserMutation, AddUserMutationVariables,
    EditUserDocument, EditUserMutation, EditUserMutationVariables
} from "@/graphql/operations/_mutations";
import { IUser } from "@/models/auth";
import { useUserStore } from "@/stores/user";
import useApiUtil  from "@/composables/api_util";
const modal = defineAsyncComponent(
  () => import( "@/components/ui/FelModal.vue")
)

interface IUserAuthForm extends IUser {
  groupUid: string;
}

const userStore = useUserStore();
const { withClientMutation } = useApiUtil();

let showUserModal = ref<boolean>(false);
let formTitle = ref<string>("");
let form = reactive({}) as IUserAuthForm;
const formAction = ref<boolean>(true);

userStore.fetchUsers({});
userStore.fetchGroupsAndPermissions();

userStore.fetchGroupsAndPermissions();
userStore.fetchUsers({});
let users = computed<IUser[]>(() => userStore.getUsers);
const groups = computed(() => userStore.getGroups);

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
</script>

<template>
  <div class="w-full my-4">
    <hr />
    <div class="flex justify-between items-center">
      <h3>Users</h3>
      <button
        @click="UserFormManager(true)"
        class="px-2 py-1 ml-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Add User/Lab Contact
      </button>
    </div>
    <hr />

    <div class="overflow-x-auto mt-4">
      <div
        class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"
      >
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                First Name
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Last Name
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Email Adress
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Active
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Groups
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Username
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Blocked
              </th>
              <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr v-for="user in users" :key="user.uid">
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                  <div class="text-sm leading-5 text-gray-800">{{ user.firstName }}</div>
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">{{ user.lastName }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">{{ user.email }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <span
                  class=""
                  :class="[
                    'block h-4 w-4 rounded-full bottom-0 right-0',
                    user?.isActive ? 'bg-emerald-600' : 'bg-orange-600',
                  ]"
                ></span>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">
                  {{ userGroupsName(user) }}
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">
                  {{ user?.userName }}
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <span
                  :class="[
                    'block h-4 w-4 rounded-full bottom-0 right-0',
                    !user?.isBlocked ? 'bg-emerald-600' : 'bg-orange-600',
                  ]"
                ></span>
              </td>
              <td
                class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"
              >
                <button v-show="!user.isSuperuser"
                  @click="UserFormManager(false, user)"
                  class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded-sm transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none"
                >
                  Edit User
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- UserForm Modal -->
  <modal v-if="showUserModal" @close="showUserModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1" disabled>
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">First Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.firstName"
              placeholder="First Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Last Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.lastName"
              placeholder="Last Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Email</span>
            <input
              class="form-input mt-1 block w-full"
              type="email"
              v-model="form.email"
              placeholder="Email ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">UserName</span>
            <input
              class="form-input mt-1 block w-full disabled:bg-slate-300"
              v-model="form.userName"
              placeholder="First Name ..."
              :disabled="form.uid != undefined"
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Password</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.password"
              placeholder="Password ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Confirm Password</span>
            <input
              class="form-input mt-1 block w-full"
              type="email"
              v-model="form.passwordc"
              placeholder="confirm ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Group</span>
            <select class="form-select block w-full mt-1" v-model="form.groupUid">
              <option></option>
              <option v-for="group in groups" :key="group.uid" :value="group.uid">
                {{ group?.name }}
              </option>
            </select>
          </label>
          <label for="toggle" class="block col-span-1 text-xs text-gray-700 mt-4"
            >Blocked
            <div
              class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
            >
              <input
                type="checkbox"
                name="toggle"
                id="toggle"
                v-model="form.isBlocked"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"
              />
              <label
                for="toggle"
                class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </label>
          <label for="toggle" class="block col-span-1 text-xs text-gray-700 mt-4"
            >Active
            <div
              class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
            >
              <input
                type="checkbox"
                name="toggle"
                id="toggle"
                v-model="form.isActive"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"
              />
              <label
                for="toggle"
                class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveUserForm()"
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>
@/graphql/operations/_mutations@/graphql/_mutations