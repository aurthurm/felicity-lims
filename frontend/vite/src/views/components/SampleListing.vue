<script setup lang="ts">
import LoadingMessage from "../../components/Spinners/LoadingMessage.vue";
import { reactive, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { IAnalysisProfile, IAnalysisService, ISample } from "../../models/analysis";
import { ifZeroEmpty, parseDate } from "../../utils";
import { useSampleStore, useAnalysisStore } from "../../stores";
import { useReportComposable, useSampleComposable } from "../../composables";

import * as shield from "../../guards";

const sampleStore = useSampleStore();
const analysisStore = useAnalysisStore();

const { samplePageInfo, fetchingSamples } = storeToRefs(sampleStore);

let route = useRoute();
let router = useRouter();

const state = reactive({
  filterText: "",
  filterStatus: "received",
  sampleBatch: 50,
  samples: computed<ISample[]>(() => sampleStore.getSamples),
  can_cancel: false,
  can_receive: false,
  can_reinstate: false,
  can_reject: false,
  can_copy_to: false,
  can_download: false,
  can_print: false,
  allChecked: false,
});

if (route?.query?.clientUid) {
  sampleStore.resetSamples();
}

sampleStore.fetchSampleTypes();

let analysesParams = reactive({
  first: undefined,
  after: "",
  text: "",
  sortBy: ["name"],
});
analysisStore.fetchAnalysesServices(analysesParams);
analysisStore.fetchAnalysesProfiles();

let sampleParams = reactive({
  first: state.sampleBatch,
  after: "",
  status: state.filterStatus,
  text: "",
  sortBy: ["-uid"],
  clientUid: +ifZeroEmpty(route?.query?.clientUid),
  filterAction: false,
});
sampleStore.fetchSamples(sampleParams);

function profileAnalysesText(
  profiles: IAnalysisProfile[],
  analyses: IAnalysisService[]
): string {
  let names: string[] = [];
  profiles.forEach((p) => names.push(p.name!));
  analyses.forEach((a) => names.push(a.name!));
  return names.join(", ");
}

function showMoreSamples(): void {
  sampleParams.first = +state.sampleBatch;
  sampleParams.after = samplePageInfo?.value?.endCursor;
  sampleParams.text = state.filterText;
  sampleParams.status = state.filterStatus;
  sampleParams.filterAction = false;
  sampleStore.fetchSamples(sampleParams);
}

function filterSamples(): void {
  state.sampleBatch = 50;
  sampleParams.first = 50;
  sampleParams.after = "";
  sampleParams.text = state.filterText;
  sampleParams.status = state.filterStatus;
  sampleParams.filterAction = true;
  sampleStore.fetchSamples(sampleParams);
}

// user actions perms

function check(sample: ISample): void {
  sample.checked = true;
  checkUserActionPermissios();
}

function unCheck(sample: ISample): void {
  sample.checked = false;
  checkUserActionPermissios();
}

function toggleCheckAll(): void {
  state.samples?.forEach((sample: ISample) =>
    state.allChecked ? check(sample) : unCheck(sample)
  );
  checkUserActionPermissios();
}

function areAllChecked(): Boolean {
  return state.samples?.every((sample: ISample) => sample.checked === true);
}

function checkCheck(sample: ISample): void {
  if (areAllChecked()) {
    state.allChecked = true;
  } else {
    state.allChecked = false;
  }
  checkUserActionPermissios();
}

function getSamplesChecked(): ISample[] {
  let box: ISample[] = [];
  state.samples?.forEach((sample: ISample) => {
    if (sample.checked) box.push(sample);
  });
  return box;
}

function checkUserActionPermissios(): void {
  // reset
  state.can_cancel = false;
  state.can_receive = false;
  state.can_reinstate = false;
  state.can_download = false;
  state.can_print = false;
  state.can_reject = false;

  const checked: ISample[] = getSamplesChecked();
  if (checked.length === 0) return;

  // can_receive
  if (checked.every((sample: ISample) => sample.status === "expected")) {
    state.can_receive = true;
  }

  // can_cancel
  if (
    checked.every((sample: ISample) => ["received", "expected"].includes(sample.status!))
  ) {
    state.can_cancel = true;
    state.can_reject = true;
  }

  // can_reinstate
  if (checked.every((sample: ISample) => sample.status === "cancelled")) {
    state.can_reinstate = true;
  }

  // can_download
  if (
    checked.every((sample: ISample) => ["approved", "published"].includes(sample.status!))
  ) {
    state.can_download = true;
  }

  // can_print
  if (checked.every((sample: ISample) => sample.status === "approved")) {
    state.can_print = true;
  }
}

function getSampleUids(): number[] {
  const items: ISample[] = getSamplesChecked();
  let ready: number[] = [];
  items?.forEach((item) => ready.push(item.uid!));
  return ready;
}

//
const {
  cancelSamples,
  reInstateSamples,
  receiveSamples,
  publishSamples,
} = useSampleComposable();
const { downloadReports } = useReportComposable();

const sampleCount = computed(
  () => sampleStore.getSamples?.length + " of " + sampleStore.getSampleCount + " samples"
);
const cancelSamples_ = async () => cancelSamples(getSampleUids());
const reInstateSamples_ = async () => reInstateSamples(getSampleUids());
const receiveSamples_ = async () => receiveSamples(getSampleUids());
const downloadReports_ = async () => await downloadReports(getSampleUids());
const printReports_ = async () => await publishSamples(getSampleUids());
const prepareRejections = async () => {
  const selection = getSamplesChecked();
  router.push({ name: "reject-samples", params: { samples: JSON.stringify(selection) } });
};
</script>

<template>
  <div class="">
    <div class="my-4 flex sm:flex-row flex-col">
      <div class="flex flex-row mb-1 sm:mb-0">
        <div class="relative">
          <select
            v-model="state.filterStatus"
            class="appearance-none h-full rounded-l-sm border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="">All</option>
            <option value="expected">Expected</option>
            <option value="received">Received</option>
            <option value="awaiting">Awaiting</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="invalidated">Invalidated</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
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
          v-model="state.filterText"
          class="appearance-none rounded-r-sm rounded-l-sm sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
        />
      </div>
      <button
        @click.prevent="filterSamples()"
        class="px-2 py-1 ml-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >
        Filter ...
      </button>
    </div>

    <hr />
    <router-link
      v-show="shield.hasRights(shield.actions.CREATE, shield.objects.SAMPLE)"
      to="/patients/search"
      class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >Add Laboratory Request</router-link
    >
    <hr />

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
              >
                <input
                  type="checkbox"
                  @change="toggleCheckAll()"
                  v-model="state.allChecked"
                />
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
              ></th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"
              >
                Sampe ID
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Test(s)
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Patient
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Client Patient ID
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Client
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Created
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Creator
              </th>
              <th
                class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Status
              </th>
              <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
          </thead>
          <tbody class="bg-white" v-if="state.samples?.length > 0">
            <tr v-for="sample in state.samples" :key="sample.uid" v-motion-slide-right>
              <td>
                <input
                  type="checkbox"
                  v-model="sample.checked"
                  @change="checkCheck(sample)"
                />
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <span
                  v-if="sample.priority! > 1"
                  :class="[
                          'font-small',
                          { 'text-orange-600': sample.priority! > 1 },
                      ]"
                >
                  <i class="fa fa-star"></i>
                </span>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                  <div class="text-sm leading-5 text-gray-800">
                    <router-link
                      :to="{
                        name: 'sample-detail',
                        params: {
                          patientUid: sample?.analysisRequest?.patient?.uid,
                          sampleUid: sample?.uid,
                        },
                      }"
                      >{{ sample.sampleId }}</router-link
                    >
                  </div>
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">
                  {{ profileAnalysesText(sample.profiles!, sample.analyses!) }}
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">
                  {{ sample?.analysisRequest?.patient?.firstName }}
                  {{ sample?.analysisRequest?.patient?.lastName }}
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">
                  {{ sample?.analysisRequest?.patient?.clientPatientId }}
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">
                  {{ sample?.analysisRequest?.client?.name }}
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">
                  {{ parseDate(sample?.createdAt) }}
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-sky-800">
                  {{ sample?.createdBy?.firstName }}
                </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <button
                  type="button"
                  class="bg-sky-800 text-white py-1 px-2 rounded-sm leading-none"
                >
                  {{ sample.status }}
                </button>
              </td>
              <td
                class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"
              >
                <router-link
                  :to="{
                    name: 'sample-detail',
                    params: {
                      patientUid: sample?.analysisRequest?.patient?.uid,
                      sampleUid: sample?.uid,
                    },
                  }"
                  class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
                  >View</router-link
                >
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="fetchingSamples" class="py-4 text-center">
          <LoadingMessage message="Fetching samples ..." />
        </div>
      </div>
    </div>

    <section class="flex justify-between items-center">
      <div>
        <button
          v-show="
            shield.hasRights(shield.actions.CANCEL, shield.objects.SAMPLE) &&
            state.can_cancel
          "
          @click.prevent="cancelSamples_()"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Cancel
        </button>
        <button
          v-show="
            shield.hasRights(shield.actions.CANCEL, shield.objects.SAMPLE) &&
            state.can_reinstate
          "
          @click.prevent="reInstateSamples_()"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          ReInstate
        </button>
        <button
          v-show="
            shield.hasRights(shield.actions.CANCEL, shield.objects.SAMPLE) &&
            state.can_receive
          "
          @click.prevent="receiveSamples_()"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Reveive
        </button>
        <button
          v-show="
            shield.hasRights(shield.actions.CANCEL, shield.objects.SAMPLE) &&
            state.can_reject
          "
          @click.prevent="prepareRejections()"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Reject
        </button>
        <button
          v-show="
            shield.hasRights(shield.actions.CANCEL, shield.objects.SAMPLE) &&
            state.can_copy_to
          "
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Copy to New
        </button>
        <button
          v-show="
            shield.hasRights(shield.actions.CANCEL, shield.objects.SAMPLE) &&
            state.can_download
          "
          @click.prevent="downloadReports_()"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Download
        </button>
        <button
          v-show="
            shield.hasRights(shield.actions.CANCEL, shield.objects.SAMPLE) &&
            state.can_print
          "
          @click.prevent="printReports_()"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Print
        </button>
      </div>
      <div class="my-4 flex sm:flex-row flex-col">
        <button
          @click.prevent="showMoreSamples()"
          v-show="state.pageInfo?.hasNextPage"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Show More
        </button>
        <div class="flex flex-row mb-1 sm:mb-0">
          <div class="relative">
            <select
              class="appearance-none h-full rounded-l-sm border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              v-model="state.sampleBatch"
              :disabled="!state.pageInfo?.hasNextPage"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="250">250</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
              <option value="5000">5000</option>
              <option value="10000">10000</option>
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
            :placeholder="sampleCount"
            class="appearance-none rounded-r-sm rounded-l-sm sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
            disabled
          />
        </div>
      </div>
    </section>
  </div>
</template>
