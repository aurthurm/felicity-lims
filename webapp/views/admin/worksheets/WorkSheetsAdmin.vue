<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent } from "vue";
import { useWorksheetStore } from "@/stores/worksheet";
import { useAnalysisStore } from "@/stores/analysis";
import { useSampleStore } from "@/stores/sample";
import { useSetupStore } from "@/stores/setup";
import useApiUtil  from "@/composables/api_util";
import { WorkSheetTemplateType } from "@/types/gql";
import { ReservedType } from "@/types/worksheet"
import {
  AnalysisType,
  QCLevelLevel,
  QCTemplateType,
  SampleTypeTyp,
} from "@/types/gql";
import { InstrumentType } from "@/types/gql";
import { AddWorkSheetTemplateDocument, AddWorkSheetTemplateMutation, AddWorkSheetTemplateMutationVariables, EditWorkSheetTemplateDocument, EditWorkSheetTemplateMutation, EditWorkSheetTemplateMutationVariables } from "@/graphql/operations/worksheet.mutations";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-vue-next";
import PageHeading from "@/components/common/PageHeading.vue"
const worksheetStore = useWorksheetStore();
const analysisStore = useAnalysisStore();
const sampleStore = useSampleStore();
const setupStore = useSetupStore();

const { withClientMutation } = useApiUtil();

let currentTab = ref<string>("preview");
const tabs: string[] = ["preview"];
let currentTabComponent = computed(() => "tab-" + currentTab.value);

let showModal = ref<boolean>(false);
let createItem = ref<any>(null);
let workSheetTemplate = reactive({}) as WorkSheetTemplateType;
let formTitle = ref<string>("");

let analysesParams = reactive({
  first: undefined,
  after: "",
  text: "",
  sortBy: ["name"],
});
analysisStore.fetchAnalysesServices(analysesParams);
sampleStore.fetchSampleTypes();
setupStore.fetchInstruments();
analysisStore.fetchQCTemplates();
analysisStore.fetchQCLevels();
worksheetStore.fetchWorkSheetTemplates();

const qcTemplates = computed<QCTemplateType[]>(() => analysisStore.getQCTemplates);
const workSheetTemplates = computed<WorkSheetTemplateType[]>(
  () => worksheetStore.getWorkSheetTemplates
);

function addWorksheetTemplate() {
  const payload = {
    name: workSheetTemplate.name,
    sampleTypeUid: workSheetTemplate.sampleTypeUid,
    instrumentUid: workSheetTemplate.instrumentUid,
    description: workSheetTemplate.description,
    qcTemplateUid: workSheetTemplate.qcTemplateUid,
    reserved: workSheetTemplate.reserved,
    numberOfSamples: +workSheetTemplate.numberOfSamples!,
    worksheetType: workSheetTemplate.worksheetType,
    cols: workSheetTemplate.cols,
    rows: workSheetTemplate.rows,
    rowWise: workSheetTemplate.rowWise,
    analysisUid: workSheetTemplate.analysisUid,
  };
  withClientMutation<AddWorkSheetTemplateMutation, AddWorkSheetTemplateMutationVariables>(AddWorkSheetTemplateDocument,
    { payload },
    "createWorksheetTemplate"
  ).then((result) => worksheetStore.addWorksheetTemplate(result));
}

function editWorksheetTemplate() {
  const payload = {
    name: workSheetTemplate.name,
    sampleTypeUid: workSheetTemplate.sampleTypeUid,
    instrumentUid: workSheetTemplate.instrumentUid,
    description: workSheetTemplate.description,
    qcTemplateUid: workSheetTemplate.qcTemplateUid,
    reserved: workSheetTemplate.reserved,
    numberOfSamples: workSheetTemplate.numberOfSamples,
    worksheetType: workSheetTemplate.worksheetType,
    cols: workSheetTemplate.cols,
    rows: workSheetTemplate.rows,
    rowWise: workSheetTemplate.rowWise,
    analysisUid: workSheetTemplate.analysisUid,
  };
  withClientMutation<EditWorkSheetTemplateMutation, EditWorkSheetTemplateMutationVariables>(EditWorkSheetTemplateDocument,
    { uid: workSheetTemplate.uid, payload },
    "updateWorksheetTemplate"
  ).then((result) => worksheetStore.updateWorksheetTemplate(result));
}

