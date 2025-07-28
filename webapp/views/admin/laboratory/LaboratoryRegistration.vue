<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { LaboratoryType, UserType, OrganizationType, CountryType, ProvinceType, DistrictType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import { useSetupStore } from "@/stores/setup";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

// Mock GraphQL mutations - these would need to be generated from the backend schema
interface CreateLaboratoryMutation {
  createLaboratory: {
    __typename: "LaboratoryType" | "OperationError";
    uid?: string;
    name?: string;
    error?: string;
  };
}

interface CreateLaboratoryMutationVariables {
  payload: {
    name: string;
    organizationUid: string;
    tagLine?: string;
    email?: string;
    emailCc?: string;
    mobilePhone?: string;
    businessPhone?: string;
    labManagerUid?: string;
    address?: string;
    banking?: string;
    logo?: string;
    qualityStatement?: string;
    code?: string;
    countryUid?: string;
    provinceUid?: string;
    districtUid?: string;
  };
}

const CreateLaboratoryDocument = `
  mutation CreateLaboratory($payload: LaboratoryCreateInputType!) {
    createLaboratory(payload: $payload) {
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
        createdAt
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
const setupStore = useSetupStore();

// Fetch required data
userStore.fetchUsers({});
const users = computed(() => userStore.getUsers);

// Form state
const processing = ref(false);
const formLaboratory = reactive({
  name: "",
  organizationUid: "",
  tagLine: "",
  email: "",
  emailCc: "",
  mobilePhone: "",
  businessPhone: "",
  labManagerUid: "",
  address: "",
  banking: "",
  logo: "",
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

// Form validation
const isFormValid = computed(() => {
  return formLaboratory.name.trim() && formLaboratory.organizationUid;
});

// Save laboratory
const saveLaboratory = async () => {
  if (!isFormValid.value) {
    toastError("Please fill in all required fields");
    return;
  }

  processing.value = true;
  
  try {
    const result = await withClientMutation<CreateLaboratoryMutation, CreateLaboratoryMutationVariables>(
      CreateLaboratoryDocument,
      { payload: formLaboratory },
      "createLaboratory"
    );

    if (result.__typename === "LaboratoryType") {
      toastSuccess("Laboratory created successfully");
      router.push("/admin/laboratory-conf");
    } else {
      toastError(result.error || "Failed to create laboratory");
    }
  } catch (error) {
    console.error("Error creating laboratory:", error);
    toastError("Failed to create laboratory");
  } finally {
    processing.value = false;
  }
};

// Reset form
const resetForm = () => {
  Object.assign(formLaboratory, {
    name: "",
    organizationUid: "",
    tagLine: "",
    email: "",
    emailCc: "",
    mobilePhone: "",
    businessPhone: "",
    labManagerUid: "",
    address: "",
    banking: "",
    logo: "",
    qualityStatement: "",
    code: "",
    countryUid: "",
    provinceUid: "",
    districtUid: "",
  });
};

// Go back to laboratory listing
const goBack = () => {
  router.push("/admin/laboratory-conf");
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-foreground">Register New Laboratory</h2>
      <button 
        @click="goBack"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Back to Labs
      </button>
    </div>

    <hr class="border-border" />

    <form @submit.prevent="saveLaboratory" class="space-y-6">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">Basic Information</h3>
        
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">
              Laboratory Name *
            </label>
            <input
              v-model="formLaboratory.name"
              type="text"
              required
              placeholder="Enter laboratory name..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">
              Organization *
            </label>
            <select
              v-model="formLaboratory.organizationUid"
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Organization</option>
              <option 
                v-for="org in organizations" 
                :key="org.uid" 
                :value="org.uid"
              >
                {{ org.name }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Laboratory Code</label>
            <input
              v-model="formLaboratory.code"
              type="text"
              placeholder="Enter laboratory code..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Tag Line</label>
            <input
              v-model="formLaboratory.tagLine"
              type="text"
              placeholder="Enter tag line..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
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
              v-model="formLaboratory.email"
              type="email"
              placeholder="Enter laboratory email..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">CC Emails</label>
            <input
              v-model="formLaboratory.emailCc"
              type="text"
              placeholder="Enter CC emails..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Mobile Phone</label>
            <input
              v-model="formLaboratory.mobilePhone"
              type="tel"
              placeholder="Enter mobile phone..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Business Phone</label>
            <input
              v-model="formLaboratory.businessPhone"
              type="tel"
              placeholder="Enter business phone..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <!-- Management -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">Management</h3>
        
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Lab Manager</label>
          <select
            v-model="formLaboratory.labManagerUid"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Lab Manager</option>
            <option 
              v-for="user in users" 
              :key="user.uid" 
              :value="user.uid"
            >
              {{ user.firstName }} {{ user.lastName }}
            </option>
          </select>
        </div>
      </div>

      <!-- Address Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">Address Information</h3>
        
        <div class="grid grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Country</label>
            <select
              v-model="formLaboratory.countryUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Country</option>
              <option 
                v-for="country in countries" 
                :key="country.uid" 
                :value="country.uid"
              >
                {{ country.name }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Province/State</label>
            <select
              v-model="formLaboratory.provinceUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Province/State</option>
              <option 
                v-for="province in provinces" 
                :key="province.uid" 
                :value="province.uid"
              >
                {{ province.name }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">District/City</label>
            <select
              v-model="formLaboratory.districtUid"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select District/City</option>
              <option 
                v-for="district in districts" 
                :key="district.uid" 
                :value="district.uid"
              >
                {{ district.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Address</label>
          <textarea
            v-model="formLaboratory.address"
            rows="3"
            placeholder="Enter full address..."
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          ></textarea>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-foreground">Additional Information</h3>
        
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Banking Details</label>
            <textarea
              v-model="formLaboratory.banking"
              rows="3"
              placeholder="Enter banking details..."
              class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Quality Statement</label>
            <input
              v-model="formLaboratory.qualityStatement"
              type="text"
              placeholder="Enter quality statement..."
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
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
          {{ processing ? "Creating..." : "Create Laboratory" }}
        </button>
      </div>
    </form>
  </div>
</template>