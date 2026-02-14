<script setup lang="ts">
import { ref, defineAsyncComponent, computed, watch } from "vue";
import { LaboratoryType, LaboratorySettingType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import { useSetupStore } from "@/stores/setup";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";
import { EditLaboratoryMutation, EditLaboratoryMutationVariables, EditLaboratoryDocument, EditLaboratorySettingDocument, EditLaboratorySettingMutation, EditLaboratorySettingMutationVariables } from "@/graphql/operations/_mutations";
import { PaymentStatus } from "@/graphql/schema";
import { useField, useForm } from "vee-validate";
import { boolean, number, object, string } from "yup";

const FelAsideTabs = defineAsyncComponent(
    () => import("@/components/ui/tabs/BeakTabsAside.vue")
)

const { toastSuccess } = useNotifyToast();
const userStore = useUserStore();
const setupStore = useSetupStore();

setupStore.fetchLaboratory();
const laboratory = computed(() => setupStore.getLaboratory);

const labUid = ref<string | null>(null);
const settingUid = ref<string | null>(null);

const labSchema = object({
  name: string().required("Laboratory name is required"),
  tagLine: string().nullable(),
  labManagerUid: string().nullable(),
  email: string().nullable(),
  emailCc: string().nullable(),
  mobilePhone: string().nullable(),
  businessPhone: string().nullable(),
  address: string().nullable(),
  banking: string().nullable(),
  qualityStatement: string().nullable(),
});

const {
  handleSubmit: handleLabSubmit,
  setValues: setLabValues,
} = useForm({
  validationSchema: labSchema,
  initialValues: {
    name: "",
    tagLine: "",
    labManagerUid: null,
    email: "",
    emailCc: "",
    mobilePhone: "",
    businessPhone: "",
    address: "",
    banking: "",
    qualityStatement: "",
  },
});

const { value: name } = useField<string>("name");
const { value: tagLine } = useField<string | null>("tagLine");
const { value: labManagerUid } = useField<string | null>("labManagerUid");
const { value: email } = useField<string | null>("email");
const { value: emailCc } = useField<string | null>("emailCc");
const { value: mobilePhone } = useField<string | null>("mobilePhone");
const { value: businessPhone } = useField<string | null>("businessPhone");
const { value: address } = useField<string | null>("address");
const { value: banking } = useField<string | null>("banking");
const { value: qualityStatement } = useField<string | null>("qualityStatement");

const settingSchema = object({
  defaultRoute: string().nullable(),
  defaultTheme: string().nullable(),
  passwordLifetime: number().min(0, "Must be 0 or greater").nullable(),
  inactivityLogOut: number().min(0, "Must be 0 or greater").nullable(),
  stickerCopies: number().min(0, "Must be 0 or greater").nullable(),
  allowSelfVerification: boolean().nullable(),
  allowPatientRegistration: boolean().nullable(),
  allowSampleRegistration: boolean().nullable(),
  allowWorksheetCreation: boolean().nullable(),
  autoReceiveSamples: boolean().nullable(),
  allowBilling: boolean().nullable(),
  allowAutoBilling: boolean().nullable(),
  processBilledOnly: boolean().nullable(),
  minPaymentStatus: string().nullable(),
  minPartialPerentage: number().min(0, "Must be 0 or greater").nullable(),
  currency: string().nullable(),
  paymentTermsDays: number().min(0, "Must be 0 or greater").nullable(),
});

const {
  handleSubmit: handleSettingsSubmit,
  setValues: setSettingValues,
} = useForm({
  validationSchema: settingSchema,
  initialValues: {
    defaultRoute: "",
    defaultTheme: "",
    passwordLifetime: null,
    inactivityLogOut: null,
    stickerCopies: null,
    allowSelfVerification: false,
    allowPatientRegistration: false,
    allowSampleRegistration: false,
    allowWorksheetCreation: false,
    autoReceiveSamples: false,
    allowBilling: false,
    allowAutoBilling: false,
    processBilledOnly: false,
    minPaymentStatus: "",
    minPartialPerentage: null,
    currency: "",
    paymentTermsDays: null,
  },
});

const { value: defaultRoute } = useField<string | null>("defaultRoute");
const { value: defaultTheme } = useField<string | null>("defaultTheme");
const { value: passwordLifetime } = useField<number | null>("passwordLifetime");
const { value: inactivityLogOut } = useField<number | null>("inactivityLogOut");
const { value: stickerCopies } = useField<number | null>("stickerCopies");
const { value: allowSelfVerification } = useField<boolean | null>("allowSelfVerification");
const { value: allowPatientRegistration } = useField<boolean | null>("allowPatientRegistration");
const { value: allowSampleRegistration } = useField<boolean | null>("allowSampleRegistration");
const { value: allowWorksheetCreation } = useField<boolean | null>("allowWorksheetCreation");
const { value: autoReceiveSamples } = useField<boolean | null>("autoReceiveSamples");
const { value: allowBilling } = useField<boolean | null>("allowBilling");
const { value: allowAutoBilling } = useField<boolean | null>("allowAutoBilling");
const { value: processBilledOnly } = useField<boolean | null>("processBilledOnly");
const { value: minPaymentStatus } = useField<string | null>("minPaymentStatus");
const { value: minPartialPerentage } = useField<number | null>("minPartialPerentage");
const { value: currency } = useField<string | null>("currency");
const { value: paymentTermsDays } = useField<number | null>("paymentTermsDays");

watch(
  () => laboratory.value?.uid,
  (anal, prev) => {
    const currentLab = laboratory.value as LaboratoryType | undefined;
    labUid.value = currentLab?.uid ?? null;
    settingUid.value = currentLab?.settings?.uid ?? null;
    setLabValues({
      name: currentLab?.name ?? "",
      tagLine: currentLab?.tagLine ?? "",
      labManagerUid: currentLab?.labManagerUid ?? null,
      email: currentLab?.email ?? "",
      emailCc: currentLab?.emailCc ?? "",
      mobilePhone: currentLab?.mobilePhone ?? "",
      businessPhone: currentLab?.businessPhone ?? "",
      address: currentLab?.address ?? "",
      banking: currentLab?.banking ?? "",
      qualityStatement: currentLab?.qualityStatement ?? "",
    });
    setSettingValues({
      defaultRoute: currentLab?.settings?.defaultRoute ?? "",
      defaultTheme: currentLab?.settings?.defaultTheme ?? "",
      passwordLifetime: currentLab?.settings?.passwordLifetime ?? null,
      inactivityLogOut: currentLab?.settings?.inactivityLogOut ?? null,
      stickerCopies: currentLab?.settings?.stickerCopies ?? null,
      allowSelfVerification: currentLab?.settings?.allowSelfVerification ?? false,
      allowPatientRegistration: currentLab?.settings?.allowPatientRegistration ?? false,
      allowSampleRegistration: currentLab?.settings?.allowSampleRegistration ?? false,
      allowWorksheetCreation: currentLab?.settings?.allowWorksheetCreation ?? false,
      autoReceiveSamples: currentLab?.settings?.autoReceiveSamples ?? false,
      allowBilling: currentLab?.settings?.allowBilling ?? false,
      allowAutoBilling: currentLab?.settings?.allowAutoBilling ?? false,
      processBilledOnly: currentLab?.settings?.processBilledOnly ?? false,
      minPaymentStatus: currentLab?.settings?.minPaymentStatus ?? "",
      minPartialPerentage: currentLab?.settings?.minPartialPerentage ?? null,
      currency: currentLab?.settings?.currency ?? "",
      paymentTermsDays: currentLab?.settings?.paymentTermsDays ?? null,
    });
  }
);

const { withClientMutation } = useApiUtil();
let processing = ref(false);
const saveLaboratoryForm = handleLabSubmit((values) => {
  processing.value = true;
  if (!labUid.value) {
    processing.value = false;
    return;
  }
  const payload = {
    ...values,
  } as LaboratoryType;
  withClientMutation<EditLaboratoryMutation, EditLaboratoryMutationVariables>(EditLaboratoryDocument, { uid: labUid.value, payload }, "updateLaboratory").then((result) => {
    setupStore.updateLaboratory(result);
    processing.value = false;
    toastSuccess("Laboratory information updated");
  });
});



const saveSettingForm = handleSettingsSubmit((values) => {
  processing.value = true;
  if (!settingUid.value) {
    processing.value = false;
    return;
  }
  const payload = {
    ...values,
  } as LaboratorySettingType;
  withClientMutation<EditLaboratorySettingMutation, EditLaboratorySettingMutationVariables>(EditLaboratorySettingDocument, { uid: settingUid.value, payload }, "updateLaboratorySetting").then((result) => {
    setupStore.updateLaboratorySetting(result);
    processing.value = false;
    toastSuccess("Laboratory settings updated");
  });
});

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
  }
]
</script>