function generatePreview(wst: WorkSheetTemplateType): ReservedType[] {
  let items: ReservedType[] = [];
  const totalSlots = (wst?.numberOfSamples ?? 0) + (wst?.reserved?.length ?? 0);
  if (totalSlots <= 0) return items;

  const reservedPositions = new Set(
    (wst?.reserved ?? []).map((r) => Number(r.position)).filter((p) => !Number.isNaN(p) && p >= 1)
  );

  for (let i = 1; i <= totalSlots; i++) {
    const isReserved = reservedPositions.has(i);
    items.push({
      position: i,
      row: 1,
      col: 1,
      name: isReserved ? "control" : "sample",
      sampleUid: undefined,
    } as ReservedType);
  }

  return items;
}

function calculateRows(): void {
  if (workSheetTemplate.worksheetType == "grid") {
    workSheetTemplate.rows = Math.ceil(
      (workSheetTemplate?.numberOfSamples! + (workSheetTemplate.reserved?.length | 0)) /
        workSheetTemplate?.cols!
    );
  }
}

function selectWorkSheetTemplate(ws: WorkSheetTemplateType): void {
  Object.assign(workSheetTemplate, ws);
}

const layoutPreview = computed<ReservedType[]>(() =>
  workSheetTemplate?.uid ? generatePreview(workSheetTemplate) : []
);

function addReserved(): void {
  if (!workSheetTemplate.reserved) {
    workSheetTemplate.reserved = [];
  }
  const nextPosition = workSheetTemplate.reserved.length + 1;
  workSheetTemplate.reserved.push({ position: nextPosition } as ReservedType);
  calculateRows();
}

function removeReserved(index: number): void {
  workSheetTemplate.reserved?.splice(index, 1);
}

function appyQCTemplate(): void {
  workSheetTemplate.reserved = [];
  if (!workSheetTemplate.qcTemplateUid) return;
  const template: QCTemplateType | undefined = qcTemplates.value?.find(
    (item: QCTemplateType) => item.uid === workSheetTemplate.qcTemplateUid
  );
  template?.qcLevels!.forEach((level, index) => {
    workSheetTemplate.reserved?.push({
      position: index + 1,
      levelUid: level.uid,
    } as ReservedType);
  });
  calculateRows();
}

function changeWorkSheetType(event: any): void {
  if (event.target.value == "flat") {
    workSheetTemplate.cols = undefined;
    workSheetTemplate.rows = undefined;
  }
}

function FormManager(create: boolean, obj = {} as WorkSheetTemplateType) {
  createItem.value = create;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "WOKKSHEET TEMPLATE";
  showModal.value = true;
  if (create) {
    let wst = {} as WorkSheetTemplateType;
    wst.instrument = {} as InstrumentType;
    wst.sampleType = {} as SampleTypeTyp;
    wst.analysis = {} as AnalysisType;
    Object.assign(workSheetTemplate, { ...wst });
  } else {
    selectWorkSheetTemplate(obj);
  }
}

function saveForm() {
  if (createItem.value) addWorksheetTemplate();
  if (!createItem.value) editWorksheetTemplate();
  showModal.value = false;
}

const instruments = computed<InstrumentType[]>(() => setupStore.getInstruments);
const services = computed(() => {
  const services: AnalysisType[] = analysisStore.getAnalysesServicesSimple;
  const forQC = services?.filter(
    (service) => service?.category?.name !== "Quality Control"
  );
  return forQC;
});
const qcLevels = computed<QCLevelLevel[]>(() => analysisStore.getQCLevels);
const sampleTypes = computed<SampleTypeTyp[]>(() => sampleStore.getSampleTypes);
</script>


