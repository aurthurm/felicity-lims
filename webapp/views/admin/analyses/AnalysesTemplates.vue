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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import PageHeading from "@/components/common/PageHeading.vue";
const analysisStore = useAnalysisStore();
const setupStore = useSetupStore();
const { withClientMutation } = useApiUtil();

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

/** Reactive list of selected analysis UIDs for the current template (same pattern as ManageAnalyses.vue) */
const selectedServiceUids = ref<string[]>([]);

function selectService(uid: string, checked?: boolean): void {
  const current = selectedServiceUids.value;
  const hasUid = current.includes(uid);
  if (checked === true && !hasUid) {
    selectedServiceUids.value = [...current, uid];
    return;
  }
  if (checked !== true && hasUid) {
    selectedServiceUids.value = current.filter((id) => id !== uid);
    return;
  }
  if (checked === undefined) {
    selectedServiceUids.value = hasUid
      ? current.filter((id) => id !== uid)
      : [...current, uid];
  }
}

function isServiceSelected(uid: string): boolean {
  return selectedServiceUids.value.includes(uid);
}

const templateSchema = yup.object({
  name: yup.string().trim().required("Template name is required"),
  description: yup.string().trim().nullable(),
  departmentUid: yup.string().trim().nullable(),
});

const DEPARTMENT_NONE = "__none__";

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: templateSchema,
  initialValues: {
    name: "",
    description: "",
    departmentUid: DEPARTMENT_NONE,
  },
});

function addAnalysisTemplate(payload: { name: string; description: string | null; departmentUid: string | null; services?: string[] }): void {
  withClientMutation<AddAnalysisTemplateMutation, AddAnalysisTemplateMutationVariables>(
    AddAnalysisTemplateDocument,
    { payload },
    "createAnalysisTemplate"
  ).then((result) => analysisStore.addAnalysisTemplate(result));
}

function editAnalysisTemplate(payload: { name: string; description: string | null; departmentUid: string | null; services?: string[] }): void {
  if (!currentUid.value) return;
  const existingServices = analysisTemplate.analyses?.map((item) => item.uid) ?? [];
  const services = payload.services ?? (selectedServiceUids.value.length > 0 ? [...selectedServiceUids.value] : existingServices);
  withClientMutation<EditAnalysisTemplateMutation, EditAnalysisTemplateMutationVariables>(
    EditAnalysisTemplateDocument,
    { uid: currentUid.value, payload: { ...payload, services } },
    "updateAnalysisTemplate"
  ).then((result) => {
    if (result && "uid" in result && "analyses" in result) {
      analysisStore.updateAnalysesTemplate(result);
      if (result.uid === currentUid.value) {
        Object.assign(analysisTemplate, result);
        selectedServiceUids.value = result.analyses?.map((a) => a.uid) ?? [];
      }
    }
  });
}

function select(template: AnalysisTemplateType): void {
  Object.assign(analysisTemplate, { ...template });
  currentUid.value = template.uid ?? null;
  selectedServiceUids.value = template.analyses?.map((a) => a.uid) ?? [];
}

function updateTemplate(): void {
  const services = [...selectedServiceUids.value];
  editAnalysisTemplate({
    name: analysisTemplate.name ?? "",
    description: analysisTemplate.description ?? null,
    departmentUid: analysisTemplate.departmentUid ?? null,
    services,
  });
}

function FormManager(create: boolean, obj?: AnalysisTemplateType): void {
  const previousUid = currentUid.value;
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "ANALYSES TEMPLATE";
  if (create) {
    currentUid.value = null;
    selectedServiceUids.value = [];
    resetForm({
      values: {
        name: "",
        description: "",
        departmentUid: DEPARTMENT_NONE,
      },
    });
  } else {
    const source = obj ?? analysisTemplate;
    currentUid.value = source?.uid ?? null;
    if (!previousUid || previousUid !== source?.uid) {
      selectedServiceUids.value = source?.analyses?.map((a) => a.uid) ?? [];
    }
    setValues({
      name: source?.name ?? "",
      description: source?.description ?? "",
      departmentUid: source?.departmentUid ?? DEPARTMENT_NONE,
    });
  }
}

const saveForm = handleSubmit((values) => {
  const payload = {
    name: values.name,
    description: values.description ?? "",
    departmentUid: values.departmentUid && values.departmentUid !== DEPARTMENT_NONE ? values.departmentUid : null,
    // Modal form edits template metadata only. Service selection is updated via "Update Template".
    services: formAction.value === false ? undefined : [],
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
                  'rounded-md p-2 cursor-pointer transition-colors duration-200 group',
                  template?.uid === analysisTemplate?.uid 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent/50'
                ]"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium truncate">{{ template?.name }}</span>
                      <span v-if="template?.department?.name" class="text-xs text-muted-foreground shrink-0 ml-1">{{ template?.department?.name }}</span>
                    </div>
                    <p v-if="template?.description" class="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {{ template?.description }}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                    @click.prevent.stop="FormManager(false, template)"
                  >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 20 20">
                      <path
                        fill="currentColor"
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      />
                    </svg>
                  </Button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Template Details -->
      <section class="col-span-9" v-if="analysisTemplate?.uid !== undefined">
        <div class="space-y-6">
          <div class="rounded-lg border border-border bg-card">
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-medium text-foreground">Analyses</h3>
                  <Button size="sm" @click="updateTemplate()">
                    Update Template
                  </Button>
                </div>
                <div class="max-h-[420px] overflow-y-auto space-y-1 pr-1">
                  <Collapsible
                    v-for="category in analysesServices"
                    :key="String(category[0])"
                    class="rounded-md border border-border"
                  >
                    <CollapsibleTrigger
                      class="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium hover:bg-accent/50 rounded-md transition-colors [&[data-state=open]>svg]:rotate-180"
                    >
                      {{ category[0] }}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="shrink-0 transition-transform"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul class="px-3 pb-2 pt-0 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-1.5">
                        <li
                          v-for="service in category[1]"
                          :key="service?.uid"
                          class="flex items-center gap-2 rounded-sm py-1.5 pr-2 pl-2 text-sm outline-none cursor-default select-none hover:bg-accent/50 min-w-0"
                        >
                          <Switch
                            :id="`toggle-${service?.uid}`"
                            :checked="isServiceSelected(service?.uid)"
                            @update:checked="(value) => service?.uid != null && selectService(service.uid, value)"
                          />
                          <label
                            :for="`toggle-${service?.uid}`"
                            class="flex-1 cursor-pointer text-muted-foreground hover:text-foreground"
                          >
                            {{ service?.name }}
                          </label>
                        </li>
                      </ul>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
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
                    <SelectItem :value="DEPARTMENT_NONE">Select department</SelectItem>
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
