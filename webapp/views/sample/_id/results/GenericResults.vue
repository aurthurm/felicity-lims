<script setup lang="ts">
import { reactive, computed, defineAsyncComponent, ref } from "vue";
import type { PropType } from 'vue'
import { useSampleStore } from "@/stores/sample";
import useAnalysisComposable from "@/composables/analysis";
import {
  IAnalysisProfile,
  IAnalysisResult,
  IAnalysisService,
  ISample,
} from "@/models/analysis";
import { isNullOrWs, parseDate } from "@/utils/helpers";

import * as shield from "@/guards";
const FelButton = defineAsyncComponent(
  () => import("@/components/ui/buttons/FelButton.vue")
)
const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)
const FelDrawer = defineAsyncComponent(
  () => import("@/components/ui/FelDrawer.vue")
)
const AnalysisSneak = defineAsyncComponent(
  () => import("@/components/analysis/AnalysisSneak.vue")
)
const ResultDetail = defineAsyncComponent(
  () => import("@/components/result/ResultDetail.vue")
)

const {
  sample,
  analysisResults,
  fetchingResults,
} = defineProps({
  sample: Object as PropType<ISample>,
  analysisResults: Object as PropType<IAnalysisResult[]>,
  fetchingResults: Boolean,
});

const sampleStore = useSampleStore();

const state = reactive({
  can_submit: false,
  can_cancel: false,
  can_retract: false,
  can_approve: false,
  can_retest: false,
  can_reinstate: false,
  allChecked: false,
});

function getResultsChecked(): any {
  let results: IAnalysisResult[] = [];
  analysisResults?.forEach((result) => {
    if (result.checked) results.push(result);
  });
  return results;
}

