<script setup lang="ts">
import VueMultiselect from "vue-multiselect";
import {computed, reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {usePatientStore} from "@/stores/patient";
import {useSampleStore} from "@/stores/sample";
import {useAnalysisStore} from "@/stores/analysis";
import {useClientStore} from "@/stores/client";
import {useBillingStore} from "@/stores/billing";
import {useSetupStore} from "@/stores/setup";
import { Spinner } from "@/components/ui/spinner";
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
import { useForm } from "vee-validate";
import { array, boolean, mixed, number, object, string } from "yup";
import useApiUtil from "@/composables/api_util";
import {formatDate} from "@/utils";
import dayjs from "dayjs";
import {useDebounceFn} from "@vueuse/core";
import SampleCostBreakdown from "@/components/billing/SampleCostBreakdown.vue";
import CostSummary from "@/components/billing/CostSummary.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {FormControl,
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

const sampleStore = useSampleStore();
const patientStore = usePatientStore();
const analysisStore = useAnalysisStore();
const clientStore = useClientStore();
const billingStore = useBillingStore();
const setupStore = useSetupStore();
const router = useRouter();

const {withClientMutation} = useApiUtil();

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
  setFieldValue("clientContact", null);
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

const sampleSchema = object({
  sampleType: object()
    .required("Sample type is required")
    .test("sample-type-uid", "Sample type is required", value => !!value?.uid),
  dateCollected: mixed().nullable(),
  dateReceived: mixed().nullable(),
  profiles: array().nullable(),
  analyses: array().nullable(),
}).test(
  "profiles-or-analyses",
  "Samples must have either profiles or services",
  value => (value?.profiles?.length ?? 0) + (value?.analyses?.length ?? 0) > 0
);

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
  samples: array().of(sampleSchema).required().min(1, "Add at least 1 sample"),
  priority: number(),
});

