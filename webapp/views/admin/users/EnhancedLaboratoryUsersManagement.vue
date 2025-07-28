<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UserType, LaboratoryType, GroupType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

// Enhanced GraphQL operations for advanced management
interface LaboratoryUserAnalyticsQuery {
  laboratoryUserAnalytics: {
    laboratory: LaboratoryType;
    totalUsers: number;
    activeUsers: number;
    recentlyAddedUsers: number;
    usersByRole: { role: string; count: number }[];
    userAccessMatrix: {
      userId: string;
      userName: string;
      roles: string[];
      permissions: string[];
      lastActive: string;
    }[];
  };
}

interface BulkAssignUsersToLaboratoryMutation {
  bulkAssignUsersToLaboratory: {
    __typename: "BulkOperationResult" | "OperationError";
    successCount?: number;
    failureCount?: number;
    failures?: string[];
    error?: string;
  };
}

interface TransferUserBetweenLaboratoriesMutation {
  transferUserBetweenLaboratories: {
    __typename: "OperationSuccess" | "OperationError";
    success?: boolean;
    error?: string;
  };
}

interface UpdateUserRoleMatrixMutation {
  updateUserRoleMatrix: {
    __typename: "OperationSuccess" | "OperationError";
    success?: boolean;
    error?: string;
  };
}

interface CloneUserPermissionsMutation {
  cloneUserPermissions: {
    __typename: "OperationSuccess" | "OperationError";
    success?: boolean;
    error?: string;
  };
}

const LaboratoryUserAnalyticsDocument = `
  query LaboratoryUserAnalytics($laboratoryUid: String!) {
    laboratoryUserAnalytics(laboratoryUid: $laboratoryUid) {
      laboratory {
        uid
        name
        code
        organizationUid
        email
      }
      totalUsers
      activeUsers
      recentlyAddedUsers
      usersByRole {
        role
        count
      }
      userAccessMatrix {
        userId
        userName
        roles
        permissions
        lastActive
      }
    }
  }
`;

