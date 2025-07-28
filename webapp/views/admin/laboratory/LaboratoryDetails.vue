<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { LaboratoryType, UserType, OrganizationType, CountryType, ProvinceType, DistrictType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

// Mock GraphQL operations - these would need to be generated from the backend schema
interface LaboratoryQuery {
  laboratory: LaboratoryType;
}

interface LaboratoryQueryVariables {
  uid: string;
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

const GetLaboratoryDocument = `
  query GetLaboratory($uid: String!) {
    laboratory(uid: $uid) {
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

const { toastSuccess, toastError } = useNotifyToast();
const { withClientQuery, withClientMutation } = useApiUtil();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// Fetch users for lab manager dropdown
userStore.fetchUsers({});
const users = computed(() => userStore.getUsers);

// State
const laboratory = ref<LaboratoryType | null>(null);
const loading = ref(false);
const saving = ref(false);
const isEditing = ref(false);

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
  countryUid: "",
  provinceUid: "",
  districtUid: "",
});

// Mock data - in real implementation, these would come from GraphQL queries
const organizations = ref<OrganizationType[]>([
  { uid: "org1", name: "Main Organization", setupName: "felicity" }
]);

const countries = ref<CountryType[]>([
  { uid: "country1", name: "United States", code: "US" },
  { uid: "country2", name: "Canada", code: "CA" },
]);

const provinces = ref<ProvinceType[]>([]);
const districts = ref<DistrictType[]>([]);

// Computed
const laboratoryUid = computed(() => route.params.uid as string);

const getOrganizationName = (orgUid: string) => {
  const org = organizations.value.find(o => o.uid === orgUid);
  return org?.name || "Unknown Organization";
};

const getCountryName = (countryUid: string) => {
  const country = countries.value.find(c => c.uid === countryUid);
  return country?.name || "";
};

const getManagerName = (lab: LaboratoryType) => {
  if (lab.labManager) {
    return `${lab.labManager.firstName} ${lab.labManager.lastName}`;
  }
  return "No Manager Assigned";
};

// Methods
const fetchLaboratory = async () => {
  if (!laboratoryUid.value) return;
  
  loading.value = true;
  
  try {
    const result = await withClientQuery<LaboratoryQuery, LaboratoryQueryVariables>(
      GetLaboratoryDocument,
      { uid: laboratoryUid.value }
    );

    laboratory.value = result.laboratory;
    
    // Populate edit form
    if (laboratory.value) {
      Object.assign(editForm, {
        name: laboratory.value.name || "",
        tagLine: laboratory.value.tagLine || "",
        email: laboratory.value.email || "",
        emailCc: laboratory.value.emailCc || "",
        mobilePhone: laboratory.value.mobilePhone || "",
        businessPhone: laboratory.value.businessPhone || "",
        labManagerUid: laboratory.value.labManagerUid || "",
        address: laboratory.value.address || "",
        banking: laboratory.value.banking || "",
        qualityStatement: laboratory.value.qualityStatement || "",
        code: laboratory.value.code || "",
        countryUid: laboratory.value.countryUid || "",
        provinceUid: laboratory.value.provinceUid || "",
        districtUid: laboratory.value.districtUid || "",
      });
    }
  } catch (error) {
    console.error("Error fetching laboratory:", error);
    toastError("Failed to fetch laboratory details");
  } finally {
    loading.value = false;
  }
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  
  if (!isEditing.value && laboratory.value) {
    // Reset form when canceling edit
    Object.assign(editForm, {
      name: laboratory.value.name || "",
      tagLine: laboratory.value.tagLine || "",
      email: laboratory.value.email || "",
      emailCc: laboratory.value.emailCc || "",
      mobilePhone: laboratory.value.mobilePhone || "",
      businessPhone: laboratory.value.businessPhone || "",
      labManagerUid: laboratory.value.labManagerUid || "",
      address: laboratory.value.address || "",
      banking: laboratory.value.banking || "",
      qualityStatement: laboratory.value.qualityStatement || "",
      code: laboratory.value.code || "",
      countryUid: laboratory.value.countryUid || "",
      provinceUid: laboratory.value.provinceUid || "",
      districtUid: laboratory.value.districtUid || "",
    });
  }
};

const saveLaboratory = async () => {
  if (!laboratory.value) return;
  
  saving.value = true;
  
  try {
    const result = await withClientMutation<UpdateLaboratoryMutation, UpdateLaboratoryMutationVariables>(
      UpdateLaboratoryDocument,
      {
        uid: laboratory.value.uid,
        payload: editForm
      },
      "updateLaboratory"
    );

    if (result.__typename === "LaboratoryType") {
      toastSuccess("Laboratory updated successfully");
      isEditing.value = false;
      fetchLaboratory(); // Refresh data
    } else {
      toastError(result.error || "Failed to update laboratory");
    }
  } catch (error) {
    console.error("Error updating laboratory:", error);
    toastError("Failed to update laboratory");
  } finally {
    saving.value = false;
  }
};

const goBack = () => {
  router.push("/admin/laboratory-conf");
};

// Lifecycle
onMounted(() => {
  fetchLaboratory();
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
            {{ laboratory?.name || "Laboratory Details" }}
          </h2>
          <p class="text-sm text-muted-foreground">View and manage laboratory information</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <button
          v-if="!isEditing"
          @click="toggleEdit"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          <i class="fas fa-edit mr-2"></i>
          Edit Laboratory
        </button>
        
        <div v-if="isEditing" class="flex items-center space-x-2">
          <button
            @click="toggleEdit"
            :disabled="saving"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Cancel
          </button>
          
          <button
            @click="saveLaboratory"
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
        <p class="text-muted-foreground">Loading laboratory details...</p>
      </div>
    </div>

    <!-- Laboratory Details -->
    <div v-else-if="laboratory" class="space-y-8">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">Basic Information</h3>
        
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Laboratory Name</label>
            <input
              v-if="isEditing"
              v-model="editForm.name"
              type="text"
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div v-else class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ laboratory.name || "-" }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Organization</label>
            <div class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ getOrganizationName(laboratory.organizationUid || "") }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Laboratory Code</label>
            <input
              v-if="isEditing"
              v-model="editForm.code"
              type="text"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div v-else class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ laboratory.code || "-" }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Tag Line</label>
            <input
              v-if="isEditing"
              v-model="editForm.tagLine"
              type="text"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div v-else class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ laboratory.tagLine || "-" }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">Contact Information</h3>
        
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Laboratory Email</label>
            <input
              v-if="isEditing"
              v-model="editForm.email"
              type="email"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div v-else class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ laboratory.email || "-" }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">CC Emails</label>
            <input
              v-if="isEditing"
              v-model="editForm.emailCc"
              type="text"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div v-else class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ laboratory.emailCc || "-" }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Mobile Phone</label>
            <input
              v-if="isEditing"
              v-model="editForm.mobilePhone"
              type="tel"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div v-else class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ laboratory.mobilePhone || "-" }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Business Phone</label>
            <input
              v-if="isEditing"
              v-model="editForm.businessPhone"
              type="tel"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div v-else class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ laboratory.businessPhone || "-" }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Management -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">Management</h3>
        
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Lab Manager</label>
          <select
            v-if="isEditing"
            v-model="editForm.labManagerUid"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Lab Manager</option>
            <option v-for="user in users" :key="user.uid" :value="user.uid">
              {{ user.firstName }} {{ user.lastName }}
            </option>
          </select>
          <div v-else class="p-3 bg-muted/50 rounded-md">
            <span class="text-sm">{{ getManagerName(laboratory) }}</span>
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">Address Information</h3>
        
        <div class="grid grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Country</label>
            <select
              v-if="isEditing"
              v-model="editForm.countryUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Country</option>
              <option v-for="country in countries" :key="country.uid" :value="country.uid">
                {{ country.name }}
              </option>
            </select>
            <div v-else class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ getCountryName(laboratory.countryUid || "") || "-" }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Province/State</label>
            <select
              v-if="isEditing"
              v-model="editForm.provinceUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Province/State</option>
              <option v-for="province in provinces" :key="province.uid" :value="province.uid">
                {{ province.name }}
              </option>
            </select>
            <div v-else class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ laboratory.provinceUid || "-" }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">District/City</label>
            <select
              v-if="isEditing"
              v-model="editForm.districtUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select District/City</option>
              <option v-for="district in districts" :key="district.uid" :value="district.uid">
                {{ district.name }}
              </option>
            </select>
            <div v-else class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ laboratory.districtUid || "-" }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Address</label>
          <textarea
            v-if="isEditing"
            v-model="editForm.address"
            rows="3"
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          ></textarea>
          <div v-else class="p-3 bg-muted/50 rounded-md min-h-[80px]">
            <span class="text-sm whitespace-pre-wrap">{{ laboratory.address || "-" }}</span>
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">Additional Information</h3>
        
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Banking Details</label>
            <textarea
              v-if="isEditing"
              v-model="editForm.banking"
              rows="3"
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            ></textarea>
            <div v-else class="p-3 bg-muted/50 rounded-md min-h-[80px]">
              <span class="text-sm whitespace-pre-wrap">{{ laboratory.banking || "-" }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Quality Statement</label>
            <input
              v-if="isEditing"
              v-model="editForm.qualityStatement"
              type="text"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div v-else class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ laboratory.qualityStatement || "-" }}</span>
            </div>
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
              <span class="text-sm">{{ laboratory.createdAt ? new Date(laboratory.createdAt).toLocaleString() : "-" }}</span>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Last Updated</label>
            <div class="p-3 bg-muted/50 rounded-md">
              <span class="text-sm">{{ laboratory.updatedAt ? new Date(laboratory.updatedAt).toLocaleString() : "-" }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-2xl mb-4 text-destructive"></i>
        <p class="text-muted-foreground">Laboratory not found</p>
      </div>
    </div>
  </div>
</template>