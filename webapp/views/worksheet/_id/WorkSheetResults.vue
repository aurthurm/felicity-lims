<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, computed, reactive, defineAsyncComponent } from "vue";
import { isNullOrWs } from "@/utils";
import { IAnalysisResult, IAnalysisService } from "@/models/analysis";
import useWorkSheetComposable from "@/composables/worksheet";
import useAnalysisComposable from "@/composables/analysis";
import { useWorksheetStore } from "@/stores/worksheet";
import { useUserStore } from "@/stores/user";
import { useSetupStore } from "@/stores/setup";
import * as shield from "@/guards";
const FButton = defineAsyncComponent(
  () => import("@/components/ui/buttons/FelButton.vue")
)
const FelSelect = defineAsyncComponent(
  () => import("@/components/ui/select/FelSelect.vue")
)
const FelSwitch = defineAsyncComponent(
  () => import("@/components/ui/switch/FelSwitch.vue")
)

const worksheetStore = useWorksheetStore();
const setupStore = useSetupStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

let can_submit = ref<boolean>(false);
let can_retract = ref<boolean>(false);
let can_approve = ref<boolean>(false);
let can_retest = ref<boolean>(false);
let can_unassign = ref<boolean>(false);
let barcodes = ref<boolean>(false);

let allChecked = ref<boolean>(false);
let viewDetail = ref<boolean>(false);
let worksheet = computed(() => worksheetStore.getWorkSheet);

const refresh = () => {
  worksheetStore.fetchWorksheetByUid(route.params.workSheetUid as string);
};

//
userStore.fetchUsers({});
setupStore.fetchLaboratoryInstruments();
setupStore.fetchMethods();
const form = reactive({
  analystUid: null,
  instrumentUid: null,
  methodUid: null,
});

const applying = ref<boolean>(false);
const applyChanges = () => {
  applying.value = true;
  worksheetStore
    .updateWorksheet({ worksheetUid: route.params.workSheetUid, ...form })
    .then(() => {
      applying.value = false;
      refresh();
    });
};
//

function areAllChecked(): boolean {
  return worksheet.value?.analysisResults?.every((item) => item.checked === true)!;
}

function getResultsChecked(): any {
  let results: IAnalysisResult[] = [];
  worksheet.value?.analysisResults?.forEach((result) => {
    if (result.checked) results.push(result);
  });
  return results;
}

function checkCheck(): void {
  if (areAllChecked()) {
    allChecked.value = true;
  } else {
    allChecked.value = false;
  }
  checkUserActionPermissios();
}

function check(result: IAnalysisResult): void {
  if (checkDisabled(result)) {
    unCheck(result);
    return;
  }
  result.checked = true;
  checkUserActionPermissios();
}

function checkDisabled(result: IAnalysisResult): boolean {
  return ["retracted", "approved"].includes(result.status!);
}

function unCheck(result: IAnalysisResult): void {
  result.checked = false;
  checkUserActionPermissios();
}

function toggleCheckAll(): void {
  worksheet?.value?.analysisResults?.forEach((result) =>
    allChecked.value ? check(result) : unCheck(result)
  );
  checkUserActionPermissios();
}

function unCheckAll(): void {
  worksheet?.value?.analysisResults?.forEach((result) => unCheck(result));
  checkUserActionPermissios();
}

function analysesText(analyses: IAnalysisService[]): string {
  let names: string[] = [];
  analyses?.forEach((a) => names.push(a.name!));
  return names.join(", ");
}

function editResult(result: any): void {
  result.editable = true;
}

function isEditable(result: IAnalysisResult): Boolean {
  if (result.status !== "pending") {
    return false;
  }
  if (result?.editable || isNullOrWs(result?.result)) {
    editResult(result);
    return true;
  }
  return false;
}

function prepareResults(): any[] {
  let results = getResultsChecked();
  let ready: IAnalysisResult[] = [];
  results?.forEach((result: IAnalysisResult) =>
    ready.push({ 
      uid: result.uid, 
      result: result.result,
      laboratoryInstrumentUid: result.laboratoryInstrumentUid,
      methodUid: result.methodUid
    } as IAnalysisResult)
  );
  return ready;
}

function getResultsUids(): string[] {
  const results = getResultsChecked();
  let ready: string[] = [];
  results?.forEach((result: IAnalysisResult) => ready.push(result.uid!));
  return ready;
}

function getSampleUids(): string[] {
  const results = getResultsChecked();
  let ready: string[] = [];
  results?.forEach((result: IAnalysisResult) => ready.push(result.sample?.uid!));
  return ready;
}

function getResultRowColor(result: any): string {
  switch (result?.status) {
    case "retracted":
      return "bg-muted text-sm italic text-muted-foreground";
    default:
      return "text-sm leading-5 text-primary";
  }
}

function isDisabledRowCheckBox(result: any): boolean {
  switch (result?.status) {
    case "retracted":
      return true;
    case "approved":
      if (result?.reportable === false) {
        return true;
      } else {
        return false;
      }
    default:
      return false;
  }
}

function checkUserActionPermissios(): void {
  // reset
  can_submit.value = false;
  can_unassign.value = false;
  can_retract.value = false;
  can_approve.value = false;
  can_retest.value = false;
  barcodes.value = false;

  const checked = getResultsChecked();
  if (checked.length === 0) {
    return;
  } else {
    barcodes.value = true;
  };

  // can submit
  if (checked.every((result: IAnalysisResult) => result.status === "pending")) {
    can_submit.value = true;
    can_unassign.value = true;
  }
  // can verify/ retract/ retest
  if (checked.every((result: IAnalysisResult) => result.status === "resulted")) {
    can_retract.value = true;
    can_approve.value = true;
    can_retest.value = true;
  }
}

