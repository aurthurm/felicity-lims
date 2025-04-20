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
  <div class="space-y-6">
    <fel-heading title="Analyses Profiles">
      <fel-button @click="FormManager(true)">Add Analyses Profile</fel-button>
    </fel-heading>

    <div class="grid grid-cols-12 gap-6">
      <!-- Profiles List -->
      <section class="col-span-3">
        <div class="rounded-lg border border-border bg-card">
          <div class="p-4 border-b border-border">
            <h3 class="text-sm font-medium text-muted-foreground">Profiles</h3>
          </div>
          <div class="overflow-y-auto max-h-[540px] p-2">
            <ul class="space-y-1">
              <li
                v-for="profile in analysesProfiles"
                :key="profile.uid"
                @click.prevent.stop="selectProfile(profile)"
                :class="[
                  'rounded-md p-2 cursor-pointer transition-colors duration-200',
                  profile?.uid === analysisProfile?.uid 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent/50'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">{{ profile?.name }}</span>
                  <span v-if="profile?.keyword" class="text-xs text-muted-foreground">{{ profile?.keyword }}</span>
                </div>
                <p v-if="profile?.description" class="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {{ profile?.description }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Profile Details -->
      <section class="col-span-9" v-if="analysisProfile?.uid !== undefined">
        <div class="space-y-6">
          <!-- Header -->
          <div class="rounded-lg border border-border bg-card p-6">
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <h2 class="text-xl font-semibold text-foreground">{{ analysisProfile?.name }}</h2>
                  <span v-if="analysisProfile?.keyword" class="px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground rounded">
                    {{ analysisProfile?.keyword }}
                  </span>
                </div>
                <p v-if="analysisProfile?.description" class="text-sm text-muted-foreground">
                  {{ analysisProfile?.description }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="FormManager(false, analysisProfile)"
                  class="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <svg class="w-4 h-4" viewBox="0 0 20 20">
                    <path
                      d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <nav class="border-b border-border">
            <div class="flex space-x-2">
              <button
                v-for="tab in tabs"
                :key="tab"
                :class="[
                  'px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  currentTab === tab
                    ? 'border-b-2 border-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                ]"
                @click="currentTab = tab"
              >
                {{ tab }}
              </button>
            </div>
          </nav>

          <!-- Content -->
          <div class="rounded-lg border border-border bg-card">
            <div class="p-6">
              <!-- Analyses Services Tab -->
              <div v-if="currentTab === 'analyses-services'" class="space-y-6">
                <div class="grid grid-cols-3 gap-6">
                  <div v-for="category in analysesServices" :key="category[0]" class="space-y-4">
                    <fel-accordion>
                      <template v-slot:title>
                        <span class="text-sm font-medium">{{ category[0] }}</span>
                      </template>
                      <template v-slot:body>
                        <ul class="space-y-2 pt-2">
                          <li v-for="service in category[1]" :key="service?.uid" class="flex items-start space-x-2">
                            <div class="flex items-center h-5">
                              <input
                                type="checkbox"
                                :id="`toggle-${service?.uid}`"
                                v-model="service.checked"
                                class="h-4 w-4 rounded border-input bg-background text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                              />
                            </div>
                            <label :for="`toggle-${service?.uid}`" class="text-sm text-foreground">
                              {{ service?.name }}
                            </label>
                          </li>
                        </ul>
                      </template>
                    </fel-accordion>
                  </div>
                </div>

                <div class="flex justify-end pt-4">
                  <button
                    @click="updateProfile()"
                    class="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    Update Profile
                  </button>
                </div>
              </div>

              <!-- Mappings Tab -->
              <div v-if="currentTab === 'mappings'" class="space-y-6">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-medium text-foreground">Concept Mappings</h3>
                  <button
                    @click="MappingFormManager(true)"
                    class="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <span class="mr-2">+</span> Add Mapping
                  </button>
                </div>

                <div class="overflow-hidden rounded-lg border border-border">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-border bg-muted/50">
                        <th class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Code</th>
                        <th class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Standard</th>
                        <th class="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="mapping in mappings" :key="mapping.uid" class="hover:bg-accent/50 transition-colors duration-200">
                        <td class="px-6 py-4 whitespace-nowrap border-b border-border">
                          <div class="font-medium text-foreground">{{ mapping?.name }}</div>
                          <div class="text-sm text-muted-foreground" v-if="mapping?.description">{{ mapping?.description }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap border-b border-border text-sm text-foreground">
                          {{ mapping?.code }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap border-b border-border text-sm text-foreground">
                          {{ mapping?.codingStandard?.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right border-b border-border">
                          <button 
                            @click="MappingFormManager(false, mapping)"
                            class="inline-flex items-center px-3 py-1.5 border border-input bg-background text-foreground text-sm font-medium transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Billing Tab -->
              <div v-if="currentTab === 'billing'" class="space-y-6">
                <Billing :target="'profile'" :targetUid="analysisProfile?.uid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty State -->
      <section v-else class="col-span-9">
        <div class="rounded-lg border border-border bg-card p-6 flex flex-col items-center justify-center space-y-4 min-h-[400px]">
          <div class="text-4xl text-muted-foreground">📋</div>
          <h3 class="text-lg font-medium text-foreground">No Profile Selected</h3>
          <p class="text-sm text-muted-foreground">Select a profile from the list to view its details</p>
        </div>
      </section>
    </div>
  </div>

  <!-- Profile Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Profile Name</span>
            <input
              v-model="analysisProfile.name"
              type="text"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              placeholder="Enter profile name"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Keyword</span>
            <input
              v-model="analysisProfile.keyword"
              type="text"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              placeholder="Enter keyword"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Department</span>
            <select
              v-model="analysisProfile.departmentUid"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select department</option>
              <option v-for="department in departments" :key="department.uid" :value="department.uid">
                {{ department.name }}
              </option>
            </select>
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Sample Types</span>
            <VueMultiselect
              v-model="analysisProfile.sampleTypes"
              :options="sampleTypes"
              :multiple="true"
              track-by="uid"
              label="name"
              placeholder="Select sample types"
              class="multiselect-primary"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Description</span>
            <textarea
              v-model="analysisProfile.description"
              rows="3"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
              placeholder="Enter profile description"
            ></textarea>
          </label>

          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="isActive"
              v-model="analysisProfile.active"
              class="h-4 w-4 rounded border-input bg-background text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label for="isActive" class="text-sm font-medium text-muted-foreground">Active</label>
          </div>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Save Changes
          </button>
        </div>
      </form>
    </template>
  </fel-modal>

  <!-- Mapping Form Modal -->
  <fel-modal v-if="showMappingModal" @close="showMappingModal = false">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ mappingFormTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveMappingForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Coding Standard</span>
            <select
              v-model="mappingForm.codingStandardUid"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select standard</option>
              <option v-for="standard in analysisStore.codingStandards" :key="standard.uid" :value="standard.uid">
                {{ standard.name }}
              </option>
            </select>
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Name</span>
            <input
              v-model="mappingForm.name"
              type="text"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              placeholder="Enter mapping name"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Code</span>
            <input
              v-model="mappingForm.code"
              type="text"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              placeholder="Enter mapping code"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Description</span>
            <textarea
              v-model="mappingForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
              placeholder="Enter mapping description"
            ></textarea>
          </label>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Save Changes
          </button>
        </div>
      </form>
    </template>
  </fel-modal>

</template>

<style>
.multiselect-primary {
  --ms-tag-bg: hsl(var(--primary));
  --ms-tag-color: hsl(var(--primary-foreground));
  --ms-ring-color: hsl(var(--ring));
  --ms-option-bg-selected: hsl(var(--accent));
  --ms-option-color-selected: hsl(var(--accent-foreground));
  --ms-bg: hsl(var(--background));
  --ms-border: hsl(var(--input));
}
</style>