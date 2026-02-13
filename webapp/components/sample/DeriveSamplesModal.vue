<script setup lang="ts">
import { computed, defineAsyncComponent, reactive, ref, watch } from "vue";
import { AnalysisType, ProfileType, SampleType } from "@/types/gql";
import useApiUtil from "@/composables/api_util";
import useNotifyToast from "@/composables/alert_toast";
import { useSampleStore } from "@/stores/sample";
import { useAnalysisStore } from "@/stores/analysis";
import {
  DeriveAnalysisRequestDocument,
  DeriveAnalysisRequestMutation,
  DeriveAnalysisRequestMutationVariables,
} from "@/graphql/operations/analyses.mutations";

const VueMultiselect = defineAsyncComponent(
  () => import("vue-multiselect")
);

type DeriveConfig = {
  sample: SampleType;
  quantity: number;
  sampleTypeUid: string | null;
  overrideTests: boolean;
  profiles: ProfileType[];
  analyses: AnalysisType[];
  notes: string;
};

const props = defineProps<{
  show: boolean;
  samples: SampleType[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "derived", samples: SampleType[]): void;
}>();

const sampleStore = useSampleStore();
const analysisStore = useAnalysisStore();
const { withClientMutation } = useApiUtil();
const { toastSuccess, toastError } = useNotifyToast();

const sampleTypes = computed(() => sampleStore.getSampleTypes || []);
const analysesServices = computed(() => analysisStore.getAnalysesServicesSimple || []);
const analysesProfiles = computed(() => analysisStore.getAnalysesProfiles || []);

const deriveMode = ref<"aliquot" | "derivative" | "pool">("aliquot");
const deriveConfigs = ref<DeriveConfig[]>([]);
const poolConfig = reactive({
  parents: [] as SampleType[],
  sampleTypeUid: null as string | null,
  overrideTests: false,
  profiles: [] as ProfileType[],
  analyses: [] as AnalysisType[],
  notes: "",
});
const deriveSaving = ref(false);

const canPool = computed(() => deriveConfigs.value.length > 1);

const initConfig = () => {
  deriveConfigs.value = props.samples.map((sample) => ({
    sample,
    quantity: 1,
    sampleTypeUid: sample.sampleType?.uid ?? null,
    overrideTests: false,
    profiles: [],
    analyses: [],
    notes: "",
  }));
  poolConfig.parents = [...props.samples];
  poolConfig.sampleTypeUid = props.samples[0]?.sampleType?.uid ?? null;
  poolConfig.overrideTests = false;
  poolConfig.profiles = [];
  poolConfig.analyses = [];
  poolConfig.notes = "";
  if (!canPool.value && deriveMode.value === "pool") {
    deriveMode.value = "aliquot";
  }
};

watch(
  () => props.show,
  async (show) => {
    if (!show) return;
    if (!sampleTypes.value.length) {
      await sampleStore.fetchSampleTypes();
    }
    if (!analysesProfiles.value.length || !analysesServices.value.length) {
      await analysisStore.fetchAnalysesProfilesAndServices();
    }
    initConfig();
  }
);

