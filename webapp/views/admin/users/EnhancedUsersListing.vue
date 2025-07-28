<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UserType, GroupType, LaboratoryType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

// Mock GraphQL operations - these would need to be generated from the backend schema
interface UsersAllQuery {
  usersAll: {
    items: UserType[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

interface UsersAllQueryVariables {
  pageSize?: number;
  afterCursor?: string;
  beforeCursor?: string;
  text?: string;
  laboratoryUid?: string;
  groupUid?: string;
  isActive?: boolean;
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

const UsersAllDocument = `
  query UsersAll($pageSize: Int, $afterCursor: String, $beforeCursor: String, $text: String, $laboratoryUid: String, $groupUid: String, $isActive: Boolean) {
    usersAll(pageSize: $pageSize, afterCursor: $afterCursor, beforeCursor: $beforeCursor, text: $text, laboratoryUid: $laboratoryUid, groupUid: $groupUid, isActive: $isActive) {
      items {
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
        laboratories {
          uid
          name
          code
          organizationUid
        }
        createdAt
        updatedAt
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
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

const { toastSuccess, toastError } = useNotifyToast();
const { withClientQuery, withClientMutation } = useApiUtil();
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

// State
const users = ref<UserType[]>([]);
const loading = ref(false);
const totalCount = ref(0);
const pageSize = ref(20);
const currentPage = ref(1);

// Search and filters
const searchText = ref("");
const selectedLaboratory = ref("");
const selectedGroup = ref("");
const selectedStatus = ref("");

// Modal state
const editingUser = ref<UserType | null>(null);
const showEditModal = ref(false);
const showLabAssignModal = ref(false);
const assigningUser = ref<UserType | null>(null);

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

// Computed
const filteredUsers = computed(() => {
  let filtered = [...users.value];
  
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    filtered = filtered.filter(user => 
      user.firstName?.toLowerCase().includes(search) ||
      user.lastName?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.userName?.toLowerCase().includes(search)
    );
  }
  
  return filtered;
});

const hasNextPage = ref(false);
const hasPreviousPage = ref(false);

// Methods
const fetchUsers = async () => {
  loading.value = true;
  
  try {
    const variables: UsersAllQueryVariables = {
      pageSize: pageSize.value,
      text: searchText.value || undefined,
      laboratoryUid: selectedLaboratory.value || undefined,
      groupUid: selectedGroup.value || undefined,
      isActive: selectedStatus.value ? selectedStatus.value === 'active' : undefined,
    };

    const result = await withClientQuery<UsersAllQuery, UsersAllQueryVariables>(
      UsersAllDocument,
      variables
    );

    users.value = result.usersAll.items;
    totalCount.value = result.usersAll.totalCount;
    hasNextPage.value = result.usersAll.pageInfo.hasNextPage;
    hasPreviousPage.value = result.usersAll.pageInfo.hasPreviousPage;
  } catch (error) {
    console.error("Error fetching users:", error);
    toastError("Failed to fetch users");
  } finally {
    loading.value = false;
  }
};

const searchUsers = () => {
  currentPage.value = 1;
  fetchUsers();
};

const openEditModal = (user: UserType) => {
  editingUser.value = user;
  Object.assign(editForm, {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    userName: user.userName || "",
    isActive: user.isActive ?? true,
    isBlocked: user.isBlocked ?? false,
  });
  showEditModal.value = true;
};

const closeEditModal = () => {
  editingUser.value = null;
  showEditModal.value = false;
  Object.assign(editForm, {
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    isActive: true,
    isBlocked: false,
  });
};

const saveEditUser = async () => {
  if (!editingUser.value) return;
  
  loading.value = true;
  
  try {
    const result = await withClientMutation<UpdateUserMutation, UpdateUserMutationVariables>(
      UpdateUserDocument,
      {
        uid: editingUser.value.uid,
        payload: editForm
      },
      "updateUser"
    );

    if (result.__typename === "UserType") {
      toastSuccess("User updated successfully");
      closeEditModal();
      fetchUsers();
    } else {
      toastError(result.error || "Failed to update user");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    toastError("Failed to update user");
  } finally {
    loading.value = false;
  }
};

const openLabAssignModal = (user: UserType) => {
  assigningUser.value = user;
  labAssignForm.laboratoryUids = user.laboratories?.map(lab => lab.uid) || [];
  labAssignForm.activeLaboratoryUid = user.activeLaboratoryUid || "";
  showLabAssignModal.value = true;
};

const closeLabAssignModal = () => {
  assigningUser.value = null;
  showLabAssignModal.value = false;
  labAssignForm.laboratoryUids = [];
  labAssignForm.activeLaboratoryUid = "";
};

const saveLabAssignment = async () => {
  if (!assigningUser.value) return;
  
  loading.value = true;
  
  try {
    const result = await withClientMutation<AssignUserToLaboratoriesMutation, AssignUserToLaboratoriesMutationVariables>(
      AssignUserToLaboratoriesDocument,
      {
        userUid: assigningUser.value.uid,
        laboratoryUids: labAssignForm.laboratoryUids,
        activeLaboratoryUid: labAssignForm.activeLaboratoryUid || undefined,
      },
      "assignUserToLaboratories"
    );

    if (result.__typename === "UserType") {
      toastSuccess("Laboratory assignments updated successfully");
      closeLabAssignModal();
      fetchUsers();
    } else {
      toastError(result.error || "Failed to update laboratory assignments");
    }
  } catch (error) {
    console.error("Error updating laboratory assignments:", error);
    toastError("Failed to update laboratory assignments");
  } finally {
    loading.value = false;
  }
};

const navigateToRegistration = () => {
  router.push("/admin/user-registration");
};

const viewUserDetails = (user: UserType) => {
  router.push(`/admin/user/${user.uid}`);
};

const getUserGroups = (user: UserType) => {
  return user.groups?.map(g => g.name).join(", ") || "No Groups";
};

const getUserLaboratories = (user: UserType) => {
  if (!user.laboratories || user.laboratories.length === 0) {
    return "No Labs";
  }
  
  const labNames = user.laboratories.map(lab => lab.code || lab.name);
  if (labNames.length > 2) {
    return `${labNames.slice(0, 2).join(", ")} +${labNames.length - 2}`;
  }
  return labNames.join(", ");
};

const getLaboratoryName = (labUid: string) => {
  const lab = laboratories.value.find(l => l.uid === labUid);
  return lab?.name || "Unknown Laboratory";
};

const getActiveLaboratory = (user: UserType) => {
  if (!user.activeLaboratoryUid) return "None";
  const lab = user.laboratories?.find(l => l.uid === user.activeLaboratoryUid);
  return lab?.code || lab?.name || "Unknown";
};

// Lifecycle
onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-foreground">User Management</h2>
        <p class="text-sm text-muted-foreground">Manage users and their laboratory assignments</p>
      </div>
      <button 
        @click="navigateToRegistration"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        <i class="fas fa-plus mr-2"></i>
        Register New User
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="flex items-center space-x-4">
      <div class="flex-1">
        <div class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
          <input
            v-model="searchText"
            @input="searchUsers"
            type="text"
            placeholder="Search users by name, email, or username..."
            class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
      
      <div class="w-48">
        <select
          v-model="selectedLaboratory"
          @change="searchUsers"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All Laboratories</option>
          <option v-for="lab in laboratories" :key="lab.uid" :value="lab.uid">
            {{ lab.name }}
          </option>
        </select>
      </div>
      
      <div class="w-48">
        <select
          v-model="selectedGroup"
          @change="searchUsers"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All Groups</option>
          <option v-for="group in groups" :key="group.uid" :value="group.uid">
            {{ group.name }}
          </option>
        </select>
      </div>
      
      <div class="w-32">
        <select
          v-model="selectedStatus"
          @change="searchUsers"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      
      <button
        @click="fetchUsers"
        :disabled="loading"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        <i class="fas fa-sync-alt mr-2" :class="{ 'fa-spin': loading }"></i>
        Refresh
      </button>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">Total Users</h3>
          <i class="fas fa-users text-muted-foreground"></i>
        </div>
        <div class="text-2xl font-bold">{{ totalCount }}</div>
      </div>
      
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">Active Users</h3>
          <i class="fas fa-user-check text-green-500"></i>
        </div>
        <div class="text-2xl font-bold">{{ filteredUsers.filter(u => u.isActive).length }}</div>
      </div>
      
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">Multi-Lab Users</h3>
          <i class="fas fa-building text-blue-500"></i>
        </div>
        <div class="text-2xl font-bold">{{ filteredUsers.filter(u => u.laboratories && u.laboratories.length > 1).length }}</div>
      </div>
      
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">Blocked Users</h3>
          <i class="fas fa-user-lock text-red-500"></i>
        </div>
        <div class="text-2xl font-bold">{{ filteredUsers.filter(u => u.isBlocked).length }}</div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="rounded-md border border-border">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-border bg-muted/50">
            <tr>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Groups</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Laboratories</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Active Lab</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="loading">
              <td colspan="7" class="p-8 text-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Loading users...
              </td>
            </tr>
            
            <tr v-else-if="filteredUsers.length === 0">
              <td colspan="7" class="p-8 text-center text-muted-foreground">
                <i class="fas fa-users mb-2 block text-2xl"></i>
                No users found
              </td>
            </tr>
            
            <tr v-else v-for="user in filteredUsers" :key="user.uid" class="hover:bg-muted/50">
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
                <div class="text-sm">{{ getUserGroups(user) }}</div>
              </td>
              
              <td class="p-4 align-middle">
                <div class="text-sm">{{ getUserLaboratories(user) }}</div>
              </td>
              
              <td class="p-4 align-middle">
                <div class="text-sm">{{ getActiveLaboratory(user) }}</div>
              </td>
              
              <td class="p-4 align-middle">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewUserDetails(user)"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  
                  <button
                    @click="openEditModal(user)"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    title="Edit User"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  
                  <button
                    @click="openLabAssignModal(user)"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    title="Manage Laboratories"
                  >
                    <i class="fas fa-building"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalCount > pageSize" class="flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        Showing {{ Math.min(pageSize, filteredUsers.length) }} of {{ totalCount }} users
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          :disabled="!hasPreviousPage || loading"
          @click="currentPage--; fetchUsers()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <span class="text-sm">Page {{ currentPage }}</span>
        
        <button
          :disabled="!hasNextPage || loading"
          @click="currentPage++; fetchUsers()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Edit User Modal -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Edit User</h3>
        <p class="text-sm text-muted-foreground">Update user information</p>
      </div>
      
      <form @submit.prevent="saveEditUser" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">First Name</label>
            <input
              v-model="editForm.firstName"
              type="text"
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Last Name</label>
            <input
              v-model="editForm.lastName"
              type="text"
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Email</label>
          <input
            v-model="editForm.email"
            type="email"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2">
            <input
              v-model="editForm.isActive"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
            />
            <span class="text-sm font-medium text-foreground">Active</span>
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
        
        <div class="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            @click="closeEditModal"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {{ loading ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Laboratory Assignment Modal -->
  <div v-if="showLabAssignModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Manage Laboratory Access</h3>
        <p class="text-sm text-muted-foreground">
          Assign laboratories to {{ assigningUser?.firstName }} {{ assigningUser?.lastName }}
        </p>
      </div>
      
      <form @submit.prevent="saveLabAssignment" class="space-y-4">
        <!-- Laboratory Multi-Select -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Assigned Laboratories</label>
          <div class="border border-input rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
            <div v-for="lab in laboratories" :key="lab.uid" class="flex items-center space-x-3">
              <input
                :id="`edit-lab-${lab.uid}`"
                v-model="labAssignForm.laboratoryUids"
                :value="lab.uid"
                type="checkbox"
                class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
              />
              <label :for="`edit-lab-${lab.uid}`" class="flex-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-sm">{{ lab.name }}</div>
                    <div class="text-xs text-muted-foreground">{{ lab.code }}</div>
                  </div>
                  <div class="text-xs text-muted-foreground">{{ lab.email }}</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Active Laboratory Selection -->
        <div v-if="labAssignForm.laboratoryUids.length > 0" class="space-y-2">
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
        
        <div class="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            @click="closeLabAssignModal"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {{ loading ? "Saving..." : "Save Assignments" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>