const BulkAssignUsersToLaboratoryDocument = `
  mutation BulkAssignUsersToLaboratory($laboratoryUid: String!, $userAssignments: [UserLabAssignmentInput!]!) {
    bulkAssignUsersToLaboratory(laboratoryUid: $laboratoryUid, userAssignments: $userAssignments) {
      ... on BulkOperationResult {
        successCount
        failureCount
        failures
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const TransferUserBetweenLaboratoriesDocument = `
  mutation TransferUserBetweenLaboratories($userUid: String!, $fromLaboratoryUid: String!, $toLaboratoryUid: String!, $preserveRoles: Boolean) {
    transferUserBetweenLaboratories(userUid: $userUid, fromLaboratoryUid: $fromLaboratoryUid, toLaboratoryUid: $toLaboratoryUid, preserveRoles: $preserveRoles) {
      ... on OperationSuccess {
        success
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const UpdateUserRoleMatrixDocument = `
  mutation UpdateUserRoleMatrix($laboratoryUid: String!, $userRoleUpdates: [UserRoleUpdateInput!]!) {
    updateUserRoleMatrix(laboratoryUid: $laboratoryUid, userRoleUpdates: $userRoleUpdates) {
      ... on OperationSuccess {
        success
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const CloneUserPermissionsDocument = `
  mutation CloneUserPermissions($fromUserUid: String!, $toUserUids: [String!]!, $laboratoryUid: String!) {
    cloneUserPermissions(fromUserUid: $fromUserUid, toUserUids: $toUserUids, laboratoryUid: $laboratoryUid) {
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
  { 
    uid: "lab3", 
    name: "Research Laboratory", 
    organizationUid: "org1",
    code: "RESEARCH",
    email: "research@lab.com"
  },
]);

// State
const selectedLaboratory = ref("");
const currentLaboratory = ref<LaboratoryType | null>(null);
const laboratoryAnalytics = ref<any>(null);
const loading = ref(false);
const saving = ref(false);

// View modes
const viewMode = ref<"dashboard" | "bulk-assign" | "transfer" | "role-matrix" | "analytics">("dashboard");

// Modal states
const showBulkAssignModal = ref(false);
const showTransferModal = ref(false);
const showRoleMatrixModal = ref(false);
const showClonePermissionsModal = ref(false);

// Bulk assignment state
const bulkAssignForm = reactive({
  selectedUserUids: [] as string[],
  defaultRole: "",
  setAsActive: false,
  sendNotification: true,
});

// Transfer state
const transferForm = reactive({
  userUid: "",
  fromLaboratoryUid: "",
  toLaboratoryUid: "",
  preserveRoles: true,
});

// Role matrix state
const roleMatrixUsers = ref<any[]>([]);
const pendingRoleChanges = ref<Map<string, string>>(new Map());

// Clone permissions state
const clonePermissionsForm = reactive({
  sourceUserUid: "",
  targetUserUids: [] as string[],
});

// Search and filters
const searchText = ref("");
const roleFilter = ref("");
const statusFilter = ref("");

// Computed
const availableUsers = computed(() => {
  if (!laboratoryAnalytics.value) return [];
  
  const assignedUserIds = laboratoryAnalytics.value.userAccessMatrix?.map((u: any) => u.userId) || [];
  return allUsers.value.filter(user => 
    !assignedUserIds.includes(user.uid) &&
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

const filteredLaboratoryUsers = computed(() => {
  if (!laboratoryAnalytics.value?.userAccessMatrix) return [];
  
  let filtered = [...laboratoryAnalytics.value.userAccessMatrix];
  
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    filtered = filtered.filter((user: any) =>
      user.userName?.toLowerCase().includes(search)
    );
  }
  
  if (roleFilter.value) {
    filtered = filtered.filter((user: any) =>
      user.roles?.includes(roleFilter.value)
    );
  }
  
  return filtered;
});

const transferableUsers = computed(() => {
  return laboratoryAnalytics.value?.userAccessMatrix || [];
});

// Methods
const loadLaboratoryAnalytics = async () => {
  if (!selectedLaboratory.value) {
    currentLaboratory.value = null;
    laboratoryAnalytics.value = null;
    return;
  }

  loading.value = true;
  
  try {
    const result = await withClientQuery<LaboratoryUserAnalyticsQuery, { laboratoryUid: string }>(
      LaboratoryUserAnalyticsDocument,
      { laboratoryUid: selectedLaboratory.value }
    );

    currentLaboratory.value = result.laboratoryUserAnalytics.laboratory;
    laboratoryAnalytics.value = result.laboratoryUserAnalytics;
    
    // Initialize role matrix
    roleMatrixUsers.value = result.laboratoryUserAnalytics.userAccessMatrix || [];
  } catch (error) {
    console.error("Error loading laboratory analytics:", error);
    toastError("Failed to load laboratory analytics");
  } finally {
    loading.value = false;
  }
};

// Bulk assignment methods
const openBulkAssignModal = () => {
  bulkAssignForm.selectedUserUids = [];
  bulkAssignForm.defaultRole = "";
  bulkAssignForm.setAsActive = false;
  bulkAssignForm.sendNotification = true;
  showBulkAssignModal.value = true;
};

const closeBulkAssignModal = () => {
  showBulkAssignModal.value = false;
};

const performBulkAssignment = async () => {
  if (!selectedLaboratory.value || bulkAssignForm.selectedUserUids.length === 0) {
    return;
  }

  saving.value = true;
  
  try {
    const userAssignments = bulkAssignForm.selectedUserUids.map(userUid => ({
      userUid,
      role: bulkAssignForm.defaultRole,
      setAsActive: bulkAssignForm.setAsActive,
    }));

    const result = await withClientMutation<BulkAssignUsersToLaboratoryMutation, any>(
      BulkAssignUsersToLaboratoryDocument,
      {
        laboratoryUid: selectedLaboratory.value,
        userAssignments,
      },
      "bulkAssignUsersToLaboratory"
    );

    if (result.__typename === "BulkOperationResult") {
      const successCount = result.successCount || 0;
      const failureCount = result.failureCount || 0;
      
      if (failureCount > 0) {
        toastError(`${successCount} users assigned successfully, ${failureCount} failed`);
      } else {
        toastSuccess(`${successCount} users assigned successfully`);
      }
      
      closeBulkAssignModal();
      loadLaboratoryAnalytics();
    } else {
      toastError(result.error || "Failed to assign users");
    }
  } catch (error) {
    console.error("Error performing bulk assignment:", error);
    toastError("Failed to assign users");
  } finally {
    saving.value = false;
  }
};

// Transfer methods
const openTransferModal = (userUid?: string) => {
  transferForm.userUid = userUid || "";
  transferForm.fromLaboratoryUid = selectedLaboratory.value;
  transferForm.toLaboratoryUid = "";
  transferForm.preserveRoles = true;
  showTransferModal.value = true;
};

const closeTransferModal = () => {
  showTransferModal.value = false;
};

const performUserTransfer = async () => {
  if (!transferForm.userUid || !transferForm.fromLaboratoryUid || !transferForm.toLaboratoryUid) {
    return;
  }

  saving.value = true;
  
  try {
    const result = await withClientMutation<TransferUserBetweenLaboratoriesMutation, any>(
      TransferUserBetweenLaboratoriesDocument,
      {
        userUid: transferForm.userUid,
        fromLaboratoryUid: transferForm.fromLaboratoryUid,
        toLaboratoryUid: transferForm.toLaboratoryUid,
        preserveRoles: transferForm.preserveRoles,
      },
      "transferUserBetweenLaboratories"
    );

    if (result.__typename === "OperationSuccess") {
      toastSuccess("User transferred successfully");
      closeTransferModal();
      loadLaboratoryAnalytics();
    } else {
      toastError(result.error || "Failed to transfer user");
    }
  } catch (error) {
    console.error("Error transferring user:", error);
    toastError("Failed to transfer user");
  } finally {
    saving.value = false;
  }
};

// Role matrix methods
const openRoleMatrixModal = () => {
  pendingRoleChanges.value.clear();
  showRoleMatrixModal.value = true;
};

const closeRoleMatrixModal = () => {
  showRoleMatrixModal.value = false;
  pendingRoleChanges.value.clear();
};

const updateUserRole = (userId: string, newRole: string) => {
  pendingRoleChanges.value.set(userId, newRole);
};

const applyRoleMatrixChanges = async () => {
  if (pendingRoleChanges.value.size === 0) {
    closeRoleMatrixModal();
    return;
  }

  saving.value = true;
  
  try {
    const userRoleUpdates = Array.from(pendingRoleChanges.value.entries()).map(([userId, role]) => ({
      userId,
      role,
    }));

    const result = await withClientMutation<UpdateUserRoleMatrixMutation, any>(
      UpdateUserRoleMatrixDocument,
      {
        laboratoryUid: selectedLaboratory.value,
        userRoleUpdates,
      },
      "updateUserRoleMatrix"
    );

    if (result.__typename === "OperationSuccess") {
      toastSuccess(`${userRoleUpdates.length} user roles updated successfully`);
      closeRoleMatrixModal();
      loadLaboratoryAnalytics();
    } else {
      toastError(result.error || "Failed to update user roles");
    }
  } catch (error) {
    console.error("Error updating user roles:", error);
    toastError("Failed to update user roles");
  } finally {
    saving.value = false;
  }
};

// Clone permissions methods
const openClonePermissionsModal = (sourceUserUid?: string) => {
  clonePermissionsForm.sourceUserUid = sourceUserUid || "";
  clonePermissionsForm.targetUserUids = [];
  showClonePermissionsModal.value = true;
};

const closeClonePermissionsModal = () => {
  showClonePermissionsModal.value = false;
};

const performPermissionsCloning = async () => {
  if (!clonePermissionsForm.sourceUserUid || clonePermissionsForm.targetUserUids.length === 0) {
    return;
  }

  saving.value = true;
  
  try {
    const result = await withClientMutation<CloneUserPermissionsMutation, any>(
      CloneUserPermissionsDocument,
      {
        fromUserUid: clonePermissionsForm.sourceUserUid,
        toUserUids: clonePermissionsForm.targetUserUids,
        laboratoryUid: selectedLaboratory.value,
      },
      "cloneUserPermissions"
    );

    if (result.__typename === "OperationSuccess") {
      toastSuccess(`Permissions cloned to ${clonePermissionsForm.targetUserUids.length} users`);
      closeClonePermissionsModal();
      loadLaboratoryAnalytics();
    } else {
      toastError(result.error || "Failed to clone permissions");
    }
  } catch (error) {
    console.error("Error cloning permissions:", error);
    toastError("Failed to clone permissions");
  } finally {
    saving.value = false;
  }
};

// Utility methods
const getLaboratoryName = (labUid: string) => {
  const lab = laboratories.value.find(l => l.uid === labUid);
  return lab?.name || "Unknown Laboratory";
};

const getUserName = (userId: string) => {
  const user = allUsers.value.find(u => u.uid === userId);
  return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
};

const formatLastActive = (dateString: string) => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
};

const goBack = () => {
  router.push("/admin/users-conf");
};

// Lifecycle
onMounted(() => {
  // Auto-select first laboratory if available
  if (laboratories.value.length > 0) {
    selectedLaboratory.value = laboratories.value[0].uid;
    loadLaboratoryAnalytics();
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
          <h2 class="text-2xl font-semibold text-foreground">Enhanced Laboratory Users Management</h2>
          <p class="text-sm text-muted-foreground">Advanced user management, bulk operations, and analytics</p>
        </div>
      </div>
    </div>

    <!-- Laboratory Selector and View Mode -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-64">
          <label class="text-sm font-medium text-foreground mb-2 block">Select Laboratory</label>
          <select
            v-model="selectedLaboratory"
            @change="loadLaboratoryAnalytics"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a laboratory...</option>
            <option v-for="lab in laboratories" :key="lab.uid" :value="lab.uid">
              {{ lab.name }} ({{ lab.code }})
            </option>
          </select>
        </div>
        
        <div class="w-48">
          <label class="text-sm font-medium text-foreground mb-2 block">Search Users</label>
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            <input
              v-model="searchText"
              type="text"
              placeholder="Search users..."
              class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <!-- View Mode Tabs -->
      <div class="flex space-x-1 border border-border rounded-md p-1">
        <button
          @click="viewMode = 'dashboard'"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors',
            viewMode === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          ]"
        >
          Dashboard
        </button>
        <button
          @click="viewMode = 'analytics'"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors',
            viewMode === 'analytics' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          ]"
        >
          Analytics
        </button>
      </div>
    </div>

    <!-- Laboratory Info and Quick Actions -->
    <div v-if="currentLaboratory" class="bg-card rounded-lg border p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-foreground">{{ currentLaboratory.name }}</h3>
          <div class="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
            <span>Code: {{ currentLaboratory.code }}</span>
            <span>•</span>
            <span>Email: {{ currentLaboratory.email }}</span>
            <span v-if="laboratoryAnalytics">•</span>
            <span v-if="laboratoryAnalytics">{{ laboratoryAnalytics.totalUsers }} total users</span>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="openBulkAssignModal"
            :disabled="availableUsers.length === 0"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <i class="fas fa-users mr-2"></i>
            Bulk Assign
          </button>
          
          <button
            @click="openTransferModal()"
            :disabled="!laboratoryAnalytics?.totalUsers"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <i class="fas fa-exchange-alt mr-2"></i>
            Transfer Users
          </button>
          
          <button
            @click="openRoleMatrixModal"
            :disabled="!laboratoryAnalytics?.totalUsers"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <i class="fas fa-table mr-2"></i>
            Role Matrix
          </button>
        </div>
      </div>
    </div>

    <!-- Analytics Dashboard -->
    <div v-if="viewMode === 'analytics' && laboratoryAnalytics" class="space-y-6">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div class="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 class="tracking-tight text-sm font-medium">Total Users</h3>
            <i class="fas fa-users text-muted-foreground"></i>
          </div>
          <div class="text-2xl font-bold">{{ laboratoryAnalytics.totalUsers }}</div>
        </div>
        
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div class="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 class="tracking-tight text-sm font-medium">Active Users</h3>
            <i class="fas fa-user-check text-green-500"></i>
          </div>
          <div class="text-2xl font-bold">{{ laboratoryAnalytics.activeUsers }}</div>
        </div>
        
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div class="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 class="tracking-tight text-sm font-medium">Recently Added</h3>
            <i class="fas fa-user-plus text-blue-500"></i>
          </div>
          <div class="text-2xl font-bold">{{ laboratoryAnalytics.recentlyAddedUsers }}</div>
        </div>
        
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div class="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 class="tracking-tight text-sm font-medium">Available to Assign</h3>
            <i class="fas fa-user-friends text-purple-500"></i>
          </div>
          <div class="text-2xl font-bold">{{ availableUsers.length }}</div>
        </div>
      </div>

      <!-- Role Distribution Chart -->
      <div class="bg-card rounded-lg border p-6">
        <h3 class="text-lg font-medium text-foreground mb-4">User Distribution by Role</h3>
        <div class="space-y-3">
          <div v-for="roleData in laboratoryAnalytics.usersByRole" :key="roleData.role" class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 bg-primary rounded"></div>
              <span class="text-sm font-medium">{{ roleData.role }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-muted-foreground">{{ roleData.count }} users</span>
              <div class="w-32 bg-muted rounded-full h-2">
                <div 
                  class="bg-primary h-2 rounded-full" 
                  :style="{ width: `${(roleData.count / laboratoryAnalytics.totalUsers) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard View -->
    <div v-if="viewMode === 'dashboard' && selectedLaboratory" class="space-y-6">
      <!-- Filters -->
      <div class="flex items-center space-x-4">
        <div class="w-48">
          <select
            v-model="roleFilter"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Roles</option>
            <option v-for="group in groups" :key="group.uid" :value="group.name">
              {{ group.name }}
            </option>
          </select>
        </div>
        
        <button
          @click="loadLaboratoryAnalytics"
          :disabled="loading"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          <i class="fas fa-sync-alt mr-2" :class="{ 'fa-spin': loading }"></i>
          Refresh
        </button>
      </div>

      <!-- Users Access Matrix Table -->
      <div class="rounded-md border border-border">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b border-border bg-muted/50">
              <tr>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Roles</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Permissions</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Active</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-if="loading">
                <td colspan="5" class="p-8 text-center">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  Loading user analytics...
                </td>
              </tr>
              
              <tr v-else-if="filteredLaboratoryUsers.length === 0">
                <td colspan="5" class="p-8 text-center text-muted-foreground">
                  <i class="fas fa-users mb-2 block text-2xl"></i>
                  {{ laboratoryAnalytics?.totalUsers === 0 ? "No users assigned to this laboratory" : "No users match your filters" }}
                </td>
              </tr>
              
              <tr v-else v-for="user in filteredLaboratoryUsers" :key="user.userId" class="hover:bg-muted/50">
                <td class="p-4 align-middle">
                  <div>
                    <div class="font-medium">{{ getUserName(user.userId) }}</div>
                    <div class="text-sm text-muted-foreground">{{ user.userName }}</div>
                  </div>
                </td>
                
                <td class="p-4 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="role in user.roles" :key="role" class="inline-flex items-center rounded-md bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium">
                      {{ role }}
                    </span>
                  </div>
                </td>
                
                <td class="p-4 align-middle">
                  <div class="text-sm">
                    {{ user.permissions.length }} permissions
                    <button 
                      class="ml-2 text-primary hover:text-primary/80"
                      title="View permissions"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                  </div>
                </td>
                
                <td class="p-4 align-middle">
                  <div class="text-sm text-muted-foreground">{{ formatLastActive(user.lastActive) }}</div>
                </td>
                
                <td class="p-4 align-middle">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="$router.push(`/admin/user/${user.userId}`)"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    
                    <button
                      @click="openTransferModal(user.userId)"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                      title="Transfer User"
                    >
                      <i class="fas fa-exchange-alt"></i>
                    </button>
                    
                    <button
                      @click="openClonePermissionsModal(user.userId)"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                      title="Clone Permissions"
                    >
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!selectedLaboratory" class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="fas fa-building text-4xl mb-4 text-muted-foreground"></i>
        <p class="text-muted-foreground">Select a laboratory to manage its users</p>
      </div>
    </div>
  </div>

  <!-- Bulk Assignment Modal -->
  <div v-if="showBulkAssignModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Bulk Assign Users</h3>
        <p class="text-sm text-muted-foreground">
          Assign multiple users to {{ currentLaboratory?.name }} at once
        </p>
      </div>
      
      <div class="grid grid-cols-2 gap-6">
        <!-- Available Users -->
        <div class="space-y-4">
          <h4 class="font-medium">Available Users</h4>
          
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            <input
              v-model="searchText"
              type="text"
              placeholder="Search available users..."
              class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="border border-input rounded-md p-3 space-y-2 max-h-80 overflow-y-auto">
            <div v-for="user in filteredAvailableUsers" :key="user.uid" class="flex items-center space-x-3">
              <input
                :id="`bulk-user-${user.uid}`"
                v-model="bulkAssignForm.selectedUserUids"
                :value="user.uid"
                type="checkbox"
                class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
              />
              <label :for="`bulk-user-${user.uid}`" class="flex-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-sm">{{ user.firstName }} {{ user.lastName }}</div>
                    <div class="text-xs text-muted-foreground">{{ user.email }} - @{{ user.userName }}</div>
                  </div>
                  <div class="text-xs text-muted-foreground">
                    {{ user.groups?.map(g => g.name).join(", ") || "No Groups" }}
                  </div>
                </div>
              </label>
            </div>
            
            <div v-if="filteredAvailableUsers.length === 0" class="p-4 text-center text-muted-foreground">
              No available users found
            </div>
          </div>
        </div>

        <!-- Assignment Options -->
        <div class="space-y-4">
          <h4 class="font-medium">Assignment Options</h4>
          
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Default Role</label>
              <select
                v-model="bulkAssignForm.defaultRole"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">No Default Role</option>
                <option v-for="group in groups" :key="group.uid" :value="group.uid">
                  {{ group.name }}
                </option>
              </select>
            </div>

            <div class="flex items-center space-x-3">
              <input
                v-model="bulkAssignForm.setAsActive"
                type="checkbox"
                id="set-as-active"
                class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
              />
              <label for="set-as-active" class="text-sm font-medium text-foreground">
                Set as active laboratory for users
              </label>
            </div>

            <div class="flex items-center space-x-3">
              <input
                v-model="bulkAssignForm.sendNotification"
                type="checkbox"
                id="send-notification"
                class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
              />
              <label for="send-notification" class="text-sm font-medium text-foreground">
                Send email notifications to users
              </label>
            </div>

            <div class="p-4 bg-muted/50 rounded-md">
              <div class="text-sm">
                <div class="font-medium">Selected: {{ bulkAssignForm.selectedUserUids.length }} users</div>
                <div class="text-muted-foreground mt-1">
                  These users will be assigned to {{ currentLaboratory?.name }}
                  {{ bulkAssignForm.defaultRole ? ` with ${groups.find(g => g.uid === bulkAssignForm.defaultRole)?.name} role` : '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-2 pt-4">
        <button
          @click="closeBulkAssignModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancel
        </button>
        
        <button
          @click="performBulkAssignment"
          :disabled="bulkAssignForm.selectedUserUids.length === 0 || saving"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {{ saving ? "Assigning..." : `Assign ${bulkAssignForm.selectedUserUids.length} User(s)` }}
        </button>
      </div>
    </div>
  </div>

  <!-- Transfer User Modal -->
  <div v-if="showTransferModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Transfer User</h3>
        <p class="text-sm text-muted-foreground">Move user between laboratories</p>
      </div>
      
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">User</label>
          <select
            v-model="transferForm.userUid"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select user to transfer...</option>
            <option v-for="user in transferableUsers" :key="user.userId" :value="user.userId">
              {{ getUserName(user.userId) }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">To Laboratory</label>
          <select
            v-model="transferForm.toLaboratoryUid"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select destination laboratory...</option>
            <option 
              v-for="lab in laboratories" 
              :key="lab.uid" 
              :value="lab.uid"
              :disabled="lab.uid === transferForm.fromLaboratoryUid"
            >
              {{ lab.name }} ({{ lab.code }})
            </option>
          </select>
        </div>

        <div class="flex items-center space-x-3">
          <input
            v-model="transferForm.preserveRoles"
            type="checkbox"
            id="preserve-roles"
            class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
          />
          <label for="preserve-roles" class="text-sm font-medium text-foreground">
            Preserve user roles and permissions
          </label>
        </div>
      </div>
      
      <div class="flex justify-end space-x-2 pt-4">
        <button
          @click="closeTransferModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancel
        </button>
        
        <button
          @click="performUserTransfer"
          :disabled="!transferForm.userUid || !transferForm.toLaboratoryUid || saving"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {{ saving ? "Transferring..." : "Transfer User" }}
        </button>
      </div>
    </div>
  </div>

  <!-- Role Matrix Modal -->
  <div v-if="showRoleMatrixModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-6xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg max-h-[90vh] overflow-hidden">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Role Matrix Management</h3>
        <p class="text-sm text-muted-foreground">
          Update roles for multiple users in {{ currentLaboratory?.name }}
        </p>
      </div>
      
      <div class="overflow-y-auto max-h-96">
        <table class="w-full">
          <thead class="border-b border-border bg-muted/50 sticky top-0">
            <tr>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Current Roles</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">New Role</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="user in roleMatrixUsers" :key="user.userId" class="hover:bg-muted/50">
              <td class="p-4 align-middle">
                <div>
                  <div class="font-medium text-sm">{{ getUserName(user.userId) }}</div>
                  <div class="text-xs text-muted-foreground">{{ user.userName }}</div>
                </div>
              </td>
              
              <td class="p-4 align-middle">
                <div class="flex flex-wrap gap-1">
                  <span v-for="role in user.roles" :key="role" class="inline-flex items-center rounded-md bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium">
                    {{ role }}
                  </span>
                </div>
              </td>
              
              <td class="p-4 align-middle">
                <select
                  :value="pendingRoleChanges.get(user.userId) || ''"
                  @change="updateUserRole(user.userId, ($event.target as HTMLSelectElement).value)"
                  class="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">No change</option>
                  <option v-for="group in groups" :key="group.uid" :value="group.uid">
                    {{ group.name }}
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="flex justify-between pt-4">
        <div class="text-sm text-muted-foreground">
          {{ pendingRoleChanges.size }} role changes pending
        </div>
        
        <div class="flex space-x-2">
          <button
            @click="closeRoleMatrixModal"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Cancel
          </button>
          
          <button
            @click="applyRoleMatrixChanges"
            :disabled="pendingRoleChanges.size === 0 || saving"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {{ saving ? "Applying..." : `Apply ${pendingRoleChanges.size} Changes` }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Clone Permissions Modal -->
  <div v-if="showClonePermissionsModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Clone User Permissions</h3>
        <p class="text-sm text-muted-foreground">
          Copy permissions from one user to others in {{ currentLaboratory?.name }}
        </p>
      </div>
      
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Source User</label>
          <select
            v-model="clonePermissionsForm.sourceUserUid"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select source user...</option>
            <option v-for="user in roleMatrixUsers" :key="user.userId" :value="user.userId">
              {{ getUserName(user.userId) }} ({{ user.roles.join(", ") }})
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Target Users</label>
          <div class="border border-input rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
            <div v-for="user in roleMatrixUsers" :key="user.userId" class="flex items-center space-x-3">
              <input
                :id="`clone-target-${user.userId}`"
                v-model="clonePermissionsForm.targetUserUids"
                :value="user.userId"
                type="checkbox"
                :disabled="user.userId === clonePermissionsForm.sourceUserUid"
                class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
              />
              <label :for="`clone-target-${user.userId}`" class="flex-1 cursor-pointer">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-sm">{{ getUserName(user.userId) }}</div>
                    <div class="text-xs text-muted-foreground">Current roles: {{ user.roles.join(", ") }}</div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="p-4 bg-muted/50 rounded-md">
          <div class="text-sm">
            <div class="font-medium">Selected: {{ clonePermissionsForm.targetUserUids.length }} target users</div>
            <div class="text-muted-foreground mt-1">
              Permissions from the source user will be copied to all selected target users
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-2 pt-4">
        <button
          @click="closeClonePermissionsModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancel
        </button>
        
        <button
          @click="performPermissionsCloning"
          :disabled="!clonePermissionsForm.sourceUserUid || clonePermissionsForm.targetUserUids.length === 0 || saving"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {{ saving ? "Cloning..." : `Clone to ${clonePermissionsForm.targetUserUids.length} User(s)` }}
        </button>
      </div>
    </div>
  </div>
</template>