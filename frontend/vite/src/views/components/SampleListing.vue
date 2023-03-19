<script setup lang="ts">
import DataTable from "../../components/datatable/DataTable.vue";
import { h, ref, reactive, computed } from "vue";
import { RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { IAnalysisProfile, IAnalysisService, ISample } from "../../models/analysis";
import { ifZeroEmpty, parseDate } from "../../utils";
import { useSampleStore, useAnalysisStore } from "../../stores";
import { useSampleComposable } from "../../composables";

import * as shield from "../../guards";

const sampleStore = useSampleStore();
const analysisStore = useAnalysisStore();

const { samplePageInfo, fetchingSamples } = storeToRefs(sampleStore);

let route = useRoute();
let router = useRouter();

const state = reactive({
  can_cancel: false,
  can_receive: false,
  can_reinstate: false,
  can_reject: false,
  can_copy_to: false,
  can_download: false,
  can_print: false,
  can_publish: false,
  can_store: false,
  can_recover: false,
});

// samples
const samples = computed<ISample[]>(() => sampleStore.getSamples);
const filterOptions = ref([
  { name: "All", value: "" },
  { name: "expected", value: "expected" },
  { name: "received", value: "received" },
  { name: "awaiting", value: "awaiting" },
  { name: "approved", value: "approved" },
  { name: "published", value: "published" },
  { name: "invalidated", value: "invalidated" },
  { name: "cancelled", value: "cancelled" },
  { name: "rejected", value: "rejected" },
  { name: "stored", value: "stored" },
]);

const tableColumns = ref([
  {
    name: "UID",
    value: "uid",
    sortable: true,
    sortBy: "asc",
    defaultSort: true,
    showInToggler: false,
    hidden: true,
  },
  {
    name: "",
    value: "",
    sortable: false,
    showInToggler: false,
    hidden: false,
    customRender: function (sample, _) {
      return h("div", [
        sample.priority! > 1
          ? h(
              "span",
              { class: [{ "text-orange-600": sample.priority! > 1 }] },
              h("i", { class: "fa fa-star" })
            )
          : "",
        sample.status === "stored" ? h("span", h("i", { class: "fa-briefcase" })) : "",
      ]);
    },
  },
  {
    name: "Sampe ID",
    value: "sampleId",
    sortable: true,
    sortBy: "asc",
    hidden: false,
    customRender: function (sample, _) {
      return h(RouterLink, {
        to: {
          name: "sample-detail",
          params: {
            patientUid: sample?.analysisRequest?.patient?.uid,
            sampleUid: sample?.uid,
          },
        },
        innerHTML: sample?.sampleId,
      });
    },
  },
  {
    name: "Sample Type",
    value: "sampleType.name",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "Test(s)",
    value: "",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (sample, _) {
      return h(
        "span",
        {
          innerHTML: profileAnalysesText(sample["profiles"], sample["analyses"]),
        },
        []
      );
    },
  },
  {
    name: "Patient",
    value: "",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (sample, _) {
      const firstName = "analysisRequest.patient.firstName"
        .split(".")
        .reduce((acc, val) => acc?.[val], sample);
      const lasstName = "analysisRequest.patient.lastName"
        .split(".")
        .reduce((acc, val) => acc?.[val], sample);
      return h(
        "span",
        {
          innerHTML: `${firstName} ${lasstName}`,
        },
        []
      );
    },
  },
  {
    name: "Gender",
    value: "analysisRequest.patient.gender",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "Age",
    value: "analysisRequest.patient.age",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "Client Patient ID",
    value: "analysisRequest.patient.clientPatientId",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Client",
    value: "analysisRequest.client.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Client Code",
    value: "analysisRequest.client.code",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "Province",
    value: "analysisRequest.client.district.province.name",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "District",
    value: "analysisRequest.client.district.name",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "Client Request Id",
    value: "analysisRequest.clientRequestId",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Date Collected",
    value: "dateCollected",
    sortable: false,
    sortBy: "asc",
    hidden: true,
    customRender: function (sample, column) {
      const value = column.value.split(".").reduce((acc, val) => acc?.[val], sample);
      return h(
        "span",
        {
          innerHTML: parseDate(value),
        },
        []
      );
    },
  },
  {
    name: "Date Created",
    value: "createdAt",
    sortable: false,
    sortBy: "asc",
    hidden: true,
    customRender: function (sample, column) {
      const value = column.value.split(".").reduce((acc, val) => acc?.[val], sample);
      return h(
        "span",
        {
          innerHTML: parseDate(value),
        },
        []
      );
    },
  },
  {
    name: "Creator",
    value: "createdBy.firstName",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Date Received",
    value: "dateReceived",
    sortable: false,
    sortBy: "asc",
    hidden: true,
    customRender: function (sample, column) {
      const value = column.value.split(".").reduce((acc, val) => acc?.[val], sample);
      return h(
        "span",
        {
          innerHTML: parseDate(value),
        },
        []
      );
    },
  },
  {
    name: "Date Submitted",
    value: "dateSubmitted",
    sortable: false,
    sortBy: "asc",
    hidden: true,
    customRender: function (sample, column) {
      const value = column.value.split(".").reduce((acc, val) => acc?.[val], sample);
      return h(
        "span",
        {
          innerHTML: parseDate(value),
        },
        []
      );
    },
  },
  {
    name: "Date Verified",
    value: "dateVerified",
    sortable: false,
    sortBy: "asc",
    hidden: true,
    customRender: function (sample, column) {
      const value = column.value.split(".").reduce((acc, val) => acc?.[val], sample);
      return h(
        "span",
        {
          innerHTML: parseDate(value),
        },
        []
      );
    },
  },
  {
    name: "Date Published",
    value: "datePublished",
    sortable: false,
    sortBy: "asc",
    hidden: true,
    customRender: function (sample, column) {
      const value = column.value.split(".").reduce((acc, val) => acc?.[val], sample);
      return h(
        "span",
        {
          innerHTML: parseDate(value),
        },
        []
      );
    },
  },
  {
    name: "Date Printed",
    value: "datePrinted",
    sortable: false,
    sortBy: "asc",
    hidden: true,
    customRender: function (sample, column) {
      const value = column.value.split(".").reduce((acc, val) => acc?.[val], sample);
      return h(
        "span",
        {
          innerHTML: parseDate(value),
        },
        []
      );
    },
  },
  {
    name: "Printed",
    value: "printed",
    sortable: false,
    sortBy: "asc",
    hidden: true,
  },
  {
    name: "Status",
    value: "status",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (sample, column) {
      const value = column.value.split(".").reduce((acc, val) => acc?.[val], sample);
      return h(
        "button",
        {
          type: "button",
          class: "bg-sky-800 text-white py-1 px-2 rounded-sm leading-none",
          innerHTML: value,
        },
        []
      );
    },
  },
]);

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

function profileAnalysesText(
  profiles: IAnalysisProfile[],
  analyses: IAnalysisService[]
): string {
  let names: string[] = [];
  profiles.forEach((p) => names.push(p.name!));
  analyses.forEach((a) => names.push(a.name!));
  return names.join(", ");
}

let sampleParams = reactive({
  first: 50,
  before: "",
  status: "received",
  text: "",
  sortBy: ["-uid"],
  clientUid: ifZeroEmpty(route?.query?.clientUid),
  filterAction: false,
});
sampleStore.fetchSamples(sampleParams);

function showMoreSamples(opts: any): void {
  sampleParams.first = opts.fetchCount;
  sampleParams.before = samplePageInfo?.value?.endCursor ?? "";
  sampleParams.text = opts.filterText;
  sampleParams.status = opts.filterStatus;
  sampleParams.filterAction = false;
  sampleStore.fetchSamples(sampleParams);
}

function filterSamples(opts: any): void {
  sampleParams.first = 50;
  sampleParams.before = "";
  sampleParams.text = opts.filterText;
  sampleParams.status = opts.filterStatus;
  sampleParams.filterAction = true;
  sampleStore.fetchSamples(sampleParams);
}

// sample tooltip
const sampleToolTip = (sample: ISample) => {
  const sc = sample?.storageContainer;
  const ss = sc?.storageSection;
  const sl = ss?.storageLocation;
  const sr = sl?.storeRoom;
  return `${sr?.name} > ${sl?.name} > ${ss?.name} > ${sc?.name} > ${sample?.storageSlot}`;
};

// user actions perms

const allChecked = ref(false);
function toggleCheckAll(opts: any): void {
  samples.value?.forEach((sample: ISample) => (sample.checked = opts.checked));
  allChecked.value = opts.checked;
  checkUserActionPermissios();
}

function toggleCheck(sample: ISample): void {
  const index = samples.value.findIndex((s) => s.uid === sample.uid);
  samples.value[index].checked = sample.checked;
  if (areAllChecked()) {
    allChecked.value = true;
  } else {
    allChecked.value = false;
  }
  checkUserActionPermissios();
}

function unCheck(sample: ISample): void {
  const index = samples.value.findIndex((s) => s.uid === sample.uid);
  samples.value[index].checked = false;
  allChecked.value = false;
  checkUserActionPermissios();
}

async function unCheckAll() {
  samples.value?.forEach((sample: ISample) => (sample.checked = false));
  allChecked.value = false;
  checkUserActionPermissios();
}

function areAllChecked(): Boolean {
  return samples.value?.every((sample: ISample) => sample.checked === true);
}

function getSamplesChecked(): ISample[] {
  let box: ISample[] = [];
  samples.value?.forEach((sample: ISample) => {
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
  state.can_publish = false;
  state.can_print = false;
  state.can_reject = false;
  state.can_store = false;
  state.can_recover = false;
  state.can_copy_to = false;

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

  // can_store;
  if (checked.every((sample: ISample) => ["received"].includes(sample.status!))) {
    state.can_store = true;
    state.can_copy_to = true;
  }

  if (checked.every((sample: ISample) => ["stored"].includes(sample.status!))) {
    state.can_recover = true;
  }

  // can_reinstate
  if (checked.every((sample: ISample) => sample.status === "cancelled")) {
    state.can_reinstate = true;
  }

  // can_download
  if (
    checked.every((sample: ISample) => ["approved", "published"].includes(sample.status!))
  ) {
    state.can_copy_to = true;
  }

  // can_print
  if (checked.every((sample: ISample) => sample.status === "approved")) {
    state.can_publish = true;
  }

  // can_print
  if (checked.every((sample: ISample) => sample.status === "published")) {
    state.can_print = true;
    state.can_download = true;
  }
}

function getSampleUids(): string[] {
  const items: ISample[] = getSamplesChecked();
  let ready: string[] = [];
  items?.forEach((item) => ready.push(item.uid!));
  return ready;
}

//
const {
  cancelSamples,
  reInstateSamples,
  receiveSamples,
  printSamples,
  downloadSamplesImpress,
  publishSamples,
  recoverSamples,
  cloneSamples,
} = useSampleComposable();

const countNone = computed(
  () => sampleStore.getSamples?.length + " of " + sampleStore.getSampleCount + " samples"
);

const cloneSamples_ = async () =>
  cloneSamples(getSampleUids()).finally(() => unCheckAll());

const cancelSamples_ = async () =>
  cancelSamples(getSampleUids()).finally(() => unCheckAll());

const reInstateSamples_ = async () =>
  reInstateSamples(getSampleUids()).finally(() => unCheckAll());

const receiveSamples_ = async () =>
  receiveSamples(getSampleUids()).finally(() => unCheckAll());

const publishReports_ = async () => {
  const samples = getSampleUids().map((uid) => ({ uid, action: "publish" }));
  await publishSamples(samples).finally(() => unCheckAll());
};

const printReports_ = async () =>
  await printSamples(getSampleUids()).finally(() => unCheckAll());

const impressDownload_ = async () =>
  await downloadSamplesImpress(getSampleUids()).finally(() => unCheckAll());

const prepareRejections = async () => {
  const selection = getSamplesChecked();
  router.push({ name: "reject-samples", state: { samples: JSON.stringify(selection) } });
};
const prepareStorages = async () => {
  const selection = getSamplesChecked();
  router.push({ name: "store-samples", state: { samples: JSON.stringify(selection) } });
};
const recoverSamples_ = async () =>
  recoverSamples(getSampleUids()).finally(() => unCheckAll());
</script>

<template>
  <div class="mb-4 flex justify-end">
    <router-link
      v-show="shield.hasRights(shield.actions.CREATE, shield.objects.SAMPLE)"
      to="/patients/search"
      class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
      >Add Laboratory Request</router-link
    >
  </div>
  <hr />
  <DataTable
    :columns="tableColumns"
    :data="samples"
    :toggleColumns="true"
    :loading="fetchingSamples"
    :paginable="true"
    :pageMeta="{
      fetchCount: sampleParams.first,
      hasNextPage: samplePageInfo?.hasNextPage,
      countNone,
    }"
    :searchable="true"
    :filterable="true"
    :filterMeta="{
      defaultFilter: sampleParams.status,
      filters: filterOptions,
    }"
    :selectable="true"
    :allChecked="allChecked"
    @onSearch="filterSamples"
    @onPaginate="showMoreSamples"
    @onCheck="toggleCheck"
    @onCheckAll="toggleCheckAll"
  >
    <template v-slot:footer>
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
            state.can_store
          "
          @click.prevent="prepareStorages()"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Store
        </button>
        <button
          v-show="
            shield.hasRights(shield.actions.CANCEL, shield.objects.SAMPLE) &&
            state.can_recover
          "
          @click.prevent="recoverSamples_()"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Recover
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
          @click.prevent="cloneSamples_()"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Copy to New
        </button>
        <button
          v-show="
            shield.hasRights(shield.actions.CANCEL, shield.objects.SAMPLE) &&
            state.can_download
          "
          @click.prevent="impressDownload_()"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Download
        </button>
        <button
          v-show="
            shield.hasRights(shield.actions.CANCEL, shield.objects.SAMPLE) &&
            state.can_publish
          "
          @click.prevent="publishReports_()"
          class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >
          Publish
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
    </template>
  </DataTable>
</template>
