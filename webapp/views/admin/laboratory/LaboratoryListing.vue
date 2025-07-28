<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { LaboratoryType, UserType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

// Mock GraphQL operations - these would need to be generated from the backend schema
interface LaboratoryAllQuery {
  laboratoryAll: {
    items: LaboratoryType[];
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

interface LaboratoryAllQueryVariables {
  pageSize?: number;
  afterCursor?: string;
  beforeCursor?: string;
  text?: string;
  organizationUid?: string;
}

interface UpdateLaboratoryMutation {
  updateLaboratory: {
    __typename: "LaboratoryType" | "OperationError";
    uid?: string;
    name?: string;
    error?: string;
  };
}

interface UpdateLaboratoryMutationVariables {
  uid: string;
  payload: Partial<LaboratoryType>;
}

interface DeleteLaboratoryMutation {
  deleteLaboratory: {
    __typename: "DeletedType" | "OperationError";
    uid?: string;
    error?: string;
  };
}

interface DeleteLaboratoryMutationVariables {
  uid: string;
}

const LaboratoryAllDocument = `
  query LaboratoryAll($pageSize: Int, $afterCursor: String, $beforeCursor: String, $text: String, $organizationUid: String) {
    laboratoryAll(pageSize: $pageSize, afterCursor: $afterCursor, beforeCursor: $beforeCursor, text: $text, organizationUid: $organizationUid) {
      items {
        uid
        name
        organizationUid
        tagLine
        email
        emailCc
        mobilePhone
        businessPhone
        labManagerUid
        labManager {
          uid
          firstName
          lastName
          email
        }
        address
        banking
        logo
        qualityStatement
        code
        countryUid
        provinceUid
        districtUid
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

const UpdateLaboratoryDocument = `
  mutation UpdateLaboratory($uid: String!, $payload: LaboratoryInputType!) {
    updateLaboratory(uid: $uid, payload: $payload) {
      ... on LaboratoryType {
        uid
        name
        organizationUid
        tagLine
        email
        emailCc
        mobilePhone
        businessPhone
        labManagerUid
        address
        banking
        logo
        qualityStatement
        code
        countryUid
        provinceUid
        districtUid
        updatedAt
      }
      ... on OperationError {
        error
      }
    }
  }
`;

const DeleteLaboratoryDocument = `
  mutation DeleteLaboratory($uid: String!) {
    deleteLaboratory(uid: $uid) {
      ... on DeletedType {
        uid
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

// Fetch users for lab manager dropdown
userStore.fetchUsers({});
const users = computed(() => userStore.getUsers);

// State
const laboratories = ref<LaboratoryType[]>([]);
const loading = ref(false);
const totalCount = ref(0);
const pageSize = ref(20);
const currentPage = ref(1);

// Search and filters
const searchText = ref("");
const selectedOrganization = ref("");

// Mock organizations - in real implementation, these would come from GraphQL queries
const organizations = ref([
  { uid: "org1", name: "Main Organization" },
  { uid: "org2", name: "Branch Organization" },
]);

// Modal state
const editingLaboratory = ref<LaboratoryType | null>(null);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const deletingLaboratory = ref<LaboratoryType | null>(null);

// Edit form
const editForm = reactive({
  name: "",
  tagLine: "",
  email: "",
  emailCc: "",
  mobilePhone: "",
  businessPhone: "",
  labManagerUid: "",
  address: "",
  banking: "",
  qualityStatement: "",
  code: "",
});

// Computed
const filteredLaboratories = computed(() => {
  let filtered = [...laboratories.value];
  
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    filtered = filtered.filter(lab => 
      lab.name?.toLowerCase().includes(search) ||
      lab.email?.toLowerCase().includes(search) ||
      lab.code?.toLowerCase().includes(search)
    );
  }
  
  return filtered;
});

const hasNextPage = ref(false);
const hasPreviousPage = ref(false);

// Methods
const fetchLaboratories = async () => {
  loading.value = true;
  
  try {
    const variables: LaboratoryAllQueryVariables = {
      pageSize: pageSize.value,
      text: searchText.value || undefined,
      organizationUid: selectedOrganization.value || undefined,
    };

    const result = await withClientQuery<LaboratoryAllQuery, LaboratoryAllQueryVariables>(
      LaboratoryAllDocument,
      variables
    );

    laboratories.value = result.laboratoryAll.items;
    totalCount.value = result.laboratoryAll.totalCount;
    hasNextPage.value = result.laboratoryAll.pageInfo.hasNextPage;
    hasPreviousPage.value = result.laboratoryAll.pageInfo.hasPreviousPage;
  } catch (error) {
    console.error("Error fetching laboratories:", error);
    toastError("Failed to fetch laboratories");
  } finally {
    loading.value = false;
  }
};

const searchLaboratories = () => {
  currentPage.value = 1;
  fetchLaboratories();
};

const openEditModal = (laboratory: LaboratoryType) => {
  editingLaboratory.value = laboratory;
  Object.assign(editForm, {
    name: laboratory.name || "",
    tagLine: laboratory.tagLine || "",
    email: laboratory.email || "",
    emailCc: laboratory.emailCc || "",
    mobilePhone: laboratory.mobilePhone || "",
    businessPhone: laboratory.businessPhone || "",
    labManagerUid: laboratory.labManagerUid || "",
    address: laboratory.address || "",
    banking: laboratory.banking || "",
    qualityStatement: laboratory.qualityStatement || "",
    code: laboratory.code || "",
  });
  showEditModal.value = true;
};

const closeEditModal = () => {
  editingLaboratory.value = null;
  showEditModal.value = false;
  Object.assign(editForm, {
    name: "",
    tagLine: "",
    email: "",
    emailCc: "",
    mobilePhone: "",
    businessPhone: "",
    labManagerUid: "",
    address: "",
    banking: "",
    qualityStatement: "",
    code: "",
  });
};

const saveEditLaboratory = async () => {
  if (!editingLaboratory.value) return;
  
  loading.value = true;
  
  try {
    const result = await withClientMutation<UpdateLaboratoryMutation, UpdateLaboratoryMutationVariables>(
      UpdateLaboratoryDocument,
      {
        uid: editingLaboratory.value.uid,
        payload: editForm
      },
      "updateLaboratory"
    );

    if (result.__typename === "LaboratoryType") {
      toastSuccess("Laboratory updated successfully");
      closeEditModal();
      fetchLaboratories();
    } else {
      toastError(result.error || "Failed to update laboratory");
    }
  } catch (error) {
    console.error("Error updating laboratory:", error);
    toastError("Failed to update laboratory");
  } finally {
    loading.value = false;
  }
};

const openDeleteModal = (laboratory: LaboratoryType) => {
  deletingLaboratory.value = laboratory;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  deletingLaboratory.value = null;
  showDeleteModal.value = false;
};

const confirmDeleteLaboratory = async () => {
  if (!deletingLaboratory.value) return;
  
  loading.value = true;
  
  try {
    const result = await withClientMutation<DeleteLaboratoryMutation, DeleteLaboratoryMutationVariables>(
      DeleteLaboratoryDocument,
      { uid: deletingLaboratory.value.uid },
      "deleteLaboratory"
    );

    if (result.__typename === "DeletedType") {
      toastSuccess("Laboratory deleted successfully");
      closeDeleteModal();
      fetchLaboratories();
    } else {
      toastError(result.error || "Failed to delete laboratory");
    }
  } catch (error) {
    console.error("Error deleting laboratory:", error);
    toastError("Failed to delete laboratory");
  } finally {
    loading.value = false;
  }
};

const navigateToRegistration = () => {
  router.push("/admin/laboratory-registration");
};

const viewLaboratoryDetails = (laboratory: LaboratoryType) => {
  router.push(`/admin/laboratory/${laboratory.uid}`);
};

const getManagerName = (laboratory: LaboratoryType) => {
  if (laboratory.labManager) {
    return `${laboratory.labManager.firstName} ${laboratory.labManager.lastName}`;
  }
  return "No Manager Assigned";
};

// Lifecycle
onMounted(() => {
  fetchLaboratories();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-foreground">Laboratory Management</h2>
        <p class="text-sm text-muted-foreground">Manage laboratories and their configurations</p>
      </div>
      <button 
        @click="navigateToRegistration"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        <i class="fas fa-plus mr-2"></i>
        Register New Laboratory
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="flex items-center space-x-4">
      <div class="flex-1">
        <div class="relative">
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
          <input
            v-model="searchText"
            @input="searchLaboratories"
            type="text"
            placeholder="Search laboratories by name, email, or code..."
            class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
      
      <div class="w-48">
        <select
          v-model="selectedOrganization"
          @change="searchLaboratories"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All Organizations</option>
          <option v-for="org in organizations" :key="org.uid" :value="org.uid">
            {{ org.name }}
          </option>
        </select>
      </div>
      
      <button
        @click="fetchLaboratories"
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
          <h3 class="tracking-tight text-sm font-medium">Total Labs</h3>
          <i class="fas fa-building text-muted-foreground"></i>
        </div>
        <div class="text-2xl font-bold">{{ totalCount }}</div>
      </div>
      
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">Active Labs</h3>
          <i class="fas fa-check-circle text-green-500"></i>
        </div>
        <div class="text-2xl font-bold">{{ filteredLaboratories.length }}</div>
      </div>
      
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">With Managers</h3>
          <i class="fas fa-user-tie text-blue-500"></i>
        </div>
        <div class="text-2xl font-bold">{{ filteredLaboratories.filter(lab => lab.labManagerUid).length }}</div>
      </div>
      
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div class="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="tracking-tight text-sm font-medium">Recent</h3>
          <i class="fas fa-clock text-amber-500"></i>
        </div>
        <div class="text-2xl font-bold">{{ filteredLaboratories.filter(lab => {
          if (!lab.createdAt) return false;
          const created = new Date(lab.createdAt);
          const dayAgo = new Date();
          dayAgo.setDate(dayAgo.getDate() - 7);
          return created > dayAgo;
        }).length }}</div>
      </div>
    </div>

    <!-- Laboratory Table -->
    <div class="rounded-md border border-border">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b border-border bg-muted/50">
            <tr>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Code</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Manager</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
              <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="loading">
              <td colspan="6" class="p-8 text-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Loading laboratories...
              </td>
            </tr>
            
            <tr v-else-if="filteredLaboratories.length === 0">
              <td colspan="6" class="p-8 text-center text-muted-foreground">
                <i class="fas fa-building mb-2 block text-2xl"></i>
                No laboratories found
              </td>
            </tr>
            
            <tr v-else v-for="laboratory in filteredLaboratories" :key="laboratory.uid" class="hover:bg-muted/50">
              <td class="p-4 align-middle">
                <div>
                  <div class="font-medium">{{ laboratory.name }}</div>
                  <div v-if="laboratory.tagLine" class="text-sm text-muted-foreground">{{ laboratory.tagLine }}</div>
                </div>
              </td>
              
              <td class="p-4 align-middle">
                <span v-if="laboratory.code" class="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                  {{ laboratory.code }}
                </span>
                <span v-else class="text-muted-foreground">-</span>
              </td>
              
              <td class="p-4 align-middle">
                <div class="text-sm">{{ getManagerName(laboratory) }}</div>
              </td>
              
              <td class="p-4 align-middle">
                <div class="text-sm">
                  <div v-if="laboratory.email">{{ laboratory.email }}</div>
                  <div v-if="laboratory.mobilePhone" class="text-muted-foreground">{{ laboratory.mobilePhone }}</div>
                </div>
              </td>
              
              <td class="p-4 align-middle">
                <div class="text-sm text-muted-foreground">
                  {{ laboratory.createdAt ? new Date(laboratory.createdAt).toLocaleDateString() : '-' }}
                </div>
              </td>
              
              <td class="p-4 align-middle">
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewLaboratoryDetails(laboratory)"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    title="View Details"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  
                  <button
                    @click="openEditModal(laboratory)"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    title="Edit Laboratory"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  
                  <button
                    @click="openDeleteModal(laboratory)"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive hover:text-destructive-foreground h-8 w-8"
                    title="Delete Laboratory"
                  >
                    <i class="fas fa-trash"></i>
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
        Showing {{ Math.min(pageSize, filteredLaboratories.length) }} of {{ totalCount }} laboratories
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          :disabled="!hasPreviousPage || loading"
          @click="currentPage--; fetchLaboratories()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <span class="text-sm">Page {{ currentPage }}</span>
        
        <button
          :disabled="!hasNextPage || loading"
          @click="currentPage++; fetchLaboratories()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Edit Modal -->
  <div v-if="showEditModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Edit Laboratory</h3>
        <p class="text-sm text-muted-foreground">Update laboratory information</p>
      </div>
      
      <form @submit.prevent="saveEditLaboratory" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Name</label>
            <input
              v-model="editForm.name"
              type="text"
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Code</label>
            <input
              v-model="editForm.code"
              type="text"
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
        
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Lab Manager</label>
          <select
            v-model="editForm.labManagerUid"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Lab Manager</option>
            <option v-for="user in users" :key="user.uid" :value="user.uid">
              {{ user.firstName }} {{ user.lastName }}
            </option>
          </select>
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

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-lg font-semibold leading-none tracking-tight">Confirm Deletion</h3>
        <p class="text-sm text-muted-foreground">
          Are you sure you want to delete "{{ deletingLaboratory?.name }}"? This action cannot be undone.
        </p>
      </div>
      
      <div class="flex justify-end space-x-2 pt-4">
        <button
          @click="closeDeleteModal"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Cancel
        </button>
        
        <button
          @click="confirmDeleteLaboratory"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
        >
          Delete Laboratory
        </button>
      </div>
    </div>
  </div>
</template>