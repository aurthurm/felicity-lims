<template>
    <form 
    @submit.prevent="submitPatientForm"
    class="border-2 border-gray-900 border-dotted rounded p-4" 
    autocomplete="off">

          <label class="flex whitespace-nowrap w-full">
            <span class="text-gray-700 w-4/12">Patient Unique Identifier</span>
            <div class="w-full">
              <input class="form-input mt-1 block w-full" v-model="clientPatientId" placeholder="Patient Unique Identifier" />
              <div class="text-red-700 w-4/12">{{ errors.clientPatientId }}</div>
            </div>
          </label>

          <label class="flex whitespace-nowrap w-full">
            <span class="text-gray-700 w-4/12">First Name</span>
            <div class="w-full">
              <input class="form-input mt-1 w-full" v-model="firstName" placeholder="First Name" />
              <div class="text-red-700 w-4/12">{{ errors.firstName }}</div>
            </div>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Middle Name</span>
            <div class="w-full">
              <input class="form-input mt-1 w-full" v-model="middleName" placeholder="Middle Name" />
              <div class="text-red-700 w-4/12">{{ errors.middleName }}</div>
            </div>
          </label>

          <label class="flex whitespace-nowrap w-full">
            <span class="text-gray-700 w-4/12">Last Name</span>
            <div class="w-full">
              <input class="form-input mt-1 w-full" v-model="lastName" placeholder="Last Name" />
              <div class="text-red-700 w-4/12">{{ errors.lastName }}</div>
            </div>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Age</span>
            <div class="w-full">
              <input class="form-input mt-1 w-full" type="number" v-model="age" placeholder="Age" />
              <div class="text-red-700 w-4/12">{{ errors.age }}</div>
            </div>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Date of Birth</span>
            <div class="w-full">
              <input class="form-input mt-1 w-full" type="date" v-model="dateOfBirth" placeholder="Date of Birth" />
              <div class="text-red-700 w-4/12">{{ errors.dateOfBirth }}</div>
            </div>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-3/12">Age/DOB Estimated?</span>
            <div class="w-full">
              <input type="checkbox" class="form-checkbox text-green-500" v-model="ageDobEstimated" />
              <div class="text-red-700 w-4/12">{{ errors.ageDobEstimated }}</div>
            </div>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full" >
            <span class="text-gray-700 w-4/12">Gender</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="gender">
                <option></option>
                <option v-for="(sex, indx) in state.genders" :key="indx" :value="indx"> {{ sex }}</option>
              </select>
              <div class="text-red-700 w-4/12">{{ errors.gender }}</div>
            </div>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full" >
            <span class="text-gray-700 w-4/12">Mobile Number</span>
            <div class="w-full">
              <input class="form-input mt-1 w-full"  v-model="phoneMobile" placeholder="Mobile Number" />
              <div class="text-red-700 w-4/12">{{ errors.phoneMobile }}</div>
            </div>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-3/12">Consent to SMS</span>
            <div class="w-full">
              <input type="checkbox" class="form-checkbox text-green-500" v-model="consentSms" />
              <div class="text-red-700 w-4/12">{{ errors.consentSms }}</div>
            </div>
          </label>

          <!-- other identifiers: passport, client pid, national id -->
          <label class="flex whitespace-nowrap w-full">
            <span class="text-gray-700 w-4/12">Primary Referrer</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="clientUid">
                  <option></option>
                  <option v-for="client in state.clients" :key="client.uid" :value="client.uid">{{ client.name }}</option>
              </select>
              <div class="text-red-700 w-4/12">{{ errors.clientUid }}</div>
            </div>
          </label>

          <hr class="my-2">

          <div class="grid grid-cols-3 gap-x-4 mb-4">
            <label class="flex items-center whitespace-nowrap col-span-1 mb-2 w-full">
              <span class="text-gray-700 w-4/12">Country</span>
              <select class="form-select mt-1 w-full" v-model="countryUid" @change="getProvinces($event)">
                <option :value="null"></option>
                <option v-for="country in state.countries" :key="country.uid" :value="country.uid"> {{ country.name }}</option>
              </select>
            </label>
            <label class="flex items-center whitespace-nowrap col-span-1 mb-2 w-full">
              <span class="text-gray-700 w-4/12">Province</span>
              <select class="form-select mt-1 w-full" v-model="provinceUid" @change="getDistricts($event)">
                <option :value="null"></option>
                <option v-for="province in state.provinces" :key="province.uid" :value="province.uid"> {{ province.name }}</option>
              </select>
            </label>
            <label class="flex items-center whitespace-nowrap col-span-1 mb-2 w-full">
              <span class="text-gray-700 w-4/12">District</span>
              <select class="form-select mt-1 w-full" v-model="districtUid">
                <option :value="null"></option>
                <option v-for="district in state.districts" :key="district.uid" :value="district.uid"> {{ district.name }}</option>
              </select>
            </label>
          </div>
          <div class="text-red-700 w-4/12">{{ errors.countryUid }}</div>
          <div class="text-red-700 w-4/12">{{ errors.provinceUid }}</div>
          <div class="text-red-700 w-4/12">{{ errors.districtUid }}</div>

          <hr />
          <button type="submit" class="-mb-4 w-1/5 border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"> Save Patient </button>
        </form>
