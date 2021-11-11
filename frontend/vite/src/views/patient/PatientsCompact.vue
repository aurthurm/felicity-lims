<template>
  <div class="">
    <div class="flex justify-between">
      <div class="flex items-center content-between">
        <!-- <h1 class="h1 my-4 font-bold text-dark-700">Listing</h1> -->
        <router-link  to="/patients/search"
          class="px-4 my-2 p-1 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100">
          Add Patient</router-link>
        <input
          class="w-64 ml-6 pl-4 pr-2 py-1 text-sm text-gray-700 placeholder-gray-600 border-1 border-gray-400 rounded-md  focus:placeholder-gray-500 focus:border-green-100 focus:outline-none focus:shadow-outline-purple form-input"
          type="text" placeholder="Search ..." aria-label="Search"
          @keyup="searchPatients($event)"
          @focus="setPatientToNull()"
        />
      </div>
      <button
        @click.prevent="patientFormManager(true)"
          class="px-4 my-2 p-1 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100">
          Quick Registration</button>
    </div>

    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-4 h-screen overflow-y-scroll overscroll-contain patient-scroll">
        <a
          v-for="pt in patients"
          :key="pt.patientId"
          href="#"
          @click.prevent.stop="selectPatient(pt)"
          :class="[
            'bg-white w-full flex items-center p-1 mb-1 rounded-xl shadow border',
            { 'border-green-500 bg-green-100': pt.uid === patientForm.uid },
          ]"
        >
          <div class="flex-grow p-1">
            <div class="font-semibold text-gray-700 flex justify-between">
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
            <span class="block h-4 w-4 bg-green-400 rounded-full bottom-0 right-0"></span>
          </div>
        </a>
      </section>

      <section class="col-span-8" v-if="isPatientSelected()">
        <!-- Question Listing Item Card -->
        <div
          class="bg-white rounded-lg shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4"
        >
          <div class="grid grid-cols-12 gap-3">
            <!-- Meta Column -->
            <div class="sm:col-span-2 text-center hidden sm:block">
              <div class="inline-block font-md text-medium mb-2">{{ patientForm.patientId }}</div>
              <!-- Age -->
              <div
                class="grid grid-rows-2 mx-auto mb-1 py-1 w-4/5 2lg:w-3/5 rounded-md bg-green-400"
              >
                <div class="inline-block font-medium text-2xl text-white">{{ patientForm.age }}</div>
                <div class="inline-block font-medium text-white text-sm lg:text-md">Yrs Old</div>
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
                    @click="patientFormManager(false)"
                    class="ml-4 inline-flex items-center justify-center w-8 h-8 mr-2 border-blue-500 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      ></path>
                    </svg>
                  </button>
                  <router-link :to="{ name: 'patient-detail', params: { patientUid: patientForm.uid } }" 
                  class="p-1 ml-2 border-white border text-gray-500 rounded transition duration-300 hover:border-blue-500 hover:text-blue-500 focus:outline-none">... more</router-link>
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
                    <span class="text-gray-800 text-sm font-medium w-16">Client Patient ID</span>
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
   
        <tab-samples v-if="currentTab === 'samples'" target="patient-samples" :targetUid="patientForm.uid" />
        <tab-cases v-if="currentTab === 'cases'" />
        <tab-logs v-if="currentTab === 'logs'"/>

      </section>
    </div>
  </div>

  <!-- Patient Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-3/6'">
    <template v-slot:header>
      <h3>Patient Form</h3>
    </template>

    <template v-slot:body>
     <form action="post" class="border-2 border-gray-900 border-dotted rounded p-4" autocomplete="off">

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Patient Unique Identifier</span>
            <input class="form-input mt-1 block w-full" v-model="patientForm.clientPatientId" placeholder="Patient Unique Identifier" />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">First Name</span>
            <input class="form-input mt-1 w-full" v-model="patientForm.firstName" placeholder="First Name" />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Middle Name</span>
            <input class="form-input mt-1 w-full" v-model="patientForm.middleName" placeholder="Middle Name" />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Last Name</span>
            <input class="form-input mt-1 w-full" v-model="patientForm.lastName" placeholder="Last Name" />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Age</span>
            <input class="form-input mt-1 w-full" type="number" v-model="patientForm.age" placeholder="Age" />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Date of Birth</span>
            <input class="form-input mt-1 w-full" type="date" v-model="patientForm.dateOfBirth" placeholder="Date of Birth" />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-3/12">Age/DOB Estimated?</span>
            <input type="checkbox" class="form-checkbox text-green-500" v-model="patientForm.ageDobEstimated" />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full" >
            <span class="text-gray-700 w-4/12">Gender</span>
            <select class="form-select mt-1 w-full" v-model="patientForm.gender">
              <option></option>
              <option v-for="(sex, indx) in genders" :key="sex.index" :value="indx"> {{ sex }}</option>
            </select>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full" >
            <span class="text-gray-700 w-4/12">Mobile Number</span>
            <input class="form-input mt-1 w-full" type="number" v-model="patientForm.phoneMobile" placeholder="Mobile Number" />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-3/12">Consent to SMS</span>
            <input type="checkbox" class="form-checkbox text-green-500" v-model="patientForm.consentSms" />
          </label>

          <!-- other identifiers: passport, client pid, national id -->
          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Primary Referrer</span>
            <select class="form-select mt-1 w-full" v-model="patientForm.clientUid">
                <option></option>
                <option v-for="client in clients" :key="client.uid" :value="client.uid"> {{ client.name }} {{ client.uid }}</option>
              </select>
          </label>

          <div class="grid grid-cols-3 gap-x-4 mb-4">
            <label class="flex items-center whitespace-nowrap col-span-1 mb-2 w-full">
              <span class="text-gray-700 w-4/12">Country</span>
              <select class="form-select mt-1 w-full" v-model="countryUid" @change="getProvinces($event)">
                <option></option>
                <option v-for="country in countries" :key="country.uid" :value="country.uid"> {{ country.name }} {{ country.uid }}</option>
              </select>
            </label>
            <label class="flex items-center whitespace-nowrap col-span-1 mb-2 w-full">
              <span class="text-gray-700 w-4/12">Province</span>
              <select class="form-select mt-1 w-full" v-model="provinceUid" @change="getDistricts($event)">
                <option></option>
                <option v-for="province in provinces" :key="province.uid" :value="province.uid"> {{ province.name }} {{ province.uid }}</option>
              </select>
            </label>
            <label class="flex items-center whitespace-nowrap col-span-1 mb-2 w-full">
              <span class="text-gray-700 w-4/12">District</span>
              <select class="form-select mt-1 w-full" v-model="patientForm.districtUid">
                <option></option>
                <option v-for="district in districts" :key="district.uid" :value="district.uid"> {{ district.name }} {{ district.uid }}</option>
              </select>
            </label>
          </div>

          <hr />
          <button
            type="button"
            @click.prevent="savePatientForm()"
            class="-mb-4 w-1/5 border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
          >
            Save Patient
          </button>
        </form>
    </template>
  </modal>
