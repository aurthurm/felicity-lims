<script setup lang="ts">
import LoadingMessage from "../../components/Spinners/LoadingMessage.vue";
import PageHeading from "../components/PageHeading.vue";
import { ref, reactive, computed } from "vue";
import { storeToRefs } from "pinia";
import tabSamples from "../components/AnalyisRequestListing.vue";
import tabCases from "./comps/CaseTable.vue";
import tabLogs from "../components/AuditLog.vue";
import modal from "../../components/SimpleModal.vue";
import PatientForm from "./PatientForm.vue";
import PatientInfo from "./PatientInfo.vue";

import { useLocationStore, usePatientStore } from "../../stores";
import { IPatient } from "../../models/patient";

import * as shield from "../../guards";

let patientStore = usePatientStore();
let locationStore = useLocationStore();

const { patients, fetchingPatients } = storeToRefs(patientStore);

let showModal = ref<boolean>(false);
let currentTab = ref<string>("samples");
const tabs: string[] = ["samples", "cases", "logs"];

let patientForm = ref({} as IPatient);

let patientParams = reactive({
  first: 25,
  before: "",
  text: "",
  sortBy: ["-uid"],
  filterAction: false,
});

const genders: string[] = ["Male", "Female", "Missing", "Trans Gender"];

locationStore.fetchCountries();
patientStore.fetchPatients(patientParams);

function searchPatients(event: any) {
  patientParams.first = 100;
  patientParams.before = "";
  patientParams.text = event.target.value;
  patientParams.filterAction = true;
  patientStore.fetchPatients(patientParams);
}

const isPatientSelected = computed(() => Object.keys(patientForm?.value)?.length > 0)

let getPatientFullName = (pt: IPatient) => {
  return pt.firstName + " " + pt.lastName;
};

let getGender = (pos: any) => genders[pos];

let selectPatient = (pt: IPatient) => {
  patientForm.value = pt;
  patientStore.setPatient(pt);
};

let setPatientToNull = () => {
  patientForm.value = {} as IPatient;
  patientStore.resetPatient();
};

const quickRegistration = async () => {
  setPatientToNull()
  showModal.value = true;
};

const updatePatient = (patient: IPatient) => {
  selectPatient(patient);
  showModal.value = false;
};

</script>

<style lang="css" scoped>
.patient-scroll {
  /* min-height: calc(100vh - 250px); */
  min-height: 100%;
}
</style>

<template>
  <PageHeading title="Patients Quick View" />
  <div class="">
    <div class="flex justify-between">
      <div class="flex items-center content-between">
        <!-- <h1 class="h1 my-4 font-bold text-dark-700">Listing</h1> -->
        <router-link v-show="shield.hasRights(shield.actions.CREATE, shield.objects.PATIENT)" to="/patients/search"
          class="px-4 my-2 p-1 text-sm border-sky-800 border text-dark-800 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100">
          Add Patient</router-link>
        <input
          class="w-64 ml-6 pl-4 pr-2 py-1 text-sm text-gray-800 placeholder-gray-400 border-1 border-gray-400 rounded-sm focus:placeholder-gray-500 focus:border-sky-800 focus:outline-none focus:shadow-outline-purple form-input"
          type="text" placeholder="Search ..." aria-label="Search" @keyup="searchPatients($event)"
          @focus="setPatientToNull()" />
      </div>
      <button v-show="shield.hasRights(shield.actions.CREATE, shield.objects.PATIENT)" @click.prevent="quickRegistration"
        class="px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100">
        Quick Registration
      </button>
    </div>

    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, scale: 1 }"
        :variants="{ custom: { scale: 2 } }" :delay="400"
        class="col-span-3 h-screen overflow-y-scroll overscroll-contain patient-scroll">
        <div v-if="fetchingPatients" class="py-4 text-center bg-white w-full mb-1 rounded-sm shadow border">
          <LoadingMessage message="Fetching patients ..." />
        </div>
        <div v-else>
          <a v-for="pt in patients" :key="pt.patientId" href="#" @click="selectPatient(pt)" :class="[
            'bg-white w-full flex items-center p-1 mb-1 rounded-sm shadow border',
            { 'border-sky-800 bg-emerald-200': pt.uid === patientForm?.uid },
          ]">
            <div class="flex-grow p-1">
              <div class="font-semibold text-gray-800 flex justify-between">
                <span>{{ getPatientFullName(pt) }}</span>
                <span class="text-sm text-gray-500">{{ pt.age }} yrs, {{ getGender(pt.gender) }}</span>
              </div>
              <div class="text-sm text-gray-500 flex justify-between">
                <span>{{ pt.patientId }}</span>
                <span>{{ pt.clientPatientId }}</span>
              </div>
              <div class="text-sm text-gray-500 flex justify-between">
                <span>{{ pt?.client?.district?.province?.name }}</span>
                <span>{{ pt?.client?.name }}</span>
              </div>
            </div>
            <div class="p-2">
              <!-- <span class="block h-4 w-4 bg-sky-800 rounded-full bottom-0 right-0"></span> -->
            </div>
          </a>
        </div>
      </section>

      <section v-if="isPatientSelected" v-motion :initial="{ opacity: 0, y: -100 }"
        :enter="{ opacity: 1, y: 0, scale: 1 }" :variants="{ custom: { scale: 2 } }" :delay="400" class="col-span-9">
        <!-- PatientInfo -->

        <PatientInfo @editPatient="() => (showModal = true)" />

        <!-- Sample and Case Data -->
        <nav class="bg-white shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a v-for="tab in tabs" :key="tab" :class="[
              'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 px-4 tab hover:bg-sky-600 hover:text-gray-200 hover:bg-sky-600 hover:text-gray-200',
              { 'tab-active': currentTab === tab },
            ]" @click="currentTab = tab" href="#">
              {{ tab }}
            </a>
          </div>
        </nav>

        <tab-samples v-if="currentTab === 'samples'" target="patient-samples" :targetUid="patientForm.uid" />
        <tab-cases v-if="currentTab === 'cases'" />
        <tab-logs v-if="currentTab === 'logs'" targetType="patient" :targetId="patientForm?.uid" />
      </section>
    </div>

    <!-- Patient Edit Form Modal -->
    <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-3/6'">
      <template v-slot:header>
        <h3>Patient Form</h3>
      </template>

      <template v-slot:body>
        <PatientForm :patient="patientForm" :navigate="false" @close="updatePatient" />
      </template>
    </modal>
  </div>
</template>
