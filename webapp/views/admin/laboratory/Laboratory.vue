<script setup lang="ts">
import { reactive, ref, defineAsyncComponent, computed, watch } from "vue";
import { ILaboratory, ILaboratorySetting } from "@/models/setup";
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
const formLaboratory = reactive({ ...laboratory.value }) as ILaboratory;

watch(
  () => laboratory.value?.uid,
  (anal, prev) => Object.assign(formLaboratory, laboratory.value)
);

const { withClientMutation } = useApiUtil();
let processing = ref(false);
const saveLaboratoryForm = () => {
  processing.value = true;
  const payload = { ...formLaboratory };
  delete payload["uid"];
  delete payload["__typename"];
  payload["labManagerUid"] = payload["labManagerUid"]!;
  withClientMutation<EditLaboratoryMutation, EditLaboratoryMutationVariables>(EditLaboratoryDocument, { uid: formLaboratory.uid, payload }, "updateLaboratory").then((result) => {
    setupStore.updateLaboratory(result);
    processing.value = false;
    toastSuccess("Laboratory information updated");
  });
};

setupStore.fetchLaboratorySetting();
const laboratorySetting = computed(() => setupStore.getLaboratorySetting);
const formSettings = reactive({ ...laboratorySetting.value }) as ILaboratorySetting;

watch(
  () => laboratorySetting.value?.uid,
  (anal, prev) => Object.assign(formSettings, laboratorySetting.value)
);

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
  <section v-if="currentTab === 'general-info'">
      <h2 class="text-lg font-semibold text-gray-700">Laboratory Information</h2>
      <hr class="my-4">
      <form>
        <div class="grid grid-cols-2 gap-x-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Laboratory Name</span>
            <input class="form-input mt-1 block w-full" v-model="formLaboratory.labName" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Tag Line</span>
            <input class="form-input mt-1 block w-full" v-model="formLaboratory.tagLine" placeholder="Tag Line ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Lab Manager</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="formLaboratory.labManagerUid" :disabled="processing">
                <option></option>
                <option v-for="user in users" :key="user?.uid" :value="user.uid">
                  {{ user?.firstName }} {{ user?.lastName }}
                </option>
              </select>
            </div>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Laboratory Email</span>
            <input class="form-input mt-1 block w-full" v-model="formLaboratory.email" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">CC Emails</span>
            <input class="form-input mt-1 block w-full" v-model="formLaboratory.emailCc" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Lab Mobile Phone</span>
            <input class="form-input mt-1 block w-full" v-model="formLaboratory.mobilePhone" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Lab Bunsiness Phone</span>
            <input class="form-input mt-1 block w-full" v-model="formLaboratory.businessPhone" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Address</span>
            <textarea cols="3" class="form-input mt-1 block w-full" v-model="formLaboratory.address"
              placeholder="Address ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Banking Details</span>
            <textarea cols="3" class="form-input mt-1 block w-full" v-model="formLaboratory.banking"
              placeholder="Banking ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Quality Statemnt</span>
            <input class="form-input mt-1 block w-full" v-model="formLaboratory.qualityStatement" placeholder="Quality Statemnt ..."
              :disabled="processing" />
          </label>
          <!-- <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Laboratory Logo</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="formLaboratory.logo"
              placeholder="Name ..."
              :disabled="processing"
            />
          </label> -->
        </div>
        <hr class="my-4" />
        <button v-show="!processing" type="button" @click.prevent="saveLaboratoryForm()"
          class="w-2/5 border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline">
          Update
        </button>
      </form>
    </section>

    <section v-if="currentTab === 'other-settings'">
      <h2 class="text-lg font-semibold text-gray-700">Other Settings</h2>
      <hr class="my-4">
      <form>
        <div class="grid grid-cols-2 gap-x-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Default Landing Page</span>
            <input class="form-input mt-1 block w-full" v-model="formSettings.defaultRoute" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Default Theme</span>
            <input class="form-input mt-1 block w-full" v-model="formSettings.defaultTheme" placeholder="Name ..."
              :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Password Lifetime (days)</span>
            <input type="number" min="0" class="form-input mt-1 block w-full" v-model="formSettings.passwordLifetime"
              placeholder="Name ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Inactivity Auto Logout (minutes)</span>
            <input type="number" min="0" class="form-input mt-1 block w-full" v-model="formSettings.inactivityLogOut"
              placeholder="Name ..." :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700 ml-3">Default Sticker copies</span>
            <input type="number" min="0" class="form-input mt-1 block w-full" v-model="formSettings.stickerCopies"
              placeholder="Name ..." :disabled="processing" />
          </label>
          <span class="block col-span-1 mb-2"></span>
          <label class="block col-span-1 mb-2">
            <input type="checkbox" class="" v-model="formSettings.allowSelfVerification" :disabled="processing" />
            <span class="text-gray-700 ml-3">Allow self verificaion</span>
          </label>
          <label class="block col-span-1 mb-2">
            <input type="checkbox" class="" v-model="formSettings.allowPatientRegistration" :disabled="processing" />
            <span class="text-gray-700 ml-3">Allow patient registration</span>
          </label>
          <label class="block col-span-1 mb-2">
            <input type="checkbox" class="" v-model="formSettings.allowSampleRegistration" :disabled="processing" />
            <span class="text-gray-700 ml-3">Allow sample registration</span>
          </label>
          <label class="block col-span-1 mb-2">
            <input type="checkbox" class="" v-model="formSettings.allowWorksheetCreation" :disabled="processing" />
            <span class="text-gray-700 ml-3">Allow worksheet creation</span>
          </label>
          <label class="block col-span-1 mb-2">
            <input type="checkbox" class="" v-model="formSettings.autoReceiveSamples" :disabled="processing" />
            <span class="text-gray-700 ml-3">Auto receive samples</span>
          </label>
          <span class="block col-span-1 mb-2"></span>
        </div>
        <hr class="my-4" />
        <div class="grid grid-cols-2 gap-x-4">
          <label class="block col-span-1 mb-2">
            <input type="checkbox" class="" v-model="formSettings.allowBilling" :disabled="processing" />
            <span class="text-gray-700 ml-3">Enable Sample Billing</span>
          </label>
          <label class="block col-span-1 mb-2">
            <input type="checkbox" class="" v-model="formSettings.allowAutoBilling" :disabled="processing" />
            <span class="text-gray-700 ml-3">Allow automatic billing on sample registration</span>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700 ml-3">Currency</span>
            <input type="text" class="form-input mt-1 block w-full" v-model="formSettings.currency" :disabled="processing" />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700 ml-3">Payment Terms (Days)</span>
            <input type="number" min="0" class="form-input mt-1 block w-full" v-model="formSettings.paymentTermsDays" :disabled="processing" />
          </label>
        </div>
        <hr class="my-4" />
        <button v-show="!processing" type="button" @click.prevent="saveSettingForm()"
          class="mb-4 w-2/5 border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline">
          Update
        </button>
      </form>
    </section>
  </FelAsideTabs>
</template>
