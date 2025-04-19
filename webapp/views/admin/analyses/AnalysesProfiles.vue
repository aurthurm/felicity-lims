<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent } from "vue";
import { IAnalysisProfile, IAnalysisService } from "@/models/analysis";
import {
  AddAnalysisProfileDocument, AddAnalysisProfileMutation, AddAnalysisProfileMutationVariables,
  EditAnalysisProfileDocument, EditAnalysisProfileMutation, EditAnalysisProfileMutationVariables,
  AddProfileMappingDocument, AddProfileMappingMutation, AddProfileMappingMutationVariables,
  EditProfileMappingDocument, EditProfileMappingMutation, EditProfileMappingMutationVariables,
} from "@/graphql/operations/analyses.mutations";
import { useSetupStore } from "@/stores/setup";
import { useAnalysisStore } from "@/stores/analysis";
import { useSampleStore } from "@/stores/sample";
import useApiUtil  from "@/composables/api_util";

const VueMultiselect = defineAsyncComponent(
  () => import("vue-multiselect")
)
const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)
const accordion = defineAsyncComponent(
  () => import("@/components/ui/FelAccordion.vue")
)

const Billing = defineAsyncComponent(
  () => import("./Billing.vue")
)

const analysisStore = useAnalysisStore();
const sampleStore = useSampleStore();
const setupStore = useSetupStore();
const { withClientMutation } = useApiUtil();

let currentTab = ref("analyses-services");
const tabs = ["analyses-services", "mappings", "billing"];

let showModal = ref(false);
let formTitle = ref("");
const formAction = ref(true);

let analysisProfile = reactive({}) as IAnalysisProfile;

const sampleTypes = computed<any[]>(() => sampleStore.getSampleTypes);
const departments = computed<any[]>(() => setupStore.getDepartments);

analysisStore.fetchAnalysesProfilesAndServices();
const analysesServices = computed(() => analysisStore.getAnalysesServices);
const analysesProfiles = computed(() => analysisStore.getAnalysesProfiles);

function addAnalysisProfile(): void {
  const payload = {
    name: analysisProfile.name,
    keyword: analysisProfile.keyword,
    description: analysisProfile.description,
    departmentUid: analysisProfile.departmentUid,
    sampleTypes: analysisProfile.sampleTypes?.map((item) => item.uid),
    active: analysisProfile.active,
  };
  withClientMutation<AddAnalysisProfileMutation, AddAnalysisProfileMutationVariables>(AddAnalysisProfileDocument, { payload }, "createProfile").then((result) =>
    analysisStore.addAnalysisProfile(result)
  );
}

function editAnalysisProfile(): void {
  const payload = {
    name: analysisProfile.name,
    keyword: analysisProfile.keyword,
    description: analysisProfile.description,
    departmentUid: analysisProfile.departmentUid,
    active: analysisProfile.active,
    services: analysisProfile.analyses?.map((item) => item.uid),
    sampleTypes: analysisProfile.sampleTypes?.map((item) => item.uid),
  };
  withClientMutation<EditAnalysisProfileMutation, EditAnalysisProfileMutationVariables>(EditAnalysisProfileDocument,
    { uid: analysisProfile.uid, payload },
    "updateProfile"
  ).then((result) => analysisStore.updateAnalysesProfile(result));
}

function selectProfile(profile: IAnalysisProfile): void {
  Object.assign(analysisProfile, { ...profile });
  // get services that fall into this profile
  analysesServices.value?.forEach((item) => {
    item[1].forEach((service: IAnalysisService) => {
      service.checked = false;
      if (service.profiles?.some((p) => p.uid === analysisProfile.uid) || false) {
        service.checked = true;
      }
    });
  });
  //  fetch profile mappings
  analysisStore.fetchProfileMappings(profile?.uid)
}

function updateProfile(): void {
  const analyses: IAnalysisService[] = [];
  analysesServices.value?.forEach((item) => {
    item[1].forEach((service: IAnalysisService) => {
      if (service.checked) {
        analyses.push(service);
      }
    });
  });
  analysisProfile.analyses = analyses;
  editAnalysisProfile();
}

function FormManager(create: boolean, obj = {} as IAnalysisProfile): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "ANALYSES PROFILE";
  if (create) {
    Object.assign(analysisProfile, {} as IAnalysisProfile);
  } else {
    Object.assign(analysisProfile, { ...obj });
  }
}

function saveForm(): void {
  if (formAction.value === true) addAnalysisProfile();
  if (formAction.value === false) editAnalysisProfile();
  showModal.value = false;
}


