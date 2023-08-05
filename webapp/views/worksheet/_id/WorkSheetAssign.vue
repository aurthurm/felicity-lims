<script setup lang="ts">
import Swal from "sweetalert2";
import { ref, computed, reactive, defineAsyncComponent } from "vue";
import { useWorksheetStore, useAnalysisStore, useSampleStore } from "../../../stores";
import { useApiUtil } from "../../../composables";
import {
  EDIT_WORKSHEET_APPLY_TEMPLATE,
  WORKSHEET_MANUAL_ASSIGN,
} from "../../../graphql/operations/worksheet.mutations";

import * as shield from "../../../guards";
import { IAnalysisResult } from "../../../models/analysis";

const LoadingMessage = defineAsyncComponent(
  () => import("../../../components/Spinners/LoadingMessage.vue")
)
const FButton = defineAsyncComponent(
  () => import("../../../components/Buttons/Button.vue")
)

const worksheetStore = useWorksheetStore();
const analysisStore = useAnalysisStore();
const sampleStore = useSampleStore();
const { withClientMutation } = useApiUtil();

const templateUid = ref<number>();

worksheetStore.fetchWorkSheetTemplates();
const worksheet = computed(() => worksheetStore.getWorkSheet);
const workSheetTemplates = computed(() => worksheetStore.getWorkSheetTemplates);

const applyTemplate = async () => {
  try {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to apply this template to add samples?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, apply now!",
      cancelButtonText: "No, cancel apply!",
    }).then((result) => {
      if (result.isConfirmed) {
        withClientMutation(
          EDIT_WORKSHEET_APPLY_TEMPLATE,
          { worksheetUid: worksheet?.value?.uid, templateUid: templateUid.value },
          "updateWorksheetApplyTemplate"
        ).then((result) => {});
      }
    });
  } catch (error) {}
};

analysisStore.fetchAnalysesServices({
  first: undefined,
  after: "",
  text: "",
  sortBy: ["name"],
});
sampleStore.fetchSampleTypes();
analysisStore.fetchQCTemplates();
const qcTemplates = computed(() => analysisStore.getQCTemplates);
const qcTemplateUid = ref<number | undefined>(undefined);

const filterForm = reactive({
  sampleTypeUid: undefined,
  analysisUid: undefined,
});

const allChecked = ref(false);
const analysisResults = computed(() => {
  const results = checkedAnalyses;
  const incoming = worksheetStore.getAnalysisResults;
  incoming?.forEach((result) => {
    if (!results?.some((item) => item.uid === result.uid)) {
      results.push(result);
    }
  });
  return results;
});

const filterAnalysis = () => {
  getResultsChecked();
  worksheetStore.fetchForWorkSheetsAssign({
    first: 50,
    after: "",
    text: "",
    sortBy: undefined,
    ...filterForm,
  });
};

const assignToWorkSheet = () => {
  const selected = getResultsUids();

  try {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to assign selected to worksheet?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, assign now!",
      cancelButtonText: "No, cancel apply!",
    }).then((result) => {
      if (result.isConfirmed) {
        withClientMutation(
          WORKSHEET_MANUAL_ASSIGN,
          {
            uid: worksheet?.value?.uid,
            qcTemplateUid: qcTemplateUid.value,
            analysesUids: selected,
          },
          "updateWorksheetApplyTemplate"
        ).then((result) => {
        });
      }
    });
  } catch (error) {}
};

// Analysis CheckMark Management
let checkedAnalyses: IAnalysisResult[] = [];

function getResultsChecked(): any {
  let results: IAnalysisResult[] = [];
  analysisResults?.value?.forEach((result) => {
    if (result.checked) results.push(result);
  });
  checkedAnalyses = results;
  return results;
}

function getResultsUids(): string[] {
  const results = getResultsChecked();
  let ready: string[] = [];
  results?.forEach((result: IAnalysisResult) => ready.push(result.uid!));
  return ready;
}

function checkCheck(result: IAnalysisResult): void {
  if (areAllChecked()) {
    allChecked.value = true;
  } else {
    allChecked.value = false;
  }
}

function check(result: IAnalysisResult): void {
  result.checked = true;
}

