<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent } from "vue";
import { IAnalysisTemplate, IAnalysisService } from "../../../models/analysis";
import {
  ADD_ANALYSIS_TEMPLATE,
  EDIT_ANALYSIS_TEMPLATE,
} from "../../../graphql/operations/analyses.mutations";
import { useSetupStore, useAnalysisStore } from "../../../stores";
import { useApiUtil } from "../../../composables";

const modal = defineAsyncComponent(
  () => import("../../../components/SimpleModal.vue")
)
const accordion = defineAsyncComponent(
  () => import("../../../components/Accordion.vue")
)


const analysisStore = useAnalysisStore();
const setupStore = useSetupStore();
const { withClientMutation } = useApiUtil();

let currentTab = ref("analyses-services");
const tabs = ["analyses-services"];

let showModal = ref(false);
let formTitle = ref("");
const formAction = ref(true);

let analysisTemplate = reactive({}) as IAnalysisTemplate;

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
  withClientMutation(ADD_ANALYSIS_TEMPLATE, { payload }, "createAnalysisTemplate").then((result) =>
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
  withClientMutation(
    EDIT_ANALYSIS_TEMPLATE,
    { uid: analysisTemplate.uid, payload },
    "updateAnalysisTemplate"
  ).then((result) => analysisStore.updateAnalysesTemplate(result));
}

function select(template: IAnalysisTemplate): void {
  Object.assign(analysisTemplate, { ...template });
  // get services that fall into this template
  analysesServices.value?.forEach((item) => {
    item[1].forEach((service: IAnalysisService) => {
      service.checked = false;
      if (template.analyses?.some((a) => a.uid === service.uid) || false) {
        service.checked = true;
      }
    });
  });
}

function updateTemplate(): void {
  const analyses: IAnalysisService[] = [];
  analysesServices.value?.forEach((item) => {
    item[1].forEach((service: IAnalysisService) => {
      if (service.checked) {
        analyses.push(service);
      }
    });
  });
  analysisTemplate.analyses = analyses;
  editAnalysisTemplate();
}

function FormManager(create: boolean, obj = {} as IAnalysisTemplate): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "ANALYSES TEMPLATE";
  if (create) {
    Object.assign(analysisTemplate, {} as IAnalysisTemplate);
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
  <div class="">
    <div class="container w-full my-4">
      <hr />
      <button
        class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      >
        Add Analyses Template
      </button>
      <hr />
      <!-- <input
        class="w-64 h-10 ml-6 pl-4 pr-2 py-1 text-sm text-gray-700 placeholder-gray-600 border-1 border-gray-400 rounded-sm  focus:placeholder-gray-500 focus:border-emerald-200 focus:outline-none focus:shadow-outline-purple form-input"
        type="text" placeholder="Search ..." aria-label="Search"
        @keyup="searchProfile($event)"
        @focus="setProfileToNull()"
      /> -->
    </div>
    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-3 overflow-y-scroll overscroll-contain max-h-[540px]">
        <ul>
          <li
            v-for="template in analysesTemplates"
            :key="template.uid"
           
            @click.prevent.stop="select(template)"
            :class="[
              'bg-white w-full p-1 mb-1 rounded',
              { 'border-gray-100 bg-emerald-200': template?.uid === analysisTemplate?.uid },
            ]"
          >
            <a class="cursor-pointer">
              <div class="flex-grow p-1">
                <div
                  class="font-medium text-gray-500 hover:text-gray-700 flex justify-between"
                >
                  <span>{{ template?.name }}</span>
                  <span class="text-sm text-gray-500"></span>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </section>

      <section class="col-span-9" v-if="analysisTemplate?.uid !== undefined">
        <div
          class="bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4"
        >
          <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 px-3 sm:px-0">
              <div
                class="flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold"
              >
                <span>{{ analysisTemplate?.name }}</span>
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
            </div>
          </div>
        </div>

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
                  <accordion>
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
                  </accordion>
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
        </section>
      </section>
    </div>
  </div>

  <!-- AnaltsisProfile Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Analysis Template Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="analysisTemplate.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Description</span>
            <textarea
              cols="2"
              class="form-input mt-1 block w-full"
              v-model="analysisTemplate.description"
              placeholder="Description ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Department</span>
            <select
              class="form-select block w-full mt-1"
              v-model="analysisTemplate.departmentUid"
            >
              <option></option>
              <option
                v-for="department in departments"
                :key="department.uid"
                :value="department?.uid"
              >
                {{ department.name }}
              </option>
            </select>
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
  </modal>

</template>