<template>
  <div>
    <PageHeading title="WorkSheet Templates">
      <Button @click="FormManager(true)">Add Template</Button>
    </PageHeading>

    <hr class="my-4 border-t border-border" />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-12 md:col-span-4 lg:col-span-3">
        <div class="overflow-y-scroll overscroll-contain scroll-section pr-2 space-y-1">
          <div
            v-for="wst in workSheetTemplates"
            :key="wst.uid"
            :class="[
              'w-full flex justify-between items-center p-2 rounded-lg border shadow-sm transition-colors',
              workSheetTemplate?.uid === wst.uid
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:bg-muted/50'
            ]"
          >
            <a
              href="#"
              @click.prevent.stop="selectWorkSheetTemplate(wst)"
              :class="[
                'font-medium cursor-pointer',
                 workSheetTemplate?.uid === wst.uid ? 'text-primary' : 'text-card-foreground' // Conditional text color
              ]"
            >
              <span>{{ wst.name }}</span>
            </a>
            <a
              href="#"
              @click.prevent.stop="FormManager(false, wst)"
              class="px-2 cursor-pointer text-muted-foreground hover:text-accent-foreground"
            >
              <font-awesome-icon icon="pen" />
            </a>
          </div>
           <Empty v-if="!workSheetTemplates || workSheetTemplates.length === 0" class="p-4 border-0 bg-transparent">
             <EmptyContent>
               <EmptyHeader>
                 <EmptyTitle>No templates found</EmptyTitle>
                 <EmptyDescription>Create a worksheet template to get started.</EmptyDescription>
               </EmptyHeader>
             </EmptyContent>
           </Empty>
        </div>
      </section>

      <div class="col-span-12 md:col-span-8 lg:col-span-9 overflow-y-scroll overscroll-contain scroll-section pl-2" 
        v-if="workSheetTemplate?.uid">
        <div class="bg-card text-card-foreground rounded-lg shadow-md p-4 sm:p-6">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-card-foreground">{{ workSheetTemplate.name }}</span>
              <div>
                <button
                  @click="FormManager(false, workSheetTemplate)"
                  class="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label="Edit Template"
                >
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <hr class="border-t border-border" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <div class="flex">
                  <span class="w-1/2 shrink-0 font-medium text-muted-foreground">Instrument:</span>
                  <span class="text-foreground">{{ workSheetTemplate.instrument?.name || 'N/A' }}</span>
                </div>
                <div class="flex">
                  <span class="w-1/2 shrink-0 font-medium text-muted-foreground">Analysis Service:</span>
                  <span class="text-foreground">{{ workSheetTemplate.analysis?.name || 'N/A' }}</span>
                </div>
              </div>
              <div>
                <div class="flex">
                  <span class="w-1/2 shrink-0 font-medium text-muted-foreground">Samples:</span>
                  <span class="text-foreground">{{ workSheetTemplate.numberOfSamples }}</span>
                </div>
                <div class="flex">
                  <span class="w-1/2 shrink-0 font-medium text-muted-foreground">Reserved:</span>
                  <span class="text-foreground">{{ workSheetTemplate.reserved?.length ?? 0 }}</span>
                </div>
              </div>
            </div>

            <hr class="border-t border-border" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <div class="flex">
                  <span class="w-1/2 shrink-0 font-medium text-muted-foreground">WorkSheet type:</span>
                  <span class="text-foreground">{{ workSheetTemplate.worksheetType }}</span>
                </div>
                <div class="flex" v-if="workSheetTemplate.worksheetType == 'grid'">
                  <span class="w-1/2 shrink-0 font-medium text-muted-foreground">Direction:</span>
                  <span class="text-foreground">{{ workSheetTemplate.rowWise ? "row-wise" : "column-wise" }}</span>
                </div>
              </div>
              <div v-if="workSheetTemplate.worksheetType == 'grid'">
                <div class="flex">
                  <span class="w-1/2 shrink-0 font-medium text-muted-foreground">Rows:</span>
                  <span class="text-foreground">{{ workSheetTemplate.rows }}</span>
                </div>
                <div class="flex">
                  <span class="w-1/2 shrink-0 font-medium text-muted-foreground">Columns:</span>
                  <span class="text-foreground">{{ workSheetTemplate.cols }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-lg font-semibold text-foreground">WorkSheet Layout Preview</h3>
          <hr class="my-2 border-t border-border" />

          <div v-if="workSheetTemplate.worksheetType == 'flat'" class="space-y-1">
             <div
                class="grid grid-cols-6 gap-x-2 items-center"
                v-for="(item, index) in layoutPreview"
                :key="`flat-${index}`"
              >
                <span class="col-span-1 my-1 text-xs text-muted-foreground text-right pr-1">{{ item.position }}:</span>
                <span
                  :class="[
                    'col-span-5 my-1 p-1.5 rounded-md flex justify-center items-center gap-1 text-xs font-medium border',
                    item.name !== 'sample'
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                      : 'bg-primary text-primary-foreground border-primary/50',
                  ]"
                >
                  <span v-if="item.name !== 'sample'" class="opacity-80">QC</span>
                  {{ item.name !== 'sample' ? 'Control' : 'Sample' }}
                </span>
             </div>
          </div>

          <div v-if="workSheetTemplate.worksheetType == 'grid'">
            <div v-if="workSheetTemplate.rowWise">
                <div
                  v-for="(row, rIndex) in workSheetTemplate.rows"
                  :key="`row-${rIndex}`"
                  :class="['grid gap-2 mb-1', `grid-cols-${workSheetTemplate.cols}`]"
                >
                  <div
                    v-for="(col, cIndex) in workSheetTemplate.cols"
                    :key="`row-${rIndex}-col-${cIndex}`"
                    class="col-span-1 w-full"
                  >
                    <template v-if="layoutPreview[rIndex * workSheetTemplate.cols + cIndex]">
                     <span
                       :class="[
                         'my-1 p-1 rounded-md flex justify-center items-center gap-1 text-xs font-medium border',
                         layoutPreview[rIndex * workSheetTemplate.cols + cIndex]?.name !== 'sample'
                           ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                           : 'bg-primary text-primary-foreground border-primary/50',
                       ]"
                     >
                       <span v-if="layoutPreview[rIndex * workSheetTemplate.cols + cIndex]?.name !== 'sample'" class="opacity-80">QC</span>
                       ({{ rIndex * workSheetTemplate.cols + cIndex + 1 }})
                       {{ layoutPreview[rIndex * workSheetTemplate.cols + cIndex]?.name !== 'sample' ? 'Control' : 'Sample' }}
                     </span>
                    </template>
                    <span v-else class="my-1 p-1 rounded-md flex justify-center items-center min-h-[28px] border border-dashed border-muted-foreground/30 bg-muted/30" aria-hidden="true">&nbsp;</span>
                  </div>
                </div>
             </div>

            <div v-else :class="['grid gap-2', `grid-cols-${workSheetTemplate.cols}`]">
              <div
                class="col-span-1 space-y-1"
                v-for="(col, cIndex) in workSheetTemplate.cols"
                :key="`col-${cIndex}`"
              >
                <div v-for="(row, rIndex) in workSheetTemplate.rows" :key="`col-${cIndex}-row-${rIndex}`">
                  <template v-if="layoutPreview[cIndex * workSheetTemplate.rows + rIndex]">
                    <span
                      :class="[
                        'p-1 rounded-md flex justify-center items-center gap-1 text-xs font-medium border',
                        layoutPreview[cIndex * workSheetTemplate.rows + rIndex]?.name !== 'sample'
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                          : 'bg-primary text-primary-foreground border-primary/50',
                      ]"
                    >
                      <span v-if="layoutPreview[cIndex * workSheetTemplate.rows + rIndex]?.name !== 'sample'" class="opacity-80">QC</span>
                      ({{ cIndex * workSheetTemplate.rows + rIndex + 1 }})
                      {{ layoutPreview[cIndex * workSheetTemplate.rows + rIndex]?.name !== 'sample' ? 'Control' : 'Sample' }}
                    </span>
                  </template>
                  <span v-else class="p-1 rounded-md flex justify-center items-center min-h-[28px] border border-dashed border-muted-foreground/30 bg-muted/30" aria-hidden="true">&nbsp;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 md:col-span-8 lg:col-span-9 p-10 text-center" v-else>
          <p class="text-muted-foreground">Select a template from the left to view details.</p>
      </div>
      
    </div>
  </div>

  <modal v-if="showModal" @close="showModal = false" content-width="max-w-4xl">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-card-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-6 space-y-6">

        <!-- Row 1: Template Name + Number of Samples -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label class="text-sm font-medium text-foreground">Template Name</Label>
            <Input
              class="w-full"
              v-model="workSheetTemplate.name"
              placeholder="Name ..."
            />
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium text-foreground">Samples (excl. reserved)</Label>
            <Input
              class="w-full"
              v-model.number="workSheetTemplate.numberOfSamples"
              placeholder="Count ..."
              type="number"
            />
          </div>
        </div>

        <!-- Row 2: Template Type + Grid options -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div class="space-y-2">
            <Label class="text-sm font-medium text-foreground">Template Type</Label>
            <select
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              @change="changeWorkSheetType($event)"
              v-model="workSheetTemplate.worksheetType"
            >
              <option value="flat">Single Column / Flat</option>
              <option value="grid">GRID</option>
            </select>
          </div>
          <template v-if="workSheetTemplate.worksheetType === 'grid'">
            <div class="space-y-2">
              <Label class="text-sm font-medium text-foreground">Cols</Label>
              <Input
                v-model.number="workSheetTemplate.cols"
                @keyup="calculateRows()"
                type="number"
                class="w-full"
              />
            </div>
            <div class="space-y-2">
              <Label class="text-sm font-medium text-foreground">Rows</Label>
              <Input
                v-model.number="workSheetTemplate.rows"
                type="number"
                disabled
                class="w-full bg-muted"
              />
            </div>
            <div class="flex items-center gap-2 pb-2">
              <Switch
                :checked="workSheetTemplate.rowWise"
                @update:checked="(value) => workSheetTemplate.rowWise = value"
              />
              <Label class="text-sm font-medium text-foreground cursor-pointer">Row Wise</Label>
            </div>
          </template>
        </div>

        <!-- Row 3: Instrument, Sample Type, Analysis Service -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="space-y-2">
            <Label class="text-sm font-medium text-foreground">Instrument</Label>
            <select
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              v-model="workSheetTemplate.instrumentUid"
            >
              <option value="">Select Instrument</option>
              <option
                v-for="instrument in instruments"
                :key="instrument.uid"
                :value="instrument.uid"
              >
                {{ instrument.name }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium text-foreground">Sample Type</Label>
            <select
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              v-model="workSheetTemplate.sampleTypeUid"
            >
              <option value="">Select Sample Type</option>
              <option v-for="stype in sampleTypes" :key="stype.uid" :value="stype.uid">
                {{ stype.name }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium text-foreground">Analysis Service</Label>
            <select
              class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              v-model="workSheetTemplate.analysisUid"
            >
              <option value="">Select Service</option>
              <option v-for="service in services" :key="service.uid" :value="service.uid">
                {{ service.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Reserved Positions -->
        <section id="samples" class="space-y-4">
          <hr class="border-t border-border" />
          <h5 class="text-sm font-semibold text-foreground">Reserved Positions</h5>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div class="sm:col-span-8 space-y-2">
              <Label class="text-sm font-medium text-foreground">QC Template</Label>
              <select
                class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                v-model="workSheetTemplate.qcTemplateUid"
              >
                <option value="">Select QC Template</option>
                <option
                  v-for="templ in qcTemplates"
                  :key="templ.uid"
                  :value="templ.uid"
                >
                  {{ templ.name }}
                </option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                class="w-full"
                @click="appyQCTemplate()"
              >
                Apply
              </Button>
            </div>
            <div class="sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                class="w-full"
                @click="addReserved()"
              >
                + Slot
              </Button>
            </div>
          </div>

          <template v-if="workSheetTemplate.reserved?.length > 0">
            <hr class="border-t border-border" />

            <div
              v-for="(reserved, index) in workSheetTemplate.reserved"
              :key="index"
              class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end"
            >
              <div class="sm:col-span-4 space-y-2">
                <Label class="text-sm font-medium text-foreground">Position</Label>
                <Input
                  v-model.number="reserved.position"
                  type="number"
                  min="1"
                  class="w-full"
                />
              </div>
              <div class="sm:col-span-6 space-y-2">
                <Label class="text-sm font-medium text-foreground">Blank/Control Level</Label>
                <select
                  v-model="reserved.levelUid"
                  class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select Level</option>
                  <option
                    v-for="level in qcLevels"
                    :key="level.uid"
                    :value="level.uid"
                  >
                    {{ level.level }}
                  </option>
                </select>
              </div>
              <div class="sm:col-span-2 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  class="shrink-0 text-destructive border-destructive hover:bg-destructive hover:text-white"
                  @click="removeReserved(index)"
                  aria-label="Remove slot"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </template>
        </section>

        <hr class="border-t border-border" />
        <Button
          type="button"
          class="w-full"
          @click="saveForm()"
        >
          Save Form
        </Button>
      </form>
    </template>
  </modal>
</template>

<style lang="postcss" scoped>
.scroll-section {
  height: 700px;
}

.tab-active {
  border-bottom: 2px solid rgb(194, 193, 193);
  color: rgb(37, 37, 37) !important;
}
</style>
