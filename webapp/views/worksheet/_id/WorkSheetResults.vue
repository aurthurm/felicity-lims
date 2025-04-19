<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, computed, reactive, defineAsyncComponent } from "vue";
import { isNullOrWs } from "@/utils/helpers";
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
  <div class="">
    <hr class="mt-4" />
    <div class="flex justify-between items-center" v-motion-slide-left>
      <FelSwitch v-model="viewDetail" label="More Sample Detail" />

      <form action="post" class="p-1" v-show="!applying">
        <div class="flex justify-start items-center gap-x-4 mb-4">
          <FelSelect
            label="Analyst"
            name="analyst_uid"
            v-model="form.analystUid"
            :options="userStore.users.map((user) => ({
              value: user.uid,
              label: `${user.firstName} ${user.lastName}`,
            }))"
            :disabled="worksheet?.state !== 'pending'" />

          <FelSelect 
            label="Instrument"
            name="instrument_uid"
            v-model="form.instrumentUid"
            :options="setupStore.laboratoryInstruments.map((labInst) => ({
              value: labInst.uid,
              label: `${labInst?.instrument.name} (${labInst?.labName})`,
            }))"
            :disabled="worksheet?.state !== 'pending'"/> 

          <FelSelect 
            label="Method"
            name="method_uid"
            v-model="form.methodUid"
            :options="setupStore.methods.map((method) => ({
              value: method.uid,
              label: `${method.name}`,
            }))"
            :disabled="worksheet?.state !== 'pending'"/> 

          <div class="ml-6 mt-2">
            <FButton @click.prevent="applyChanges()" :color="'sky-800'" class="p-1"
              :disabled="true">Apply</FButton
            >
          </div>
        </div>
      </form>
      <p v-show="applying">updating ...</p>

      <div>
        <button
          @click.prevent="refresh()"
          class="px-1 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
        >
          Refresh
        </button>
      </div>
    </div>
    <hr class="mb-4" />

    <!-- Sampe Table View -->
    <div class="overflow-x-auto">
      <div
        class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"
      >
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                class="px-1 py-1 border-b-2 border-border text-left leading-4 text-foreground tracking-wider"
              >
                <input
                  type="checkbox"
                  class=""
                  @change="toggleCheckAll()"
                  v-model="allChecked"
                />
              </th>
              <th
                class="px-1 py-1 border-b-2 border-border text-left leading-4 text-foreground tracking-wider"
              ></th>
              <th
                class="px-1 py-1 border-b-2 border-border text-left leading-4 text-foreground tracking-wider"
              >
                Sample ID
              </th>
              <th
                class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider"
              >
                Analysis/Test
              </th>
              <th
                class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider"
              >
                Instrument
              </th>
              <th
                class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider"
              >
                Method
              </th>
              <th
                class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider"
              >
                Interim
              </th>
              <th
                class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider"
              >
                Result
              </th>
              <th
                class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider"
              >
                Unit
              </th>
              <th
                class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider"
              >
                Status
              </th>
              <!-- <th class="px-1 py-1 border-b-2 border-border"></th> -->
            </tr>
          </thead>
          <tbody class="bg-background">
            <tr
              v-for="result in worksheet?.analysisResults"
              :key="result.uid"
              :class="[getResultRowColor(result)]"
              v-motion-slide-right
            >
              <td>
                <input
                  type="checkbox"
                  class=""
                  v-model="result.checked"
                  @change="checkCheck()"
                  :disabled="checkDisabled(result)"
                />
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                <span
                  v-if="(result?.sample?.priority ?? 0) > 0"
                  :class="[
                        'font-small',
                        { 'text-destructive': (worksheet?.priority ?? 0) > 1 },
                    ]"
                >
                  <font-awesome-icon icon="fa-star" />
                </span>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                <div class="text-sm leading-5 text-foreground font-semibold">
                  <router-link
                    v-if="result?.sample?.analysisRequest?.patient?.uid"
                    :to="{
                      name: 'sample-detail',
                      params: {
                        patientUid: result?.sample?.analysisRequest?.patient?.uid,
                        sampleUid: result?.sample?.uid,
                      },
                    }"
                    >{{ result?.sample?.sampleId }}
                  </router-link>
                  <div v-else>{{ result?.sample?.sampleId }}</div>
                </div>
                <span v-if="viewDetail">
                  <span>
                    {{ result?.sample?.qcLevel?.level }}
                  </span>
                  <div>
                    {{ result?.sample?.analysisRequest?.patient?.firstName }}
                    {{ result?.sample?.analysisRequest?.patient?.lastName }}
                  </div>
                  <div>
                    {{ result?.sample?.analysisRequest?.client?.name }}
                  </div>
                </span>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                <div>{{ result?.analysis?.name }}</div>
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
                <div
                  v-if="!isEditable(result) || (result?.analysis?.interims?.length ?? 0) === 0"
                  class="text-sm leading-5 text-primary"
                >
                  ---
                </div>
                <label v-else class="block col-span-2 mb-2">
                  <select
                    class="form-input mt-1 block w-full"
                    v-model="result.result"
                    @change="check(result)"
                  >
                    <option value=""></option>
                    <option
                      v-for="(interim, idx) in result?.analysis?.interims"
                      :key="interim.key || idx"
                      :value="interim.value"
                    >
                      {{ interim.value }}
                    </option>
                  </select>
                </label>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                <div v-if="!isEditable(result)">{{ result?.result }}</div>
                <label
                  v-else-if="result?.analysis?.resultOptions?.length === 0"
                  class="block"
                >
                  <input
                    class="form-input mt-1 block w-full"
                    v-model="result.result"
                    @keyup="check(result)"
                  />
                </label>
                <label v-else class="block col-span-2 mb-2">
                  <select
                    class="form-input mt-1 block w-full"
                    v-model="result.result"
                    @change="check(result)"
                  >
                    <option value=""></option>
                    <option
                      v-for="(option, idx) in result?.analysis?.resultOptions"
                      :key="option.optionKey || idx"
                      :value="option.value"
                    >
                      {{ option.value }}
                    </option>
                  </select>
                </label>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                <div>{{ result?.analysis?.unit?.name || "---" }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                <button
                  type="button"
                  class="bg-primary text-primary-foreground py-1 px-2 rounded-sm leading-none"
                >
                  {{ result?.status || "unknown" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <section class="my-4">
      <button
        v-show="
          shield.hasRights(shield.actions.CREATE, shield.objects.WORKSHEET) &&
          can_unassign
        "
        @click.prevent="unAssignSamples()"
        class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
      >
        Un Assign
      </button>
      <button
        v-show="
          shield.hasRights(shield.actions.UPDATE, shield.objects.WORKSHEET) && can_submit
        "
        @click.prevent="submitResults()"
        class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
      >
        Submit
      </button>
      <button
        v-show="
          shield.hasRights(shield.actions.UPDATE, shield.objects.WORKSHEET) && can_retract
        "
        @click.prevent="retractResults()"
        class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
      >
        Retract
      </button>
      <button
        v-show="
          shield.hasRights(shield.actions.UPDATE, shield.objects.WORKSHEET) && can_approve
        "
        @click.prevent="approveResults()"
        class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
      >
        Approve
      </button>
      <button
        v-show="
          shield.hasRights(shield.actions.UPDATE, shield.objects.WORKSHEET) && can_retest
        "
        @click.prevent="retestResults()"
        class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
      >
        Retest
      </button>
      <button 
          v-show="barcodes"
          @click.prevent="printBarCodes"
          class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">
          Print Barcodes
        </button>
    </section>
  </div>
</template>
