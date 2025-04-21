<script setup lang="ts">
import VueMultiselect from "vue-multiselect";
import { reactive, computed, onMounted, toRefs, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as yup from 'yup';
import useApiUtil from '@/composables/api_util';
import { 
  AddPatientDocument,
  AddPatientMutation,
  AddPatientMutationVariables,
  EditPatientDocument,
  EditPatientMutation,
  EditPatientMutationVariables,
} from '@/graphql/operations/patient.mutations';
import { useClientStore } from "@/stores/client";
import { useLocationStore } from "@/stores/location";
import { usePatientStore } from "@/stores/patient";
import { formatDate, isNullOrWs } from "@/utils";
import dayjs from "dayjs";
import { useField, useForm } from "vee-validate";
import { PatientType, ClientType } from "@/types/gql";

interface IPatientIdentificationForm {
    identificationUid: string;
    value: string;
}

interface Props {
  patient?: PatientType;
  navigate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  navigate: false
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
  clients: computed<ClientType[]>(() => clientStore.getClients),
});

let clientParams = reactive({
  first: undefined as number | undefined,
  after: "",
  text: "",
  sortBy: ["name"] as string[],
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

const maxDate = ref(new Date());
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

const patientSchema = yup.object({
  uid: yup.number().nullable(),
  clientPatientId: yup.string().required("Client Patient ID is Required"),
  patientId: yup.string().nullable(),
  firstName: yup.string().required("First Name is Required"),
  middleName: yup.string().nullable(),
  lastName: yup.string().required("Last Name is Required"),
  client: yup.object().required("Client is Required"),
  gender: yup.string().required("Gender is Required"),
  age: yup.number().nullable(),
  dateOfBirth: yup.date().nullable(),
  ageDobEstimated: yup.boolean().nullable(),
  phoneHome: yup.string().nullable(),
  phoneMobile: yup.string().nullable(),
  consentSms: yup.boolean().nullable(),
  districtUid: yup.number().nullable(),
  provinceUid: yup.number().nullable(),
  countryUid: yup.number().nullable(),
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
const { value: client } = useField<ClientType>("client");
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
  if (!values.uid) addPatient(values as PatientType);
  if (values.uid) updatePatient(values as PatientType);
});

//
function addPatient(payload: PatientType) {
  withClientMutation<AddPatientMutation, AddPatientMutationVariables>(
    AddPatientDocument,
    {
      payload: {
        clientPatientId: payload.clientPatientId,
        firstName: payload.firstName,
        middleName: payload.middleName,
        lastName: payload.lastName,
        age: payload.age,
        gender: payload.gender,
        dateOfBirth: formatDate(payload.dateOfBirth, "YYYY-MM-DD HH:mm"),
        ageDobEstimated: payload.ageDobEstimated,
        clientUid: payload.client.uid!,
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
    if (navigate.value === true){
      router.push({ name: "patient-detail", params: { patientUid: result?.uid } });
    }

  });
}

function updatePatient(payload: PatientType) {
  withClientMutation<EditPatientMutation, EditPatientMutationVariables>(
    EditPatientDocument,
    {
      uid: payload.uid,
      payload: {
        clientPatientId: payload.clientPatientId,
        firstName: payload.firstName,
        middleName: payload.middleName,
        lastName: payload.lastName,
        age: payload.age,
        gender: payload.gender,
        dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth).toISOString() : null,
        ageDobEstimated: payload.ageDobEstimated,
        clientUid: payload.client.uid!,
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


function getProvinces(event: Event) {
  locationsStore.filterProvincesByCountry(countryUid.value);
}

function getDistricts(event: Event) {
  locationsStore.filterDistrictsByProvince(provinceUid.value);
}

function addIdentifier() {
  identifications.value.push({ identificationUid: "12122", value: "" })
}

function removeIdentifier(index: number) {
  identifications.value.splice(index, 1)
}
</script>

<template>
  <form @submit.prevent="submitPatientForm"
    autocomplete="off" role="form" aria-label="Patient Information Form">
    <label class="flex whitespace-nowrap w-full">
      <span class="text-foreground w-4/12">Patient Unique Identifier</span>
      <div class="w-full">
        <input class="form-input mt-1 block w-full" v-model="clientPatientId" placeholder="Patient Unique Identifier" 
          aria-label="Patient Unique Identifier" aria-required="true" />
        <div class="text-destructive w-4/12" role="alert">{{ errors.clientPatientId }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap w-full">
      <span class="text-foreground w-4/12">First Name</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full" v-model="firstName" placeholder="First Name" 
          aria-label="First Name" aria-required="true" />
        <div class="text-destructive w-4/12" role="alert">{{ errors.firstName }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-foreground w-4/12">Middle Name</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full" v-model="middleName" placeholder="Middle Name" 
          aria-label="Middle Name" />
        <div class="text-destructive w-4/12" role="alert">{{ errors.middleName }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap w-full">
      <span class="text-foreground w-4/12">Last Name</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full" v-model="lastName" placeholder="Last Name" 
          aria-label="Last Name" aria-required="true" />
        <div class="text-destructive w-4/12" role="alert">{{ errors.lastName }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap my-2 w-full">
      <span class="text-foreground w-4/12">Age/DOB Estimated?</span>
      <div class="w-full flex justify-between items-center">
        <input type="checkbox" class="form-checkbox text-primary" v-model="ageDobEstimated" 
          aria-label="Age/DOB Estimated" />
        <div class="flex justify-start items-center gap-x-2 ml-4" v-show="ageDobEstimated">
          <label for="estimateYears">
            <span class="mr-1">Years</span>
            <input name="estimateYears" type="number" min=0 class="form-input w-24 py-0 text-primary"
              v-model="estimateYears" @change="estimateDOB()" @keyup="estimateDOB()" 
              aria-label="Estimated Years" />
          </label>
          <label for="estimateMonths">
            <span class="mr-1">Months</span>
            <input name="estimateMonths" type="number" min=0 max=12 class="form-input w-24 py-0 text-primary"
              v-model="estimateMonths" @change="estimateDOB()" @keyup="estimateDOB()" 
              aria-label="Estimated Months" />
          </label>
          <label for="estimateDays">
            <span class="mr-1">Days</span>
            <input name="estimateDays" type="number" min=0 max=365 class="form-input w-24 py-0 text-primary"
              v-model="estimateDays" @change="estimateDOB()" @keyup="estimateDOB()" 
              aria-label="Estimated Days" />
          </label>
        </div>
        <div class="text-destructive w-4/12" role="alert">{{ errors.ageDobEstimated }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-foreground w-4/12">Date of Birth</span>
      <div class="w-full">
        <VueDatePicker 
        class="z-60 disabled:bg-muted" 
        v-model="dateOfBirth" 
        :disabled="ageDobEstimated" 
        @closed="calculateAge()"
        :max-date="maxDate"
        aria-label="Date of Birth"></VueDatePicker>
        <div class="text-destructive w-4/12" role="alert">{{ errors.dateOfBirth }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-foreground w-4/12">Age</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full disabled:bg-muted" type="number" v-model="age" placeholder="Age"
          disabled aria-label="Age" />
        <div class="text-destructive w-4/12" role="alert">{{ errors.age }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-foreground w-4/12">Gender</span>
      <div class="w-full">
        <select class="form-select mt-1 w-full" v-model="gender" aria-label="Gender" aria-required="true">
          <option value=""></option>
          <option v-for="sex of state.genders" :key="sex" :value="sex">
            {{ sex }}
          </option>
        </select>
        <div class="text-destructive w-4/12" role="alert">{{ errors.gender }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-foreground w-4/12">Mobile Number</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full" v-model="phoneMobile" placeholder="Mobile Number" 
          aria-label="Mobile Number" />
        <div class="text-destructive w-4/12" role="alert">{{ errors.phoneMobile }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-foreground w-4/12">Consent to SMS</span>
      <div class="w-full">
        <input type="checkbox" class="form-checkbox text-primary" v-model="consentSms" 
          aria-label="Consent to SMS" />
        <div class="text-destructive w-4/12" role="alert">{{ errors.consentSms }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-foreground w-4/12">Primary Referrer</span>
      <div class="w-full">
        <VueMultiselect placeholder="Select a Primary Referrer" v-model="client" :options="state.clients"
          :searchable="true" label="name" track-by="uid" aria-label="Primary Referrer" aria-required="true">
        </VueMultiselect>
        <div class="text-destructive w-4/12" role="alert">{{ errors.client }}</div>
      </div>
    </label>

    <label class="flex whitespace-nowrap mb-2 w-full">
      <span class="text-foreground w-4/12 flex justify-between items-center">
        <span class="mr-4">Extra Ids:</span>
        <div>
          <button type="button"
            class="relative px-1 mr-2 mt-4 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            @click="addIdentifier()"
            aria-label="Add Extra Identifier">
            Add
          </button>
        </div>
      </span>
      <div class="w-full border-border">
        <div class="flex justify-around items-center w-full" v-for="(identication, index) of identifications" :key="index">
          <span>Identification</span>
          <select class="form-select mt-1" v-model="identication.identificationUid" 
            :aria-label="'Identification Type ' + (index + 1)">
            <option value=""></option>
            <option v-for="identifier of patientStore.identifications" :key="identifier.uid" :value="identifier.uid">
              {{ identifier.name }}
            </option>
          </select>
          <span>Value</span>
          <input type="text" class="form-input text-primary" v-model="identication.value" 
            :aria-label="'Identification Value ' + (index + 1)" />
          <button type="button" class="p-2 text-destructive" @click.prevent="removeIdentifier(index)"
            :aria-label="'Remove Identification ' + (index + 1)">X</button>
        </div>
      </div>
    </label>

    <hr class="my-2" />

    <div class="grid grid-cols-3 gap-x-4 mb-4">
      <div class="col-span-1">
        <label class="flex gap-x-2 items-center whitespace-nowrap w-full">
          <span class="text-foreground w-4/12">Country</span>
          <select class="form-select mt-1 w-full" v-model="countryUid" @change="getProvinces($event)"
            aria-label="Country">
            <option :value="null"></option>
            <option v-for="country in state.countries" :key="country.uid" :value="country.uid">
              {{ country.name }}
            </option>
          </select>
        </label>
        <div class="text-destructive w-4/12" role="alert">{{ errors.countryUid }}</div>
      </div>

      <div class="col-span-1">
        <label class="flex gap-x-2 items-center whitespace-nowrap col-span-1 w-full">
          <span class="text-foreground w-4/12">Province</span>
          <select class="form-select mt-1 w-full" v-model="provinceUid" @change="getDistricts($event)"
            aria-label="Province">
            <option :value="null"></option>
            <option v-for="province in state.provinces" :key="province.uid" :value="province.uid">
              {{ province.name }}
            </option>
          </select>
        </label>
        <div class="text-destructive w-4/12" role="alert">{{ errors.provinceUid }}</div>
      </div>

      <div class="col-span-1">
        <label class="flex gap-x-2 items-center whitespace-nowrap col-span-1 w-full">
          <span class="text-foreground w-4/12">District</span>
          <select class="form-select mt-1 w-full" v-model="districtUid" aria-label="District">
            <option :value="null"></option>
            <option v-for="district in state.districts" :key="district.uid" :value="district.uid">
              {{ district.name }}
            </option>
          </select>
        </label>
        <div class="text-destructive w-4/12" role="alert">{{ errors.districtUid }}</div>
      </div>
    </div>

    <hr />
    <button type="submit"
      class="-mb-4 w-1/5 border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="Save Patient Information">
      Save Patient
    </button>
  </form>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
