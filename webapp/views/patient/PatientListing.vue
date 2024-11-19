<script setup lang="ts">
import { ref, reactive, computed, h, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { usePatientStore, useLocationStore } from "@/stores";
import { IPatient } from "@/models/patient";
import * as shield from "@/guards";

const DataTable = defineAsyncComponent(
  () => import("@/components/ui/datatable/FelDataTable.vue")
)
const PageHeading = defineAsyncComponent(
  () => import("@/components/common/FelPageHeading.vue")
)

let patientStore = usePatientStore();

const { patients, fetchingPatients, patientPageInfo } = storeToRefs(patientStore);

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
    name: "Patient Id",
    value: "patientId",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (patient, _) {
      return h(RouterLink, {
        to: {
          name: "patient-detail",
          params: {
            patientUid: patient?.uid,
          },
        },
        innerHTML: patient?.patientId,
      });
    },
  },
  {
    name: "Full Name",
    value: "",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (patient, _) {
      return h(RouterLink, {
        to: {
          name: "patient-detail",
          params: {
            patientUid: patient?.uid,
          },
        },
        innerHTML: getPatientFullName(patient),
      });
    },
  },
  {
    name: "Age",
    value: "age",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Gender",
    value: "gender",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Client Patient ID",
    value: "clientPatientId",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Province",
    value: "client.district.province.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "District",
    value: "client.district.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Client",
    value: "client.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "",
    value: "",
    sortable: false,
    sortBy: "asc",
    showInToggler: false,
    hidden: false,
    customRender: function (patient, _) {
      return h(RouterLink, {
        to: {
          name: "samples-add",
          params: {
            patientUid: patient?.uid,
          },
        },
        class:
          "px-2 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none",
        innerHTML: "+ Analysis Request",
      });
    },
  },
]);

let patientParams = reactive({
  first: 50,
  before: "",
  text: "",
  sortBy: ["-uid"],
  filterAction: false,
});
patientStore.fetchPatients(patientParams);

let patientSearch = ref<string>("");
function searchPatients(opts: any): void {
  patientParams.first = 100;
  patientParams.before = patientPageInfo?.value?.endCursor ?? "";
  patientParams.text = opts.filterText;
  patientParams.filterAction = true;
  patientSearch.value = opts.filterText;
  patientStore.fetchPatients(patientParams);
}

const countNone = computed(
  () => patients?.value?.length + " of " + patientStore.getPatientCount + " patients"
);

function showMorePatients(opts: any): void {
  patientParams.first = opts.fetchCount;
  patientParams.before = patientPageInfo?.value?.endCursor ?? "";
  patientParams.text = opts.filterText;
  patientParams.filterAction = false;
  patientStore.fetchPatients(patientParams);
}

let getPatientFullName = (pt: IPatient) => {
  return pt.firstName + " " + pt.lastName;
};
</script>

<style lang="postcss" scoped></style>

<template>
  <PageHeading title="Patients" />
  <DataTable :columns="tableColumns" :data="patients" :toggleColumns="true" :loading="fetchingPatients" :paginable="true"
    :pageMeta="{
      fetchCount: patientParams.first,
      hasNextPage: patientPageInfo?.hasNextPage,
      countNone,
    }" :searchable="true" :filterable="false" @onSearch="searchPatients" @onPaginate="showMorePatients"
    :selectable="false">
    <template v-slot:footer>
      <div>
        <div class="flex content-start items-center">
          <span class="text-sky-800"><i class="fas fa-info-circle"></i></span>
          <p class="ml-2 italic text-orange-600">
            Click register when you dont find your patient during search*
          </p>
        </div>
        <hr class="my-2" />

        <router-link v-show="shield.hasRights(shield.actions.CREATE, shield.objects.PATIENT)"
          :to="{ name: 'patients-register', query: { cpid: patientSearch } }"
          class="px-4 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100">
          Register New Patiet
        </router-link>
      </div>
    </template>
  </DataTable>
</template>
