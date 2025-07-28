<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UserType, GroupType, LaboratoryType, OrganizationType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";
import { useRealTimeValidation, commonValidationRules } from "@/composables/form_validation";
import PasswordStrengthIndicator from "@/components/ui/form/PasswordStrengthIndicator.vue";

// Mock GraphQL operations - these would need to be generated from the backend schema
interface CreateUserMutation {
  createUser: {
    __typename: "UserType" | "OperationError";
    uid?: string;
    firstName?: string;
    lastName?: string;
    error?: string;
  };
}

interface CreateUserMutationVariables {
  payload: {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    isActive: boolean;
    isBlocked: boolean;
    groupUid?: string;
    laboratoryUids?: string[];
    activeLaboratoryUid?: string;
  };
}

interface AssignUserToLaboratoriesMutation {
  assignUserToLaboratories: {
    __typename: "UserType" | "OperationError";
    uid?: string;
    error?: string;
  };
}

interface AssignUserToLaboratoriesMutationVariables {
  userUid: string;
  laboratoryUids: string[];
  activeLaboratoryUid?: string;
}

const CreateUserDocument = `
  mutation CreateUser($payload: UserCreateInputType!) {
    createUser(payload: $payload) {
      ... on UserType {
        uid
        firstName
        lastName
        email
        userName
        isActive
        isBlocked
        groups {
          uid
          name
        }
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const AssignUserToLaboratoriesDocument = `
  mutation AssignUserToLaboratories($userUid: String!, $laboratoryUids: [String!]!, $activeLaboratoryUid: String) {
    assignUserToLaboratories(userUid: $userUid, laboratoryUids: $laboratoryUids, activeLaboratoryUid: $activeLaboratoryUid) {
      ... on UserType {
        uid
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const { toastSuccess, toastError } = useNotifyToast();
const { withClientMutation } = useApiUtil();
const router = useRouter();
const userStore = useUserStore();

// Fetch required data
userStore.fetchGroupsAndPermissions();
const groups = computed(() => userStore.getGroups);

// Mock data - in real implementation, these would come from GraphQL queries
const laboratories = ref<LaboratoryType[]>([
  { 
    uid: "lab1", 
    name: "Central Laboratory", 
    organizationUid: "org1",
    code: "CENTRAL",
    email: "central@lab.com"
  },
  { 
    uid: "lab2", 
    name: "Branch Laboratory", 
    organizationUid: "org1",
    code: "BRANCH",
    email: "branch@lab.com"
  },
]);

const organizations = ref<OrganizationType[]>([
  { uid: "org1", name: "Main Organization", setupName: "felicity" }
]);

// Form state
const processing = ref(false);
const formUser = reactive({
  firstName: "",
  lastName: "",
  email: "",
  userName: "",
  password: "",
  passwordConfirm: "",
  isActive: true,
  isBlocked: false,
  groupUid: "",
  laboratoryUids: [] as string[],
  activeLaboratoryUid: "",
});

// Laboratory roles - for future enhancement
const laboratoryRoles = ref<Record<string, string>>({});

// Form validation
const validationRules = {
  ...commonValidationRules,
  laboratoryUids: {
    required: true,
    custom: (value: string[]) => value.length > 0 || "At least one laboratory must be selected"
  }
};

const { isValid: isFormValid, hasError, getError, createFieldValidator } = useRealTimeValidation(
  formUser,
  validationRules
);

const assignedLaboratories = computed(() => {
  return laboratories.value.filter(lab => formUser.laboratoryUids.includes(lab.uid));
});

const getLaboratoryName = (labUid: string) => {
  const lab = laboratories.value.find(l => l.uid === labUid);
  return lab?.name || "Unknown Laboratory";
};

const getOrganizationName = (orgUid: string) => {
  const org = organizations.value.find(o => o.uid === orgUid);
  return org?.name || "Unknown Organization";
};

// Methods
const saveUser = async () => {
  if (!isFormValid.value) {
    toastError("Please fill in all required fields correctly");
    return;
  }

  processing.value = true;
  
  try {
    // Step 1: Create the user
    const userResult = await withClientMutation<CreateUserMutation, CreateUserMutationVariables>(
      CreateUserDocument,
      { 
        payload: {
          firstName: formUser.firstName,
          lastName: formUser.lastName,
          email: formUser.email,
          userName: formUser.userName,
          password: formUser.password,
          isActive: formUser.isActive,
          isBlocked: formUser.isBlocked,
          groupUid: formUser.groupUid || undefined,
        }
      },
      "createUser"
    );

    if (userResult.__typename === "UserType") {
      // Step 2: Assign laboratories if user creation was successful
      if (formUser.laboratoryUids.length > 0) {
        const assignResult = await withClientMutation<AssignUserToLaboratoriesMutation, AssignUserToLaboratoriesMutationVariables>(
          AssignUserToLaboratoriesDocument,
          {
            userUid: userResult.uid!,
            laboratoryUids: formUser.laboratoryUids,
            activeLaboratoryUid: formUser.activeLaboratoryUid || undefined,
          },
          "assignUserToLaboratories"
        );

        if (assignResult.__typename === "OperationError") {
          toastError(assignResult.error || "Failed to assign laboratories to user");
          return;
        }
      }

      toastSuccess("User created successfully");
      router.push("/admin/users-conf");
    } else {
      toastError(userResult.error || "Failed to create user");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    toastError("Failed to create user");
  } finally {
    processing.value = false;
  }
};

// Reset form
const resetForm = () => {
  Object.assign(formUser, {
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    passwordConfirm: "",
    isActive: true,
    isBlocked: false,
    groupUid: "",
    laboratoryUids: [],
    activeLaboratoryUid: "",
  });
  laboratoryRoles.value = {};
};

// Go back to user listing
const goBack = () => {
  router.push("/admin/users-conf");
};

// Handle laboratory selection changes
const onLaboratorySelectionChange = () => {
  // Reset active laboratory if it's not in selected labs
  if (formUser.activeLaboratoryUid && !formUser.laboratoryUids.includes(formUser.activeLaboratoryUid)) {
    formUser.activeLaboratoryUid = "";
  }
  
  // Auto-select first lab as active if none selected
  if (formUser.laboratoryUids.length === 1 && !formUser.activeLaboratoryUid) {
    formUser.activeLaboratoryUid = formUser.laboratoryUids[0];
  }

  // Clean up laboratory roles for unselected labs
  Object.keys(laboratoryRoles.value).forEach(labUid => {
    if (!formUser.laboratoryUids.includes(labUid)) {
      delete laboratoryRoles.value[labUid];
    }
  });
};

// Generate username from email
const generateUsername = () => {
  if (formUser.email) {
    formUser.userName = formUser.email.split('@')[0];
  }
};

// Lifecycle
onMounted(() => {
  // Any initialization logic here
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-foreground">Register New User</h2>
      <button 
        @click="goBack"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Back to Users
      </button>
    </div>

    <hr class="border-border" />

    <form @submit.prevent="saveUser" class="space-y-8">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">Basic Information</h3>
        
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">
              First Name *
            </label>
            <input
              v-model="formUser.firstName"
              type="text"
              required
              placeholder="Enter first name..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">
              Last Name *
            </label>
            <input
              v-model="formUser.lastName"
              type="text"
              required
              placeholder="Enter last name..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">
              Email Address *
            </label>
            <input
              v-model="formUser.email"
              @blur="generateUsername"
              type="email"
              required
              placeholder="Enter email address..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">
              Username *
            </label>
            <input
              v-model="formUser.userName"
              type="text"
              required
              placeholder="Enter username..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">
              Password *
            </label>
            <input
              v-model="formUser.password"
              type="password"
              required
              placeholder="Enter password..."
              v-bind="createFieldValidator('password')"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :class="{ 'border-destructive': hasError('password') }"
            />
            <p v-if="hasError('password')" class="text-sm text-destructive">
              {{ getError('password') }}
            </p>
            <PasswordStrengthIndicator :password="formUser.password" />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">
              Confirm Password *
            </label>
            <input
              v-model="formUser.passwordConfirm"
              type="password"
              required
              placeholder="Confirm password..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :class="{ 'border-destructive': formUser.password && formUser.passwordConfirm && formUser.password !== formUser.passwordConfirm }"
            />
            <p v-if="formUser.password && formUser.passwordConfirm && formUser.password !== formUser.passwordConfirm" class="text-sm text-destructive">
              Passwords do not match
            </p>
          </div>
        </div>
      </div>

      <!-- Role Assignment -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">Role Assignment</h3>
        
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Default Group</label>
          <select
            v-model="formUser.groupUid"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Default Group (Optional)</option>
            <option v-for="group in groups" :key="group.uid" :value="group.uid">
              {{ group.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Laboratory Access -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">Laboratory Access *</h3>
        
        <!-- Laboratory Multi-Select -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Assigned Laboratories</label>
          <div class="border border-input rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
            <div v-for="lab in laboratories" :key="lab.uid" class="flex items-center space-x-3">
              <input
                :id="`lab-${lab.uid}`"
                v-model="formUser.laboratoryUids"
                :value="lab.uid"
                @change="onLaboratorySelectionChange"
                type="checkbox"
                class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
              />
              <label :for="`lab-${lab.uid}`" class="flex-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-sm">{{ lab.name }}</div>
                    <div class="text-xs text-muted-foreground">{{ lab.code }} - {{ getOrganizationName(lab.organizationUid || "") }}</div>
                  </div>
                  <div class="text-xs text-muted-foreground">{{ lab.email }}</div>
                </div>
              </label>
            </div>
          </div>
          <p v-if="formUser.laboratoryUids.length === 0" class="text-sm text-destructive">
            At least one laboratory must be selected
          </p>
        </div>

        <!-- Active Laboratory Selection -->
        <div v-if="formUser.laboratoryUids.length > 0" class="space-y-2">
          <label class="text-sm font-medium text-foreground">Default Active Laboratory</label>
          <select
            v-model="formUser.activeLaboratoryUid"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select default laboratory...</option>
            <option v-for="lab in assignedLaboratories" :key="lab.uid" :value="lab.uid">
              {{ lab.name }}
            </option>
          </select>
        </div>

        <!-- Laboratory Roles (Future Enhancement) -->
        <div v-if="formUser.laboratoryUids.length > 0" class="space-y-2">
          <label class="text-sm font-medium text-foreground">Laboratory-Specific Roles (Optional)</label>
          <div class="space-y-3">
            <div v-for="labUid in formUser.laboratoryUids" :key="labUid" class="flex items-center justify-between p-3 border border-input rounded-md">
              <div class="flex-1">
                <div class="font-medium text-sm">{{ getLaboratoryName(labUid) }}</div>
                <div class="text-xs text-muted-foreground">Specific role for this laboratory</div>
              </div>
              <select
                v-model="laboratoryRoles[labUid]"
                class="w-48 h-8 rounded border border-input bg-background px-2 text-sm"
              >
                <option value="">Use Default Group</option>
                <option v-for="group in groups" :key="group.uid" :value="group.uid">
                  {{ group.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- User Status -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">User Status</h3>
        
        <div class="flex items-center space-x-6">
          <label class="flex items-center space-x-3">
            <input
              v-model="formUser.isActive"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
            />
            <span class="text-sm font-medium text-foreground">Active User</span>
          </label>
          
          <label class="flex items-center space-x-3">
            <input
              v-model="formUser.isBlocked"
              type="checkbox"
              class="h-4 w-4 text-destructive focus:ring-ring border-gray-300 rounded"
            />
            <span class="text-sm font-medium text-foreground">Blocked</span>
          </label>
        </div>
      </div>

      <hr class="border-border" />

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="resetForm"
          :disabled="processing"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Reset Form
        </button>
        
        <button
          type="submit"
          :disabled="!isFormValid || processing"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <span v-if="processing" class="mr-2">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          {{ processing ? "Creating..." : "Create User" }}
        </button>
      </div>
    </form>
  </div>
</template>