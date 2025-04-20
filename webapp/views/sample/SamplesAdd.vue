<script setup lang="ts">
import VueMultiselect from "vue-multiselect";
import { ref, reactive, computed, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { usePatientStore } from "@/stores/patient";
import { useSampleStore } from "@/stores/sample";
import { useAnalysisStore } from "@/stores/analysis";
import { useClientStore } from "@/stores/client";
import {
  IAnalysisProfile,
  IAnalysisRequest,
  IAnalysisService,
  ISample,
  ISampleType,
} from "@/models/analysis";
import { AddAnalysisRequestDocument, AddAnalysisRequestMutation, AddAnalysisRequestMutationVariables } from "@/graphql/operations/analyses.mutations";
import { useField, useForm } from "vee-validate";
import { object, string, array, number } from "yup";
import { IClient } from "@/models/client";
import useNotifyToast from "@/composables/alert_toast";
import useApiUtil from "@/composables/api_util";
import { formatDate } from "@/utils";

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
  contacts: true
});
clientStore.fetchClients(clientParams);

const clients = computed(() => clientStore.getClients);
const selectedClient = ref<IClient | null>(null);
const selectContact = (client: IClient) => {
  selectedClient.value = client;
};

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
const maxDate = new Date();

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
    client: patient?.value?.client,
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
    if (typeof sample?.sampleType !== "string") {
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
    samples: request.samples?.map((s: ISample) => {
      return {
        ...s,
        dateCollected: formatDate(s.dateCollected, "YYYY-MM-DD HH:mm"),
      };
    }),
  };
  withClientMutation<AddAnalysisRequestMutation, AddAnalysisRequestMutationVariables>(AddAnalysisRequestDocument, { payload }, "createAnalysisRequest")
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
    dateCollected: "",
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
  <div class="space-y-6">
    <h5 class="text-xl font-semibold text-foreground mb-4">Add Analysis Request</h5>
    <form action="post" class="p-6 bg-background rounded-lg shadow-sm space-y-6" @submit.prevent="submitARForm">
      <div class="space-y-4">
        <label class="flex flex-col space-y-2">
          <span class="text-sm font-medium text-foreground">Client Request ID</span>
          <input 
            class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
            v-model="clientRequestId" 
            placeholder="CRID ..." 
          />
          <div class="text-sm text-destructive">{{ errors.clientRequestId }}</div>
        </label>

        <label class="flex flex-col space-y-2">
          <span class="text-sm font-medium text-foreground">Clinical Data</span>
          <textarea 
            class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" 
            v-model="clinicalData" 
            placeholder="Clinical Data ..." 
          />
          <div class="text-sm text-destructive">{{ errors.clinicalData }}</div>
        </label>

        <label class="flex flex-col space-y-2">
          <span class="text-sm font-medium text-foreground">Client</span>
          <VueMultiselect 
            class="w-full" 
            placeholder="Select a Client" 
            v-model="client" 
            :options="clients" 
            :searchable="true"
            label="name" 
            track-by="uid" 
            @select="selectContact"
          />
        </label>

        <label class="flex flex-col space-y-2">
          <span class="text-sm font-medium text-foreground">Client Contacts</span>
          <select 
            name="clientContacts" 
            id="clientContacts" 
            v-model="clientContactUid"
            class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Select client contact"
          >
            <option value=""></option>
            <option v-for="contact in client?.contacts" :key="contact.uid" :value="contact.uid">
              {{ contact.firstName }} {{ contact.lastName }}
            </option>
          </select>
          <div class="text-sm text-destructive">{{ errors.clientContactUid }}</div>
        </label>

        <label class="flex flex-col space-y-2">
          <span class="text-sm font-medium text-foreground">Priority</span>
          <select 
            name="priority" 
            id="priority" 
            v-model="priority"
            class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Select priority level"
          >
            <option value=0>Low</option>
            <option value=1>Medium</option>
            <option value=2>High</option>
          </select>
          <div class="text-sm text-destructive">{{ errors.priority }}</div>
        </label>
      </div>

      <section id="samples" class="space-y-4">
        <div class="flex justify-between items-center">
          <h5 class="text-lg font-semibold text-foreground">Samples</h5>
          <span class="text-sm text-destructive">{{ errors.samples }}</span>
          <button 
            v-if="samples?.length !== 20" 
            @click.prevent="addSample()"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Add Sample
          </button>
        </div>

        <div v-for="(sample, index) in samples" :key="index" class="space-y-4 p-4 border border-border rounded-lg">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 space-y-4">
              <label class="flex flex-col space-y-2">
                <span class="text-sm font-medium text-foreground">Sample Type</span>
                <select 
                  name="sampleTypes" 
                  id="sampleTypes" 
                  v-model="sample.sampleType" 
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Select sample type"
                >
                  <option value=""></option>
                  <option v-for="sampleType in sampleTypes" :key="sampleType.uid" :value="sampleType.uid">
                    {{ sampleType.name }}
                  </option>
                </select>
              </label>

              <label class="flex flex-col space-y-2">
                <span class="text-sm font-medium text-foreground">Date Collected</span>
                <VueDatePicker 
                  class="w-full" 
                  v-model="sample.dateCollected" 
                  :max-date="maxDate" 
                  time-picker-inline
                />
              </label>

              <label class="flex flex-col space-y-2">
                <span class="text-sm font-medium text-foreground">Analysis Profiles</span>
                <select 
                  name="analysisProfiles" 
                  id="analysisProfiles" 
                  v-model="sample.profiles" 
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  multiple
                  aria-label="Select analysis profiles"
                >
                  <option value=""></option>
                  <option v-for="profile in analysesProfiles" :key="profile.uid" :value="profile.uid">
                    {{ profile.name }}
                  </option>
                </select>
              </label>

              <label class="flex flex-col space-y-2">
                <span class="text-sm font-medium text-foreground">Analysis Services</span>
                <select 
                  name="analysesServices" 
                  id="analysesServices" 
                  v-model="sample.analyses" 
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  multiple
                  aria-label="Select analysis services"
                >
                  <option value=""></option>
                  <option v-for="service in analysesServices" :key="service.uid" :value="service.uid">
                    {{ service.name }}
                  </option>
                </select>
              </label>
            </div>
            <button 
              @click.prevent="removeSample(index)"
              class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-destructive/50"
            >
              Remove
            </button>
          </div>
        </div>
      </section>

      <div class="flex justify-end pt-4">
        <button 
          v-if="!arSaving" 
          type="submit"
          class="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Add Sample(s)
        </button>
        <div v-else class="py-4 text-center">
          <fel-loader message="Adding Samples ..." />
        </div>
      </div>
    </form>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
