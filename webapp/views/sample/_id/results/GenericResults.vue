<script setup lang="ts">
import Drawer from "@/components/ui/Drawer.vue";
import { Button } from "@/components/ui/button";
import { reactive, computed, defineAsyncComponent, ref } from "vue";
import type { PropType } from 'vue'
import { useSampleStore } from "@/stores/sample";
import useAnalysisComposable from "@/composables/analysis";
import {
  ProfileType,
  AnalysisType,
  SampleType,
  ArResultInputType,
} from "@/types/gql";
import { isNullOrWs, parseDate } from "@/utils";
import { Spinner } from "@/components/ui/spinner";

import * as shield from "@/guards";
import { NotificationObjectType } from "@/graphql/schema";
import { ExtAnalysisResultType } from "@/types/result";

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
  sample: Object as PropType<SampleType>,
  analysisResults: Object as PropType<ExtAnalysisResultType[]>,
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
  let results: ExtAnalysisResultType[] = [];
  analysisResults?.forEach((result) => {
    if (result.checked) results.push(result);
  });
  return results;
}

function prepareResults(): ArResultInputType[] {
  let results = getResultsChecked();
  let ready: any[] = [];
  results?.forEach((result: ExtAnalysisResultType) =>
    ready.push({
      uid: result.uid,
      result: result.result ?? '',
      methodUid: result.methodUid ?? (result as any).method?.uid ?? '',
      laboratoryInstrumentUid: result.laboratoryInstrumentUid ?? (result as any).laboratoryInstrument?.uid ?? '',
    })
  );
  return ready;
}

function getResultsUids(): string[] {
  const results = getResultsChecked();
  let ready: string[] = [];
  results?.forEach((result: ExtAnalysisResultType) => ready.push(result.uid!));
  return ready;
}

// Analysis CheckMark Management
function checkCheck(result: ExtAnalysisResultType): void {
  if (areAllChecked()) {
    state.allChecked = true;
  } else {
    state.allChecked = false;
  }
  resetAnalysesPermissions();
}

function check(result: ExtAnalysisResultType): void {
  if(isDisabledRowCheckBox(result)) return;
  // if(!result.editable) return;
  result.checked = true;
  resetAnalysesPermissions();
}

