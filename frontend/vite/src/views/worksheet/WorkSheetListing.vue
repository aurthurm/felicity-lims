<script setup lang="ts">
import LoadingMessage from "../../components/Spinners/LoadingMessage.vue";
import modal from "../../components/SimpleModal.vue";
import { ref, reactive, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { useWorksheetStore, useUserStore } from "../../stores";
import { useApiUtil } from "../../composables";
import { ADD_WORKSHEET } from "../../graphql/worksheet.mutations";
import { ifZeroEmpty } from "../../utils";
import { IWorkSheetForm } from "../../models/worksheet";
import { IAnalysisService } from "../../models/analysis";

import * as shield from "../../guards";

const worksheetStore = useWorksheetStore();
const userStore = useUserStore();
const { withClientMutation } = useApiUtil();

const { workSheets, fetchingWorkSheets, workSheetTemplates } = storeToRefs(
  worksheetStore
);

const route = useRoute();

let showModal = ref<boolean>(false);
let formTitle = ref<string>("");
let form = reactive<IWorkSheetForm>({ count: 1 } as IWorkSheetForm);
const formAction = ref<boolean>(true);
let pageInfo = computed(() => worksheetStore.getWorkSheetPageInfo);
let filterText = ref<string>("");
let filterStatus = ref<string>("pending");

worksheetStore.removeWorksheet();

let workSheetBatch = ref<number>(25);
let workSheetParams = reactive({
  first: workSheetBatch.value,
  after: "",
  status: "",
  text: "",
  clientUid: +ifZeroEmpty(route?.query?.clientUid),
  filterAction: false,
});
worksheetStore.fetchWorkSheets(workSheetParams);
worksheetStore.fetchWorkSheetTemplates();
userStore.fetchUsers({});

// fetch instruments, analysts, methods
const workSheetCount = computed(
  () =>
    worksheetStore.getWorkSheets?.length +
    " of " +
    worksheetStore.getWorkSheetCount +
    " worksheets"
);
function addWorksheet(): void {
  form.count = +form.count;
  withClientMutation(ADD_WORKSHEET, form, "createWorksheet").then((result) => {
    worksheetStore.addWorksheet(result);
    showModal.value = false;
  });
}

function analysesText(analyses: IAnalysisService[]): string {
  let names: string[] = [];
  analyses?.forEach((a) => names.push(a.name!));
  return names?.join(", ");
}

function FormManager(create: boolean): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "WORKSHEET";
  if (create) {
    Object.assign(form, { count: 1 } as IWorkSheetForm);
  }
}

function saveForm(): void {
  if (formAction.value === true) addWorksheet();
  showModal.value = false;
}

function showMoreWorkSheets(): void {
  workSheetParams.first = +workSheetBatch.value;
  workSheetParams.after = pageInfo?.value?.endCursor;
  workSheetParams.text = filterText.value;
  workSheetParams.status = filterStatus.value;
  workSheetParams.filterAction = false;
  worksheetStore.fetchWorkSheets(workSheetParams);
}

function filterWorkSheets(): void {
  workSheetBatch.value = 25;
  workSheetParams.first = 25;
  workSheetParams.after = "";
  workSheetParams.text = filterText.value;
  workSheetParams.status = filterStatus.value;
  workSheetParams.filterAction = true;
  worksheetStore.fetchWorkSheets(workSheetParams);
}

const analysts = computed(() => userStore.getUsers);
const analystName = (analyst: any) => {
  if (analyst?.auth?.userName) return analyst?.auth?.userName;
  if (analyst?.firstName) return analyst.firstName + " " + analyst.lastName;
  return "----";
};
</script>