</template>

<style lang="postcss" scoped>
.patient-scroll {
  /* min-height: calc(100vh - 250px); */
  min-height: 100%;
}

.tab-active {
  border-bottom: 2px solid rgb(194, 193, 193);
  color: rgb(37, 37, 37) !important;
}
</style>

<script lang="ts">
import { useMutation } from '@urql/vue';
import { defineComponent, ref, reactive, computed } from 'vue';
import { mapGetters, useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useQuery } from '@urql/vue';
import tabSamples from '../components/AnalyisRequestListing.vue';
import tabCases from './comps/CaseTable.vue';
import tabLogs from '../components/AuditLog.vue';
import modal from '../../components/SimpleModal.vue';
import { IPatient } from '../../models/patient';
import { GET_ALL_PATIENTS, SEARCH_PATIENTS } from '../../graphql/patient.queries';
import {  GET_ALL_CLIENTS } from '../../graphql/clients.queries';
import {
  GET_ALL_COUNTRIES,
  FILTER_PROVINCES_BY_COUNTRY,
  FILTER_DISTRICTS_BY_PROVINCE,
} from '../../graphql/admin.queries';
import { ADD_PATIENT } from '../../graphql/patient.mutations';

export const IPatient = typeof Patient;

import { ActionTypes } from '../../store/modules/patient';
import { ActionTypes as ClientActionTypes } from '../../store/modules/client';
import { ActionTypes as AdminActionTypes } from '../../store/modules/admin';

