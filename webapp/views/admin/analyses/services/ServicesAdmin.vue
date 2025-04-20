<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { IAnalysisService } from '@/models/analysis';
  import { AddAnalysisMappingDocument, AddAnalysisMappingMutation, AddAnalysisMappingMutationVariables,
    AddAnalysisServiceDocument, AddAnalysisServiceMutation, AddAnalysisServiceMutationVariables,
    EditAnalysisMappingDocument, EditAnalysisMappingMutation, EditAnalysisMappingMutationVariables,
    EditAnalysisServiceDocument, EditAnalysisServiceMutation, EditAnalysisServiceMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { useSetupStore } from '@/stores/setup';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSampleStore } from '@/stores/sample';
  import  useApiUtil  from '@/composables/api_util';
import { mutateForm, resetForm } from '@/utils';
  const VueMultiselect = defineAsyncComponent(
    () => import('vue-multiselect')
  )
  const accordion = defineAsyncComponent(
    () => import('@/components/ui/FelAccordion.vue')
  )
  const ResultOptions = defineAsyncComponent(
    () => import('./ResultOptions.vue')
  )
  const InterimFields = defineAsyncComponent(
    () => import('./InterimFields.vue')
  )
  const CorrectionFactor = defineAsyncComponent(
    () => import('./CorrectionFactor.vue')
  )
  const AnalysisUncertainty = defineAsyncComponent(
    () => import('./Uncertainty.vue')
  )
  const DetectionLimits = defineAsyncComponent(
    () => import('./DetectionLimit.vue')
  )
  const AnalysisSpecifications = defineAsyncComponent(
    () => import('./Specifications.vue')
  )
  const Billing = defineAsyncComponent(
    () => import('../Billing.vue')
  )


  const route = useRoute();
  const analysisStore = useAnalysisStore()
  const sampleStore = useSampleStore()
  const  setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  let currentTab = ref('general');
  const tabs = ['general', 'uncertainities', 'result-options','interims','correction-factor', 'detection-limits', 'specifications', 'mappings', 'billing'];
  
  let showModal = ref(false);
  let formTitle = ref('');
  let analysisService = reactive({}) as IAnalysisService; 
  const formAction = ref(true);

  const sampleTypes = computed<any[]>(() => sampleStore.getSampleTypes);
  const departments = computed<any[]>(() => setupStore.getDepartments);

  setupStore.fetchMethods();
  const methods = computed<any[]>(() => setupStore.getMethods);

  setupStore.fetchUnits();    
  const units = computed(() => setupStore.getUnits);

  analysisStore.fetchAnalysesCategories();
  const analysesCategories = computed(() => analysisStore.getAnalysesCategories)
  const analysesServices = computed(() => analysisStore.getAnalysesServices)

  watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.item) {
      const service = analysisStore.analysesServices.find(an => an.name === newQuery.item)
      mutateForm(analysisService, service)
    }
  },
  { immediate: true }
);

  let analysesParams = reactive({ 
    first: undefined, 
    after: "",
    text: "", 
    sortBy: ["name"]
  });
  analysisStore.fetchAnalysesServices(analysesParams);

  function addAnalysisService(): void {
    const payload = { 
      name: analysisService.name, 
      keyword: analysisService.keyword, 
      description: analysisService.description, 
      categoryUid: analysisService.categoryUid, 
      departmentUid: analysisService.departmentUid, 
      unitUid: analysisService.unitUid,
      sortKey: analysisService.sortKey,
      active: analysisService.active, 
      internalUse: analysisService.internalUse, 
      sampleTypes: analysisService.sampleTypes?.map(item => item.uid),
      methods: analysisService.methods?.map(item => item.uid),
      tatLengthMinutes: analysisService.tatLengthMinutes,
      precision: analysisService.precision,
      requiredVerifications: analysisService.requiredVerifications,
      selfVerification: analysisService.selfVerification,
    }
    withClientMutation<AddAnalysisServiceMutation, AddAnalysisServiceMutationVariables>(AddAnalysisServiceDocument, { payload }, "createAnalysis")
    .then((result) => analysisStore.addAnalysesService(result));
  }

  function editAnalysisService(): void {
    const payload = { 
      name: analysisService.name, 
      keyword: analysisService.keyword, 
      description: analysisService.description, 
      departmentUid: analysisService.departmentUid, 
      categoryUid: analysisService.categoryUid, 
      unitUid: analysisService.unitUid,
      sortKey: analysisService.sortKey,
      active: analysisService.active, 
      internalUse: analysisService.internalUse, 
      sampleTypes: analysisService.sampleTypes?.map(item => item.uid),
      methods: analysisService.methods?.map(item => item.uid),
      tatLengthMinutes: analysisService.tatLengthMinutes,
      precision: analysisService.precision,
      requiredVerifications: analysisService.requiredVerifications,
      selfVerification: analysisService.selfVerification,
    }
    withClientMutation<EditAnalysisServiceMutation, EditAnalysisServiceMutationVariables>(EditAnalysisServiceDocument, {  uid: analysisService.uid,  payload }, "updateAnalysis")
    .then((result) => analysisStore.updateAnalysisService(result));
  }

  function selectAnalysisService(service: IAnalysisService):void {
    mutateForm(analysisService, service)
  }

  function FormManager(create: boolean):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES SERVICE";

    if (create) resetForm(analysisService);
  }

  function saveForm():void {
    if (formAction.value === true) addAnalysisService();
    if (formAction.value === false) editAnalysisService();
    showModal.value = false;
  }

