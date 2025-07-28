<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UserType, GroupType, LaboratoryType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

// Mock GraphQL operations - these would need to be generated from the backend schema
interface UserQuery {
  user: UserType;
}

interface UserQueryVariables {
  uid: string;
}

interface UpdateUserMutation {
  updateUser: {
    __typename: "UserType" | "OperationError";
    uid?: string;
    firstName?: string;
    error?: string;
  };
}

interface UpdateUserMutationVariables {
  uid: string;
  payload: Partial<UserType>;
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

interface UserPermissionsQuery {
  userPermissions: {
    uid: string;
    laboratoryUid?: string;
    permissions: string[];
  }[];
}

interface UserPermissionsQueryVariables {
  userUid: string;
}

const GetUserDocument = `
  query GetUser($uid: String!) {
    user(uid: $uid) {
      uid
      firstName
      lastName
      email
      userName
      isActive
      isBlocked
      activeLaboratoryUid
      groups {
        uid
        name
        permissions {
          uid
          action
          target
        }
      }
      laboratories {
        uid
        name
        code
        organizationUid
        email
      }
      createdAt
      updatedAt
    }
  }
`;

const UpdateUserDocument = `
  mutation UpdateUser($uid: String!, $payload: UserInputType!) {
    updateUser(uid: $uid, payload: $payload) {
      ... on UserType {
        uid
        firstName
        lastName
        email
        userName
        isActive
        isBlocked
        activeLaboratoryUid
        updatedAt
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
        laboratories {
          uid
          name
          code
        }
        activeLaboratoryUid
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const GetUserPermissionsDocument = `
  query GetUserPermissions($userUid: String!) {
    userPermissions(userUid: $userUid) {
      uid
      laboratoryUid
      permissions
    }
  }
`;

const { toastSuccess, toastError } = useNotifyToast();
const { withClientQuery, withClientMutation } = useApiUtil();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// Fetch required data
userStore.fetchGroupsAndPermissions();
const groups = computed(() => userStore.getGroups);

// Mock data - in real implementation, these would come from GraphQL queries
const allLaboratories = ref<LaboratoryType[]>([
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

// State
const user = ref<UserType | null>(null);
const userPermissions = ref<any[]>([]);
const loading = ref(false);
const saving = ref(false);
const isEditing = ref(false);

// Edit form
const editForm = reactive({
  firstName: "",
  lastName: "",
  email: "",
  userName: "",
  isActive: true,
  isBlocked: false,
});

// Laboratory assignment form
const labAssignForm = reactive({
  laboratoryUids: [] as string[],
  activeLaboratoryUid: "",
});

// Tabs
const activeTab = ref("overview");

// Computed
const userUid = computed(() => route.params.uid as string);

const getUserGroups = (user: UserType) => {
  return user.groups?.map(g => g.name).join(", ") || "No Groups";
};

const getLaboratoryName = (labUid: string) => {
  const lab = allLaboratories.value.find(l => l.uid === labUid);
  return lab?.name || "Unknown Laboratory";
};

const getActiveLaboratory = (user: UserType) => {
  if (!user.activeLaboratoryUid) return "None";
  const lab = user.laboratories?.find(l => l.uid === user.activeLaboratoryUid);
  return lab?.name || "Unknown";
};

const unassignedLaboratories = computed(() => {
  if (!user.value) return allLaboratories.value;
  const assignedUids = user.value.laboratories?.map(l => l.uid) || [];
  return allLaboratories.value.filter(lab => !assignedUids.includes(lab.uid));
});

// Methods
const fetchUser = async () => {
  if (!userUid.value) return;
  
  loading.value = true;
  
  try {
    const result = await withClientQuery<UserQuery, UserQueryVariables>(
      GetUserDocument,
      { uid: userUid.value }
    );

    user.value = result.user;
    
    // Populate edit form
    if (user.value) {
      Object.assign(editForm, {
        firstName: user.value.firstName || "",
        lastName: user.value.lastName || "",
        email: user.value.email || "",
        userName: user.value.userName || "",
        isActive: user.value.isActive ?? true,
        isBlocked: user.value.isBlocked ?? false,
      });

      // Populate lab assignment form
      labAssignForm.laboratoryUids = user.value.laboratories?.map(lab => lab.uid) || [];
      labAssignForm.activeLaboratoryUid = user.value.activeLaboratoryUid || "";
    }

    // Fetch user permissions
    await fetchUserPermissions();
  } catch (error) {
    console.error("Error fetching user:", error);
    toastError("Failed to fetch user details");
  } finally {
    loading.value = false;
  }
};

const fetchUserPermissions = async () => {
  if (!userUid.value) return;
  
  try {
    const result = await withClientQuery<UserPermissionsQuery, UserPermissionsQueryVariables>(
      GetUserPermissionsDocument,
      { userUid: userUid.value }
    );

    userPermissions.value = result.userPermissions;
  } catch (error) {
    console.error("Error fetching user permissions:", error);
  }
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  
  if (!isEditing.value && user.value) {
    // Reset form when canceling edit
    Object.assign(editForm, {
      firstName: user.value.firstName || "",
      lastName: user.value.lastName || "",
      email: user.value.email || "",
      userName: user.value.userName || "",
      isActive: user.value.isActive ?? true,
      isBlocked: user.value.isBlocked ?? false,
    });
  }
};

const saveUser = async () => {
  if (!user.value) return;
  
  saving.value = true;
  
  try {
    const result = await withClientMutation<UpdateUserMutation, UpdateUserMutationVariables>(
      UpdateUserDocument,
      {
        uid: user.value.uid,
        payload: editForm
      },
      "updateUser"
    );

    if (result.__typename === "UserType") {
      toastSuccess("User updated successfully");
      isEditing.value = false;
      fetchUser(); // Refresh data
    } else {
      toastError(result.error || "Failed to update user");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    toastError("Failed to update user");
  } finally {
    saving.value = false;
  }
};

const saveLabAssignments = async () => {
  if (!user.value) return;
  
  saving.value = true;
  
  try {
    const result = await withClientMutation<AssignUserToLaboratoriesMutation, AssignUserToLaboratoriesMutationVariables>(
      AssignUserToLaboratoriesDocument,
      {
        userUid: user.value.uid,
        laboratoryUids: labAssignForm.laboratoryUids,
        activeLaboratoryUid: labAssignForm.activeLaboratoryUid || undefined,
      },
      "assignUserToLaboratories"
    );

    if (result.__typename === "UserType") {
      toastSuccess("Laboratory assignments updated successfully");
      fetchUser(); // Refresh data
    } else {
      toastError(result.error || "Failed to update laboratory assignments");
    }
  } catch (error) {
    console.error("Error updating laboratory assignments:", error);
    toastError("Failed to update laboratory assignments");
  } finally {
    saving.value = false;
  }
};

const addLaboratory = (labUid: string) => {
  if (!labAssignForm.laboratoryUids.includes(labUid)) {
    labAssignForm.laboratoryUids.push(labUid);
    
    // Auto-set as active if it's the first lab
    if (labAssignForm.laboratoryUids.length === 1) {
      labAssignForm.activeLaboratoryUid = labUid;
    }
  }
};

const removeLaboratory = (labUid: string) => {
  const index = labAssignForm.laboratoryUids.indexOf(labUid);
  if (index > -1) {
    labAssignForm.laboratoryUids.splice(index, 1);
    
    // Reset active lab if it was the removed one
    if (labAssignForm.activeLaboratoryUid === labUid) {
      labAssignForm.activeLaboratoryUid = labAssignForm.laboratoryUids[0] || "";
    }
  }
};

const goBack = () => {
  router.push("/admin/users-conf");
};

// Lifecycle
onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button 
          @click="goBack"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <div>
          <h2 class="text-2xl font-semibold text-foreground">
            {{ user ? `${user.firstName} ${user.lastName}` : "User Details" }}
          </h2>
          <p class="text-sm text-muted-foreground">View and manage user information and laboratory access</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          v-if="!isEditing && activeTab === 'overview'"
          @click="toggleEdit"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          <i class="fas fa-edit mr-2"></i>
          Edit User
        </button>
        
        <div v-if="isEditing && activeTab === 'overview'" class="flex items-center space-x-2">
          <button
            @click="toggleEdit"
            :disabled="saving"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Cancel
          </button>
          
          <button
            @click="saveUser"
            :disabled="saving"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <span v-if="saving" class="mr-2">
              <i class="fas fa-spinner fa-spin"></i>
            </span>
            {{ saving ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </div>
    </div>

    <hr class="border-border" />

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="fas fa-spinner fa-spin text-2xl mb-4"></i>
        <p class="text-muted-foreground">Loading user details...</p>
      </div>
    </div>

    <!-- User Details -->
    <div v-else-if="user" class="space-y-6">
      <!-- Tabs -->
      <div class="flex space-x-1 border-b border-border">
        <button
          @click="activeTab = 'overview'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-t-md transition-colors',
            activeTab === 'overview'
              ? 'bg-background text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          ]"
        >
          Overview
        </button>
        <button
          @click="activeTab = 'laboratories'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-t-md transition-colors',
            activeTab === 'laboratories'
              ? 'bg-background text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          ]"
        >
          Laboratories
        </button>
        <button
          @click="activeTab = 'permissions'"
          :class="[
            'px-4 py-2 text-sm font-medium rounded-t-md transition-colors',
            activeTab === 'permissions'
              ? 'bg-background text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          ]"
        >
          Permissions
        </button>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="space-y-8">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-foreground">Basic Information</h3>
          
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">First Name</label>
              <input
                v-if="isEditing"
                v-model="editForm.firstName"
                type="text"
                required
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div v-else class="p-3 bg-muted/50 rounded-md">
                <span class="text-sm">{{ user.firstName || "-" }}</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Last Name</label>
              <input
                v-if="isEditing"
                v-model="editForm.lastName"
                type="text"
                required
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div v-else class="p-3 bg-muted/50 rounded-md">
                <span class="text-sm">{{ user.lastName || "-" }}</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Email Address</label>
              <input
                v-if="isEditing"
                v-model="editForm.email"
                type="email"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div v-else class="p-3 bg-muted/50 rounded-md">
                <span class="text-sm">{{ user.email || "-" }}</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Username</label>
              <div class="p-3 bg-muted/50 rounded-md">
                <span class="text-sm">{{ user.userName || "-" }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-foreground">User Status</h3>
          
          <div class="flex items-center space-x-6">
            <div v-if="isEditing" class="flex items-center space-x-6">
              <label class="flex items-center space-x-2">
                <input
                  v-model="editForm.isActive"
                  type="checkbox"
                  class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
                />
                <span class="text-sm font-medium text-foreground">Active User</span>
              </label>
              
              <label class="flex items-center space-x-2">
                <input
                  v-model="editForm.isBlocked"
                  type="checkbox"
                  class="h-4 w-4 text-destructive focus:ring-ring border-gray-300 rounded"
                />
                <span class="text-sm font-medium text-foreground">Blocked</span>
              </label>
            </div>
            
            <div v-else class="flex items-center space-x-4">
              <span :class="[
                'inline-flex items-center rounded-md px-3 py-1 text-sm font-medium',
                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ user.isActive ? 'Active' : 'Inactive' }}
              </span>
              
              <span v-if="user.isBlocked" class="inline-flex items-center rounded-md bg-red-100 text-red-800 px-3 py-1 text-sm font-medium">
                Blocked
              </span>
            </div>
          </div>
        </div>

        <!-- Groups and Roles -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-foreground">Groups and Roles</h3>
          
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Assigned Groups</label>
            <div class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ getUserGroups(user) }}</span>
            </div>
          </div>
        </div>

        <!-- Metadata -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-foreground">Metadata</h3>
          
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Created At</label>
              <div class="p-3 bg-muted/50 rounded-md">
                <span class="text-sm">{{ user.createdAt ? new Date(user.createdAt).toLocaleString() : "-" }}</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Last Updated</label>
              <div class="p-3 bg-muted/50 rounded-md">
                <span class="text-sm">{{ user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-" }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Laboratories Tab -->
      <div v-if="activeTab === 'laboratories'" class="space-y-6">
        <!-- Current Laboratory Assignments -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-foreground">Laboratory Assignments</h3>
            <button
              @click="saveLabAssignments"
              :disabled="saving"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <span v-if="saving" class="mr-2">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
              {{ saving ? "Saving..." : "Save Changes" }}
            </button>
          </div>
          
          <!-- Active Laboratory -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Default Active Laboratory</label>
            <select
              v-model="labAssignForm.activeLaboratoryUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select default laboratory...</option>
              <option v-for="labUid in labAssignForm.laboratoryUids" :key="labUid" :value="labUid">
                {{ getLaboratoryName(labUid) }}
              </option>
            </select>
          </div>

          <!-- Assigned Laboratories -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Assigned Laboratories</label>
            <div class="space-y-2">
              <div v-for="labUid in labAssignForm.laboratoryUids" :key="labUid" class="flex items-center justify-between p-3 border border-input rounded-md">
                <div class="flex items-center space-x-3">
                  <div class="w-3 h-3 rounded-full bg-primary"></div>
                  <div>
                    <div class="font-medium text-sm">{{ getLaboratoryName(labUid) }}</div>
                    <div class="text-xs text-muted-foreground">
                      {{ labUid === labAssignForm.activeLaboratoryUid ? "Active Laboratory" : "Access Granted" }}
                    </div>
                  </div>
                </div>
                <button
                  @click="removeLaboratory(labUid)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive hover:text-destructive-foreground h-8 w-8"
                  title="Remove Access"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <div v-if="labAssignForm.laboratoryUids.length === 0" class="p-8 text-center text-muted-foreground">
                <i class="fas fa-building mb-2 block text-2xl"></i>
                No laboratories assigned
              </div>
            </div>
          </div>
        </div>

        <!-- Available Laboratories -->
        <div v-if="unassignedLaboratories.length > 0" class="space-y-4">
          <h3 class="text-lg font-medium text-foreground">Available Laboratories</h3>
          
          <div class="space-y-2">
            <div v-for="lab in unassignedLaboratories" :key="lab.uid" class="flex items-center justify-between p-3 border border-input rounded-md">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full bg-muted-foreground"></div>
                <div>
                  <div class="font-medium text-sm">{{ lab.name }}</div>
                  <div class="text-xs text-muted-foreground">{{ lab.code }} - {{ lab.email }}</div>
                </div>
              </div>
              <button
                @click="addLaboratory(lab.uid)"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                title="Grant Access"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Permissions Tab -->
      <div v-if="activeTab === 'permissions'" class="space-y-6">
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-foreground">User Permissions</h3>
          
          <div class="space-y-4">
            <!-- Global Permissions -->
            <div class="space-y-2">
              <h4 class="font-medium text-foreground">Global Permissions</h4>
              <div class="p-4 border border-input rounded-md">
                <div v-if="user.groups && user.groups.length > 0" class="space-y-3">
                  <div v-for="group in user.groups" :key="group.uid" class="space-y-2">
                    <div class="font-medium text-sm">{{ group.name }}</div>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="permission in group.permissions" :key="permission.uid" class="inline-flex items-center rounded-md bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium">
                        {{ permission.action }}:{{ permission.target }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-sm text-muted-foreground">
                  No global permissions assigned
                </div>
              </div>
            </div>

            <!-- Laboratory-Specific Permissions -->
            <div class="space-y-2">
              <h4 class="font-medium text-foreground">Laboratory-Specific Permissions</h4>
              <div class="p-4 border border-input rounded-md">
                <div v-if="userPermissions.length > 0" class="space-y-3">
                  <div v-for="labPerm in userPermissions" :key="`${labPerm.uid}-${labPerm.laboratoryUid}`" class="space-y-2">
                    <div class="font-medium text-sm">
                      {{ labPerm.laboratoryUid ? getLaboratoryName(labPerm.laboratoryUid) : "Global" }}
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="permission in labPerm.permissions" :key="permission" class="inline-flex items-center rounded-md bg-green-100 text-green-800 px-2 py-1 text-xs font-medium">
                        {{ permission }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else class="text-sm text-muted-foreground">
                  No laboratory-specific permissions assigned
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-2xl mb-4 text-destructive"></i>
        <p class="text-muted-foreground">User not found</p>
      </div>
    </div>
  </div>
</template>