export default defineComponent({
  name: 'patient-search',
  components: {
    tabSamples,
    tabCases,
    tabLogs,
    modal,
  },
  setup(context) {
    let store = useStore();
    let router = useRouter();

    const nullPatient = {};
    let createAction = ref(true);
    let showModal = ref(false);

    let currentTab = ref('samples');
    const tabs = ['samples', 'cases', 'logs'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);

    let patientForm = reactive({ ...nullPatient });

    let provinces = ref([]);
    let districts = ref([]);

    let countryUid = ref(null);
    let provinceUid = ref(null);
    let patientParams = reactive({ 
      first: 25, 
      after: "",
      text: "", 
      sortBy: ["-uid"],
      filterAction: false
    });


    const genders = ["Male", "Female", "Missing", "Trans Gender"]

    store.dispatch(AdminActionTypes.FETCH_COUNTRIES);    
    store.dispatch(ActionTypes.FETCH_PATIENTS, patientParams);

    let clientParams = reactive({ 
      first: undefined, 
      after: "",
      text: "", 
      sortBy: ["name"]
    });
    store.dispatch(ClientActionTypes.FETCH_CLIENTS, clientParams);

    const { executeMutation: createPatient } = useMutation(ADD_PATIENT);

    const provincesfilter = useQuery({
      query: FILTER_PROVINCES_BY_COUNTRY,
      variables: { uid: countryUid },
      pause: computed(() => countryUid !== null), // not working
      requestPolicy: 'network-only',
    });

    const districtsfilter = useQuery({
      query: FILTER_DISTRICTS_BY_PROVINCE,
      variables: { uid: provinceUid },
      pause: computed(() => provinceUid !== null), // not working
      requestPolicy: 'network-only',
    });

    function addPatient() {
      createPatient({ clientPatientId: patientForm.clientPatientId, firstName: patientForm.firstName,
        middleName: patientForm.middleName, lastName: patientForm.lastName, age: patientForm.age,
        gender: patientForm.gender, dateOfBirth: patientForm.dateOfBirth, ageDobEstimated: patientForm.ageDobEstimated,
        clientUid: patientForm.clientUid, phoneMobile: patientForm.phoneMobile, consentSms: patientForm.consentSms, 
      }).then(result => store.dispatch(ActionTypes.ADD_PATIENT, result));
    }

    function getProvinces(event) {
      provincesfilter.executeQuery({requestPolicy: 'network-only'}).then(result => {
        provinces.value = result.data.value?.provincesByCountryUid;
      });
    }

    function getDistricts(event) {
      districtsfilter.executeQuery({requestPolicy: 'network-only'}).then(result => {
        districts.value = result.data.value?.districtsByProvinceUid;
      });
    }

    function searchPatients(event) {
      patientParams.first = 100;
      patientParams.after = null;
      patientParams.text = event.target.value;
      patientParams.filterAction = true;
      // store.dispatch(ActionTypes.SEARCH_PATIENTS, event.target.value);
      store.dispatch(ActionTypes.FETCH_PATIENTS, patientParams);
    }

    function isPatientSelected() {
      return patientForm.patientId !== undefined;
    }

    let getPatientFullName = (pt) => {
      return pt.firstName + ' ' + pt.lastName;
    };

    let getGender = pos => genders[pos];

    let selectPatient = (pt) => {
      Object.assign(patientForm, { ...pt });
    };

    let setPatientToNull = () => {
      Object.assign(patientForm, { ...nullPatient });
    };

    function patientFormManager(create) {
      showModal.value = true;
      createAction.value = create;
      if (create) setPatientToNull();
    }

    function savePatientForm() {
       if (createAction.value) addPatient();
       showModal.value = false;
    }

    return {
      showModal,
      tabs,
      currentTab,
      currentTabComponent,
      patientForm,
      getPatientFullName,
      patients: computed(() => store.getters.getPatients),
      isPatientSelected,
      selectPatient,
      setPatientToNull,
      patientFormManager,
      savePatientForm,
      countries: computed(() => store.getters.getCountries),
      clients: computed(() => store.getters.getClients),
      countryUid,
      provinces,
      provinceUid,
      districts,
      getProvinces,
      getDistricts,
      genders,
      getGender,
      searchPatients,
    };
  },
});
</script>
