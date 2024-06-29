<script setup lang="ts">
import { onMounted, defineAsyncComponent, ref, computed } from "vue";
import { useApiUtil } from "@/composables";
import { GET_ANALYSES_SERVICE_BY_UID } from "@/graphql/operations/analyses.queries";
import { IAnalysisService } from "@/models/analysis";
const FelLabelValueList = defineAsyncComponent(
  () => import("@/components/ui/label/FelLabelValueList.vue")
)

const props = defineProps(["analysisUid"]);
const { withClientQuery } = useApiUtil();
const analysis = ref<IAnalysisService | null>(null);

onMounted(async () => {
    await withClientQuery(GET_ANALYSES_SERVICE_BY_UID, { uid: props.analysisUid }, 'analysisByUid').then(
        payload => analysis.value = payload
    );
});

const items = computed(() => {
    return [
        { label: 'Analysis Name', value: analysis.value?.name, link: {name: 'analyses-conf', query: {tab: 'analyses-services', item: analysis.value?.name }}  },
        { label: 'Analysis KeyWord', value: analysis.value?.keyword },
        { label: 'Analysis Unit', value: analysis.value?.unit?.name },
        { label: 'Analysis Category', value: analysis.value?.category?.name },
    ];
});
</script>

<template>
    <FelLabelValueList v-if="analysis?.uid" :items="items" />
</template>