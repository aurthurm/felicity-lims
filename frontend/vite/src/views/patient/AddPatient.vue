<template>
  <section class="w-2/3">
    <h1 class="h1 my-4 font-bold text-dark-700">Add New Patient:</h1>
    <form action="post" class="border-2 border-gray-900 border-dotted rounded p-4" autocomplete="yebo">
          <label class="block mb-2 w-1/3">
            <span class="text-gray-700">Patient Unique Identifier</span>
            <input class="form-input mt-1 block w-full" v-model="patientForm.clientPatientId" placeholder="Patient Unique Identifier" />
          </label>
          <div class="flex justify-between">
            <label class="block mb-2 w-full">
              <span class="text-gray-700">First Name</span>
              <input class="form-input mt-1 block w-full" v-model="patientForm.firstName" placeholder="First Name" />
            </label>
            <label class="block mb-2 w-full mx-2">
              <span class="text-gray-700">Middle Name</span>
              <input class="form-input mt-1 block w-full" v-model="patientForm.middleName" placeholder="Middle Name" />
            </label>
            <label class="block mb-2 w-full">
              <span class="text-gray-700">Last Name</span>
              <input class="form-input mt-1 block w-full" v-model="patientForm.lastName" placeholder="Last Name" />
            </label>
          </div>

          <div class="flex justify-between">
            <label class="block mb-2 w-full">
              <span class="text-gray-700">Age</span>
              <input class="form-input mt-1 block w-full" type="number" v-model="patientForm.age" placeholder="Age" />
            </label>
            <label class="block mb-2 mx-2 w-full">
              <span class="text-gray-700">Date of Birth</span>
              <input class="form-input mt-1 block w-full" type="date" v-model="patientForm.dateOfBirth" placeholder="Date of Birth" />
            </label>
            <label class="inline-flex items-center -mb-6 w-full">
              <input type="checkbox" class="form-checkbox text-green-500 mx-4" v-model="patientForm.ageDobEstimated" />
              <span class="ml-2">Age/DOB Estimated?</span>
            </label>
          </div>

          <div class="flex justify-between">
            <label class="block mb-2 w-full" >
              <span class="text-gray-700">Gender</span>
              <select class="form-select block w-full mt-1" v-model="patientForm.gender">
                <option></option>
                <option v-for="(sex, indx) in genders" :key="sex.index" :value="indx"> {{ sex }}</option>
              </select>
            </label>
            <label class="block  mx-2 mb-2 w-full" >
              <span class="text-gray-700">Mobile Number</span>
              <input class="form-input mt-1 block w-full" type="number" v-model="patientForm.phoneMobile" placeholder="Mobile Number" />
            </label>
            <label class="inline-flex items-center -mb-6 w-full">
              <input type="checkbox" class="form-checkbox text-green-500 mx-4" v-model="patientForm.consentSms" />
              <span class="ml-2">Consent to SMS</span>
            </label>
          </div>

          <!-- other identifiers: passport, client pid, national id -->
          <label class="block mb-2 w-full">
            <span class="text-gray-700">Primary Referrer</span>
            <select class="form-select block w-full mt-1" v-model="patientForm.clientUid">
                <option></option>
                <option v-for="client in clients" :key="client.uid" :value="client.uid"> {{ client.name }} {{ client.uid }}</option>
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
              <select class="form-select block w-full mt-1" v-model="patientForm.districtUid">
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
    </section>
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
import { useRouter, useRoute } from 'vue-router';
import { useQuery } from '@urql/vue';
import tabSamples from '../components/AnalyisRequestListing.vue';
import tabCases from './comps/CaseTable.vue';
import tabLogs from '../components/AuditLog.vue';
import modal from '../../components/SimpleModal.vue';
import { Patient } from '../../store/modules/patients';
import { GET_ALL_PATIENTS, SEARCH_PATIENTS } from '../../graphql/patient.queries';
import {  GET_ALL_CLIENTS } from '../../graphql/clients.queries';
import {
  GET_ALL_COUNTRIES,
  FILTER_PROVINCES_BY_COUNTRY,
  FILTER_DISTRICTS_BY_PROVINCE,
} from '../../graphql/admin.queries';
import { ADD_PATIENT } from '../../graphql/patient.mutations';

export const IPatient = typeof Patient;

import { ActionTypes } from '../../store/modules/patients';
import { ActionTypes as ClientActionTypes } from '../../store/modules/clients';
import { ActionTypes as AdminActionTypes } from '../../store/modules/admin';

export default defineComponent({
  name: 'add-patient',
  components: {
    tabSamples,
    tabCases,
    tabLogs,
    modal,
  },
  setup(context) {
    let store = useStore();
    let router = useRouter();
    let route = useRoute();

    const nullPatient = new Patient();
    let createAction = ref(true);
    let showModal = ref(false);

    let currentTab = ref('samples');
    const tabs = ['samples', 'cases', 'logs'];
    let currentTabComponent = computed(() => 'tab-' + currentTab.value);

    let patientForm = reactive({ ...nullPatient });
    patientForm.clientPatientId = route.query.cpid;

    let provinces = ref([]);
    let districts = ref([]);

    let countryUid = ref(null);
    let provinceUid = ref(null);

    const genders = ["Male", "Female", "Missing", "Trans Gender"]

    store.dispatch(AdminActionTypes.FETCH_COUNTRIES);    
    store.dispatch(ActionTypes.FETCH_PATIENTS);
    store.dispatch(ClientActionTypes.FETCH_CLIENTS);

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
      }).then(result => {
        store.dispatch(ActionTypes.ADD_PATIENT, result);
        console.log(result);
        router.push({ name: "patient-detail", params: { patientUid: result?.data?.createPatient?.patient?.uid }});
      });
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
      store.dispatch(ActionTypes.SEARCH_PATIENTS, event.target.value);
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
