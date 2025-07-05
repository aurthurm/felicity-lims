<script setup lang="ts">
import { useSampleStore } from "@/stores/sample";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent, onMounted, watch } from "vue";

const GenericResults = defineAsyncComponent(
  () => import("./GenericResults.vue")
)
const OrganismResults = defineAsyncComponent(
  () => import("./OrganismResults.vue")
)
const ASTResults = defineAsyncComponent(
  () => import("./ASTResults.vue")
)

const route = useRoute();
const sampleStore = useSampleStore();
const { sample, analysisResults, fetchingResults } = storeToRefs(sampleStore);
const genericResults = computed(() => analysisResults?.value?.filter(r => !["Organisms", "Antibiotic"].includes(r.analysis?.name ?? "")));
const organismResults = computed(() => analysisResults?.value?.filter(r => r.analysis?.name === "Organisms"));
const astResults = computed(() => analysisResults?.value?.filter(r => r.analysis?.name === "Antibiotic"));

onMounted(() => {
  sampleStore.fetchAnalysisResultsForSample(route.params.sampleUid as string)
});

watch(
  () => route.params.sampleUid,
  (sampleUid, prev) => {
    sampleStore.resetSample();
    sampleStore.fetchAnalysisResultsForSample(route.params.sampleUid as string);
  }
);
</script>

<template>
  <div class="space-y-6">
    <div v-if="sample" class="space-y-6">
      <!-- generic result -->
      <GenericResults 
        :sample="sample" 
        :analysisResults="genericResults" 
        :fetchingResults="fetchingResults" 
      />
      <!-- organism result -->
      <OrganismResults 
        v-if="organismResults.length > 0"
        :sample="sample" 
        :analysisResults="organismResults" 
      />
      <!-- antibiotic result -->
      <ASTResults 
        v-if="astResults.length > 0 || organismResults.length > 0"
        :sample="sample" 
        :organismAnalysisResults="organismResults" 
      />
    </div>
    <div v-else class="text-muted-foreground">No sample data</div>
  </div>
</template>