// Mapping
analysisStore.fetchCodingStandards()
const mappings = computed(() => analysisStore.profileMapings?.filter(m => m.profileUid === analysisProfile?.uid))
let showMappingModal = ref(false);
let mappingFormTitle = ref("");
const mappingFormAction = ref(true);
const mappingForm =  reactive({
  uid: undefined,
  profileUid: undefined,
  codingStandardUid: undefined,
  name: "",
  code: "",
  description: ""
})

function addMapping(): void {
  const payload = {
    profileUid: analysisProfile?.uid,
    codingStandardUid: mappingForm.codingStandardUid,
    name: mappingForm.name,
    code: mappingForm.code,
    description: mappingForm.description,
  };
  withClientMutation<AddProfileMappingMutation, AddProfileMappingMutationVariables>(AddProfileMappingDocument,
    { payload },
    "createProfileMapping"
  ).then((result) => analysisStore.addProfileMapping(result));
}

function updateMapping(): void {
  const payload = {
    profileUid: analysisProfile?.uid,
    codingStandardUid: mappingForm.codingStandardUid,
    name: mappingForm.name,
    code: mappingForm.code,
    description: mappingForm.description,
  };
  withClientMutation<EditProfileMappingMutation, EditProfileMappingMutationVariables>(EditProfileMappingDocument,
    { uid: mappingForm.uid, payload },
    "updateProfileMapping"
  ).then((result) => analysisStore.updateProfileMapping(result));
}

function MappingFormManager(create: boolean, obj = {} as any): void {
  mappingFormAction.value = create;
  showMappingModal.value = true;
  mappingFormTitle.value = (create ? "CREATE" : "EDIT") + " " + "CONCEPT MAPPING";
  if (create) {
    Object.assign(mappingForm, {} as any);
  } else {
    Object.assign(mappingForm, { ...obj });
  }
}

function saveMappingForm(): void {
  if (mappingFormAction.value === true) addMapping();
  if (mappingFormAction.value === false) updateMapping();
  showMappingModal.value = false;
}
</script>

