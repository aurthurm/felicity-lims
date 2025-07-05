<script setup lang="ts">
import VueMultiselect from "vue-multiselect";
import {computed, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {usePatientStore} from "@/stores/patient";
import {useSampleStore} from "@/stores/sample";
import {useAnalysisStore} from "@/stores/analysis";
import {useClientStore} from "@/stores/client";
import {
  AnalysisRequestInputType,
  AnalysisRequestType,
  AnalysisType,
  ClientContactType,
  ClientType,
  ClinicalDataType,
  SampleType,
  SampleTypeTyp,
} from "@/types/gql";
import {
  AddAnalysisRequestDocument,
  AddAnalysisRequestMutation,
  AddAnalysisRequestMutationVariables
} from "@/graphql/operations/analyses.mutations";
import {useField, useForm} from "vee-validate";
import {array, boolean, number, object, string} from "yup";
import useNotifyToast from "@/composables/alert_toast";
import useApiUtil from "@/composables/api_util";
import {formatDate} from "@/utils";
import dayjs from "dayjs";

const sampleStore = useSampleStore();
const patientStore = usePatientStore();
const analysisStore = useAnalysisStore();
const clientStore = useClientStore();
const router = useRouter();

const {withClientMutation} = useApiUtil();
const {swalError} = useNotifyToast();

// Clinical Data Section State
const clinicalDataExpanded = ref(false);

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
const selectedClient = ref<ClientType | null>(null);
const selectContact = (client: ClientType) => {
  selectedClient.value = client;
  clientContact.value = null;
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

const analysesServices = computed<AnalysisType[]>(() => {
  const services: AnalysisType[] = analysisStore.getAnalysesServicesSimple;
  let s = new Set<AnalysisType>();
  services.forEach((service: AnalysisType, index: number) => {
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
const maxDate = dayjs().endOf('day').toDate();

const arSchema = object({
  clientRequestId: string().required("Client Request ID is Required"),
  clinicalData: object({
    clinicalIndication: string().nullable(),
    symptoms: array().of(string()),
    symptomsRaw: string().nullable(),
    treatmentNotes: string().nullable(),
    pregnancyStatus: boolean().nullable(),
    breastFeeding: boolean().nullable(),
    vitals: object().nullable(),
    otherContext: object().nullable(),
  }).nullable(),
  client: object().required("Client is Required"),
  clientContact: object().nullable().required("Client Contact is Required"),
  samples: array().required().min(1, "Add at least 1 sample"),
  priority: number(),
});

// Create default sample
function createDefaultSample(overrides): PartialSample {
  return {
    sampleType: {} as SampleTypeTyp,
    dateCollected: dayjs(new Date()),
    dateReceived: dayjs(new Date()),
    profiles: [],
    analyses: [],
    ...overrides
  };
}

// Create default clinical data
function createDefaultClinicalData() {
  return {
    clinicalIndication: "",
    symptoms: [],
    symptomsRaw: "",
    treatmentNotes: "",
    pregnancyStatus: null,
    breastFeeding: null,
    vitals: {
      // temperature: "",
      // bloodPressure: "",
      // heartRate: "",
      // respiratoryRate: "",
      // oxygenSaturation: "",
      // weight: "",
      // height: "",
    },
    otherContext: {},
  };
}

const {handleSubmit, errors} = useForm({
  validationSchema: arSchema,
  initialValues: {
    priority: 0,
    client: patient?.value?.client,
    samples: [createDefaultSample({})],
    clinicalData: createDefaultClinicalData(),
  } as any,
});

// Set selectedClient when patient's client is loaded
if (patient?.value?.client) {
  selectedClient.value = patient.value.client;
}

const {value: clientRequestId} = useField("clientRequestId");
const {value: clinicalData} = useField<ClinicalDataType>("clinicalData");
const {value: client} = useField<ClientType>("client");
const {value: clientContact} = useField<ClientContactType | null>("clientContact");
const {value: priority} = useField("priority");

type PartialSample = Pick<SampleType, "sampleType" | "profiles" | "analyses"> & {
  dateCollected?: Date | string | { toDate?: () => Date };
  dateReceived?: Date | string | { toDate?: () => Date };
};
const {value: samples} = useField<PartialSample[]>("samples");

// Symptoms management
const newSymptom = ref("");
const addSymptom = () => {
  if (newSymptom.value.trim() && !clinicalData.value?.symptoms?.includes(newSymptom.value.trim())) {
    clinicalData.value?.symptoms?.push(newSymptom.value.trim());
    newSymptom.value = "";
  }
};

const removeSymptom = (index: number) => {
  clinicalData.value?.symptoms?.splice(index, 1);
};

const submitARForm = handleSubmit((values) => {
  arSaving.value = true;
  console.log("values", values);
  for (let sample of values.samples || []) {
    if ([null, undefined, ""].includes(sample?.sampleType)) {
      swalError("Samples must have sample types");
      arSaving.value = false;
      return;
    }
    if (sample?.analyses?.length <= 0 && sample?.profiles?.length <= 0) {
      swalError("Samples must have either profiles/analyses or both");
      arSaving.value = false;
      return;
    }
  }

  addAnalysesRequest(values as any);
});

// Analysis Request Add
function addAnalysesRequest(request: AnalysisRequestType): void {
  const payload = {
    patientUid: patient.value?.uid,
    clientRequestId: request.clientRequestId,
    clinicalData: request.clinicalData,
    clientUid: client?.value?.uid,
    clientContactUid: clientContact?.value?.uid,
    samples: request.samples?.map((s: SampleType) => {
      return {
        ...s,
        profiles: s.profiles?.map(p => p.uid),
        analyses: s.analyses?.map(a => a.uid),
        sampleType: s.sampleType?.uid,
        dateCollected: formatDate(s.dateCollected, "YYYY-MM-DD HH:mm"),
        dateReceived: formatDate(s.dateReceived, "YYYY-MM-DD HH:mm"),
      };
    }),
  } as unknown as AnalysisRequestInputType;
  console.log(payload);
  withClientMutation<AddAnalysisRequestMutation, AddAnalysisRequestMutationVariables>(AddAnalysisRequestDocument, {payload}, "createAnalysisRequest")
      .then((result) => {
        sampleStore.addAnalysisRequest(result);
        router.push({name: "patient-detail", params: {patientUid: patient.value?.uid}});
      })
      .finally(() => {
        arSaving.value = false;
      });
}

function addSample(): void {
  const sample: PartialSample = createDefaultSample({});
  samples.value.push(sample);
}

function removeSample(index: number): void {
  // Prevent removing if only one sample remains
  if (samples.value.length > 1) {
    samples.value.splice(index, 1);
  }
}

// Computed property to check if remove button should be disabled
const canRemoveSample = computed(() => samples.value.length > 1);

// multiselect custom labels
const contactLabel = (contact: ClientContactType) => {
  return `${contact.firstName} ${contact.lastName}`;
}
</script>

<template>
  <div class="space-y-6">
    <h5 class="text-xl font-semibold text-foreground mb-4">Add Analysis Request</h5>
    <form action="post" class="p-6 bg-background rounded-lg shadow-sm space-y-6" @submit.prevent="submitARForm">
      <div class="space-y-4">
        <!-- Client, Contact, and Priority - Same Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <label class="flex items-center gap-x-4">
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
                :option-height="60"
                :close-on-select="true"
            />
          </label>

          <label class="flex items-center gap-x-4">
            <span class="text-sm font-medium text-foreground whitespace-nowrap">Client Contact</span>
            <VueMultiselect
                class="w-full"
                placeholder="Select a Client Contact"
                v-model="clientContact"
                :options="selectedClient?.contacts ?? []"
                :custom-label="contactLabel"
                track-by="uid"
                :close-on-select="true"
                :searchable="true"
            />
            <div class="text-sm text-destructive">{{ errors.clientContact }}</div>
          </label>

          <label class="flex items-center gap-x-4">
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

        <label class="flex items-center gap-x-4">
          <span class="text-sm font-medium text-foreground whitespace-nowrap">Client Request ID</span>
          <input
              class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              v-model="clientRequestId"
              placeholder="CRID ..."
          />
          <div class="text-sm text-destructive">{{ errors.clientRequestId }}</div>
        </label>

        <!-- Clinical Data Section - Collapsible -->
        <div class="border border-border rounded-lg bg-background/50">
          <button
              type="button"
              @click="clinicalDataExpanded = !clinicalDataExpanded"
              class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-muted/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-t-lg"
          >
            <span class="text-sm font-medium text-foreground whitespace-nowrap">Clinical Data (click to expand)</span>
            <svg
                class="w-5 h-5 transition-transform duration-200"
                :class="{ 'rotate-180': clinicalDataExpanded }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <div v-if="clinicalDataExpanded" class="px-4 py-4 space-y-4 border-t border-border">
            <!-- Clinical Indication -->
            <label class="flex items-center gap-x-4">
              <span class="text-sm font-medium text-foreground whitespace-nowrap w-40">Clinical Indication</span>
              <input
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  v-model="clinicalData.clinicalIndication"
                  placeholder="Enter clinical indication..."
              />
            </label>

            <!-- Symptoms -->
            <div class="flex flex-wrap mt-2">
              <span class="text-sm font-medium text-foreground w-40">Symptoms</span>
              <div class="flex gap-2">
                <input
                    class="flex-1 px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    v-model="newSymptom"
                    placeholder="Add symptom..."
                    @keydown.enter.prevent.stop="addSymptom"
                />
                <button
                    type="button"
                    @click="addSymptom"
                    class="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Add
                </button>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                    v-for="(symptom, index) in clinicalData.symptoms"
                    :key="index"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-md text-sm"
                >
                  {{ symptom }}
                  <button
                      type="button"
                      @click="removeSymptom(index)"
                      class="text-destructive hover:text-destructive/80 ml-1"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>

            <!-- Raw Symptoms -->
            <!--            <label class="flex items-center gap-x-4">-->
            <!--              <span class="text-sm font-medium text-foreground whitespace-nowrap">Raw Symptoms (Other)</span>-->
            <!--              <textarea-->
            <!--                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"-->
            <!--                  v-model="clinicalData.symptomsRaw"-->
            <!--                  placeholder="Enter raw symptoms description..."-->
            <!--                  rows="3"-->
            <!--              />-->
            <!--            </label>-->

            <!-- Treatment Notes -->
            <label class="flex items-center gap-x-4">
              <span class="text-sm font-medium text-foreground whitespace-nowrap w-40">Treatment Notes</span>
              <textarea
                  class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  v-model="clinicalData.treatmentNotes"
                  placeholder="Enter treatment notes..."
                  rows="2"
              />
            </label>

            <!-- Patient Status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="flex items-center gap-x-4">
                <span class="text-sm font-medium text-foreground whitespace-nowrap w-40">Pregnancy Status</span>
                <select
                    v-model="clinicalData.pregnancyStatus"
                    class="w-full ml-4 px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option :value="null">Not specified</option>
                  <option :value="true">Pregnant</option>
                  <option :value="false">Not pregnant</option>
                </select>
              </label>

              <label class="flex items-center gap-x-4">
                <span class="text-sm font-medium text-foreground whitespace-nowrap w-40">Breastfeeding Status</span>
                <select
                    v-model="clinicalData.breastFeeding"
                    class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option :value="null">Not specified</option>
                  <option :value="true">Breastfeeding</option>
                  <option :value="false">Not breastfeeding</option>
                </select>
              </label>
            </div>

            <!-- Vitals -->
            <!-- <div class="space-y-2">
              <span class="text-sm font-medium text-foreground whitespace-nowrap">Vital Signs</span>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <label class="flex flex-col space-y-1">
                  <span class="text-xs text-muted-foreground whitespace-nowrap">Temperature (°C)</span>
                  <input
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      v-model="clinicalData.vitals?.temperature!"
                      placeholder="36.5"
                  />
                </label>
                <label class="flex flex-col space-y-1">
                  <span class="text-xs text-muted-foreground whitespace-nowrap">Blood Pressure (mmHg)</span>
                  <input
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      v-model="clinicalData.vitals?.bloodPressure!"
                      placeholder="120/80"
                  />
                </label>
                <label class="flex flex-col space-y-1">
                  <span class="text-xs text-muted-foreground whitespace-nowrap">Heart Rate (bpm)</span>
                  <input
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      v-model="clinicalData.vitals?.heartRate!"
                      placeholder="72"
                  />
                </label>
                <label class="flex flex-col space-y-1">
                  <span class="text-xs text-muted-foreground whitespace-nowrap">Respiratory Rate (breaths/min)</span>
                  <input
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      v-model="clinicalData.vitals?.respiratoryRate!"
                      placeholder="16"
                  />
                </label>
                <label class="flex flex-col space-y-1">
                  <span class="text-xs text-muted-foreground whitespace-nowrap">Oxygen Saturation (%)</span>
                  <input
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      v-model="clinicalData.vitals?.oxygenSaturation!"
                      placeholder="98"
                  />
                </label>
                <label class="flex flex-col space-y-1">
                  <span class="text-xs text-muted-foreground whitespace-nowrap">Weight (kg)</span>
                  <input
                      class="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      v-model="clinicalData.vitals?.weight!"
                      placeholder="70"
                  />
                </label>
              </div>
            </div> -->
          </div>
        </div>
      </div>

      <section id="samples" class="space-y-4">
        <div class="flex justify-between items-center">
          <h5 class="text-lg font-semibold text-foreground">Samples</h5>
          <div class="flex items-center gap-4">
            <span class="text-sm text-destructive">{{ errors.samples }}</span>
            <button
                type="button"
                v-if="samples?.length !== 20"
                @click.prevent="addSample()"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Add Sample
            </button>
          </div>
        </div>

        <div class="relative border border-border rounded-lg bg-background/50 overflow-visible">
          <!-- Fixed field labels column -->
          <div class="absolute left-0 top-0 bottom-0 w-48 bg-muted/30 border-r border-border z-10">
            <table class="w-full h-full">
              <thead>
              <tr class="border-b border-border bg-muted/30">
                <th class="p-4 text-left text-sm font-medium text-foreground h-16">
                  Field
                </th>
              </tr>
              </thead>
              <tbody>
              <tr class="border-b border-border h-20 min-h-20 max-h-20">
                <td class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Sample Type
                </td>
              </tr>
              <tr class="border-b border-border h-20 min-h-20 max-h-20">
                <td class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Date Collected
                </td>
              </tr>
              <tr class="border-b border-border h-20 min-h-20 max-h-20">
                <td class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Date Received
                </td>
              </tr>
              <tr class="border-b border-border h-20 min-h-20 max-h-20">
                <td class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Analysis Profiles
                </td>
              </tr>
              <tr class="border-b border-border h-20 min-h-20 max-h-20">
                <td class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Analysis Services
                </td>
              </tr>
              <tr class="h-24">
                <td class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Selection Summary
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- Scrollable samples content -->
          <div class="overflow-x-auto overflow-y-visible pl-48">
            <table class="w-80 min-w-80">
              <thead>
              <tr class="border-b border-border bg-muted/30">
                <th v-for="(sample, index) in samples" :key="index"
                    class="p-4 text-center text-sm font-medium text-foreground w-80 min-w-80 relative h-16 border-r">
                  <div class="flex items-center justify-between">
                    <span>Sample {{ index + 1 }}</span>
                    <button
                        type="button"
                        @click.prevent="removeSample(index)"
                        :disabled="!canRemoveSample"
                        :class="[
                          'px-2 py-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 text-xs ml-2',
                          canRemoveSample
                            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/50'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        ]"
                        :title="canRemoveSample ? 'Remove sample' : 'At least one sample is required'"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              </tr>
              </thead>
              <tbody>
              <!-- Sample Type Row -->
              <tr class="border-b border-border hover:bg-muted/20 h-20 min-h-20 max-h-20">
                <td v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r">
                  <VueMultiselect
                      class="w-full"
                      placeholder="Select sample type"
                      v-model="sample.sampleType"
                      :options="sampleTypes"
                      :searchable="true"
                      label="name"
                      track-by="uid"
                      :openDirection="'below'"
                  />
                </td>
              </tr>

              <!-- Date Collected Row -->
              <tr class="border-b border-border hover:bg-muted/20 h-20 min-h-20 max-h-20">
                <td v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r">
                  <VueDatePicker
                      class="w-full"
                      v-model="sample.dateCollected"
                      :max-date="maxDate"
                      time-picker-inline
                      :teleport="true"
                  />
                </td>
              </tr>

              <!-- Date Received Row -->
              <tr class="border-b border-border hover:bg-muted/20 h-20 min-h-20 max-h-20">
                <td v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r">
                  <VueDatePicker
                      class="w-full"
                      v-model="sample.dateReceived"
                      :min-date="sample.dateCollected && typeof sample.dateCollected === 'object' && !(sample.dateCollected instanceof Date) && typeof sample.dateCollected.toDate === 'function' ? sample.dateCollected.toDate() : sample.dateCollected || null"
                      :max-date="maxDate"
                      time-picker-inline
                      :teleport="true"
                  />
                </td>
              </tr>

              <!-- Analysis Profiles Row -->
              <tr class="border-b border-border hover:bg-muted/20 h-20 min-h-20 max-h-20">
                <td v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r">
                  <VueMultiselect
                      class="w-full whitespace-nowrap z-10"
                      placeholder="Select analysis profiles"
                      v-model="sample.profiles"
                      :options="analysesProfiles"
                      :searchable="true"
                      :multiple="true"
                      label="name"
                      track-by="uid"
                      :openDirection="'below'"
                  />
                </td>
              </tr>

              <!-- Analysis Services Row -->
              <tr class="border-b border-border hover:bg-muted/20 h-20 min-h-20 max-h-20">
                <td v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r">
                  <VueMultiselect
                      class="w-full whitespace-nowrap"
                      placeholder="Select analysis services"
                      v-model="sample.analyses"
                      :options="analysesServices"
                      :searchable="true"
                      :multiple="true"
                      label="name"
                      track-by="uid"
                      :openDirection="'below'"
                  />
                </td>
              </tr>

              <!-- Selection Summary Row -->
              <tr class="hover:bg-muted/20 h-24">
                <td v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r">
                  <div class="p-3 bg-muted/50 rounded-md text-sm space-y-1">
                    <div v-if="sample.profiles?.length === 0 && sample.analyses?.length === 0"
                         class="text-xs text-destructive whitespace-nowrap">
                      ⚠️ Select profiles or services
                    </div>
                    <div v-else>
                      <div class="text-xs text-muted-foreground">
                        <strong>Profiles:</strong> {{ sample.profiles?.length || 0 }} selected
                      </div>
                      <div class="text-xs text-muted-foreground">
                        <strong>Services:</strong> {{ sample.analyses?.length || 0 }} selected
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div class="flex justify-end pt-4">
        <button
            v-if="!arSaving"
            type="submit"
            class="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Save Sample(s)
        </button>
        <div v-else class="py-4 text-center">
          <fel-loader message="Adding Samples ..."/>
        </div>
      </div>
    </form>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
