<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UserType, LaboratoryType, GroupType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

// Mock GraphQL operations - these would need to be generated from the backend schema
interface LaboratoryUsersQuery {
  laboratoryUsers: {
    laboratory: LaboratoryType;
    users: UserType[];
    totalCount: number;
  };
}

interface LaboratoryUsersQueryVariables {
  laboratoryUid: string;
}

interface AssignUsersToLaboratoryMutation {
  assignUsersToLaboratory: {
    __typename: "OperationSuccess" | "OperationError";
    success?: boolean;
    error?: string;
  };
}

interface AssignUsersToLaboratoryMutationVariables {
  laboratoryUid: string;
  userUids: string[];
}

interface RemoveUserFromLaboratoryMutation {
  removeUserFromLaboratory: {
    __typename: "OperationSuccess" | "OperationError";
    success?: boolean;
    error?: string;
  };
}

interface RemoveUserFromLaboratoryMutationVariables {
  laboratoryUid: string;
  userUid: string;
}

interface UpdateUserRoleInLaboratoryMutation {
  updateUserRoleInLaboratory: {
    __typename: "OperationSuccess" | "OperationError";
    success?: boolean;
    error?: string;
  };
}

interface UpdateUserRoleInLaboratoryMutationVariables {
  laboratoryUid: string;
  userUid: string;
  groupUid: string;
}

const LaboratoryUsersDocument = `
  query LaboratoryUsers($laboratoryUid: String!) {
    laboratoryUsers(laboratoryUid: $laboratoryUid) {
      laboratory {
        uid
        name
        code
        organizationUid
        email
      }
      users {
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
        }
        createdAt
      }
      totalCount
    }
  }
`;

