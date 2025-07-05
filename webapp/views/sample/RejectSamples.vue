<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import { ProfileType, AnalysisType } from "@/types/gql";
import useSampleComposable from "@/composables/samples";
import { useAnalysisStore } from "@/stores/analysis";
import { useRouter } from "vue-router";
const router = useRouter();

const analysisStore = useAnalysisStore();
const { rejectSamples } = useSampleComposable();

const routerState = router.options.history.state;
const state = reactive({
  rejections: [] as any[],
});

const ss = JSON.parse(window.history.state.samples); // routerState.samples
let coll: any[] = [];
for (let ob of ss) {
  ob["reasons"] = [];
  ob["other"] = undefined;
  coll.push(ob);
}
state.rejections = coll;

onMounted(() => analysisStore.fetchRejectionReasons());

const profileAnalysesText = (
  profiles: ProfileType[],
  analyses: AnalysisType[]
) => {
  let names: string[] = [];
  profiles?.forEach((p) => names.push(p.name!));
  analyses?.forEach((a) => names.push(a.name!));
  return names.join(", ");
};

const cascadeCopy = (sample: any) => {
  state.rejections?.forEach((item) => {
    item.reasons = sample.reasons;
    item.other = sample.other;
  });
};

const rejectionReasons = computed(() => analysisStore.getRejectionReasons);
const rejectSamples_ = async () => {
  const toReject: any[] = [];
  state.rejections?.forEach((item) => {
    toReject.push({ uid: item?.uid, reasons: item?.reasons, other: item?.other });
  });
  await rejectSamples(toReject).then((done) => {
    if (toReject.length == 1 && routerState.back?.toString().includes("patient")) {
      router.push({ path: routerState.back.toString() });
    } else {
      router.push({ name: "samples-listing" });
    }
  });
};
</script>

<template>
  <div class="space-y-6">
    <h4 class="text-xl font-semibold text-foreground">Sample Rejection</h4>
    
    <div class="bg-background rounded-lg shadow-sm p-6 space-y-6">
      <div v-for="(sample, index) in state.rejections" :key="index" class="space-y-6">
        <div class="border-t border-border" v-if="index > 0" />
        
        <h2 class="text-lg font-semibold text-foreground">
          {{ sample?.sampleId }} &rarr; {{ sample?.status }}
        </h2>
        
        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-6 grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="font-medium text-foreground">Sample Type</span>
                <span class="text-muted-foreground">{{ sample?.sampleType?.name }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium text-foreground">Client Sample ID</span>
                <span class="text-muted-foreground">{{ sample?.analysisRequest?.clientRequestId }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium text-foreground">Analyses</span>
                <span class="text-muted-foreground">{{ profileAnalysesText(sample?.profiles, sample?.analyses) }}</span>
              </div>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="font-medium text-foreground">Patient</span>
                <span class="text-muted-foreground">
                  {{ sample?.analysisRequest?.patient?.firstName }}
                  {{ sample?.analysisRequest?.patient?.lastName }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium text-foreground">Client Patient ID</span>
                <span class="text-muted-foreground">{{ sample?.analysisRequest?.patient?.clientPatientId }}</span>
              </div>
            </div>
          </div>
          
          <div class="col-span-5">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-foreground">Rejection Reasons</span>
                  <select
                    name="reasons"
                    multiple
                    v-model="sample.reasons"
                    class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value=""></option>
                    <option
                      v-for="rejection in rejectionReasons"
                      :key="rejection.uid"
                      :value="rejection.uid"
                    >
                      {{ rejection.reason }}
                    </option>
                  </select>
                </label>
              </div>
              
              <div class="space-y-2">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-foreground">Other</span>
                  <input
                    type="text"
                    v-model="sample.other"
                    class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </label>
              </div>
            </div>
          </div>
          
          <div class="col-span-1 flex items-center justify-center">
            <button 
              v-show="index === 0" 
              @click="cascadeCopy(sample)"
              class="text-primary hover:text-primary/80 transition-colors"
            >
              <font-awesome-icon icon="level-down-alt" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        v-if="state.rejections?.length > 0"
        @click.prevent="rejectSamples_()"
        class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-destructive/50"
      >
        Reject Samples
      </button>
    </div>
  </div>
</template>