// Mapping
analysisStore.fetchCodingStandards()
const mappings = computed(() => analysisStore.analysesMapings?.filter(m => m.analysisUid === analysisService?.uid))
let showMappingModal = ref(false);
let mappingFormTitle = ref("");
const mappingFormAction = ref(true);
const mappingForm =  reactive({
  uid: undefined,
  analysisUid: undefined,
  codingStandardUid: undefined,
  name: "",
  code: "",
  description: ""
})

function addMapping(): void {
  const payload = {
    analysisUid: analysisService?.uid,
    codingStandardUid: mappingForm.codingStandardUid,
    name: mappingForm.name,
    code: mappingForm.code,
    description: mappingForm.description,
  };
  withClientMutation<AddAnalysisMappingMutation, AddAnalysisMappingMutationVariables>(AddAnalysisMappingDocument, { payload }, "createAnalysisMapping").then((result) => analysisStore.addAnalysesMapping(result));
}

function updateMapping(): void {
  const payload = {
    analysisUid: analysisService?.uid,
    codingStandardUid: mappingForm.codingStandardUid,
    name: mappingForm.name,
    code: mappingForm.code,
    description: mappingForm.description,
  };
  withClientMutation<EditAnalysisMappingMutation, EditAnalysisMappingMutationVariables>(EditAnalysisMappingDocument, { uid: mappingForm.uid, payload }, "updateAnalysisMapping").then((result) => analysisStore.updateAnalysesMapping(result));
}