function unCheck(result: ExtAnalysisResultType): void {
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

function areAllChecked(): boolean {
  return analysisResults?.every((item: ExtAnalysisResultType) => item.checked === true) || false;
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

function isEditable(result: ExtAnalysisResultType): boolean {
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
    case "approved":
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
  if (checked.every((result: ExtAnalysisResultType) => result.status === "cancelled")) {
    state.can_reinstate = true;
  }

  // can cancel
  if (checked.every((result: ExtAnalysisResultType) => result.status === "pending")) {
    state.can_cancel = true;
  }

  // can submit (use flat IDs or fallback from nested method/laboratoryInstrument)
  const hasMethod = (r: ExtAnalysisResultType) => !isNullOrWs(r.methodUid) || !isNullOrWs((r as any).method?.uid);
  const hasInstrument = (r: ExtAnalysisResultType) => !isNullOrWs(r.laboratoryInstrumentUid) || !isNullOrWs((r as any).laboratoryInstrument?.uid);
  if (
    checked.every(
      (result: ExtAnalysisResultType) =>
        ["pending"].includes(result.status ?? "") &&
        !isNullOrWs(result.result) &&
        hasMethod(result) &&
        hasInstrument(result)
    )
  ) {
    state.can_submit = true;
  }

  // can verify/retract/retest
  if (checked.every((result: ExtAnalysisResultType) => result.status === "resulted")) {
    state.can_retract = true;
    state.can_approve = true;
    state.can_retest = true;
  }
}

// _updateSample if state has changed
const _updateSample = async () => {
  const sample = computed(() => sampleStore.getSample);
  if (sample.value) {
    sampleStore.fetchSampleStatus(sample.value.uid!);
  }
};

const profileAnalysesText = (
  profiles: ProfileType[],
  analyses: AnalysisType[]
) => {
  let names: string[] = [];
  profiles?.forEach((p) => names.push(p.name!));
  analyses?.forEach((a) => names.push(a.name!));
  return names.join(", ");
};

// viewAnalysisInfo
const viewInfo = ref(false)
const viewResultInfo = ref<ExtAnalysisResultType | undefined>(undefined)
const viewAnalysisInfo = (result: ExtAnalysisResultType,) => {
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
  submitter_(prepareResults(), NotificationObjectType.Sample, sample?.uid!)
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
        <span class="inline-flex items-center gap-2">
          <Spinner class="size-4" />
          <span class="text-sm">Fetching analytes ...</span>
        </span>
      </div>
      <div v-else class="overflow-x-auto">
        <Table class="w-full">
          <TableHeader>
            <TableRow class="border-b border-border bg-muted/50">
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                <Checkbox
                  :checked="state.allChecked"
                  @update:checked="(value) => { state.allChecked = value; toggleCheckAll(); }"
                />
              </TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground"></TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Analysis</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Instrument</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Method</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Analyst</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reviewer(s)</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Interim</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Result</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Retest</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Due Date</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Submitted</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Approved</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reportable</TableHead>
              <TableHead class="px-4 py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              v-for="result in analysisResults" 
              :key="result.uid" 
              :class="[getResultRowColor(result),'hover:bg-muted/50 transition-colors duration-200']"
              v-motion-slide-right
            >
              <TableCell class="px-4 py-3 border-b border-border">
                <div class="flex items-center space-x-2">
                  <Checkbox
                    :checked="result.checked"
                    :disabled="isDisabledRowCheckBox(result)"
                    @update:checked="(value) => { result.checked = value; checkCheck(result); }"
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
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border"></TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
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
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
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
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
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
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
                <span class="text-sm text-foreground">
                  {{ `${result.submittedBy?.firstName ?? '--'} ${result.submittedBy?.lastName ?? '--'}` }}
                </span>
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
                <div class="text-sm text-foreground space-x-1">
                  <span v-for="reviewer in result.verifiedBy" :key="reviewer.uid">
                    {{ `${reviewer?.firstName ?? '--'} ${reviewer?.lastName ?? '--'},` }}
                  </span>
                </div>
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
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
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
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
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
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
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
                <span class="text-sm text-foreground">{{ parseDate(result?.dueDate) }}</span>
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
                <span class="text-sm text-foreground">{{ parseDate(result?.dateSubmitted) }}</span>
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
                <span class="text-sm text-foreground">{{ parseDate(result?.dateVerified) }}</span>
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{'bg-primary/10 text-primary': result.status === 'pending',
                    'bg-warning/10 text-warning': result.status === 'resulted',
                    'bg-success/10 text-success': result.status === 'approved',
                    'bg-destructive/10 text-destructive': result.status === 'cancelled' || result.status === 'retracted'
                  }"
                >
                  {{ result.status }}
                </span>
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border">
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
              </TableCell>
              <TableCell class="px-4 py-3 border-b border-border"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <div class="flex items-center space-x-4 pt-4">
      <Button
        type="button"
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_cancel"
        key="cancel"
        @click="cancelResults"
        :color="'destructive'"
      >
        Cancel
      </Button>
      <Button
        type="button"
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_reinstate"
        key="reinstate"
        @click="reInstateResults"
        :color="'warning'"
      >
        Re-Instate
      </Button>
      <Button
        type="button"
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_submit"
        key="submit"
        @click="submitResults"
        :color="'primary'"
      >
        Submit
      </Button>
      <Button
        type="button"
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_retract"
        key="retract"
        @click="retractResults"
        :color="'warning'"
      >
        Retract
      </Button>
      <Button
        type="button"
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_approve"
        key="verify"
        @click="approveResults"
        :color="'success'"
      >
        Verify
      </Button>
      <Button
        type="button"
        v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.RESULT) && state.can_retest"
        key="retest"
        @click="retestResults"
        :color="'warning'"
      >
        Retest
      </Button>
    </div>
  </div>

  <Drawer :show="viewInfo" @close="viewInfo = false" :content-width="'w-2/4'">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">Result Information</h3>
    </template>
    <template v-slot:body>
      <div class="space-y-6">
        <AnalysisSneak v-if="viewResultInfo?.analysisUid" :analysisUid="viewResultInfo?.analysisUid" />
        <ResultDetail v-if="viewResultInfo?.uid" :analysisResultesultUid="viewResultInfo?.uid" />
      </div>
    </template>
  </Drawer>
</template>
