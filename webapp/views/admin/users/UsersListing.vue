<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">Users</h1>
      <Button @click="FormManager(true)" aria-label="Add new user">Add User</Button>
    </div>

    <div class="bg-card rounded-lg shadow-sm">
      <Table class="min-w-full divide-y divide-border">
        <TableHeader>
          <TableRow>
            <TableHead
              v-for="header in headers"
              :key="header"
              class="px-6 py-3 text-left text-sm font-medium text-muted-foreground tracking-wider"
            >
              {{ header }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="bg-background divide-y divide-border">
          <TableRow v-for="user in users" :key="user.uid" class="hover:bg-muted/50">
            <TableCell class="px-6 py-4 whitespace-nowrap text-sm">{{ user.firstName }} {{ user.lastName }}</TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap text-sm">{{ user.email }}</TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  user.isActive ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                ]"
              >
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </span>
            </TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap text-sm">{{ user.groups?.map(g => g?.name).join(', ') }}</TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap text-sm">{{ user.userName }}</TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap text-sm">
              <span
                :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  user.isBlocked ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'
                ]"
              >
                {{ user.isBlocked ? 'Blocked' : 'Active' }}
              </span>
            </TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap text-sm">{{ getLaboratoryName(user.activeLaboratoryUid || "") }}</TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap text-sm">{{ user.laboratories?.length }} Labs</TableCell>
            <TableCell class="px-6 py-4 whitespace-nowrap text-sm text-right">
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

  <Modal v-if="showUserModal" @close="showUserModal = false" :title="userUid ? 'Edit User' : 'Add User'">
    <template v-slot:body>
      <Form @submit="saveUserForm" class="space-y-6">
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
                <ProtectedInput v-bind="componentField" id="userName" type="text" :required-clicks="5" placeholder="Enter username" />
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

          <FormField name="groupUid" v-slot="{ componentField }">
            <FormItem class="col-span-2">
              <FormLabel>Group</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select a group</SelectItem>
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
            
            <!-- Laboratory Multi-Select -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-foreground">Assigned Laboratories</label>
              <div class="border-2 border-input rounded-md p-3 space-y-2 max-h-32 overflow-y-auto">
                <div v-for="lab in setupStore.getLaboratories" :key="lab.uid" class="flex items-center space-x-3">
                  <Checkbox
                    :id="`lab-${lab.uid}`"
                    :checked="values.laboratoryUids.includes(lab.uid)"
                    @update:checked="(value) => {
                      const next = value
                        ? (values.laboratoryUids.includes(lab.uid) ? values.laboratoryUids : [...values.laboratoryUids, lab.uid])
                        : values.laboratoryUids.filter((uid) => uid !== lab.uid);
                      setFieldValue('laboratoryUids', next);
                    }"
                  />
                  <label :for="`lab-${lab.uid}`" class="flex-1 cursor-pointer text-sm">
                    {{ lab.name }} ({{ lab.code }})
                  </label>
                </div>
              </div>
            </div>

            <!-- Active Laboratory Selection -->
            <FormField v-if="values.laboratoryUids && values.laboratoryUids.length > 0" name="activeLaboratoryUid" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Default Active Laboratory</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Select default laboratory..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Select default laboratory...</SelectItem>
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

          <FormField name="isBlocked" v-slot="{ value, handleChange }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Switch :checked="value" @update:checked="handleChange" />
              </FormControl>
              <FormLabel>Blocked</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="isActive" v-slot="{ value, handleChange }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Switch :checked="value" @update:checked="handleChange" />
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
      </Form>
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Form,
  FormControl,
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

const { handleSubmit, resetForm, setValues, values, setFieldValue } = useForm({
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
