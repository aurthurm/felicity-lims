<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, reactive, watch } from "vue";
import { ProfileType, AnalysisType, SampleType } from "@/types/gql";
import useSampleComposable from "@/composables/samples";
import { useSampleStore } from "@/stores/sample";
import { useRoute, useRouter } from "vue-router";
import { parseDate } from "@/utils";

const sampleStore = useSampleStore();
const route = useRoute();
const router = useRouter();

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
              <div 
                @click="state.dropdownOpen = !state.dropdownOpen"
                class="flex items-center space-x-2 cursor-pointer"
              >
                <button 
                  type="button" 
                  class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {{ sample?.status }}
                </button>
                <font-awesome-icon icon="chevron-down" class="text-muted-foreground" />
              </div>
              <div v-show="state.dropdownOpen" @click="state.dropdownOpen = false" class="fixed inset-0 h-full w-full z-10"></div>
              <div 
                v-show="state.dropdownOpen" 
                class="absolute right-0 mt-2 py-2 bg-background rounded-lg shadow-lg border border-border z-20 min-w-[200px]"
              >
                <button 
                  v-show="canReceive" 
                  @click="receiveSample()"
                  class="w-full px-4 py-2 text-left text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  Receive
                </button>
                <button 
                  v-show="canVerify" 
                  @click="verifySample()"
                  class="w-full px-4 py-2 text-left text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  Approve
                </button>
                <button 
                  v-show="canReject" 
                  @click="rejectSample()"
                  class="w-full px-4 py-2 text-left text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                >
                  Reject
                </button>
                <button 
                  v-show="canCancel" 
                  @click="cancelSample()"
                  class="w-full px-4 py-2 text-left text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  v-show="canReinstate" 
                  @click="reInstateSample()"
                  class="w-full px-4 py-2 text-left text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
                >
                  Reinstate
                </button>
                <button 
                  v-show="canPublish" 
                  @click="publishSample()"
                  class="w-full px-4 py-2 text-left text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  {{ publishText }}
                </button>
                <button 
                  v-show="canInvalidate" 
                  @click="invalidateSample()"
                  class="w-full px-4 py-2 text-left text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  Invalidate
                </button>
                <button 
                  v-show="canRecover" 
                  @click="recoverSample()"
                  class="w-full px-4 py-2 text-left text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  Recover
                </button>
              </div>
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

    <router-view />
  </div>
</template>
