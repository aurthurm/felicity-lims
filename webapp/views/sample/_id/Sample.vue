<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, reactive, ref, watch, defineAsyncComponent } from "vue";
import { ProfileType, AnalysisType, SampleType } from "@/types/gql";
import useSampleComposable from "@/composables/samples";
import { useSampleStore } from "@/stores/sample";
import { useRoute, useRouter } from "vue-router";
import { parseDate } from "@/utils";
import useApiUtil from "@/composables/api_util";
import {
  GetSampleGenealogyDocument,
  GetSampleGenealogyQuery,
  GetSampleGenealogyQueryVariables,
} from "@/graphql/operations/analyses.queries";

const sampleStore = useSampleStore();
const route = useRoute();
const router = useRouter();
const { withClientQuery } = useApiUtil();
const DeriveSamplesModal = defineAsyncComponent(
  () => import("@/components/sample/DeriveSamplesModal.vue")
);

sampleStore.resetSample();

const {
  cancelSamples,
  reInstateSamples,
  receiveSamples,
  invalidateSamples,
  publishSamples,
  verifySamples,
  recoverSamples
} = useSampleComposable();

const state = reactive({
  dropdownOpen: false,
});

const { sample, fetchingSample, repeatSample } = storeToRefs(sampleStore);
sampleStore.fetchSampleByUid(route.params.sampleUid as string);

watch(
  () => sample?.value?.status,
  (statusIn, _) => {
    if (!statusIn) return;
    if (statusIn !== "invalidated") {
      sampleStore.resetRepeatSample();
      return;
    } else {
      sampleStore.fetchRepeatSampleByParentId(route.params.sampleUid as string);
    }
  }
);

watch(
  () => route.params.sampleUid,
  (sampleUid, prev) => {
    sampleStore.fetchSampleByUid(sampleUid as string);
  }
);

function profileAnalysesText(
  profiles?: ProfileType[],
  analyses?: AnalysisType[]
): string {
  let names: string[] = [];
  profiles?.forEach((p) => names.push(p.name!));
  analyses?.forEach((a) => names.push(a.name!));
  return names.join(", ");
}

function relationshipBadge(rel?: string | null): string | null {
  if (!rel) return null;
  const value = rel.toLowerCase();
  if (value.startsWith("der")) return "D";
  if (value.startsWith("ali")) return "A";
  if (value.startsWith("poo")) return "P";
  return rel.charAt(0).toUpperCase();
}

const canReceive = computed(() => {
  if (["expected"].includes(sample?.value?.status?.toLowerCase()!)) return true;
  return false;
});

const receiveSample = async () => receiveSamples([sample?.value?.uid!]);

const canCancel = computed(() => {
    if (["received", "expected"].includes(sample?.value?.status?.toLowerCase()!))
      return true;
    return false;
  });

const cancelSample = async () => cancelSamples([sample?.value?.uid!]);

const canReinstate = computed(() => {
    if (["cancelled"].includes(sample?.value?.status?.toLowerCase()!)) return true;
    return false;
  });

const reInstateSample = async () => reInstateSamples([sample?.value?.uid!]);

const canVerify = computed(() => {
    if (sample?.value?.status?.toLowerCase() === "awaiting") return true;
    return false;
  });

const verifySample = async () => verifySamples([sample?.value?.uid!]);

const canInvalidate = computed(() => {
    if (sample?.value?.status?.toLowerCase() === "published") return true;
    return false;
  });

const publishText = computed(() => {
  if (["approved"].includes(sample?.value?.status?.toLowerCase()!)) return "Publish";
  if (["published"].includes(sample?.value?.status?.toLowerCase()!))
    return "Re publish";
  return "Pre publish";
});

const canPublish = computed(() => {
    if (
      ["awaiting", "approved", "published"].includes(
        sample?.value?.status?.toLowerCase()!
      )
    )
      return true;
    const results = sampleStore.analysisResults;
    if (
      ["received", "paired"].includes(sample?.value?.status?.toLowerCase() ?? "") &&
      results?.some((r) => ["approved"].includes(r.status?.toLowerCase() ?? ""))
    ) {
      return true;
    }
    return false;
  });

const publishSample = async () => {
    const action = publishText.value.startsWith("Pre")
      ? "pre-publish"
      : publishText.value.startsWith("Re")
        ? "re-publish"
        : "publish";
    publishSamples([{ uid: sample?.value?.uid!, action }]);
  };

const invalidateSample = async () =>
  invalidateSamples([sample?.value?.uid!]).then((res: SampleType[]) => {
    let inv = res?.filter((s) => s.uid !== sample?.value?.uid);
    if (inv.length > 0) sampleStore.setRepeatSample(inv[0]);
  });
  
