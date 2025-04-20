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
import { isNullOrWs, parseDate } from "@/utils";

import * as shield from "@/guards";

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
  <div class="space-y-6">
    <div class="border-t border-border my-4" />
    <h3 class="text-lg font-semibold text-foreground">Analyses/Results</h3>
    <div class="border-t border-border my-4" />

    <div class="rounded-lg border border-border bg-background shadow-sm">
      <div v-if="fetchingResults" class="p-6 text-center">
        <fel-loader message="Fetching analytes ..." />
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <input 
                  type="checkbox" 
                  @change="toggleCheckAll" 
                  v-model="state.allChecked"
                  class="rounded border-input text-primary focus:ring-primary" 
                />
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground"></th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Analysis</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Instrument</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Method</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Analyst</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reviewer(s)</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Interim</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Result</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Retest</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Due Date</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Submitted</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Approved</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reportable</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="result in analysisResults" 
              :key="result.uid" 
              :class="[getResultRowColor(result), 'hover:bg-muted/50 transition-colors duration-200']"
              v-motion-slide-right
            >
              <td class="px-4 py-3 border-b border-border">
                <div class="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    v-model="result.checked" 
                    @change="checkCheck(result)"
                    :disabled="isDisabledRowCheckBox(result)"
                    class="rounded border-input text-primary focus:ring-primary" 
                  />
                  <font-awesome-icon 
                    v-if="result.status === 'pending'"
                    icon="fa-question" 
                    class="text-xs text-muted-foreground"
                  />
                  <font-awesome-icon 
                    v-if="result.status === 'resulted'" 
                    icon="fa-question"
                    class="text-xs text-warning"
                  />
                </div>
              </td>
              <td class="px-4 py-3 border-b border-border"></td>
              <td class="px-4 py-3 border-b border-border">
                <div class="flex items-center space-x-2">
                  <button
                    type="button"
                    @click="viewAnalysisInfo(result)"
                    class="text-primary hover:text-primary/80 transition-colors"
                  >
                    <font-awesome-icon icon="fa-info-circle" />
                  </button>
                  <span class="font-medium">{{ result.analysis?.name }}</span>
                </div>
              </td>
              <td class="px-4 py-3 border-b border-border">
                <div v-if="!isEditable(result)" class="text-sm text-foreground">
                  {{ result.laboratoryInstrument?.labName || "---" }}
                </div>
                <select 
                  v-else
                  v-model="result.laboratoryInstrumentUid" 
                  @change="check(result)"
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
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
              </td>
              <td class="px-4 py-3 border-b border-border">
                <div v-if="!isEditable(result)" class="text-sm text-foreground">
                  {{ result.method?.name || "---" }}
                </div>
                <select 
                  v-else
                  v-model="result.methodUid" 
                  @change="check(result)"
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value=""></option>
                  <option 
                    v-for="method in result.analysis?.methods" 
                    :key="method.uid"
                    :value="method.uid"
                  >
                    {{ method.name }}
                  </option>
                </select>
              </td>
              <td class="px-4 py-3 border-b border-border">
                <span class="text-sm text-foreground">
                  {{ `${result.submittedBy?.firstName ?? '--'} ${result.submittedBy?.lastName ?? '--'}` }}
                </span>
              </td>
              <td class="px-4 py-3 border-b border-border">
                <div class="text-sm text-foreground space-x-1">
                  <span v-for="reviewer in result.verifiedBy" :key="reviewer.firstName">
                    {{ `${reviewer?.firstName ?? '--'} ${reviewer?.lastName ?? '--'},` }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 border-b border-border">
                <div v-if="!isEditable(result) || result?.analysis?.interims?.length === 0" class="text-sm text-foreground">
                  ---
                </div>
                <select 
                  v-else
                  v-model="result.result" 
                  @change="check(result)"
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value=""></option>
                  <option 
                    v-for="interim in result?.analysis?.interims" 
                    :key="interim.key"
                    :value="interim.value"
                  >
                    {{ interim.value }}
                  </option>
                </select>
              </td>
              <td class="px-4 py-3 border-b border-border">
                <div v-if="!isEditable(result)" class="text-sm text-foreground">
                  {{ result?.result }}
                </div>
                <input 
                  v-else-if="result?.analysis?.resultOptions?.length === 0"
                  v-model="result.result" 
                  @keyup="check(result)"
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <select 
                  v-else
                  v-model="result.result" 
                  @change="check(result)"
                  class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value=""></option>
                  <option 
                    v-for="option in result?.analysis?.resultOptions" 
                    :key="option.optionKey"
                    :value="option.value"
                  >
                    {{ option.value }}
                  </option>
                </select>
              </td>
              <td class="px-4 py-3 border-b border-border">
                <div class="text-sm">
                  <font-awesome-icon 
                    v-if="result?.retest" 
                    icon="fa-check-circle"
                    class="text-success"
                  />
                  <font-awesome-icon 
                    v-else 
                    icon="fa-times-circle"
                    class="text-destructive"
                  />
                </div>
              </td>
              <td class="px-4 py-3 border-b border-border">
                <span class="text-sm text-foreground">{{ parseDate(result?.dueDate) }}</span>
              </td>
              <td class="px-4 py-3 border-b border-border">
                <span class="text-sm text-foreground">{{ parseDate(result?.dateSubmitted) }}</span>
              </td>
              <td class="px-4 py-3 border-b border-border">
                <span class="text-sm text-foreground">{{ parseDate(result?.dateVerified) }}</span>
              </td>
              <td class="px-4 py-3 border-b border-border">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-primary/10 text-primary': result.status === 'pending',
                    'bg-warning/10 text-warning': result.status === 'resulted',
                    'bg-success/10 text-success': result.status === 'approved',
                    'bg-destructive/10 text-destructive': result.status === 'cancelled' || result.status === 'retracted'
                  }"
                >
                  {{ result.status }}
                </span>
              </td>
              <td class="px-4 py-3 border-b border-border">
                <div class="text-sm">
                  <font-awesome-icon 
                    v-if="result?.reportable" 
                    icon="fa-thumbs-up"
                    class="text-success"
                    aria-label="Reportable"
                  />
                  <font-awesome-icon 
                    v-else 
                    icon="fa-thumbs-down"
                    class="text-destructive"
                    aria-label="Not reportable"
                  />
                </div>
              </td>
              <td class="px-4 py-3 border-b border-border"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex items-center space-x-4 pt-4">
      <fel-button 
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_cancel"
        key="cancel" 
        @click.prevent="cancelResults" 
        :color="'destructive'"
      >
        Cancel
      </fel-button>
      <fel-button 
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_reinstate"
        key="reinstate" 
        @click.prevent="reInstateResults" 
        :color="'warning'"
      >
        Re-Instate
      </fel-button>
      <fel-button 
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_submit"
        key="submit" 
        @click.prevent="submitResults" 
        :color="'primary'"
      >
        Submit
      </fel-button>
      <fel-button 
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_retract"
        key="retract" 
        @click.prevent="retractResults" 
        :color="'warning'"
      >
        Retract
      </fel-button>
      <fel-button 
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_approve"
        key="verify" 
        @click.prevent="approveResults" 
        :color="'success'"
      >
        Verify
      </fel-button>
      <fel-button 
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_retest"
        key="retest" 
        @click.prevent="retestResults" 
        :color="'warning'"
      >
        Retest
      </fel-button>
    </div>
  </div>

  <fel-drawer :show="viewInfo" @close="viewInfo = false" :content-width="'w-2/4'">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">Result Information</h3>
    </template>
    <template v-slot:body>
      <div class="space-y-6">
        <AnalysisSneak v-if="viewResultInfo?.analysisUid" :analysisUid="viewResultInfo?.analysisUid" />
        <ResultDetail v-if="viewResultInfo?.uid" :analysisResultesultUid="viewResultInfo?.uid" />
      </div>
    </template>
  </fel-drawer>
</template>
