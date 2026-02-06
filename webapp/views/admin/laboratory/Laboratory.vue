<script setup lang="ts">
import { ref, defineAsyncComponent, computed, watch } from "vue";
import { LaboratoryType, LaboratorySettingType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import { useSetupStore } from "@/stores/setup";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";
import { EditLaboratoryMutation, EditLaboratoryMutationVariables, EditLaboratoryDocument, EditLaboratorySettingDocument, EditLaboratorySettingMutation, EditLaboratorySettingMutationVariables } from "@/graphql/operations/_mutations";
import { PaymentStatus } from "@/graphql/schema";
import { useForm } from "vee-validate";
import { boolean, number, object, string } from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

defineOptions({ name: 'LaboratoryView' })
const TabsAside = defineAsyncComponent(
    () => import("@/components/ui/tabs/TabsAside.vue")
)

const { toastSuccess } = useNotifyToast();
const userStore = useUserStore();
const setupStore = useSetupStore();
const EMPTY_SELECT_VALUE = "__none__";

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

const defaultLabValues = {
  name: "",
  tagLine: "",
  labManagerUid: null as string | null,
  email: "",
  emailCc: "",
  mobilePhone: "",
  businessPhone: "",
  address: "",
  banking: "",
  qualityStatement: "",
};


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

const defaultSettingValues = {
  defaultRoute: "",
  defaultTheme: "",
  passwordLifetime: null as number | null,
  inactivityLogOut: null as number | null,
  stickerCopies: null as number | null,
  allowSelfVerification: false,
  allowPatientRegistration: false,
  allowSampleRegistration: false,
  allowWorksheetCreation: false,
  autoReceiveSamples: false,
  allowBilling: false,
  allowAutoBilling: false,
  processBilledOnly: false,
  minPaymentStatus: "",
  minPartialPerentage: null as number | null,
  currency: "",
  paymentTermsDays: null as number | null,
};

const formSchema = labSchema.concat(settingSchema);
const { setValues, values } = useForm({
  validationSchema: formSchema,
  initialValues: { ...defaultLabValues, ...defaultSettingValues },
});


watch(
  () => [laboratory.value?.uid, laboratory.value?.settings] as const,
  () => {
    const currentLab = laboratory.value as LaboratoryType | undefined;
    labUid.value = currentLab?.uid ?? null;
    settingUid.value = currentLab?.settings?.uid ?? null;
    setValues(
      {
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
      },
      false,
    );
  },
  { immediate: true },
);

const { withClientMutation } = useApiUtil();
let processing = ref(false);
async function onLabSubmit(values: Record<string, unknown>) {
  processing.value = true;
  if (!labUid.value) {
    processing.value = false;
    return;
  }
  const payload = {
    ...values,
    labManagerUid: values.labManagerUid === EMPTY_SELECT_VALUE ? null : values.labManagerUid,
  } as LaboratoryType;
  withClientMutation<EditLaboratoryMutation, EditLaboratoryMutationVariables>(EditLaboratoryDocument, { uid: labUid.value, payload }, "updateLaboratory").then((result) => {
    setupStore.updateLaboratory(result);
    processing.value = false;
    toastSuccess("Laboratory information updated");
  });
}

const BOOL_KEYS = [
  "allowSelfVerification",
  "allowPatientRegistration",
  "allowSampleRegistration",
  "allowWorksheetCreation",
  "autoReceiveSamples",
  "allowBilling",
  "allowAutoBilling",
  "processBilledOnly",
] as const;

function normalizeBooleanInput(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

async function onSettingSubmit(values: Record<string, unknown>) {
  processing.value = true;
  if (!settingUid.value || !labUid.value) {
    processing.value = false;
    return;
  }
  const payload = {
    ...values,
    laboratoryUid: labUid.value,
    minPaymentStatus: values.minPaymentStatus === EMPTY_SELECT_VALUE ? null : values.minPaymentStatus,
  } as Record<string, unknown>;
  for (const key of BOOL_KEYS) {
    payload[key] = normalizeBooleanInput(payload[key]);
  }
  withClientMutation<EditLaboratorySettingMutation, EditLaboratorySettingMutationVariables>(EditLaboratorySettingDocument, { uid: settingUid.value, payload }, "updateLaboratorySetting").then((result) => {
    setupStore.updateLaboratorySetting(result);
    processing.value = false;
    toastSuccess("Laboratory settings updated");
  });
}

const saveLaboratoryForm = () => onLabSubmit(values as Record<string, unknown>);
const saveSettingForm = () => onSettingSubmit(values as Record<string, unknown>);

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
  <TabsAside
    title="Settings"
    :items="items"
    v-model="currentTab"
  >
    <section v-if="currentTab === 'general-info'" class="space-y-6">
      <h2 class="text-2xl font-semibold text-foreground">Laboratory Information</h2>
      <hr class="border-border">
      <form class="space-y-6" @submit.prevent="saveLaboratoryForm">
        <div class="grid grid-cols-2 gap-6">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Laboratory Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Name ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="tagLine" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Tag Line</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Tag Line ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="labManagerUid" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Lab Manager</FormLabel>
              <FormControl>
                <Select v-bind="componentField" :disabled="processing">
                  <SelectTrigger>
                    <SelectValue placeholder="Select lab manager..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="EMPTY_SELECT_VALUE">No lab manager</SelectItem>
                    <SelectItem v-for="user in users" :key="user?.uid" :value="user.uid">
                      {{ user?.firstName }} {{ user?.lastName }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="email" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Laboratory Email</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Name ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="emailCc" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>CC Emails</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Name ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="mobilePhone" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Lab Mobile Phone</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Name ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="businessPhone" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Lab Business Phone</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Name ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="address" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Address ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="banking" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Banking Details</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Banking ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="qualityStatement" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Quality Statement</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Quality Statement ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <hr class="border-border" />
        <Button type="submit" :disabled="processing">Update</Button>
      </form>
    </section>

    <section v-if="currentTab === 'other-settings'" class="space-y-6">
      <h2 class="text-2xl font-semibold text-foreground">Other Settings</h2>
      <hr class="border-border">
      <form class="space-y-6" @submit.prevent="saveSettingForm">
        <div class="grid grid-cols-2 gap-6">
          <FormField name="defaultRoute" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Default Landing Page</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Name ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="defaultTheme" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Default Theme</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Name ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="passwordLifetime" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Password Lifetime (days)</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="number" min="0" placeholder="Name ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="inactivityLogOut" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Inactivity Auto Logout (minutes)</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="number" min="0" placeholder="Name ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="stickerCopies" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Default Sticker copies</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="number" min="0" placeholder="Name ..." :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="col-span-1"></div>

          <FormField name="allowSelfVerification" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" :disabled="processing" />
              </FormControl>
              <FormLabel>Allow self verification</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="allowPatientRegistration" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" :disabled="processing" />
              </FormControl>
              <FormLabel>Allow patient registration</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="allowSampleRegistration" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" :disabled="processing" />
              </FormControl>
              <FormLabel>Allow sample registration</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="allowWorksheetCreation" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" :disabled="processing" />
              </FormControl>
              <FormLabel>Allow worksheet creation</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="autoReceiveSamples" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" :disabled="processing" />
              </FormControl>
              <FormLabel>Auto receive samples</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="col-span-1"></div>
        </div>
        <hr class="border-border" />
        <div class="grid grid-cols-2 gap-6">
          <FormField name="allowBilling" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" :disabled="processing" />
              </FormControl>
              <FormLabel>Enable Sample Billing</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="allowAutoBilling" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" :disabled="processing" />
              </FormControl>
              <FormLabel>Allow automatic billing on sample registration</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="processBilledOnly" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" :disabled="processing" />
              </FormControl>
              <FormLabel>Only process billed analysis requests</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="minPaymentStatus" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Minimum Allowed Payment status</FormLabel>
              <FormControl>
                <Select v-bind="componentField" :disabled="processing">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="EMPTY_SELECT_VALUE">No minimum payment status</SelectItem>
                    <SelectItem v-for="pstatus in [PaymentStatus.Unpaid, PaymentStatus.Partial, PaymentStatus.Paid]" :key="pstatus" :value="pstatus">
                      {{ pstatus }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="minPartialPerentage" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Minimum Partial Percentage</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="number" min="0.0" max="1.0" step="0.1" :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="currency" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="text" :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="paymentTermsDays" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Payment Terms (Days)</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="number" min="0" :disabled="processing" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <hr class="border-border" />
        <Button type="submit" :disabled="processing">Update</Button>
      </form>
    </section>
  </TabsAside>
</template>