const printBarCooe = async () => router.push({ 
  name: "print-barcodes",
  state: { sampleUids: JSON.stringify([sample?.value?.uid!]) }
});

const canReject = computed(() => {
  if (["received", "expected"].includes(sample?.value?.status?.toLowerCase()!))
    return true;
  return false;
});

const rejectSample = async () => {
  router.push({ name: "reject-samples", state: { samples: JSON.stringify([sample?.value]) } });
};

const canRecover = computed(() => {
  if (["stored"].includes(sample?.value?.status?.toLowerCase()!)) return true;
  return false;
});

const recoverSample = async () => recoverSamples([sample?.value?.uid!]);

// sample storage
const goToStorage = async (sample?: SampleType) => {
  router.push({ path: "/bio-banking", state: { sample: JSON.stringify(sample) } });
};

type SampleGenealogyNode = NonNullable<GetSampleGenealogyQuery["sampleGenealogy"]>;

const showGenealogyModal = ref(false);
const genealogyLoading = ref(false);
const genealogyError = ref<string | null>(null);
const genealogy = ref<SampleGenealogyNode | null>(null);

const genealogyRows = computed(() => {
  if (!genealogy.value?.children?.length) return [];
  const rows: Array<{ node: SampleGenealogyNode; depth: number }> = [];
  const walk = (node: SampleGenealogyNode, depth: number) => {
    rows.push({ node, depth });
    (node.children ?? []).forEach((child) => walk(child, depth + 1));
  };
  genealogy.value.children.forEach((child) => walk(child, 0));
  return rows;
});

const fetchGenealogy = async () => {
  if (!sample?.value?.uid) return;
  genealogyLoading.value = true;
  genealogyError.value = null;
  withClientQuery<GetSampleGenealogyQuery, GetSampleGenealogyQueryVariables>(
    GetSampleGenealogyDocument,
    {
      sampleUid: sample?.value?.uid,
      depth: 6,
      includeTests: false,
      includeExtraRelationships: true,
    },
    "sampleGenealogy"
  )
    .then((result) => {
      genealogy.value = result ?? null;
    })
    .catch((error) => {
      genealogyError.value = error?.message ?? "Failed to load genealogy.";
    })
    .finally(() => {
      genealogyLoading.value = false;
    });
};

const openGenealogyModal = async () => {
  showGenealogyModal.value = true;
  await fetchGenealogy();
};

const showDeriveModal = ref(false);
const deriveSelection = ref<SampleType[]>([]);

const openDeriveModal = () => {
  if (!sample?.value) return;
  deriveSelection.value = [sample.value];
  showDeriveModal.value = true;
  state.dropdownOpen = false;
};

const closeDeriveModal = () => {
  showDeriveModal.value = false;
  deriveSelection.value = [];
};

const handleDerived = (derivedSamples: SampleType[]) => {
  if (!derivedSamples?.length) return;
  sampleStore.addSampleClones(derivedSamples);
};

// Status badge styling
function getStatusBadgeClass(status?: string | null): string {
  const s = status?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    expected: "bg-warning/15 text-warning border border-warning/30",
    received: "bg-info/15 text-info border border-info/30",
    awaiting: "bg-muted text-muted-foreground border border-border",
    paired: "bg-accent/15 text-accent border border-accent/30",
    approved: "bg-success/15 text-success border border-success/30",
    published: "bg-primary/15 text-primary border border-primary/30",
    cancelled: "bg-muted text-muted-foreground border border-border",
    rejected: "bg-destructive/15 text-destructive border border-destructive/30",
    stored: "bg-secondary text-secondary-foreground border border-border",
    invalidated: "bg-warning/15 text-warning border border-warning/30",
  };
  return map[s] ?? "bg-muted text-muted-foreground border border-border";
}