<template>
  <div class="">
    <div class="container w-full my-4">
      <hr />
      <button
        class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
        @click="FormManager(true)"
      >
        Add Analyses Profile
      </button>
      <hr />
      <!-- <input
        class="w-64 h-10 ml-6 pl-4 pr-2 py-1 text-sm text-foreground placeholder-foreground border-1 border-border rounded-sm  focus:placeholder-gray-500 focus:border-emerald-200 focus:outline-none focus:shadow-outline-purple form-input"
        type="text" placeholder="Search ..." aria-label="Search"
        @keyup="searchProfile($event)"
        @focus="setProfileToNull()"
      /> -->
    </div>
    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-3 overflow-y-scroll overscroll-contain max-h-[540px]">
        <ul>
          <li
            v-for="profile in analysesProfiles"
            :key="profile.uid"
           
            @click.prevent.stop="selectProfile(profile)"
            :class="[
              'bg-background w-full p-1 mb-1 rounded',
              { 'border-border bg-emerald-200': profile?.uid === analysisProfile?.uid },
            ]"
          >
            <a class="cursor-pointer">
              <div class="flex-grow p-1">
                <div
                  class="font-medium text-muted-foreground hover:text-foreground flex justify-between"
                >
                  <span>{{ profile?.name }}</span>
                  <span class="text-sm text-muted-foreground"></span>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </section>

      <section class="col-span-9" v-if="analysisProfile?.uid !== undefined">
        <div
          class="bg-background rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4"
        >
          <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 px-3 sm:px-0">
              <div
                class="flex justify-between sm:text-sm md:text-md lg:text-lg text-foreground font-bold"
              >
                <span>{{ analysisProfile?.name }}</span>
                <div>
                  <button
                    @click="FormManager(false)"
                    class="ml-4 inline-flex items-center justify-center w-8 h-8 mr-2 border-primary border text-foreground transition-colors duration-150 bg-background rounded-full focus:outline-none hover:bg-muted"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav class="bg-background shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-muted-foreground uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-primary hover:text-muted-foreground',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
             
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <section class="mt-2 p-2 bg-background">
          <div v-if="currentTab === 'analyses-services'">
            <h3>Analyses</h3>
            <hr />
            <section
              class="col-span-4 overflow-y-scroll overscroll-contain analyses-scroll bg-background p-1"
            >
              <div class="grid grid-cols-6 gap-2 w-full">
                <div
                  class="col-span-2"
                  v-for="category in analysesServices"
                  :key="category[0]"
                >
                  <accordion>
                    <template v-slot:title>{{ category[0] }}</template>
                    <template v-slot:body>
                      <div>
                        <ul>
                          <li
                            v-for="service in category[1]"
                            :key="service?.uid"
                            class="cursor-pointer"
                            :class="[
                              { 'border-primary bg-muted underline pl-3': false },
                            ]"
                          >
                            <div class="flex-grow p-1">
                              <div
                                :class="[
                                  'font-medium text-muted-foreground hover:text-foreground',
                                  { 'text-foreground font-medium': false },
                                ]"
                              >
                                <input
                                  type="checkbox"
                                  :id="`toggle-${service?.uid}`"
                                  class="form-control"
                                  v-model="service.checked"
                                />
                                <label
                                  :for="`toggle-${service?.uid}`"
                                  class="text-foreground ml-4"
                                  >{{ service?.name }}</label
                                >
                              </div>
                            </div>
                            <hr />
                          </li>
                        </ul>
                      </div>
                    </template>
                  </accordion>
                </div>
              </div>
              <button
                class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
                @click="updateProfile()"
              >
                Update Analtsis Profile
              </button>
            </section>
          </div>
          <div v-if="currentTab == 'mappings'">
            <div class="flex justify-between items-center mb-2">
              <h3>Concept Mappings</h3>
              <button @click="MappingFormManager(true)"
                class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Add Mapping</button>
            </div>
            <hr />
            <div class="overflow-x-auto mt-4">
              <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                <table class="min-w-full">
                    <thead>
                    <tr>
                        <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Coding Standard</th>
                        <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Name</th>
                        <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Code</th>
                        <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Description</th>
                        <th class="px-1 py-1 border-b-2 border-border"></th>
                    </tr>
                    </thead>
                    <tbody class="bg-background">
                    <tr v-for="mapp in mappings"  :key="mapp">
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                          <div class="flex items-center">
                            <div class="text-sm leading-5 text-foreground">{{ mapp.codingStandard?.name }}</div>
                          </div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                          <div class="text-sm leading-5 text-primary">{{ mapp.name }}</div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                          <div class="text-sm leading-5 text-primary">{{ mapp.code }}</div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                          <div class="text-sm leading-5 text-primary">{{ mapp.description }}</div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
                            <button @click="MappingFormManager(false, mapp)" class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Edit</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
              </div>
            </div>
          </div>
          <div v-if="currentTab == 'billing'">
            <Billing target="profile" :targetUid="analysisProfile.uid" />
          </div>
        </section>
      </section>
    </div>
  </div>

  <!-- AnaltsisProfile Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-foreground">Analysis Profile Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="analysisProfile.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-foreground">keyword</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="analysisProfile.keyword"
              placeholder="Keyword ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-foreground">Sample Types</span>
            <VueMultiselect
              v-model="analysisProfile.sampleTypes"
              :options="sampleTypes"
              :multiple="true"
              :searchable="true"
              label="name"
              track-by="uid"
            >
            </VueMultiselect>
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-foreground">Description</span>
            <textarea
              cols="2"
              class="form-input mt-1 block w-full"
              v-model="analysisProfile.description"
              placeholder="Description ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Department</span>
            <select
              class="form-select block w-full mt-1"
              v-model="analysisProfile.departmentUid"
            >
              <option></option>
              <option
                v-for="department in departments"
                :key="department.uid"
                :value="department?.uid"
              >
                {{ department.name }}
              </option>
            </select>
          </label>
          <label for="toggle" class="text-xs text-foreground mr-4"
            >Active
            <div
              class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
            >
              <input
                type="checkbox"
                name="toggle"
                id="toggle"
                v-model="analysisProfile.active"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-background border-4 appearance-none cursor-pointer outline-none"
              />
              <label
                for="toggle"
                class="toggle-label block overflow-hidden h-6 rounded-full bg-muted cursor-pointer"
              ></label>
            </div>
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

    <!-- MappingForm Modal -->
  <modal v-if="showMappingModal" @close="showMappingModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-foreground">Coding Standard</span>
            <select
              class="form-select block w-full mt-1"
              v-model="mappingForm.codingStandardUid"
            >
              <option></option>
              <option
                v-for="c_standard in analysisStore.codingStandards"
                :key="c_standard.uid"
                :value="c_standard?.uid"
              >
                {{ c_standard.name }}
              </option>
            </select>
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-foreground">Standard Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="mappingForm.name"
              placeholder="Keyword ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-foreground">Standard Code</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="mappingForm.code"
              placeholder="Keyword ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-foreground">Standard Description</span>
            <textarea
              cols="2"
              class="form-input mt-1 block w-full"
              v-model="mappingForm.description"
              placeholder="Description ..."
            />
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveMappingForm()"
          class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>
</template>
