<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { AnalysisTemplateType, AnalysisType } from "@/types/gql";
import {
  AddAnalysisTemplateDocument, AddAnalysisTemplateMutation, AddAnalysisTemplateMutationVariables,
  EditAnalysisTemplateDocument, EditAnalysisTemplateMutation, EditAnalysisTemplateMutationVariables
} from "@/graphql/operations/analyses.mutations";
import { useSetupStore } from "@/stores/setup";
import { useAnalysisStore } from "@/stores/analysis";
import useApiUtil  from "@/composables/api_util";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {FormControl,
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
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


import PageHeading from "@/components/common/PageHeading.vue"
const analysisStore = useAnalysisStore();
const setupStore = useSetupStore();
const { withClientMutation } = useApiUtil();

let currentTab = ref("analyses-services");
const tabs = ["analyses-services"];

let showModal = ref(false);
let formTitle = ref("");
const formAction = ref(true);
const currentUid = ref<string | null>(null);

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

function addAnalysisTemplate(payload: { name: string; description: string | null; departmentUid: string | null; active: boolean }): void {
  withClientMutation<AddAnalysisTemplateMutation, AddAnalysisTemplateMutationVariables>(
    AddAnalysisTemplateDocument,
    { payload },
    "createAnalysisTemplate"
  ).then((result) => analysisStore.addAnalysisTemplate(result));
}

function editAnalysisTemplate(payload: { name: string; description: string | null; departmentUid: string | null; active: boolean }): void {
  if (!currentUid.value) return;
  const services = analysisTemplate.analyses?.map((item) => item.uid);
  withClientMutation<EditAnalysisTemplateMutation, EditAnalysisTemplateMutationVariables>(
    EditAnalysisTemplateDocument,
    { uid: currentUid.value, payload: { ...payload, services } },
    "updateAnalysisTemplate"
  ).then((result) => analysisStore.updateAnalysesTemplate(result));
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
  editAnalysisTemplate({
    name: analysisTemplate.name ?? "",
    description: analysisTemplate.description ?? null,
    departmentUid: analysisTemplate.departmentUid ?? null,
    active: analysisTemplate.active ?? true,
  });
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

const saveForm = handleSubmit((values) => {
  const payload = {
    name: values.name,
    description: values.description ?? null,
    departmentUid: values.departmentUid ? values.departmentUid : null,
    active: values.active,
  };
  if (formAction.value === true) addAnalysisTemplate(payload);
  if (formAction.value === false) editAnalysisTemplate(payload);
  showModal.value = false;
});

</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Analyses Templates">
      <Button @click="FormManager(true)">Add Analyses Template</Button>
    </PageHeading>

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
                <Button variant="outline" size="icon" @click="FormManager(false, analysisTemplate)">
                  <svg class="w-4 h-4" viewBox="0 0 20 20">
                    <path
                      d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                    ></path>
                  </svg>
                </Button>
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
                      <Accordion type="single" collapsible>
                        <AccordionItem :value="String(category[0])">
                          <AccordionTrigger>{{ category[0] }}</AccordionTrigger>
                          <AccordionContent>
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
                                <div class="grow p-1">
                                  <div
                                    :class="[
                                      'font-medium text-gray-500 hover:text-gray-700',
                                      { 'text-gray-700 font-medium': false },
                                    ]"
                                  >
                                    <Checkbox
                                      :id="`toggle-${service?.uid}`" :checked="service.checked" @update:checked="(value) => service.checked = value"
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
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
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
        <Empty class="min-h-[400px] bg-card">
          <EmptyContent>
            <EmptyMedia variant="icon">
              <span class="text-2xl">📋</span>
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>No template selected</EmptyTitle>
              <EmptyDescription>Select a template from the list to view its details.</EmptyDescription>
            </EmptyHeader>
          </EmptyContent>
        </Empty>
      </section>
    </div>
  </div>

  <!-- Template Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter template name" />
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

          <FormField name="description" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" rows="3" placeholder="Enter template description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="pt-4">
          <Button type="submit" class="w-full">Save Changes</Button>
        </div>
      </form>
    </template>
  </Modal>
</template>
