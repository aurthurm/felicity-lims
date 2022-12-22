<script setup lang="ts">
  import modal from '../../../components/SimpleModal.vue';
  import accordion from '../../../components/Accordion.vue';
  import { ref,reactive, computed } from 'vue';
  import { useUserStore } from '../../../stores';
  import { useApiUtil } from '../../../composables';
  import { UPDATE_GROUP_PERMS, ADD_GROUP, UPDATE_GROUP } from '../../../graphql/_mutations';
  import { IGroup, IPermission } from '../../../models/auth';

  import * as shield from '../../../guards'
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
    shield.pages.MARKDOWN_DOCUMENTS,
    shield.pages.KANBAN_BOARD,
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
      withClientMutation(ADD_GROUP, {  payload }, "createGroup")
      .then((result) => userStore.addGroup(result));
    }

    if (formAction.value === false) {
      withClientMutation(UPDATE_GROUP, {  uid: userGroup?.uid, payload: {
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
      withClientMutation(UPDATE_GROUP_PERMS, {  groupUid: group?.uid, permissionUid: permission?.uid }, "updateGroupPermissions")
      .then((result) => userStore.updateGroupsAndPermissions(result));
  }

</script>

<template>
  <div class="">
    <div class="container w-full my-4">
      <hr>
      <button
        class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      >Add Group</button>
      <hr>

    </div>
    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-3 overflow-y-scroll overscroll-contain patient-scrol">
        <ul>
          <li 
          v-for="group in groups"
          :key="group?.uid"
          href="#"
          @click.prevent.stop="selectGroup(group)"
          :class="[
            'bg-white shadow w-full p-1 mb-1 rounded-sm',
            { 'border border-sky-800 bg-emerald-200': group?.uid === userGroup?.uid },
          ]">
            <a class="cursor-pointer">
              <div class="flex-grow p-1">
                <div class="font-medium text-gray-800 hover:text-gray-600 flex justify-between">
                  <span>{{ group?.name }}</span>
                  <span class="text-sm text-gray-500"></span>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </section>

      <section class="col-span-9"  v-if="userGroup?.uid !== undefined">
        <div class="bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4" >
          <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 px-3 sm:px-0">
              <div class="flex justify-between">
                <section>
                  <h2 class="sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold">{{ userGroup?.name }}</h2>
                  <hr>
                  <div div class="flex justify-start mt-2">
                    <h3 class="mr-2 text-gray-600 font-semibold">Pages: </h3>
                    <span v-for="item in userGroup?.pages" class="mr-2">{{ item?.toLowerCase() }} </span>
                  </div>
                </section>
                <div>
                  <button
                    @click="FormManager(false)"
                    class="ml-4 inline-flex items-center justify-center w-8 h-8 mr-2 border-sky-800 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sample and Case Data -->
        <nav class="bg-white shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
              href="#"
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <section class="mt-2 p-2 bg-white">
          <div v-if="currentTab === 'permissions'">
  
            <section class="col-span-4 overflow-y-scroll overscroll-contain analyses-scroll bg-white p-1">
              <div class="grid grid-cols-4 gap-2 w-full">
                <div class="col-span-1" v-for="category in permissions" :key="category[0]">
                    <accordion >
                      <template v-slot:title>{{ category[0] }}</template>
                      <template v-slot:body>
                          <div>
                            <ul>
                              <li 
                              v-for="perm in category[1]" 
                              :key="perm?.uid" class="cursor-pointer"
                              @click.prevent="perm.checked = !perm?.checked"
                              :class="[
                                { 'border-sky-800 bg-gray-200 underline pl-3': false },
                              ]"
                              >
                                <div class="flex-grow p-1">
                                  <div 
                                    :class="[
                                    'font-medium text-gray-500 hover:text-gray-700 flex justify-start',
                                      { 'text-gray-700 font-medium': false },
                                    ]"
                                  >
                                    <label for="toggle" class="text-xs text-gray-700 mr-2" @click="updateGroupPerms(userGroup, perm)">
                                      <div class="inline-block w-10 mr-2 align-middle transition duration-200 ease-in">
                                          <input 
                                          type="checkbox" 
                                          v-model="perm.checked"
                                          class=""/>
                                      </div>
                                      <span>{{ perm?.action }}</span>
                                    </label>
                                  </div>
                                </div>
                                <hr>
                              </li>
                            </ul>
                          </div>
                      </template>
                    </accordion>
                </div>
              </div>
            </section>

          </div>
          <div v-else> <!-- fiancials -->
            <h3>Error</h3>
            <hr>
          </div>
        </section>

      </section>
    </div>
  </div>

  <!-- AnaltsisProfile Form Modal -->
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
                v-for="(page, index) in pages"
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
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>
