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
import { useForm } from "vee-validate";
import { PatientType, ClientType } from "@/types/gql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// Sentinel for optional Select placeholder - reka-ui forbids empty string as SelectItem value
const SELECT_NONE = "__none__";

// Patient
const { patient, navigate } = toRefs(props);

const maxDate = ref(new Date());
const estimateYears = ref(0);
const estimateMonths = ref(0);
const estimateDays = ref(0);

const estimateDOB = () => {
  const estimate = dayjs().subtract(estimateYears.value, 'year').subtract(estimateMonths.value, 'month',).subtract(estimateDays.value, 'day');
  setFieldValue("dateOfBirth", estimate.format('YYYY-MM-DD'));
  setFieldValue("age", estimateYears.value);
}

const calculateAge = () => {
  var now = (new Date()).getFullYear();
  if (values.dateOfBirth) {
    const born = new Date(values.dateOfBirth as any).getFullYear()
    setFieldValue("age", now - born);
  }
}

const patientSchema = yup.object({
  uid: yup.string().nullable(),
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
  districtUid: yup.string().nullable(),
  provinceUid: yup.string().nullable(),
  countryUid: yup.string().nullable(),
  identifications: yup.array().of(
    yup.object({
      identificationUid: yup.string().required("Identification type is required"),
      value: yup.string().required("Identification value is required"),
    })
  ).nullable(),
});

