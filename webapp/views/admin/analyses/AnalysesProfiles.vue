<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { ProfileType, AnalysisType } from "@/types/gql";
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
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import PageHeading from "@/components/common/PageHeading.vue"
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
const currentUid = ref<string | null>(null);

let analysisProfile = reactive({}) as ProfileType;

const sampleTypes = computed<any[]>(() => sampleStore.getSampleTypes);
const departments = computed<any[]>(() => setupStore.getDepartments);

analysisStore.fetchAnalysesProfilesAndServices();
const analysesServices = computed(() => analysisStore.getAnalysesServices);
const analysesProfiles = computed(() => analysisStore.getAnalysesProfiles);

const profileSchema = yup.object({
  name: yup.string().trim().required("Profile name is required"),
  keyword: yup.string().trim().nullable(),
  description: yup.string().trim().nullable(),
  departmentUid: yup.string().trim().nullable(),
  sampleTypes: yup.array().nullable(),
  active: yup.boolean().default(true),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: profileSchema,
  initialValues: {
    name: "",
    keyword: "",
    description: "",
    departmentUid: "",
    sampleTypes: [],
    active: true,
  },
});


function addAnalysisProfile(payload: { name: string; keyword: string | null; description: string | null; departmentUid: string | null; sampleTypes: string[]; active: boolean }): void {
  withClientMutation<AddAnalysisProfileMutation, AddAnalysisProfileMutationVariables>(
    AddAnalysisProfileDocument,
    { payload },
    "createProfile"
  ).then((result) => analysisStore.addAnalysisProfile(result));
}

function editAnalysisProfile(payload: { name: string; keyword: string | null; description: string | null; departmentUid: string | null; sampleTypes: string[]; active: boolean }): void {
  if (!currentUid.value) return;
  const services = analysisProfile.analyses?.map((item) => item.uid);
  withClientMutation<EditAnalysisProfileMutation, EditAnalysisProfileMutationVariables>(
    EditAnalysisProfileDocument,
    { uid: currentUid.value, payload: { ...payload, services } },
    "updateProfile"
  ).then((result) => analysisStore.updateAnalysesProfile(result));
}