const submitDeriveRequest = async () => {
  const payload: DeriveAnalysisRequestMutationVariables["payload"] = {};

  if (deriveMode.value === "aliquot") {
    const aliquots = deriveConfigs.value.map((config) => ({
      parentSampleUid: config.sample.uid,
      quantity: config.quantity,
      sampleTypeUid: config.sampleTypeUid,
      profiles: config.overrideTests ? config.profiles.map((p) => p.uid) : null,
      analyses: config.overrideTests ? config.analyses.map((a) => a.uid) : null,
      notes: config.notes || null,
      metadataSnapshot: null,
    }));

    if (aliquots.some((config) => (config.quantity ?? 1) < 1)) {
      toastError("Aliquot quantity must be at least 1.");
      return;
    }
    if (
      aliquots.some(
        (config) =>
          config.profiles?.length === 0 &&
          config.analyses?.length === 0
      )
    ) {
      toastError("Aliquot overrides must include at least one profile or analysis.");
      return;
    }

    payload.aliquots = aliquots;
  } else if (deriveMode.value === "derivative") {
    const derivatives = deriveConfigs.value.map((config) => ({
      parentSampleUid: config.sample.uid,
      quantity: config.quantity,
      sampleTypeUid: config.sampleTypeUid,
      profiles: config.overrideTests ? config.profiles.map((p) => p.uid) : null,
      analyses: config.overrideTests ? config.analyses.map((a) => a.uid) : null,
      notes: config.notes || null,
      metadataSnapshot: null,
    }));

    if (derivatives.some((config) => !config.sampleTypeUid)) {
      toastError("Derivative sample type is required.");
      return;
    }
    if (derivatives.some((config) => (config.quantity ?? 1) < 1)) {
      toastError("Derivative quantity must be at least 1.");
      return;
    }
    if (
      derivatives.some(
        (config) =>
          config.profiles?.length === 0 &&
          config.analyses?.length === 0
      )
    ) {
      toastError("Derivative overrides must include at least one profile or analysis.");
      return;
    }

    payload.derivatives = derivatives;
  } else {
    const parentSampleUids = poolConfig.parents.map((sample) => sample.uid);
    if (parentSampleUids.length < 2) {
      toastError("Pools require at least two parent samples.");
      return;
    }

    const poolProfiles = poolConfig.overrideTests
      ? poolConfig.profiles.map((p) => p.uid)
      : null;
    const poolAnalyses = poolConfig.overrideTests
      ? poolConfig.analyses.map((a) => a.uid)
      : null;

    if (poolProfiles?.length === 0 && poolAnalyses?.length === 0) {
      toastError("Pool overrides must include at least one profile or analysis.");
      return;
    }

    payload.pools = [
      {
        parentSampleUids,
        sampleTypeUid: poolConfig.sampleTypeUid,
        profiles: poolProfiles,
        analyses: poolAnalyses,
        notes: poolConfig.notes || null,
        metadataSnapshot: null,
      },
    ];
  }

  deriveSaving.value = true;
  try {
    const response = await withClientMutation<
      DeriveAnalysisRequestMutation,
      DeriveAnalysisRequestMutationVariables
    >(DeriveAnalysisRequestDocument, { payload }, "deriveAnalysisRequest");

    if (response?.samples?.length) {
      emit("derived", response.samples as SampleType[]);
      toastSuccess("Derived samples created successfully.");
    }
    emit("close");
  } catch (error) {
    toastError(
      `Failed to derive samples: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  } finally {
    deriveSaving.value = false;
  }
};
</script>

<template>
  <fel-modal v-if="show" @close="emit('close')" :content-width="'w-4/5'">
    <template #header>
      Derive Samples
    </template>
    <template #body>
      <div class="space-y-6">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="px-3 py-1.5 rounded-md border text-sm"
            :class="deriveMode === 'aliquot' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground'"
            @click="deriveMode = 'aliquot'"
          >
            Aliquot
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-md border text-sm"
            :class="deriveMode === 'derivative' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground'"
            @click="deriveMode = 'derivative'"
          >
            Derivative
          </button>
          <button
            type="button"
            class="px-3 py-1.5 rounded-md border text-sm"
            :disabled="!canPool"
            :class="[
              deriveMode === 'pool'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border text-foreground',
              !canPool ? 'opacity-50 cursor-not-allowed' : ''
            ]"
            @click="deriveMode = 'pool'"
          >
            Pool
          </button>
        </div>

        <div v-if="deriveMode !== 'pool'" class="space-y-4">
          <div
            v-for="config in deriveConfigs"
            :key="config.sample.uid"
            class="rounded-md border border-border p-4 space-y-4"
          >
            <div class="flex items-center justify-between">
              <div class="font-medium text-foreground">{{ config.sample.sampleId }}</div>
              <div class="text-xs text-muted-foreground">{{ config.sample.sampleType?.name }}</div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="text-sm font-medium text-foreground">Quantity</label>
                <input
                  v-model.number="config.quantity"
                  type="number"
                  min="1"
                  class="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label class="text-sm font-medium text-foreground">
                  {{ deriveMode === 'derivative' ? 'Sample Type (required)' : 'Sample Type (optional)' }}
                </label>
                <select
                  v-model="config.sampleTypeUid"
                  class="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option :value="null" v-if="deriveMode === 'aliquot'">Use parent sample type</option>
                  <option disabled :value="null" v-else>Select sample type</option>
                  <option v-for="type in sampleTypes" :key="type.uid" :value="type.uid">
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div class="flex items-center gap-2 pt-6">
                <input type="checkbox" v-model="config.overrideTests" />
                <span class="text-sm text-foreground">Override tests</span>
              </div>
            </div>

            <div v-if="config.overrideTests" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-foreground">Profiles</label>
                <VueMultiselect
                  v-model="config.profiles"
                  :options="analysesProfiles"
                  label="name"
                  track-by="uid"
                  :multiple="true"
                  placeholder="Select profiles"
                  class="multiselect-primary"
                />
              </div>
              <div>
                <label class="text-sm font-medium text-foreground">Analyses</label>
                <VueMultiselect
                  v-model="config.analyses"
                  :options="analysesServices"
                  label="name"
                  track-by="uid"
                  :multiple="true"
                  placeholder="Select analyses"
                  class="multiselect-primary"
                />
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-foreground">Notes</label>
              <input
                v-model="config.notes"
                type="text"
                class="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div>
            <label class="text-sm font-medium text-foreground">Parent Samples (min 2)</label>
            <VueMultiselect
              v-model="poolConfig.parents"
              :options="deriveConfigs.map((config) => config.sample)"
              label="sampleId"
              track-by="uid"
              :multiple="true"
              placeholder="Select parent samples"
              class="multiselect-primary"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-foreground">Sample Type (optional)</label>
            <select
              v-model="poolConfig.sampleTypeUid"
              class="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option :value="null">Use first parent sample type</option>
              <option v-for="type in sampleTypes" :key="type.uid" :value="type.uid">
                {{ type.name }}
              </option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="poolConfig.overrideTests" />
            <span class="text-sm text-foreground">Override tests</span>
          </div>

          <div v-if="poolConfig.overrideTests" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-foreground">Profiles</label>
              <VueMultiselect
                v-model="poolConfig.profiles"
                :options="analysesProfiles"
                label="name"
                track-by="uid"
                :multiple="true"
                placeholder="Select profiles"
                class="multiselect-primary"
              />
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Analyses</label>
              <VueMultiselect
                v-model="poolConfig.analyses"
                :options="analysesServices"
                label="name"
                track-by="uid"
                :multiple="true"
                placeholder="Select analyses"
                class="multiselect-primary"
              />
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-foreground">Notes</label>
            <input
              v-model="poolConfig.notes"
              type="text"
              class="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md shadow-sm hover:bg-muted"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 disabled:opacity-60"
          :disabled="deriveSaving"
          @click="submitDeriveRequest"
        >
          Create
        </button>
      </div>
    </template>
  </fel-modal>
</template>

<style scoped>
@reference "@tw";

:deep(.multiselect-primary) {
  @apply bg-background text-foreground;
}
</style>
