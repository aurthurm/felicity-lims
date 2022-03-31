<template>

    <div class="w-full my-4">
        <hr>
        <div class="flex justify-between items-center">
          <h3>Users</h3>
          <button @click="UserFormManager(true)" class="px-2 py-1 ml-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Add User/Lab Contact</button>
        </div>
        <hr>
        
        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">First Name</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Last Name</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Email Adress</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Active</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Groups</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Username</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">User Type</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Blocked</th>
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
                      <div class="text-sm leading-5 text-blue-900">{{ user.lastName }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="text-sm leading-5 text-blue-900">{{ user.email }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                        <span class=""
                          :class="[
                            'block h-4 w-4 rounded-full bottom-0 right-0',
                            user?.isActive ? 'bg-green-400' : 'bg-red-400' ,
                          ]"
                        ></span>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="text-sm leading-5 text-blue-900">{{ userGroupsName(user) }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="text-sm leading-5 text-blue-900">{{ user?.auth?.userName }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="text-sm leading-5 text-blue-900">{{ user?.auth?.userType }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                        <span
                          v-if="user?.auth"
                          :class="[
                            'block h-4 w-4 rounded-full bottom-0 right-0',
                            !user?.auth?.isBlocked ? 'bg-green-400' : 'bg-red-400' ,
                          ]"
                        ></span>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                        <button @click="UserFormManager(false, user)" class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">Edit User</button>
                        <button
                        v-if="!user?.auth"
                         @click="UserAuthFormManager(true, user)" class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">Add Auth</button>
                                                 <button
                        v-if="user?.auth"
                         @click="UserAuthFormManager(false, user)" class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">Edit Auth</button>
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
      <form action="post" class="p-1">
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
            <span class="text-gray-700">Group</span>
            <select class="form-select block w-full mt-1" v-model="form.groupUid">
               <option></option>
              <option v-for="group in groups" :key="group.uid" :value="group.uid">{{ group?.name }}</option>
            </select>
          </label>
          <label for="toggle" class=" block col-span-2 text-xs text-gray-700 mt-4">Active
            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                type="checkbox" 
                name="toggle" id="toggle" 
                v-model="form.isActive"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"/>
                <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveUserForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

      <!-- UserAuthForm Modal -->
  <modal v-if="showUserAuthModal" @close="showUserAuthModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">UserName</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.userName"
              placeholder="First Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Password</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.password"
              placeholder="Last Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Confirm Password</span>
            <input
              class="form-input mt-1 block w-full"
              type="email"
              v-model="form.passwordc"
              placeholder="Email ..."
            />
          </label>
          <label for="toggle" class=" block col-span-2 text-xs text-gray-700 mt-4">Blocked
            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                type="checkbox" 
                name="toggle" id="toggle" 
                v-model="form.isBlocked"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"/>
                <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveUserAuthForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>


</template>

<script lang="ts">

import modal from '../../../components/SimpleModal.vue';

import { defineComponent, ref, computed, reactive } from 'vue';
import { useStore } from 'vuex';
import { useMutation } from '@urql/vue';
import { ActionTypes } from '../../../store/actions';
import { ADD_USER, EDIT_USER, ADD_USER_AUTH, EDIT_USER_AUTH  } from '../../../graphql/_mutations';
import { IUser, IUserAuth } from '../../../models/auth';

import { useUserStore } from '../../../stores/users'


interface IUserAuthForm extends IUser, IUserAuth {
  groupUid: number
};

export default defineComponent({
  name: "tab-users",
  components: {
    modal
  },
  setup() {
    let store = useStore();
    const store2 = useUserStore()

    let showUserModal = ref<boolean>(false);
    let showUserAuthModal = ref<boolean>(false);
    let formTitle = ref<string>('');
    let form = reactive({}) as IUserAuthForm;
    const formAction = ref<boolean>(true);

    store2.fetchUsers({})
    store2.fetchGroupsAndPermissions()
    console.log(store2.getUsers)
    console.log(store2.users)

    store.dispatch(ActionTypes.FETCH_GROUPS_AND_PERMISSIONS);
    store.dispatch(ActionTypes.FETCH_USERS);
    let users = computed<IUser[]>(() => store.getters.getUsers);

    const { executeMutation: createUser } = useMutation(ADD_USER);
    const { executeMutation: updateUser } = useMutation(EDIT_USER);
    const { executeMutation: createUserAuth } = useMutation(ADD_USER_AUTH);
    const { executeMutation: updateUserAuth } = useMutation(EDIT_USER_AUTH);


    function addUser(): void {
      createUser(form).then((result) => {
        store.dispatch(ActionTypes.ADD_USER, result?.data?.createUser);
      });
    }

    function editUser(): void {
      updateUser(form).then((result) => {
        store.dispatch(ActionTypes.UPDATE_USER, result?.data?.updateUser);
      });
    }

    function addUserAuth(): void {
      createUserAuth(form).then((result) => {
        store.dispatch(ActionTypes.UPDATE_USER, result?.data?.createUserAuth);
      });
    }

    function editUserAuth(): void {
      updateUserAuth(form).then((result) => {
        store.dispatch(ActionTypes.UPDATE_USER, result?.data?.updateUserAuth);
      });
    }

    function userGroupsName(user: IUser): string {
        let groups: string[] = [];
        user?.groups?.forEach(g => groups.push(g?.name!));
        return groups.join(', ');
    }

    function UserFormManager(create:boolean, obj: IUser = {} as IUser): void {
      formAction.value = create;
      showUserModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "USER";
      if (create) {
        let user = new Object as IUser;
        user.firstName = "";
        user.lastName = "";
        user.email = "";
        user.isActive = true;
        user.groupUid = undefined;
        Object.assign(form, { ...user });
      } else {
        obj.userUid = obj?.uid;
        obj.groupUid = obj?.groups![0]?.uid;
        Object.assign(form, { ...obj });
      }
    }

    function saveUserForm(): void {
      if(formAction.value){
        addUser()
      } else {
        editUser()
      }
      showUserModal.value = false;
    }

    function UserAuthFormManager(create: boolean, obj: IUser): void {
      formAction.value = create;
      showUserAuthModal.value = true;
      formTitle.value = (create ? 'ADD' : 'EDIT') + ' AUTHENTICATION ' + "FOR USER " + obj?.firstName;
      let userAuth = new Object as IUserAuth;
      userAuth.userUid = obj?.uid;
      userAuth.password = "";
      userAuth.passwordc = "";
      if (create) {
        userAuth.userName = "";
        userAuth.isBlocked = false;
        Object.assign(form, { ...userAuth });
      } else {
        userAuth.userName = obj?.auth?.userName;
        userAuth.isBlocked = obj?.auth?.isBlocked;
        Object.assign(form, { ...userAuth });
      }
    }

    function saveUserAuthForm(): void {
        if(formAction.value){
          addUserAuth()
        } else {
          editUserAuth()
        }
        showUserAuthModal.value = false;      
    }

    return {  
      users, 
      userGroupsName,
      UserFormManager, 
      showUserModal,
      groups: computed(() => store.getters.getGroups),
      formTitle,
      form,
      saveUserForm,
      showUserAuthModal,
      UserAuthFormManager,
      saveUserAuthForm
    };
  },
});
</script>