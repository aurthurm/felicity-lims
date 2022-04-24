<script setup lang="ts">
import LoadingMessage from "../../components/Spinners/LoadingMessage.vue";
import { ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import tabSamples from "../components/AnalyisRequestListing.vue";
import tabCases from "./comps/CaseTable.vue";
import tabLogs from "../components/AuditLog.vue";
import modal from "../../components/SimpleModal.vue";
import PatientForm from "./PatientForm.vue";

import { useLocationStore, usePatientStore } from "../../stores";
import { IPatient } from "../../models/patient";

import * as shield from "../../guards";

let patientStore = usePatientStore();
let locationStore = useLocationStore();

const { patients, fetchingPatients } = storeToRefs(patientStore);

let showModal = ref<boolean>(false);
let currentTab = ref<string>("samples");
const tabs: string[] = ["samples", "cases", "logs"];

let patientForm = reactive({}) as IPatient;

let patientParams = reactive({
  first: 25,
  after: "",
  text: "",
  sortBy: ["-uid"],
  filterAction: false,
});

const genders: string[] = ["Male", "Female", "Missing", "Trans Gender"];

locationStore.fetchCountries();
patientStore.fetchPatients(patientParams);

function searchPatients(event: any) {
  patientParams.first = 100;
  patientParams.after = "";
  patientParams.text = event.target.value;
  patientParams.filterAction = true;
  patientStore.fetchPatients(patientParams);
}

function isPatientSelected() {
  return patientForm.patientId !== undefined;
}

let getPatientFullName = (pt: IPatient) => {
  return pt.firstName + " " + pt.lastName;
};

let getGender = (pos: any) => genders[pos];

let selectPatient = (pt: IPatient) => {
  Object.assign(patientForm, pt);
};

let setPatientToNull = () => {
  Object.assign(patientForm, {});
};

const quickRegistration = () => {
  setPatientToNull();
  showModal.value = true;
};

const updatePatient = (patient: IPatient) => {
  selectPatient(patient);
  showModal.value = false;
};
</script>

<style lang="postcss" scoped>
.patient-scroll {
  /* min-height: calc(100vh - 250px); */
  min-height: 100%;
}
</style>

<template>
  <div class="">
    <div class="flex justify-between">
      <div class="flex items-center content-between">
        <!-- <h1 class="h1 my-4 font-bold text-dark-700">Listing</h1> -->
        <router-link
          v-show="shield.hasRights(shield.actions.CREATE, shield.objects.PATIENT)"
          to="/patients/search"
          class="px-4 my-2 p-1 text-sm border-sky-800 border text-dark-800 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"
        >
          Add Patient</router-link
        >
        <input
          class="w-64 ml-6 pl-4 pr-2 py-1 text-sm text-gray-800 placeholder-gray-400 border-1 border-gray-400 rounded-sm focus:placeholder-gray-500 focus:border-sky-800 focus:outline-none focus:shadow-outline-purple form-input"
          type="text"
          placeholder="Search ..."
          aria-label="Search"
          @keyup="searchPatients($event)"
          @focus="setPatientToNull()"
        />
      </div>
      <button
        v-show="shield.hasRights(shield.actions.CREATE, shield.objects.PATIENT)"
        @click.prevent="quickRegistration"
        class="px-4 my-2 p-1 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"
      >
        Quick Registration
      </button>
    </div>

    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section
        class="col-span-4 h-screen overflow-y-scroll overscroll-contain patient-scroll"
      >
        <div
          v-if="fetchingPatients"
          class="py-4 text-center bg-white w-full mb-1 rounded-sm shadow border"
        >
          <LoadingMessage message="Fetching patients ..." />
        </div>
        <div v-else>
          <a
            v-for="pt in patients"
            :key="pt.patientId"
            href="#"
            @click.prevent.stop="selectPatient(pt)"
            :class="[
              'bg-white w-full flex items-center p-1 mb-1 rounded-sm shadow border',
              { 'border-sky-800 bg-emerald-200': pt.uid === patientForm.uid },
            ]"
          >
            <div class="flex-grow p-1">
              <div class="font-semibold text-gray-800 flex justify-between">
                <span>{{ getPatientFullName(pt) }}</span>
                <span class="text-sm text-gray-500"
                  >{{ pt.age }} yrs, {{ getGender(pt.gender) }}</span
                >
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

      <section class="col-span-8" v-if="isPatientSelected()">
        <!-- Question Listing Item Card -->
        <div
          class="bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4"
        >
          <div class="grid grid-cols-12 gap-3">
            <!-- Meta Column -->
            <div class="sm:col-span-2 text-center hidden sm:block">
              <div class="inline-block font-md text-medium mb-2">
                {{ patientForm.patientId }}
              </div>
              <!-- Age -->
              <div
                class="grid grid-rows-2 mx-auto mb-1 py-1 w-4/5 2lg:w-3/5 rounded-sm bg-sky-800"
              >
                <div class="inline-block font-medium text-2xl text-white">
                  {{ patientForm.age }}
                </div>
                <div class="inline-block font-medium text-white text-sm lg:text-md">
                  Yrs Old
                </div>
              </div>
            </div>
            <!-- Summary Column -->
            <div class="col-span-12 sm:col-start-3 sm:col-end-13 px-3 sm:px-0">
              <div
                class="flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold"
              >
                <span>{{ getPatientFullName(patientForm) }}</span>
                <div>
                  <span class="font-medium text-md">{{ patientForm.dateOfBirth }}</span>
                  <button
                    v-show="
                      shield.hasRights(shield.actions.UPDATE, shield.objects.PATIENT)
                    "
                    @click="showModal = true"
                    class="ml-4 inline-flex items-center justify-center w-8 h-8 mr-2 border-sky-800 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      ></path>
                    </svg>
                  </button>
                  <router-link
                    :to="{
                      name: 'patient-detail',
                      params: { patientUid: patientForm.uid },
                    }"
                    class="p-1 ml-2 border-white border text-gray-500rounded-smtransition duration-300 hover:border-sky-800 hover:text-sky-800 focus:outline-none"
                    >... more</router-link
                  >
                </div>
              </div>
              <hr />
              <div class="grid grid-cols-2 mt-2">
                <div class="col-span-1">
                  <!-- Client Details -->
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-16">Client</span>
                    <span class="text-gray-600 text-sm md:text-md">{{
                      patientForm?.client?.name
                    }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-16">District:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{
                      patientForm?.client?.district?.name
                    }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-16">Province:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{
                      patientForm?.client?.district?.province?.name
                    }}</span>
                  </div>
                </div>
                <div class="col-span-1">
                  <!-- Identifiers -->
                  <div class="col-span-2 flex mt-2">
                    <span class="text-gray-800 text-sm font-medium w-16"
                      >Client Patient ID</span
                    >
                    <span class="text-gray-600 text-sm md:text-md">{{
                      patientForm.clientPatientId
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sample and Case Data -->
        <nav class="bg-white px-6 pt-2 shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 mr-8 tab',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
              href="#"
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <tab-samples
          v-if="currentTab === 'samples'"
          target="patient-samples"
          :targetUid="patientForm.uid"
        />
        <tab-cases v-if="currentTab === 'cases'" />
        <tab-logs
          v-if="currentTab === 'logs'"
          targetType="patient"
          :targetId="patientForm?.uid"
        />
      </section>
    </div>
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
</template>
