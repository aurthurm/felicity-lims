<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { AnalysisTemplateType, AnalysisType } from "@/types/gql";
import {
  AddAnalysisTemplateDocument, AddAnalysisTemplateMutation, AddAnalysisTemplateMutationVariables,
  EditAnalysisTemplateDocument, EditAnalysisTemplateMutation, EditAnalysisTemplateMutationVariables
} from "@/graphql/operations/analyses.mutations";
import { useSetupStore } from "@/stores/setup";
import { useAnalysisStore } from "@/stores/analysis";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";

const analysisStore = useAnalysisStore();
const setupStore = useSetupStore();
const { withClientMutation } = useApiUtil();
const { toastSuccess } = useNotifyToast();

let showModal = ref(false);
let formTitle = ref("");
const formAction = ref(true);
const currentUid = ref<string | null>(null);
const formSaving = ref(false);
const templateUpdating = ref(false);

let analysisTemplate = reactive({}) as AnalysisTemplateType;

const departments = computed<any[]>(() => setupStore.getDepartments);

analysisStore.fetchAnalysesServices({});
analysisStore.fetchAnalysesTemplates()

const analysesServices = computed(() => analysisStore.getAnalysesServices);
const analysesTemplates = computed(() => analysisStore.getAnalysesTemplates);

const templateSchema = yup.object({
  name: yup.string().trim().required("Template name is required"),
  description: yup.string().trim().nullable(),
  departmentUid: yup.string().trim().nullable(),
  active: yup.boolean().default(true),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: templateSchema,
  initialValues: {
    name: "",
    description: "",
    departmentUid: "",
    active: true,
  },
});

const { value: name, errorMessage: nameError } = useField<string>("name");
const { value: description, errorMessage: descriptionError } = useField<string | null>("description");
const { value: departmentUid, errorMessage: departmentError } = useField<string | null>("departmentUid");
const { value: active } = useField<boolean>("active");

function addAnalysisTemplate(payload: { name: string; description: string | null; departmentUid: string | null }): Promise<void> {
  return withClientMutation<AddAnalysisTemplateMutation, AddAnalysisTemplateMutationVariables>(
    AddAnalysisTemplateDocument,
    { payload: { name: payload.name, description: payload.description, departmentUid: payload.departmentUid } },
    "createAnalysisTemplate"
  ).then((result) => {
    analysisStore.addAnalysisTemplate(result);
    toastSuccess("Template created successfully");
  });
}

function editAnalysisTemplate(payload: { name: string; description: string | null; departmentUid: string | null }): Promise<void> {
  if (!currentUid.value) return Promise.resolve();
  const services = analysisTemplate.analyses?.map((item) => item.uid) ?? [];
  return withClientMutation<EditAnalysisTemplateMutation, EditAnalysisTemplateMutationVariables>(
    EditAnalysisTemplateDocument,
    { uid: currentUid.value, payload: { name: payload.name, description: payload.description, departmentUid: payload.departmentUid, services } },
    "updateAnalysisTemplate"
  ).then((result) => {
    analysisStore.updateAnalysesTemplate(result);
    toastSuccess("Template updated successfully");
  });
}

