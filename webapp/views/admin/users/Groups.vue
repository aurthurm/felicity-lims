<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { useUserStore } from '@/stores/user';
  import  useApiUtil  from '@/composables/api_util';
  import { AddGroupDocument, AddGroupMutation, AddGroupMutationVariables, EditGroupDocument, EditGroupMutation, EditGroupMutationVariables, UpdateGroupsAndPermissionsDocument, UpdateGroupsAndPermissionsMutation, UpdateGroupsAndPermissionsMutationVariables, } from '@/graphql/operations/_mutations';
  import { GroupType, PermissionType } from '@/types/gql';
  import * as shield from '@/guards'
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";

defineOptions({ name: 'GroupsView' })
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
      <Button @click="FormManager(true)">
        Add Group
      </Button>
    </div>

    <div class="border border-border bg-card rounded-lg shadow-sm">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Group Name</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Access Pages</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="group in groups" :key="group.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-2 align-middle">{{ group.name }}</TableCell>
              <TableCell class="px-4 py-2 align-middle text-primary">{{ group.pages }}</TableCell>
              <TableCell class="px-4 py-2 align-middle text-right">
                <Button variant="outline" size="sm" @click="FormManager(false, group)">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Group Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <Form @submit="saveForm" class="space-y-4">
        <div class="space-y-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter group name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="pages" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Pages</FormLabel>
              <FormControl>
                <select 
                  multiple
                  :size="pages.length"
                  class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  v-bind="componentField"
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
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </Form>
    </template>
  </Modal>
</template>
