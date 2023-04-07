<script setup lang="ts">
import VueMultiselect from "vue-multiselect";
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import {
  useSampleStore,
  useAnalysisStore,
  useClientStore,
  usePatientStore,
} from "../../stores";
import {
  IAnalysisProfile,
  IAnalysisRequest,
  IAnalysisService,
  ISample,
  ISampleType,
} from "../../models/analysis";
import { ADD_ANALYSIS_REQUEST } from "../../graphql/analyses.mutations";
import { ifNoValEmpty } from "../../utils";

import { useField, useForm } from "vee-validate";
import { object, string, array, number } from "yup";
import { IClient } from "../../models/client";
import { useApiUtil, useNotifyToast } from "../../composables";
import LoadingMessage from "../../components/Spinners/LoadingMessage.vue";

const sampleStore = useSampleStore();
const patientStore = usePatientStore();
const analysisStore = useAnalysisStore();
const clientStore = useClientStore();
const router = useRouter();

const { withClientMutation } = useApiUtil();
const { swalError } = useNotifyToast();

// Patient
let patient = computed(() => patientStore.getPatient);

// Clients, Cient Contacts
let clientParams = reactive({
  first: undefined,
  after: "",
  text: "",
  sortBy: ["name"],
});
clientStore.fetchClients(clientParams);

const clients = computed(() => clientStore.getClients);

// const client = ref<IClient>({} as IClient);

function getClientContacts(item: IClient): void {
  if (ifNoValEmpty(item)) {
    clientStore.fetchClientContacts(item?.uid);
  }
}
const clientContacts = computed(() => clientStore.getClientContacts);

// Sample Types
sampleStore.fetchSampleTypes();
const sampleTypes = computed(() => sampleStore.getSampleTypes);

// Analysis Services
let analysesParams = reactive({
  first: undefined,
  after: "",
  text: "",
  sortBy: ["name"],
});
analysisStore.fetchAnalysesServices(analysesParams);

const analysesServices = computed<IAnalysisService[]>(() => {
  const services: IAnalysisService[] = analysisStore.getAnalysesServicesSimple;
  let s = new Set<IAnalysisService>();
  services.forEach((service: IAnalysisService, index: number) => {
    if (service.profiles?.length === 0) {
      s.add(service);
    }
  });
  return [...s];
});

// Analysis Profiles
analysisStore.fetchAnalysesProfiles();
const analysesProfiles = computed(() => analysisStore.getAnalysesProfiles);

// Analysis Request Form
const arSaving = ref(false);
const arSchema = object({
  clientRequestId: string().required("Client Request ID is Required"),
  clinicalData: string().nullable(),
  client: object().required("Client is Required"),
  clientContactUid: number().required("Client Contact is Required"),
  samples: array().required().min(1, "Add at least 1 sample"),
  priority: number(),
});

const { handleSubmit, errors } = useForm({
  validationSchema: arSchema,
  initialValues: {
    priority: 0,
    samples: [],
  } as any,
});

const { value: clientRequestId } = useField("clientRequestId");
const { value: clinicalData } = useField<string>("clinicalData");
const { value: client } = useField<IClient>("client");
const { value: clientContactUid } = useField("clientContactUid");
const { value: priority } = useField("priority");
const { value: samples } = useField<ISample[]>("samples");

const submitARForm = handleSubmit((values) => {
  arSaving.value = true;

  for (let sample of values.samples || []) {
    if (typeof sample?.sampleType !== "number") {
      swalError("Samples must have sample types");
      return;
    }
    if (sample?.analyses?.length <= 0 && sample?.profiles?.length <= 0) {
      swalError("Samples must have either profiles/analyses or both");
      return;
    }
  }

  addAnalysesRequest(values as any);
});

// Analysis Request Add
function addAnalysesRequest(request: IAnalysisRequest): void {
  const payload = {
    patientUid: patient.value?.uid,
    clientRequestId: request.clientRequestId,
    clinicalData: request.clinicalData,
    clientUid: client?.value?.uid,
    clientContactUid: request.clientContactUid,
    samples: request.samples,
  };
  withClientMutation(ADD_ANALYSIS_REQUEST, { payload }, "createAnalysisRequest")
    .then((result) => {
      sampleStore.addAnalysisRequest(result);
      router.push({ name: "patient-detail", params: { patientUid: patient.value?.uid } });
    })
    .finally(() => {
      arSaving.value = false;
    });
}

function addSample(): void {
  const sample = {
    sampleType: {} as ISampleType,
    profiles: [] as IAnalysisProfile[],
    analyses: [] as IAnalysisService[],
  } as ISample;
  samples.value.push(sample);
}

function removeSample(index: number): void {
  samples.value.splice(index, 1);
}
</script>