function unCheck(result: IAnalysisResult): void {
  result.checked = false;
}

async function toggleCheckAll() {
  await analysisResults?.value?.forEach((result) =>
    allChecked.value ? check(result) : unCheck(result)
  );
}

function areAllChecked(): Boolean {
  return analysisResults?.value?.every((item: IAnalysisResult) => item.checked === true);
}
</script>

<template>
  <section>
    <hr />
    <form action="post" class="mt-4" v-motion-slide-right>
      <div class="flex justify-start items-center mr-4">
        <span class="text-gray-700">Worksheet Template</span>
        <label class="block mx-4">
          <select class="form-select block w-full py-1" v-model="templateUid">
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
        <button
          v-show="shield.hasRights(shield.actions.CREATE, shield.objects.WORKSHEET)"
          type="button"
          @click.prevent="applyTemplate()"
          class="border border-sky-800 bg-sky-800 text-white rounded-sm px-2 py-1 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Apply Template
        </button>
      </div>
    </form>
  </section>

  <hr class="mt-4 mb-2" />
  <h3 class="font-bold">Manual Analyses Assignment</h3>
  <hr class="mb-4 mt-2" />

  <div class="overflow-x-auto mt-4">
    <form action="post" class="p-1" v-motion-slide-left>
      <div class="flex justify-start mb-4">
        <label class="flex justify-between items-center">
          <span class="text-gray-700 mr-2">SampleType</span>
          <select
            name="analyses_uids"
            v-model="filterForm.sampleTypeUid"
            class="form-input mt-1 block w-full py-1"
          >
            <option
              v-for="sampleType in sampleStore.sampleTypes"
              :key="sampleType.uid"
              :value="sampleType.uid"
            >
              {{ sampleType.name }}
            </option>
          </select>
        </label>
        <label class="flex justify-between items-center ml-6">
          <span class="text-gray-700 mr-2">Analyses</span>
          <select
            name="analyses_uids"
            v-model="filterForm.analysisUid"
            class="form-input mt-1 block w-full py-1"
          >
            <option
              v-for="service in analysisStore.analysesServices"
              :key="service.uid"
              :value="service.uid"
            >
              {{ service.name }}
            </option>
          </select>
        </label>
        <div class="ml-6 mt-2">
          <FButton
            v-show="true"
            @click.prevent="filterAnalysis()"
            :color="'sky-800'"
            class="p-1"
            >Apply Filters</FButton
          >
        </div>
      </div>
    </form>
  </div>

  <div class="overflow-x-auto mt-4">
    <div
      class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"
    >
      <div v-if="worksheetStore.fetchingAnalysisResults" class="py-4 text-center">
        <LoadingMessage message="Fetching analytes ..." />
      </div>
      <table class="min-w-full" v-else>
        <thead>
          <tr>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
            >
              <input type="checkbox" @change="toggleCheckAll" v-model="allChecked" />
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
            ></th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
            >
              Sample ID
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Analysis
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Date Created
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Date Received
            </th>
            <th
              class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody class="bg-white" v-motion-slide-right>
          <tr v-for="analysisResult in analysisResults" :key="analysisResult?.uid">
            <td>
              <input
                type="checkbox"
                v-model="analysisResult.checked"
                @change="checkCheck(analysisResult)"
              />
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500"></td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800 font-semibold">
                {{ analysisResult?.sample?.sampleId }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ analysisResult?.analysis?.name }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ analysisResult?.sample?.createdAt }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ analysisResult?.sample?.dateReceived }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ analysisResult?.sample?.status }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <section class="my-4">
    <form action="post" class="mb-4">
      <div class="flex justify-start items-center mr-4">
        <span class="text-gray-700">Apply QC Template</span>
        <label class="block mx-4">
          <select class="form-select block w-full py-1" v-model="qcTemplateUid">
            <option></option>
            <option
              v-for="template in qcTemplates"
              :key="template.uid"
              :value="template.uid"
            >
              {{ template.name }}
            </option>
          </select>
        </label>
      </div>
    </form>

    <FButton v-show="true" @click.prevent="assignToWorkSheet" :color="'orange-600'"
      >Assign Analyses</FButton
    >
  </section>
</template>
