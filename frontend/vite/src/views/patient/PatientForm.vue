<template>
    <form 
    @submit.prevent="savePatientForm"
    class="border-2 border-gray-900 border-dotted rounded p-4" 
    autocomplete="off">

          <label class="flex whitespace-nowrap w-full">
            <span class="text-gray-700 w-4/12">Patient Unique Identifier</span>
            <input class="form-input mt-1 block w-full" v-model="patient.clientPatientId" placeholder="Patient Unique Identifier" />
          </label>
          <span class="text-red-700 w-full mb-2">{{ errors?.data?.clientPatientId }}</span>

          <label class="flex whitespace-nowrap w-full">
            <span class="text-gray-700 w-4/12">First Name</span>
            <input class="form-input mt-1 w-full" v-model="patient.firstName" placeholder="First Name" />
          </label>
          <span class="text-red-700 w-full mb-2">{{ errors?.data?.firstName }}</span>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Middle Name</span>
            <input class="form-input mt-1 w-full" v-model="patient.middleName" placeholder="Middle Name" />
          </label>

          <label class="flex whitespace-nowrap w-full">
            <span class="text-gray-700 w-4/12">Last Name</span>
            <input class="form-input mt-1 w-full" v-model="patient.lastName" placeholder="Last Name" />
          </label>
          <span class="text-red-700 w-full mb-2">{{ errors?.data?.lastName }}</span>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Age</span>
            <input class="form-input mt-1 w-full" type="number" v-model="patient.age" placeholder="Age" />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Date of Birth</span>
            <input class="form-input mt-1 w-full" type="date" v-model="patient.dateOfBirth" placeholder="Date of Birth" />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-3/12">Age/DOB Estimated?</span>
            <input type="checkbox" class="form-checkbox text-green-500" v-model="patient.ageDobEstimated" />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full" >
            <span class="text-gray-700 w-4/12">Gender</span>
            <select class="form-select mt-1 w-full" v-model="patient.gender">
              <option></option>
              <option v-for="(sex, indx) in genders" :key="indx" :value="indx"> {{ sex }}</option>
            </select>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full" >
            <span class="text-gray-700 w-4/12">Mobile Number</span>
            <input class="form-input mt-1 w-full" type="number" v-model="patient.phoneMobile" placeholder="Mobile Number" />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-3/12">Consent to SMS</span>
            <input type="checkbox" class="form-checkbox text-green-500" v-model="patient.consentSms" />
          </label>

          <!-- other identifiers: passport, client pid, national id -->
          <label class="flex whitespace-nowrap w-full">
            <span class="text-gray-700 w-4/12">Primary Referrer</span>
            <select class="form-select mt-1 w-full" v-model="patient.clientUid">
                <option></option>
                <option v-for="client in clients" :key="client.uid" :value="client.uid"> {{ client.name }} {{ client.uid }}</option>
              </select>
          </label>
          <span class="text-red-700 w-full mb-2">{{ errors?.data?.clientPatientId }}</span>

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
              <select class="form-select mt-1 w-full" v-model="patient.districtUid">
                <option></option>
                <option v-for="district in districts" :key="district.uid" :value="district.uid"> {{ district.name }} {{ district.uid }}</option>
              </select>
            </label>
          </div>

          <hr />
          <!-- <button
            type="button"
            @click.prevent="savePatientForm()"
            class="-mb-4 w-1/5 border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
          >
            Save Patient
          </button> -->
          <button type="submit" class="-mb-4 w-1/5 border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"> Save Patient </button>
        </form>
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
import { defineComponent, reactive, computed, onMounted, toRefs } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useQuery } from '@urql/vue';
import { IPatient } from '../../models/patient';
import {
  FILTER_PROVINCES_BY_COUNTRY,
  FILTER_DISTRICTS_BY_PROVINCE,
} from '../../graphql/admin.queries';
import { ADD_PATIENT } from '../../graphql/patient.mutations';

import { ActionTypes } from '../../store/modules/patient';
import { ActionTypes as ClientActionTypes } from '../../store/modules/client';
import { ActionTypes as AdminActionTypes } from '../../store/modules/admin';
import { simpleValidator } from '../../modules/validators'
import { IDistrict, IProvince } from '../../models/location';
import { IClient } from '../../models/client';
export default defineComponent({
  name: 'patient-form',
  setup() {
    let store = useStore();
    let router = useRouter();

    const state = reactive({
        genders: ["Male", "Female", "Missing", "Trans Gender"] as string[],
        patient: <IPatient>{} ,
        errors: { hasError: false, data: <any>{}},
        createAction: true,
        countries: computed(() => store.getters.getCountries),
        countryUid: undefined as number | undefined,
        provinces: [] as IProvince[],
        provinceUid:  undefined as number | undefined,
        districts: [] as IDistrict[],
        clients: computed<IClient[]>(() => store.getters.getClients),
    })

    let clientParams = reactive({ 
      first: undefined, 
      after: "",
      text: "", 
      sortBy: ["name"],
      filterAction: false
    });

    onMounted(async () => {
      await store.dispatch(AdminActionTypes.FETCH_COUNTRIES);  
      await store.dispatch(ClientActionTypes.FETCH_CLIENTS, clientParams);
    })

    // Provinces
    function getProvinces(event:any) {
      provincesfilter.executeQuery({requestPolicy: 'network-only'}).then(result => {
        state.provinces = result.data.value?.provincesByCountryUid;
      });
    }

    const provincesfilter = useQuery({
      query: FILTER_PROVINCES_BY_COUNTRY,
      variables: { uid: state.countryUid },
      pause: computed(() => state.countryUid !== null),
      requestPolicy: 'network-only',
    });

    // Districts
    function getDistricts(event: any) {
      districtsfilter.executeQuery({requestPolicy: 'network-only'}).then(result => {
        state.districts = result.data.value?.districtsByProvinceUid;
      });
    }

    const districtsfilter = useQuery({
      query: FILTER_DISTRICTS_BY_PROVINCE,
      variables: { uid: state.provinceUid },
      pause: computed(() => state.provinceUid !== null),
      requestPolicy: 'network-only',
    });

    // Patient
    const { executeMutation: createPatient } = useMutation(ADD_PATIENT);

    function addPatient() {
      createPatient({ clientPatientId: state.patient.clientPatientId, firstName: state.patient.firstName,
        middleName: state.patient.middleName, lastName: state.patient.lastName, age: state.patient.age,
        gender: state.patient.gender, dateOfBirth: state.patient.dateOfBirth, ageDobEstimated: state.patient.ageDobEstimated,
        clientUid: state.patient.clientUid, phoneMobile: state.patient.phoneMobile, consentSms: state.patient.consentSms, 
      }).then(result => {
        store.dispatch(ActionTypes.ADD_PATIENT, result);
        router.push({ name: "patient-detail", params: { patientUid: result?.data?.createPatient?.patient?.uid }});
      });
    }

    function savePatientForm() {
      const validations = simpleValidator(state.patient, ["clientPatientId", "firstName", "lastName", "clientUid", "consentSms"])
      if(validations.hasError) {
        state.errors = validations;
        return
      };
      if (state.createAction) addPatient();
    }

    return {
      ...toRefs(state),
      savePatientForm,
      getProvinces,
      getDistricts,
    };
  },
});
</script>
