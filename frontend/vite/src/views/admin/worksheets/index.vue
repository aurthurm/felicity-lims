<template>
  <div class="mt-4">
    <div class="flex items-center">
      <h1 class="h1 my-4 font-bold text-dark-700">WorkSheet Templates</h1>
        <button
          class="p-2 my-2 ml-8 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100"
          @click="FormManager(true, null)"
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
            :class="workSheetTemplate?.uid === wst.uid ? 'bg-white w-full flex justify-between p-2 mb-1 rounded-xl shadow border c-active' : 'bg-white w-full flex justify-between p-2 mb-1 rounded-xl shadow border' "
          >
            <a
              href="#"
              @click.prevent.stop="selectWorkSheetTemplate(wst)"
              class="font-semibold text-gray-700"
            >
              <span>{{ wst.name }}</span>
            </a>
            <a href="#" @click="FormManager(false, wst)" class="px-2 cursor">
              <font-awesome-icon icon="pen" />
            </a>
          </div>
        </div>
      </section>

      <section class="col-span-9 overflow-y-scroll overscroll-contain scroll-section" v-if="workSheetTemplate.uid">

        <!-- Listing Item Card -->
        <div class="bg-white rounded-lg shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4 " >
          <div class="grid grid-cols-12 gap-3">
            <!-- Summary Column -->
            <div class="col-span-12 px-3 sm:px-0">
              <div class="flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold">
                <span>{{ workSheetTemplate.name }}</span>
                <div>
                  <button
                    @click="FormManager(false, workSheetTemplate)"
                    class="ml-4 inline-flex items-center justify-center w-8 h-8 mr-2 border-blue-500 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"
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
                    <span class="text-gray-800 text-sm font-medium w-1/2">Instrument:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{ workSheetTemplate.instrument?.name }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-1/2">Analyses Service:</span>
                    <span
                    class="text-gray-600 text-sm md:text-md ml-1"
                    v-for="anal in  workSheetTemplate.analyses" :key="anal.uid">{{ anal?.name }},</span>
                  </div>
                </div>
                <div class="col-span-1">
                  <!-- Communication Details -->
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-1/2">Number of Samples:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{ workSheetTemplate.numberOfSamples }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-1/2">Number of Reserved:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{ workSheetTemplate.reserved?.length }}</span>
                  </div>
                </div>
              </div>

              <hr  class="my-4"/>

              <div class="grid grid-cols-2 mt-2">
                  <div class="col-span-1">
                    <div class="flex w-full">
                      <span class="text-gray-800 text-sm font-medium w-1/2">WorkSheet type</span>
                      <span class="text-gray-600 text-sm md:text-md">{{ workSheetTemplate.worksheetType }}</span>
                    </div>
                    <div class="flex w-full" v-if="workSheetTemplate.worksheetType == 'grid'">
                      <span class="text-gray-800 text-sm font-medium w-1/2">Direction:</span>
                      <span class="text-gray-600 text-sm md:text-md">{{ workSheetTemplate.rowWise ? "row-wise" : "column-wise" }}</span>
                    </div>
                  </div>
                  <div class="col-span-1" v-if="workSheetTemplate.worksheetType == 'grid'">
                    <div class="flex w-full">
                      <span class="text-gray-800 text-sm font-medium w-1/2">Rows:</span>
                      <span class="text-gray-600 text-sm md:text-md">{{ workSheetTemplate.rows }}</span>
                    </div>
                    <div class="flex w-full">
                      <span class="text-gray-800 text-sm font-medium w-1/2">Columns:</span>
                      <span class="text-gray-600 text-sm md:text-md">{{ workSheetTemplate.cols }}</span>
                    </div>
                  </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Sample and Case Data -->
        <nav class="bg-white px-6 pt-2 shadow-md mt-2">
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

        <section class="mt-4">
          <div  v-if="currentTab === 'preview'">
            <h3 class="my-4">WorkSheet Layout Preview</h3>
            <hr class="my-2">

            <div v-if="workSheetTemplate.worksheetType == 'flat'">
              <div class="grid grid-cols-6 gap-x-2 w-1/2" v-for="(item, index) in workSheetTemplate?.preview || []" >
                <span class="col-span-1 my-1" >{{ item.position }}:</span>
                <span 
                :class="[
                'col-span-5 my-1 p-1 text-white rounded-xl flex justify-center',
                { 'bg-green-400': item.name !== 'sample' },
                { 'bg-blue-400': item.name === 'sample' },
                ]">{{ item.name }}</span>
              </div>
            </div>

            <div v-if="workSheetTemplate.worksheetType == 'grid'">

                    <div 
                      v-if="workSheetTemplate.rowWise" 
                      :class="[true ? 'grid grid-cols-' + workSheetTemplate.cols : '', 'gap-2']"
                      v-for="(row, index) in workSheetTemplate.rows" :key="index + 'x'">
                      <div v-for="(col, idx) in workSheetTemplate.cols" :key="idx" class="col-span-1 w-full">
                        <span 
                        :class="[
                        'my-1 p-1 text-white rounded-xl flex justify-center',
                        { 'bg-green-400': workSheetTemplate?.preview[index*workSheetTemplate.cols + col - 1]?.name !== 'sample' },
                        { 'bg-blue-400': workSheetTemplate?.preview[index*workSheetTemplate.cols + col - 1]?.name === 'sample' },
                        ]">({{ index*workSheetTemplate.cols + col }})  {{ workSheetTemplate?.preview[index*workSheetTemplate.cols + col - 1]?.name }}</span>
                      </div>
                    </div>

                    <div  
                      v-else 
                      :class="[true ? 'grid grid-cols-' + workSheetTemplate.cols : '', 'gap-2']">
                      <div 
                        class="col-span-1"
                        v-for="(col, index) in workSheetTemplate.cols" :key="index + 'y'">
                        <div v-for="(row, idx) in workSheetTemplate.rows" :key="idx">
                          <!-- <span class="my-1 flex justify-center" >{{ index*workSheetTemplate.rows + row }}</span> -->
                          <span 
                          :class="[
                          'my-1 p-1 text-white rounded-xl flex justify-center',
                          { 'bg-green-400': workSheetTemplate?.preview[index*workSheetTemplate.rows + row - 1]?.name !== 'sample' },
                          { 'bg-blue-400': workSheetTemplate?.preview[index*workSheetTemplate.rows + row - 1]?.name === 'sample' },
                          ]">({{ index*workSheetTemplate.rows + row }})  {{ workSheetTemplate?.preview[index*workSheetTemplate.rows + row - 1]?.name }}</span>
                        </div>
                      </div>
                    </div>

            </div>
          </div>
        </section>
      
      </section>

    </div>
  </div>

  <!-- Location Edit Form Modal -->
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
            <span class="text-red-400 ml-2 italic">(less reserved)</span>
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
            <select class="form-select block w-full mt-1" 
            @change="changeWorkSheetType($event)"
            v-model="workSheetTemplate.worksheetType">
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
                  type="number"
                  :disabled="workSheetTemplate.worksheetType === 'flat'"
                />
              </label>
              <label class="block col-span-1 mb-2">
                <span class="text-gray-700">Rows</span>
                <input
                  class="form-input mt-1 block w-full"
                  v-model="workSheetTemplate.rows"
                  type="number"
                  :disabled="workSheetTemplate.worksheetType === 'flat'"
                />
              </label>
              <label for="toggle" class="text-gray-700 mt-8 ml-4">
                <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input 
                    type="checkbox" 
                    name="toggle" id="toggle" 
                    v-model="workSheetTemplate.rowWise"
                   :disabled="workSheetTemplate.worksheetType === 'flat'"
                    class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"/>
                    <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
                <span class="text-gray-700 text-base">Row Wise</span>
              </label>
            </div>
          </span>
        </div>

        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Instrument</span>
            <select class="form-select block w-full mt-1" v-model="workSheetTemplate.instrument.uid">
              <option></option>
              <option v-for="instrument in instruments" :key="instrument.uid" :value="instrument.uid">{{ instrument.name }}</option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">SampleType</span>
            <select class="form-select block w-full mt-1" v-model="workSheetTemplate.sampleType.uid">
               <option></option>
              <option v-for="stype in sampleTypes" :key="stype.uid" :value="stype.uid"> {{ stype.name }}</option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Anslysis Service</span>
            <select class="form-select block w-full mt-1" v-model="workSheetTemplate.analyses[0].uid">
               <option></option>
              <option v-for="service in services" :key="service.uid" :value="service.uid"> {{ service.name }}</option>
            </select>
          </label>
        </div>


        <section id="samples">
            <hr>
            <div class="flex justify-between items-center py-2">
                <h5>Reserved Positions</h5>
                <label class="block col-span-1 mb-2">
                  <span class="text-gray-700">QC Template</span>
                  <div class="flex items-center">
                  <select class="form-select block w-full mt-1" v-model="workSheetTemplate.qcTemplateUid">
                    <option></option>
                    <option v-for="templ in qcTemplates" :key="templ.uid" :value="templ.uid"> {{ templ.name }}</option>
                  </select>
                  <button
                    @click.prevent="appyQCTemplate()"
                    class="px-2 py-1 ml-2 h-auto border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Apply</button>
                  </div>
                </label>
                <button
                @click.prevent="addReserved()"
                class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Add Reserve Slot</button>
            </div>
            <hr class="mb-4">
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
                                class="form-input mt-1 block w-full">
                                <option v-for="level in qcLevels" :key="level.uid" :value="level.uid"> {{ level.level }}</option>
                              </select>
                            </label>
                        </div>
                    </div>
                    <div class="">
                        <button
                        @click.prevent="removeReserved(index)"
                        class="px-2 py-1 mr-2 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none">Remove</button>
                    </div>
                </div>
                <hr>
            </div>

        </section>

        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
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