<template>
  <div class="w-3/6 mt-4 py-4">
    <h5 class="mb-4">Add Analysis Request</h5>
    <form action="post" class="p-4 mb-8 bg-white" @submit.prevent="submitARForm">
      <div class="">
        <label class="flex whitespace-nowrap mb-2 w-full">
          <span class="text-gray-700 w-4/12">Client Request ID</span>
          <div class="w-full">
            <input
              class="form-input mt-1 block w-full"
              v-model="clientRequestId"
              placeholder="CRID ..."
            />
            <div class="text-orange-600 w-4/12">{{ errors.clientRequestId }}</div>
          </div>
        </label>

        <label class="flex whitespace-nowrap mb-2 w-full">
          <span class="text-gray-700 w-4/12">Clinical Data</span>
          <div class="w-full">
            <textarea
              cols="2"
              class="form-input mt-1 w-full"
              v-model="clinicalData"
              placeholder="Clinical Data ..."
            />
            <div class="text-orange-600 w-4/12">{{ errors.clinicalData }}</div>
          </div>
        </label>

        <label class="flex whitespace-nowrap mb-2 w-full">
          <span class="text-gray-700 w-4/12">Client</span>
          <div class="w-full">
            <VueMultiselect
              placeholder="Select a Client"
              v-model="client"
              :options="clients"
              :searchable="true"
              label="name"
              track-by="uid"
              @select="getClientContacts"
            >
            </VueMultiselect>
          </div>
        </label>

        <label class="flex whitespace-nowrap mb-2 w-full">
          <span class="text-gray-700 w-4/12">Client Contacts</span>
          <div class="w-full">
            <select
              name="clientContacts"
              id="clientContacts"
              v-model="clientContactUid"
              class="form-input mt-1 block w-full"
            >
              <option value=""></option>
              <option
                v-for="contact in clientContacts"
                :key="contact.uid"
                :value="contact.uid"
              >
                {{ contact.firstName }} {{ contact.lastName }}
              </option>
            </select>
            <div class="text-orange-600 w-4/12">{{ errors.clientContactUid }}</div>
          </div>
        </label>

        <label class="flex whitespace-nowrap mb-2 w-full">
          <span class="text-gray-700 w-4/12">Priority</span>
          <div class="w-full">
            <input
              type="number"
              min="0"
              max="2"
              class="form-input mt-1 block w-full"
              v-model="priority"
            />
            <div class="text-orange-600 w-4/12">{{ errors.priority }}</div>
          </div>
        </label>
      </div>

      <section id="samples">
        <hr />
        <div class="flex justify-between items-center py-2">
          <h5>Samples</h5>
          <span class="text-orange-600">{{ errors.samples }}</span>
          <button
            v-if="samples?.length !== 20"
            @click.prevent="addSample()"
            class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
          >
            Add Sample
          </button>
        </div>
        <hr class="mb-4" />

        <div v-for="(sample, index) in samples" :key="index">
          <div class="flex items-center justify-between">
            <div class="flex items-top gap-x-4">
              <label class="flex flex-col whitespace-nowrap mb-2">
                <span class="text-gray-700">Sample Type</span>
                <select
                  name="sampleTypes"
                  id="sampleTypes"
                  v-model="sample.sampleType"
                  class="form-input mt-1"
                >
                  <option value=""></option>
                  <option
                    v-for="sampleType in sampleTypes"
                    :key="sampleType.uid"
                    :value="sampleType.uid"
                  >
                    {{ sampleType.name }}
                  </option>
                </select>
              </label>

              <label class="flex flex-col whitespace-nowrap mb-2">
                <span class="text-gray-700">Analysis Profiles</span>
                <select
                  name="analysisProfiles"
                  id="analysisProfiles"
                  v-model="sample.profiles"
                  class="form-input mt-1"
                  multiple
                >
                  <option value=""></option>
                  <option
                    v-for="(profile, index) in analysesProfiles"
                    :key="profile.uid"
                    :value="profile.uid"
                  >
                    {{ profile.name }}
                  </option>
                </select>
              </label>

              <label class="flex flex-col whitespace-nowrap mb-2">
                <span class="text-gray-700">Analysis Services</span>
                <select
                  name="analysesServices"
                  id="analysesServices"
                  v-model="sample.analyses"
                  class="form-input mt-1"
                  multiple
                >
                  <option value=""></option>
                  <option
                    v-for="(service, index) in analysesServices"
                    :key="service.uid"
                    :value="service.uid"
                  >
                    {{ service.name }}
                  </option>
                </select>
              </label>
            </div>
            <div class="">
              <button
                @click.prevent="removeSample(index)"
                class="px-2 py-1 mr-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"
              >
                Remove
              </button>
            </div>
          </div>
          <hr />
        </div>
      </section>
      <hr />
      <button
        v-if="!arSaving"
        type="submit"
        class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
      >
        Add Sample(s)
      </button>
      <div v-else class="py-4 text-center">
        <LoadingMessage message="Adding Samples ..." />
      </div>
    </form>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
