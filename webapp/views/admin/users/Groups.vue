<script setup lang="ts">
  import { ref,reactive, computed, defineAsyncComponent } from 'vue';
  import { useUserStore } from '@/stores/user';
  import  useApiUtil  from '@/composables/api_util';
  import { AddGroupDocument, AddGroupMutation, AddGroupMutationVariables, EditGroupDocument, EditGroupMutation, EditGroupMutationVariables, UpdateGroupsAndPermissionsDocument, UpdateGroupsAndPermissionsMutation, UpdateGroupsAndPermissionsMutationVariables, } from '@/graphql/operations/_mutations';
  import { IGroup, IPermission } from '@/models/auth';
  import * as shield from '@/guards'

  const FelSwitch = defineAsyncComponent(
    () => import("@/components/ui/switch/FelSwitch.vue")
  )
  const modal = defineAsyncComponent(
    () =>import('@/components/ui/FelModal.vue')
  )
  const accordion = defineAsyncComponent(
    () =>import('@/components/ui/FelAccordion.vue')
  )

  const pages = [
    shield.pages.ADMINISTRATION,
    shield.pages.DASHBOARD,
    shield.pages.CLIENTS,
    shield.pages.PATIENTS,
    shield.pages.PATIENTS_COMPACT,
    shield.pages.SAMPLES,
    shield.pages.QC_SAMPLES,
    shield.pages.WORKSHEETS,
    shield.pages.NOTICE_MANAGER,
    shield.pages.BIO_BANKING,
    shield.pages.INVENTORY,
    shield.pages.REFERRAL,
    shield.pages.SCHEMES,
    shield.pages.DOCUMENT,
  ]

  let userStore = useUserStore()
  const { withClientMutation } = useApiUtil()

  userStore.fetchGroupsAndPermissions();
  const groups = computed(() => userStore.getGroups)

  // each tab if just gonna be forms with updatable values on button click
  let currentTab = ref('permissions');
  const tabs = ['permissions'];
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);
  let userGroup = reactive({}) as IGroup;

  function selectGroup(group: IGroup): void {
    const pgs = group.pages as string;
    Object.assign(userGroup, { 
      ...group, 
      pages: pgs?.split(",") || [],
    })
    permissions.value?.forEach(item => {
      item[1].forEach((perm: IPermission) => {
        perm.checked = false;
        if(userGroup.permissions?.some(p => {
          return (p?.uid == perm?.uid) || false;
        })) {
          perm.checked = true;
        };
      })
    })
  }

  function FormManager(create: boolean, obj = {} as IGroup): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES PROFILE";
    if (create) {
      Object.assign(userGroup, { name: "", pages: [] } as IGroup);
    } else {
      Object.assign(userGroup, { ...obj });
    }
  }

  function saveForm():void {
    const payload = { ...userGroup }
    const pgs = payload["pages"] as string[];
    payload['pages'] = pgs.join(',')

    if (formAction.value === true) {
      withClientMutation<AddGroupMutation, AddGroupMutationVariables>(AddGroupDocument, {  payload }, "createGroup")
      .then((result) => userStore.addGroup(result));
    }

    if (formAction.value === false) {
      withClientMutation<EditGroupMutation, EditGroupMutationVariables>(EditGroupDocument, {  uid: userGroup?.uid, payload: {
        name: payload["name"],
        pages: payload["pages"],
      } }, "updateGroup").then((result) => userStore.updateGroup(result));
    };
    showModal.value = false;
  
  }

  //
  const groupBy = (xs, key):Map<any, any> => {
    return xs?.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const permissions = computed(() => Array.from(Object.entries(groupBy(userStore.getPermissions, 'target'))))
  
  function updateGroupPerms(group: IGroup, permission: IPermission): void {
      withClientMutation<UpdateGroupsAndPermissionsMutation, UpdateGroupsAndPermissionsMutationVariables>(UpdateGroupsAndPermissionsDocument, {  groupUid: group?.uid, permissionUid: permission?.uid }, "updateGroupPermissions")
      .then((result) => userStore.updateGroupsAndPermissions(result));
  }

</script>

<template>
  <div class="container w-full my-4">
    <hr>
    <button
      class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none"
      @click="FormManager(true)"
    >Add Group</button>
    <hr>

  </div>
  <hr />

  <div class="overflow-x-auto mt-4">
    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <table class="min-w-full">
        <thead>
          <tr>
            <th
              class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Group Name
            </th>
            <th
              class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Access Pages
            </th>
            <th class="px-1 py-1 border-b-2 border-border"></th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="group in groups" :key="group.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-gray-800">{{ group.name }}</div>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-primary">{{ group.pages }}</div>
            </td>
            <td
              class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"
            >
              <button
                @click="FormManager(false, group)"
                class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded-sm transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>  

  <!-- Group Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Group Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="userGroup.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Pages</span>
            <select 
              name="controlLevels" 
              id="controlLevels" 
              v-model="userGroup.pages"
              class="form-input mt-1 block w-full" multiple :size="pages.length">
                <option  
                v-for="page in pages"
                :key="page"
                :value="page" >{{ page }}</option>
            </select>
          </label>
          <label for="toggle" class="text-xs text-gray-700 mr-4">Active
            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                type="checkbox" 
                name="toggle" id="toggle" 
                v-model="userGroup.active"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"/>
                <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-primary bg-primary text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>