// Create default sample
function createDefaultSample(overrides): PartialSample {
  return {
    sampleType: null as unknown as SampleTypeTyp | null,
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

const { handleSubmit, values, setFieldValue } = useForm({
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

watch(
  () => values.client,
  (value) => {
    selectedClient.value = (value as ClientType | null) ?? null;
    if (values.clientContact && values.clientContact?.clientUid !== value?.uid) {
      setFieldValue("clientContact", null);
    }
  },
  { immediate: true }
);

type PartialSample = Pick<SampleType, "sampleType" | "profiles" | "analyses"> & {
  dateCollected?: Date | string | { toDate?: () => Date };
  dateReceived?: Date | string | { toDate?: () => Date };
};
const samples = computed(() => values.samples as PartialSample[]);

// Symptoms management
const newSymptom = ref("");
const addSymptom = () => {
  const trimmed = newSymptom.value.trim();
  if (!trimmed) return;
  const current = values.clinicalData?.symptoms ?? [];
  if (!current.includes(trimmed)) {
    setFieldValue("clinicalData.symptoms", [...current, trimmed]);
  }
  newSymptom.value = "";
};

const removeSymptom = (index: number) => {
  const current = values.clinicalData?.symptoms ?? [];
  setFieldValue("clinicalData.symptoms", current.filter((_, idx) => idx !== index));
};

const submitARForm = handleSubmit((values) => {
  arSaving.value = true;
  addAnalysesRequest(values as any);
});

// Analysis Request Add
function addAnalysesRequest(request: AnalysisRequestType): void {
  const payload = {
    patientUid: patient.value?.uid,
    clientRequestId: request.clientRequestId,
    clinicalData: request.clinicalData,
    clientUid: values.client?.uid,
    clientContactUid: values.clientContact?.uid,
    samples: request.samples?.map((s: SampleType) => {
      return {
        ...s,
        profiles: s.profiles?.map(p => p.uid),
        analyses: s.analyses?.map(a => a.uid),
        sampleType: s.sampleType?.uid,
        dateCollected: s.dateCollected
          ? formatDate(s.dateCollected, "YYYY-MM-DD HH:mm")
          : null,
        dateReceived: s.dateReceived
          ? formatDate(s.dateReceived, "YYYY-MM-DD HH:mm")
          : null,
      };
    }),
  } as unknown as AnalysisRequestInputType;
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
  setFieldValue("samples", [...samples.value, sample]);
}

function removeSample(index: number): void {
  // Prevent removing if only one sample remains
  if (samples.value.length > 1) {
    setFieldValue(
      "samples",
      samples.value.filter((_, idx) => idx !== index)
    );
  }
}

// Computed property to check if remove button should be disabled
const canRemoveSample = computed(() => samples.value.length > 1);

// Billing functionality
const billingEnabled = computed(() =>
    setupStore.getLaboratory?.settings?.allowBilling ?? false
);

const priceMap = computed(() => {
  const map = new Map<string, number>();
  billingStore.profilePrices.forEach((price, uid) => {
    map.set(`profile_${uid}`, price.amount);
  });
  billingStore.analysisPrices.forEach((price, uid) => {
    map.set(`analysis_${uid}`, price.amount);
  });
  return map;
});

const sampleCosts = computed(() => {
  return samples.value.map(sample => {
    let subtotal = 0;
    const breakdown = {profiles: [], analyses: [], subtotal: 0};

    // Calculate profile costs
    sample.profiles?.forEach(profile => {
      const price = priceMap.value.get(`profile_${profile.uid}`);
      if (price !== undefined) {
        subtotal += price;
        breakdown.profiles.push({name: profile.name, price});
      }
    });

    // Calculate analysis costs
    sample.analyses?.forEach(analysis => {
      const price = priceMap.value.get(`analysis_${analysis.uid}`);
      if (price !== undefined) {
        subtotal += price;
        breakdown.analyses.push({name: analysis.name, price});
      }
    });

    breakdown.subtotal = subtotal;
    return breakdown;
  });
});

const grandTotal = computed(() => {
  return sampleCosts.value.reduce((sum, cost) => sum + cost.subtotal, 0);
});

// Debounced price fetching
const debouncedFetchPrices = useDebounceFn((profileUids: string[], analysisUids: string[]) => {
  billingStore.fetchBatchPrices(profileUids, analysisUids);
}, 300);

watch(
    () => samples.value.map(s => ({
      profiles: s.profiles?.map(p => p.uid) ?? [],
      analyses: s.analyses?.map(a => a.uid) ?? []
    })),
    (newSelections) => {
      if (!billingEnabled.value) return;

      // Collect all unique UIDs
      const profileUids = new Set<string>();
      const analysisUids = new Set<string>();

      newSelections.forEach(selection => {
        selection.profiles.forEach(uid => profileUids.add(uid));
        selection.analyses.forEach(uid => analysisUids.add(uid));
      });

      // Debounced fetch
      if (profileUids.size > 0 || analysisUids.size > 0) {
        debouncedFetchPrices(Array.from(profileUids), Array.from(analysisUids));
      }
    },
    {deep: true}
);

// multiselect custom labels
const contactLabel = (contact: ClientContactType) => {
  return `${contact.firstName} ${contact.lastName}`;
}
</script>

<template>
  <div class="space-y-6">
    <h5 class="text-xl font-semibold text-foreground mb-4">Add Analysis Request</h5>
    <form class="relative p-6 bg-background rounded-lg shadow-sm space-y-6" @submit.prevent="submitARForm">
      <!-- Loading overlay -->
      <div
        v-if="arSaving"
        class="absolute inset-0 bg-background/10 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg"
        role="status"
        aria-live="polite"
      >
        <div class="flex flex-col items-center gap-4">
          <span class="inline-flex items-center gap-2">
            <Spinner class="size-5" />
            <span class="text-base">Adding Samples...</span>
          </span>
        </div>
      </div>

      <div class="space-y-4">
        <!-- Client, Contact, and Priority - Same Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField name="client" v-slot="{ value, handleChange }">
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <VueMultiselect
                  class="w-full"
                  placeholder="Select a Client"
                  :model-value="value"
                  @update:model-value="(next) => { handleChange(next); selectContact(next); }"
                  :options="clients"
                  :searchable="true"
                  :disabled="arSaving"
                  label="name"
                  track-by="uid"
                  :option-height="60"
                  :close-on-select="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="clientContact" v-slot="{ value, handleChange }">
            <FormItem>
              <FormLabel>Client Contact</FormLabel>
              <FormControl>
                <VueMultiselect
                  class="w-full"
                  placeholder="Select a Client Contact"
                  :model-value="value"
                  @update:model-value="handleChange"
                  :options="selectedClient?.contacts ?? []"
                  :custom-label="contactLabel"
                  :disabled="arSaving"
                  track-by="uid"
                  :close-on-select="true"
                  :searchable="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="priority" v-slot="{ value }">
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Select :model-value="String(value ?? 0)" @update:model-value="(val) => setFieldValue('priority', Number(val))" :disabled="arSaving">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Low</SelectItem>
                    <SelectItem value="1">Medium</SelectItem>
                    <SelectItem value="2">High</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <FormField name="clientRequestId" v-slot="{ componentField }">
          <FormItem>
            <FormLabel>Client Request ID</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                :disabled="arSaving"
                placeholder="CRID ..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Clinical Data Section - Collapsible -->
        <div class="border border-border rounded-lg bg-background/50">
          <Button
              type="button"
              variant="ghost"
              @click="clinicalDataExpanded = !clinicalDataExpanded"
              :disabled="arSaving"
              class="w-full px-4 py-3 flex items-center justify-between text-left rounded-t-lg"
          >
            <span class="text-sm font-medium text-foreground whitespace-nowrap">Clinical Data (click to expand)</span>
            <svg
                class="w-5 h-5 transition-transform duration-200"
                :class="{'rotate-180': clinicalDataExpanded }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </Button>

          <div v-if="clinicalDataExpanded" class="px-4 py-4 space-y-4 border-t border-border">
            <!-- Clinical Indication -->
            <FormField name="clinicalData.clinicalIndication" v-slot="{ componentField }">
              <FormItem class="flex items-center gap-x-4">
                <FormLabel class="whitespace-nowrap w-40">Clinical Indication</FormLabel>
                <FormControl class="w-full">
                  <Input
                    v-bind="componentField"
                    :disabled="arSaving"
                    placeholder="Enter clinical indication..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Symptoms -->
            <div class="flex flex-wrap mt-2">
              <span class="text-sm font-medium text-foreground w-40">Symptoms</span>
              <div class="flex gap-2">
                <Input
                  class="flex-1"
                  v-model="newSymptom"
                  :disabled="arSaving"
                  placeholder="Add symptom..."
                  @keydown.enter.prevent.stop="addSymptom"
                />
                <Button
                  type="button"
                  @click="addSymptom"
                  :disabled="arSaving"
                >
                  Add
                </Button>
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="(symptom, index) in values.clinicalData?.symptoms ?? []"
                  :key="index"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-md text-sm"
                >
                  {{ symptom }}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    @click="removeSymptom(index)"
                    :disabled="arSaving"
                  >
                    ×
                  </Button>
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
            <FormField name="clinicalData.treatmentNotes" v-slot="{ componentField }">
              <FormItem class="flex items-center gap-x-4">
                <FormLabel class="whitespace-nowrap w-40">Treatment Notes</FormLabel>
                <FormControl class="w-full">
                  <Textarea
                    v-bind="componentField"
                    :disabled="arSaving"
                    placeholder="Enter treatment notes..."
                    rows="2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Patient Status -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="clinicalData.pregnancyStatus" v-slot="{ value }">
                <FormItem class="flex items-center gap-x-4">
                  <FormLabel class="whitespace-nowrap w-40">Pregnancy Status</FormLabel>
                  <FormControl class="w-full">
                    <Select
                      :model-value="value === null || value === undefined ? 'null' : String(value)"
                      @update:model-value="(val) => setFieldValue('clinicalData.pregnancyStatus', val === 'null' ? null : val === 'true')"
                      :disabled="arSaving"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Not specified" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">Not specified</SelectItem>
                        <SelectItem value="true">Pregnant</SelectItem>
                        <SelectItem value="false">Not pregnant</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="clinicalData.breastFeeding" v-slot="{ value }">
                <FormItem class="flex items-center gap-x-4">
                  <FormLabel class="whitespace-nowrap w-40">Breastfeeding Status</FormLabel>
                  <FormControl class="w-full">
                    <Select
                      :model-value="value === null || value === undefined ? 'null' : String(value)"
                      @update:model-value="(val) => setFieldValue('clinicalData.breastFeeding', val === 'null' ? null : val === 'true')"
                      :disabled="arSaving"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Not specified" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">Not specified</SelectItem>
                        <SelectItem value="true">Breastfeeding</SelectItem>
                        <SelectItem value="false">Not breastfeeding</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
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
            <FormField name="samples" v-slot="{}">
              <FormItem>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button
              type="button"
              v-if="samples?.length !== 20"
              @click.prevent="addSample()"
              :disabled="arSaving"
            >
              Add Sample
            </Button>
          </div>
        </div>

        <div class="relative border border-border rounded-lg bg-background/50 overflow-visible">
          <!-- Fixed field labels column -->
          <div class="absolute left-0 top-0 bottom-0 w-48 bg-muted/30 border-r border-border z-10">
            <Table class="w-full h-full">
              <TableHeader>
              <TableRow class="border-b border-border bg-muted/30">
                <TableHead class="p-4 text-left text-sm font-medium text-foreground h-16">
                  Field
                </TableHead>
              </TableRow>
              </TableHeader>
              <TableBody>
              <TableRow class="border-b border-border h-20 min-h-20 max-h-20">
                <TableCell class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Sample Type
                </TableCell>
              </TableRow>
              <TableRow class="border-b border-border h-20 min-h-20 max-h-20">
                <TableCell class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Date Collected
                </TableCell>
              </TableRow>
              <TableRow class="border-b border-border h-20 min-h-20 max-h-20">
                <TableCell class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Date Received
                </TableCell>
              </TableRow>
              <TableRow class="border-b border-border h-20 min-h-20 max-h-20">
                <TableCell class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Analysis Profiles
                </TableCell>
              </TableRow>
              <TableRow class="border-b border-border h-20 min-h-20 max-h-20">
                <TableCell class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Analysis Services
                </TableCell>
              </TableRow>
              <TableRow v-if="billingEnabled" class="border-b border-border">
                <TableCell class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Cost Breakdown
                </TableCell>
              </TableRow>
              <TableRow class="h-24">
                <TableCell class="p-4 text-sm font-medium text-foreground bg-muted/10">
                  Selection Summary
                </TableCell>
              </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Scrollable samples content -->
          <div class="overflow-x-auto overflow-y-visible pl-48">
            <Table class="w-80 min-w-80">
              <TableHeader>
              <TableRow class="border-b border-border bg-muted/30">
                <TableHead v-for="(sample, index) in samples" :key="index"
                    class="p-4 text-center text-sm font-medium text-foreground w-80 min-w-80 relative h-16 border-r">
                  <div class="flex items-center justify-between">
                    <span>Sample {{ index + 1 }}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      @click.prevent="removeSample(index)"
                      :disabled="!canRemoveSample || arSaving"
                      :title="canRemoveSample && !arSaving ? 'Remove sample' : 'At least one sample is required'"
                    >
                      Remove
                    </Button>
                  </div>
                </TableHead>
              </TableRow>
              </TableHeader>
              <TableBody>
              <!-- Sample Type Row -->
              <TableRow class="border-b border-border hover:bg-muted/20 h-20 min-h-20 max-h-20">
                <TableCell v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r">
                  <VueMultiselect
                      class="w-full"
                      placeholder="Select sample type"
                      v-model="sample.sampleType"
                      :options="sampleTypes"
                      :searchable="true"
                      :disabled="arSaving"
                      label="name"
                      track-by="uid"
                      :openDirection="'below'"
                  />
                </TableCell>
              </TableRow>

              <!-- Date Collected Row -->
              <TableRow class="border-b border-border hover:bg-muted/20 h-20 min-h-20 max-h-20">
                <TableCell v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r">
                  <VueDatePicker
                      class="w-full"
                      v-model="sample.dateCollected"
                      :max-date="maxDate"
                      :disabled="arSaving"
                      time-picker-inline
                      :teleport="true"
                  />
                </TableCell>
              </TableRow>

              <!-- Date Received Row -->
              <TableRow class="border-b border-border hover:bg-muted/20 h-20 min-h-20 max-h-20">
                <TableCell v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r">
                  <VueDatePicker
                      class="w-full"
                      v-model="sample.dateReceived"
                      :min-date="sample.dateCollected && typeof sample.dateCollected === 'object' && !(sample.dateCollected instanceof Date) && typeof sample.dateCollected.toDate === 'function' ? sample.dateCollected.toDate() : sample.dateCollected || null"
                      :max-date="maxDate"
                      :disabled="arSaving"
                      time-picker-inline
                      :teleport="true"
                  />
                </TableCell>
              </TableRow>

              <!-- Analysis Profiles Row -->
              <TableRow class="border-b border-border hover:bg-muted/20 h-20 min-h-20 max-h-20">
                <TableCell v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r">
                  <VueMultiselect
                      class="w-full whitespace-nowrap z-10"
                      placeholder="Select analysis profiles"
                      v-model="sample.profiles"
                      :options="analysesProfiles"
                      :searchable="true"
                      :disabled="arSaving"
                      :multiple="true"
                      label="name"
                      track-by="uid"
                      :openDirection="'below'"
                  />
                </TableCell>
              </TableRow>

              <!-- Analysis Services Row -->
              <TableRow class="border-b border-border hover:bg-muted/20 h-20 min-h-20 max-h-20">
                <TableCell v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r">
                  <VueMultiselect
                      class="w-full whitespace-nowrap"
                      placeholder="Select analysis services"
                      v-model="sample.analyses"
                      :options="analysesServices"
                      :searchable="true"
                      :disabled="arSaving"
                      :multiple="true"
                      label="name"
                      track-by="uid"
                      :openDirection="'below'"
                  />
                </TableCell>
              </TableRow>

              <!-- Cost Breakdown Row (Only if billing enabled) -->
              <TableRow v-if="billingEnabled" class="border-b border-border hover:bg-muted/20">
                <TableCell v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r align-top">
                  <SampleCostBreakdown
                      :profiles="sample.profiles"
                      :analyses="sample.analyses"
                      :price-map="priceMap"
                      :loading="billingStore.fetchingPrices"
                  />
                </TableCell>
              </TableRow>

              <!-- Selection Summary Row -->
              <TableRow class="hover:bg-muted/20 h-24">
                <TableCell v-for="(sample, index) in samples" :key="index" class="p-4 w-80 border-r">
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
                </TableCell>
              </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <!-- Cost Summary (Only if billing enabled) -->
      <CostSummary
          v-if="billingEnabled"
          :sample-costs="sampleCosts"
          :grand-total="grandTotal"
          :currency="setupStore.getLaboratory?.settings?.currency ?? 'USD'"
          :loading="billingStore.fetchingPrices"
      />

      <div class="flex justify-end pt-4">
        <Button
          type="submit"
          :disabled="arSaving"
        >
          Save Sample(s)
        </Button>
      </div>
    </form>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
