<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Users</h1>
      <Button @click="FormManager(true)" aria-label="Add new user">Add User</Button>
    </div>

    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead
                v-for="header in headers"
                :key="header"
                :class="[
                  'h-12 px-4 align-middle font-medium text-muted-foreground',
                  header === 'Actions' ? 'text-right' : 'text-left'
                ]"
              >
                {{ header }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="user in users" :key="user.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm">{{ user.firstName }} {{ user.lastName }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm">{{ user.email }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm">
                <span
                  :class="['inline-flex items-center justify-center',
                    user.isActive ? 'text-success' : 'text-muted-foreground'
                  ]"
                  :title="user.isActive ? 'Active' : 'Inactive'"
                >
                  <CheckCircle v-if="user.isActive" class="size-5" aria-hidden="true" />
                  <XCircle v-else class="size-5" aria-hidden="true" />
                </span>
              </TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm">{{ user.groups?.map(g => g?.name).join(', ') }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm">{{ user.userName }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm">
                <span
                  :class="['inline-flex items-center justify-center',
                    user.isBlocked ? 'text-destructive' : 'text-muted-foreground'
                  ]"
                  :title="user.isBlocked ? 'Blocked' : 'Not blocked'"
                >
                  <Ban v-if="user.isBlocked" class="size-5" aria-hidden="true" />
                  <ShieldCheck v-else class="size-5" aria-hidden="true" />
                </span>
              </TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm">{{ getLaboratoryName(user.activeLaboratoryUid || "") }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm">{{ user.laboratories?.length }} Labs</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right">
                <Button variant="outline" size="sm" @click="FormManager(false, user)" aria-label="Edit user">
                  Edit
                </Button>
              </TableCell>
          </TableRow>
          <TableEmpty v-if="!users || users.length === 0" :colspan="9">
            <Empty class="border-0 bg-transparent p-0">
              <EmptyContent>
                <EmptyHeader>
                  <EmptyTitle>No users found</EmptyTitle>
                  <EmptyDescription>Add a user to get started.</EmptyDescription>
                </EmptyHeader>
              </EmptyContent>
            </Empty>
          </TableEmpty>
        </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <Modal v-if="showUserModal" @close="showUserModal = false" :title="userUid ? 'Edit User' : 'Add User'">
    <template v-slot:body>
      <form @submit.prevent="saveUserForm" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <FormField name="firstName" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter first name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="lastName" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter last name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="email" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="email" placeholder="Enter email address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="userName" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <ProtectedInput
                  v-bind="componentField"
                  id="userName"
                  type="text"
                  :required-clicks="5"
                  :initial-locked="!!userUid"
                  placeholder="Enter username"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="password" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="password" placeholder="Enter password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="passwordc" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="password" placeholder="Confirm password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="groupUid" v-slot="{ value, handleChange }">
            <FormItem class="col-span-2">
              <FormLabel>Group</FormLabel>
              <FormControl>
                <Select
                  :modelValue="value === '' || value == null ? EMPTY_SELECT_VALUE : value"
                  @update:modelValue="(v) => handleChange(v === EMPTY_SELECT_VALUE ? '' : v)"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="EMPTY_SELECT_VALUE">Select a group</SelectItem>
                    <SelectItem v-for="group in groups" :key="group.uid" :value="group.uid">
                      {{ group?.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Laboratory Assignment Section -->
          <div class="col-span-2 space-y-4 border-t border-border pt-6">
            <h4 class="text-md font-medium text-foreground">Laboratory Access (Optional)</h4>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-foreground">Assigned Laboratories</label>
              <MultiSelect
                :model-value="selectedLaboratoryDisplays"
                :options="laboratoryOptions"
                placeholder="Select laboratories..."
                search-placeholder="Search laboratories..."
                empty-message="No laboratories found."
                @update:model-value="onLaboratorySelectionChange"
              />
            </div>

            <!-- Active Laboratory Selection -->
            <FormField v-if="values.laboratoryUids && values.laboratoryUids.length > 0" name="activeLaboratoryUid" v-slot="{ value, handleChange }">
              <FormItem>
                <FormLabel>Default Active Laboratory</FormLabel>
                <FormControl>
                  <Select
                    :modelValue="(value === '' || value == null) ? EMPTY_SELECT_VALUE : value"
                    @update:modelValue="(v) => handleChange(v === EMPTY_SELECT_VALUE ? '' : v)"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select default laboratory..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="EMPTY_SELECT_VALUE">Select default laboratory...</SelectItem>
                      <SelectItem v-for="labUid in values.laboratoryUids" :key="labUid" :value="labUid">
                        {{ getLaboratoryName(labUid) }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <FormField name="isBlocked" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" />
              </FormControl>
              <FormLabel>Blocked</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="isActive" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" />
              </FormControl>
              <FormLabel>Active</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex justify-end pt-6">
          <Button type="submit">
            {{ userUid ? 'Update' : 'Create' }} User
          </Button>
        </div>
      </form>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import {
    AddUserDocument, AddUserMutation, AddUserMutationVariables,
    EditUserDocument, EditUserMutation, EditUserMutationVariables
} from "@/graphql/operations/_mutations";
import { UserType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import { useSetupStore } from "@/stores/setup";
import useApiUtil  from "@/composables/api_util";
import ProtectedInput from "@/components/common/ProtectedInput.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, Ban, ShieldCheck } from "lucide-vue-next";

const userStore = useUserStore();
const setupStore = useSetupStore();

/** Sentinel for Select placeholder; reka-ui SelectItem cannot use value="" */
const EMPTY_SELECT_VALUE = "__none__";

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

const { handleSubmit, resetForm, setValues, values, setFieldValue } = useForm({
  validationSchema: userSchema,
  initialValues: {
    userUid: "",
    firstName: "",
    lastName: "",
    email: "",
    groupUid: "",
    userName: "",
    mobilePhone: "" as string | undefined,
    password: "",
    passwordc: "",
    isActive: true,
    isBlocked: false,
    laboratoryUids: [] as string[],
    activeLaboratoryUid: "",
  },
});

const userUid = computed(() => values.userUid);

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

/** Display string for a lab (name only) for MultiSelect options; never shows uid */
const getLaboratoryDisplay = (lab: { name?: string | null; code?: string | null; uid: string }) =>
  lab?.name ?? "Unknown";

const laboratoryOptions = computed(() =>
  setupStore.getLaboratories.map((lab) => getLaboratoryDisplay(lab)),
);

/** Selected lab display strings derived from form laboratoryUids; never shows uid */
const selectedLaboratoryDisplays = computed(() =>
  (values.laboratoryUids || []).map((uid) => {
    const lab = setupStore.getLaboratories.find((l) => l.uid === uid);
    return lab ? getLaboratoryDisplay(lab) : "Unknown laboratory";
  }),
);

function onLaboratorySelectionChange(displayStrings: string[]) {
  const uids = displayStrings
    .map((display) => setupStore.getLaboratories.find((l) => getLaboratoryDisplay(l) === display)?.uid)
    .filter((uid): uid is string => Boolean(uid));
  setFieldValue("laboratoryUids", uids);
}

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
        mobilePhone: "",
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
      groupUid: obj?.groups?.[0]?.uid ?? "",
      userName: obj?.userName ?? "",
      mobilePhone: obj?.mobilePhone ?? "",
      password: "",
      passwordc: "",
      isActive: obj?.isActive ?? true,
      isBlocked: obj?.isBlocked ?? false,
      laboratoryUids: Array.isArray(obj?.laboratories) ? obj.laboratories : [],
      activeLaboratoryUid: obj?.activeLaboratoryUid || "",
    });
  }
}

const saveUserForm = handleSubmit((values) => {
  const basePayload = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    groupUid: values.groupUid || undefined,
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
      mobilePhone: values.mobilePhone || undefined,
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
