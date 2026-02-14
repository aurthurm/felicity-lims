<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";
import useApiUtil  from "@/composables/api_util";
import { ResultMutationType } from "@/types/gql";
import { GetAnalysisResultMutationDocument, GetAnalysisResultMutationQuery, GetAnalysisResultMutationQueryVariables } from "@/graphql/operations/analyses.queries";

const BeakAuditLog = defineAsyncComponent(
  () => import("@/components/audit/BeakAuditLog.vue")
)
const BeakDataTable = defineAsyncComponent(
  () => import("@/components/ui/datatable/BeakDataTable.vue")
)
const props = defineProps(["analysisResultesultUid"]);

const { withClientQuery } = useApiUtil();

const mutations = ref<ResultMutationType[] | null>(null);

onMounted(async () => {
    await withClientQuery<GetAnalysisResultMutationQuery, GetAnalysisResultMutationQueryVariables>(GetAnalysisResultMutationDocument, { resultUid: props.analysisResultesultUid }, 'resultMutationByResultUid').then(
        payload => mutations.value = payload
    );
});

const columns = [
  {
    name: "Before",
    value: "before",
    sortable: false,
    hidden: false,
  },
  {
    name: "After",
    value: "after",
    sortable: false,
    hidden: false,
  },
  {
    name: "Mutation",
    value: "mutation",
    sortable: false,
    hidden: false,
  },
  {
    name: "Date",
    value: "date",
    sortable: false,
    hidden: false,
  },
]
</script>

<template>
    <div class="space-y-6">
        <div class="space-y-2">
            <h4 class="text-lg font-semibold text-foreground">Result Mutations</h4>
            <div class="h-px bg-border" />
        </div>
        
        <BeakDataTable 
            v-if="(mutations?.length ?? 0) > 0"
            :columns="columns"
            :data="mutations || []"
            :toggleColumns="false"
        />
        <p v-else class="text-sm text-muted-foreground">No Mutations for this result</p>
        
        <div class="space-y-2">
            <h4 class="text-lg font-semibold text-foreground">Result Audit Log</h4>
            <div class="h-px bg-border" />
        </div>
        
        <BeakAuditLog 
            targetType="analysis_result" 
            :targetUid="analysisResultesultUid" 
        />
    </div>
</template>
