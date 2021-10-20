<template>
  <div class="">
    <div class="bg-white rounded-lg shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4" >
      <div class="grid grid-cols-12 gap-3">
        <!-- Meta Column -->
        <div class="sm:col-span-2 text-center hidden sm:block">
          <div class="inline-block font-md text-medium mb-2">{{ patient?.patientId }}</div>
          <!-- Age -->
          <div
            class="grid grid-rows-2 mx-auto mb-1 py-1 w-4/5 2lg:w-3/5 rounded-md bg-green-400"
          >
            <div class="inline-block font-medium text-2xl text-white">{{ patient?.age }}</div>
            <div class="inline-block font-medium text-white text-sm lg:text-md">Yrs Old</div>
          </div>
        </div>
        <!-- Summary Column -->
        <div class="col-span-12 sm:col-start-3 sm:col-end-13 px-3 sm:px-0">
          <div
            class="flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold"
          >
            <span>{{ patient?.firstName }} {{ patient?.lasstName }}</span>
            <div>
              <span class="font-medium text-md">{{ patient?.dateOfBirth }}</span>
              <button
                @click="showModal = true"
                class="ml-4 inline-flex items-center justify-center w-8 h-8 mr-2 border-blue-500 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"
              >
                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <hr />
          <div class="grid grid-cols-2 mt-2">
            <div class="col-span-1">
              <!-- Client Details -->
              <div class="flex">
                <span class="text-gray-800 text-sm font-medium w-16">Client</span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  patient?.client?.name
                }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-sm font-medium w-16">District:</span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  patient?.client?.district?.name
                }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-800 text-sm font-medium w-16">Province: </span>
                <span class="text-gray-600 text-sm md:text-md">{{
                  patient?.client?.district?.province?.name
                }}</span>
              </div>
            </div>
            <div class="col-span-1">
              <!-- Identifiers -->
              <div class="col-span-2 flex mt-2">
                <span class="text-gray-800 text-sm font-medium">Client Patient ID: </span>
                <span class="text-gray-600 text-sm md:text-md"> {{
                  patient?.clientPatientId
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <router-view  />                    



    

  </div>

    <!-- Patient Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>Patient Form</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <label class="block mb-2">
          <span class="text-gray-700">Patient Unique Identifier</span>
          <input class="form-input mt-1 block w-full" v-model="patient.clientPatientId" placeholder="Patient Unique Identifier" />
        </label>
        <div class="flex justify-between">
          <label class="block mb-2 w-full">
            <span class="text-gray-700">First Name</span>
            <input class="form-input mt-1 block w-full" v-model="patient.firstName" placeholder="First Name" />
          </label>
          <label class="block mb-2 w-full mx-2">
            <span class="text-gray-700">Middle Name</span>
            <input class="form-input mt-1 block w-full" v-model="patient.middleName" placeholder="Middle Name" />
          </label>
          <label class="block mb-2 w-full">
            <span class="text-gray-700">Last Name</span>
            <input class="form-input mt-1 block w-full" v-model="patient.lastName" placeholder="Last Name" />
          </label>
        </div>

        <div class="flex justify-between">
          <label class="block mb-2 w-full">
            <span class="text-gray-700">Age</span>
            <input class="form-input mt-1 block w-full" type="number" v-model="patient.age" placeholder="Age" />
          </label>
          <label class="block mb-2 mx-2 w-full">
            <span class="text-gray-700">Date of Birth</span>
            <input class="form-input mt-1 block w-full" type="date" v-model="patient.dateOfBirth" placeholder="Date of Birth" />
          </label>
          <label class="inline-flex items-center -mb-6 w-full">
            <input type="checkbox" class="form-checkbox text-green-500 mx-4" v-model="patient.ageDobEstimated" />
            <span class="ml-2">Age/DOB Estimated?</span>
          </label>
        </div>

        <div class="flex justify-between">
          <label class="block mb-2 w-full" >
            <span class="text-gray-700">Gender</span>
            <select class="form-select block w-full mt-1" v-model="patient.gender">
               <option></option>
              <option v-for="(sex, indx) in genders" :key="sex.index" :value="indx"> {{ sex }}</option>
            </select>
          </label>
          <label class="block mb-2 w-full" >
            <span class="text-gray-700">Mobile Number</span>
            <input class="form-input mt-1 block w-full" type="number" v-model="patient.phoneMobile" placeholder="Mobile Number" />
          </label>
          <label class="inline-flex items-center -mb-6 w-full">
            <input type="checkbox" class="form-checkbox text-green-500 mx-4" v-model="patient.consentSms" />
            <span class="ml-2">Consent to SMS</span>
          </label>
        </div>

        <!-- other identifiers: passport, client pid, national id -->
        <label class="block mb-2 w-full">
          <span class="text-gray-700">Primary Referrer</span>
          <select class="form-select block w-full mt-1" v-model="patient.clientUid">
              <option></option>
              <option v-for="client in clients?.clientAll?.edges" :key="client.node.uid" :value="client.node.uid"> {{ client.node.name }} {{ client.node.uid }}</option>
            </select>
        </label>

        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2 w-full">
            <span class="text-gray-700">Country</span>
            <select class="form-select block w-full mt-1" v-model="countryUid" @change="getProvinces($event)">
              <option></option>
              <option v-for="country in countries" :key="country.uid" :value="country.uid"> {{ country.name }} {{ country.uid }}</option>
            </select>
          </label>
          <label class="block col-span-1 mb-2 w-full">
            <span class="text-gray-700">Province</span>
            <select class="form-select block w-full mt-1" v-model="provinceUid" @change="getDistricts($event)">
               <option></option>
              <option v-for="province in provinces" :key="province.uid" :value="province.uid"> {{ province.name }} {{ province.uid }}</option>
            </select>
          </label>
          <label class="block col-span-1 mb-2 w-full">
            <span class="text-gray-700">District</span>
            <select class="form-select block w-full mt-1" v-model="patient.districtUid">
               <option></option>
              <option v-for="district in districts" :key="district.uid" :value="district.uid"> {{ district.name }} {{ district.uid }}</option>
            </select>
          </label>
        </div>

        <hr />
        <button
          type="button"
          @click.prevent="updatePatient()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Patient
        </button>
      </form>
    </template>
  </modal>

</template>

<script lang="ts">
import modal from '../../../components/SimpleModal.vue';

import { useMutation, useQuery } from '@urql/vue';
import { defineComponent, ref, toRefs, reactive, computed, onMounted, PropType } from 'vue';
import { useRoute } from 'vue-router';
import { mapGetters, useStore } from 'vuex';

import { Patient, IPatient } from '../../../store/modules/patients';
import { GET_ALL_PATIENTS, SEARCH_PATIENTS } from '../../../graphql/patient.queries';
import {  GET_ALL_CLIENTS } from '../../../graphql/clients.queries';
import {
  GET_ALL_COUNTRIES,
  FILTER_PROVINCES_BY_COUNTRY,
  FILTER_DISTRICTS_BY_PROVINCE,
} from '../../../graphql/admin.queries';
import { ADD_PATIENT } from '../../../graphql/patient.mutations';

import { ActionTypes } from '../../../store/modules/patients';
import { ActionTypes as AdminActionTypes } from '../../../store/modules/admin';

export default defineComponent({
  name: "patient-single",
  components: {
    modal,
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    let showModal = ref(false);    
  
    let countryUid = ref(null);
    let provinceUid = ref(null);    
    let provinces = ref([]);
    let districts = ref([]);

    const genders = ["Male", "Female", "Missing", "Trans Gender"]
    let getGender = pos => genders[pos];

    store.dispatch(ActionTypes.FETCH_PATIENT_BY_UID, +route.params.patientUid)
    let patient = computed(() => store.getters.getPatient);

    store.dispatch(AdminActionTypes.FETCH_COUNTRIES);

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

    const { data: clients, fetching: CFetching, error: CError } = useQuery({
      query: GET_ALL_CLIENTS,
    });

    function updatePatient() {
      // editPatient();
      showModal.value = false;
    }

    return { 
      showModal,
      genders,
      patient,
      updatePatient,
      clients,
      countries: computed(() => store.getters.getCountries),
      countryUid,
      getProvinces,
      provinces,
      provinceUid,
      getDistricts,
      districts,
    };
  },
});
</script>