const { handleSubmit, values, setFieldValue } = useForm({
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
        dateOfBirth: payload.dateOfBirth
          ? formatDate(payload.dateOfBirth, "YYYY-MM-DD HH:mm")
          : null,
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


function getProvinces(countryUid?: string) {
  const uid = countryUid ?? values.countryUid;
  if (uid) locationsStore.filterProvincesByCountry(uid);
}

function getDistricts(provinceUid?: string) {
  const uid = provinceUid ?? values.provinceUid;
  if (uid) locationsStore.filterDistrictsByProvince(uid);
}

function addIdentifier() {
  const current = (values.identifications ?? []) as IPatientIdentificationForm[];
  setFieldValue("identifications", [...current, { identificationUid: "", value: "" }]);
}

function removeIdentifier(index: number) {
  const current = (values.identifications ?? []) as IPatientIdentificationForm[];
  setFieldValue("identifications", current.filter((_, idx) => idx !== index));
}
</script>

<template>
  <Form
    class="space-y-6"
    autocomplete="off"
    role="form"
    aria-label="Patient Information Form"
    @submit="submitPatientForm"
  >
    <div class="grid grid-cols-2 gap-6">
      <FormField name="clientPatientId" v-slot="{ componentField }">
        <FormItem class="col-span-2">
          <FormLabel>Patient Unique Identifier</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Patient Unique Identifier" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="firstName" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="First Name" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="middleName" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Middle Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Middle Name" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="lastName" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Last Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Last Name" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="gender" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Gender</FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="sex of state.genders" :key="sex" :value="sex">
                  {{ sex }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="phoneMobile" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Mobile Number</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Mobile Number" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="consentSms" v-slot="{ value, handleChange }">
        <FormItem class="flex items-center space-x-2">
          <FormControl>
            <Checkbox :checked="!!value" @update:checked="handleChange" />
          </FormControl>
          <FormLabel>Consent to SMS</FormLabel>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="ageDobEstimated" v-slot="{ value, handleChange }">
        <FormItem class="col-span-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <FormControl>
                <Checkbox :checked="!!value" @update:checked="handleChange" />
              </FormControl>
              <FormLabel>Age/DOB Estimated?</FormLabel>
            </div>
            <div class="flex items-center gap-2" v-show="values.ageDobEstimated">
              <label class="flex items-center gap-2">
                <span>Years</span>
                <Input
                  type="number"
                  min="0"
                  class="w-24"
                  v-model="estimateYears"
                  @change="estimateDOB()"
                  @keyup="estimateDOB()"
                />
              </label>
              <label class="flex items-center gap-2">
                <span>Months</span>
                <Input
                  type="number"
                  min="0"
                  max="12"
                  class="w-24"
                  v-model="estimateMonths"
                  @change="estimateDOB()"
                  @keyup="estimateDOB()"
                />
              </label>
              <label class="flex items-center gap-2">
                <span>Days</span>
                <Input
                  type="number"
                  min="0"
                  max="365"
                  class="w-24"
                  v-model="estimateDays"
                  @change="estimateDOB()"
                  @keyup="estimateDOB()"
                />
              </label>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="dateOfBirth" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Date of Birth</FormLabel>
          <FormControl>
            <VueDatePicker
              class="z-60 disabled:bg-muted"
              v-bind="componentField"
              :disabled="values.ageDobEstimated"
              @closed="calculateAge()"
              :max-date="maxDate"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="age" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Age</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="number" disabled />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="client" v-slot="{ componentField }">
        <FormItem class="col-span-2">
          <FormLabel>Primary Referrer</FormLabel>
          <FormControl>
            <VueMultiselect
              v-bind="componentField"
              placeholder="Select a Primary Referrer"
              :options="state.clients"
              :searchable="true"
              label="name"
              track-by="uid"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="identifications" v-slot="{ value }">
        <FormItem class="col-span-2">
          <div class="flex items-center justify-between">
            <FormLabel>Extra IDs</FormLabel>
            <Button type="button" variant="outline" size="sm" @click="addIdentifier">
              Add
            </Button>
          </div>
          <FormControl>
            <div class="space-y-3">
              <div
                v-for="(identification, index) in (value || [])"
                :key="index"
                class="grid grid-cols-[1fr_1fr_auto] items-center gap-4"
              >
                <Select
                  :model-value="identification.identificationUid || SELECT_NONE"
                  @update:model-value="(v) => setFieldValue(`identifications.${index}.identificationUid`, v === SELECT_NONE ? '' : v)"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Identification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem :value="SELECT_NONE">Select Identification</SelectItem>
                    <SelectItem v-for="identifier of patientStore.identifications" :key="identifier.uid" :value="identifier.uid">
                      {{ identifier.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  :model-value="identification.value"
                  placeholder="Value"
                  @update:model-value="(input) => setFieldValue(`identifications.${index}.value`, input)"
                />
                <Button type="button" variant="ghost" @click.prevent="removeIdentifier(index)">
                  X
                </Button>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <hr class="border-border" />

    <div class="grid grid-cols-3 gap-6">
      <FormField name="countryUid" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Country</FormLabel>
          <FormControl>
            <Select
              :model-value="componentField.modelValue || SELECT_NONE"
              @update:model-value="(v) => { const val = v === SELECT_NONE ? '' : v; componentField['onUpdate:modelValue']?.(val); getProvinces(val); }"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="SELECT_NONE">Select country</SelectItem>
                <SelectItem v-for="country in state.countries" :key="country.uid" :value="country.uid">
                  {{ country.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="provinceUid" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Province</FormLabel>
          <FormControl>
            <Select
              :model-value="componentField.modelValue || SELECT_NONE"
              @update:model-value="(v) => { const val = v === SELECT_NONE ? '' : v; componentField['onUpdate:modelValue']?.(val); getDistricts(val); }"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="SELECT_NONE">Select province</SelectItem>
                <SelectItem v-for="province in state.provinces" :key="province.uid" :value="province.uid">
                  {{ province.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="districtUid" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>District</FormLabel>
          <FormControl>
            <Select
              :model-value="componentField.modelValue || SELECT_NONE"
              @update:model-value="(v) => componentField['onUpdate:modelValue']?.(v === SELECT_NONE ? '' : v)"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="SELECT_NONE">Select district</SelectItem>
                <SelectItem v-for="district in state.districts" :key="district.uid" :value="district.uid">
                  {{ district.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="flex justify-end">
      <Button type="submit">Save Patient</Button>
    </div>
  </Form>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
