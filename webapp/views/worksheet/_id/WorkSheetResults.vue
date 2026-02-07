<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, computed, reactive } from "vue";
import { isNullOrWs } from "@/utils";
import { AnalysisResultType, AnalysisType } from "@/types/gql";
import useWorkSheetComposable from "@/composables/worksheet";
import useAnalysisComposable from "@/composables/analysis";
import { useWorksheetStore } from "@/stores/worksheet";
import { useUserStore } from "@/stores/user";
import { useSetupStore } from "@/stores/setup";
import * as shield from "@/guards";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";

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

const toSelectValue = (value: string | number | null): string | undefined =>
  value != null ? String(value) : undefined;

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
  let results: AnalysisResultType[] = [];
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

function check(result: AnalysisResultType): void {
  if (checkDisabled(result)) {
    unCheck(result);
    return;
  }
  result.checked = true;
  checkUserActionPermissios();
}

function checkDisabled(result: AnalysisResultType): boolean {
  return ["retracted", "approved"].includes(result.status!);
}

function unCheck(result: AnalysisResultType): void {
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

function analysesText(analyses: AnalysisType[]): string {
  let names: string[] = [];
  analyses?.forEach((a) => names.push(a.name!));
  return names.join(", ");
}

function editResult(result: any): void {
  result.editable = true;
}

function isEditable(result: AnalysisResultType): boolean {
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
  let ready: AnalysisResultType[] = [];
  results?.forEach((result: AnalysisResultType) =>
    ready.push({ 
      uid: result.uid, 
      result: result.result,
      laboratoryInstrumentUid: result.laboratoryInstrumentUid,
      methodUid: result.methodUid
    } as AnalysisResultType)
  );
  return ready;
}

function getResultsUids(): string[] {
  const results = getResultsChecked();
  let ready: string[] = [];
  results?.forEach((result: AnalysisResultType) => ready.push(result.uid!));
  return ready;
}

function getSampleUids(): string[] {
  const results = getResultsChecked();
  let ready: string[] = [];
  results?.forEach((result: AnalysisResultType) => ready.push(result.sample?.uid!));
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
  if (
    checked.every(
      (result: AnalysisResultType) =>
        result.status === "pending" &&
        !isNullOrWs(result.methodUid) &&
        !isNullOrWs(result.laboratoryInstrumentUid)
    )
  ) {
    can_submit.value = true;
    can_unassign.value = true;
  }
  // can verify/ retract/ retest
  if (checked.every((result: AnalysisResultType) => result.status === "resulted")) {
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
        <Button 
          v-show="can_submit && shield.hasRights(shield.actions.SUBMIT, shield.objects.ANALYSIS)" 
          @click="submitResults()" 
          :disabled="submitting"
          size="sm"
        >
          <Spinner v-if="submitting" class="mr-2 size-4" />
          Submit Results
        </Button>
        <Button 
          v-show="can_approve && shield.hasRights(shield.actions.VERIFY, shield.objects.ANALYSIS)" 
          @click="approveResults()" 
          :disabled="approving"
          size="sm"
        >
          <Spinner v-if="approving" class="mr-2 size-4" />
          Approve Results
        </Button>
        <Button 
          v-show="can_retract && shield.hasRights(shield.actions.RETRACT, shield.objects.ANALYSIS)" 
          @click="retractResults()" 
          :disabled="retracting"
          variant="destructive"
          size="sm"
        >
          <Spinner v-if="retracting" class="mr-2 size-4" />
          Retract Results
        </Button>
        <Button 
          v-show="can_retest && shield.hasRights(shield.actions.RETEST, shield.objects.ANALYSIS)" 
          @click="retestResults()" 
          :disabled="retesting"
          variant="secondary"
          size="sm"
        >
          <Spinner v-if="retesting" class="mr-2 size-4" />
          Retest
        </Button>
        <Button 
          v-show="can_unassign && shield.hasRights(shield.actions.UNASSIGN, shield.objects.ANALYSIS)" 
          @click="unAssignSamples()" 
          :disabled="unassigning"
          variant="secondary"
          size="sm"
        >
          <Spinner v-if="unassigning" class="mr-2 size-4" />
          Unassign
        </Button>
      </div>
      <div class="flex items-center space-x-4">
        <label class="text-sm font-medium flex items-center gap-x-2">
          <Switch :checked="viewDetail" @update:checked="(value) => viewDetail = value" />
          <span>View Detail</span>
        </label>
        <label class="text-sm font-medium flex items-center gap-x-2">
          <Switch :checked="barcodes" @update:checked="(value) => barcodes = value" />
          <span>Print Barcodes</span>
        </label>
      </div>
    </div>

    <!-- Results Table -->
    <div class="border border-border bg-card rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b border-border">
        <div class="grid grid-cols-3 gap-4">
          <label class="block space-y-2">
            <span class="text-sm font-medium text-foreground">Analyst</span>
            <Select
              :model-value="toSelectValue(form.analystUid)"
              @update:model-value="(value) => form.analystUid = value"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select Analyst" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="user in userStore.getUsers"
                    :key="user?.uid"
                    :value="String(user?.uid)"
                  >
                    <SelectItemText>{{ user?.firstName }}</SelectItemText>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>
          <label class="block space-y-2">
            <span class="text-sm font-medium text-foreground">Instrument</span>
            <Select
              :model-value="toSelectValue(form.instrumentUid)"
              @update:model-value="(value) => form.instrumentUid = value"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select Instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="instrument in setupStore.getLaboratoryInstruments"
                    :key="instrument?.uid"
                    :value="String(instrument?.uid)"
                  >
                    <SelectItemText>{{ instrument?.name }}</SelectItemText>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>
          <label class="block space-y-2">
            <span class="text-sm font-medium text-foreground">Method</span>
            <Select
              :model-value="toSelectValue(form.methodUid)"
              @update:model-value="(value) => form.methodUid = value"
            >
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="method in setupStore.getMethods"
                    :key="method?.uid"
                    :value="String(method?.uid)"
                  >
                    <SelectItemText>{{ method?.name }}</SelectItemText>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>
        </div>
        <div class="mt-4 flex justify-end">
          <Button 
            @click="applyChanges()" 
            :disabled="applying"
            size="sm"
          >
            <Spinner v-if="applying" class="mr-2 size-4" />
            Apply Changes
          </Button>
        </div>
      </div>

      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Checkbox :checked="allChecked" @update:checked="(value) => allChecked = value"
                  @click="toggleCheckAll()"
                />
              </TableHead>
              <TableHead class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Sample ID</TableHead>
              <TableHead class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Client Sample ID</TableHead>
              <TableHead class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Analysis</TableHead>
              <TableHead class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Result</TableHead>
              <TableHead class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="result in worksheet?.analysisResults" :key="result.uid" :class="['border-b transition-colors', getResultRowColor(result)]">
              <TableCell class="px-4 py-3 whitespace-nowrap">
                <Checkbox :checked="result.checked" @update:checked="(value) => result.checked = value"
                  @click="checkCheck()"
                  :disabled="isDisabledRowCheckBox(result)"
                />
              </TableCell>
              <TableCell class="px-4 py-3 whitespace-nowrap">{{ result.sample?.sampleId }}</TableCell>
              <TableCell class="px-4 py-3 whitespace-nowrap">{{ result.sample?.clientSampleId }}</TableCell>
              <TableCell class="px-4 py-3 whitespace-nowrap">{{ result.analysis?.name }}</TableCell>
              <TableCell class="px-4 py-3 whitespace-nowrap">
                <input
                  v-if="isEditable(result)"
                  type="text"
                  v-model="result.result"
                  class="w-full px-2 py-1 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span v-else>{{ result.result }}</span>
              </TableCell>
              <TableCell class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{'bg-primary/10 text-primary': result.status === 'pending',
                  'bg-warning/10 text-warning': result.status === 'awaiting',
                  'bg-success/10 text-success': result.status === 'approved',
                  'bg-destructive/10 text-destructive': result.status === 'retracted'
                }">
                  {{ result.status }}
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
