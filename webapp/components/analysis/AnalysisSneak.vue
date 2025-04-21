<script setup lang="ts">
import { onMounted, defineAsyncComponent, ref, computed } from "vue";
import useApiUtil from "@/composables/api_util";
import { AnalysisType } from "@/types/gql";
import { GetAnalysesServicesByUidDocument, GetAnalysesServicesByUidQuery, GetAnalysesServicesByUidQueryVariables } from "@/graphql/operations/analyses.queries";

const FelLabelValueList = defineAsyncComponent(
  () => import("@/components/ui/label/FelLabelValueList.vue")
);

interface Props {
  analysisUid: string;
}

interface AnalysisItem {
  label: string;
  value: string;
  link?: {
    name: string;
    query: {
      tab: string;
      item: string;
    };
  };
}

const props = defineProps<Props>();
const { withClientQuery } = useApiUtil();
const analysis = ref<AnalysisType | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    isLoading.value = true;
    const result = await withClientQuery<GetAnalysesServicesByUidQuery, GetAnalysesServicesByUidQueryVariables>(
      GetAnalysesServicesByUidDocument, 
      { uid: props.analysisUid }, 
      'analysisByUid'
    );
    
    if (result) {
      analysis.value = result as unknown as AnalysisType;
    }
    
    isLoading.value = false;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load analysis data';
    isLoading.value = false;
  }
});

const items = computed<AnalysisItem[]>(() => {
  if (!analysis.value) return [];
  
  return [
    { 
      label: 'Analysis Name', 
      value: analysis.value.name || '', 
      link: {
        name: 'analyses-conf', 
        query: {
          tab: 'analyses-services', 
          item: analysis.value.name || ''
        }
      }
    },
    { label: 'Analysis KeyWord', value: analysis.value.keyword || '' },
    { label: 'Analysis Unit', value: analysis.value.unit?.name || '' },
    { label: 'Analysis Category', value: analysis.value.category?.name || '' },
  ];
});
</script>

<template>
  <div class="w-full" role="region" aria-label="Analysis details">
    <div v-if="isLoading" class="flex justify-center items-center py-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" aria-hidden="true"></div>
      <span class="sr-only">Loading analysis data...</span>
    </div>
    
    <div v-else-if="error" class="text-destructive text-sm py-2" role="alert">
      {{ error }}
    </div>
    
    <FelLabelValueList 
      v-else-if="analysis?.uid" 
      :items="items" 
      class="bg-card rounded-md border border-border p-4 shadow-sm"
    />
    
    <div v-else class="text-muted-foreground text-sm py-2">
      No analysis data available
    </div>
  </div>
</template>