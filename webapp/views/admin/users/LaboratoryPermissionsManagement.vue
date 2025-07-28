<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { UserType, LaboratoryType, GroupType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

// Laboratory-specific permissions GraphQL operations
interface LaboratoryPermissionsQuery {
  laboratoryPermissions: {
    laboratory: LaboratoryType;
    permissions: {
      uid: string;
      action: string;
      target: string;
      description: string;
      category: string;
    }[];
    userPermissions: {
      user: UserType;
      assignedPermissions: string[];
      inheritedPermissions: string[];
      deniedPermissions: string[];
    }[];
    groupPermissions: {
      group: GroupType;
      assignedPermissions: string[];
    }[];
  };
}

interface UpdateUserLabPermissionsMutation {
  updateUserLabPermissions: {
    __typename: "OperationSuccess" | "OperationError";
    success?: boolean;
    error?: string;
  };
}

interface CreateCustomPermissionMutation {
  createCustomPermission: {
    __typename: "PermissionType" | "OperationError";
    uid?: string;
    action?: string;
    target?: string;
    error?: string;
  };
}

interface ClonePermissionTemplateMutation {
  clonePermissionTemplate: {
    __typename: "OperationSuccess" | "OperationError";
    success?: boolean;
    error?: string;
  };
}

const LaboratoryPermissionsDocument = `
  query LaboratoryPermissions($laboratoryUid: String!) {
    laboratoryPermissions(laboratoryUid: $laboratoryUid) {
      laboratory {
        uid
        name
        code
      }
      permissions {
        uid
        action
        target
        description
        category
      }
      userPermissions {
        user {
          uid
          firstName
          lastName
          email
          userName
        }
        assignedPermissions
        inheritedPermissions
        deniedPermissions
      }
      groupPermissions {
        group {
          uid
          name
        }
        assignedPermissions
      }
    }
  }
`;

const UpdateUserLabPermissionsDocument = `
  mutation UpdateUserLabPermissions($userUid: String!, $laboratoryUid: String!, $permissions: [String!]!, $deniedPermissions: [String!]!) {
    updateUserLabPermissions(userUid: $userUid, laboratoryUid: $laboratoryUid, permissions: $permissions, deniedPermissions: $deniedPermissions) {
      ... on OperationSuccess {
        success
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const CreateCustomPermissionDocument = `
  mutation CreateCustomPermission($laboratoryUid: String!, $action: String!, $target: String!, $description: String!, $category: String!) {
    createCustomPermission(laboratoryUid: $laboratoryUid, action: $action, target: $target, description: $description, category: $category) {
      ... on PermissionType {
        uid
        action
        target
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const ClonePermissionTemplateDocument = `
  mutation ClonePermissionTemplate($fromLaboratoryUid: String!, $toLaboratoryUid: String!, $includeUserAssignments: Boolean!) {
    clonePermissionTemplate(fromLaboratoryUid: $fromLaboratoryUid, toLaboratoryUid: $toLaboratoryUid, includeUserAssignments: $includeUserAssignments) {
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

// Mock data
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

const permissionCategories = [
  "Sample Management",
  "Analysis & Testing",
  "Quality Control", 
  "Inventory Management",
  "User Management",
  "System Administration",
  "Reporting & Analytics",
  "Equipment Management",
  "Patient Management",
  "Billing & Finance"
];

// State
const selectedLaboratory = ref("");
const currentLaboratory = ref<LaboratoryType | null>(null);
const labPermissions = ref<any>(null);
const loading = ref(false);
const saving = ref(false);

// View modes
const viewMode = ref<"overview" | "user-permissions" | "group-permissions" | "custom-permissions">("overview");

// Modal states
const showPermissionModal = ref(false);
const showCustomPermissionModal = ref(false);
const showCloneTemplateModal = ref(false);
const editingUser = ref<any>(null);

// Permission editing state
const permissionForm = reactive({
  assignedPermissions: [] as string[],
  deniedPermissions: [] as string[],
});

// Custom permission form
const customPermissionForm = reactive({
  action: "",
  target: "",
  description: "",
  category: "",
});

// Clone template form
const cloneTemplateForm = reactive({
  fromLaboratoryUid: "",
  includeUserAssignments: false,
});

// Search and filters
const searchText = ref("");
const categoryFilter = ref("");
const userFilter = ref("");

// Computed
const filteredPermissions = computed(() => {
  if (!labPermissions.value?.permissions) return [];
  
  let filtered = [...labPermissions.value.permissions];
  
  if (categoryFilter.value) {
    filtered = filtered.filter(p => p.category === categoryFilter.value);
  }
  
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    filtered = filtered.filter(p => 
      p.action.toLowerCase().includes(search) ||
      p.target.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
  }
  
  return filtered;
});

const filteredUserPermissions = computed(() => {
  if (!labPermissions.value?.userPermissions) return [];
  
  let filtered = [...labPermissions.value.userPermissions];
  
  if (userFilter.value) {
    const search = userFilter.value.toLowerCase();
    filtered = filtered.filter(up => 
      up.user.firstName?.toLowerCase().includes(search) ||
      up.user.lastName?.toLowerCase().includes(search) ||
      up.user.email?.toLowerCase().includes(search)
    );
  }
  
  return filtered;
});

const permissionsByCategory = computed(() => {
  const grouped = new Map<string, any[]>();
  
  filteredPermissions.value.forEach(permission => {
    const category = permission.category;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(permission);
  });
  
  return grouped;
});

const permissionStats = computed(() => {
  if (!labPermissions.value) return { total: 0, assigned: 0, custom: 0 };
  
  const total = labPermissions.value.permissions?.length || 0;
  const assigned = labPermissions.value.userPermissions?.reduce((count: number, up: any) => 
    count + up.assignedPermissions.length, 0) || 0;
  const custom = labPermissions.value.permissions?.filter((p: any) => p.category === "Custom").length || 0;
  
  return { total, assigned, custom };
});

// Methods
const loadLaboratoryPermissions = async () => {
  if (!selectedLaboratory.value) {
    currentLaboratory.value = null;
    labPermissions.value = null;
    return;
  }

  loading.value = true;
  
  try {
    const result = await withClientQuery<LaboratoryPermissionsQuery, { laboratoryUid: string }>(
      LaboratoryPermissionsDocument,
      { laboratoryUid: selectedLaboratory.value }
    );

    currentLaboratory.value = result.laboratoryPermissions.laboratory;
    labPermissions.value = result.laboratoryPermissions;
  } catch (error) {
    console.error("Error loading laboratory permissions:", error);
    toastError("Failed to load laboratory permissions");
  } finally {
    loading.value = false;
  }
};

// User permission management
const openPermissionModal = (userPermission: any) => {
  editingUser.value = userPermission;
  permissionForm.assignedPermissions = [...userPermission.assignedPermissions];
  permissionForm.deniedPermissions = [...userPermission.deniedPermissions];
  showPermissionModal.value = true;
};

const closePermissionModal = () => {
  editingUser.value = null;
  showPermissionModal.value = false;
  permissionForm.assignedPermissions = [];
  permissionForm.deniedPermissions = [];
};

const updateUserPermissions = async () => {
  if (!editingUser.value) return;

  saving.value = true;
  
  try {
    const result = await withClientMutation<UpdateUserLabPermissionsMutation, any>(
      UpdateUserLabPermissionsDocument,
      {
        userUid: editingUser.value.user.uid,
        laboratoryUid: selectedLaboratory.value,
        permissions: permissionForm.assignedPermissions,
        deniedPermissions: permissionForm.deniedPermissions,
      },
      "updateUserLabPermissions"
    );

    if (result.__typename === "OperationSuccess") {
      toastSuccess("User permissions updated successfully");
      closePermissionModal();
      loadLaboratoryPermissions();
    } else {
      toastError(result.error || "Failed to update user permissions");
    }
  } catch (error) {
    console.error("Error updating user permissions:", error);
    toastError("Failed to update user permissions");
  } finally {
    saving.value = false;
  }
};

// Custom permission management
const openCustomPermissionModal = () => {
  Object.assign(customPermissionForm, {
    action: "",
    target: "",
    description: "",
    category: "",
  });
  showCustomPermissionModal.value = true;
};

const closeCustomPermissionModal = () => {
  showCustomPermissionModal.value = false;
};

const createCustomPermission = async () => {
  if (!customPermissionForm.action || !customPermissionForm.target) {
    toastError("Please fill in all required fields");
    return;
  }

  saving.value = true;
  
  try {
    const result = await withClientMutation<CreateCustomPermissionMutation, any>(
      CreateCustomPermissionDocument,
      {
        laboratoryUid: selectedLaboratory.value,
        action: customPermissionForm.action,
        target: customPermissionForm.target,
        description: customPermissionForm.description,
        category: customPermissionForm.category || "Custom",
      },
      "createCustomPermission"
    );

    if (result.__typename === "PermissionType") {
      toastSuccess("Custom permission created successfully");
      closeCustomPermissionModal();
      loadLaboratoryPermissions();
    } else {
      toastError(result.error || "Failed to create custom permission");
    }
  } catch (error) {
    console.error("Error creating custom permission:", error);
    toastError("Failed to create custom permission");
  } finally {
    saving.value = false;
  }
};

// Template cloning
const openCloneTemplateModal = () => {
  cloneTemplateForm.fromLaboratoryUid = "";
  cloneTemplateForm.includeUserAssignments = false;
  showCloneTemplateModal.value = true;
};

const closeCloneTemplateModal = () => {
  showCloneTemplateModal.value = false;
};

const clonePermissionTemplate = async () => {
  if (!cloneTemplateForm.fromLaboratoryUid) {
    toastError("Please select a source laboratory");
    return;
  }

  saving.value = true;
  
  try {
    const result = await withClientMutation<ClonePermissionTemplateMutation, any>(
      ClonePermissionTemplateDocument,
      {
        fromLaboratoryUid: cloneTemplateForm.fromLaboratoryUid,
        toLaboratoryUid: selectedLaboratory.value,
        includeUserAssignments: cloneTemplateForm.includeUserAssignments,
      },
      "clonePermissionTemplate"
    );

    if (result.__typename === "OperationSuccess") {
      toastSuccess("Permission template cloned successfully");
      closeCloneTemplateModal();
      loadLaboratoryPermissions();
    } else {
      toastError(result.error || "Failed to clone permission template");
    }
  } catch (error) {
    console.error("Error cloning permission template:", error);
    toastError("Failed to clone permission template");
  } finally {
    saving.value = false;
  }
};

// Utility methods
const getUserName = (user: UserType) => {
  return `${user.firstName} ${user.lastName}`;
};

const hasPermission = (userPermission: any, permissionUid: string) => {
  return userPermission.assignedPermissions.includes(permissionUid) ||
         userPermission.inheritedPermissions.includes(permissionUid);
};

const isPermissionDenied = (userPermission: any, permissionUid: string) => {
  return userPermission.deniedPermissions.includes(permissionUid);
};

const getPermissionStatus = (userPermission: any, permissionUid: string) => {
  if (userPermission.deniedPermissions.includes(permissionUid)) return "denied";
  if (userPermission.assignedPermissions.includes(permissionUid)) return "assigned";
  if (userPermission.inheritedPermissions.includes(permissionUid)) return "inherited";
  return "none";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "assigned": return "bg-green-100 text-green-800";
    case "inherited": return "bg-blue-100 text-blue-800";
    case "denied": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const togglePermissionAssignment = (permissionUid: string) => {
  const assignedIndex = permissionForm.assignedPermissions.indexOf(permissionUid);
  const deniedIndex = permissionForm.deniedPermissions.indexOf(permissionUid);
  
  if (assignedIndex > -1) {
    // Currently assigned, remove it
    permissionForm.assignedPermissions.splice(assignedIndex, 1);
  } else if (deniedIndex > -1) {
    // Currently denied, remove from denied and add to assigned
    permissionForm.deniedPermissions.splice(deniedIndex, 1);
    permissionForm.assignedPermissions.push(permissionUid);
  } else {
    // Not assigned or denied, add to assigned
    permissionForm.assignedPermissions.push(permissionUid);
  }
};

const togglePermissionDenial = (permissionUid: string) => {
  const assignedIndex = permissionForm.assignedPermissions.indexOf(permissionUid);
  const deniedIndex = permissionForm.deniedPermissions.indexOf(permissionUid);
  
  if (deniedIndex > -1) {
    // Currently denied, remove it
    permissionForm.deniedPermissions.splice(deniedIndex, 1);
  } else {
    // Not denied, add to denied and remove from assigned
    if (assignedIndex > -1) {
      permissionForm.assignedPermissions.splice(assignedIndex, 1);
    }
    permissionForm.deniedPermissions.push(permissionUid);
  }
};

const goBack = () => {
  router.push("/admin/users-conf");
};

// Lifecycle
onMounted(() => {
  if (laboratories.value.length > 0) {
    selectedLaboratory.value = laboratories.value[0].uid;
    loadLaboratoryPermissions();
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
          <h2 class="text-2xl font-semibold text-foreground">Laboratory Permissions Management</h2>
          <p class="text-sm text-muted-foreground">Manage laboratory-specific permissions and user access</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button 
          @click="openCustomPermissionModal"
          :disabled="!selectedLaboratory"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          <i class="fas fa-plus mr-2"></i>
          Custom Permission
        </button>
        
        <button 
          @click="openCloneTemplateModal"
          :disabled="!selectedLaboratory"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <i class="fas fa-copy mr-2"></i>
          Clone Template
        </button>
      </div>
    </div>

    <!-- Laboratory Selector and Filters -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-64">
          <label class="text-sm font-medium text-foreground mb-2 block">Select Laboratory</label>
          <select
            v-model="selectedLaboratory"
            @change="loadLaboratoryPermissions"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a laboratory...</option>
            <option v-for="lab in laboratories" :key="lab.uid" :value="lab.uid">
              {{ lab.name }} ({{ lab.code }})
            </option>
          </select>
        </div>
        
        <div class="w-48">
          <label class="text-sm font-medium text-foreground mb-2 block">Search</label>
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            <input
              v-model="searchText"
              type="text"
              placeholder="Search permissions..."
              class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <!-- View Mode Tabs -->
      <div class="flex space-x-1 border border-border rounded-md p-1">
        <button
          @click="viewMode = 'overview'"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors',
            viewMode === 'overview' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          ]"
        >
          Overview
        </button>
        <button
          @click="viewMode = 'user-permissions'"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors',
            viewMode === 'user-permissions' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          ]"
        >
          User Permissions
        </button>
        <button
          @click="viewMode = 'group-permissions'"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors',
            viewMode === 'group-permissions' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          ]"
        >
          Group Permissions
        </button>
        <button
          @click="viewMode = 'custom-permissions'"
          :class="[
            'px-3 py-1 text-sm rounded transition-colors',
            viewMode === 'custom-permissions' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
          ]"
        >
          Custom Permissions
        </button>
      </div>
    </div>

    <!-- Laboratory Info -->
    <div v-if="currentLaboratory" class="bg-card rounded-lg border p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-foreground">{{ currentLaboratory.name }}</h3>
          <div class="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
            <span>Code: {{ currentLaboratory.code }}</span>
            <span v-if="labPermissions">•</span>
            <span v-if="labPermissions">{{ permissionStats.total }} permissions</span>
            <span v-if="labPermissions">•</span>
            <span v-if="labPermissions">{{ permissionStats.assigned }} assignments</span>
            <span v-if="labPermissions">•</span>
            <span v-if="labPermissions">{{ permissionStats.custom }} custom</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Overview Mode -->
    <div v-if="viewMode === 'overview' && labPermissions" class="space-y-6">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div class="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 class="tracking-tight text-sm font-medium">Total Permissions</h3>
            <i class="fas fa-shield-alt text-muted-foreground"></i>
          </div>
          <div class="text-2xl font-bold">{{ permissionStats.total }}</div>
        </div>
        
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div class="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 class="tracking-tight text-sm font-medium">Total Assignments</h3>
            <i class="fas fa-user-shield text-blue-500"></i>
          </div>
          <div class="text-2xl font-bold">{{ permissionStats.assigned }}</div>
        </div>
        
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div class="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 class="tracking-tight text-sm font-medium">Custom Permissions</h3>
            <i class="fas fa-cog text-purple-500"></i>
          </div>
          <div class="text-2xl font-bold">{{ permissionStats.custom }}</div>
        </div>
        
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div class="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 class="tracking-tight text-sm font-medium">Categories</h3>
            <i class="fas fa-tags text-green-500"></i>
          </div>
          <div class="text-2xl font-bold">{{ permissionsByCategory.size }}</div>
        </div>
      </div>

      <!-- Permissions by Category -->
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <h3 class="text-lg font-medium text-foreground">Permissions by Category</h3>
          <select
            v-model="categoryFilter"
            class="w-48 h-8 rounded border border-input bg-background px-2 text-sm"
          >
            <option value="">All Categories</option>
            <option v-for="category in permissionCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="[category, permissions] in permissionsByCategory" :key="category" class="bg-card rounded-lg border p-4">
            <h4 class="font-medium text-foreground mb-3">{{ category }}</h4>
            <div class="space-y-2">
              <div v-for="permission in permissions" :key="permission.uid" class="text-sm">
                <div class="font-medium">{{ permission.action }}:{{ permission.target }}</div>
                <div class="text-muted-foreground text-xs">{{ permission.description }}</div>
              </div>
            </div>
            <div class="mt-3 text-sm text-muted-foreground">
              {{ permissions.length }} permission{{ permissions.length !== 1 ? 's' : '' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Permissions Mode -->
    <div v-if="viewMode === 'user-permissions' && labPermissions" class="space-y-6">
      <!-- User Filter -->
      <div class="flex items-center space-x-4">
        <div class="w-64">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            <input
              v-model="userFilter"
              type="text"
              placeholder="Search users..."
              class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <!-- User Permissions Table -->
      <div class="rounded-md border border-border">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b border-border bg-muted/50">
              <tr>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Assigned</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Inherited</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Denied</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-if="loading">
                <td colspan="5" class="p-8 text-center">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  Loading user permissions...
                </td>
              </tr>
              
              <tr v-else-if="filteredUserPermissions.length === 0">
                <td colspan="5" class="p-8 text-center text-muted-foreground">
                  <i class="fas fa-users mb-2 block text-2xl"></i>
                  No users found
                </td>
              </tr>
              
              <tr v-else v-for="userPermission in filteredUserPermissions" :key="userPermission.user.uid" class="hover:bg-muted/50">
                <td class="p-4 align-middle">
                  <div>
                    <div class="font-medium">{{ getUserName(userPermission.user) }}</div>
                    <div class="text-sm text-muted-foreground">{{ userPermission.user.email }}</div>
                  </div>
                </td>
                
                <td class="p-4 align-middle">
                  <div class="text-sm">
                    <span class="inline-flex items-center rounded-md bg-green-100 text-green-800 px-2 py-1 text-xs font-medium">
                      {{ userPermission.assignedPermissions.length }} assigned
                    </span>
                  </div>
                </td>
                
                <td class="p-4 align-middle">
                  <div class="text-sm">
                    <span class="inline-flex items-center rounded-md bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium">
                      {{ userPermission.inheritedPermissions.length }} inherited
                    </span>
                  </div>
                </td>
                
                <td class="p-4 align-middle">
                  <div class="text-sm">
                    <span class="inline-flex items-center rounded-md bg-red-100 text-red-800 px-2 py-1 text-xs font-medium">
                      {{ userPermission.deniedPermissions.length }} denied
                    </span>
                  </div>
                </td>
                
                <td class="p-4 align-middle">
                  <button
                    @click="openPermissionModal(userPermission)"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    title="Edit Permissions"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Group Permissions Mode -->
    <div v-if="viewMode === 'group-permissions' && labPermissions" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="groupPermission in labPermissions.groupPermissions" :key="groupPermission.group.uid" class="bg-card rounded-lg border p-4">
          <h4 class="font-medium text-foreground mb-3">{{ groupPermission.group.name }}</h4>
          <div class="space-y-2">
            <div class="text-sm text-muted-foreground">
              {{ groupPermission.assignedPermissions.length }} permission{{ groupPermission.assignedPermissions.length !== 1 ? 's' : '' }} assigned
            </div>
            <div class="flex flex-wrap gap-1">
              <span v-for="permissionUid in groupPermission.assignedPermissions.slice(0, 3)" :key="permissionUid" class="inline-flex items-center rounded-md bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium">
                {{ labPermissions.permissions.find((p: any) => p.uid === permissionUid)?.action || permissionUid }}
              </span>
              <span v-if="groupPermission.assignedPermissions.length > 3" class="inline-flex items-center rounded-md bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium">
                +{{ groupPermission.assignedPermissions.length - 3 }} more
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Permissions Mode -->
    <div v-if="viewMode === 'custom-permissions' && labPermissions" class="space-y-6">
      <div class="rounded-md border border-border">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b border-border bg-muted/50">
              <tr>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Action</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Target</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usage</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="permission in filteredPermissions.filter(p => p.category === 'Custom')" :key="permission.uid" class="hover:bg-muted/50">
                <td class="p-4 align-middle">
                  <span class="font-medium">{{ permission.action }}</span>
                </td>
                
                <td class="p-4 align-middle">
                  <span class="text-sm">{{ permission.target }}</span>
                </td>
                
                <td class="p-4 align-middle">
                  <span class="text-sm text-muted-foreground">{{ permission.description }}</span>
                </td>
                
                <td class="p-4 align-middle">
                  <span class="inline-flex items-center rounded-md bg-purple-100 text-purple-800 px-2 py-1 text-xs font-medium">
                    {{ permission.category }}
                  </span>
                </td>
                
                <td class="p-4 align-middle">
                  <span class="text-sm text-muted-foreground">
                    {{ labPermissions.userPermissions.filter((up: any) => up.assignedPermissions.includes(permission.uid)).length }} users
                  </span>
                </td>
              </tr>
              
              <tr v-if="filteredPermissions.filter(p => p.category === 'Custom').length === 0">
                <td colspan="5" class="p-8 text-center text-muted-foreground">
                  <i class="fas fa-cog mb-2 block text-2xl"></i>
                  No custom permissions found
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
        <i class="fas fa-shield-alt text-4xl mb-4 text-muted-foreground"></i>
        <p class="text-muted-foreground">Select a laboratory to manage permissions</p>
      </div>
    </div>
  </div>

  <!-- Edit User Permissions Modal -->
  <div v-if="showPermissionModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-6xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg max-h-[90vh] overflow-hidden">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Edit User Permissions</h3>
        <p class="text-sm text-muted-foreground">
          Manage permissions for {{ editingUser ? getUserName(editingUser.user) : '' }} in {{ currentLaboratory?.name }}
        </p>
      </div>
      
      <div class="overflow-y-auto max-h-96">
        <div class="space-y-4">
          <div v-for="[category, permissions] in permissionsByCategory" :key="category" class="border border-border rounded-md p-4">
            <h4 class="font-medium text-foreground mb-3">{{ category }}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="permission in permissions" :key="permission.uid" class="flex items-center justify-between p-2 border border-border rounded">
                <div class="flex-1">
                  <div class="font-medium text-sm">{{ permission.action }}:{{ permission.target }}</div>
                  <div class="text-xs text-muted-foreground">{{ permission.description }}</div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <!-- Current Status -->
                  <span :class="[
                    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                    getStatusColor(getPermissionStatus(editingUser, permission.uid))
                  ]">
                    {{ getPermissionStatus(editingUser, permission.uid) }}
                  </span>
                  
                  <!-- Action Buttons -->
                  <button
                    @click="togglePermissionAssignment(permission.uid)"
                    :class="[
                      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-6 w-6',
                      permissionForm.assignedPermissions.includes(permission.uid)
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    ]"
                    title="Toggle Assignment"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  
                  <button
                    @click="togglePermissionDenial(permission.uid)"
                    :class="[
                      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-6 w-6',
                      permissionForm.deniedPermissions.includes(permission.uid)
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    ]"
                    title="Toggle Denial"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-between pt-4">
        <div class="text-sm text-muted-foreground">
          {{ permissionForm.assignedPermissions.length }} assigned, {{ permissionForm.deniedPermissions.length }} denied
        </div>
        
        <div class="flex space-x-2">
          <button
            @click="closePermissionModal"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Cancel
          </button>
          
          <button
            @click="updateUserPermissions"
            :disabled="saving"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {{ saving ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Custom Permission Modal -->
  <div v-if="showCustomPermissionModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Create Custom Permission</h3>
        <p class="text-sm text-muted-foreground">Add a laboratory-specific permission</p>
      </div>
      
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Action *</label>
          <input
            v-model="customPermissionForm.action"
            type="text"
            required
            placeholder="e.g., create, read, update, delete..."
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Target *</label>
          <input
            v-model="customPermissionForm.target"
            type="text"
            required
            placeholder="e.g., equipment, reports, protocols..."
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Description</label>
          <textarea
            v-model="customPermissionForm.description"
            rows="3"
            placeholder="Describe what this permission allows..."
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          ></textarea>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Category</label>
          <select
            v-model="customPermissionForm.category"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Custom">Custom</option>
            <option v-for="category in permissionCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="flex justify-end space-x-2 pt-4">
        <button
          @click="closeCustomPermissionModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancel
        </button>
        
        <button
          @click="createCustomPermission"
          :disabled="!customPermissionForm.action || !customPermissionForm.target || saving"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {{ saving ? "Creating..." : "Create Permission" }}
        </button>
      </div>
    </div>
  </div>

  <!-- Clone Template Modal -->
  <div v-if="showCloneTemplateModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Clone Permission Template</h3>
        <p class="text-sm text-muted-foreground">Copy permissions from another laboratory</p>
      </div>
      
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Source Laboratory *</label>
          <select
            v-model="cloneTemplateForm.fromLaboratoryUid"
            required
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select source laboratory...</option>
            <option 
              v-for="lab in laboratories" 
              :key="lab.uid" 
              :value="lab.uid"
              :disabled="lab.uid === selectedLaboratory"
            >
              {{ lab.name }} ({{ lab.code }})
            </option>
          </select>
        </div>

        <div class="flex items-center space-x-3">
          <input
            v-model="cloneTemplateForm.includeUserAssignments"
            type="checkbox"
            id="include-user-assignments"
            class="h-4 w-4 text-primary focus:ring-ring border-gray-300 rounded"
          />
          <label for="include-user-assignments" class="text-sm font-medium text-foreground">
            Include user assignments (copy user permissions too)
          </label>
        </div>

        <div class="p-4 bg-muted/50 rounded-md">
          <div class="text-sm">
            <div class="font-medium">What will be copied:</div>
            <ul class="text-muted-foreground mt-1 space-y-1">
              <li>• Permission definitions and categories</li>
              <li>• Group permission assignments</li>
              <li v-if="cloneTemplateForm.includeUserAssignments">• Individual user permission assignments</li>
              <li>• Custom permissions created for the source laboratory</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-2 pt-4">
        <button
          @click="closeCloneTemplateModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancel
        </button>
        
        <button
          @click="clonePermissionTemplate"
          :disabled="!cloneTemplateForm.fromLaboratoryUid || saving"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {{ saving ? "Cloning..." : "Clone Template" }}
        </button>
      </div>
    </div>
  </div>
</template>