const AssignUsersToLaboratoryDocument = `
  mutation AssignUsersToLaboratory($laboratoryUid: String!, $userUids: [String!]!) {
    assignUsersToLaboratory(laboratoryUid: $laboratoryUid, userUids: $userUids) {
      ... on OperationSuccess {
        success
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const RemoveUserFromLaboratoryDocument = `
  mutation RemoveUserFromLaboratory($laboratoryUid: String!, $userUid: String!) {
    removeUserFromLaboratory(laboratoryUid: $laboratoryUid, userUid: $userUid) {
      ... on OperationSuccess {
        success
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const UpdateUserRoleInLaboratoryDocument = `
  mutation UpdateUserRoleInLaboratory($laboratoryUid: String!, $userUid: String!, $groupUid: String!) {
    updateUserRoleInLaboratory(laboratoryUid: $laboratoryUid, userUid: $userUid, groupUid: $groupUid) {
      ... on OperationSuccess {
        success
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const { toastSuccess, toastError } = useNotifyToast();
const { withClientQuery, withClientMutation } = useApiUtil();
const router = useRouter();
const userStore = useUserStore();

// Fetch required data
userStore.fetchUsers({});
userStore.fetchGroupsAndPermissions();
const allUsers = computed(() => userStore.getUsers);
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

// State
const selectedLaboratory = ref("");
const currentLaboratory = ref<LaboratoryType | null>(null);
const laboratoryUsers = ref<UserType[]>([]);
const loading = ref(false);
const saving = ref(false);

// Modal states
const showAddUsersModal = ref(false);
const showRemoveUserModal = ref(false);
const removingUser = ref<UserType | null>(null);

// Add users form
const addUsersForm = reactive({
  selectedUserUids: [] as string[],
});

// Search
const searchText = ref("");

// Computed
const filteredLaboratoryUsers = computed(() => {
  if (!searchText.value) return laboratoryUsers.value;
  
  const search = searchText.value.toLowerCase();
  return laboratoryUsers.value.filter(user =>
    user.firstName?.toLowerCase().includes(search) ||
    user.lastName?.toLowerCase().includes(search) ||
    user.email?.toLowerCase().includes(search) ||
    user.userName?.toLowerCase().includes(search)
  );
});

const availableUsers = computed(() => {
  const assignedUserUids = laboratoryUsers.value.map(u => u.uid);
  return allUsers.value.filter(user => 
    !assignedUserUids.includes(user.uid) &&
    user.isActive &&
    !user.isBlocked
  );
});

const filteredAvailableUsers = computed(() => {
  if (!searchText.value) return availableUsers.value;
  
  const search = searchText.value.toLowerCase();
  return availableUsers.value.filter(user =>
    user.firstName?.toLowerCase().includes(search) ||
    user.lastName?.toLowerCase().includes(search) ||
    user.email?.toLowerCase().includes(search) ||
    user.userName?.toLowerCase().includes(search)
  );
});

// Methods
const loadLaboratoryUsers = async () => {
  if (!selectedLaboratory.value) {
    currentLaboratory.value = null;
    laboratoryUsers.value = [];
    return;
  }

  loading.value = true;
  
  try {
    const result = await withClientQuery<LaboratoryUsersQuery, LaboratoryUsersQueryVariables>(
      LaboratoryUsersDocument,
      { laboratoryUid: selectedLaboratory.value }
    );

    currentLaboratory.value = result.laboratoryUsers.laboratory;
    laboratoryUsers.value = result.laboratoryUsers.users;
  } catch (error) {
    console.error("Error loading laboratory users:", error);
    toastError("Failed to load laboratory users");
  } finally {
    loading.value = false;
  }
};

const openAddUsersModal = () => {
  addUsersForm.selectedUserUids = [];
  showAddUsersModal.value = true;
};

const closeAddUsersModal = () => {
  showAddUsersModal.value = false;
  addUsersForm.selectedUserUids = [];
};

const addUsersToLaboratory = async () => {
  if (!selectedLaboratory.value || addUsersForm.selectedUserUids.length === 0) {
    return;
  }

  saving.value = true;
  
  try {
    const result = await withClientMutation<AssignUsersToLaboratoryMutation, AssignUsersToLaboratoryMutationVariables>(
      AssignUsersToLaboratoryDocument,
      {
        laboratoryUid: selectedLaboratory.value,
        userUids: addUsersForm.selectedUserUids,
      },
      "assignUsersToLaboratory"
    );

    if (result.__typename === "OperationSuccess") {
      toastSuccess(`${addUsersForm.selectedUserUids.length} user(s) added to laboratory`);
      closeAddUsersModal();
      loadLaboratoryUsers();
    } else {
      toastError(result.error || "Failed to add users to laboratory");
    }
  } catch (error) {
    console.error("Error adding users to laboratory:", error);
    toastError("Failed to add users to laboratory");
  } finally {
    saving.value = false;
  }
};

const openRemoveUserModal = (user: UserType) => {
  removingUser.value = user;
  showRemoveUserModal.value = true;
};

const closeRemoveUserModal = () => {
  removingUser.value = null;
  showRemoveUserModal.value = false;
};

const removeUserFromLaboratory = async () => {
  if (!selectedLaboratory.value || !removingUser.value) {
    return;
  }

  saving.value = true;
  
  try {
    const result = await withClientMutation<RemoveUserFromLaboratoryMutation, RemoveUserFromLaboratoryMutationVariables>(
      RemoveUserFromLaboratoryDocument,
      {
        laboratoryUid: selectedLaboratory.value,
        userUid: removingUser.value.uid,
      },
      "removeUserFromLaboratory"
    );

    if (result.__typename === "OperationSuccess") {
      toastSuccess("User removed from laboratory");
      closeRemoveUserModal();
      loadLaboratoryUsers();
    } else {
      toastError(result.error || "Failed to remove user from laboratory");
    }
  } catch (error) {
    console.error("Error removing user from laboratory:", error);
    toastError("Failed to remove user from laboratory");
  } finally {
    saving.value = false;
  }
};

const updateUserRole = async (user: UserType, groupUid: string) => {
  if (!selectedLaboratory.value) return;

  saving.value = true;
  
  try {
    const result = await withClientMutation<UpdateUserRoleInLaboratoryMutation, UpdateUserRoleInLaboratoryMutationVariables>(
      UpdateUserRoleInLaboratoryDocument,
      {
        laboratoryUid: selectedLaboratory.value,
        userUid: user.uid,
        groupUid: groupUid,
      },
      "updateUserRoleInLaboratory"
    );

    if (result.__typename === "OperationSuccess") {
      toastSuccess("User role updated");
      loadLaboratoryUsers();
    } else {
      toastError(result.error || "Failed to update user role");
    }
  } catch (error) {
    console.error("Error updating user role:", error);
    toastError("Failed to update user role");
  } finally {
    saving.value = false;
  }
};

const getUserGroups = (user: UserType) => {
  return user.groups?.map(g => g.name).join(", ") || "No Groups";
};

const getUserPrimaryGroup = (user: UserType) => {
  return user.groups?.[0]?.uid || "";
};

const goBack = () => {
  router.push("/admin/users-conf");
};

// Lifecycle
onMounted(() => {
  // Auto-select first laboratory if available
  if (laboratories.value.length > 0) {
    selectedLaboratory.value = laboratories.value[0].uid;
    loadLaboratoryUsers();
  }
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
          <h2 class="text-2xl font-semibold text-foreground">Laboratory Users Management</h2>
          <p class="text-sm text-muted-foreground">Manage user assignments and roles for laboratories</p>
        </div>
      </div>
    </div>

    <!-- Laboratory Selector -->
    <div class="space-y-4">
      <div class="flex items-center space-x-4">
        <div class="flex-1 max-w-md">
          <label class="text-sm font-medium text-foreground mb-2 block">Select Laboratory</label>
          <select
            v-model="selectedLaboratory"
            @change="loadLaboratoryUsers"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a laboratory...</option>
            <option v-for="lab in laboratories" :key="lab.uid" :value="lab.uid">
              {{ lab.name }} ({{ lab.code }})
            </option>
          </select>
        </div>
        
        <div class="flex-1 max-w-md">
          <label class="text-sm font-medium text-foreground mb-2 block">Search Users</label>
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            <input
              v-model="searchText"
              type="text"
              placeholder="Search by name, email, or username..."
              class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Laboratory Info -->
    <div v-if="currentLaboratory" class="bg-card rounded-lg border p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-foreground">{{ currentLaboratory.name }}</h3>
          <div class="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
            <span>Code: {{ currentLaboratory.code }}</span>
            <span>•</span>
            <span>Email: {{ currentLaboratory.email }}</span>
            <span>•</span>
            <span>{{ laboratoryUsers.length }} users assigned</span>
          </div>
        </div>
        
        <button
          @click="openAddUsersModal"
          :disabled="availableUsers.length === 0"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <i class="fas fa-plus mr-2"></i>
          Add Users
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div v-if="selectedLaboratory" class="rounded-md border border-border">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-border bg-muted/50">
            <tr>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role in Lab</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Active Lab</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="loading">
              <td colspan="6" class="p-8 text-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Loading users...
              </td>
            </tr>
            
            <tr v-else-if="filteredLaboratoryUsers.length === 0">
              <td colspan="6" class="p-8 text-center text-muted-foreground">
                <i class="fas fa-users mb-2 block text-2xl"></i>
                {{ laboratoryUsers.length === 0 ? "No users assigned to this laboratory" : "No users match your search" }}
              </td>
            </tr>
            
            <tr v-else v-for="user in filteredLaboratoryUsers" :key="user.uid" class="hover:bg-muted/50">
              <td class="p-4 align-middle">
                <div>
                  <div class="font-medium">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="text-sm text-muted-foreground">@{{ user.userName }}</div>
                </div>
              </td>
              
              <td class="p-4 align-middle">
                <div class="text-sm">{{ user.email }}</div>
              </td>
              
              <td class="p-4 align-middle">
                <div class="flex flex-col space-y-1">
                  <span :class="[
                    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                  <span v-if="user.isBlocked" class="inline-flex items-center rounded-md bg-red-100 text-red-800 px-2 py-1 text-xs font-medium">
                    Blocked
                  </span>
                </div>
              </td>
              
              <td class="p-4 align-middle">
                <select
                  :value="getUserPrimaryGroup(user)"
                  @change="updateUserRole(user, ($event.target as HTMLSelectElement).value)"
                  :disabled="saving"
                  class="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Role...</option>
                  <option v-for="group in groups" :key="group.uid" :value="group.uid">
                    {{ group.name }}
                  </option>
                </select>
              </td>
              
              <td class="p-4 align-middle">
                <div class="text-sm">
                  <span v-if="user.activeLaboratoryUid === selectedLaboratory" class="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-1 text-xs font-medium">
                    <i class="fas fa-star mr-1"></i>
                    Active
                  </span>
                  <span v-else class="text-muted-foreground">-</span>
                </div>
              </td>
              
              <td class="p-4 align-middle">
                <div class="flex items-center space-x-2">
                  <button
                    @click="$router.push(`/admin/user/${user.uid}`)"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  
                  <button
                    @click="openRemoveUserModal(user)"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive hover:text-destructive-foreground h-8 w-8"
                    title="Remove from Laboratory"
                  >
                    <i class="fas fa-user-minus"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="fas fa-building text-4xl mb-4 text-muted-foreground"></i>
        <p class="text-muted-foreground">Select a laboratory to manage its users</p>
      </div>
    </div>
  </div>

  <!-- Add Users Modal -->
  <div v-if="showAddUsersModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Add Users to Laboratory</h3>
        <p class="text-sm text-muted-foreground">
          Select users to add to {{ currentLaboratory?.name }}
        </p>
      </div>
      
      <div class="space-y-4">
        <!-- Search Available Users -->
        <div class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
          <input
            v-model="searchText"
            type="text"
            placeholder="Search available users..."
            class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <!-- Available Users List -->
        <div class="border border-input rounded-md p-3 space-y-2 max-h-64 overflow-y-auto">
          <div v-for="user in filteredAvailableUsers" :key="user.uid" class="flex items-center space-x-3">
            <input
              :id="`add-user-${user.uid}`"
              v-model="addUsersForm.selectedUserUids"
              :value="user.uid"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
            />
            <label :for="`add-user-${user.uid}`" class="flex-1 cursor-pointer">
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-sm">{{ user.firstName }} {{ user.lastName }}</div>
                  <div class="text-xs text-muted-foreground">{{ user.email }} - @{{ user.userName }}</div>
                </div>
                <div class="text-xs text-muted-foreground">{{ getUserGroups(user) }}</div>
              </div>
            </label>
          </div>
          
          <div v-if="filteredAvailableUsers.length === 0" class="p-4 text-center text-muted-foreground">
            No available users found
          </div>
        </div>

        <div class="text-sm text-muted-foreground">
          {{ addUsersForm.selectedUserUids.length }} user(s) selected
        </div>
      </div>
      
      <div class="flex justify-end space-x-2 pt-4">
        <button
          @click="closeAddUsersModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancel
        </button>
        
        <button
          @click="addUsersToLaboratory"
          :disabled="addUsersForm.selectedUserUids.length === 0 || saving"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {{ saving ? "Adding..." : `Add ${addUsersForm.selectedUserUids.length} User(s)` }}
        </button>
      </div>
    </div>
  </div>

  <!-- Remove User Confirmation Modal -->
  <div v-if="showRemoveUserModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Remove User from Laboratory</h3>
        <p class="text-sm text-muted-foreground">
          Are you sure you want to remove "{{ removingUser?.firstName }} {{ removingUser?.lastName }}" from {{ currentLaboratory?.name }}?
        </p>
      </div>
      
      <div class="flex justify-end space-x-2 pt-4">
        <button
          @click="closeRemoveUserModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancel
        </button>
        
        <button
          @click="removeUserFromLaboratory"
          :disabled="saving"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
        >
          {{ saving ? "Removing..." : "Remove User" }}
        </button>
      </div>
    </div>
  </div>
</template>