const {
  submitResults: submitter_,
  approveResults: approver_,
  retractResults: retracter_,
  retestResults: retester_,
  
} = useAnalysisComposable();

const { unAssignSamples: unassinger_ } = useWorkSheetComposable();

const unAssignSamples = () => unassinger_(getResultsUids());
const submitResults = () =>
  submitter_(prepareResults(), "worksheet", worksheet.value?.uid!);
const approveResults = () =>
  approver_(getResultsUids(), "worksheet", worksheet.value?.uid!);
const retractResults = () => retracter_(getResultsUids());
const retestResults = () => retester_(getResultsUids());
const printBarCodes = async () => {
  window.open(router.resolve({ 
    name: "print-barcodes",
    query: { sampleUids: JSON.stringify(getSampleUids().join(",")) }}
  ).href,'_blank')
}

</script>

<template>
  <div class="space-y-6">
    <!-- Actions Bar -->
    <div class="flex items-center justify-between bg-background rounded-lg shadow-sm p-4">
      <div class="flex items-center space-x-4">
        <FButton 
          v-show="can_submit && shield.hasRights(shield.actions.SUBMIT, shield.objects.ANALYSIS)" 
          @click="submitResults()" 
          :loading="submitting"
          variant="primary"
          size="sm"
        >
          Submit Results
        </FButton>
        <FButton 
          v-show="can_approve && shield.hasRights(shield.actions.VERIFY, shield.objects.ANALYSIS)" 
          @click="approveResults()" 
          :loading="approving"
          variant="primary"
          size="sm"
        >
          Approve Results
        </FButton>
        <FButton 
          v-show="can_retract && shield.hasRights(shield.actions.RETRACT, shield.objects.ANALYSIS)" 
          @click="retractResults()" 
          :loading="retracting"
          variant="destructive"
          size="sm"
        >
          Retract Results
        </FButton>
        <FButton 
          v-show="can_retest && shield.hasRights(shield.actions.RETEST, shield.objects.ANALYSIS)" 
          @click="retestResults()" 
          :loading="retesting"
          variant="secondary"
          size="sm"
        >
          Retest
        </FButton>
        <FButton 
          v-show="can_unassign && shield.hasRights(shield.actions.UNASSIGN, shield.objects.ANALYSIS)" 
          @click="unassignResults()" 
          :loading="unassigning"
          variant="secondary"
          size="sm"
        >
          Unassign
        </FButton>
      </div>
      <div class="flex items-center space-x-4">
        <FelSwitch v-model="viewDetail" label="View Detail" />
        <FelSwitch v-model="barcodes" label="Print Barcodes" />
      </div>
    </div>

    <!-- Results Table -->
    <div class="bg-background rounded-lg shadow-sm overflow-hidden">
      <div class="p-4 border-b border-border">
        <div class="grid grid-cols-3 gap-4">
          <label class="block space-y-2">
            <span class="text-sm font-medium text-foreground">Analyst</span>
            <FelSelect 
              v-model="form.analystUid"
              :options="userStore.getUsers"
              option-label="firstName"
              option-value="uid"
              placeholder="Select Analyst"
              class="w-full"
            />
          </label>
          <label class="block space-y-2">
            <span class="text-sm font-medium text-foreground">Instrument</span>
            <FelSelect 
              v-model="form.instrumentUid"
              :options="setupStore.getLaboratoryInstruments"
              option-label="name"
              option-value="uid"
              placeholder="Select Instrument"
              class="w-full"
            />
          </label>
          <label class="block space-y-2">
            <span class="text-sm font-medium text-foreground">Method</span>
            <FelSelect 
              v-model="form.methodUid"
              :options="setupStore.getMethods"
              option-label="name"
              option-value="uid"
              placeholder="Select Method"
              class="w-full"
            />
          </label>
        </div>
        <div class="mt-4 flex justify-end">
          <FButton 
            @click="applyChanges()" 
            :loading="applying"
            variant="primary"
            size="sm"
          >
            Apply Changes
          </FButton>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-muted">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <input
                  type="checkbox"
                  v-model="allChecked"
                  @click="toggleCheckAll()"
                  class="rounded border-input text-primary focus:ring-primary"
                />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Sample ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client Sample ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Analysis</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Result</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="result in worksheet?.analysisResults" :key="result.uid" :class="getResultRowColor(result)">
              <td class="px-4 py-3 whitespace-nowrap">
                <input
                  type="checkbox"
                  v-model="result.checked"
                  @click="checkCheck()"
                  :disabled="isDisabledRowCheckBox(result)"
                  class="rounded border-input text-primary focus:ring-primary"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ result.sample?.sampleId }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ result.sample?.clientSampleId }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ result.analysis?.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <input
                  v-if="isEditable(result)"
                  type="text"
                  v-model="result.result"
                  class="w-full px-2 py-1 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span v-else>{{ result.result }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{
                  'bg-primary/10 text-primary': result.status === 'pending',
                  'bg-warning/10 text-warning': result.status === 'awaiting',
                  'bg-success/10 text-success': result.status === 'approved',
                  'bg-destructive/10 text-destructive': result.status === 'retracted'
                }">
                  {{ result.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
