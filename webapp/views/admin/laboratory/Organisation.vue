<script setup lang="ts">
import { reactive, ref, defineAsyncComponent, computed, watch } from "vue";
import { OrganizationType, OrganizationSettingType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import { useSetupStore } from "@/stores/setup";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";
import axiosInstance from "@/composables/axios";
import { EditOrganizationMutation, EditOrganizationMutationVariables, EditOrganizationDocument, EditOrganizationSettingDocument, EditOrganizationSettingMutation, EditOrganizationSettingMutationVariables } from "@/graphql/operations/_mutations";
import { PaymentStatus } from "@/graphql/schema";

const FelAsideTabs = defineAsyncComponent(
    () => import("@/components/ui/tabs/FelTabsAside.vue")
)

const { toastSuccess } = useNotifyToast();
const userStore = useUserStore();
const setupStore = useSetupStore();

setupStore.fetchOrganization();
const laboratory = computed(() => setupStore.getOrganization);

const formOrganization = reactive({ ...laboratory.value }) as OrganizationType;
const formSettings = reactive({ ...laboratory.value?.settings }) as OrganizationSettingType;
watch(
  () => laboratory.value?.uid,
  (anal, prev) => {
    Object.assign(formOrganization, laboratory.value);
    Object.assign(formSettings, laboratory.value?.settings)
  }
);

const { withClientMutation } = useApiUtil();
let processing = ref(false);
const saveOrganizationForm = () => {
  processing.value = true;
  const payload = { ...formOrganization };
  delete payload["uid"];
  delete payload["__typename"];
  delete payload["settings"];
  withClientMutation<EditOrganizationMutation, EditOrganizationMutationVariables>(EditOrganizationDocument, { uid: formOrganization.uid, payload }, "updateOrganization").then((result) => {
    setupStore.updateOrganization(result);
    processing.value = false;
    toastSuccess("Organization information updated");
  });
};



const saveSettingForm = () => {
  processing.value = true;
  const payload = { ...formSettings };
  delete payload["uid"];
  delete payload["__typename"];
  withClientMutation<EditOrganizationSettingMutation, EditOrganizationSettingMutationVariables>(EditOrganizationSettingDocument, { uid: formSettings.uid, payload }, "updateOrganizationSetting").then((result) => {
    setupStore.updateOrganizationSetting(result);
    processing.value = false;
    toastSuccess("Organization settings updated");
  });
};

userStore.fetchUsers({});
const users = computed(() => userStore.getUsers);

const currentTab = ref('general-info')
const items = [
  {
    id: 'general-info',
    label: 'Information',
    icon: 'fas fa-chart-bar',
  },
  {
    id: 'other-settings',
    label: 'Other',
    icon: 'fas fa-user-clock',
  },
  {
    id: 'logo-upload',
    label: 'Logo',
    icon: 'fas fa-image',
  }
]

// Logo upload state
const logoFile = ref<File | null>(null);
const logoPreview = ref<string | null>(null);
let logoUploading = ref(false);

const handleLogoFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    // Validate file type
    if (!file.type.match(/image\/png/)) {
      toastSuccess("Error: Only PNG files are allowed");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastSuccess("Error: File size exceeds 5MB limit");
      return;
    }

    logoFile.value = file;

    // Preview
    const reader = new FileReader();
    reader.onload = (event) => {
      logoPreview.value = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const uploadLogo = async () => {
  if (!logoFile.value) {
    toastSuccess("Error: No file selected");
    return;
  }

  logoUploading.value = true;

  try {
    const formData = new FormData();
    formData.append('file', logoFile.value);

    const response = await axiosInstance.post('setup/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if (response.data.success) {
      toastSuccess("Logo uploaded successfully");
      logoFile.value = null;
      logoPreview.value = null;
    } else {
      toastSuccess(`Error: ${response.data.message}`);
    }
  } catch (error) {
    toastSuccess(`Error uploading logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    logoUploading.value = false;
  }
};
</script>

<template>
  <FelAsideTabs
    title="Settings"
    :items="items"
    v-model="currentTab"
  >
    <section v-if="currentTab === 'general-info'" class="space-y-6">
      <h2 class="text-2xl font-semibold text-foreground">Organization Information</h2>
      <hr class="border-border">
      <form class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Organization Name</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formOrganization.name" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Tag Line</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formOrganization.tagLine" placeholder="Tag Line ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Organization Email</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formOrganization.email" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">CC Emails</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formOrganization.emailCc" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Lab Mobile Phone</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formOrganization.mobilePhone" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Lab Business Phone</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formOrganization.businessPhone" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Address</span>
            <textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formOrganization.address"
              placeholder="Address ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Banking Details</span>
            <textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formOrganization.banking"
              placeholder="Banking ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Quality Statement</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formOrganization.qualityStatement" placeholder="Quality Statement ..."
              :disabled="processing" />
          </label>
        </div>
        <hr class="border-border" />
        <button v-show="!processing" type="button" @click.prevent="saveOrganizationForm()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Update
        </button>
      </form>
    </section>

    <section v-if="currentTab === 'logo-upload'" class="space-y-6">
      <h2 class="text-2xl font-semibold text-foreground">Organization Logo</h2>
      <hr class="border-border">
      <div class="space-y-6">
        <div class="space-y-3">
          <label class="block">
            <span class="text-sm font-medium text-foreground mb-2 block">Upload Logo (PNG only, max 5MB)</span>
            <input
              type="file"
              accept=".png,image/png"
              @change="handleLogoFileSelect"
              :disabled="logoUploading"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        </div>

        <div v-if="logoPreview" class="space-y-3">
          <p class="text-sm font-medium text-foreground">Preview:</p>
          <div class="flex items-center justify-center p-4 border border-border rounded-md bg-muted">
            <img :src="logoPreview" alt="Logo preview" class="max-h-40 max-w-xs" />
          </div>
        </div>

        <div class="space-y-2 text-sm text-muted-foreground">
          <p><strong>Requirements:</strong></p>
          <ul class="list-disc list-inside space-y-1">
            <li>File format: PNG only</li>
            <li>Maximum size: 5MB</li>
            <li>File will be saved as logo.png in assets/custom/</li>
          </ul>
        </div>

        <hr class="border-border" />

        <button
          v-show="!logoUploading && logoFile"
          type="button"
          @click="uploadLogo"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Upload Logo
        </button>

        <div v-if="logoUploading" class="text-sm text-muted-foreground">
          Uploading...
        </div>
      </div>
    </section>

    <section v-if="currentTab === 'other-settings'" class="space-y-6">
      <h2 class="text-2xl font-semibold text-foreground">Other Settings</h2>
      <hr class="border-border">
      <form class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Password Lifetime (days)</span>
            <input type="number" min="0" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formSettings.passwordLifetime"
              placeholder="Name ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Inactivity Auto Logout (minutes)</span>
            <input type="number" min="0" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formSettings.inactivityLogOut"
              placeholder="Name ..." :disabled="processing" />
          </label>
          <span class="block col-span-1"></span>
        </div>
        <hr class="border-border" />
        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="formSettings.allowBilling" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Enable Sample Billing</span>
            </div>
          </label>
          <label class="block col-span-1 space-y-2"> 
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="formSettings.allowAutoBilling" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Allow automatic billing on sample registration</span>
            </div>
          </label>

          <label class="block col-span-1 space-y-2"> 
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="formSettings.processBilledOnly" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Only process billed analysis requests</span>
            </div>
          </label>
          <div class="block col-span-1 space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Minimum Allowed Payment status
            </label>
            <select 
              v-model="formSettings.minPaymentStatus"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select Payment Status</option>
              <option v-for="pstatus in [PaymentStatus.Unpaid, PaymentStatus.Partial, PaymentStatus.Paid]" 
              :key="pstatus" :value="pstatus">{{ pstatus }}</option>
            </select>
          </div>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Minimum Partial Percentage</span>
            <input type="number" min="0.0" max="1.0" step="0.1" default="0.5" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
            v-model="formSettings.minPartialPerentage" :disabled="processing" />
          </label>

          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Currency</span>
            <input type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
            v-model="formSettings.currency" :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Payment Terms (Days)</span>
            <input type="number" min="0" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
            v-model="formSettings.paymentTermsDays" :disabled="processing" />
          </label>
        </div>
        <hr class="border-border" />
        <button v-show="!processing" type="button" @click.prevent="saveSettingForm()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Update
        </button>
      </form>
    </section>
  </FelAsideTabs>
</template>
