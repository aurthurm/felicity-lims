<template>
  <section class="w-3/6">
    <h1 class="h1 my-4 font-bold text-dark-700">Add New Patient:</h1>
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

          <hr class="my-2">

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
import { Patient } from '../../store/modules/patients';
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
  setup(context) {
    let store = useStore();
    let router = useRouter();
    let route = useRoute();

    const nullPatient = new Patient();
    let createAction = ref(true)

    let patientForm = reactive({ ...nullPatient });
    patientForm.clientPatientId = route.query.cpid;

    let provinces = ref([]);
    let districts = ref([]);

    let countryUid = ref(null);
    let provinceUid = ref(null);

    const genders = ["Male", "Female", "Missing", "Trans Gender"]

    store.dispatch(AdminActionTypes.FETCH_COUNTRIES);  
    let clientParams = reactive({ 
      first: undefined, 
      after: "",
      text: "", 
      sortBy: ["name"],
      filterAction: false
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

    function patientFormManager(create) {
      showModal.value = true;
      createAction.value = create;
      if (create) setPatientToNull();
    }

    function savePatientForm() {
       if (createAction.value) addPatient();
    }

    return {
      patientForm,
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
    };
  },
});
</script>
