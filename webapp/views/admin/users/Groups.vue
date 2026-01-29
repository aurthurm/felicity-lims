<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { useUserStore } from '@/stores/user';
  import  useApiUtil  from '@/composables/api_util';
  import { AddGroupDocument, AddGroupMutation, AddGroupMutationVariables, EditGroupDocument, EditGroupMutation, EditGroupMutationVariables, UpdateGroupsAndPermissionsDocument, UpdateGroupsAndPermissionsMutation, UpdateGroupsAndPermissionsMutationVariables, } from '@/graphql/operations/_mutations';
  import { GroupType, PermissionType } from '@/types/gql';
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
    shield.pages.BILLING,
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
  let userGroup = reactive({}) as GroupType;
  const currentUid = ref<string | null>(null);

  const groupSchema = yup.object({
    name: yup.string().trim().required('Group name is required'),
    pages: yup.array().of(yup.string()).nullable(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: groupSchema,
    initialValues: {
      name: '',
      pages: [],
    },
  });

  const { value: name, errorMessage: nameError } = useField<string>('name');
  const { value: pagesField, errorMessage: pagesError } = useField<string[]>('pages');

  function selectGroup(group: GroupType): void {
    const pgs = group.pages as string;
    Object.assign(userGroup, { 
      ...group, 
      pages: pgs?.split(",") || [],
    })
    permissions.value?.forEach(item => {
      item[1].forEach((perm: PermissionType) => {
        perm.checked = false;
        if(userGroup.permissions?.some(p => {
          return (p?.uid == perm?.uid) || false;
        })) {
          perm.checked = true;
        };
      })
    })
  }

  function FormManager(create: boolean, obj = {} as GroupType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES PROFILE";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: "",
          pages: [],
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        name: obj.name ?? "",
        pages: (obj.pages as unknown as string[]) ?? [],
      });
    }
  }

  const saveForm = handleSubmit((values) => {
    const payload = {
      name: values.name,
      pages: (values.pages ?? []).join(','),
    };

    if (formAction.value === true) {
      withClientMutation<AddGroupMutation, AddGroupMutationVariables>(AddGroupDocument, {  payload }, "createGroup")
      .then((result) => userStore.addGroup(result));
    }

    if (formAction.value === false) {
      if (!currentUid.value) {
        return;
      }
      withClientMutation<EditGroupMutation, EditGroupMutationVariables>(EditGroupDocument, {  uid: currentUid.value, payload: {
        name: payload["name"],
        pages: payload["pages"],
      } }, "updateGroup").then((result) => userStore.updateGroup(result));
    };
    showModal.value = false;
  
  });

  //
  const groupBy = (xs, key):Map<any, any> => {
    return xs?.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const permissions = computed(() => Array.from(Object.entries(groupBy(userStore.getPermissions, 'target'))))
  
  function updateGroupPerms(group: GroupType, permission: PermissionType): void {
      withClientMutation<UpdateGroupsAndPermissionsMutation, UpdateGroupsAndPermissionsMutationVariables>(UpdateGroupsAndPermissionsDocument, {  groupUid: group?.uid, permissionUid: permission?.uid }, "updateGroupPermissions")
      .then((result) => userStore.updateGroupsAndPermissions(result));
  }

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-foreground">Groups</h2>
      <button
        @click="FormManager(true)"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Add Group
      </button>
    </div>

    <div class="border border-border bg-card rounded-lg shadow-sm">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm fel-table">
          <thead class="[&_tr]:border-b">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Group Name</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Access Pages</th>
              <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr v-for="group in groups" :key="group.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td class="px-4 py-2 align-middle">{{ group.name }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ group.pages }}</td>
              <td class="px-4 py-2 align-middle text-right">
                <button
                  @click="FormManager(false, group)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
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

  <!-- Group Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-4">
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Group Name
            </label>
            <input
              v-model="name"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter group name..."
            />
            <p v-if="nameError" class="text-sm text-destructive">{{ nameError }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Pages
            </label>
            <select 
              v-model="pagesField"
              multiple
              :size="pages.length"
              class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option 
                v-for="page in pages"
                :key="page"
                :value="page"
                class="py-1"
              >
                {{ page }}
              </option>
            </select>
            <p v-if="pagesError" class="text-sm text-destructive">{{ pagesError }}</p>
          </div>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </template>
  </fel-modal>
</template>
