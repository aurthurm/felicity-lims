<script setup lang="ts">
import FButton from "../../../components/Buttons/Button.vue";
import { useRoute } from "vue-router";
import { ref, computed, reactive } from "vue";
import { isNullOrWs } from "../../../utils";
import { IAnalysisResult, IAnalysisService } from "../../../models/analysis";
import { useAnalysisComposable, useWorkSheetComposable } from "../../../composables";
import { useWorksheetStore, useSetupStore, useUserStore } from "../../../stores";

import * as shield from "../../../guards";

const worksheetStore = useWorksheetStore();
const setupStore = useSetupStore();
const userStore = useUserStore();
const route = useRoute();

let can_submit = ref<boolean>(false);
let can_retract = ref<boolean>(false);
let can_approve = ref<boolean>(false);
let can_retest = ref<boolean>(false);
let can_unassign = ref<boolean>(false);

let allChecked = ref<boolean>(false);
let viewDetail = ref<boolean>(false);
let worksheet = computed(() => worksheetStore.getWorkSheet);

const refresh = () => {
  worksheetStore.fetchWorksheetByUid(+route.params.workSheetUid);
};

//
userStore.fetchUsers({});
setupStore.fetchInstruments();
setupStore.fetchMethods();
const form = reactive({
  analystUid: undefined,
  instrumentUid: undefined,
  methodUid: undefined,
});

const applying = ref<boolean>(false);
const applyChanges = () => {
  applying.value = true;
  worksheetStore
    .updateWorksheet({ worksheetUid: +route.params.workSheetUid, ...form })
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
    ready.push({ uid: result.uid, result: result.result } as IAnalysisResult)
  );
  return ready;
}

function getResultsUids(): number[] {
  const results = getResultsChecked();
  let ready: number[] = [];
  results?.forEach((result: IAnalysisResult) => ready.push(result.uid!));
  return ready;
}

function getResultRowColor(result: any): string {
  switch (result?.status) {
    case "retracted":
      return "bg-gray-300 text-sm italic text-gray-500";
    case "pending":
      if (result?.retest === true) {
        return "bg-sky-800 text-sm leading-5 text-sky-800";
      } else {
        return "";
      }
    case "resulted":
      if (result?.retest === true) {
        return "bg-sky-800 text-sm leading-5 text-sky-800";
      } else {
        return "";
      }
    case "approved":
      if (result?.retest === true) {
        return "bg-sky-800 text-sm leading-5 text-sky-800";
      } else {
        return "";
      }
    default:
      return "text-sm leading-5 text-sky-800";
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

  const checked = getResultsChecked();
  if (checked.length === 0) return;

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
</script>

<template>
  <div class="">
    <hr class="mt-4" />
    <div class="flex justify-between items-center" v-motion-slide-left>
      <label for="toggle" class="text-medium text-gray-700 my-4"
        >More Sample Detail
        <div
          class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
        >
          <input
            type="checkbox"
            name="toggle"
            id="toggle"
            v-model="viewDetail"
            class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"
          />
          <label
            for="toggle"
            class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
          ></label>
        </div>
      </label>

      <form action="post" class="p-1" v-show="!applying">
        <div class="flex justify-start items-center mb-4">
          <label class="flex justify-between items-center">
            <span class="text-gray-700 mr-2">Analyst</span>
            <select
              name="instrument_uid"
              v-model="form.analystUid"
              class="form-input mt-1 block w-full py-1"
            >
              <option v-for="user in userStore.users" :key="user.uid" :value="user.uid">
                {{ user.firstName }} {{ user.lastName }}
              </option>
            </select>
          </label>
          <label class="flex justify-between items-center ml-4">
            <span class="text-gray-700 mr-2">Instrument</span>
            <select
              name="instrument_uid"
              v-model="form.instrumentUid"
              class="form-input mt-1 block w-full py-1"
            >
              <option
                v-for="instrument in setupStore.instruments"
                :key="instrument.uid"
                :value="instrument.uid"
              >
                {{ instrument.name }}
              </option>
            </select>
          </label>
          <label class="flex justify-between items-center ml-4">
            <span class="text-gray-700 mr-2">Method</span>
            <select
              name="method_uid"
              v-model="form.methodUid"
              class="form-input mt-1 block w-full py-1"
            >
              <option
                v-for="method in setupStore.methods"
                :key="method.uid"
                :value="method.uid"
              >
                {{ method.name }}
              </option>
            </select>
          </label>
          <div class="ml-6 mt-2">
            <FButton @click.prevent="applyChanges()" :color="'sky-800'" class="p-1"
              >Apply</FButton
            >
          </div>
        </div>
      </form>
      <p v-show="applying">updating ...</p>

      <div>
        <button
          @click.prevent="refresh()"
          class="px-1 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Refresh
        </button>
      </div>
    </div>
    <hr class="mb-4" />

    <!-- Sampe Table View -->
    <div class="overflow-x-auto">
      <div
        class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"
      >
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
              >
                <input
                  type="checkbox"
                  class=""
                  @change="toggleCheckAll()"
                  v-model="allChecked"
                />
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
                Analysis/Test
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Instrument
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Method
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Interim
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Result
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Unit
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Status
              </th>
              <!-- <th class="px-1 py-1 border-b-2 border-gray-300"></th> -->
            </tr>
          </thead>
          <tbody class="bg-white">
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
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <span
                  v-if="result?.sample?.priority! > 0"
                  :class="[
                        'font-small',
                        { 'text-orange-600': worksheet?.priority! > 1 },
                    ]"
                >
                  <i class="fa fa-star"></i>
                </span>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-gray-800 font-semibold">
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
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div>{{ result?.analysis?.name }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div>{{ result?.instrument?.name || "None" }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div>{{ result?.method?.name || "None" }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div
                  v-if="
                    !isEditable(result) || (result?.analysis?.interims?.length ?? 0) === 0
                  "
                  class="text-sm leading-5 text-sky-800"
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
                      v-for="(interim, index) in result?.analysis?.interims"
                      :key="interim.key"
                      :value="interim.value"
                    >
                      {{ interim.value }}
                    </option>
                  </select>
                </label>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
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
                      v-for="(option, index) in result?.analysis?.resultOptions"
                      :key="option.optionKey"
                      :value="option.value"
                    >
                      {{ option.value }}
                    </option>
                  </select>
                </label>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div>{{ result?.analysis?.unit?.name || "---" }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <button
                  type="button"
                  class="bg-sky-800 text-white py-1 px-2 rounded-sm leading-none"
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
        class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Un Assign
      </button>
      <button
        v-show="
          shield.hasRights(shield.actions.UPDATE, shield.objects.WORKSHEET) && can_submit
        "
        @click.prevent="submitResults()"
        class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Submit
      </button>
      <button
        v-show="
          shield.hasRights(shield.actions.UPDATE, shield.objects.WORKSHEET) && can_retract
        "
        @click.prevent="retractResults()"
        class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Retract
      </button>
      <button
        v-show="
          shield.hasRights(shield.actions.UPDATE, shield.objects.WORKSHEET) && can_approve
        "
        @click.prevent="approveResults()"
        class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Approve
      </button>
      <button
        v-show="
          shield.hasRights(shield.actions.UPDATE, shield.objects.WORKSHEET) && can_retest
        "
        @click.prevent="retestResults()"
        class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Retest
      </button>
    </section>
  </div>
</template>
