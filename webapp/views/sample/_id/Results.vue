<script setup lang="ts">
import FButton from "../../../components/Buttons/Button.vue";
import LoadingMessage from "../../../components/Spinners/LoadingMessage.vue";
import { onMounted, watch, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useSampleStore } from "../../../stores";

import { useAnalysisComposable } from "../../../composables";
import {
  IAnalysisProfile,
  IAnalysisResult,
  IAnalysisService,
} from "../../../models/analysis";
import { isNullOrWs } from "../../../utils/helpers";

import * as shield from "../../../guards";

const route = useRoute();
const sampleStore = useSampleStore();
const { sample, analysisResults, fetchingResults } = storeToRefs(sampleStore);

const state = reactive({
  can_submit: false,
  can_cancel: false,
  can_retract: false,
  can_approve: false,
  can_retest: false,
  can_reinstate: false,
  allChecked: false,
});

onMounted(() => sampleStore.fetchAnalysisResultsForSample(route.params.sampleUid));

watch(
  () => route.params.sampleUid,
  (sampleUid, prev) => {
    sampleStore.resetSample();
    sampleStore.fetchAnalysisResultsForSample(route.params.sampleUid);
  }
);

function getResultsChecked(): any {
  let results: IAnalysisResult[] = [];
  analysisResults?.value?.forEach((result) => {
    if (result.checked) results.push(result);
  });
  return results;
}

function prepareResults(): IAnalysisResult[] {
  let results = getResultsChecked();
  let ready: any[] = [];
  results?.forEach((result: IAnalysisResult) =>
    ready.push({ uid: result.uid, result: result.result })
  );
  return ready;
}

function getResultsUids(): string[] {
  const results = getResultsChecked();
  let ready: string[] = [];
  results?.forEach((result: IAnalysisResult) => ready.push(result.uid!));
  return ready;
}

// Analysis CheckMark Management
function checkCheck(result: IAnalysisResult): void {
  if (areAllChecked()) {
    state.allChecked = true;
  } else {
    state.allChecked = false;
  }
  resetAnalysesPermissions();
}

function check(result: IAnalysisResult): void {
  result.checked = true;
  resetAnalysesPermissions();
}

function unCheck(result: IAnalysisResult): void {
  result.checked = false;
  resetAnalysesPermissions();
}

async function toggleCheckAll() {
  await analysisResults?.value?.forEach((result) =>
    state.allChecked ? check(result) : unCheck(result)
  );
  resetAnalysesPermissions();
}

async function unCheckAll() {
  await analysisResults?.value?.forEach((result) => unCheck(result));
  resetAnalysesPermissions();
}

function areAllChecked(): Boolean {
  return analysisResults?.value?.every((item: IAnalysisResult) => item.checked === true);
}

function isDisabledRowCheckBox(result: any): boolean {
  switch (result?.status) {
    case "retracted":
      return true;
    case "approved":
      return true;
    case "cancelled":
      if (sample?.value?.status !== "received") return true;
      return false;
    default:
      return false;
  }
}

// Analysis Edit Management
function editResult(result: any): void {
  result.editable = true;
}

function isEditable(result: IAnalysisResult): Boolean {
  if (sample?.value?.status !== "received") {
    return false;
  }
  if (result.status !== "pending") {
    return false;
  }
  if (result?.editable || isNullOrWs(result?.result)) {
    editResult(result);
    return true;
  }
  return false;
}

//
function getResultRowColor(result: any): string {
  switch (result?.status) {
    case "retracted":
      return "bg-gray-300";
    case "aproved":
      if (result?.reportable === false) {
        return "bg-orange-600";
      } else {
        return "";
      }
    default:
      return "";
  }
}

//
function resetAnalysesPermissions(): void {
  // reset
  state.can_cancel = false;
  state.can_submit = false;
  state.can_retract = false;
  state.can_approve = false;
  state.can_retest = false;
  state.can_reinstate = false;

  const checked = getResultsChecked();
  if (checked.length === 0) return;

  // can reinstate
  if (checked.every((result: IAnalysisResult) => result.status === "cancelled")) {
    state.can_reinstate = true;
  }

  // can cancel
  if (checked.every((result: IAnalysisResult) => result.status === "pending")) {
    state.can_cancel = true;
  }

  // can submit
  if (
    checked.every(
      (result: IAnalysisResult) =>
        result.status === "pending" && !isNullOrWs(result.result)
    )
  ) {
    state.can_submit = true;
  }

  // can verify/retract/retest
  if (checked.every((result: IAnalysisResult) => result.status === "resulted")) {
    state.can_retract = true;
    state.can_approve = true;
    state.can_retest = true;
  }
}

// _updateSample if state has changed
const _updateSample = async () => {
  const sample = computed(() => sampleStore.getSample);
  if (sample.value) {
    sampleStore.fetchSampleStatus(sample?.value?.uid);
  }
};

const profileAnalysesText = (
  profiles: IAnalysisProfile[],
  analyses: IAnalysisService[]
) => {
  let names: string[] = [];
  profiles?.forEach((p) => names.push(p.name!));
  analyses?.forEach((a) => names.push(a.name!));
  return names.join(", ");
};

// Sample Actions
let {
  submitResults: submitter_,
  cancelResults: canceller_,
  reInstateResults: reInstater_,
  approveResults: approver_,
  retractResults: retracter_,
  retestResults: retester_,
} = useAnalysisComposable();