function selectProfile(profile: ProfileType): void {
  Object.assign(analysisProfile, { ...profile });
  currentUid.value = profile.uid ?? null;
  // get services that fall into this profile
  analysesServices.value?.forEach((item) => {
    item[1].forEach((service: AnalysisType) => {
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
  const analyses: AnalysisType[] = [];
  analysesServices.value?.forEach((item) => {
    item[1].forEach((service: AnalysisType) => {
      if (service.checked) {
        analyses.push(service);
      }
    });
  });
  analysisProfile.analyses = analyses;
  editAnalysisProfile({
    name: analysisProfile.name ?? "",
    keyword: analysisProfile.keyword ?? null,
    description: analysisProfile.description ?? "",
    departmentUid: analysisProfile.departmentUid ?? null,
    sampleTypes: analysisProfile.sampleTypes?.map((item) => item.uid) ?? [],
    active: analysisProfile.active ?? true,
  });
}

function FormManager(create: boolean, obj?: ProfileType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "ANALYSES PROFILE";
  if (create) {
    currentUid.value = null;
    resetForm({
      values: {
        name: "",
        keyword: "",
        description: "",
        departmentUid: "",
        sampleTypes: [],
        active: true,
      },
    });
  } else {
    const source = obj ?? analysisProfile;
    currentUid.value = source?.uid ?? null;
    setValues({
      name: source?.name ?? "",
      keyword: source?.keyword ?? "",
      description: source?.description ?? "",
      departmentUid: source?.departmentUid ?? "",
      sampleTypes: source?.sampleTypes ?? [],
      active: source?.active ?? true,
    });
  }
}

const saveForm = handleSubmit((values) => {
  const payload = {
    name: values.name,
    keyword: values.keyword ?? null,
    description: values.description ?? "",
    departmentUid: values.departmentUid ? values.departmentUid : null,
    sampleTypes: (values.sampleTypes ?? []).map((item: any) => item.uid),
    active: values.active,
  };
  if (formAction.value === true) addAnalysisProfile(payload);
  if (formAction.value === false) editAnalysisProfile(payload);
  showModal.value = false;
});


// Mapping
analysisStore.fetchCodingStandards()
const mappings = computed(() => analysisStore.profileMapings?.filter(m => m.profileUid === analysisProfile?.uid))
let showMappingModal = ref(false);
let mappingFormTitle = ref("");
const mappingFormAction = ref(true);
const mappingUid = ref<string | null>(null);

const mappingSchema = yup.object({
  codingStandardUid: yup.string().trim().required("Coding standard is required"),
  name: yup.string().trim().required("Mapping name is required"),
  code: yup.string().trim().required("Mapping code is required"),
  description: yup.string().trim().nullable(),
});

const { handleSubmit: handleMappingSubmit, resetForm: resetMappingForm, setValues: setMappingValues } = useForm({
  validationSchema: mappingSchema,
  initialValues: {
    codingStandardUid: "",
    name: "",
    code: "",
    description: "",
  },
});

function addMapping(payload: { profileUid: string; codingStandardUid: string; name: string; code: string; description: string | null }): void {
  withClientMutation<AddProfileMappingMutation, AddProfileMappingMutationVariables>(
    AddProfileMappingDocument,
    { payload },
    "createProfileMapping"
  ).then((result) => analysisStore.addProfileMapping(result));
}

function updateMapping(payload: { profileUid: string; codingStandardUid: string; name: string; code: string; description: string | null }): void {
  if (!mappingUid.value) return;
  withClientMutation<EditProfileMappingMutation, EditProfileMappingMutationVariables>(
    EditProfileMappingDocument,
    { uid: mappingUid.value, payload },
    "updateProfileMapping"
  ).then((result) => analysisStore.updateProfileMapping(result));
}

function MappingFormManager(create: boolean, obj = {} as any): void {
  mappingFormAction.value = create;
  showMappingModal.value = true;
  mappingFormTitle.value = (create ? "CREATE" : "EDIT") + " " + "CONCEPT MAPPING";
  if (create) {
    mappingUid.value = null;
    resetMappingForm({
      values: {
        codingStandardUid: "",
        name: "",
        code: "",
        description: "",
      },
    });
  } else {
    mappingUid.value = obj?.uid ?? null;
    setMappingValues({
      codingStandardUid: obj?.codingStandardUid ?? "",
      name: obj?.name ?? "",
      code: obj?.code ?? "",
      description: obj?.description ?? "",
    });
  }
}

const saveMappingForm = handleMappingSubmit((values) => {
  if (!analysisProfile?.uid) return;
  const payload = {
    profileUid: analysisProfile.uid,
    codingStandardUid: values.codingStandardUid,
    name: values.name,
    code: values.code,
    description: values.description ?? null,
  };
  if (mappingFormAction.value === true) addMapping(payload);
  if (mappingFormAction.value === false) updateMapping(payload);
  showMappingModal.value = false;
});
</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Analyses Profiles">
      <Button @click="FormManager(true)">Add Analyses Profile</Button>
    </PageHeading>

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
                :class="['rounded-md p-2 cursor-pointer transition-colors duration-200',
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
                :class="['px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
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
                    <Accordion type="single" collapsible>
                      <AccordionItem :value="String(category[0])">
                        <AccordionTrigger>
                          <span class="text-sm font-medium">{{ category[0] }}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                        <ul class="space-y-2 pt-2">
                          <li v-for="service in category[1]" :key="service?.uid" class="flex items-start space-x-2">
                            <div class="flex items-center h-5">
                            <Checkbox
                              :id="`toggle-${service?.uid}`"
                              :checked="service.checked"
                              @update:checked="(value) => service.checked = value"
                            />
                            </div>
                            <label :for="`toggle-${service?.uid}`" class="text-sm text-foreground">
                              {{ service?.name }}
                            </label>
                          </li>
                        </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                <div class="flex justify-end pt-4">
                  <Button @click="updateProfile()">
                    Update Profile
                  </Button>
                </div>
              </div>

              <!-- Mappings Tab -->
              <div v-if="currentTab === 'mappings'" class="space-y-6">
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-medium text-foreground">Concept Mappings</h3>
                  <Button @click="MappingFormManager(true)">
                    <span class="mr-2">+</span> Add Mapping
                  </Button>
                </div>

                <div class="overflow-hidden rounded-lg border border-border">
                  <Table class="w-full">
                    <TableHeader>
                      <TableRow class="border-b border-border bg-muted/50">
                        <TableHead class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Name</TableHead>
                        <TableHead class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Code</TableHead>
                        <TableHead class="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Standard</TableHead>
                        <TableHead class="px-6 py-3 text-right text-sm font-medium text-muted-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="mapping in mappings" :key="mapping.uid" class="hover:bg-accent/50 transition-colors duration-200">
                        <TableCell class="px-6 py-4 whitespace-nowrap border-b border-border">
                          <div class="font-medium text-foreground">{{ mapping?.name }}</div>
                          <div class="text-sm text-muted-foreground" v-if="mapping?.description">{{ mapping?.description }}</div>
                        </TableCell>
                        <TableCell class="px-6 py-4 whitespace-nowrap border-b border-border text-sm text-foreground">
                          {{ mapping?.code }}
                        </TableCell>
                        <TableCell class="px-6 py-4 whitespace-nowrap border-b border-border text-sm text-foreground">
                          {{ mapping?.codingStandard?.name }}
                        </TableCell>
                        <TableCell class="px-6 py-4 whitespace-nowrap text-right border-b border-border">
                          <button 
                            @click="MappingFormManager(false, mapping)"
                            class="inline-flex items-center px-3 py-1.5 border border-input bg-background text-foreground text-sm font-medium transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground"
                          >
                            Edit
                          </button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
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
        <Empty class="min-h-[400px] bg-card">
          <EmptyContent>
            <EmptyMedia variant="icon">
              <span class="text-2xl">📋</span>
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No profile selected</EmptyTitle>
              <EmptyDescription>Select a profile from the list to view its details.</EmptyDescription>
            </EmptyHeader>
          </EmptyContent>
        </Empty>
      </section>
    </div>
  </div>

  <!-- Profile Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <Form @submit="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Profile Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter profile name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="keyword" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Keyword</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter keyword" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="departmentUid" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select department</SelectItem>
                    <SelectItem v-for="department in departments" :key="department.uid" :value="department.uid">
                      {{ department.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="sampleTypes" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Sample Types</FormLabel>
              <FormControl>
                <VueMultiselect
                  v-bind="componentField"
                  :options="sampleTypes"
                  :multiple="true"
                  track-by="uid"
                  label="name"
                  placeholder="Select sample types"
                  class="multiselect-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="description" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  rows="3"
                  placeholder="Enter profile description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="active" type="checkbox" :checked-value="true" :unchecked-value="false" v-slot="{ componentField }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Checkbox v-bind="componentField" />
              </FormControl>
              <FormLabel>Active</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="pt-4">
          <Button type="submit" class="w-full">
            Save Changes
          </Button>
        </div>
      </Form>
    </template>
  </Modal>

  <!-- Mapping Form Modal -->
  <Modal v-if="showMappingModal" @close="showMappingModal = false">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ mappingFormTitle }}</h3>
    </template>

    <template v-slot:body>
      <Form @submit="saveMappingForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <FormField name="codingStandardUid" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Coding Standard</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select standard</SelectItem>
                    <SelectItem v-for="standard in analysisStore.codingStandards" :key="standard.uid" :value="standard.uid">
                      {{ standard.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter mapping name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="code" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter mapping code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="description" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" rows="3" placeholder="Enter mapping description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="pt-4">
          <Button type="submit" class="w-full">
            Save Changes
          </Button>
        </div>
      </Form>
    </template>
  </Modal>

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
