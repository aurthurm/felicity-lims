<script setup lang="ts">
import { ref, reactive, computed, h, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { usePatientStore } from "@/stores/patient";
import { useLocationStore } from "@/stores/location";
import { PatientType } from "@/types/gql";
import * as shield from "@/guards";

const DataTable = defineAsyncComponent(
  () => import("@/components/ui/datatable/FelDataTable.vue")
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
          "px-2 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none",
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

let getPatientFullName = (pt: PatientType) => {
  return pt.firstName + " " + pt.lastName;
};
</script>

<style lang="postcss" scoped></style>

<template>
  <div class="space-y-6">
    <fel-heading title="Patients" />
    <div class="rounded-lg border border-border bg-card shadow-sm p-6">
      <DataTable 
        :columns="tableColumns" 
        :data="patients" 
        :toggleColumns="true" 
        :loading="fetchingPatients" 
        :paginable="true"
        :pageMeta="{
          fetchCount: patientParams.first,
          hasNextPage: patientPageInfo?.hasNextPage,
          countNone,
        }" 
        :searchable="true" 
        :filterable="false" 
        @onSearch="searchPatients" 
        @onPaginate="showMorePatients"
        :selectable="false"
        class="bg-background rounded-lg shadow-sm"
      >
        <template v-slot:footer>
          <div class="space-y-4 p-4">
            <div class="flex justify-start items-center gap-2">
              <span class="text-primary">
                <font-awesome-icon icon="fa-info-circle"></font-awesome-icon>
              </span>
              <p class="text-sm text-muted-foreground italic">
                Click register when you dont find your patient during search*
              </p>
            </div>
            <div class="flex justify-start">
              <RouterLink 
                to="/patient/register" 
                class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Register New Patient
              </RouterLink>
            </div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>
