<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent } from "vue";

import {
  ADD_WORKSHEET_TEMPLATE,
  EDIT_WORKSHEET_TEMPLATE,
} from "@/graphql/operations/worksheet.mutations";
import {
  useWorksheetStore,
  useAnalysisStore,
  useSampleStore,
  useSetupStore,
} from "@/stores";
import { useApiUtil } from "@/composables";
import { IReserved, IWorkSheetTemplate } from "@/models/worksheet";
import {
  IAnalysisService,
  IQCLevel,
  IQCTemplate,
  ISampleType,
} from "@/models/analysis";
import { IInstrument } from "@/models/setup";
const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)

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
let workSheetTemplate = reactive({}) as IWorkSheetTemplate;
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

const qcTemplates = computed<IQCTemplate[]>(() => analysisStore.getQCTemplates);
const workSheetTemplates = computed<IWorkSheetTemplate[]>(
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
  withClientMutation(
    ADD_WORKSHEET_TEMPLATE,
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
  withClientMutation(
    EDIT_WORKSHEET_TEMPLATE,
    { uid: workSheetTemplate.uid, payload },
    "updateWorksheetTemplate"
  ).then((result) => worksheetStore.updateWorksheetTemplate(result));
}

function generatePreview(wst: IWorkSheetTemplate): IReserved[] {
  let items: IReserved[] = [];
  const indexes: number[] = Array.from(
    { length: wst?.numberOfSamples! + wst?.reserved!?.length },
    (x, i) => i + 1
  );

  indexes.forEach((i) => {
    let item = {
      position: i,
      row: 1,
      col: 1,
      name: "sample",
      sampleUid: undefined,
    };
    if (wst?.reserved?.some((x) => x.position === i)) {
      item.name = "control";
    }
    wst?.reserved?.forEach((r: any) => {
      if (r[1]?.position === i) {
        item.name = r[1]?.name;
      }
    });
    items.push(item as any);
  });

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

function selectWorkSheetTemplate(ws: IWorkSheetTemplate): void {
  Object.assign(workSheetTemplate, ws);
  const items = generatePreview(ws);
  workSheetTemplate!.preview = items;
}

function addReserved(): void {
  workSheetTemplate.reserved?.push({} as IReserved);
  calculateRows();
}

function removeReserved(index: number): void {
  workSheetTemplate.reserved?.splice(index, 1);
}

function appyQCTemplate(): void {
  workSheetTemplate.reserved = [];
  if (!workSheetTemplate.qcTemplateUid) return;
  const template: IQCTemplate | undefined = qcTemplates.value?.find(
    (item: IQCTemplate) => item.uid === workSheetTemplate.qcTemplateUid
  );
  template?.qcLevels!.forEach((level, index) => {
    workSheetTemplate.reserved?.push({
      position: index + 1,
      levelUid: level.uid,
    } as IReserved);
  });
  calculateRows();
}

function changeWorkSheetType(event: any): void {
  if (event.target.value == "flat") {
    workSheetTemplate.cols = undefined;
    workSheetTemplate.rows = undefined;
  }
}

function FormManager(create: boolean, obj = {} as IWorkSheetTemplate) {
  createItem.value = create;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "WOKKSHEET TEMPLATE";
  showModal.value = true;
  if (Create, related: list[str] = None) {
    let wst = {} as IWorkSheetTemplate;
    wst.instrument = {} as IInstrument;
    wst.sampleType = {} as ISampleType;
    wst.analysis = {} as IAnalysisService;
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

const instruments = computed<IInstrument[]>(() => setupStore.getInstruments);
const services = computed(() => {
  const services: IAnalysisService[] = analysisStore.getAnalysesServicesSimple;
  const forQC = services?.filter(
    (service) => service?.category?.name !== "Quality Control"
  );
  return forQC;
});
const qcLevels = computed<IQCLevel[]>(() => analysisStore.getQCLevels);
const sampleTypes = computed<ISampleType[]>(() => sampleStore.getSampleTypes);
</script>

<template>
  <div class="mt-4">
    <div class="flex items-center">
      <h1 class="h1 my-4 font-bold text-dark-700">WorkSheet Templates</h1>
      <button
        class="p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"
        @click="FormManager(true)"
      >
        Add Template
      </button>
    </div>
    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-3">
        <div class="overflow-y-scroll overscroll-contain scroll-section">
          <div
            v-for="wst in workSheetTemplates"
            :key="wst.uid"
            :class="
              workSheetTemplate?.uid === wst.uid
                ? 'w-full flex justify-between p-2 mb-1 rounded-sm shadow border border-sky-800 bg-emerald-200'
                : 'bg-white w-full flex justify-between p-2 mb-1 rounded-sm shadow border'
            "
          >
            <a
             
              @click.prevent.stop="selectWorkSheetTemplate(wst)"
              class="font-semibold text-gray-700"
            >
              <span>{{ wst.name }}</span>
            </a>
            <a @click="FormManager(false, wst)" class="px-2 cursor">
              <font-awesome-icon icon="pen" />
            </a>
          </div>
        </div>
      </section>

      <section
        class="col-span-9 overflow-y-scroll overscroll-contain scroll-section"
        v-if="workSheetTemplate.uid"
      >
        <!-- Listing Item Card -->
        <div
          class="bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4"
        >
          <div class="grid grid-cols-12 gap-3">
            <!-- Summary Column -->
            <div class="col-span-12 px-3 sm:px-0">
              <div
                class="flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold"
              >
                <span>{{ workSheetTemplate.name }}</span>
                <div>
                  <button
                    @click="FormManager(false, workSheetTemplate)"
                    class="ml-4 inline-flex items-center justify-center w-8 h-8 mr-2 border-sky-800 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <hr />
              <div class="grid grid-cols-2 mt-2">
                <div class="col-span-1">
                  <!-- Client Details -->
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-1/2"
                      >Instrument:</span
                    >
                    <span class="text-gray-600 text-sm md:text-md">{{
                      workSheetTemplate.instrument?.name
                    }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-1/2"
                      >Analyses Service:</span
                    >
                    <span class="text-gray-600 text-sm md:text-md ml-1">{{
                      workSheetTemplate?.analysis?.name
                    }}</span>
                  </div>
                </div>
                <div class="col-span-1">
                  <!-- Communication Details -->
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-1/2"
                      >Number of Samples:</span
                    >
                    <span class="text-gray-600 text-sm md:text-md">{{
                      workSheetTemplate.numberOfSamples
                    }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-1/2"
                      >Number of Reserved:</span
                    >
                    <span class="text-gray-600 text-sm md:text-md">{{
                      workSheetTemplate.reserved?.length
                    }}</span>
                  </div>
                </div>
              </div>

              <hr class="my-4" />

              <div class="grid grid-cols-2 mt-2">
                <div class="col-span-1">
                  <div class="flex w-full">
                    <span class="text-gray-800 text-sm font-medium w-1/2"
                      >WorkSheet type</span
                    >
                    <span class="text-gray-600 text-sm md:text-md">{{
                      workSheetTemplate.worksheetType
                    }}</span>
                  </div>
                  <div
                    class="flex w-full"
                    v-if="workSheetTemplate.worksheetType == 'grid'"
                  >
                    <span class="text-gray-800 text-sm font-medium w-1/2"
                      >Direction:</span
                    >
                    <span class="text-gray-600 text-sm md:text-md">{{
                      workSheetTemplate.rowWise ? "row-wise" : "column-wise"
                    }}</span>
                  </div>
                </div>
                <div class="col-span-1" v-if="workSheetTemplate.worksheetType == 'grid'">
                  <div class="flex w-full">
                    <span class="text-gray-800 text-sm font-medium w-1/2">Rows:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{
                      workSheetTemplate.rows
                    }}</span>
                  </div>
                  <div class="flex w-full">
                    <span class="text-gray-800 text-sm font-medium w-1/2">Columns:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{
                      workSheetTemplate.cols
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sample and Case Data -->
        <nav class="bg-white shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
             
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <section class="mt-4">
          <div v-if="currentTab === 'preview'">
            <h3 class="my-4">WorkSheet Layout Preview</h3>
            <hr class="my-2" />

            <div v-if="workSheetTemplate.worksheetType == 'flat'">
              <div
                class="grid grid-cols-6 gap-x-2 w-1/2"
                v-for="(item, index) in workSheetTemplate?.preview || []"
              >
                <span class="col-span-1 my-1">{{ item.position }}:</span>
                <span
                  :class="[
                    'col-span-5 my-1 p-1 text-white rounded-xl flex justify-center',
                    { 'bg-emerald-600': item.name !== 'sample' },
                    { 'bg-sky-800': item.name === 'sample' },
                  ]"
                  >{{ item.name }}</span
                >
              </div>
            </div>

            <div v-if="workSheetTemplate.worksheetType == 'grid'">
              <div
                v-if="workSheetTemplate.rowWise"
                :class="[true ? 'grid grid-cols-' + workSheetTemplate.cols : '', 'gap-2']"
                v-for="(row, index) in workSheetTemplate.rows"
                :key="index + 'x'"
              >
                <div
                  v-for="(col, idx) in workSheetTemplate.cols"
                  :key="idx"
                  class="col-span-1 w-full"
                >
                  <span
                    :class="[
                        'my-1 p-1 text-white rounded-xl flex justify-center',
                        { 'bg-emerald-600': workSheetTemplate?.preview![index*workSheetTemplate.cols! + col - 1]?.name !== 'sample' },
                        { 'bg-sky-800': workSheetTemplate?.preview![index*workSheetTemplate.cols! + col - 1]?.name === 'sample' },
                        ]"
                    >({{ index*workSheetTemplate.cols! + col }})
                    {{ workSheetTemplate?.preview![index*workSheetTemplate.cols! + col - 1]?.name }}</span
                  >
                </div>
              </div>

              <div
                v-else
                :class="[true ? 'grid grid-cols-' + workSheetTemplate.cols : '', 'gap-2']"
              >
                <div
                  class="col-span-1"
                  v-for="(col, index) in workSheetTemplate.cols"
                  :key="index + 'y'"
                >
                  <div v-for="(row, idx) in workSheetTemplate.rows" :key="idx">
                    <!-- <span class="my-1 flex justify-center" >{{ index*workSheetTemplate.rows + row }}</span> -->
                    <span
                      :class="[
                          'my-1 p-1 text-white rounded-xl flex justify-center',
                          { 'bg-emerald-600': workSheetTemplate?.preview![index*workSheetTemplate.rows! + row - 1]?.name !== 'sample' },
                          { 'bg-sky-800': workSheetTemplate?.preview![index*workSheetTemplate.rows! + row - 1]?.name === 'sample' },
                          ]"
                      >({{ index*workSheetTemplate.rows! + row }})
                      {{ workSheetTemplate?.preview![index*workSheetTemplate.rows! + row - 1]?.name }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  </div>

  <!-- WS Template Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Template Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="workSheetTemplate.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Number of Samples</span>
            <span class="text-orange-600 ml-2 italic">(less reserved)</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="workSheetTemplate.numberOfSamples"
              placeholder="Count ..."
              type="number"
            />
          </label>
        </div>

        <div class="grid grid-cols-4 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Template Type</span>
            <select
              class="form-select block w-full mt-1"
              @change="changeWorkSheetType($event)"
              v-model="workSheetTemplate.worksheetType"
            >
              <option value="flat">Single Column / Flat</option>
              <option value="grid">GRID</option>
            </select>
          </label>
          <span class="col-span-3" v-if="workSheetTemplate.worksheetType === 'grid'">
            <div class="grid grid-cols-3 gap-x-4">
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Cols</span>
                <input
                  class="form-input mt-1 block w-full"
                  v-model="workSheetTemplate.cols"
                  @keyup="calculateRows()"
                  type="number"
                />
              </label>
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Rows</span>
                <input
                  class="form-input mt-1 block w-full bg-gray-100"
                  v-model="workSheetTemplate.rows"
                  type="number"
                  disabled
                />
              </label>
              <label for="toggle" class="text-gray-700 mt-8 ml-4">
                <div
                  class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
                >
                  <input
                    type="checkbox"
                    name="toggle"
                    id="toggle"
                    v-model="workSheetTemplate.rowWise"
                    class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"
                  />
                  <label
                    for="toggle"
                    class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
                <span class="text-gray-700 text-base">Row Wise</span>
              </label>
            </div>
          </span>
        </div>

        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Instrument</span>
            <select
              class="form-select block w-full mt-1"
              v-model="workSheetTemplate.instrumentUid"
            >
              <option></option>
              <option
                v-for="instrument in instruments"
                :key="instrument.uid"
                :value="instrument.uid"
              >
                {{ instrument.name }}
              </option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">SampleType</span>
            <select
              class="form-select block w-full mt-1"
              v-model="workSheetTemplate.sampleTypeUid"
            >
              <option></option>
              <option v-for="stype in sampleTypes" :key="stype.uid" :value="stype.uid">
                {{ stype.name }}
              </option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Anslysis Service</span>
            <select
              class="form-select block w-full mt-1"
              v-model="workSheetTemplate.analysisUid"
            >
              <option></option>
              <option v-for="service in services" :key="service.uid" :value="service.uid">
                {{ service.name }}
              </option>
            </select>
          </label>
        </div>

        <section id="samples">
          <hr />
          <div class="flex justify-between items-center py-2">
            <h5>Reserved Positions</h5>
            <label class="block col-span-1 mb-2">
              <span class="text-gray-700">QC Template</span>
              <div class="flex items-center">
                <select
                  class="form-select block w-full mt-1"
                  v-model="workSheetTemplate.qcTemplateUid"
                >
                  <option></option>
                  <option
                    v-for="templ in qcTemplates"
                    :key="templ.uid"
                    :value="templ.uid"
                  >
                    {{ templ.name }}
                  </option>
                </select>
                <button
                  @click.prevent="appyQCTemplate()"
                  class="px-2 py-1 ml-2 h-auto border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
                >
                  Apply
                </button>
              </div>
            </label>
            <button
              @click.prevent="addReserved()"
              class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
            >
              Add Reserve Slot
            </button>
          </div>
          <hr class="mb-4" />
          <div v-for="(reserved, index) in workSheetTemplate.reserved" :key="index">
            <div class="flex items-center justify-between">
              <div class="">
                <div class="grid grid-cols-6 gap-x-4">
                  <label class="block col-span-2 mb-2">
                    <span class="text-gray-700">Position</span>
                    <input
                      class="form-input mt-1 block w-full"
                      v-model="reserved.position"
                      type="number"
                    />
                  </label>
                  <label class="block col-span-2 mb-2">
                    <span class="text-gray-700">Blank/Control</span>
                    <select
                      v-model="reserved.levelUid"
                      class="form-input mt-1 block w-full"
                    >
                      <option
                        v-for="level in qcLevels"
                        :key="level.uid"
                        :value="level.uid"
                      >
                        {{ level.level }}
                      </option>
                    </select>
                  </label>
                </div>
              </div>
              <div class="">
                <button
                  @click.prevent="removeReserved(index)"
                  class="px-2 py-1 mr-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"
                >
                  Remove
                </button>
              </div>
            </div>
            <hr />
          </div>
        </section>

        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
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
