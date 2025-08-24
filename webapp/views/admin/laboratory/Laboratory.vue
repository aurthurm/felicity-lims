<script setup lang="ts">
import { reactive, ref, defineAsyncComponent, computed, watch } from "vue";
import { LaboratoryType, LaboratorySettingType } from "@/types/gql";
import { useUserStore } from "@/stores/user";
import { useSetupStore } from "@/stores/setup";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";
import { EditLaboratoryMutation, EditLaboratoryMutationVariables, EditLaboratoryDocument, EditLaboratorySettingDocument, EditLaboratorySettingMutation, EditLaboratorySettingMutationVariables } from "@/graphql/operations/_mutations";

const FelAsideTabs = defineAsyncComponent(
    () => import("@/components/ui/tabs/FelTabsAside.vue")
)

const { toastSuccess } = useNotifyToast();
const userStore = useUserStore();
const setupStore = useSetupStore();

setupStore.fetchLaboratory();
const laboratory = computed(() => setupStore.getLaboratory);

const formLaboratory = reactive({ ...laboratory.value }) as LaboratoryType;
const formSettings = reactive({ ...laboratory.value?.settings }) as LaboratorySettingType;
watch(
  () => laboratory.value?.uid,
  (anal, prev) => {
    Object.assign(formLaboratory, laboratory.value);
    Object.assign(formSettings, laboratory.value?.settings)
  }
);

const { withClientMutation } = useApiUtil();
let processing = ref(false);
const saveLaboratoryForm = () => {
  processing.value = true;
  const payload = { ...formLaboratory };
  delete payload["uid"];
  delete payload["__typename"];
  delete payload["settings"];
  payload["labManagerUid"] = payload["labManagerUid"]!;
  withClientMutation<EditLaboratoryMutation, EditLaboratoryMutationVariables>(EditLaboratoryDocument, { uid: formLaboratory.uid, payload }, "updateLaboratory").then((result) => {
    setupStore.updateLaboratory(result);
    processing.value = false;
    toastSuccess("Laboratory information updated");
  });
};



const saveSettingForm = () => {
  processing.value = true;
  const payload = { ...formSettings };
  delete payload["uid"];
  delete payload["__typename"];
  withClientMutation<EditLaboratorySettingMutation, EditLaboratorySettingMutationVariables>(EditLaboratorySettingDocument, { uid: formSettings.uid, payload }, "updateLaboratorySetting").then((result) => {
    setupStore.updateLaboratorySetting(result);
    processing.value = false;
    toastSuccess("Laboratory settings updated");
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
      <form class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Laboratory Name</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formLaboratory.name" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Tag Line</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formLaboratory.tagLine" placeholder="Tag Line ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Lab Manager</span>
            <div class="w-full">
              <select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formLaboratory.labManagerUid" :disabled="processing">
                <option></option>
                <option v-for="user in users" :key="user?.uid" :value="user.uid">
                  {{ user?.firstName }} {{ user?.lastName }}
                </option>
              </select>
            </div>
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Laboratory Email</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formLaboratory.email" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">CC Emails</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formLaboratory.emailCc" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Lab Mobile Phone</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formLaboratory.mobilePhone" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Lab Business Phone</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formLaboratory.businessPhone" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Address</span>
            <textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formLaboratory.address"
              placeholder="Address ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Banking Details</span>
            <textarea class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formLaboratory.banking"
              placeholder="Banking ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Quality Statement</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formLaboratory.qualityStatement" placeholder="Quality Statement ..."
              :disabled="processing" />
          </label>
        </div>
        <hr class="border-border" />
        <button v-show="!processing" type="button" @click.prevent="saveLaboratoryForm()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          Update
        </button>
      </form>
    </section>

    <section v-if="currentTab === 'other-settings'" class="space-y-6">
      <h2 class="text-2xl font-semibold text-foreground">Other Settings</h2>
      <hr class="border-border">
      <form class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Default Landing Page</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formSettings.defaultRoute" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Default Theme</span>
            <input class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formSettings.defaultTheme" placeholder="Name ..."
              :disabled="processing" />
          </label>
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
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Default Sticker copies</span>
            <input type="number" min="0" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formSettings.stickerCopies"
              placeholder="Name ..." :disabled="processing" />
          </label>
          <span class="block col-span-1"></span>
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="formSettings.allowSelfVerification" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Allow self verification</span>
            </div>
          </label>
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="formSettings.allowPatientRegistration" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Allow patient registration</span>
            </div>
          </label>
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="formSettings.allowSampleRegistration" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Allow sample registration</span>
            </div>
          </label>
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="formSettings.allowWorksheetCreation" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Allow worksheet creation</span>
            </div>
          </label>
          <label class="block col-span-1 space-y-2">
            <div class="flex items-center space-x-2">
              <input type="checkbox" class="h-4 w-4 rounded border-input text-primary focus:ring-ring" v-model="formSettings.autoReceiveSamples" :disabled="processing" />
              <span class="text-sm font-medium text-foreground">Auto receive samples</span>
            </div>
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
            <span class="text-sm font-medium text-foreground">Currency</span>
            <input type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formSettings.currency" :disabled="processing" />
          </label>
          <label class="block col-span-1 space-y-2">
            <span class="text-sm font-medium text-foreground">Payment Terms (Days)</span>
            <input type="number" min="0" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" v-model="formSettings.paymentTermsDays" :disabled="processing" />
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