function select(template: AnalysisTemplateType): void {
  Object.assign(analysisTemplate, { ...template });
  currentUid.value = template.uid ?? null;
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

async function updateTemplate(): Promise<void> {
  const analyses: AnalysisType[] = [];
  analysesServices.value?.forEach((item) => {
    item[1].forEach((service: AnalysisType) => {
      if (service.checked) {
        analyses.push(service);
      }
    });
  });
  analysisTemplate.analyses = analyses;
  templateUpdating.value = true;
  try {
    await editAnalysisTemplate({
      name: analysisTemplate.name ?? "",
      description: analysisTemplate.description ?? null,
      departmentUid: analysisTemplate.departmentUid ?? null,
    });
  } finally {
    templateUpdating.value = false;
  }
}

function FormManager(create: boolean, obj?: AnalysisTemplateType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "ANALYSES TEMPLATE";
  if (create) {
    currentUid.value = null;
    resetForm({
      values: {
        name: "",
        description: "",
        departmentUid: "",
        active: true,
      },
    });
  } else {
    const source = obj ?? analysisTemplate;
    currentUid.value = source?.uid ?? null;
    setValues({
      name: source?.name ?? "",
      description: source?.description ?? "",
      departmentUid: source?.departmentUid ?? "",
      active: source?.active ?? true,
    });
  }
}

const saveForm = handleSubmit(async (values) => {
  const payload = {
    name: values.name,
    description: values.description ?? null,
    departmentUid: values.departmentUid ? values.departmentUid : null,
  };
  formSaving.value = true;
  try {
    if (formAction.value === true) {
      await addAnalysisTemplate(payload);
    } else {
      await editAnalysisTemplate(payload);
    }
    showModal.value = false;
  } finally {
    formSaving.value = false;
  }
});

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
                  'rounded-md p-2 cursor-pointer transition-colors duration-200 border-l-4',
                  template?.uid === analysisTemplate?.uid 
                    ? 'border-l-primary bg-primary/10 text-primary font-medium' 
                    : 'border-l-transparent hover:bg-accent/50 hover:border-l-primary/30'
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
                  @click="FormManager(false, analysisTemplate)"
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

          <!-- Analyses Content -->
          <div class="rounded-lg border border-border bg-card flex flex-col min-h-0">
            <!-- Sticky header + action bar -->
            <div class="flex items-center justify-between gap-4 px-4 py-3 border-b border-border bg-muted/30 shrink-0">
              <h3 class="text-sm font-medium text-foreground">Analyses in template</h3>
              <fel-button
                type="button"
                :loading="templateUpdating"
                @click="updateTemplate()"
              >
                <span class="inline-flex items-center gap-2">
                  <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Update Template
                </span>
              </fel-button>
            </div>

            <!-- Scrollable category grid -->
            <div class="overflow-y-auto overscroll-contain flex-1 min-h-[200px] max-h-[420px] p-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div
                  v-for="category in analysesServices"
                  :key="category[0]"
                  class="min-w-0"
                >
                  <fel-accordion compact>
                    <template v-slot:title>
                      <span class="text-sm truncate">{{ category[0] }}</span>
                    </template>
                    <template v-slot:body>
                      <ul class="space-y-0.5 py-1">
                        <li
                          v-for="service in category[1]"
                          :key="service?.uid"
                          class="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
                          @click="service.checked = !service.checked"
                        >
                          <input
                            type="checkbox"
                            :id="`toggle-${service?.uid}`"
                            class="h-4 w-4 rounded border-input text-primary focus:ring-ring shrink-0 cursor-pointer"
                            v-model="service.checked"
                            @click.stop
                          />
                          <label
                            :for="`toggle-${service?.uid}`"
                            class="text-sm text-foreground cursor-pointer truncate flex-1 min-w-0"
                            @click.stop
                          >
                            {{ service?.name }}
                          </label>
                        </li>
                      </ul>
                    </template>
                  </fel-accordion>
                </div>
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
              v-model="name"
              type="text"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              placeholder="Enter template name"
            />
            <p v-if="nameError" class="text-sm text-destructive">{{ nameError }}</p>
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Department</span>
            <select
              v-model="departmentUid"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select department</option>
              <option v-for="department in departments" :key="department.uid" :value="department.uid">
                {{ department.name }}
              </option>
            </select>
            <p v-if="departmentError" class="text-sm text-destructive">{{ departmentError }}</p>
          </label>

          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Description</span>
            <textarea
              v-model="description"
              rows="3"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
              placeholder="Enter template description"
            ></textarea>
            <p v-if="descriptionError" class="text-sm text-destructive">{{ descriptionError }}</p>
          </label>
        </div>

        <div class="pt-4">
          <fel-button
            type="submit"
            class="w-full"
            :loading="formSaving"
          >
            Save Changes
          </fel-button>
        </div>
      </form>
    </template>
  </fel-modal>
</template>