<template>
  <FelAsideTabs
    title="Settings"
    :items="items"
    v-model="currentTab"
  >
    <section v-if="currentTab === 'general-info'" class="space-y-6">
      <h2 class="text-2xl font-semibold text-foreground">Laboratory Information</h2>
      <hr class="border-border">
      <form class="space-y-6" @submit.prevent="saveLaboratoryForm">
        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Laboratory Name</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="name" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Tag Line</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="tagLine" placeholder="Tag Line ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Lab Manager</span>
            <div class="w-full">
              <select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="labManagerUid" :disabled="processing">
                <option></option>
                <option v-for="user in users" :key="user?.uid" :value="user.uid">
                  {{ user?.firstName }} {{ user?.lastName }}
                </option>
              </select>
            </div>
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Laboratory Email</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="email" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">CC Emails</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="emailCc" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Lab Mobile Phone</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="mobilePhone" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Lab Business Phone</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="businessPhone" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Address</span>
            <textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="address"
              placeholder="Address ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Banking Details</span>
            <textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="banking"
              placeholder="Banking ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Quality Statement</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="qualityStatement" placeholder="Quality Statement ..."
              :disabled="processing" />
          </label>
        </div>
        <hr class="border-border" />
        <button v-show="!processing" type="submit"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Update
        </button>
      </form>
    </section>

    <section v-if="currentTab === 'other-settings'" class="space-y-6">
      <h2 class="text-2xl font-semibold text-foreground">Other Settings</h2>
      <hr class="border-border">
      <form class="space-y-6" @submit.prevent="saveSettingForm">
        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Default Landing Page</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="defaultRoute" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Default Theme</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="defaultTheme" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Password Lifetime (days)</span>
            <input type="number" min="0" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="passwordLifetime"
              placeholder="Name ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Inactivity Auto Logout (minutes)</span>
            <input type="number" min="0" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="inactivityLogOut"
              placeholder="Name ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Default Sticker copies</span>
            <input type="number" min="0" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="stickerCopies"
              placeholder="Name ..." :disabled="processing" />
          </label>
          <span class="block col-span-1"></span>
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="allowSelfVerification" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Allow self verification</span>
            </div>
          </label>
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="allowPatientRegistration" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Allow patient registration</span>
            </div>
          </label>
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="allowSampleRegistration" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Allow sample registration</span>
            </div>
          </label>
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="allowWorksheetCreation" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Allow worksheet creation</span>
            </div>
          </label>
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="autoReceiveSamples" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Auto receive samples</span>
            </div>
          </label>
          <span class="block col-span-1"></span>
        </div>
        <hr class="border-border" />
        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="allowBilling" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Enable Sample Billing</span>
            </div>
          </label>
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="allowAutoBilling" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Allow automatic billing on sample registration</span>
            </div>
          </label>
          <label class="block col-span-1 space-y-2"> 
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="processBilledOnly" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Only process billed analysis requests</span>
            </div>
          </label>
          <div class="block col-span-1 space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Minimum Allowed Payment status
            </label>
            <select 
              v-model="minPaymentStatus"
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
            v-model="minPartialPerentage" :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Currency</span>
            <input type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="currency" :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Payment Terms (Days)</span>
            <input type="number" min="0" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="paymentTermsDays" :disabled="processing" />
          </label>
        </div>
        <hr class="border-border" />
        <button v-show="!processing" type="submit"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Update
        </button>
      </form>
    </section>
  </FelAsideTabs>
</template>