function MappingFormManager(create: boolean, obj = {} as any): void {
  mappingFormAction.value = create;
  showMappingModal.value = true;
  mappingFormTitle.value = (create ? "CREATE" : "EDIT") + " " + "CONCEPT MAPPING";
  if (create) { resetForm(mappingForm) } else { mutateForm(mappingForm, obj)}
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
      <hr>
      <button
        class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      >Add Analyses Service</button>
      <hr>
    </div>

    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-2 overflow-y-scroll overscroll-contain max-h-[540px] bg-white p-1">
        <div class="w-full">
            <accordion v-for="category in analysesServices" :key="category[0]">
              <template v-slot:title>{{ category[0] }}</template>
              <template v-slot:body>
                  <div>
                    <ul>
                      <li 
                      v-for="service in category[1]" 
                      :key="service?.uid" class="cursor-pointer"
                      @click="selectAnalysisService(service)"
                      :class="[
                        { 'border-sky-800 bg-gray-200 underline pl-3': service.uid === analysisService.uid },
                      ]"
                      >
                        <div class="flex-grow p-1">
                          <div 
                            :class="[
                            'font-medium text-gray-500 hover:text-gray-700 flex justify-between',
                              { 'text-gray-700 font-medium': service.uid === analysisService.uid },
                            ]"
                          >
                            <span>{{ service?.name }}</span>
                            <span class="text-sm text-gray-500"></span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
              </template>
            </accordion>
        </div>
      </section>

      <section class="col-span-10" v-if="analysisService?.uid !== undefined">
        <!-- Question Listing Item Card -->
        <div class="bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4" >
          <div class="grid grid-cols-12 gap-3">
            <!-- Meta Column -->
            <div class="sm:col-span-2 text-center hidden sm:block">
              <!-- <div class="inline-block font-md text-medium mb-1"></div> -->
              <!-- Age -->
              <div class="grid grid-rows-2 mx-auto mb-1 py-3 w-4/5 2lg:w-3/5 rounded-sm bg-sky-800" >
                <p class="font-bold">KEYWORD</p>
                <div class="inline-block font-medium text-2xl text-white">
                  <font-awesome-icon icon="fa-exclamation-circle" />
                </div>
                <div class="inline-block font-medium text-white text-md mt-2">{{ analysisService?.keyword }}</div>
              </div>
            </div>
            <!-- Summary Column -->
            <div class="col-span-12 sm:col-start-3 sm:col-end-13 px-3 sm:px-0">
              <div
                class="flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold"
              >
                <span>{{ analysisService?.name }}</span>
                <div>
                  <button
                    @click="FormManager(false)"
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
                    <span class="text-gray-600 text-md font-bold w-52">Category:</span>
                    <span class="text-gray-600 text-md">{{ analysisService?.category?.name || 'un-categprised' }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-600 text-md font-bold w-52">Unit:</span>
                    <span class="text-gray-600 text-md">{{ analysisService?.unit?.name }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-600 text-md font-bold w-52">SortKey:</span>
                    <span class="text-gray-600 text-md">{{ analysisService?.sortKey || '---' }}</span>
                  </div>
                  <div class="flex mt-2">
                    <span class="text-gray-600 text-md font-bold w-52">TAT (minutes):</span>
                    <span class="text-gray-600 text-md mr-2">{{ analysisService?.tatLengthMinutes }}</span>
                  </div>
                  <div class="flex mt-2">
                    <span class="text-gray-600 text-md font-bold w-52">Precision (decimals):</span>
                    <span class="text-gray-600 text-md mr-2">{{ analysisService?.precision }}</span>
                  </div>
                </div>
                <div class="col-span-1">
                  <div class="col-span-2 flex mt-2">
                    <span class="text-gray-600 text-md font-bold w-52">Methods:</span>
                    <span class="text-gray-600 text-md mr-2">{{ analysisService?.methods?.map(s => s.name)?.join(', ') }}</span>
                  </div>
                  <div class="col-span-2 flex mt-2">
                    <span class="text-gray-600 text-md font-bold w-52">Sample Types:</span>
                    <span class="text-gray-600 text-md mr-2">{{ analysisService?.sampleTypes?.map(s => s.name)?.join(', ') }}</span>
                  </div>
                  <div class="flex mt-2">
                    <span class="text-gray-600 text-md font-bold w-52">Required verifications:</span>
                    <span class="text-gray-600 text-md mr-2">{{ analysisService?.requiredVerifications }}</span>
                  </div>
                  <div class="col-span-4 flex mt-2">
                    <span class="text-gray-600 text-md font-bold w-52">Allow self-verification:</span>
                    <span class="text-gray-600 text-md mr-2">{{ analysisService?.selfVerification }}</span>
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

      <section class="mt-2 p-2 bg-white">
        <div v-if="currentTab === 'general'">
          <h3>General</h3>
          <hr> 
          <input type="text">
        </div>
        <div v-else-if="currentTab === 'uncertainities'">
          <analysis-uncertainty :analysis="analysisService" :analysisUid="analysisService?.uid"/>
        </div>
        <div v-else-if="currentTab === 'correction-factor'">
          <correction-factor :analysis="analysisService" :analysisUid="analysisService?.uid"/>
        </div>
        <div v-else-if="currentTab === 'result-options'">
          <result-options :analysis="analysisService" :analysisUid="analysisService?.uid"/>
        </div>
        <div v-else-if="currentTab === 'interims'">
          <interim-fields :analysis="analysisService" :analysisUid="analysisService?.uid"/>
        </div>
        <div v-else-if="currentTab === 'detection-limits'">
          <detection-limits :analysis="analysisService" :analysisUid="analysisService?.uid"/>
        </div>
        <div v-else-if="currentTab === 'specifications'">
          <analysis-specifications :analysis="analysisService" :analysisUid="analysisService?.uid"/>
        </div>
        <div v-else-if="currentTab == 'mappings'">
            <div class="flex justify-between items-center mb-2">
              <h3>Concept Mappings</h3>
              <button @click="MappingFormManager(true)"
                class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add Mapping</button>
            </div>
            <hr />
            <div class="overflow-x-auto mt-4">
              <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
                <table class="min-w-full">
                    <thead>
                    <tr>
                        <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Coding Standard</th>
                        <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Name</th>
                        <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Code</th>
                        <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Description</th>
                        <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                    </tr>
                    </thead>
                    <tbody class="bg-white">
                    <tr v-for="mapp in mappings"  :key="mapp">
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="flex items-center">
                            <div class="text-sm leading-5 text-gray-800">{{ mapp.codingStandard?.name }}</div>
                          </div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="text-sm leading-5 text-sky-800">{{ mapp.name }}</div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="text-sm leading-5 text-sky-800">{{ mapp.code }}</div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                          <div class="text-sm leading-5 text-sky-800">{{ mapp.description }}</div>
                        </td>
                        <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                            <button @click="MappingFormManager(false, mapp)" class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Edit</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
              </div>
            </div>
        </div>
        <div v-else-if="currentTab == 'billing'">
          <Billing target="analysis" :targetUid="analysisService.uid" />
        </div>
      </section>

      </section>
    </div>
  </div>


  <!-- AnaltsisService Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :contentWidth="'w-1/2'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-6 gap-x-4 mb-4">
          <label class="block col-span-4 mb-2">
            <span class="text-gray-700">Analysis Service Name</span>
            <input v-if="!analysisService.keyword?.includes('felicity')"
              class="form-input mt-1 block w-full"
              v-model="analysisService.name"
              placeholder="Name ..."
            />
            <span class="block mt-2 mb-4 font-bold text-xl" v-else>{{ analysisService.name }}</span>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">keyword</span>
            <input v-if="!analysisService.keyword?.includes('felicity')"
              class="form-input mt-1 block w-full"
              v-model="analysisService.keyword"
              placeholder="Keyword ..."
            />
            <span class="block mt-2 mb-4 italic font-semibold" v-else>{{ analysisService.keyword }}</span>
          </label>
          <label class="block col-span-1 mb-2" v-show="!analysisService.keyword?.includes('felicity')">
            <span class="text-gray-700">Unit</span>
            <select class="form-select block w-full mt-1" v-model="analysisService.unitUid">
               <option></option>
              <option v-for="unit in units" :key="unit.uid" :value="unit?.uid">{{ unit.name }}</option>
            </select>
          </label>
        </div>
    
        <div class="grid grid-cols-6 gap-x-4 mb-4">
          <label class="block col-span-3 mb-2">
            <span class="text-gray-700">Sample Types</span>
            <VueMultiselect
            v-model="analysisService.sampleTypes"
            :options="sampleTypes"
            :multiple="true"
            :searchable="true"
            label="name"
            track-by="uid">
            </VueMultiselect>
          </label>
          <label class="block col-span-3 mb-2">
            <span class="text-gray-700">Methods</span>
            <VueMultiselect
            v-model="analysisService.methods"
            :options="methods"
            :multiple="true"
            :searchable="true"
            label="name"
            track-by="uid">
            </VueMultiselect>
          </label>
          <label class="block col-span-6 mb-2">
            <span class="text-gray-700">Description</span>
            <textarea v-if="!analysisService.keyword?.includes('felicity')"
            cols="2"
              class="form-input mt-1 block w-full"
              v-model="analysisService.description"
              placeholder="Description ..."
            />
            <span class="block p-2 mt-2 mb-4 bg-gray-100" v-else>{{ analysisService.description }}</span>
          </label>
        </div>
    
        <div class="grid grid-cols-6 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Department</span>
            <select class="form-select block w-full mt-1" v-model="analysisService.departmentUid">
               <option></option>
              <option v-for="department in departments" :key="department.uid" :value="department?.uid">{{ department.name }}</option>
            </select>
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Analysis Category</span>
            <select class="form-select block w-full mt-1" v-model="analysisService.categoryUid">
               <option></option>
              <option v-for="category in analysesCategories" :key="category.uid" :value="category?.uid">{{ category.name }}</option>
            </select>
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Sort Key</span>
            <input
              type="number" default="1"
              class="form-input mt-1 block w-full"
              v-model="analysisService.sortKey"
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">TAT (minutes)</span>
            <input
              type="number" default="240"
              class="form-input mt-1 block w-full"
              v-model="analysisService.tatLengthMinutes"
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Precision</span>
            <input
              type="number" default="4"
              class="form-input mt-1 block w-full"
              v-model="analysisService.precision"
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Required veifications</span>
            <input
              type="number" default="1"
              class="form-input mt-1 block w-full"
              v-model="analysisService.requiredVerifications"
            />
          </label>
        </div>
    
        <div class="col-span-4 flex justify-between">
          <label class="block col-span-2 my-2">
            <input
              type="checkbox"
              v-model="analysisService.active"
            />
            <span class="text-gray-700 ml-4">Is Active</span>
          </label>
          <label class="block col-span-2 my-2">
            <input
              type="checkbox"
              v-model="analysisService.internalUse"
            />
            <span class="text-gray-700 ml-4">Internal Use</span>
          </label>
          <label class="block col-span-2 my-2">
            <input
              type="checkbox"
              v-model="analysisService.selfVerification"
            />
            <span class="text-gray-700 ml-4">Allow Self Verifaction</span>
          </label>
        </div>
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
  </fel-modal>



    <!-- MappingForm Modal -->
    <fel-modal v-if="showMappingModal" @close="showMappingModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Coding Standard</span>
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
            <span class="text-gray-700">Standard Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="mappingForm.name"
              placeholder="Keyword ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Standard Code</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="mappingForm.code"
              placeholder="Keyword ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Standard Description</span>
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
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </fel-modal>


</template>