function formatStatusLabel(status?: string | null): string {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-semibold text-foreground">Sample Detail</h3>
      <div class="flex items-center space-x-4">
        <button 
          class="px-4 py-2 bg-background border border-border text-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
          @click="printBarCooe"
        >
          <span class="flex items-center">
            Barcode
            <font-awesome-icon icon="barcode" class="ml-2" />
          </span>
        </button>
        <router-link 
          v-if="sample?.analysisRequest?.patient?.uid" 
          :to="{
            name: 'patient-detail',
            params: { patientUid: sample?.analysisRequest?.patient?.uid },
          }"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          ... other samples
        </router-link>
        <button
          v-if="sample?.uid"
          class="px-4 py-2 bg-background border border-border text-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
          @click="openGenealogyModal"
        >
          View genealogy
        </button>
      </div>
    </div>

    <div class="bg-background rounded-lg shadow-sm p-6 space-y-6" v-motion-slide-right>
      <div v-if="fetchingSample" class="py-4 text-center">
        <fel-loader message="Fetching sample details ..." />
      </div>
      <div class="space-y-6" v-else>
        <!-- Summary Column -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span v-if="sample?.priority ?? 0 < 1" class="text-destructive">
              <font-awesome-icon icon="fa-star" />
            </span>
            <span class="text-lg font-semibold text-foreground">{{ sample?.sampleId }}</span>
            <span
              v-if="relationshipBadge(sample?.relationshipType)"
              class="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] italic font-semibold bg-muted text-foreground"
            >
              {{ relationshipBadge(sample?.relationshipType) }}
            </span>
            <span v-if="sample?.analysisRequest?.patient?.uid && repeatSample?.uid" class="flex items-center space-x-2">
              <font-awesome-icon icon="angle-double-right" />
                <router-link 
                  :to="{
                    name: 'sample-detail',
                    params: {
                      patientUid: sample?.analysisRequest?.patient?.uid,
                      sampleUid: repeatSample?.uid,
                    },
                  }"
                  class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {{ repeatSample?.sampleId }}
                </router-link>
              </span>
            </div>
            <span class="text-muted-foreground">{{ profileAnalysesText(sample?.profiles, sample?.analyses ?? []) }}</span>
            <div class="relative">
              <button
                type="button"
                @click="state.dropdownOpen = !state.dropdownOpen"
                :class="[
                  'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-medium transition-all duration-200',
                  'hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  getStatusBadgeClass(sample?.status)
                ]"
              >
                <span class="w-2 h-2 rounded-full shrink-0 bg-current opacity-60" aria-hidden="true"></span>
                {{ formatStatusLabel(sample?.status) }}
                <font-awesome-icon
                  icon="chevron-down"
                  :class="['text-xs transition-transform duration-200', state.dropdownOpen && 'rotate-180']"
                />
              </button>
              <div v-show="state.dropdownOpen" @click="state.dropdownOpen = false" class="fixed inset-0 h-full w-full z-10"></div>
              <Transition
                enter-active-class="transition ease-out duration-150"
                enter-from-class="opacity-0 scale-95 -translate-y-1"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95 -translate-y-1"
              >
                <div
                  v-show="state.dropdownOpen"
                  class="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-popover shadow-lg z-20 overflow-hidden"
                >
                  <div class="px-3 py-2.5 border-b border-border bg-muted/40">
                    <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                    <p class="text-sm font-semibold text-foreground">{{ formatStatusLabel(sample?.status) }}</p>
                  </div>
                  <div class="py-1.5">
                    <button
                      v-show="canReceive"
                      @click="receiveSample(); state.dropdownOpen = false"
                      class="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                    >
                      <font-awesome-icon icon="download" class="w-3.5 text-muted-foreground" />
                      Receive
                    </button>
                    <button
                      v-show="canVerify"
                      @click="verifySample(); state.dropdownOpen = false"
                      class="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                    >
                      <font-awesome-icon icon="check-circle" class="w-3.5 text-muted-foreground" />
                      Approve
                    </button>
                    <button
                      v-show="canReject"
                      @click="rejectSample(); state.dropdownOpen = false"
                      class="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center gap-2"
                    >
                      <font-awesome-icon icon="times-circle" class="w-3.5 text-muted-foreground" />
                      Reject
                    </button>
                    <button
                      v-show="canCancel"
                      @click="cancelSample(); state.dropdownOpen = false"
                      class="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center gap-2"
                    >
                      <font-awesome-icon icon="ban" class="w-3.5 text-muted-foreground" />
                      Cancel
                    </button>
                    <button
                      v-show="canReinstate"
                      @click="reInstateSample(); state.dropdownOpen = false"
                      class="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                    >
                      <font-awesome-icon icon="chevron-circle-left" class="w-3.5 text-muted-foreground" />
                      Reinstate
                    </button>
                    <button
                      v-show="canPublish"
                      @click="publishSample(); state.dropdownOpen = false"
                      class="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                    >
                      <font-awesome-icon icon="flag" class="w-3.5 text-muted-foreground" />
                      {{ publishText }}
                    </button>
                    <button
                      v-show="canInvalidate"
                      @click="invalidateSample(); state.dropdownOpen = false"
                      class="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                    >
                      <font-awesome-icon icon="times-circle" class="w-3.5 text-muted-foreground" />
                      Invalidate
                    </button>
                    <button
                      v-show="canRecover"
                      @click="recoverSample(); state.dropdownOpen = false"
                      class="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                    >
                      <font-awesome-icon icon="database" class="w-3.5 text-muted-foreground" />
                      Recover
                    </button>
                    <button
                      v-show="sample?.uid"
                      @click="openDeriveModal()"
                      class="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 border-t border-border mt-1 pt-1.5"
                    >
                      <font-awesome-icon icon="code-branch" class="w-3.5 text-muted-foreground" />
                      Derive
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-6">
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-sm font-medium text-foreground">Client Request ID</span>
                <span class="text-sm text-muted-foreground">{{ sample?.analysisRequest?.clientRequestId }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-foreground">Client</span>
                <span class="text-sm text-muted-foreground">{{ sample?.analysisRequest?.client?.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-foreground">Client Contact</span>
                <span class="text-sm text-muted-foreground">Sister in Charge</span>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-sm font-medium text-foreground">Sample Type</span>
                <span class="text-sm text-muted-foreground">{{ sample?.sampleType?.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-foreground">Date Sampled</span>
                <span class="text-sm text-muted-foreground">{{ parseDate(sample?.dateCollected, true) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-foreground">Date Registered</span>
                <span class="text-sm text-muted-foreground">{{ parseDate(sample?.createdAt, true) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-foreground">Date Received</span>
                <span class="text-sm text-muted-foreground">{{ parseDate(sample?.dateReceived, true) }}</span>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-sm font-medium text-foreground">Date Submitted</span>
                <span class="text-sm text-muted-foreground">{{ parseDate(sample?.dateSubmitted, true) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-foreground">Date Verified</span>
                <span class="text-sm text-muted-foreground">{{ parseDate(sample?.dateVerified, true) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-foreground">Date Published</span>
                <span class="text-sm text-muted-foreground">{{ parseDate(sample?.datePublished, true) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm font-medium text-foreground">Date Printed</span>
                <span class="text-sm text-muted-foreground">{{ parseDate(sample?.datePrinted, true) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div 
      v-show="sample?.status === 'stored'"
      class="bg-muted rounded-lg shadow-sm p-6"
    >
      <div class="flex items-center space-x-4">
        <span class="font-medium text-foreground">Storage:</span>
        <button 
          class="text-primary hover:text-primary/80 transition-colors"
          @click="goToStorage(sample)"
        >
          <span class="flex items-center space-x-2">
            <span>{{ sample?.storageContainer?.storageSection?.storageLocation?.storeRoom?.name }}</span>
            <span>&rsaquo;</span>
            <span>{{ sample?.storageContainer?.storageSection?.storageLocation?.name }}</span>
            <span>&rsaquo;</span>
            <span>{{ sample?.storageContainer?.storageSection?.name }}</span>
            <span>&rsaquo;</span>
            <span>{{ sample?.storageContainer?.name }}</span>
            <span>&rsaquo;</span>
            <span>{{ sample?.storageSlot }}</span>
          </span>
        </button>
      </div>
    </div>

    <div 
      v-show="sample?.status === 'rejected'"
      class="bg-destructive/10 text-destructive rounded-lg shadow-sm p-6"
    >
      <ul class="space-y-2">
        <li v-for="reason in sample?.rejectionReasons" :key="reason.uid">{{ reason.reason }}</li>
      </ul>
    </div>

    <fel-modal
      v-if="showGenealogyModal"
      @close="showGenealogyModal = false"
      :content-width="'w-3/4'"
    >
      <template #header>
        {{ sample?.sampleId ?? sample?.uid }} Genealogy
      </template>
      <template #body>
        <div class="space-y-4">
          <div v-if="genealogyLoading" class="py-6 text-center">
            <fel-loader message="Fetching genealogy ..." />
          </div>
          <div v-else-if="genealogyError" class="text-destructive">
            {{ genealogyError }}
          </div>
          <div v-else-if="!genealogyRows.length" class="text-muted-foreground">
            Sample has no genealogy.
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="row in genealogyRows"
              :key="row.node.sampleUid"
              class="flex items-center gap-2"
              :style="{ paddingLeft: `${row.depth * 1.25}rem` }"
            >
              <span class="font-medium text-foreground">
                {{ row.node.sampleId ?? row.node.sampleUid }}
              </span>
              <span v-if="row.node.relationshipType" class="text-xs text-muted-foreground">
                ({{ row.node.relationshipType }})
              </span>
            </div>
          </div>
        </div>
      </template>
    </fel-modal>

    <derive-samples-modal
      :show="showDeriveModal"
      :samples="deriveSelection"
      @close="closeDeriveModal"
      @derived="handleDerived"
    />

    <router-view />
  </div>
</template>