</template>

<script setup lang="ts">
  import { useMutation } from '@urql/vue';
  import { reactive, computed, onMounted, PropType, toRefs } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import { useQuery } from '@urql/vue';
  import { IPatient } from '../../models/patient';
  import {
    FILTER_PROVINCES_BY_COUNTRY,
    FILTER_DISTRICTS_BY_PROVINCE,
  } from '../../graphql/admin.queries';
  import { ADD_PATIENT, UPDATE_PATIENT } from '../../graphql/patient.mutations';

  import { ActionTypes } from '../../store/modules/patient';
  import { ActionTypes as ClientActionTypes } from '../../store/modules/client';
  import { ActionTypes as AdminActionTypes } from '../../store/modules/admin';
  import { IDistrict, IProvince } from '../../models/location';
  import { IClient } from '../../models/client';
  import { isNullOrWs } from '../../utils';
  import useNotifyToast from '../../modules/alert_toast'

  import { useField, useForm } from 'vee-validate';
  import { object, string, boolean, number, date } from 'yup';

  const props = defineProps({
    patient: Object as PropType<IPatient>,
    navigate: { 
      type: Boolean,
      default: false
    },
  })

  const emit = defineEmits(['close'])

  let store = useStore();
  let router = useRouter();
  let route = useRoute();

  const state = reactive({
      genders: ["Male", "Female", "Missing", "Trans Gender"] as string[],
      createAction: true,
      countries: computed(() => store.getters.getCountries),
      provinces: [] as IProvince[],
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

  // Patient
  const { patient, navigate } = toRefs(props);

  const patientSchema = object({
        uid: number(),
        clientPatientId: string().required("Client Patient ID is Required"),
        patientId: string().nullable(),
        firstName: string().required("First Name is Required"),
        middleName: string().nullable(),
        lastName: string().required("Last Name is Required"),
        clientUid: number().required("Client is Required"),
        gender: string().required("Gender is Required"),
        age: number().nullable(),
        dateOfBirth: date().nullable(),
        ageDobEstimated: boolean().nullable(),
        phoneHome: string().nullable(),
        phoneMobile: string().nullable(),
        consentSms: boolean().nullable(),
        districtUid: number().nullable(),
        provinceUid: number().nullable(),
        countryUid: number().nullable(),
  })

  const { handleSubmit, errors } = useForm({
    validationSchema: patientSchema,
    initialValues: {
      uid: patient?.value?.uid,
      clientPatientId: patient?.value?.clientPatientId || route?.query?.cpid as string,
      patientId: patient?.value?.patientId,
      firstName: patient?.value?.firstName,
      middleName: patient?.value?.middleName,
      lastName: patient?.value?.lastName,
      clientUid: patient?.value?.clientUid,
      gender: patient?.value?.gender,
      age: patient?.value?.age,
      dateOfBirth: !isNullOrWs(patient?.value?.dateOfBirth) ? new Date(patient?.value?.dateOfBirth!).toISOString().split("T")[0] : undefined,
      ageDobEstimated: patient?.value?.ageDobEstimated,
      phoneHome: patient?.value?.phoneHome,
      phoneMobile: patient?.value?.phoneMobile,
      consentSms: patient?.value?.consentSms,
      districtUid: patient?.value?.client?.district?.uid,
      provinceUid: patient?.value?.client?.district?.province?.uid,
      countryUid: patient?.value?.client?.district?.province?.country?.uid
    }
  });

  const { value: clientPatientId } = useField('clientPatientId');
  const { value: firstName } = useField('firstName');
  const { value: middleName } = useField('middleName');
  const { value: lastName } = useField('lastName');
  const { value: clientUid } = useField('clientUid');
  const { value: gender } = useField('gender');
  const { value: age } = useField('age');
  const { value: dateOfBirth } = useField('dateOfBirth');
  const { value: ageDobEstimated } = useField<boolean>('ageDobEstimated');
  const { value: phoneMobile } = useField('phoneMobile');
  const { value: consentSms } = useField<boolean>('consentSms');
  const { value: districtUid } = useField('districtUid');
  const { value: provinceUid } = useField('provinceUid');
  const { value: countryUid } = useField('countryUid');

  const submitPatientForm = handleSubmit((values) => {
    if (!values.uid) addPatient(values as IPatient);
    if (values.uid) updatePatient(values as IPatient);
  });

  //
  const { gqlResponseHandler } = useNotifyToast()

  const { executeMutation: patientCreator } = useMutation(ADD_PATIENT);
  function addPatient(payload: IPatient) {
    patientCreator({ 
      clientPatientId: payload.clientPatientId, 
      firstName: payload.firstName,
      middleName: payload.middleName, 
      lastName: payload.lastName, 
      age: payload.age,
      gender: payload.gender, 
      dateOfBirth: payload.dateOfBirth, 
      ageDobEstimated: payload.ageDobEstimated,
      clientUid: payload.clientUid, 
      phoneMobile: payload.phoneMobile, 
      consentSms: payload.consentSms, 
    }).then(result => {
      const data = gqlResponseHandler(result)
      if (data) {
        store.dispatch(ActionTypes.ADD_PATIENT, data.createPatient);
        emit('close');
        if(navigate.value === true) router.push({ name: "patient-detail", params: { patientUid: data?.createPatient?.uid }});
      }
    });
  }

  const { executeMutation: patientUpdater } = useMutation(UPDATE_PATIENT);
  function updatePatient(payload: IPatient) {
    patientUpdater({ 
      uid: payload.uid,
      clientPatientId: payload.clientPatientId, 
      firstName: payload.firstName,
      middleName: payload.middleName, 
      lastName: payload.lastName, 
      age: payload.age,
      gender: payload.gender, 
      dateOfBirth: payload.dateOfBirth, 
      ageDobEstimated: payload.ageDobEstimated,
      clientUid: payload.clientUid, 
      phoneMobile: payload.phoneMobile, 
      consentSms: payload.consentSms, 
    }).then(result => {
      const data = gqlResponseHandler(result)
      if (data) {
        store.dispatch(ActionTypes.UPDATE_PATIENT, data.updatePatient);
        emit('close', data.updatePatient);
      }
    });
  }

  // Provinces
  function getProvinces(event:any) {
    provincesfilter.executeQuery({requestPolicy: 'network-only'}).then(result => {
      state.provinces = result.data.value?.provincesByCountryUid;
    });
  }

  const provincesfilter = useQuery({
    query: FILTER_PROVINCES_BY_COUNTRY,
    variables: { uid: countryUid },
    pause: computed(() => isNullOrWs(countryUid) ),
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
    variables: { uid: provinceUid },
    pause: computed(() => isNullOrWs(provinceUid) ),
    requestPolicy: 'network-only',
  });

</script>