const submitResults = () =>
  submitter_(prepareResults(), "sample", sample?.value?.uid!)
    .then(() => _updateSample())
    .finally(() => unCheckAll());

const cancelResults = () =>
  canceller_(getResultsUids())
    .then(() => _updateSample())
    .finally(() => unCheckAll());

const reInstateResults = () =>
  reInstater_(getResultsUids())
    .then(() => _updateSample())
    .finally(() => unCheckAll());

const approveResults = () =>
  approver_(getResultsUids(), "sample", sample?.value?.uid!)
    .then(() => _updateSample())
    .finally(() => unCheckAll());

const retractResults = () =>
  retracter_(getResultsUids())
    .then(() => _updateSample())
    .finally(() => unCheckAll());

const retestResults = () =>
  retester_(getResultsUids())
    .then(() => _updateSample())
    .finally(() => unCheckAll());
</script>

<template>
  <hr class="mt-4 mb-2" />
  <h3 class="font-bold">Analyses/Results</h3>
  <hr class="mb-4 mt-2" />

  <div class="overflow-x-auto">
    <div
      class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <div v-if="fetchingResults" class="py-4 text-center">
        <LoadingMessage message="Fetching analytes ..." />
      </div>
      <table class="min-w-full" v-else>
        <thead>
          <tr>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">
              <input type="checkbox" class="" @change="toggleCheckAll" v-model="state.allChecked" />
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"></th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">
              Analysis
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Methods
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Instrument
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Analyst
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Interim
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Result
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Retest
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Submitted
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Due Date
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Status
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">
              Reportable
            </th>
            <th class="px-1 py-1 border-b-2 border-gray-300"></th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="result in analysisResults" :key="result.uid" :class="[getResultRowColor(result)]"
            v-motion-slide-right>
            <td>
              <input type="checkbox" class="border-red-500" v-model="result.checked" @change="checkCheck(result)"
                :disabled="isDisabledRowCheckBox(result)" /><font-awesome-icon v-if="result.status === 'pending'"
                icon="fa-question" class="ml-1 text-xs"></font-awesome-icon>
              <font-awesome-icon v-if="result.status === 'resulted'" icon="fa-question"
                class="ml-1 text-xs text-orange"></font-awesome-icon>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500"></td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800 font-semibold">
                {{ result.analysis?.name }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ result.method?.name || "None" }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ result.instrument?.name || "None" }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                {{ result.analyst?.name || "moyoza" }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div v-if="!isEditable(result) || result?.analysis?.interims?.length === 0"
                class="text-sm leading-5 text-sky-800">
                ---
              </div>
              <label v-else class="block col-span-2 mb-2">
                <select class="form-input mt-1 block w-full" v-model="result.result" @change="check(result)">
                  <option value=""></option>
                  <option v-for="(interim, index) in result?.analysis?.interims" :key="interim.key"
                    :value="interim.value">
                    {{ interim.value }}
                  </option>
                </select>
              </label>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div v-if="!isEditable(result)" class="text-sm leading-5 text-sky-800">
                {{ result?.result }}
              </div>
              <label v-else-if="result?.analysis?.resultOptions?.length === 0" class="block">
                <input class="form-input mt-1 block w-full" v-model="result.result" @keyup="check(result)" />
              </label>
              <label v-else class="block col-span-2 mb-2">
                <select class="form-input mt-1 block w-full" v-model="result.result" @change="check(result)">
                  <option value=""></option>
                  <option v-for="(option, index) in result?.analysis?.resultOptions" :key="option.optionKey"
                    :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
              </label>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                <span v-if="result?.retest" class="text-sky-800">
                  <i class="fa fa-check-circle" aria-hidden="true"></i>
                </span>
                <span v-else class="text-orange-600">
                  <i class="fa fa-times-circle" aria-hidden="true"></i>
                </span>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">2020-10-10</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">2020-10-10</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <button type="button" class="bg-sky-800 text-white px-2 py-1 rounded-sm leading-none">
                {{ result.status }}
              </button>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="text-sm leading-5 text-sky-800">
                <span v-if="result?.reportable" class="text-emerald-600">
                  <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                </span>
                <span v-else class="text-orange-600">
                  <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                </span>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
              <!-- <button @click.prevent="submitResult(result)" 
                              class="p-1 ml-2 border-white border text-gray-500rounded-smtransition duration-300 hover:border-sky-800 hover:text-sky-800 focus:outline-none">
                              submit
                            </button> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <section class="my-4">
    <FButton v-show="
      shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_cancel
    " key="cancel" @click.prevent="cancelResults" :color="'sky-800'">Cancel</FButton>
    <FButton v-show="
      shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) &&
      state.can_reinstate
    " key="reinstate" @click.prevent="reInstateResults" :color="'orange-600'">Re-Instate</FButton>
    <FButton v-show="
      shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_submit
    " key="submit" @click.prevent="submitResults" :color="'orange-600'">Submit</FButton>
    <FButton v-show="
      shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) &&
      state.can_retract
    " key="retract" @click.prevent="retractResults" :color="'orange-600'">Retract</FButton>
    <FButton v-show="
      shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) &&
      state.can_approve
    " key="verify" @click.prevent="approveResults" :color="'orange-600'">Verify</FButton>
    <FButton v-show="
      shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_retest
    " key="retest" @click.prevent="retestResults" :color="'orange-600'">Retest</FButton>
  </section>
</template>