function prepareResults(): IAnalysisResult[] {
  let results = getResultsChecked();
  let ready: any[] = [];
  results?.forEach((result: IAnalysisResult) =>
    ready.push({ uid: result.uid, result: result.result, methodUid: result.methodUid, laboratoryInstrumentUid: result.laboratoryInstrumentUid })
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
  if(isDisabledRowCheckBox(result)) return;
  // if(!result.editable) return;
  result.checked = true;
  resetAnalysesPermissions();
}

function unCheck(result: IAnalysisResult): void {
  result.checked = false;
  resetAnalysesPermissions();
}

async function toggleCheckAll() {
  await analysisResults?.forEach((result) =>
    state.allChecked ? check(result) : unCheck(result)
  );
  resetAnalysesPermissions();
}

async function unCheckAll() {
  await analysisResults?.forEach((result) => unCheck(result));
  resetAnalysesPermissions();
}

function areAllChecked(): Boolean {
  return analysisResults?.every((item: IAnalysisResult) => item.checked === true) || false;
}

function isDisabledRowCheckBox(result: any): boolean {
  switch (result?.status) {
    case "retracted":
      return true;
    case "approved":
      return true;
    case "cancelled":
      if (sample?.status !== "received") return true;
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
  if (!["received", "paired"].includes(sample?.status ?? "")) {
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
      return "bg-muted";
    case "aproved":
      if (result?.reportable === false) {
        return "bg-destructive";
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
      (result: IAnalysisResult) => ["pending"].includes(result.status ?? "") && !isNullOrWs(result.result)
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
    sampleStore.fetchSampleStatus(sample?.uid);
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

// viewAnalysisInfo
const viewInfo = ref(false)
const viewResultInfo = ref<IAnalysisResult | undefined>(undefined)
const viewAnalysisInfo = (result: IAnalysisResult,) => {
  viewInfo.value = true
  viewResultInfo.value = result;
}

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
  submitter_(prepareResults(), "sample", sample?.uid!)
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
  approver_(getResultsUids(), "sample", sample?.uid!)
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
    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <div v-if="fetchingResults" class="py-4 text-center">
        <LoadingMessage message="Fetching analytes ..." />
      </div>
      <table class="min-w-full" v-else>
        <thead>
          <tr>
            <th class="px-1 py-1 border-b-2 border-border text-left leading-4 text-foreground tracking-wider">
              <input type="checkbox" class="" @change="toggleCheckAll" v-model="state.allChecked" />
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left leading-4 text-foreground tracking-wider"></th>
            <th class="px-1 py-1 border-b-2 border-border text-left leading-4 text-foreground tracking-wider">
              Analysis
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Instrument
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Method
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Analyst
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Reviewer(s)
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Interim
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Result
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Retest
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Due Date
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Submitted
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Approved
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Status
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Reportable
            </th>
            <th class="px-1 py-1 border-b-2 border-border"></th>
          </tr>
        </thead>
        <tbody class="bg-background">
          <tr v-for="result in analysisResults" :key="result.uid" :class="[getResultRowColor(result)]"
            v-motion-slide-right>
            <td>
              <input type="checkbox" class="border-destructive" v-model="result.checked" @change="checkCheck(result)"
                :disabled="isDisabledRowCheckBox(result)" /><font-awesome-icon v-if="result.status === 'pending'"
                icon="fa-question" class="ml-1 text-xs"></font-awesome-icon>
              <font-awesome-icon v-if="result.status === 'resulted'" icon="fa-question"
                class="ml-1 text-xs text-orange"></font-awesome-icon>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border"></td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary font-semibold">
                <span class="mr-1 hover:cursor-pointer" @click="viewAnalysisInfo(result)"><font-awesome-icon icon="fa-info-circle"></font-awesome-icon></span>
                {{ result.analysis?.name }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div v-if="!isEditable(result)" class="text-sm leading-5 text-primary">
                {{ result.laboratoryInstrument?.labName || "---" }}
              </div>
              <label v-else class="block col-span-2 mb-2">
                <select class="form-input mt-1 block w-full" v-model="result.laboratoryInstrumentUid" @change="check(result)">
                  <option value=""></option>
                  <template v-for="instrument in result.analysis?.instruments" :key="instrument.uid">
                    <option 
                      v-for="lab_instrument in instrument.laboratoryInstruments" 
                      :key="lab_instrument.uid"
                      :value="lab_instrument.uid"
                    >
                      {{ lab_instrument.labName }} → ({{ instrument?.name }})
                    </option>
                  </template>
                </select>
              </label>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div v-if="!isEditable(result)" class="text-sm leading-5 text-primary">
                {{ result.method?.name || "---" }}
              </div>
              <label v-else class="block col-span-2 mb-2">
                <select class="form-input mt-1 block w-full" v-model="result.methodUid" @change="check(result)">
                  <option value=""></option>
                  <option v-for="method in result.analysis?.methods" :key="method.uid"
                    :value="method.uid">
                    {{ method.name }}
                  </option>
                </select>
              </label>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">
                {{ `${result.submittedBy?.firstName ?? '--'} ${result.submittedBy?.lastName ?? '--'}` }}
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">
                <span v-for="reviewer in result.verifiedBy" :key="reviewer.firstName" class="ml-1">
                  {{ `${reviewer?.firstName ?? '--'} ${reviewer?.lastName ?? '--'},` }}
                </span>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div v-if="!isEditable(result) || result?.analysis?.interims?.length === 0"
                class="text-sm leading-5 text-primary">
                ---
              </div>
              <label v-else class="block col-span-2 mb-2">
                <select class="form-input mt-1 block w-full" v-model="result.result" @change="check(result)">
                  <option value=""></option>
                  <option v-for="interim in result?.analysis?.interims" :key="interim.key"
                    :value="interim.value">
                    {{ interim.value }}
                  </option>
                </select>
              </label>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div v-if="!isEditable(result)" class="text-sm leading-5 text-primary">
                {{ result?.result }}
              </div>
              <label v-else-if="result?.analysis?.resultOptions?.length === 0" class="block">
                <input class="form-input mt-1 block w-full" 
                v-model="result.result" 
                @keyup="check(result)" />
              </label>
              <label v-else class="block col-span-2 mb-2">
                <select class="form-input mt-1 block w-full" v-model="result.result" @change="check(result)">
                  <option value=""></option>
                  <option v-for="option in result?.analysis?.resultOptions" :key="option.optionKey"
                    :value="option.value">
                    {{ option.value }}
                  </option>
                </select>
              </label>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">
                <span v-if="result?.retest" class="text-primary">
                  <font-awesome-icon icon="fa-check-circle"></font-awesome-icon>
                </span>
                <span v-else class="text-destructive">
                  <font-awesome-icon icon="fa-times-circle"></font-awesome-icon>
                </span>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ parseDate(result?.dueDate) }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ parseDate(result?.dateSubmitted) }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ parseDate(result?.dateVerified) }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <button type="button" class="bg-primary text-primary-foreground px-2 py-1 rounded-sm leading-none">
                {{ result.status }}
              </button>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">
                <span v-if="result?.reportable" class="text-success">
                  <font-awesome-icon icon="fa-thumbs-up" aria-hidden="true"></font-awesome-icon>
                </span>
                <span v-else class="text-destructive">
                  <font-awesome-icon icon="fa-thumbs-down" aria-hidden="true"></font-awesome-icon>
                </span>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <section class="my-4">
    <FelButton v-show="
      shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_cancel
    " key="cancel" @click.prevent="cancelResults" :color="'sky-800'">Cancel</FelButton>
    <FelButton v-show="
      shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) &&
      state.can_reinstate
    " key="reinstate" @click.prevent="reInstateResults" :color="'orange-600'">Re-Instate</FelButton>
    <FelButton v-show="
      shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_submit
    " key="submit" @click.prevent="submitResults" :color="'orange-600'">Submit</FelButton>
    <FelButton v-show="
      shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) &&
      state.can_retract
    " key="retract" @click.prevent="retractResults" :color="'orange-600'">Retract</FelButton>
    <FelButton v-show="
      shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) &&
      state.can_approve
    " key="verify" @click.prevent="approveResults" :color="'orange-600'">Verify</FelButton>
    <FelButton v-show="
      shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_retest
    " key="retest" @click.prevent="retestResults" :color="'orange-600'">Retest</FelButton>
  </section>

  <FelDrawer :show="viewInfo" @close="viewInfo = false" :content-width="'w-2/4'">
    <template v-slot:header>
      <h3>Result Information</h3>
    </template>
    <template v-slot:body>
      <AnalysisSneak v-if="viewResultInfo?.analysisUid" :analysisUid="viewResultInfo?.analysisUid" />
      <ResultDetail v-if="viewResultInfo?.uid" :analysisResultesultUid="viewResultInfo?.uid" />
    </template>
  </FelDrawer>
</template>
