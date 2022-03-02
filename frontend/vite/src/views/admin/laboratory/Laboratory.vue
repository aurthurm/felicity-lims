<template>

    <div class="container w-full my-4">

      <nav class="bg-gray-200 px-6 pt-2 shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 mr-8 tab',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
              href="#"
            >
              {{ tab }}
            </a>
          </div>
        </nav>

<!-- 
        <tab-laboratory v-if="currentTab === 'laboratory'"/>
        <tab-departments v-if="currentTab === 'departments'" /> -->

        <section v-if="currentTab === 'general-info'" class="pt-4">
          <form action="post">
            <div class="grid grid-cols-2 gap-x-4 mb-4">
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Laboratory Name</span>
                <input
                  class="form-input mt-1 block w-full"
                  v-model="formLaboratory.labName"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
              </label>
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Lab Manager</span>
                <div class="w-full">
                  <select 
                  class="form-select mt-1 w-full" 
                  v-model="formLaboratory.labManagerUid"
                  :disabled="editDisabled"
                  >
                    <option></option>
                    <option v-for="user in users" :key="user?.uid" :value="user.uid"> {{ user?.firstName }} {{ user?.lastName }}</option>
                  </select>
                </div>
              </label>
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Laboratory Email</span>
                <input
                  class="form-input mt-1 block w-full"
                  v-model="formLaboratory.email"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
              </label>
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">CC Emails</span>
                <input
                  class="form-input mt-1 block w-full"
                  v-model="formLaboratory.emailCc"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
              </label>
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Lab Mobile Phone</span>
                <input
                  class="form-input mt-1 block w-full"
                  v-model="formLaboratory.mobilePhone"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
              </label>
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Lab Bunsiness Phone</span>
                <input
                  class="form-input mt-1 block w-full"
                  v-model="formLaboratory.businessPhone"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
              </label>
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Address</span>
                <textarea
                cols="2"
                  class="form-input mt-1 block w-full"
                  v-model="formLaboratory.address"
                  placeholder="Description ..."
                  :disabled="editDisabled"
                />
              </label>
              <!-- <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Laboratory Logo</span>
                <input
                  class="form-input mt-1 block w-full"
                  v-model="formLaboratory.logo"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
              </label> -->
            </div>
            <hr />
            <button
              v-show="!editDisabled"
              type="button"
              @click.prevent="saveLaboratoryForm()"
              class="w-2/5 border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
            > Update</button>
          </form>
        </section>

        <section v-if="currentTab === 'other-settings'" class="pt-4">
          <form action="post">
            <div class="grid grid-cols-2 gap-x-4 mb-4">
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Default Landing Page</span>
                <input
                  class="form-input mt-1 block w-full"
                  v-model="formSettings.defaultRoute"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
              </label>
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Default Theme</span>
                <input
                  class="form-input mt-1 block w-full"
                  v-model="formSettings.defaultTheme"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
              </label>
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Password Lifetime (days)</span>
                <input
                  type="number"
                  min="0"
                  class="form-input mt-1 block w-full"
                  v-model="formSettings.passwordLifetime"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
              </label>
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Inactivity Auto Logout (minutes)</span>
                <input
                  type="number"
                  min="0"
                  class="form-input mt-1 block w-full"
                  v-model="formSettings.inactivityLogOut"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
              </label>
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700 ml-3">Default Sticker copies</span>
                <input
                  type="number"
                  min="0"
                  class="form-input mt-1 block w-full"
                  v-model="formSettings.stickerCopies"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
              </label>
              <span class="block col-span-1 mb-2"></span>
              <label class="block col-span-1 mb-2">
                <input
                  type="checkbox"
                  class=""
                  v-model="formSettings.allowSelfVerification"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
                <span class="text-gray-700 ml-3">Allow self verificaion</span>
              </label>
              <label class="block col-span-1 mb-2">
                <input
                  type="checkbox"
                  class=""
                  v-model="formSettings.allowPatientRegistration"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
                <span class="text-gray-700 ml-3">Allow patient registration</span>
              </label>
              <label class="block col-span-1 mb-2">
                <input
                  type="checkbox"
                  class=""
                  v-model="formSettings.allowSampleRegistration"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
                <span class="text-gray-700 ml-3">Allow sample registration</span>
              </label>
              <label class="block col-span-1 mb-2">
                <input
                  type="checkbox"
                  class=""
                  v-model="formSettings.allowWorksheetCreation"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
                <span class="text-gray-700 ml-3">Allow worksheet creation</span>
              </label>
              <label class="block col-span-1 mb-2">
                <input
                  type="checkbox"
                  class=""
                  v-model="formSettings.autoReceiveSamples"
                  placeholder="Name ..."
                  :disabled="editDisabled"
                />
                <span class="text-gray-700 ml-3">Auto receive samples</span>
              </label>
            </div>
            <hr />
            <button
              v-show="!editDisabled"
              type="button"
              @click.prevent="saveSettingForm()"
              class="mb-4 w-2/5 border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
            > Update</button>
          </form>
        </section>
    </div>

</template>

<script setup lang="ts">
  import { reactive, ref, computed, watch } from 'vue';
  import { useStore } from 'vuex';
  import { ILaboratory, ILaboratorySetting } from '../../../models/setup';
  import { ActionTypes } from '../../../store/actions';
  import { ActionTypes as SetupActionTypes} from '../../../store/modules/setup';
  import { UPDATE_LABORATOTY, UPDATE_LABORATOTY_SETTING } from '../../../graphql/_mutations';
  import { useMutation } from '@urql/vue';
  
  const store = useStore();

  let currentTab = ref<string>('general-info');
  const tabs: string[]= ['general-info', 'other-settings'];

  let editDisabled = ref(true);

  store.dispatch(SetupActionTypes.FETCH_LABORATORY)
  const laboratory = computed<ILaboratory>(() => store.getters.getLaboratory)
  const formLaboratory = reactive({ ...laboratory.value }) as ILaboratory
  watch(() => laboratory.value?.uid, (anal, prev) => Object.assign(formLaboratory, laboratory.value))
  const { executeMutation: updateLaboratory } = useMutation(UPDATE_LABORATOTY);
  const saveLaboratoryForm = () => {
      const payload =  { ...formLaboratory };
      delete payload['uid']
      delete payload['__typename']
      payload["labManagerUid"] = +payload["labManagerUid"]!
      updateLaboratory({ uid: formLaboratory.uid, payload}).then((result) => {
        store.dispatch(SetupActionTypes.UPDATE_LABORATORY, result);
      });
  }

  store.dispatch(SetupActionTypes.FETCH_LABORATORY_SETTING)
  const laboratorySetting = computed<ILaboratorySetting>(() => store.getters.getLaboratorySetting)
  const formSettings = reactive({ ...laboratorySetting.value }) as ILaboratorySetting
  watch(() => laboratorySetting.value?.uid, (anal, prev) => Object.assign(formSettings, laboratorySetting.value))
  const { executeMutation: updateLaboratorySetting } = useMutation(UPDATE_LABORATOTY_SETTING);
  const saveSettingForm = () => {
      const payload = { ...formSettings }
      delete payload['uid']
      delete payload['__typename']
      updateLaboratorySetting({ uid: formSettings.uid, payload }).then((result) => {
        store.dispatch(SetupActionTypes.UPDATE_LABORATORY_SETTING, result);
      });
  }

  store.dispatch(ActionTypes.FETCH_USERS)
  const users = computed(() => store.getters.getUsers)

</script>