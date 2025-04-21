<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { AnalysisTemplateType, AnalysisType } from "@/types/gql";
import {
  AddAnalysisTemplateDocument, AddAnalysisTemplateMutation, AddAnalysisTemplateMutationVariables,
  EditAnalysisTemplateDocument, EditAnalysisTemplateMutation, EditAnalysisTemplateMutationVariables
} from "@/graphql/operations/analyses.mutations";
import { useSetupStore } from "@/stores/setup";
import { useAnalysisStore } from "@/stores/analysis";
import useApiUtil  from "@/composables/api_util";


const analysisStore = useAnalysisStore();
const setupStore = useSetupStore();
const { withClientMutation } = useApiUtil();

let currentTab = ref("analyses-services");
const tabs = ["analyses-services"];

let showModal = ref(false);
let formTitle = ref("");
const formAction = ref(true);

let analysisTemplate = reactive({}) as AnalysisTemplateType;

const departments = computed<any[]>(() => setupStore.getDepartments);

analysisStore.fetchAnalysesServices({});
analysisStore.fetchAnalysesTemplates()

const analysesServices = computed(() => analysisStore.getAnalysesServices);
const analysesTemplates = computed(() => analysisStore.getAnalysesTemplates);

function addAnalysisTemplate(): void {
  const payload = {
    name: analysisTemplate.name,
    description: analysisTemplate.description,
    departmentUid: analysisTemplate.departmentUid,
  };
  withClientMutation<AddAnalysisTemplateMutation, AddAnalysisTemplateMutationVariables>(AddAnalysisTemplateDocument, { payload }, "createAnalysisTemplate").then((result) =>
    analysisStore.addAnalysisTemplate(result)
  );
}

function editAnalysisTemplate(): void {
  const payload = {
    name: analysisTemplate.name,
    description: analysisTemplate.description,
    departmentUid: analysisTemplate.departmentUid,
    active: analysisTemplate.active,
    services: analysisTemplate.analyses?.map((item) => item.uid),
  };
  withClientMutation<EditAnalysisTemplateMutation, EditAnalysisTemplateMutationVariables>(EditAnalysisTemplateDocument,
    { uid: analysisTemplate.uid, payload },
    "updateAnalysisTemplate"
  ).then((result) => analysisStore.updateAnalysesTemplate(result));
}

function select(template: AnalysisTemplateType): void {
  Object.assign(analysisTemplate, { ...template });
  // get services that fall into this template
  analysesServices.value?.forEach((item) => {
    item[1].forEach((service: AnalysisType) => {
      service.checked = false;
      if (template.analyses?.some((a) => a.uid === service.uid) || false) {
        service.checked = true;
      }
    });
  });
}

function updateTemplate(): void {
  const analyses: AnalysisType[] = [];
  analysesServices.value?.forEach((item) => {
    item[1].forEach((service: AnalysisType) => {
      if (service.checked) {
        analyses.push(service);
      }
    });
  });
  analysisTemplate.analyses = analyses;
  editAnalysisTemplate();
}

function FormManager(create: boolean, obj = {} as AnalysisTemplateType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "ANALYSES TEMPLATE";
  if (create) {
    Object.assign(analysisTemplate, {} as AnalysisTemplateType);
  } else {
    Object.assign(analysisTemplate, { ...obj });
  }
}

function saveForm(): void {
  if (formAction.value === true) addAnalysisTemplate();
  if (formAction.value === false) editAnalysisTemplate();
  showModal.value = false;
}

</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Analyses Templates">
      <fel-button @click="FormManager(true)">Add Analyses Template</fel-button>
    </fel-heading>

    <div class="grid grid-cols-12 gap-6">
      <!-- Templates List -->
      <section class="col-span-3">
        <div class="rounded-lg border border-border bg-card">
          <div class="p-4 border-b border-border">
            <h3 class="text-sm font-medium text-muted-foreground">Templates</h3>
          </div>
          <div class="overflow-y-auto max-h-[540px] p-2">
            <ul class="space-y-1">
              <li
                v-for="template in analysesTemplates"
                :key="template.uid"
                @click.prevent.stop="select(template)"
                :class="[
                  'rounded-md p-2 cursor-pointer transition-colors duration-200',
                  template?.uid === analysisTemplate?.uid 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent/50'
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">{{ template?.name }}</span>
                  <span v-if="template?.department?.name" class="text-xs text-muted-foreground">{{ template?.department?.name }}</span>
                </div>
                <p v-if="template?.description" class="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {{ template?.description }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Template Details -->
      <section class="col-span-9" v-if="analysisTemplate?.uid !== undefined">
        <div class="space-y-6">
          <!-- Header -->
          <div class="rounded-lg border border-border bg-card p-6">
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <h2 class="text-xl font-semibold text-foreground">{{ analysisTemplate?.name }}</h2>
                <p v-if="analysisTemplate?.description" class="text-sm text-muted-foreground">
                  {{ analysisTemplate?.description }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="FormManager(false)"
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
              <div v-if="currentTab === 'analyses-services'">
                <h3>Analyses</h3>
                <hr />
                <section
                  class="col-span-4 overflow-y-scroll overscroll-contain analyses-scroll bg-white p-1"
                >
                  <div class="grid grid-cols-6 gap-2 w-full">
                    <div
                      class="col-span-2"
                      v-for="category in analysesServices"
                      :key="category[0]"
                    >
                      <fel-accordion>
                        <template v-slot:title>{{ category[0] }}</template>
                        <template v-slot:body>
                          <div>
                            <ul>
                              <li
                                v-for="service in category[1]"
                                :key="service?.uid"
                                class="cursor-pointer"
                                :class="[
                                  { 'border-sky-800 bg-gray-200 underline pl-3': false },
                                ]"
                              >
                                <div class="flex-grow p-1">
                                  <div
                                    :class="[
                                      'font-medium text-gray-500 hover:text-gray-700',
                                      { 'text-gray-700 font-medium': false },
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
                                      class="text-gray-700 ml-4"
                                      >{{ service?.name }}</label
                                    >
                                  </div>
                                </div>
                                <hr />
                              </li>
                            </ul>
                          </div>
                        </template>
                      </fel-accordion>
                    </div>
                  </div>
                  <button
                    class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
                    @click="updateTemplate()"
                  >
                    Update Template
                  </button>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty State -->
      <section v-else class="col-span-9">
        <div class="rounded-lg border border-border bg-card p-6 flex flex-col items-center justify-center space-y-4 min-h-[400px]">
          <div class="text-4xl text-muted-foreground">📋</div>
          <h3 class="text-lg font-medium text-foreground">No Template Selected</h3>
          <p class="text-sm text-muted-foreground">Select a template from the list to view its details</p>
        </div>
      </section>
    </div>
  </div>

  <!-- Template Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Template Name</span>
            <input
              v-model="analysisTemplate.name"
              type="text"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              placeholder="Enter template name"
            />
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Department</span>
            <select
              v-model="analysisTemplate.departmentUid"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select department</option>
              <option v-for="department in departments" :key="department.uid" :value="department.uid">
                {{ department.name }}
              </option>
            </select>
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Description</span>
            <textarea
              v-model="analysisTemplate.description"
              rows="3"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
              placeholder="Enter template description"
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