.c-active {
  background-color: lightblue;
}
</style>

<script lang="ts">
import tabContacts from './comps/ContactTable.vue';
import modal from '../../../components/SimpleModal.vue';

import { useMutation, useQuery } from '@urql/vue';
import { mapGetters, useStore } from 'vuex';
import { defineComponent, ref, reactive, computed } from 'vue';

import { ADD_WORKSHEET_TEMPLATE, EDIT_WORKSHEET_TEMPLATE } from '../../../graphql/worksheet.mutations';
import { ActionTypes, WorkSheetTemplate, IWorkSheetTemplate, Reserved } from '../../../store/modules/worksheets';
import { ActionTypes as AnalysisActionTypes, AnalysisService } from '../../../store/modules/analyses';
import { ActionTypes as SampleActionTypes, SampleType } from '../../../store/modules/samples';
import { ActionTypes as SetupActionTypes, Instrument } from '../../../store/modules/setup';

export default defineComponent({
  name: 'worksheet-templates',
  components: {
    tabContacts,
    modal,
  },
  setup() {
    const store = useStore();

    let currentTab = ref('preview');
    const tabs = ['preview'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);

    let showModal = ref(false);
    let createItem = ref(null);
    let workSheetTemplate = reactive({ ...(new WorkSheetTemplate()) });
    let formTitle = ref('');


    let analysesParams = reactive({ 
      first: undefined, 
      after: "",
      text: "", 
      sortBy: ["name"]
    });
    store.dispatch(AnalysisActionTypes.FETCH_ANALYSES_SERVICES, analysesParams);
    store.dispatch(SampleActionTypes.FETCH_SAMPLE_TYPES);
    store.dispatch(SetupActionTypes.FETCH_INSTRUMENTS);
    store.dispatch(AnalysisActionTypes.FETCH_ANALYSES_QC_TEMPLATES);
    store.dispatch(AnalysisActionTypes.FETCH_QC_LEVELS);
    store.dispatch(ActionTypes.FETCH_WORKSHEET_TEMPLATES);

    const { executeMutation: createWorksheetTemplate } = useMutation(ADD_WORKSHEET_TEMPLATE);
    const { executeMutation: updateWorksheetTemplate } = useMutation(EDIT_WORKSHEET_TEMPLATE);

    const qcTemplates =  computed(() => store.getters.getQCTemplates);
    const workSheetTemplates = computed(() => store.getters.getWorkSheetTemplates);

    function addWorksheetTemplate() {
      createWorksheetTemplate({ 
        name: workSheetTemplate.name,
        sampleTypeUid: workSheetTemplate.sampleType.uid,
        instrumentUid: workSheetTemplate.instrument.uid,
        description: workSheetTemplate.description,
        qcTemplateUid: workSheetTemplate.qcTemplateUid,
        reserved: workSheetTemplate.reserved,
        numberOfSamples: +workSheetTemplate.numberOfSamples,
        worksheetType: workSheetTemplate.worksheetType,
        cols:  workSheetTemplate.cols,
        rows:  workSheetTemplate.rows,
        rowWise:  workSheetTemplate.rowWise,
        analyses: workSheetTemplate.analyses[0]?.uid
       }).then((result) => {
        store.dispatch(ActionTypes.ADD_WORKSHEET_TEMPLATE, result)
      });
    }

    function editWorksheetTemplate() {
      updateWorksheetTemplate({ 
        uid: workSheetTemplate.uid,
        name: workSheetTemplate.name,
        sampleTypeUid: workSheetTemplate.sampleType.uid,
        instrumentUid: workSheetTemplate.instrument.uid,
        description: workSheetTemplate.description,
        qcTemplateUid: workSheetTemplate.qcTemplateUid,
        reserved: workSheetTemplate.reserved,
        numberOfSamples: workSheetTemplate.numberOfSamples,
        worksheetType: workSheetTemplate.worksheetType,
        cols:  workSheetTemplate.cols,
        rows:  workSheetTemplate.rows,
        rowWise:  workSheetTemplate.rowWise,
        analyses: workSheetTemplate.analyses[0]?.uid
       }).then((result) => {
        store.dispatch(ActionTypes.UPDATE_WORKSHEET_TEMPLATE, result)
      });
    }

    function generatePreview(wst: IWorkSheetTemplate): void {
      console.log(wst);
      let items = [];
      const indexes = Array.from({length: wst?.numberOfSamples + wst?.reserved?.length}, (x, i) => i + 1);
      
      indexes.forEach(i => {  
          let item = new Reserved();
          item.position = i;
          item.row = 1;
          item.col = 1;
          item.name ="sample"
          if(wst?.reserved?.some(x => x.position === i)){
            item.name ="control"
          }
          item.sampleUid = "";
          wst?.reserved?.forEach(r => {
            if(r[1]?.position === i) {
              item.name = r[1]?.name;
            }
          });
          items.push(item)
      });

      return items;
    }

    function selectWorkSheetTemplate(ws: IWorkSheetTemplate): void {
      Object.assign(workSheetTemplate, ws);
      const items = generatePreview(ws);
      workSheetTemplate!.preview = items;
      console.log(items);
    }

    function addReserved(): void {
      workSheetTemplate.reserved?.push(new Reserved());
    }

    function removeReserved(index): void {
        workSheetTemplate.reserved?.splice(index, 1);
    }

    function appyQCTemplate(): void {
      workSheetTemplate.reserved = [];
      if(!(workSheetTemplate.qcTemplateUid)) return;
      const template = qcTemplates.value?.find(item => item.uid === workSheetTemplate.qcTemplateUid);
      template?.qcLevels.forEach((level, index) => {
        let reserved = new Reserved();
        reserved.position = index + 1;
        reserved.levelUid = level.uid;
        workSheetTemplate.reserved?.push(reserved)
      });
    } 

    function changeWorkSheetType(event: IEvent): void {
      if(event.target.value == 'flat') {
        workSheetTemplate.cols = null;
        workSheetTemplate.rows = null;
      }
    }

    function FormManager(create, obj) {
      createItem.value = create;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "WOKKSHEET TEMPLATE";
      showModal.value = true;
      if (create) {
        let wst = new WorkSheetTemplate();
        wst.instrument = new Instrument;
        wst.sampleType = new SampleType;
        wst.analyses = [new AnalysisService];
        Object.assign(workSheetTemplate, { ...wst });
      } else {
        selectWorkSheetTemplate(obj)
        console.log(obj);
      }
    }

    function saveForm() {
      console.log("save object ", workSheetTemplate);
      if (createItem.value) addWorksheetTemplate();
      if (!createItem.value) editWorksheetTemplate();
      showModal.value = false;
    }

    return {
      showModal,
      tabs,
      currentTab,
      currentTabComponent,
      FormManager,
      saveForm,
      formTitle,
      workSheetTemplates,
      appyQCTemplate,
      qcTemplates,
      instruments: computed(() => store.getters.getInstruments),
      services: computed(() => {
        const services = store.getters.getAnalysesServicesSimple;
        const forQC = services?.filter(service => service?.category?.name !== 'Quality Control');
        return forQC;
      }),
      qcLevels: computed(() => store.getters.getQCLevels),
      sampleTypes: computed(() => store.getters.getSampleTypes),
      workSheetTemplate,
      selectWorkSheetTemplate,
      addReserved,
      removeReserved,
      changeWorkSheetType,
    };
  },
});
</script>