<template>
  <h2>WORKSHEETS</h2>
  <div class="flex justify-between items-center">
    <div class="my-4 flex sm:flex-row flex-col">
      <div class="flex flex-row mb-1 sm:mb-0">
        <div class="relative">
          <select
            v-model="filterStatus"
            class="appearance-none h-full rounded-l-sm border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="awaiting">Awaiting</option>
            <option value="approved">Aproved</option>
            <option value="empty">Empty</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="block relative">
        <span class="h-full absolute inset-y-0 left-0 flex items-center pl-2">
          <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current text-gray-500">
            <path
              d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"
            ></path>
          </svg>
        </span>
        <input
          placeholder="Search ..."
          v-model="filterText"
          class="appearance-none rounded-r-sm rounded-l-sm sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
        />
      </div>
      <button
        @click.prevent="filterWorkSheets()"
        class="px-2 py-1 ml-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Filter ...
      </button>
    </div>

    <!-- <div v-show="hasRights(userRole, objects.WORKSHEET, actions.CREATE)"> -->
    <div>
      <button
        v-show="shield.hasRights(shield.actions.CREATE, shield.objects.WORKSHEET)"
        @click.prevent="FormManager(true)"
        class="p-2 h-10 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Add WorkSheet
      </button>
    </div>
  </div>

  <!-- Sampe Table View -->
  <div class="overflow-x-auto mt-4">
    <div
      class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"
    >
      <table class="min-w-full">
        <thead>
          <tr>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
            ></th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
            >
              WorkSheet ID
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Analysis/Test
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Samples
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Instrument
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Analyst
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Status
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300"></th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="worksheet in workSheets" :key="worksheet?.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <!-- <span v-if="worksheet.priority > 1"
                  :class="[
                      'font-small',
                      { 'text-orange-600': worksheet.priority > 1 },
                  ]">
                      <i class="fa fa-star"></i>
                  </span> -->
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="flex items-center">
                <div>
                  <div
                    v-if="worksheet?.uid"
                    class="text-sm leading-5 text-gray-800 font-semibold"
                  >
                    <router-link
                      :to="{
                        name: 'worksheet-detail',
                        params: { workSheetUid: worksheet?.uid },
                      }"
                      >{{ worksheet?.worksheetId }}</router-link
                    >
                  </div>
                </div>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ analysesText(worksheet?.analyses!) }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ worksheet?.assignedCount }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ worksheet?.instrument?.name || "None" }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ analystName(worksheet?.analyst) }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <button
                type="button"
                class="bg-sky-800 text-white py-1 px-2 rounded-sm leading-none"
              >
                {{ worksheet?.state || "unknown" }}
              </button>
            </td>
            <td
              class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"
            >
              <router-link
                :to="{
                  name: 'worksheet-detail',
                  params: { workSheetUid: worksheet?.uid },
                }"
                class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
                >View</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="fetchingWorkSheets" class="py-4 text-center">
        <LoadingMessage message="Fetching worksheets ..." />
      </div>
    </div>
  </div>

  <section class="flex justify-between">
    <div></div>
    <div class="my-4 flex sm:flex-row flex-col">
      <button
        @click.prevent="showMoreWorkSheets()"
        v-show="pageInfo?.hasNextPage"
        class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Show More
      </button>
      <div class="flex flex-row mb-1 sm:mb-0">
        <div class="relative">
          <select
            class="appearance-none h-full rounded-l-sm border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            v-model="workSheetBatch"
            :disabled="!pageInfo?.hasNextPage"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="block relative">
        <input
          :placeholder="workSheetCount"
          class="appearance-none rounded-r-sm rounded-l-sm sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
          disabled
        />
      </div>
    </div>
  </section>

  <!-- Location Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Analyst</span>
            <select class="form-select block w-full mt-1" v-model="form.analystUid">
              <option></option>
              <option v-for="analyst in analysts" :key="analyst.uid" :value="analyst.uid">
                {{ analystName(analyst) }}
              </option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Worksheet Template</span>
            <select class="form-select block w-full mt-1" v-model="form.templateUid">
              <option></option>
              <option
                v-for="template in workSheetTemplates"
                :key="template.uid"
                :value="template.uid"
              >
                {{ template.name }}
              </option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">How Many</span>
            <input
              type="number"
              class="form-input mt-1 block w-full"
              v-model="form.count"
              min="1"
              default-value="1"
            />
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
