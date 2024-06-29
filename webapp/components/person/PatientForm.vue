<script setup lang="ts">
import VueMultiselect from "vue-multiselect";
import { reactive, computed, onMounted, PropType, toRefs, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { IPatient } from "@/models/patient";
import { ADD_PATIENT, UPDATE_PATIENT } from "@/graphql/operations/patient.mutations";

import { useClientStore, useLocationStore, usePatientStore } from "@/stores";
import { useApiUtil } from "@/composables";
import { IClient } from "@/models/client";
import { IPatientIdentificationForm } from "@/models/patient";
import { isNullOrWs } from "@/utils/helpers";
import dayjs from "dayjs";
import { useField, useForm } from "vee-validate";
import { object, string, boolean, number, date } from "yup";

const props = defineProps({
  patient: Object as PropType<IPatient>,
  navigate: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

let clientStore = useClientStore();
let locationsStore = useLocationStore();
let patientStore = usePatientStore();
const { withClientMutation } = useApiUtil();

let router = useRouter();
let route = useRoute();

const state = reactive({
  genders: ["Male", "Female", "Missing", "Trans Gender"] as string[],
  createAction: true,
  countries: computed(() => locationsStore.getCountries),
  provinces: computed(() => locationsStore.getProvinces),
  districts: computed(() => locationsStore.getDistricts),
  clients: computed<IClient[]>(() => clientStore.getClients),
});

let clientParams = reactive({
  first: undefined,
  after: "",
  text: "",
  sortBy: ["name"],
  filterAction: false,
});

onMounted(async () => {
  await locationsStore.fetchCountries();
  await clientStore.fetchClients(clientParams);
  if (props.patient?.countryUid) {
    await locationsStore.filterProvincesByCountry(props.patient?.countryUid)
  }
  if (props.patient?.provinceUid) {
    await locationsStore.filterDistrictsByProvince(props.patient?.provinceUid)
  }
  await patientStore.fetchIdentifications();
});

// Patient
const { patient, navigate } = toRefs(props);

const estimateYears = ref(0);
const estimateMonths = ref(0);
const estimateDays = ref(0);

const estimateDOB = () => {
  const estimate = dayjs().subtract(estimateYears.value, 'year').subtract(estimateMonths.value, 'month',).subtract(estimateDays.value, 'day');
  dateOfBirth.value = estimate.format('YYYY-MM-DD');
  age.value = estimateYears.value;
}

const calculateAge = () => {
  var now = (new Date()).getFullYear();
  if (dateOfBirth.value) {
    const born = new Date(dateOfBirth.value as any).getFullYear()
    age.value = now - born;
  }
}

const patientSchema = object({
  uid: number(),
  clientPatientId: string().required("Client Patient ID is Required"),
  patientId: string().nullable(),
  firstName: string().required("First Name is Required"),
  middleName: string().nullable(),
  lastName: string().required("Last Name is Required"),
  client: object().required("Client is Required"),
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
});

const { handleSubmit, errors } = useForm({
  validationSchema: patientSchema,
  initialValues: {
    uid: patient?.value?.uid,
    clientPatientId: patient?.value?.clientPatientId || (route?.query?.cpid as string),
    patientId: patient?.value?.patientId,
    firstName: patient?.value?.firstName,
    middleName: patient?.value?.middleName,
    lastName: patient?.value?.lastName,
    client: patient?.value?.client,
    gender: patient?.value?.gender,
    age: patient?.value?.age,
    dateOfBirth: !isNullOrWs(patient?.value?.dateOfBirth)
      ? (new Date(patient?.value?.dateOfBirth!).toISOString().split("T")[0] as any)
      : undefined,
    ageDobEstimated: patient?.value?.ageDobEstimated,
    phoneHome: patient?.value?.phoneHome,
    phoneMobile: patient?.value?.phoneMobile,
    consentSms: patient?.value?.consentSms,
    districtUid: patient?.value?.districtUid,
    provinceUid: patient?.value?.provinceUid,
    countryUid: patient?.value?.countryUid,
    identifications: patient?.value?.identifications ?? [],
  } as any,
});

const { value: clientPatientId } = useField("clientPatientId");
const { value: firstName } = useField("firstName");
const { value: middleName } = useField("middleName");
const { value: lastName } = useField("lastName");
const { value: client } = useField<IClient>("client");
const { value: gender } = useField("gender");
const { value: age } = useField("age");
const { value: dateOfBirth } = useField("dateOfBirth");
const { value: ageDobEstimated } = useField<boolean>("ageDobEstimated");
const { value: phoneMobile } = useField("phoneMobile");
const { value: consentSms } = useField<boolean>("consentSms");
const { value: districtUid } = useField<string>("districtUid");
const { value: provinceUid } = useField<string>("provinceUid");
const { value: countryUid } = useField<string>("countryUid");
const { value: identifications } = useField<IPatientIdentificationForm[]>("identifications");

const submitPatientForm = handleSubmit((values) => {
  if (!values.uid) addPatient(values as IPatient);
  if (values.uid) updatePatient(values as IPatient);
});

//
function addPatient(payload: IPatient) {
  withClientMutation(
    ADD_PATIENT,
    {
      payload: {
        clientPatientId: payload.clientPatientId,
        firstName: payload.firstName,
        middleName: payload.middleName,
        lastName: payload.lastName,
        age: payload.age,
        gender: payload.gender,
        dateOfBirth: payload.dateOfBirth,
        ageDobEstimated: payload.ageDobEstimated,
        clientUid: payload.client.uid,
        phoneMobile: payload.phoneMobile,
        consentSms: payload.consentSms,
        countryUid: payload.countryUid,
        provinceUid: payload.provinceUid,
        districtUid: payload.districtUid,
        identifications: payload.identifications
      },
    },
    "createPatient"
  ).then((result) => {
    patientStore.addPatient(result);
    emit("close", result);
    if (navigate.value === true)
      router.push({ name: "patient-detail", params: { patientUid: result.uid } });
  });
}

function updatePatient(payload: IPatient) {
  withClientMutation(
    UPDATE_PATIENT,
    {
      uid: payload.uid,
      payload: {
        clientPatientId: payload.clientPatientId,
        firstName: payload.firstName,
        middleName: payload.middleName,
        lastName: payload.lastName,
        age: payload.age,
        gender: payload.gender,
        dateOfBirth: payload.dateOfBirth,
        ageDobEstimated: payload.ageDobEstimated,
        clientUid: payload.client.uid,
        phoneMobile: payload.phoneMobile,
        consentSms: payload.consentSms,
        countryUid: payload.countryUid,
        provinceUid: payload.provinceUid,
        districtUid: payload.districtUid,
        identifications: payload.identifications?.map(id => ({ identificationUid: id.identificationUid, value: id.value }))
      },
    },
    "updatePatient"
  ).then((result) => {
    patientStore.updatePatient(result);
    emit("close", result);
  });
}

// Provinces
function getProvinces(event: any) {
  locationsStore.filterProvincesByCountry(countryUid.value);
}

// Districts
function getDistricts(event: any) {
  locationsStore.filterDistrictsByProvince(provinceUid.value);
}

// Extra Patient Identifiers
const addIdentifier = () => {
  identifications.value.push({ identificationUid: "12122", value: "" })
}
const removeIdentifier = (index: number) => {
  identifications.value.splice(index, 1)
}
</script>

<template>
  <form @submit.prevent="submitPatientForm" class="border-2 border-gray-900 border-dotted rounded-sm px-4 py-8"
    autocomplete="off">
    <label class="flex whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Patient Unique Identifier</span>
      <div class="w-full">
        <input class="form-input mt-1 block w-full" v-model="clientPatientId" placeholder="Patient Unique Identifier" />
        <div class="text-orange-600 w-4/12">{{ errors.clientPatientId }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">First Name</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full" v-model="firstName" placeholder="First Name" />
        <div class="text-orange-600 w-4/12">{{ errors.firstName }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-gray-700 w-4/12">Middle Name</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full" v-model="middleName" placeholder="Middle Name" />
        <div class="text-orange-600 w-4/12">{{ errors.middleName }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Last Name</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full" v-model="lastName" placeholder="Last Name" />
        <div class="text-orange-600 w-4/12">{{ errors.lastName }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap my-2 w-full">
      <span class="text-gray-700 w-4/12">Age/DOB Estimated?</span>
      <div class="w-full flex justify-between items-center">
        <input type="checkbox" class="form-checkbox text-sky-800" v-model="ageDobEstimated" />
        <div class="flex justify-start items-center gap-x-2 ml-4" v-show="ageDobEstimated">
          <label for="estimateYears">
            <span class="mr-1">Years</span>
            <input name="estimateYears" type="number" min=0 class="form-input w-24 py-0 text-sky-800"
              v-model="estimateYears" @change="estimateDOB()" @keyup="estimateDOB()" />
          </label>
          <label for="estimateMonths">
            <span class="mr-1">Months</span>
            <input name="estimateMonths" type="number" min=0 max=12 class="form-input w-24 py-0 text-sky-800"
              v-model="estimateMonths" @change="estimateDOB()" @keyup="estimateDOB()" />
          </label>
          <label for="estimateDays">
            <span class="mr-1">Days</span>
            <input name="estimateDays" type="number" min=0 max=365 class="form-input w-24 py-0 text-sky-800"
              v-model="estimateDays" @change="estimateDOB()" @keyup="estimateDOB()" />
          </label>
        </div>
        <div class="text-orange-600 w-4/12">{{ errors.ageDobEstimated }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-gray-700 w-4/12">Date of Birth</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full disabled:bg-slate-200" type="date" v-model="dateOfBirth"
          placeholder="Date of Birth" :disabled="ageDobEstimated" @change="calculateAge()" @keyup="calculateAge()" />
        <div class="text-orange-600 w-4/12">{{ errors.dateOfBirth }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-gray-700 w-4/12">Age</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full disabled:bg-slate-200" type="number" v-model="age" placeholder="Age"
          disabled />
        <div class="text-orange-600 w-4/12">{{ errors.age }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-gray-700 w-4/12">Gender</span>
      <div class="w-full">
        <select class="form-select mt-1 w-full" v-model="gender">
          <option></option>
          <option v-for="sex of state.genders" :key="sex" :value="sex">
            {{ sex }}
          </option>
        </select>
        <div class="text-orange-600 w-4/12">{{ errors.gender }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-gray-700 w-4/12">Mobile Number</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full" v-model="phoneMobile" placeholder="Mobile Number" />
        <div class="text-orange-600 w-4/12">{{ errors.phoneMobile }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-gray-700 w-4/12">Consent to SMS</span>
      <div class="w-full">
        <input type="checkbox" class="form-checkbox text-sky-800" v-model="consentSms" />
        <div class="text-orange-600 w-4/12">{{ errors.consentSms }}</div>
      </div>
    </label>

    <!-- other identifiers: passport, client pid, national id -->
    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-gray-700 w-4/12">Primary Referrer</span>
      <div class="w-full">
        <VueMultiselect placeholder="Select a Primary Referrer" v-model="client" :options="state.clients"
          :searchable="true" label="name" track-by="uid">
        </VueMultiselect>
        <div class="text-orange-600 w-4/12">{{ errors.client }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-gray-700 w-4/12 flex justify-between items-center">
        <span class="mr-4">Extra Ids:</span>
        <div>
          <span
            class="relative px-1 mr-2 mt-4 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
            @click="addIdentifier()">
            Add
          </span>
        </div>
      </span>
      <div class="w-full border-gray-200">
        <div class="flex justify-around items-center  w-full" v-for="(identication, index) of identifications">
          <span>Identification</span>
          <select class="form-select mt-1" v-model="identication.identificationUid">
            <option></option>
            <option v-for="identifier of patientStore.identifications" :key="identifier.uid" :value="identifier.uid">
              {{ identifier.name }}
            </option>
          </select>
          <span>Value</span>
          <input type="text" class="form-input text-sky-800" v-model="identication.value" />
          <span class="p-2 text-red-800" @click.prevent="removeIdentifier(index)">X</span>
        </div>
      </div>
    </label>

    <hr class="my-2" />

    <div class="grid grid-cols-3 gap-x-4 mb-4">
      <div class="col-span-1">
        <label class="flex gap-x-2 items-center whitespace-nowrap w-full">
          <span class="text-gray-700 w-4/12">Country</span>
          <select class="form-select mt-1 w-full" v-model="countryUid" @change="getProvinces($event)">
            <option :value="null"></option>
            <option v-for="country in state.countries" :key="country.uid" :value="country.uid">
              {{ country.name }}
            </option>
          </select>
        </label>
        <div class="text-orange-600 w-4/12">{{ errors.countryUid }}</div>
      </div>

      <div class="col-span-1">
        <label class="flex gap-x-2 items-center whitespace-nowrap col-span-1 w-full">
          <span class="text-gray-700 w-4/12">Province</span>
          <select class="form-select mt-1 w-full" v-model="provinceUid" @change="getDistricts($event)">
            <option :value="null"></option>
            <option v-for="province in state.provinces" :key="province.uid" :value="province.uid">
              {{ province.name }}
            </option>
          </select>
        </label>
        <div class="text-orange-600 w-4/12">{{ errors.provinceUid }}</div>
      </div>

      <div class="col-span-1">
        <label class="flex gap-x-2 items-center whitespace-nowrap col-span-1 w-full">
          <span class="text-gray-700 w-4/12">District</span>
          <select class="form-select mt-1 w-full" v-model="districtUid">
            <option :value="null"></option>
            <option v-for="district in state.districts" :key="district.uid" :value="district.uid">
              {{ district.name }}
            </option>
          </select>
        </label>
      </div>
      <div class="text-orange-600 w-4/12">{{ errors.districtUid }}</div>
    </div>

    <hr />
    <button type="submit"
      class="-mb-4 w-1/5 border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline">
      Save Patient
    </button>
  </form>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
